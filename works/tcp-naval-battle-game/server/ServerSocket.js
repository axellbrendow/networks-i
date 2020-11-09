const net = require("net");

class ServerSocket {
  /**
   * @param {import("./Observers")} observers
   */
  constructor(observers, serverPort = parseInt(process.argv[2]) || 1337) {
    this.observers = observers;
    this.serverPort = serverPort;
    /** @type {{ [socketName: string]: import('net').Socket }} */
    this.sockets = {};

    this.addSocket = this.addSocket.bind(this);
    this.setMessages = this.setMessages.bind(this);

    this.server = net.createServer(this.addSocket);
  }

  /**
   * @param {import("./Messages")} messages
   */
  setMessages(messages) {
    this.messages = messages;
  }

  /**
   * @param {import('net').Socket} socket
   */
  addSocket(socket) {
    const socketName = socket.remoteAddress + ":" + socket.remotePort;

    this.sockets[socketName] = socket;

    console.log(socketName + " joined.");

    socket.on("end", () => {
      console.log(socketName + " left.");

      // Remove client from socket array
      delete this.sockets[socketName];
    });

    socket.on("error", error => {
      console.log("Socket got problems:", error);
    });

    socket.on("data", msg => {
      const message = JSON.parse(msg.toString());

      console.log(
        `Message received from ${socketName} (${new Date().toLocaleString()}):`,
        message
      );

      this.observers.runObservers(message, this.messages, socketName);
    });
  }
}

module.exports = ServerSocket;
