/** @enum {string} */
const MessageType = {
  ADD_PRICE: "D",
  SEARCH_PRICE: "P",
};

module.exports.MessageType = MessageType;

/**
 * @typedef {{ id: string, type: MessageType, data: any }} Message
 * @typedef {(message: Message, info: import('dgram').RemoteInfo) => void} Observer
 */

class Observers {
  constructor() {
    /** @type {Observer[]} */
    this.observers = [];
  }

  /**
   * @param {Observer} observer
   */
  addObserver(observer) {
    this.observers.push(observer);
  }

  /**
   * @param {Message} message
   * @param {import('dgram').RemoteInfo} info
   */
  runObservers(message, info) {
    for (const observer of this.observers) observer(message, info);
  }
}

module.exports.Observers = Observers;
