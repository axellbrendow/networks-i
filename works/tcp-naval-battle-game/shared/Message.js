/**
 * @typedef {"CREATE_MATCH" | "START_MATCH" | "SET_BOARD" | "SHOT" | "SERVER_SHOT"} MessageType
 */

/**
 * @template MessageData
 */
class Message {
  /** @type {{ [messageType in MessageType]: messageType }} */
  static MsgType = {
    CREATE_MATCH: "CREATE_MATCH",
    START_MATCH: "START_MATCH",
    SET_BOARD: "SET_BOARD",
    SHOT: "SHOT",
    SERVER_SHOT: "SERVER_SHOT",
  };

  /**
   * @param {string} id
   * @param {MessageType} type
   * @param {MessageData} data
   */
  constructor(id, type, data) {
    this.id = id;
    this.type = type;
    this.data = data;
  }
}

module.exports = Message;
