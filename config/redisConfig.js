const redis = require('redis');
const { promisify } = require('util');
// const redisClient = redis.createClient()
// const redisClient = redis.createClient({
//     host: '127.0.0.1',
//     port: 6379
// });

const redisClient = redis.createClient({
    password: 'ulw4JjiNbkoM3vxnDxomHZg9rSMU71W1',
    socket: {
        host: 'redis-16627.c328.europe-west3-1.gce.redns.redis-cloud.com',
        port: 16627
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
