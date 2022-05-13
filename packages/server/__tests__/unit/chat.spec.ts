import Client, { Socket } from "socket.io-client";
import server from "../../src/server";

describe("Chat", () => {
  let clientSocket: Socket, clientSocket2: Socket;
  beforeAll(() => {
    server.listen(5001);
    clientSocket = Client(`http://localhost:5001`, {
      autoConnect: false,
    });
    clientSocket2 = Client(`http://localhost:5001`, {
      autoConnect: false,
    });
  });
  afterAll(() => {
    clientSocket.close();
    clientSocket2.close();
    server.close();
  });
  it("should send a message from one user to another", (done) => {
    clientSocket.auth = { username: "jojo" };
    clientSocket2.auth = { username: "giorno" };
    clientSocket.open();
    clientSocket2.open();

    clientSocket.on(
      "user connected",
      (arg: { username: string; userID: string }) => {
        clientSocket.emit("private message", {
          content: "hello!",
          to: arg.userID,
        });
      }
    );

    clientSocket2.on(
      "private message",
      (arg: { content: string; from: string }) => {
        expect(arg.content).toBe("hello!");
        done();
      }
    );
  });
});
