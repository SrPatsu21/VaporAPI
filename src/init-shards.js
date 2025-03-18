var shard1RS = {
    _id: "shard1ReplSet",
    members: [
        { _id: 0, host: "shard1-1:27018" },
        { _id: 1, host: "shard1-2:27018" }
    ]
};
rs.initiate(shard1RS);

var shard2RS = {
    _id: "shard2ReplSet",
    members: [
        { _id: 0, host: "shard2-1:27018" },
        { _id: 1, host: "shard2-2:27018" }
    ]
};
rs.initiate(shard2RS);
