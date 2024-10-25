import express, { type Express } from "express";
import { queryParser } from "express-query-parser";
import cookieParser from "cookie-parser";
import corsMiddleware from "cors";
import dotenv from "dotenv";
import gracefulShutdown from "http-graceful-shutdown";
import helmetSecurity from "helmet";
import morganLogger from "morgan";
import path from "node:path";

import responseHandlers from "./middlewares/responseHandlers";
import notFoundHandler from "./middlewares/notFoundHandler";
import logger from "./utils/logger";
import winstonLogger from "./utils/winstonLogger";

dotenv.config();

const expressApp: Express = express();

const port = process.env.PORT;
expressApp.set("port", port);

expressApp.use(morganLogger("dev"));
expressApp.use(helmetSecurity());
expressApp.use(corsMiddleware());

expressApp.use(express.text({ limit: "25mb" }));
expressApp.use(express.urlencoded({ extended: true, limit: "1mb" }));
expressApp.use(express.json({ limit: "5mb" }));
expressApp.use(cookieParser());
expressApp.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

expressApp.use(responseHandlers);

expressApp.get("/", (_req, res) => {
  res.success({ data: "Day Craft API" });
});

expressApp.get("/health", (_req, res) => {
  res.success({ data: "Server is healthy" });
});

expressApp.use("/public", express.static(path.join(__dirname, "public")));

import routes from "./routes/routes";
expressApp.use("/api", routes);

expressApp.use(notFoundHandler);

const server = expressApp.listen(expressApp.get("port"), () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

const shutdownCleanup = async (signal?: string) => {
  logger.info(`Received ${signal}, shutting down...`);
  const loggerDone = new Promise<void>((resolve) => {
    winstonLogger.on("finish", resolve);
  });
  winstonLogger.end();

  return loggerDone;
};

gracefulShutdown(server, { onShutdown: shutdownCleanup, timeout: 5000 });

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});
