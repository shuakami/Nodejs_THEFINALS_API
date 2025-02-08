const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config');
const logger = require('./config/logger');
const { notFound, errorHandler } = require('./middlewares/error');
const leaderboardRoutes = require('./routes/leaderboard');

// 创建Express应用
const app = express();

// 基础中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:"]
        }
    }
}));

// 在Vercel环境中禁用日志
if (process.env.VERCEL !== '1') {
    app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// 静态文件服务
app.use(express.static(path.join(__dirname, '..', 'public')));

// 限流中间件
app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
        message: 'Too many requests from this IP, please try again later.'
    }
}));

// API路由
app.use('/leaderboard', leaderboardRoutes);

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 错误处理中间件
app.use(notFound);
app.use(errorHandler);

// 在Vercel环境中导出app，否则启动服务器
if (process.env.VERCEL === '1') {
    module.exports = app;
} else {
    const PORT = config.port;
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
        logger.info(`Environment: ${config.env}`);
    });
} 