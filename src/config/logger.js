const winston = require('winston');
const path = require('path');

// 创建基本日志格式
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// 创建日志配置
const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'thefinals-api' }
});

// 在Vercel环境中只使用控制台日志
if (process.env.VERCEL === '1') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
} 
// 在其他环境中使用文件和控制台日志
else {
    // 确保logs目录存在
    const fs = require('fs');
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    // 添加文件传输
    logger.add(new winston.transports.File({ 
        filename: path.join(logsDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
    logger.add(new winston.transports.File({ 
        filename: path.join(logsDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));

    // 在开发环境下同时输出到控制台
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
    }
}

module.exports = logger; 