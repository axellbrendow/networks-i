const repositories = require("../repositories");

const { Message } = require("../../shared");

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['START_MATCH']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.START_MATCH) {
    repositories.match.start(message.data.matchId);

    messages.sendMessage(message.id, socketName, message.type, null);
  }
};
