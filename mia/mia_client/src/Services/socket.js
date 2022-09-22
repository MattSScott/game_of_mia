import socketIOClient from "socket.io-client";

const serverEndpoint = "http://localhost:3080/";

export const socket = socketIOClient(serverEndpoint, {
  transports: ["websocket"],
});
