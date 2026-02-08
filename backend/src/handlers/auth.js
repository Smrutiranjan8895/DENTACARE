const bcrypt = require('bcryptjs');
const { getUserByEmail, putUser } = require('../lib/db');
const { buildResponse } = require('../lib/response');
const { signJwt, verifyJwt } = require('../lib/auth');

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (err) {
    return {};
  }
};

module.exports.signup = async (event) => {
  const { email, password } = parseBody(event);
  if (!email || !password) {
    return buildResponse(400, { message: 'email and password are required' });
  }

  try {
    const existing = await getUserByEmail(email);
    if (existing) {
      return buildResponse(409, { message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await putUser({
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    });

    return buildResponse(201, { message: 'User created' });
  } catch (err) {
    console.error('Signup error', err);
    if (err.code === 'ConditionalCheckFailedException') {
      return buildResponse(409, { message: 'User already exists' });
    }
    return buildResponse(500, { message: 'Internal error' });
  }
};

module.exports.login = async (event) => {
  const { email, password } = parseBody(event);
  if (!email || !password) {
    return buildResponse(400, { message: 'email and password are required' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return buildResponse(401, { message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return buildResponse(401, { message: 'Invalid credentials' });
    }

    const token = signJwt({ sub: email });
    return buildResponse(200, { token, tokenType: 'Bearer', expiresIn: '1h' });
  } catch (err) {
    console.error('Login error', err);
    return buildResponse(500, { message: 'Internal error' });
  }
};

const generatePolicy = (principalId, effect, resource, context = {}) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  },
  context
});

module.exports.jwtAuthorizer = async (event) => {
  try {
    const authHeader = event.authorizationToken || (event.headers && event.headers.Authorization);
    if (!authHeader) throw new Error('Missing Authorization header');

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = verifyJwt(token);

    return generatePolicy(decoded.sub || 'user', 'Allow', event.methodArn, { email: decoded.sub });
  } catch (err) {
    console.error('Auth error', err.message || err);
    throw new Error('Unauthorized');
  }
};
