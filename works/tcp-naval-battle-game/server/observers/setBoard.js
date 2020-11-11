const repositories = require("../repositories");

const { Message } = require("../../shared");

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['SET_BOARD']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.SET_BOARD) {
    const board = repositories.board.set(
      message.data.board,
      message.data.matchId,
      message.data.playerId
    );

    repositories.match.setBoard(
      board,
      message.data.matchId,
      message.data.playerId
    );

    const match = repositories.match.get(message.data.matchId);

    if (!match.player2IsABot && match.player2Board)
      messages.sendMessage(
        null,
        match.player1SocketName,
        Message.MsgType.PLAYER2_DEFINED_BOARD,
        match
      );

    messages.sendMessage(message.id, socketName, message.type, board);
  }
};
