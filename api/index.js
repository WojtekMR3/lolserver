const express = require('express');
require('express-async-errors');

const cors = require('cors');
const corsOptions = require('./v1/middleware/corsOptions.js');

const dotenv = require('dotenv');
dotenv.config();

const rateLimit = require('express-rate-limit');
const { RateLimiterMemory, RateLimiterQueue } = require("rate-limiter-flexible");
const { slowDown } = require('express-slow-down')

const router = require('./v1/router/router')
const errorHandler = require('./v1/middleware/errorHandler.js');
const requestLimiter = require('./v1/middleware/requestLimiter.js');
const timelog = require('./v1/middleware/timelog.js');
const responseTime = require('response-time')

const app = express();

app.use(cors(corsOptions))
app.use(requestLimiter)

// app.use(timelog)
app.use(responseTime((req, res, time) => {
    console.log(`${req.method} ${req.originalUrl} took ${time.toFixed(2)} ms`);
  }));
  
app.use('/api', router)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;

const limiterFlexible = new RateLimiterMemory({
    points: 20,
    duration: 20,
  });
  
const limiterQueue = new RateLimiterQueue(limiterFlexible, {
    maxQueueSize: 41,
});

// LOL API Official limit: 100r/2mins n 20r/s
const opts = {
    points: 40, // Point budget.
    duration: 30 // Reset points consumption every 60 sec.
}
const rateLimiter = new RateLimiterMemory(opts)

const rateLimiterMiddleware = (req, res, next) => {
// Rate limiting only applies to the /tokens route.
    if (req.url.startsWith('/summonerRank')) {
        rateLimiter
        .consume(req.connection.remoteAddress, 3)
        .then(() => {
            //console.log("Inc traffic: " + req.connection.remoteAddress)
            // Allow request and consume 1 point.
            next()
        })
        .catch(() => {
            // Not enough points. Block the request.
            console.log(`Rejecting request due to rate limiting.`)
            res.status(429).json('Too Many Requests')
        })
    } else if (req.url.startsWith('/matchHistory')) {
        rateLimiter
        .consume("Api Points", 12)
        .then(() => {
            console.log("Consuming first midddleware")
            // Allow request and consume 1 point.
            next()
        })
        .catch(() => {
            // Not enough points. Block the request.
            console.log(`Rejecting request due to rate limiting.`)
            res.status(429).json('Too Many Requests')
        })
    } else if (req.url.startsWith('/tokens')) {
        rateLimiter
        .consume("Api Points", 10)
        .then(() => {
            console.log("Consuming third midddleware")
            // Allow request and consume 1 point.
            next()
        })
        .catch(() => {
            // Not enough points. Block the request.
            console.log(`Rejecting request due to rate limiting.`)
            res.status(429).json('Too Many Requests')
        })
    } else {
        next()
    }
}

//app.use(rateLimiterMiddleware)

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

// function sleep(ms) {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }

// Define a sample route
app.get('/tokens', async (req, res) => {
    //rateLimiter.consume(10)
    //rateLimiter.consume("Api Points", 10)
    //await limiterQueue.removeTokens(10);
    //limiterQueue.removeTokens(5)
    res.json('Hello from tokens page!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;