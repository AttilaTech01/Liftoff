import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    transports: [
        new transports.File({ dirname: "logs", filename: "error.log", level: "warn" }),
        new transports.File({ dirname: "logs", filename: "app.log" }),
      ],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
});

class CustomLogger {
    public logError(message: string): void {
        logger.error(message);
    }

    public logInfo(message: string): void {
        logger.info(message);
    }

    public logWarning(message: string): void {
        logger.warn(message);
    }
}

export default new CustomLogger;