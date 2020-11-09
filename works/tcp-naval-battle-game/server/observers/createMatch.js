const repositories = require("../repositories");

const { Message } = require("../../shared");

/**
@type {import("../Observers").Observer<
  import('../../shared/requests').Requests['CREATE_MATCH']
>}
*/
module.exports = (message, messages, socketName) => {
  if (message.type === Message.MsgType.CREATE_MATCH) {
    const match = repositories.match.create();

    messages.sendMessage(message.id, socketName, message.type, match);
  }
};
