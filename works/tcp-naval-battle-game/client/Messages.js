const { createNewId } = require("../utils");

/**
@typedef {{
  [messageType in import("../shared/Message").MessageType]: (
    (
      id: string,
      messageType: messageType,
      data: import('../shared/requests').Requests[messageType],
      numTries: number,
    ) => Promise<
      import('../shared/Message')<
        import('../shared/responses').Responses[messageType]
      >
    >
  ) & (
    (
      id: string,
      messageType: messageType,
      data: import('../shared/requests').Requests[messageType],
    ) => Promise<
      import('../shared/Message')<
        import('../shared/responses').Responses[messageType]
      >
    >
  ) 
}} SendMessageTypes
*/

/**
@typedef {{
  [messageType in import("../shared/Message").MessageType]: (
    (
      messageType: messageType,
      observer: import("./Observers").Observer<
        import('../shared/responses').Responses[messageType]
      >,
    ) => string
  )
}} AddObserverTypes
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

/**
@typedef {UnionToIntersection<AddObserverTypes[keyof AddObserverTypes]>} AddObserverFunc
*/

class Messages {
  /**
   * @param {import('net').Socket} client
   * @param {import('./Observers')} observers
   */
  constructor(client, observers) {
    this.client = client;
    /** @type {{ [id: string]: import("../shared/Message") }} */
    this.messages = {};
    this.observers = observers;

    /** @type {SendMessageFunc} */
    this.sendMessage = (id, messageType, data, numTries = 3) => {
      const message = this.createNewMessage(id, data, messageType);

      const messageBuffer = Buffer.from(JSON.stringify(message));

      return new Promise((resolve, reject) => {
        this.client.write(messageBuffer, error => {
          if (error) {
            console.error(error);
            if (numTries > 0)
              this.sendMessage(id, data, messageType, numTries - 1)
                .then(resolve)
                .catch(reject);
            else {
              console.error("Could not send the data (3 tries)");
              reject(error);
            }
          } else {
            const id = this.observers.addObserver(msg => {
              if (msg.id === message.id && msg.type === message.type) {
                this.observers.removeObserver(id);
                resolve(msg);
              }
            });
          }
        });
      });
    };

    /** @type {AddObserverFunc} */
    this.addObserverFor = (messageType, observer) =>
      this.observers.addObserver((message, messages) => {
        if (message.type === messageType) observer(message, messages);
      });

    this.createNewMessage = this.createNewMessage.bind(this);
  }

  /**
   * @template T
   *
   * @param {string} id
   * @param {T} data
   * @param {import('../shared/Message').MessageType} messageType
   */
  createNewMessage(id, data, messageType) {
    const message = { id: id || createNewId(), type: messageType, data };
    this.messages[message.id] = message;
    return message;
  }

  /**
   * @param {string} observerId
   */
  removeObserver(observerId) {
    this.observers.removeObserver(observerId);
  }
}

module.exports = Messages;
