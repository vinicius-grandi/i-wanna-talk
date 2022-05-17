import server from "./server";
import logger from "jet-logger";

const port = process.env.PORT || 5001;

server.listen(port, () => {
  logger.info(`server listening on port ${port}`);
});

export default server;
