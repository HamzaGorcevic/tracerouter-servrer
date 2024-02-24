const express = require("express");
const ping = require("ping");
const cors = require("cors");
const axios = require("axios");

const { exec } = require("child_process");

const app = express();
const port = 8080;

app.use(express.static(__dirname));
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

        const results = await Promise.all(
            hops.map(async (item) => {
                try {
                    const response = await axios.get(
                        `http://ip-api.com/json/${item.ip}`
                    );
                    return response.data;
                } catch (error) {
                    console.error("Error fetching IP information:", error);
                    return {}; // Return empty object for the failed hop
                }
            })
        );

        res.json(results);
    } catch (error) {
        console.error("Error during traceroute:", error);
        res.status(500).json({ error: "error" });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
