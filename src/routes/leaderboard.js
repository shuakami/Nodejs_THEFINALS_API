const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard');
const { validateSeason, validatePlatform } = require('../middlewares/validator');

// 世界巡回赛路由
router.get(
    '/:season(s[3-5])worldtour/:platform',
    validateSeason,
    validatePlatform,
    leaderboardController.getWorldTourData
);

// 排位赛路由 (CB1/CB2赛季)
router.get(
    '/:season(cb[1-2])',
    validateSeason,
    leaderboardController.getRankedData
);

// 排位赛路由 (其他赛季)
router.get(
    '/:season(ob|s[1-5])/:platform',
    validateSeason,
    validatePlatform,
    leaderboardController.getRankedData
);

module.exports = router; 