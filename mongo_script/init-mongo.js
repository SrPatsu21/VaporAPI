rs.initiate({
    _id: "configReplSet",
    configsvr: true,
    members: [
        { _id: 0, host: "mongo_config1:27019" },
        { _id: 1, host: "mongo_config2:27019" },
        { _id: 2, host: "mongo_config3:27019" }
    ]
});
sleep(10000);