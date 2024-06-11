const riotAPI = require('../lib/riotAPI.js');
const redisClient = require('../config/redisConfig.js');

const postgres = require('../config/postgres.js');
const pg = require('../config/pg.js');

const controllerSample = {
    getAcc: async (req, res) => {
        const nameTag = req.params.nameTag;
        const parts = nameTag.split("-");
        const name = parts[0];
        const tag = parts[1];
        const region = req.params.region;

        try {
            let summoner = await riotAPI.AccByNameTag(name, tag, region);
            res.json(summoner.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    SummonerRank: async (req, res) => {
        const nameTag = req.params.nameTag;
        const parts = nameTag.split("-");
        const name = parts[0];
        const tag = parts[1];
        const region = req.params.region;

        try {
            let summoner = await riotAPI.AccByNameTag(name, tag, region);
            let accData = await riotAPI.SummonerByPuuid(summoner.data.puuid, region);
            let summonerRank = await riotAPI.RankBySummonerEID(accData.data.id, region);
            res.json(summonerRank);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    MatchHistory: async (req, res) => {
        const nameTag = req.params.nameTag;

        const parts = nameTag.split("-");
        const name = parts[0];
        const tag = parts[1];
    
        const region = req.params.region;

        const q2 = {
            //name: 'fetch-user',
            text: 'SELECT * FROM users WHERE name = $1 AND tag = $2',
            values: [name, tag],
        }          

        const r2 = await pg.query(q2)
        //console.log(r2.rows)

        let summonerRiotID
        if (r2.rows.length == 0) {
            let summoner = await riotAPI.AccByNameTag(name, tag, region)
            summonerRiotID = summoner.data.puuid
            const insertUser = {
                //name: 'fetch-user',
                text: 'INSERT INTO users (name, tag, riot_id) VALUES ($1, $2, $3) RETURNING *',
                values: [name, tag, summonerRiotID],
            }

            //const values = [[{matchHistory}], summoner.data.puuid];
            const res1 = await pg.query(insertUser);
        } else {
            summonerRiotID = r2.rows[0].riot_id
        }
        
        //let matchHistory = await redisClient.get(summoner.data.puuid);
        //matchHistory = JSON.parse(matchHistory)

        const query = {
            //name: 'fetch-user',
            text: 'SELECT match_history FROM users WHERE riot_id = $1',
            values: [summonerRiotID],
          }          

        const result = await pg.query(query)
        console.log(result.rows[0].match_history)
        // console.log("rows0 " + JSON.stringify(result.rows[0]))
        //console.log("rows0 " + result.rows[0].match_history[0].matchHistory)
        //let matchHistory = result.rows[0].match_history[0].matchHistory
        //console.log("pg length " + matchHistory.length)

        //matchHistory = result.rows[0]
        //console.log("retrieving redis data")
        let matchHistory
        if (result.rows[0].match_history == 0 || result.rows[0].match_history == null) {
            console.log("fetching data from riot api")
            matchHistory = await riotAPI.MatchesByPUUID(summonerRiotID, region)

            const queryText = 'UPDATE users SET match_history = $1 WHERE riot_id = $2 RETURNING *';
            const values = [[{matchHistory}], summonerRiotID];
            const res1 = await pg.query(queryText, values);
            //console.log(res1)
        } else {
            console.log("fetching data from psql")
            matchHistory = result.rows[0].match_history[0].matchHistory
        }

        // if (!matchHistory) {
        //     matchHistory = await riotAPI.MatchesByPUUID(summoner.data.puuid, region)
        //     //redisClient.setEx(summoner.data.puuid, 300, JSON.stringify(matchHistory))
            
        //     // Set multiple fields
        //     //const userKey = `user:${summoner.data.puuid}`;
        //     // await redisClient.hSet(userKey, {
        //     //     name: 'John',
        //     //     surname: 'Smith',
        //     //     company: 'Redis',
        //     //     matchHistory: JSON.stringify(matchHistory)
        //     // })

        //     const queryText = 'UPDATE users SET match_history = $1 WHERE riot_id = $2 RETURNING *';
        //     const values = [[{matchHistory}], summoner.data.puuid];
        //     const res1 = await pg.query(queryText, values);
        //     console.log(res1)
        // }

        console.log(matchHistory)

        matchHistory.length = 10
        //console.log("matchhistory length: " + matchHistory.length)
        
        let mh = matchHistory.map(async function(match) {
            console.log(JSON.stringify(match))
            
            //console.log(el)
            // fetch match by its id
            let matchDetails = await redisClient.get(match);
            matchDetails = JSON.parse(matchDetails)
            if (!matchDetails) {
                matchDetails = await riotAPI.MatchByMatchID(match, region)
                redisClient.setEx(match, 300, JSON.stringify(matchDetails))
            }
            //console.log(JSON.stringify(matchDetails.info))
            return matchDetails
        })
        
        const mhDetails = await Promise.all(mh)
        console.log(mhDetails[0].metadata.matchId)
        // Shrink the array to 10 since we are being limited, 20r/s or 120r/m
        // thus there is 1 element being returned as null
        mhDetails.length = 10
        //console.log(matchHistory)
        //console.log(mhDetails.length)
        //console.log(JSON.stringify(mhDetails[0].metadata))
        mhDetails.forEach((e) => {
            console.log("mhdetails: " + e.metadata.matchId)
        })
        // let participants = activeMatch.data.participants
        // let pr = participants.map(async function(el) {
        //     console.log(el.summonerId)
        //     // fetch match by its id
        //     let summonerRank = await fetchRankBySummonerEID(el.summonerId)
        //     return summonerRank
        // })
        // const participantsRanks = await Promise.all(pr);
    
        res.json(mhDetails)
    },

    ActiveMatch: async (req, res) => {
        const nameTag = req.params.nameTag;

        const parts = nameTag.split("-");
        const name = parts[0];
        const tag = parts[1];
    
        const region = req.params.region;
        let summoner = await riotAPI.AccByNameTag(name, tag, region)
        let activeMatch = await riotAPI.ActiveMatchByEID(summoner.data.puuid, region)
        console.log("hello from active")
        //if (activeMatch.status != 200) return res.json(activeMatch.status.message)
    
        let participants = activeMatch.data.participants
        let pr = participants.map(async function(el) {
            console.log(el.summonerId)
            // fetch match by its id
            let summonerRank = await riotAPI.RankBySummonerEID(el.summonerId, region)
            return summonerRank
        })
        const participantsRanks = await Promise.all(pr);
        res.json(participantsRanks)
    },
};

module.exports = controllerSample;