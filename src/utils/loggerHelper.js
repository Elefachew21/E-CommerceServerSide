import logger from "../middleware/logger.js";

export const logInfo = (msg) => logger.info(msg);
export const logWarn = (msg) => logger.warn(msg);
export const logError = (msg) => logger.error(msg);
