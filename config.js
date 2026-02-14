// API configuration with environment-driven base URL (supports Netlify/Node/dotenv)
const API_BASE = (() => {
  const raw =
    (typeof window !== 'undefined' && window._env_ && window._env_.API_BASE_URL) ||
    (typeof window !== 'undefined' && window.API_BASE_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.API_BASE_URL) ||
    'https://g8vn81fsvi.execute-api.ap-south-1.amazonaws.com/dev';

  return raw.replace(/\/$/, ''); // keep stable concatenation
})();

const API_CONFIG = {
  BASE_URL: API_BASE,
  ENDPOINTS: {
    SIGNUP: '/signup',
    CONFIRM: '/confirm',
    LOGIN: '/login',
    UPLOAD: '/upload',
    APPOINTMENTS: '/appointments',
    CONTACT: '/contact'
  }
};

// Get full endpoint URL
function getEndpoint(name) {
  return API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS[name];
}
