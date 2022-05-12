import Client, { Socket } from "socket.io-client";
import server from "../../src/index";

describe("Chat", () => {
  let clientSocket: Socket;
  beforeAll(() => {
    clientSocket = Client(`http://localhost:5001`);
  });
  afterAll(() => {
    clientSocket.close();
    server.close();
  });
  it("", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("connection succesfull");
      done();
    });
  });
});
