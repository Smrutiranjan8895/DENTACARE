const AWS = require('aws-sdk');
const { buildResponse } = require('../lib/response');
const { signJwt, verifyJwt } = require('../lib/auth');

const cognito = new AWS.CognitoIdentityServiceProvider();

const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch (err) {
    return {};
  }
};

const respondTokens = (authResult) => {
  const { IdToken, AccessToken, RefreshToken, ExpiresIn, TokenType } = authResult || {};
  return buildResponse(200, {
    idToken: IdToken,
    accessToken: AccessToken,
    refreshToken: RefreshToken,
    expiresIn: ExpiresIn,
    tokenType: TokenType || 'Bearer'
  });
};

module.exports.signup = async (event) => {
  const { name, email, password } = parseBody(event);
  if (!name || !email || !password) {
    return buildResponse(400, { message: 'name, email and password are required' });
  }

  try {
    // Create user in Cognito
    await cognito
      .signUp({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'name', Value: name }
        ]
      })
      .promise();

    return buildResponse(200, { message: 'Signup successful. Please check your email for the verification code.' });
  } catch (err) {
    console.error('Signup error', err);
    if (err.code === 'UsernameExistsException') {
      return buildResponse(409, { message: 'User already exists' });
    }
    if (err.code === 'InvalidPasswordException') {
      return buildResponse(400, { message: err.message });
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
    const auth = await cognito
      .initiateAuth({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH',
        AuthParameters: { USERNAME: email, PASSWORD: password }
      })
      .promise();

    return respondTokens(auth.AuthenticationResult);
  } catch (err) {
    console.error('Login error', err);
    if (err.code === 'NotAuthorizedException') {
      return buildResponse(401, { message: 'Invalid credentials' });
    }
    if (err.code === 'UserNotFoundException') {
      return buildResponse(401, { message: 'User not found' });
    }
    if (err.code === 'UserNotConfirmedException') {
      return buildResponse(403, { message: 'User not confirmed. Please verify your email.' });
    }
    return buildResponse(500, { message: 'Internal error' });
  }
};

module.exports.confirm = async (event) => {
  const { email, code } = parseBody(event);
  if (!email || !code) {
    return buildResponse(400, { message: 'email and code are required' });
  }

  try {
    await cognito
      .confirmSignUp({
        ClientId: process.env.USER_POOL_CLIENT_ID,
        Username: email,
        ConfirmationCode: code
      })
      .promise();

    return buildResponse(200, { message: 'Email confirmed. Please log in.' });
  } catch (err) {
    console.error('Confirm error', err);
    if (err.code === 'CodeMismatchException' || err.code === 'ExpiredCodeException') {
      return buildResponse(400, { message: 'Invalid or expired code' });
    }
    if (err.code === 'UserNotFoundException') {
      return buildResponse(404, { message: 'User not found' });
    }
    if (err.code === 'NotAuthorizedException') {
      return buildResponse(400, { message: 'User already confirmed' });
    }
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
