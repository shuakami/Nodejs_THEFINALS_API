require('dotenv').config();

module.exports = {
    // 服务器配置
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',

    // API配置
    api: {
        baseUrl: process.env.BASE_API_URL,
        timeout: parseInt(process.env.REQUEST_TIMEOUT) || 5000,
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'TheFinals-Bot/1.0'
        }
    },

    // 缓存配置
    cache: {
        ttl: parseInt(process.env.CACHE_TTL) || 300
    },

    // 限流配置
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100
    },

    // 支持的赛季
    seasons: {
        worldTour: ['s3', 's4', 's5'],
        ranked: {
            legacy: ['cb1', 'cb2'],
            current: ['ob', 's1', 's2', 's3', 's4', 's5']
        }
    },

    // 支持的平台
    platforms: ['crossplay']
}; 