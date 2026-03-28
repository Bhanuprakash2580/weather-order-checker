const axios = require("axios");

const delayConditions = ["Rain", "Snow", "Extreme"];

function createMessage(name, city, weather) {
  return `Hi ${name}, your order for ${city} is delayed due to ${weather.toLowerCase()} conditions. Thank you for your understanding.`;
}

async function getWeather(city, apiKey) {
  if (!apiKey) return null;
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weather = response.data.weather[0].main;
    console.log(`Weather for ${city}: ${weather}`);
    return weather;
  } catch (err) {
    console.log(`Error for city: ${city}`);
    return null;
  }
}

/**
 * @param {Array} orders - parsed orders from JSON
 * @param {string} apiKey - OpenWeatherMap API key
 * @returns {Promise<Array>} new array with status/message updates where applicable
 */
async function processOrders(orders, apiKey) {
  return Promise.all(
    orders.map(async (order) => {
      const next = { ...order };
      const weather = await getWeather(next.city, apiKey);
      if (!weather) return next;
      if (delayConditions.includes(weather)) {
        next.status = "Delayed";
        next.message = createMessage(next.customer, next.city, weather);
      }
      return next;
    })
  );
}

module.exports = { processOrders, getWeather };
