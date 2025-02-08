const leaderboardService = require('../services/leaderboard');
const config = require('../config');

class LeaderboardController {
    // 获取世界巡回赛数据
    async getWorldTourData(req, res, next) {
        try {
            const { season, platform } = req.params;
            const data = await leaderboardService.getWorldTourData(season, platform);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // 获取排位数据
    async getRankedData(req, res, next) {
        try {
            const { season, platform } = req.params;
            
            // 处理CB1/CB2赛季
            if (config.seasons.ranked.legacy.includes(season)) {
                const data = await leaderboardService.getLegacyRankedData(season);
                return res.json(data);
            }
            
            // 处理其他赛季
            const data = await leaderboardService.getRankedData(season, platform);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new LeaderboardController(); 