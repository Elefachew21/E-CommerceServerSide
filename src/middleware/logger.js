import winston from "winston";

// Logger instance
import fs from "fs";

if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}
const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),

  transports: [
    // Error logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    // All logs
    new winston.transports.File({
      filename: "logs/combined.log",
    }),

    // Console
    new winston.transports.Console(),
  ],
});

export default logger;
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms IP:${req.ip}`;

    if (res.statusCode >= 500) {
      logger.error(message);
    } else if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
};