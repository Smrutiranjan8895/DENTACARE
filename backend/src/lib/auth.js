const jwt = require('jsonwebtoken');

const signJwt = (payload, expiresIn = '1h') => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyJwt = (token) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.verify(token, secret);
};

module.exports = { signJwt, verifyJwt };
