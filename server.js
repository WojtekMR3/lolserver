import express from 'express';
import cors from 'cors';
import axios from 'axios'

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY

async function fetchSummonerByName(name) {
    try {
      // Replace 'your_url_here' with the actual URL you want to request
      const url = "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY;
      const response = await axios.get(url);
      console.log('Data:', response.data);
      return response.data
    } catch (error) {
      console.error('Error:', error);
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

async function fetchRankBySummonerEID(encryptedID) {
    try {
        // Replace 'your_url_here' with the actual URL you want to request
        const url = "https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + encryptedID +"?api_key=" + API_KEY
        const response = await axios.get(url);
        console.log('Data:', response.data);
        console.log(response.data.length)
        return response.data
    } catch (error) {
        console.error('Error:', error);
    }
}

// Enable CORS middleware
app.use(cors());

// Define a sample route
app.get('/', (req, res) => {
  res.json('Hello from Express server!');
});

app.get('/matchHistory/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    let matchHistory = await fetchMatchesByPUUID(summoner.puuid)
    matchHistory.forEach((el) => {
        console.log(el)
        // fetch match by its id
    })
    res.json(matchHistory)
});

app.get('/summonerRank/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    let matchHistory = await fetchRankBySummonerEID(summoner.id)
    res.json(matchHistory)
});

app.get('/summoner/:name', async (req, res) => {
    const name = req.params.name;
    let summoner = await fetchSummonerByName(name)
    res.json(summoner)
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
