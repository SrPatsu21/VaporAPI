// Step 1: Initialize the Config Replica Set
var configConn = new Mongo("mongo_config1:27017");
var configDB = configConn.getDB("admin");
configDB.runCommand({
    replSetInitiate: {
        _id: "configReplSet",
        configsvr: true,
        members: [
            { _id: 0, host: "mongo_config1:27017" },
            { _id: 1, host: "mongo_config2:27017" },
            { _id: 2, host: "mongo_config3:27017" }
        ]
    }
});
print("Config Replica Set Initialized.");

// Wait for the replica set to be fully operational
sleep(10000);

// Step 2: Initialize Shard 1 Replica Set
var shard1Conn = new Mongo("mongo_shard1-1:27017");
var shard1DB = shard1Conn.getDB("admin");
shard1DB.runCommand({
    replSetInitiate: {
        _id: "shard1ReplSet",
        members: [
            { _id: 0, host: "mongo_shard1-1:27017" },
            { _id: 1, host: "mongo_shard1-2:27017" }
        ]
    }
});
print("Shard 1 Replica Set Initialized.");

// Wait for the replica set to be fully operational
sleep(10000);

// Step 3: Initialize Shard 2 Replica Set
var shard2Conn = new Mongo("mongo_shard2-1:27017");
var shard2DB = shard2Conn.getDB("admin");
shard2DB.runCommand({
    replSetInitiate: {
        _id: "shard2ReplSet",
        members: [
            { _id: 0, host: "mongo_shard2-1:27017" },
            { _id: 1, host: "mongo_shard2-2:27017" }
        ]
    }
});
print("Shard 2 Replica Set Initialized.");

// Wait for the replica set to be fully operational
sleep(10000);

// Step 4: Add Shards to the Cluster

// Connect to mongos router
var mongosConn = new Mongo("mongos_router:27017");
var mongosDB = mongosConn.getDB("admin");

// Add Shard 1
mongosDB.runCommand({ addShard: "shard1ReplSet/mongo_shard1-1:27017,mongo_shard1-2:27017" });
print("Shard 1 added to cluster.");

// Add Shard 2
mongosDB.runCommand({ addShard: "shard2ReplSet/mongo_shard2-1:27017,mongo_shard2-2:27017" });
print("Shard 2 added to cluster.");

// Final message
print("Shards successfully added to the cluster.");
