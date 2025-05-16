const express = require("express");
require("dotenv").config();
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");
const http = require("http");
const https = require("https");
const rateLimit = require("express-rate-limit");
const timeout = require("connect-timeout");
const forge = require('node-forge');

//* Settings
const HTTPS_PORT = process.env.PORT || 443;
const HTTP_PORT = 80;
const hostname = "localhost";
const numCPUs = 1; // 1 or os.cpus().length for full usage

//* DB
const connectDB = require("./db");

//* SSL Certificates (use real certs in production)
const certPath = __dirname + '/../certs/fullchain.pem';
const keyPath = __dirname + '/../certs/privkey.pem';

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
    console.log('🔐 SSL certs not found. Generating new self-signed certificates...');
    generateSelfSignedCert();
} else {
    console.log('🔐 SSL certs already exist. Skipping generation.');
}

httpsOptions = {
    key: fs.readFileSync(__dirname + "/../certs/privkey.pem"),
    cert: fs.readFileSync(__dirname + "/../certs/fullchain.pem"),
};


//* Cluster setup
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running. Creating ${numCPUs} workers...`);

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

    const app = express();

    //* Rate Limiting
    const apiLimiter = rateLimit({
        windowMs: 1000, // 1 second
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
    });
    app.use(apiLimiter);

    //* Block Bots
    app.use((req, res, next) => {
        const ua = req.headers["user-agent"];
        if (/bot|crawler|spider|curl|wget/i.test(ua)) {
            return res.status(403).send("Forbidden");
        }
        next();
    });

    //* Timeout handling
    app.use(timeout("10s"));
    app.use((req, res, next) => {
        if (!req.timedout) next();
    });

    //* Body size limits
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    //* DB connection
    connectDB();

//* routes:

    //* v1
    const routerv1 = require("./routes/v1/router");
    app.use("/api/v1", routerv1);


    //* docs
    const swaggerDocs = require('./utils/swagger');
    swaggerDocs(app);


    // 🔥 Only bind to process.env.PORT (Render expects this)
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} running on port ${PORT}`);
    });
}

function generateSelfSignedCert() {
    const pki = forge.pki;

    const keys = pki.rsa.generateKeyPair(2048);
    const cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [{ name: 'commonName', value: 'localhost' }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);

    cert.sign(keys.privateKey, forge.md.sha256.create());

    const certPem = pki.certificateToPem(cert);
    const keyPem = pki.privateKeyToPem(keys.privateKey);

    const dir = __dirname + '/../certs';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    fs.writeFileSync(`${dir}/fullchain.pem`, certPem);
    fs.writeFileSync(`${dir}/privkey.pem`, keyPem);

    console.log('✅ Self-signed certificate generated successfully!');
}