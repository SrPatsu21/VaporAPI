#!/usr/bin/env bash
set -e

DB="${DB_NAME}"
USER="${DB_USER}"
PASS="${DB_PASS}"
CONFIG="${SHARD_CONFIG}"

# Wait until MongoDB is available
until mongosh --host configdb-replica0:27017 --quiet --eval 'db.adminCommand({ ping: 1 })' &>/dev/null; do
    echo "Waiting for MongoDB to start..."
    sleep 2
done
echo "MongoDB is available!"

# if already config
USER_EXISTS=$(mongosh --host mongos-router0:27017 --quiet --eval "db.getSiblingDB('${DB}').getUser('${USER}') !== null")

if [ "$USER_EXISTS" = "true" ]; then
    echo "User already exist. ending..."
    exit 0
fi

# 1. Create user only if it does not exist
echo "Checking if user ${USER} exists..."
USER_EXISTS=$(mongosh --host configdb-replica0:27017 --quiet --eval "db.getSiblingDB('${DB}').getUser('${USER}') != null")
if [ "$USER_EXISTS" = "false" ]; then
    echo "Creating user ${USER} in DB ${DB}..."
    mongosh --host configdb-replica0:27017 admin --eval "
        db.getSiblingDB('${DB}').createUser({
            user: '${USER}',
            pwd: '${PASS}',
            roles: [{ role: 'readWrite', db: '${DB}' }]
        });
    "
else
    echo "User ${USER} already exists. Skipping creation."
fi

# 2. Connect to mongos to enable sharding
echo "Checking registered shards on mongos..."
SHARDS_COUNT=$(mongosh --host mongos-router0:27017 --quiet --eval "db.adminCommand({ listShards: 1 }).shards.length")

if [ "$SHARDS_COUNT" -eq 0 ]; then
    echo "Error: No shards added to the cluster. Cannot enable sharding on database ${DB}."
    exit 1
fi

echo "Enabling sharding on DB ${DB} and starting balancer..."
mongosh --host mongos-router0:27017 --quiet --eval "
    sh.enableSharding('${DB}');
    sh.setBalancerState(true);
"

# 3. Shard collections according to SHARD_CONFIG
IFS=',' read -ra ITEMS <<< "${CONFIG}"
for ITEM in "${ITEMS[@]}"; do
    IFS=':' read -r COLL KEY MODE <<< "${ITEM}"
    echo "ShardCollection ${DB}.${COLL} with key ${KEY} (${MODE})..."
    if [ "${MODE}" = "hashed" ]; then
        mongosh --host mongos-router0:27017 --quiet --eval "sh.shardCollection('${DB}.${COLL}', { ${KEY}: 'hashed' });"
    else
        mongosh --host mongos-router0:27017 --quiet --eval "sh.shardCollection('${DB}.${COLL}', { ${KEY}: 1 });"
    fi
done

echo "Database initialization completed!"