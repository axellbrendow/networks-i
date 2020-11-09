const ServerSocket = require("./ServerSocket");
const Messages = require("./Messages");
const Observers = require("./Observers");

const observers = new Observers();
const server = new ServerSocket(observers);
const messages = new Messages(server, observers);

server.setMessages(messages);

server.server.listen(server.serverPort, "localhost");
