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
        logger.info(`API Request: ${config.method.toUpperCase()} ${config.url}`, {
            baseURL: config.baseURL,
            url: config.url,
            method: config.method
        });
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
            logger.error('API Response Error:', {
                status: error.response.status,
                url: error.config.url,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            logger.error('API Request Failed:', {
                url: error.config.url,
                message: error.message,
                code: error.code
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
        logger.info(`Attempting request to ${url}`, {
            baseURL: config.api.baseUrl,
            retries
        });
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