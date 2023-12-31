import http from "http";

import app from "./configs/app";
import appConfig from "./configs";
import { createChannel } from "./utils/event";

const { port, environment } = appConfig;

const createServer = async (port: number) => {
  const server = http.createServer(app);
  server.listen(port);

  server.on("listening", () => {
    console.log(
      `${environment?.toLocaleUpperCase()} is running on port ${port}`
    );
  });

  server.on("error", (error) => {
    console.log("server error");

    throw error;
  });
};

export const channel = async () => {
  try {
    return await createChannel();
  } catch (error) {
    return `error ${error} `;
  }
}; //message broker channel

channel();
createServer(port);
