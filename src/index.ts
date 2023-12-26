import http from "http";

import app from "./configs/app";
import appConfig from "./configs";

const { port, environment } = appConfig;
const server = http.createServer(app);

const createServer = (port: number) => {
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
