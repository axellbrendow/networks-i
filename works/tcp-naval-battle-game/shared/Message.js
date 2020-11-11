/**
@typedef {
  "CREATE_MATCH" |
  "START_MATCH" |
  "SET_BOARD" |
  "SHOT" |
  "ENEMY_SHOT" |
  "JOIN_MATCH" |
  "PLAYER2_DEFINED_BOARD"
} MessageType
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
    ENEMY_SHOT: "ENEMY_SHOT",
    JOIN_MATCH: "JOIN_MATCH",
    PLAYER2_DEFINED_BOARD: "PLAYER2_DEFINED_BOARD",
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
