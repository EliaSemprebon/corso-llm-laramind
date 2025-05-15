const axios = require('axios');

/**
 * Makes an HTTP request using axios
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param {string} url - The URL to make the request to
 * @param {Object} params - URL parameters (for GET requests)
 * @param {Object} body - Request body (for POST, PUT requests)
 * @returns {Promise<Object|boolean>} Response data or false if request fails
 */
async function makeRequest(method, url, params = {}, body = null) {
  try {
    const config = {
      method: method.toLowerCase(),
      url,
      headers: {
        'Content-Type': 'application/json'
      },
      params: method.toLowerCase() === 'get' ? params : {},
      data: body && method.toLowerCase() !== 'get' ? body : undefined
    };
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API Request Error:', {
      method, url,
      params, body,
      error: error.message,
      response: error.response?.data
    });
    return false;
  }
}

module.exports = {
  makeRequest
};
