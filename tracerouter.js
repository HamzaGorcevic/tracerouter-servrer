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

module.exports = {
    getListOfHops,
};
