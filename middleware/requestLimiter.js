const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000,
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: "Too many requests from limiter",
})

module.exports = limiter;