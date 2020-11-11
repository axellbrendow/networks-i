const repositories = require("../repositories");

const { Message, Player } = require("../../shared");

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['CREATE_MATCH']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.CREATE_MATCH) {
    const player1 = repositories.player.create();
    const match = repositories.match.create(
      player1,
      socketName,
      message.data.player2IsABot
    );

    if (message.data.player2IsABot) {
      const player2 = repositories.player.create(Player.SERVER_PLAYER_ID);
      const player2Board = repositories.board.random(match.id, player2.id);

      match.player2 = player2;
      match.player2Board = player2Board;
      match.boardsByPlayerId[player2.id] = player2Board;
      repositories.match.save(match);
    }

    messages.sendMessage(message.id, socketName, message.type, match);
  }
};
