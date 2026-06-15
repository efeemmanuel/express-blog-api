const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET


// created generate jwt token, jwt refresh token, 

// genrate token
const generateAccessToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN) => 
    jwt.sign(payload, SECRET_KEY, {expiresIn}
    );


// generate refresh token
const generateRefreshToken = (payload, expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN) =>
    jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn}
    );

// // verify access token
// const verifyAccessToken = (token) =>
//   jwt.verify(token, SECRET_KEY);


// // verify refresh token
// const verifyRefreshToken = (token) =>
//   jwt.verify(token, REFRESH_SECRET_KEY);

// verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Access token has expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    throw new Error('Access token verification failed');
  }
};

// verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    }
    if (err.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Refresh token verification failed');
  }
};




module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};


