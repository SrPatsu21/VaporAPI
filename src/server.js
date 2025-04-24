const express = require("express");
require('dotenv').config();
const cluster = require("cluster");
const os = require("os");

//* Process internal network
const PORT = process.env.PORT || 3001;
const hostname = "localhost";
// const numCPUs = os.cpus().length;
const numCPUs = 1;

//* DB
const connectDB = require('./db');

//* Cluster master setup
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running. Will create ` + numCPUs + ` works`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for dying workers and replace
    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Spawning a new one...`);
        cluster.fork();
    });

} else {
//* Worker process runs the Express app
    const app = express();

    app.set("trust proxy", true);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    connectDB();

//* routes:

    //* v1
    const routerv1 = require("./routes/v1/router")
    app.use("/api/v1", routerv1);

//* Run
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} running at https://${hostname}:${PORT}`);
    });
}