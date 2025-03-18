sh.addShard("shard1ReplSet/shard1-1:27018");
sh.addShard("shard2ReplSet/shard2-1:27018");
sh.enableSharding("myDatabase");
sh.shardCollection("myDatabase.users", { userId: "hashed" });
