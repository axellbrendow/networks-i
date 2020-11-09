const crypto = require("crypto");

module.exports.createNewId = () => crypto.randomBytes(16).toString("hex");

/**
 * @param {number} msDelay
 */
module.exports.delay = msDelay =>
  new Promise((resolve, reject) => setTimeout(resolve, msDelay));
