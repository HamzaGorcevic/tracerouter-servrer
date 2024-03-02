const { exec } = require("child_process");

function getListOfHops(destination) {
    return new Promise((resolve, reject) => {
        exec(`tracert ${destination}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            // Parse the output of traceroute
            const lines = stdout.split("\n");

            const hops = lines
                .slice(4, -1) // Start from the 5th line and exclude the last line
                .map((line) => {
                    const parts = line.trim().split("  ");
                    const hop = parseInt(parts[0], 10);
                    let address = parts[parts.length - 1];

                    if (address.length > 20) {
                        const regex = /\[([^\]]+)\]/;
                        const match = address.match(regex);
                        address = match[1];
                    }
                    console.log("parts: ", parts, "address:", address);

                    const rttValues = parts
                        .slice(1, -1)
                        .map((value) => {
                            if (value === "*") {
                            } else {
                                return value;
                            }
                        })
                        .filter((value) => value !== undefined);
                    console.log("rttValues", rttValues);
                    return {
                        hop,
                        ip: address,
                        rtt1: rttValues[0] || null,
                        rtt2: rttValues[1] || null,
                        rtt3: rttValues[2] || null,

                        // Add more RTT properties as needed
                    };
                });

            console.log("HOPS: ", hops);

            resolve(hops);
        });
    });
}

module.exports = {
    getListOfHops,
};
