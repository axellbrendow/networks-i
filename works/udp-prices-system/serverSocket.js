// -------------------- udp server ----------------

const udp = require("dgram");

// creating a server socket
module.exports.server = udp.createSocket("udp4");

module.exports.serverPort = parseInt(process.argv[2]) || 2222;
