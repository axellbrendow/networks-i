const { Observers, MessageType } = require("./Observers");
const { Repository } = require("./serverRepository");

class Messages {
  /**
   * @param {import('dgram').Socket} server
   * @param {Observers} observers
   * @param {Repository} repository
   */
  constructor(server, observers, repository) {
    this.server = server;
    /** @type {{ [id: string]: import("./Observers").Message }} */
    this.messages = {};
    this.repository = repository;
    this.observers = observers;
    this.addObservers();
  }

  addObservers() {
    this.observers.addObserver((message, info) => {
      if (message.type === MessageType.ADD_PRICE) {
        message.data = this.repository.addPrice(message.data);

        this.server.send(
          JSON.stringify(message),
          info.port,
          "localhost",
          error => {
            if (error) {
              console.error(error);
            } else {
              console.log("Message sent (response):", message);
            }
          }
        );
      }
    });

    this.observers.addObserver((message, info) => {
      if (message.type === MessageType.SEARCH_PRICE) {
        message.data = this.repository.searchPrice(message.data);

        if (message.data.price === Number.MAX_SAFE_INTEGER)
          message.data = "Nenhum posto encontrado";

        this.server.send(
          JSON.stringify(message),
          info.port,
          "localhost",
          error => {
            if (error) {
              console.error(error);
            } else {
              console.log(
                `Message sent (response)(${new Date().toLocaleString()}):`,
                message
              );
            }
          }
        );
      }
    });
  }
}

module.exports.Messages = Messages;
