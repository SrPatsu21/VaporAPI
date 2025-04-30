#!/bin/bash

# Wait for the config server replica set to elect a primary
echo "Waiting for config server replica set to elect a primary..."
until mongosh --host rs-config-server/configdb-replica0:27017,configdb-replica1:27017,configdb-replica2:27017 --eval 'rs.status().members.some(m => m.stateStr === "PRIMARY")' | grep -q 'true'; do
    sleep 5
done

# Wait for each shard's replica set to elect a primary
for shard in 0 1; do
    replica_set="rs-shard-${shard}"
    host_prefix="shard${shard}-replica"
    echo "Waiting for ${replica_set} to elect a primary..."
    until mongosh --host ${replica_set}/${host_prefix}0:27017,${host_prefix}1:27017,${host_prefix}2:27017 --eval 'rs.status().members.some(m => m.stateStr === "PRIMARY")' | grep -q 'true'; do
        sleep 5
    done
done

# Start mongos in the background
echo "Starting mongos..."
mongos --port 27017 --configdb rs-config-server/configdb-replica0:27017,configdb-replica1:27017,configdb-replica2:27017 --bind_ip_all &

# Wait for mongos to become available
echo "Waiting for mongos to start..."
until mongosh --port 27017 --eval 'db.adminCommand({ping: 1})' &> /dev/null; do
    sleep 5
done

# Add the shards using the provided commands
echo "Adding shards..."
mongosh --port 27017 <<EOF
sh.addShard("rs-shard-0/shard0-replica0:27017")
sh.addShard("rs-shard-0/shard0-replica1:27017")
sh.addShard("rs-shard-1/shard1-replica2:27017")
sh.addShard("rs-shard-1/shard1-replica0:27017")
sh.addShard("rs-shard-1/shard1-replica1:27017")
sh.addShard("rs-shard-1/shard1-replica2:27017")
EOF

# Keep the mongos process running in the foreground
wait