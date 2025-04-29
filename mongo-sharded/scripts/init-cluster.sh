#!/usr/bin/env bash
set -ex

function initiate_replica_set() {
    local host="$1"
    local config="$2"
    if mongosh --quiet --host "$host" --eval 'rs.status().ok' | grep -q "1"; then
        echo "Replica Set on $host already initialized."
    else
        echo "Initializing Replica Set on $host..."
        mongosh --quiet --host "$host" --eval "$config"
    fi
}

function wait_for_primary() {
    local host="$1"
    until mongosh --quiet --host "$host" --eval 'db.adminCommand({ isMaster: 1 }).ismaster' | grep -q "true"; do
        printf "."; sleep 2
    done
    echo "$host PRIMARY is ready!"
}

function add_shard_if_not_exists() {
    local shard_name="$1"
    local shard_hosts="$2"

    if mongosh --quiet --host mongos-router0:27017 --eval \
        "db.adminCommand({ listShards: 1 }).shards.map(s => s._id).includes(\"${shard_name}\")" | grep -q "true"; then
        echo "Shard $shard_name already exists, skipping."
        return
    fi

    echo "Adding shard $shard_name..."
    mongosh --quiet --host mongos-router0:27017 --eval \
        "sh.addShard(\"${shard_name}/${shard_hosts}\")" || {
        echo "Warning: Failed to add shard ${shard_name}. Continuing anyway."
    }
}

# 1. Config servers
initiate_replica_set "configdb-replica0:27017" '
    rs.initiate({
        _id: "config-rs", configsvr: true,
        members: [
            { _id: 0, host: "configdb-replica0:27017" },
            { _id: 1, host: "configdb-replica1:27017", votes: 0, priority: 0 },
            { _id: 2, host: "configdb-replica2:27017", votes: 0, priority: 0 }
        ]
    });
'
wait_for_primary "configdb-replica0:27017"

# 2. Wait for mongos to be available
echo "Waiting for mongos-router0 to be available..."
until mongosh --quiet --host mongos-router0:27017 --eval 'db.adminCommand({ ping: 1 })' &>/dev/null; do
    echo "Waiting for mongos-router0..."
    sleep 2
done
echo "mongos-router0 is available!"

# 3. Check if the cluster is already initialized
if mongosh --quiet --host mongos-router0:27017 --eval \
    '!!(sh.status().shards || []).length' | grep -q "true"; then
    echo "Cluster already initialized. Exiting..."
    exit 0
fi

# 4. Shards
initiate_replica_set "shard0-replica0:27017" '
    rs.initiate({
        _id: "shard0-rs",
        members: [
            { _id: 0, host: "shard0-replica0:27017" },
            { _id: 1, host: "shard0-replica1:27017", votes: 0, priority: 0 }
        ]
    });
'
wait_for_primary "shard0-replica0:27017"

initiate_replica_set "shard1-replica0:27017" '
    rs.initiate({
        _id: "shard1-rs",
        members: [
            { _id: 0, host: "shard1-replica0:27017" },
            { _id: 1, host: "shard1-replica1:27017", votes: 0, priority: 0 }
        ]
    });
'
wait_for_primary "shard1-replica0:27017"

# 5. Add shards if needed
echo "Adding shards to mongos..."

add_shard_if_not_exists "shard0-rs" "shard0-replica0:27017,shard0-replica1:27017"
add_shard_if_not_exists "shard1-rs" "shard1-replica0:27017,shard1-replica1:27017"

echo "Sharded cluster initialized successfully!"
