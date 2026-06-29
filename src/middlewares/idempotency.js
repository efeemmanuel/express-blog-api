const redisClient = require('../config/redis')

const idempotency = async (req,res,next) => {

    try {
    // grab the key from header
    const key = req.headers['idempotency-key'];


    // no key then skip
    if (!key || req.method !== 'POST') {
        return next();
    }

    // key name in Redis
    const storeKey = `idem:${req.user.id}:${key}`;

    // check redis if this key exists
    const cached = await redisClient.get(storeKey);

    // if it exists, this is a duplicate request — return the stored response immediately
    // the client gets back the exact same response as the first request, DB is never touched
    if (cached) {
    // cached is a JSON string, parse it back into an object  
    const { statusCode, body } = JSON.parse(cached);
    // send the same status code and body as the original request and stop here
    return res.status(statusCode).json(body);
    }

    //ADD HERE — intercept res.json before calling next()
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
        await redisClient.setex(storeKey, 86400, JSON.stringify({ statusCode: res.statusCode, body }));
        return originalJson(body);
    };

    next();
    } catch (err)  {
        // Redis is down — log it and let the request through
    console.error('[idempotency] Redis error:', err.message);
    next();
    }

}


module.exports = idempotency;