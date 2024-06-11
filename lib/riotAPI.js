const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const API_KEY = process.env.API_KEY;

const riotAPI = {
    regionToContinent(region) {
        region = region.toUpperCase();

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
    },

    async AccByNameTag(name, tag, region) {
        try {
            const continent = this.regionToContinent(region);
            const url = `https://${continent}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async SummonerByPuuid(puuid, region) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            //console.log('SummonerByPuuid:', response.data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    async MatchesByPUUID(puuid, region) { // Added region parameter
        try {
            const continent = this.regionToContinent(region);
            const url = `https://${continent}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${API_KEY}`;
            const response = await axios.get(url);
            //console.log('MatchesByPUUID: ', response.data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async MatchByMatchID(matchID, region) { // Added region parameter
        try {
            const continent = this.regionToContinent(region);
            const url = `https://${continent}.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            //console.log('MatchByMatchID: ', response.data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async ActiveMatchByEID(encryptedID, region) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${encryptedID}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            //console.log('ActiveMatchByEID: ', response.data);
            return response;
        } catch (error) {
            //console.error('Error:', error);
            throw error;
        }
    },

    async RankBySummonerEID(encryptedID, region) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encryptedID}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            //console.log('RankBySummonerEID:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async ChallengerLeague(region, queueType) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/league/v4/challengerleagues/by-queue/${queueType}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async GrandmasterLeague(region, queueType) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/${queueType}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    async MasterLeague(region, queueType) {
        try {
            const url = `https://${region}.api.riotgames.com/lol/league/v4/masterleagues/by-queue/${queueType}?api_key=${API_KEY}`;
            const response = await axios.get(url);
            return response;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};

module.exports = riotAPI;