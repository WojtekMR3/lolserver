const riotAPI = require('../lib/riotAPI.js');
const redisClient = require('../config/redisConfig.js');

const leagueController = {

    ChallLeague: async (req, res) => {
        const region = req.params.region;

        let retrievedData = await redisClient.get('challLeague');
        if (retrievedData) {
            console.log("retrieving redis data")
            res.json(JSON.parse(retrievedData))
            return
        }

        let challengerLeague = await riotAPI.ChallengerLeague(region, "RANKED_SOLO_5x5")
        // if chall league len = 0, default to 500lp
        console.log((challengerLeague.data.entries).length)
        let challBeginning = challengerLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
        //console.log(challBeginning)
        //console.log("setting redis data")
        console.log("setting redis data")
        redisClient.setEx("challLeague", 60, JSON.stringify(challengerLeague.data))
        res.json(challengerLeague.data)
    },

    gmLeague: async (req, res) => {
        const region = req.params.region;

        let retrievedData = await redisClient.get('gmLeague');
        if (retrievedData) {
            console.log("retrieving redis data")
            res.json(JSON.parse(retrievedData))
            return
        }

        let grandmasterLeague = await riotAPI.GrandmasterLeague(region, "RANKED_SOLO_5x5")
        // if gm league len = 0, default to 200lp
        console.log((grandmasterLeague.data.entries).length)
        let grandmasterBeginning = grandmasterLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
        //console.log(grandmasterBeginning)
        console.log("setting redis data")
        redisClient.setEx("gmLeague", 60, JSON.stringify(grandmasterLeague.data))
        res.json(grandmasterLeague.data)
    },

    masterLeague: async (req, res) => {
        const region = req.params.region;

        let retrievedData = await redisClient.get('masterLeague');
        if (retrievedData) {
            console.log("retrieving redis data")
            res.json(JSON.parse(retrievedData))
            return
        }

        let masterLeague = await riotAPI.MasterLeague(region, "RANKED_SOLO_5x5")
        // if gm league len = 0, default to 200lp
        console.log((masterLeague.data.entries).length)
        let masterBeginning = masterLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
        //console.log(masterBeginning)
        console.log("setting redis data")
        redisClient.setEx("masterLeague", 60, JSON.stringify(masterLeague.data))
        res.json(masterLeague.data)
    },
};

module.exports = leagueController;