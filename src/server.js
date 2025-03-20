const express = require("express");
require('dotenv').config();

//* process internal network
const PORT = process.env.PORT || 3001;
const hostname = "localhost";

const app = express();

//* Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json("hello " + PORT);
});

// //* db connection
// const connectDB = require('./db');
// connectDB();

// //* users route
// const userRoute = require("./routes/userRoute");
// app.use("user", userRoute);

app.listen(PORT, () => console.log(`Server running on https://${hostname}:${PORT}`));
