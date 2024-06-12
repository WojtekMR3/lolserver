const express = require('express')
const router = express.Router()

const controllerSample = require('../controllers/controller.js')
const leagueController = require('../controllers/leagueController.js')

router.get('/getAcc/:nameTag/:region', controllerSample.getAcc)

router.get('/summonerRank/:nameTag/:region', controllerSample.SummonerRank);
router.get('/matchHistory/:nameTag/:region', controllerSample.MatchHistory);

router.get('/activeMatch/:nameTag/:region', controllerSample.ActiveMatch);

router.get('/challengerLeague/:region', leagueController.ChallLeague)
router.get('/grandmasterLeague/:region', leagueController.gmLeague)
router.get('/masterLeague/:region', leagueController.masterLeague)

module.exports = router