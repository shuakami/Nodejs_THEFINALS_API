const config = require('../config');

// 验证赛季参数
const validateSeason = (req, res, next) => {
    const { season } = req.params;
    
    // 检查是否是世界巡回赛赛季
    if (req.path.includes('worldtour')) {
        if (!config.seasons.worldTour.includes(season)) {
            return res.status(400).json({
                message: `Invalid world tour season. Supported seasons: ${config.seasons.worldTour.join(', ')}`
            });
        }
    } 
    // 检查是否是排位赛季
    else {
        const allRankedSeasons = [...config.seasons.ranked.legacy, ...config.seasons.ranked.current];
        if (!allRankedSeasons.includes(season)) {
            return res.status(400).json({
                message: `Invalid ranked season. Supported seasons: ${allRankedSeasons.join(', ')}`
            });
        }
    }
    
    next();
};

// 验证平台参数
const validatePlatform = (req, res, next) => {
    const { platform } = req.params;
    
    if (!config.platforms.includes(platform)) {
        return res.status(400).json({
            message: `Invalid platform. Supported platforms: ${config.platforms.join(', ')}`
        });
    }
    
    next();
};

module.exports = {
    validateSeason,
    validatePlatform
}; 