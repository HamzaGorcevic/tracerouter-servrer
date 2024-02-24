const ping = require("ping");
const cors = require("cors");
const axios = require("axios");
const express = require("express");

const { exec } = require("child_process");

const app = express();
const port = process.env.PORT || 8080;
const ipAddress = "0.0.0.0";

app.use(express.static(__dirname));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(cors()); // Enable CORS for all routes

const Traceroute = require("nodejs-traceroute");

function getListOfHops(destination) {
    return new Promise((resolve, reject) => {
        const tracer = new Traceroute();
        const hops = [];

        tracer.on("hop", (hop) => {
            console.log(hop);
            hops.push(hop);
        });

        tracer.on("close", () => {
            resolve(hops);
        });

        tracer.on("error", (err) => {
            reject(err);
        });

        tracer.on("end", () => {
            // Traceroute has ended, resolve with the array of hops
            resolve(hops);
        });

        tracer.trace(destination);
    });
}

app.get("/ping", async (req, res) => {
    res.send("PIng");

    const host = req.query.url || "www.novipazar.com";

    const options = {
        timeout: 20,
    };

    try {
        const resultLatency = await ping.promise.probe(host, options);
        res.json(resultLatency);
    } catch (error) {
        res.status(500).json({ error: "Error during traceroute" });
    }
});

//
app.get("/traceroute", async (req, res) => {
    const host = req.query.url;
    console.log(host);

    try {
        let hops = await getListOfHops(host);

        hops.unshift({ ip: "" });
        console.log(hops);

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(hops);
    } catch (error) {
        console.error("Error during traceroute:", error);
        res.status(500).json({ error: "error" });
    }
});

app.get("/", (req, res) => {
    res.send("Welcome to CORS server 😁");
});

app.get("/cors", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.send({ msg: "This has CORS enabled 🎈" });
});

app.listen(port, ipAddress, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
