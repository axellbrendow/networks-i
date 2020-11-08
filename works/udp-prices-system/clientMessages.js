const { serverHost, serverPort } = require("./clientSocket");
const { Observers, MessageType } = require("./Observers");
const { createNewId } = require("./utils");

class Messages {
  /**
   * @param {import('dgram').Socket} client
   * @param {Observers} observers
   */
  constructor(client, observers) {
    this.client = client;
    /** @type {{ [id: string]: import("./Observers").Message }} */
    this.messages = {};
    this.observers = observers;
    this.addObservers();
  }

  addObservers() {
    this.observers.addObserver((message, info) => {
      if (message.type === MessageType.ADD_PRICE) {
        console.log("ADD_PRICE succeded");
        // console.log(message);
      }
    });

    this.observers.addObserver((message, info) => {
      if (message.type === MessageType.SEARCH_PRICE) {
        console.log("SEARCH_PRICE succeded");
        // console.log(message);
      }
    });
  }

  /**
   * @template T
   *
   * @param {T} data
   * @param {MessageType} messageType
   */
  createNewMessage(data, messageType) {
    const message = { id: createNewId(), type: messageType, data };
    this.messages[message.id] = message;
    return message;
  }

  /**
   * @param {Object} price
   * @param {number} price.fuelType
   * @param {number} price.price
   * @param {number} price.latitude
   * @param {number} price.longitude
   */
  addPrice(price, numTries = 3) {
    const message = this.createNewMessage(price, MessageType.ADD_PRICE);

    const data = Buffer.from(JSON.stringify(message));

    this.client.send(data, serverPort, serverHost, error => {
      if (error) {
        console.error(error);
        if (numTries > 0) this.addPrice(price, numTries - 1);
        else console.error("Nao foi possivel enviar os dados (3 tentativas)");
      } else {
        // console.log(`Data sent: ${JSON.stringify(message, null, 2)}`);
      }
    });
  }

  /**
   * @param {Object} searchParams
   * @param {number} searchParams.fuelType
   * @param {number} searchParams.radius
   * @param {number} searchParams.latitude
   * @param {number} searchParams.longitude
   */
  getLowestPrice(searchParams, numTries = 3) {
    const message = this.createNewMessage(
      searchParams,
      MessageType.SEARCH_PRICE
    );

    const data = Buffer.from(JSON.stringify(message));

    this.client.send(data, serverPort, serverHost, error => {
      if (error) {
        console.error(error);
        if (numTries > 0) this.getLowestPrice(searchParams, numTries - 1);
        else console.error("Nao foi possivel enviar os dados (3 tentativas)");
      } else {
        // console.log("Data sent !!!");
      }
    });
  }
}

module.exports.Messages = Messages;
