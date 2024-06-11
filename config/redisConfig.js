const redis = require('redis');
const { promisify } = require('util');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = redis.createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// const hsetAsync = promisify(redisClient.hset).bind(redisClient);
// const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);
// const expireAsync = promisify(redisClient.expire).bind(redisClient);

redisClient.on('connect', () => {
    console.log('Connected to Redis12345');
})

redisClient.on('error', (err) => {
    console.log(err.message);
})

redisClient.on('ready', () => {
    console.log('Redis is ready');
})

redisClient.on('end', () => {
    console.log('Redis connection ended');
})

process.on('SIGINT', () => {
    redisClient.quit();
})

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.log(err.message);
})

module.exports = redisClient;
