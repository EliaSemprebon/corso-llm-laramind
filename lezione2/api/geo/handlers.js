const { makeRequest } = require('../../libs/api');

// Tool handler functions
async function handleToolPosizione(args) {
  const address = args.address;
  const params = {
    q: address,
    format: "json",
    limit: 1
  };
  const url = "https://nominatim.openstreetmap.org/search";
  const result = await makeRequest("GET", url, params);
  if (!result.correct) {
    return result.data;
  }
  if (!Array.isArray(result.data) || result.data.length === 0) {
    return { error: "Nessun risultato trovato" };
  }
  const { lat, lon } = result.data[0];
  return {
    latitude: parseFloat(lat),
    longitude: parseFloat(lon)
  };
}

async function handleToolMeteo(args) {
  const { latitude, longitude, day } = args;
  const params = {
    latitude,
    longitude,
    start_date: day,
    end_date: day,
    hourly: 'temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_180m,temperature_80m',
    time_mode: 'time_interval'
  };
  const url = 'https://api.open-meteo.com/v1/forecast';
  const result = await makeRequest('GET', url, params);
  if (!result.correct) {
    return result.data;
  }
  return result.data;
}

module.exports = {
  handleToolPosizione,
  handleToolMeteo
};
