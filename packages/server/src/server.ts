import app from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
// import cors from "cors";

const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "test" ? "*" : "",
    methods: ["GET", "POST"],
  },
});

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

io.on("connection", async (socket) => {
  // fetch existing users
  const room = io.sockets.adapter.rooms.has(socket.languageCode);
  if (room) {
    let noFluent: boolean = false;
    const clients = await io.in(socket.languageCode).fetchSockets<{
      isUserFluent: boolean;
      languageCode: string;
    }>();

    clients.forEach((client) => {
      if (client.data.isUserFluent !== socket.isUserFluent) {
        const roomName = `${socket.languageCode}-${Math.floor(
          Math.random() * 1000000
        )}`;
        client.join(roomName);
        socket.join(roomName);
        client.leave(socket.languageCode);
        socket.leave(socket.languageCode);
        io.to(roomName).emit("room status", roomName);
      } else {
        noFluent = true;
      }
    });

    if (noFluent) {
      io.to(socket.id).emit(
        "room status",
        "No fluents available in the chose language"
      );
    }
  } else {
    socket.join(socket.languageCode);
    socket.emit("lobby", "You just joined the lobby");
  }

  socket.on(
    "private message",
    ({ content, roomName }: { content: string; roomName: string }) => {
      socket.to(roomName).emit("private message", content);
    }
  );

  // notify users upon disconnection
  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

export default server;
