const ping = require("ping");
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const tracerouter = require("./tracerouter");

const app = express();
const port = process.env.PORT || 8080;
const ipAddress = "0.0.0.0";

// Set middleware of CORS
app.use(cors()); // Enable CORS for all routes
app.use(express.static(__dirname));
app.use(express.json());

// Set CORS headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Private-Network", true);
    res.setHeader("Access-Control-Max-Age", 7200); // Set max age for preflight requests
    next();
});

// Define your routes
app.post("/traceroute", async (req, res) => {
    const { destination } = req.body;
    console.log("destination:", destination);
    try {
        const hops = await tracerouter.getListOfHops(destination);
        res.json(hops);
    } catch (error) {
        console.error("Error during traceroute:", error);
        res.status(500).json({ error: "Error during traceroute" });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to CORS server 😁");
});

app.listen(port, ipAddress, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
