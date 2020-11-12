const { BoardVisualizer } = require("./BoardVisualizer");
const { question } = require("./io");
const ClientMatch = require("./ClientMatch");

const { Board, Message, Match } = require("../shared");

const getInitialBoard = async () => {
  let board, option;

  do {
    console.clear();
    board = Board.random();
    BoardVisualizer.print(board);
    console.log();
    option = await question("Do you wanna use this board (y-n) ? ");
    option = option.replace(/\s/g, "").toLowerCase();
  } while (option !== "y");

  return board;
};

/**
 * @param {import('./Messages')} messages
 */
const createMatchWithBot = async messages => {
  const player2IsABot = true;
  const response = await messages.sendMessage(
    null,
    Message.MsgType.CREATE_MATCH,
    { player2IsABot }
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
    response.data.player1SocketName,
    null,
    player1Board,
    player2Board,
    player2IsABot,
    response.data.status
  );

  await new ClientMatch(messages, match, true).start();
};

/**
 * @param {import('./Messages')} messages
 */
const joinMatch = async messages => {
  let response;
  let matchId;

  do {
    matchId = await question("Type the match identifier: ");

    response = await messages.sendMessage(null, Message.MsgType.JOIN_MATCH, {
      matchId,
    });

    if (!response.data.success) {
      console.log();
      console.log(response.data.error);
      console.log();
    }
  } while (!response.data.success);

  let player2Board = await getInitialBoard();
  const player1Board = response.data.match.player1Board;

  player2Board = (
    await messages.sendMessage(null, Message.MsgType.SET_BOARD, {
      board: player2Board,
      matchId,
      playerId: response.data.match.player2.id,
    })
  ).data;

  const match = new Match(
    matchId,
    response.data.match.player1,
    response.data.match.player2,
    response.data.match.player1SocketName,
    response.data.match.player2SocketName,
    player1Board,
    player2Board,
    false,
    response.data.match.status
  );

  await new ClientMatch(messages, match, false).start();
};

/**
 * @param {import('./Messages')} messages
 */
const createMultiplayerMatch = async messages => {
  const player2IsABot = false;
  const createMatchResponse = await messages.sendMessage(
    null,
    Message.MsgType.CREATE_MATCH,
    { player2IsABot }
  );

  const player1Board = (
    await messages.sendMessage(null, Message.MsgType.SET_BOARD, {
      board: await getInitialBoard(),
      matchId: createMatchResponse.data.id,
      playerId: createMatchResponse.data.player1.id,
    })
  ).data;

  console.clear();
  console.log(`Your match identifier: ${createMatchResponse.data.id}`);
  console.log("Waiting for player2....");

  /**
  @type {import('../shared/Message')<
    import('../shared/responses').Responses['PLAYER2_DEFINED_BOARD']
  >} */
  const player2DefinedBoardResponse = await new Promise((resolve, reject) => {
    const observerId = messages.addObserverFor(
      Message.MsgType.PLAYER2_DEFINED_BOARD,
      (message, messages) => {
        resolve(message);
        messages.removeObserver(observerId);
      }
    );
  });

  const match = new Match(
    createMatchResponse.data.id,
    createMatchResponse.data.player1,
    player2DefinedBoardResponse.data.player2,
    createMatchResponse.data.player1SocketName,
    player2DefinedBoardResponse.data.player2SocketName,
    player1Board,
    player2DefinedBoardResponse.data.player2Board,
    player2IsABot,
    player2DefinedBoardResponse.data.status
  );

  await new ClientMatch(messages, match, true).start();
};

/**
 * @param {import('./Messages')} messages
 */
const createMatchMenu = async messages => {
  console.clear();
  let operation;

  while (operation !== "Q") {
    operation = await question(`---- 🎯 Be welcome to the Naval Battle Game 🎯 ----

Type:
Q to Quit
B to start a new match against a bot
M to start a multiplayer match
J to join someone else

: `);
    console.log();
    operation = operation.toUpperCase();

    switch (operation) {
      case "B":
        await createMatchWithBot(messages);
        break;
      case "M":
        await createMultiplayerMatch(messages);
        break;
      case "J":
        await joinMatch(messages);
        break;
    }

    console.clear();
  }
};

module.exports.getInitialBoard = getInitialBoard;
module.exports.createMatchMenu = createMatchMenu;
