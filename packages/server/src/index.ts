import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import logger from "jet-logger";

const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5001;

io.use((socket, next) => {
  const {
    handshake: {
      auth: { username },
    },
  } = socket;
  if (!username) {
    return next(new Error("invalid username"));
  }
  const s = socket;
  s.username = username;
  return next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const users: {
    userID: string;
    username: string;
  }[] = [];
  const { sockets } = io.of("/");
  sockets.forEach(({ id }) => {
    users.push({
      userID: id,
      username: socket.username,
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  // forward the private message to the right recipient
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

server.listen(port, () => {
  logger.info(`server listening on port ${port}`);
});

export default server;
