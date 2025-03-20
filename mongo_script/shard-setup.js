sh.addShard("shard1ReplSet/mongo_shard1-1:27018");
sh.addShard("shard1ReplSet/mongo_shard2-1:27018");
sh.enableSharding("test");
sh.shardCollection("test.users", { userId: "hashed" });