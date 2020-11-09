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

    messages.sendMessage(message.id, socketName, message.type, board);
  }
};
