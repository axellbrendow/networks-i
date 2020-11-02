const { readPriceForInsertion, readPriceForSearch } = require("./input");
const { question, readlineInterface } = require("./io");
const { Messages } = require("./clientMessages");
const { Observers } = require("./Observers");
const { client } = require("./clientSocket");

const observers = new Observers();
const messages = new Messages(client, observers);

// emits on new datagram
client.on("message", (msg, info) => {
  console.log(`Received ${msg.length} bytes from ${info.address}:${info.port}`);

  const message = JSON.parse(msg.toString());

  console.log("Message received:", message);

  observers.runObservers(message, info);
});

(async () => {
  console.log("---- Seja bem vindo(a) ao Sistema de Preços ----");
  console.log();
  let operation;

  while (operation !== "S") {
    operation = await question(`Digite:
S para Sair
D para inserir um novo preço
P para pesquisar preços

: `);
    console.log();
    operation = operation.toUpperCase();

    switch (operation) {
      case "D":
        messages.addPrice(await readPriceForInsertion());
        break;
      case "P":
        messages.getLowestPrice(await readPriceForSearch());
        break;
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 500));
  }

  readlineInterface.close();
  process.exit(0);
})();
