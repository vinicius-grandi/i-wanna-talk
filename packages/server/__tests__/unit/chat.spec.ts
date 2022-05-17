import Client, { Socket } from "socket.io-client";
import server from "../../src/server";

describe("Chat", () => {
  let clientSocket: Socket, clientSocket2: Socket;
  beforeAll(() => {
    server.listen(5001);
  });

  beforeEach(() => {
    clientSocket = Client(`http://localhost:5001`, {
      autoConnect: false,
    });
    clientSocket2 = Client(`http://localhost:5001`, {
      autoConnect: false,
    });
  });
  afterEach(() => {
    clientSocket.close();
    clientSocket2.close();
  });
  afterAll(() => {
    server.close();
    clientSocket.close();
    clientSocket2.close();
  });
  it("should send messages between users", (done) => {
    clientSocket.auth = { isUserFluent: false, languageCode: "BR" };
    clientSocket2.auth = { isUserFluent: true, languageCode: "BR" };
    clientSocket.open();
    clientSocket2.open();

    clientSocket2.on("room status", (msg: string) => {
      clientSocket.emit("private message", {
        content: "hello!",
        roomName: msg,
      });
    });

    clientSocket2.on("private message", (content: string) => {
      expect(content).toBe("hello!");
      done();
    });
  });
  it("should send a status message when no one is fluent", (done) => {
    clientSocket.auth = { isUserFluent: true, languageCode: "BR" };
    clientSocket2.auth = { isUserFluent: true, languageCode: "BR" };
    clientSocket.open();
    clientSocket2.open();

    clientSocket.onAny((ev) => console.log(ev));
    clientSocket2.onAny((ev) => console.log(ev));

    clientSocket2.on("room status", (msg: string) => {
      console.log("teste");
      expect(msg).toBe("No fluents available in the chose language");
      done();
    });
  }, 20000);
});
