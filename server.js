const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('express-async-errors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { RateLimiterMemory, RateLimiterQueue } = require("rate-limiter-flexible");
const { slowDown } = require('express-slow-down')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY

const servers = [
    'BR1', 'EUN1', 'EUW1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'PH2', 'RU', 'SG2', 'TH2', 'TR1', 'TW2', 'VN2'
];
// Define rate limiting options
// const limiter = rateLimit({
//     windowMs: 20 * 1000, // 1 second
//     max: 5, // limit each IP to 5 requests per windowMs
//     message: 'Too many requests from this IP, please try again later',
//   });
// app.use(limiter);

const limiterFlexible = new RateLimiterMemory({
    points: 20,
    duration: 20,
  });
  
const limiterQueue = new RateLimiterQueue(limiterFlexible, {
    maxQueueSize: 40,
});

// LOL API Official limit: 100r/2mins n 20r/s
// const opts = {
//     points: 40, // Point budget.
//     duration: 30 // Reset points consumption every 60 sec.
// }
// const rateLimiter = new RateLimiterMemory(opts)

// const rateLimiterMiddleware = (req, res, next) => {
// // Rate limiting only applies to the /tokens route.
//     if (req.url.startsWith('/summonerRank')) {
//         rateLimiter
//         .consume(req.connection.remoteAddress, 3)
//         .then(() => {
//             //console.log("Inc traffic: " + req.connection.remoteAddress)
//             // Allow request and consume 1 point.
//             next()
//         })
//         .catch(() => {
//             // Not enough points. Block the request.
//             console.log(`Rejecting request due to rate limiting.`)
//             res.status(429).json('Too Many Requests')
//         })
//     } else if (req.url.startsWith('/matchHistory')) {
//         rateLimiter
//         .consume("Api Points", 12)
//         .then(() => {
//             console.log("Consuming first midddleware")
//             // Allow request and consume 1 point.
//             next()
//         })
//         .catch(() => {
//             // Not enough points. Block the request.
//             console.log(`Rejecting request due to rate limiting.`)
//             res.status(429).json('Too Many Requests')
//         })
//     } else if (req.url.startsWith('/tokens')) {
//         rateLimiter
//         .consume("Api Points", 10)
//         .then(() => {
//             console.log("Consuming third midddleware")
//             // Allow request and consume 1 point.
//             next()
//         })
//         .catch(() => {
//             // Not enough points. Block the request.
//             console.log(`Rejecting request due to rate limiting.`)
//             res.status(429).json('Too Many Requests')
//         })
//     } else {
//         next()
//     }
// }

// app.use(rateLimiterMiddleware)

// const riotSecond = {
//     points: 20, // Point budget.
//     duration: 1 // Reset points consumption every 60 sec.
// }
// const rateLimiterSecond = new RateLimiterMemory(riotSecond)
// const rateLimiterSecondMiddleware = (req, res, next) => {
// // Rate limiting only applies to the /tokens route.
//     if (req.url.startsWith('/summonerRank')) {
//         rateLimiterSecond
//         .consume(req.connection.remoteAddress, 3)
//         .then(() => {
//             //console.log("Inc traffic: " + req.connection.remoteAddress)
//             // Allow request and consume 1 point.
//             next()
//         })
//         .catch(() => {
//             // Not enough points. Block the request.
//             console.log(`Rejecting request due to rate limiting.`)
//             res.status(429).json('Too Many Requests')
//         })
//     } else if (req.url.startsWith('/matchHistory')) {
//         rateLimiterSecond
//         .consume("Api Points", 15)
//         .then(() => {
//             console.log("Consuming second midddleware")
//             // Allow request and consume 1 point.
//             next()
//         })
//         .catch(() => {
//             // Not enough points. Block the request.
//             console.log(`Rejecting request due to rate limiting.`)
//             res.status(429).json('Too Many Requests')
//         })
//     } else {
//         next()
//     }
// }

// app.use(rateLimiterSecondMiddleware)


// const limiterAPI = slowDown({
// 	windowMs: 120, // 15 minutes
// 	delayAfter: 1, // Allow 5 requests per 15 minutes.
// 	delayMs: (hits) => hits * 100, // Add 100 ms of delay to every request after the 5th one.

// })

// // Apply the delay middleware to all requests.
// app.use(limiterAPI)


// const limiterFlexible = new RateLimiterMemory({
//   points: 5,
//   duration: 10,
// });
// const limiter = new RateLimiterQueue(limiterFlexible);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSummonerByName(name, region) {
    try {
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://"+ region +".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        //console.log('Data:', response.data);
        //console.log('summoner response: ' + response.response)
        return response
    } catch (error) {
        throw error
    }
}

async function fAccByNameTag(name, tag, region) {
    try {
        const continent = regionToContinent(region)
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://"+ continent +".api.riotgames.com/riot/account/v1/accounts/by-riot-id/"+ name +"/"+ tag + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('fAccByNameTag:', response.data);
        //console.log('summoner response: ' + response.response)
        return response
    } catch (error) {
        throw error
    }
}

async function fSummonerByPuuid(puuid, region) {
    try {
        const continent = regionToContinent(region)
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://"+ region +".api.riotgames.com/lol/summoner/v4/summoners/by-puuid/"+ puuid + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('fSummonerByPuuid:', response.data);
        //console.log('summoner response: ' + response.response)
        return response
    } catch (error) {
        throw error
    }
}

async function fetchMatchesByPUUID(puuid) {
    try {
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + API_KEY;
        const response = await axios.get(url);
        //console.log('Data:', response.data);
        //console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

async function fetchMatchByMatchID(matchID) {
    try {
        const url = "https://europe.api.riotgames.com/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        //console.log('Data:', response.data);
        //console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

async function fetchActiveMatchByEID(encryptedID) {
    try {
        const url = "https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + encryptedID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        //console.log('Data:', response.data);
        // console.log(response.data.length)
        // console.log(response.data)
        // console.log("status " + response.status)
        return response
    } catch (error) {
        console.error('Error:', error);
        throw error
        return error.response.data
    }
}

async function fetchRankBySummonerEID(encryptedID, region) {
    try {
        const url = "https://"+ region +".api.riotgames.com/lol/league/v4/entries/by-summoner/" + encryptedID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        //console.log('Data:', response.data);
        //console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
        throw error
    }
}

// queueType: ranked_solo, ranked_flex
async function fetchChallengerLeague(region, queueType) {
    try {
        const url = "https://"+ region +".api.riotgames.com/lol/league/v4/challengerleagues/by-queue/" + queueType + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.error('Error:', error);
        throw error
        return error.response.data
    }
}

async function fetchGrandmasterLeague(region, queueType) {
    try {
        const url = "https://"+ region +".api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/" + queueType + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.error('Error:', error);
        throw error
        return error.response.data
    }
}

async function fetchMasterLeague(region, queueType) {
    try {
        const url = "https://"+ region +".api.riotgames.com/lol/league/v4/masterleagues/by-queue/" + queueType + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.error('Error:', error);
        throw error
        return error.response.data
    }
}

function regionToContinent(region) {
    const EUROPE = ['EUN1', 'EUW1', 'RU', 'TR1'];
    const ASIA = ['KR', 'JP1', 'SG2', 'TW2', 'VN2'];
    const AMERICA = ['BR1', 'LA1', 'LA2', 'NA1', 'OC1', 'PH2', 'TH2'];
    
    if (EUROPE.includes(region)) {
        return 'EUROPE';
    } else if (ASIA.includes(region)) {
        return 'ASIA';
    } else if (AMERICA.includes(region)) {
        return 'AMERICAS';
    } else {
        return 'Unknown';
    }
}

// Enable CORS middleware
const corsOptions = {
    origin: 'https://lolvue.vercel.app/'
};

app.use(cors(corsOptions));

//app.options('*', cors(corsOptions)); // Enable pre-flight across-the-board

// Define a sample route
app.get('/', (req, res) => {
    res.json('Hello from Express server!');
});

// Define a sample route
app.get('/tokens', async (req, res) => {
    //rateLimiter.consume(10)
    //rateLimiter.consume("Api Points", 10)
    await limiterQueue.removeTokens(10);
    //limiterQueue.removeTokens(5)
    res.json('Hello from tokens page!');
});

// heavy on api, probably problems with api throttling
app.get('/matchHistory/:name/:region', async (req, res) => {
    const nameTag = req.params.name;

    const parts = nameTag.split("-");
    const name = parts[0];
    const tag = parts[1];

    const region = req.params.region;
    let summoner = await fAccByNameTag(name, tag, region)
    //await sleep(500)
    //if (summoner.status != 200) return res.json(summoner.status.message)

    // transfer eun1, euw1, ru, etc to EUROPE. same for NA,SA etc.
    // let broadRegion = regionToBroadRegion(region)
    let matchHistory = await fetchMatchesByPUUID(summoner.data.puuid)
    //await sleep(500)
    console.log("matchhistory length: " + matchHistory.length)
    matchHistory.length = 10
    let mh = matchHistory.map(async function(el) {
        //console.log(el)
        // fetch match by its id
        let matchDetails = await fetchMatchByMatchID(el)
        //await sleep(1000)
        return matchDetails
    })
    
    const mhDetails = await Promise.all(mh)
    console.log(mhDetails[0].metadata.matchId)
    // Shrink the array to 10 since we are being limited, 20r/s or 120r/m
    // thus there is 1 element being returned as null
    mhDetails.length = 10
    //console.log(matchHistory)
    //console.log(mhDetails.length)
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
});

app.get('/summonerRank/:nameTag/:region', async (req, res, next) => {
    console.log("hello from sum rank")
    const nameTag = req.params.nameTag;
    const parts = nameTag.split("-");
    const name = parts[0];
    const tag = parts[1];

    const region = req.params.region;
    let summoner = await fAccByNameTag(name, tag, region)
    //await sleep(10000)
    let accData = await fSummonerByPuuid(summoner.data.puuid, region)
    let matchHistory = await fetchRankBySummonerEID(accData.data.id, region)
    res.json(matchHistory)
});

app.get('/activeMatch/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    //if (summoner.status != 200) return res.json(summoner.status.message)

    let activeMatch = await fetchActiveMatchByEID(summoner.data.id)
    //if (activeMatch.status != 200) return res.json(activeMatch.status.message)

    let participants = activeMatch.data.participants
    let pr = participants.map(async function(el) {
        console.log(el.summonerId)
        // fetch match by its id
        let summonerRank = await fetchRankBySummonerEID(el.summonerId)
        return summonerRank
    })
    const participantsRanks = await Promise.all(pr);
    res.json(participantsRanks)
});

app.get('/summoner/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    if (summoner.status != 200) return res.json(summoner.status.message)
    res.json(summoner.data)
});

app.get('/challengerLeague/:region', async (req, res) => {
    const region = req.params.region;
    let challengerLeague = await fetchChallengerLeague(region, "RANKED_SOLO_5x5")
    if (challengerLeague.status != 200) {
        if (challengerLeague.status.status_code === 404) {
            res.send("League not found!")
        } else {
            res.send(challengerLeague.status.message)
        }
        return
    }
    // if chall league len = 0, default to 500lp
    console.log((challengerLeague.data.entries).length)
    let challBeginning = challengerLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
    console.log(challBeginning)
    res.json(challengerLeague.data)
});

app.get('/grandmasterLeague/:region', async (req, res) => {
    const region = req.params.region;
    let grandmasterLeague = await fetchGrandmasterLeague(region, "RANKED_SOLO_5x5")
    if (grandmasterLeague.status != 200) {
        if (grandmasterLeague.status.status_code === 404) {
            res.send("League not found!")
        } else {
            res.send(grandmasterLeague.status.message)
        }
        return
    }
    // if gm league len = 0, default to 200lp
    console.log((grandmasterLeague.data.entries).length)
    let grandmasterBeginning = grandmasterLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
    //console.log(grandmasterBeginning)
    res.json(grandmasterLeague.data)
});

app.get('/masterLeague/:region', async (req, res) => {
    const region = req.params.region;
    let masterLeague = await fetchMasterLeague(region, "RANKED_SOLO_5x5")
    if (masterLeague.status != 200) {
        if (masterLeague.status.status_code === 404) {
            res.send("League not found!")
        } else {
            res.send(masterLeague.status.message)
        }
        return
    }
    // if gm league len = 0, default to 200lp
    console.log((masterLeague.data.entries).length)
    let masterBeginning = masterLeague.data.entries.sort((a, b) => a.leaguePoints - b.leaguePoints)[0];
    //console.log(masterBeginning)
    res.json(masterLeague.data)
});


app.use((err, req, res, next) => {
    //console.error(err.stack)
    console.log("middleware error")
    // console.log(err.code)
    // console.log(err.message)
    // console.log(err.statusCode)
    // console.log(err.msg)

    if (err.code == "ENOTFOUND") {
        err.statusCode = 404
        err.msg = "Invalid params"
      } else if (err.code == "ERR_BAD_REQUEST" && typeof err.response !== 'undefined') {
        err.statusCode = err.response.status
        err.msg = err.response.data.status.message;
        if (err.statusCode == 403) err.msg = "Forbidden. API Key expired?"
      } else {
        err.statusCode = 404
        err.msg = "Unknown error"
      }

      if (err.code == "ERR_BAD_REQUEST" && err.message == "Request failed with status code 429") {
        err.statusCode = 429
        err.msg = "User is being rate limited by riot API"
      }

    res.status(500).send({message: err.msg, statusCode: err.statusCode})
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});