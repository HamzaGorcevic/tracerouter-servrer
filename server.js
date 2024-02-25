const ping = require("ping");
const cors = require("cors");
const axios = require("axios");
const express = require("express");
const tracerouter = require("./tracerouter");
const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 8080;
const ipAddress = "0.0.0.0";

app.use(express.static(__dirname));
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// app.get("/ping", async (req, res) => {
//     res.send("PIng");

//     const host = req.query.url || "www.novipazar.com";

//     const options = {
//         timeout: 20,
//     };

//     try {
//         const resultLatency = await ping.promise.probe(host, options);
//         res.json(resultLatency);
//     } catch (error) {
//         res.status(500).json({ error: "Error during traceroute" });
//     }
// });

//
app.post("/traceroute", async (req, res) => {
    const { destination } = req.body;
    console.log(destination);
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
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
