const repositories = require("../repositories");

const { Message } = require("../../shared");

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['JOIN_MATCH']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.JOIN_MATCH) {
    const match = repositories.match.get(message.data.matchId);

    if (!match)
      return messages.sendMessage(message.id, socketName, message.type, {
        success: false,
        error: "Match not found",
      });

    if (match.player2)
      return messages.sendMessage(message.id, socketName, message.type, {
        success: false,
        error: "Match already has 2 players",
      });

    match.player2 = repositories.player.create();
    match.player2SocketName = socketName;

    repositories.match.save(match);

    messages.sendMessage(message.id, socketName, message.type, {
      success: true,
      match,
    });
  }
};
