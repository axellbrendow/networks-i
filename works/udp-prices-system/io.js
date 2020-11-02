const readline = require("readline");

const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * @param {string} message
 *
 * @returns {Promise<String>}
 */
const question = message =>
  new Promise((resolve, reject) => {
    readlineInterface.question(message, resolve);
  });

module.exports = { readlineInterface, question };
