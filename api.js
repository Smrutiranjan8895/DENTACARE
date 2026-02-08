// API Utility Functions

// Make authenticated API request
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token && options.authenticated !== false) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth helpers
function saveAuth(token, email) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('loggedIn', 'true');
}

function clearAuth() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('loggedIn');
}

function isAuthenticated() {
  return !!localStorage.getItem('authToken');
}

function getUserEmail() {
  return localStorage.getItem('userEmail');
}
