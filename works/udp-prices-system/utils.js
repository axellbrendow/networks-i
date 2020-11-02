const crypto = require("crypto");

module.exports.createNewId = () => crypto.randomBytes(16).toString("hex");
