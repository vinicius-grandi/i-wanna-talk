import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);
const io = new Server(server);
let count = 1;

io.use((socket, next) => {
  const {
    handshake: {
      auth: { isUserFluent, languageCode },
    },
  } = socket;
  if (isUserFluent === undefined || !languageCode) {
    return next(
      new Error(
        "You need to specify if you're fluent or not and your language code"
      )
    );
  }
  const s = socket;
  s.isUserFluent = isUserFluent;
  s.languageCode = languageCode;
  return next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const room = io.sockets.adapter.rooms.get(socket.languageCode);
  const roomSize = room ? room.size : 0;
  if (roomSize > 2) {
    count += 1;
  }
  socket.join(`${socket.languageCode}-${count}`);

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

export default server;
