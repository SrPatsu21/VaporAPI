var shard1RS = {
    _id: "shard1ReplSet",
    members: [
        { _id: 0, host: "mongo_shard1-1:27018" },
        { _id: 1, host: "mongo_shard1-2:27018" }
    ]
};
rs.initiate(shard1RS);
sleep(10000);

var shard2RS = {
    _id: "shard2ReplSet",
    members: [
        { _id: 0, host: "mongo_shard2-1:27018" },
        { _id: 1, host: "mongo_shard2-2:27018" }
    ]
};
rs.initiate(shard2RS);
sleep(10000);