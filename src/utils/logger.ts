import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'udm' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 0 && meta.service !== 'udm'
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [UDM] ${level}: ${message}${metaStr}`;
        })
      )
    })
  ]
});

export function auditLog(event: string, data: Record<string, any>, message: string) {
  logger.info(message, { event, ...data });
}

export default logger;
