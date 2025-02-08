const { fetchWithRetry } = require('../utils/api');
const cache = require('../utils/cache');
const logger = require('../config/logger');

class LeaderboardService {
    // 获取世界巡回赛数据
    async getWorldTourData(season, platform) {
        const cacheKey = `worldtour:${season}:${platform}`;
        
        // 尝试从缓存获取
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            logger.info('Cache hit for world tour data', { season, platform });
            return cachedData;
        }

        // 从API获取数据
        try {
            const data = await fetchWithRetry(`/leaderboard/${season}worldtour/${platform}`);
            cache.set(cacheKey, data);
            return data;
        } catch (error) {
            logger.error('Failed to fetch world tour data', { season, platform, error: error.message });
            throw error;
        }
    }

    // 获取排位数据(CB1/CB2赛季)
    async getLegacyRankedData(season) {
        const cacheKey = `ranked:${season}`;
        
        // 尝试从缓存获取
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            logger.info('Cache hit for legacy ranked data', { season });
            return cachedData;
        }

        // 从API获取数据
        try {
            const data = await fetchWithRetry(`/leaderboard/${season}`);
            cache.set(cacheKey, data);
            return data;
        } catch (error) {
            logger.error('Failed to fetch legacy ranked data', { season, error: error.message });
            throw error;
        }
    }

    // 获取排位数据(其他赛季)
    async getRankedData(season, platform) {
        const cacheKey = `ranked:${season}:${platform}`;
        
        // 尝试从缓存获取
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            logger.info('Cache hit for ranked data', { season, platform });
            return cachedData;
        }

        // 从API获取数据
        try {
            const data = await fetchWithRetry(`/leaderboard/${season}/${platform}`);
            cache.set(cacheKey, data);
            return data;
        } catch (error) {
            logger.error('Failed to fetch ranked data', { season, platform, error: error.message });
            throw error;
        }
    }
}

module.exports = new LeaderboardService(); 