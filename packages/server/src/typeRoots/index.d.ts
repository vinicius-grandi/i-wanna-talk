import "socket.io";

declare module "socket.io" {
  interface Socket {
    isUserFluent: boolean;
    languageCode: string;
  }
}
