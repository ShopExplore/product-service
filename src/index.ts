import http from "http";

import app from "./configs/app";
import appConfig from "./configs";
import { createChannel } from "./utils/event";

const { port, environment } = appConfig;


const createServer = async (port: number) => {

  await createChannel() //message broker channel

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

createServer(port);
