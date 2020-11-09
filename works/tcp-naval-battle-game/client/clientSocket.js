const net = require("net");

const client = new net.Socket();

module.exports.client = client;
module.exports.serverHost = process.argv[2] || "localhost";
module.exports.serverPort = parseInt(process.argv[3]) || 1337;
