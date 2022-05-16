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
  it("should send messages between users", (done) => {
    clientSocket.auth = { isUserFluent: false, languageCode: "BR" };
    clientSocket2.auth = { isUserFluent: true, languageCode: "BR" };
    clientSocket.open();
    clientSocket2.open();

    clientSocket2.on("room created", (roomName: string) => {
      clientSocket.emit("private message", {
        content: "hello!",
        roomName,
      });
    });

    clientSocket2.on("private message", (content: string) => {
      expect(content).toBe("hello!");
      done();
    });
  });
});
