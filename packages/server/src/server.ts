import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";

const server = createServer(app);
const io = new Server(server);

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
  s.data.isUserFluent = isUserFluent;
  s.languageCode = languageCode;
  s.data.languageCode = languageCode;
  return next();
});

io.on("connection", (socket) => {
  // fetch existing users
  const room = io.sockets.adapter.rooms.has(socket.languageCode);
  if (room) {
    io.in(socket.languageCode)
      .fetchSockets<{
        isUserFluent: boolean;
        languageCode: string;
      }>()
      .then((clients) => {
        clients.forEach((client) => {
          if (client.data.isUserFluent !== socket.isUserFluent) {
            const roomName = `${socket.languageCode}-${Math.floor(
              Math.random() * 1000000
            )}`;
            client.join(roomName);
            socket.join(roomName);
            client.leave(socket.languageCode);
            socket.leave(socket.languageCode);
            io.to(roomName).emit("room created", roomName);
          }
        });
      });
  } else {
    socket.join(socket.languageCode);
  }

  socket.on(
    "private message",
    ({ content, roomName }: { content: string; roomName: string }) => {
      io.to(roomName).emit("private message", content);
    }
  );

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

export default server;
