// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://g8vn81fsvi.execute-api.ap-south-1.amazonaws.com/dev',
  ENDPOINTS: {
    SIGNUP: '/signup',
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
