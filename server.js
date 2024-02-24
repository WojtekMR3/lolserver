import express from 'express';
import cors from 'cors';
import axios from 'axios'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.API_KEY

async function fetchSummonerByName(name) {
    try {
      // Replace 'your_url_here' with the actual URL you want to request
      const url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY;
      const response = await axios.get(url);
      console.log('Data:', response.data);
      console.log(response.status)
      return response
    } catch (error) {
      console.error('Error:', error);
      return error.response.data
    }
  }

async function fetchMatchesByPUUID(puuid) {
    try {
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('Data:', response.data);
        console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchMatchByMatchID(matchID) {
    try {
        const url = "https://europe.api.riotgames.com/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('Data:', response.data);
        console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}

async function fetchActiveMatchByEID(encryptedID) {
    try {
        const url = "https://eun1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + encryptedID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('Data:', response.data);
        // console.log(response.data.length)
        // console.log(response.data)
        // console.log("status " + response.status)
        return response
    } catch (error) {
        console.error('Error:', error);
        // console.log(error.response.data);
        // console.log(error.response.data.status.message.length);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        return error.response.data
    }
}

async function fetchRankBySummonerEID(encryptedID) {
    try {
        const url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + encryptedID + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        console.log('Data:', response.data);
        console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}

// queueType: ranked_solo, ranked_flex
async function fetchChallengerLeague(queueType) {
    try {
        const url = "https://eun1.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/" + queueType + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.error('Error:', error);
        return error.response.data
    }
}

async function fetchGrandmasterLeague(queueType) {
    try {
        const url = "https://eun1.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/" + queueType + "?api_key=" + API_KEY;
        const response = await axios.get(url);
        return response
    } catch (error) {
        console.error('Error:', error);
        return error.response.data
    }
}


// Enable CORS middleware
app.use(cors());

// Define a sample route
app.get('/', (req, res) => {
  res.json('Hello from Express server!');
});

// heavy on api, probably problems with api throttling
app.get('/matchHistory/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    if (summoner.status != 200) {
        if (summoner.status.status_code === 404) {
            res.send("Summoner not found!")
        } else {
            res.send(summoner.status.message)
        }
        return
    }

    let matchHistory = await fetchMatchesByPUUID(summoner.data.puuid)
    let mh = matchHistory.map(async function(el) {
        //console.log(el)
        // fetch match by its id
        let matchDetails = await fetchMatchByMatchID(el)
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

app.get('/summonerRank/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    if (summoner.status != 200) {
        if (summoner.status.status_code === 404) {
            res.send("Summoner not found!")
        } else {
            res.send(summoner.status.message)
        }
        return
    }
    let matchHistory = await fetchRankBySummonerEID(summoner.data.id)
    res.json(matchHistory)
});

app.get('/activeMatch/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    if (summoner.status != 200) {
        if (summoner.status.status_code === 404) {
            res.send("Summoner not found!")
        } else {
            res.send(summoner.status.message)
        }
        return
    }

    let activeMatch = await fetchActiveMatchByEID(summoner.data.id)
    if (activeMatch.status != 200) {
        if (activeMatch.status.status_code === 404) {
            res.send("Summoner is not in game!")
        } else {
            res.send(activeMatch.status.message)
        }
        return
    }

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
    if (summoner.status != 200) {
        if (summoner.status.status_code === 404) {
            res.send("Summoner not found!")
        } else {
            res.send(summoner.status.message)
        }
        return
    }
    res.json(summoner.data)
});

app.get('/challengerLeague', async (req, res) => {
    let challengerLeague = await fetchChallengerLeague("RANKED_SOLO_5x5")
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

app.get('/grandmasterLeague', async (req, res) => {
    let grandmasterLeague = await fetchGrandmasterLeague("RANKED_SOLO_5x5")
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
    console.log(grandmasterBeginning)
    res.json(grandmasterLeague.data)
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});