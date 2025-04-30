// init-cluster.js

// Switch to the target database
use("VaporBase");

// Create an API user
db.createUser({
    user: "api_user",
    pwd: "strong_password",
    roles: [{ role: "readWrite", db: "VaporBase" }]
});

// Enable sharding for the database
sh.enableSharding("VaporBase");

// Enable the balancer
sh.setBalancerState(true);

// Shard collections
sh.shardCollection("VaporBase.Users", { _id: "hashed" });
sh.shardCollection("VaporBase.Categories", { _id: "hashed" });
sh.shardCollection("VaporBase.Products", { _id: "hashed" });
sh.shardCollection("VaporBase.Tags", { _id: "hashed" });
sh.shardCollection("VaporBase.Titles", { t_id: "hashed" });
