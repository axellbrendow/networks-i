const ServerSocket = require("./ServerSocket");
const allObservers = require("./observers");

const { createNewId } = require("../utils");

/**
@typedef {{
  [messageType in import("../shared/Message").MessageType]: (
    (
      id: string,
      socketName: string,
      messageType: messageType,
      data: import('../shared/responses').Responses[messageType],
      numTries: number,
    ) => void
  ) & (
    (
      id: string,
      socketName: string,
      messageType: messageType,
      data: import('../shared/responses').Responses[messageType],
    ) => void
  )
}} SendMessageTypes
*/

/**
@template T

@typedef {
  (T extends any ? (x: T) => any : never) extends 
    (x: infer R) => any ? R : never
} UnionToIntersection
 */

/**
@typedef {UnionToIntersection<SendMessageTypes[keyof SendMessageTypes]>} SendMessageFunc
*/

class Messages {
  /**
   * @param {ServerSocket} server
   * @param {import('./Observers')} observers
   */
  constructor(server, observers) {
    this.server = server;
    /** @type {{ [messageId: string]: import('../shared/Message') }} */
    this.messages = {};
    this.observers = observers;

    /** @type {SendMessageFunc} */
    this.sendMessage = (id, socketName, messageType, data, numTries = 3) => {
      const message = this.createNewMessage(id, data, messageType);

      console.log(
        `Response sent to ${socketName} (${new Date().toLocaleString()}):`,
        message
      );

      const messageBuffer = Buffer.from(JSON.stringify(message));

      this.server.sockets[socketName].write(messageBuffer, error => {
        if (error) {
          console.error(error);
          if (numTries > 0)
            this.sendMessage(id, socketName, messageType, data, numTries - 1);
          else {
            console.error("Nao foi possivel enviar os dados (3 tentativas)");
          }
        }
      });
    };

    this.setupObservers();

    this.setupObservers = this.setupObservers.bind(this);
    this.createNewMessage = this.createNewMessage.bind(this);
  }

  setupObservers() {
    Object.values(allObservers).forEach(this.observers.addObserver);
  }

  /**
   * @template T
   *
   * @param {string} id
   * @param {T} data
   * @param {import('../shared/Message').MessageType} messageType
   *
   * @returns {import('../shared/Message')}
   */
  createNewMessage(id, data, messageType) {
    const message = { id: id || createNewId(), type: messageType, data };
    this.messages[message.id] = message;
    return message;
  }
}

module.exports = Messages;
