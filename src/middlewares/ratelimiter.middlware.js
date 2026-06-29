const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

const WINDOW_SIZE_IN_SECONDS = 6000;
const MAX_REQUESTS = 1000;

const rateLimiter = async (req, res, next) => {
  try {
    const key = `rate:${req.ip}`;

    const currentRequests = await redisClient.incr(key);

    if (currentRequests === 1) {
      await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    if (currentRequests > MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    // Fail open if Redis is down
    console.error("Rate limiter error:", error);
    next();
  }
};

module.exports = rateLimiter;






// const Redis = require("ioredis");

// const redisClient = new Redis({
//   port: 6379, //redis port
//   host: "127.0.0.1", //redis host url
//   password: "auth", //redis password
//   db: 0, //db number
// })

// const WINDOW_SIZE_IN_SECONDS = 6000; // 1 minute
// const MAX_REQUESTS = 1000;

// const rateLimiter = async (req, res, next) => {
//   try {
//     const key = `rate:${req.ip}`;

//     const currentRequests = await redisClient.incr(key);

//     // First request => set expiry
//     if (currentRequests === 1) {
//       await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
//     }

//     if (currentRequests > MAX_REQUESTS) {
//       return res.status(429).json({
//         error: "Too many requests. Please try again later.",
//       });
//     }

//     next();
//   } catch (error) {
//     // Fail open if Redis is down
//     console.error("Rate limiter error:", error);
//     next();
//   }
// };

// module.exports = rateLimiter;