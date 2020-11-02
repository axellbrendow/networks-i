const { server, serverPort } = require("./serverSocket");
const { Repository } = require("./serverRepository");
const { Messages } = require("./serverMessages");
const { Observers } = require("./Observers");

const observers = new Observers();
new Messages(server, observers, new Repository());

// emits when any error occurs
server.on("error", error => {
  console.error(error);
  server.close();
});

// emits when socket is ready and listening for datagram msgs
server.on("listening", () => {
  const address = server.address();
  console.log("Server is listening at port: " + address.port);
  console.log("Server ip: " + address.address);
  console.log("Server is IP4/IP6: " + address.family);
});

// emits after the socket is closed using socket.close();
server.on("close", () => {
  console.log("Socket is closed !");
});

// emits on new datagram
server.on("message", (msg, info) => {
  console.log(`Received ${msg.length} bytes from ${info.address}:${info.port}`);

  const message = JSON.parse(msg.toString());

  console.log(`Message received (${new Date().toLocaleString()}):`, message);

  observers.runObservers(message, info);
});

server.bind(serverPort);
