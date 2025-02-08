const axios = require('axios');
const config = require('../config');
const logger = require('../config/logger');

// 创建axios实例
const api = axios.create({
    baseURL: config.api.baseUrl,
    timeout: config.api.timeout,
    headers: config.api.headers
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        logger.info(`API Response: ${response.status} ${response.config.url}`);
        return response.data;
    },
    async (error) => {
        if (error.response) {
            logger.error(`API Error: ${error.response.status} ${error.config.url}`, {
                status: error.response.status,
                data: error.response.data
            });
        } else {
            logger.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// 带重试机制的请求函数
const fetchWithRetry = async (url, options = {}, retries = 3) => {
    try {
        return await api(url, options);
    } catch (error) {
        if (retries > 0 && (!error.response || error.response.status >= 500)) {
            logger.warn(`Retrying request to ${url}, ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
    }
};

module.exports = {
    api,
    fetchWithRetry
}; 