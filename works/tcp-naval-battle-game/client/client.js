const { getInitialBoard } = require("./input");
const { question, readlineInterface } = require("./io");
const { client, serverHost, serverPort } = require("./clientSocket");
const Messages = require("./Messages");
const Observers = require("./Observers");
const ClientMatch = require("./ClientMatch");

const { Message, Match } = require("../shared");
const { delay } = require("../utils");

const observers = new Observers();
const messages = new Messages(client, observers);

client.connect(serverPort, serverHost, () => {
  // console.log("Connected");
});

client.on("data", msg => {
  const message = JSON.parse(msg.toString());

  // console.log(`Message received (${new Date().toLocaleString()}):`, message);

  observers.runObservers(message, messages);
});

client.on("close", () => {
  console.log("Connection closed");
});

(async () => {
  console.log("---- Seja bem vindo(a) ao jogo Batalha Naval ----");
  console.log();
  let operation;

  while (operation !== "S") {
    operation = await question(`Digite:
S para Sair
C para começar uma nova partida

: `);
    console.log();
    operation = operation.toUpperCase();

    switch (operation) {
      case "C":
        const response = await messages.sendMessage(
          null,
          Message.MsgType.CREATE_MATCH,
          null
        );

        let player1Board = await getInitialBoard();
        const player2Board = response.data.player2Board;

        player1Board = (
          await messages.sendMessage(null, Message.MsgType.SET_BOARD, {
            board: player1Board,
            matchId: response.data.id,
            playerId: response.data.player1.id,
          })
        ).data;

        const match = new Match(
          response.data.id,
          response.data.player1,
          response.data.player2,
          player1Board,
          player2Board,
          response.data.status
        );

        await new ClientMatch(messages, match).start();

        break;
    }

    console.log();
    await delay(500);
    console.log();
  }

  client.destroy();
  readlineInterface.close();
  process.exit(0);
})();
