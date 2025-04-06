const express = require("express");
require('dotenv').config();

//* process internal network
const PORT = process.env.PORT || 3001;
const hostname = "localhost";

const app = express();

//* proxy
app.set("trust proxy", true);

//* Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* db connection
const connectDB = require('./db');
connectDB();

//* routes
// users route
const userRoute = require("./routes/userRoute");
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server running on https://${hostname}:${PORT}`));
