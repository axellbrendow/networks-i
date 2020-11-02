// -------------------- udp client ----------------

const udp = require("dgram");

// creating a client socket
module.exports.client = udp.createSocket("udp4");

module.exports.serverHost = process.argv[2] || "localhost";
module.exports.serverPort = parseInt(process.argv[3]) || 2222;
