const { buildResponse } = require('../lib/response');

module.exports.handle = async (event) => {
  const path = event.path || '/';

  if (path.endsWith('/health') || path === '/health') {
    return buildResponse(200, { status: 'ok' });
  }

  return buildResponse(404, {
    message: 'Route not found. Use /dev/signup, /dev/login, or /dev/upload.',
    receivedPath: path
  });
};
