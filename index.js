const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

// read input file
let orders;
try {
  const data = fs.readFileSync("orders.json", "utf-8");
  orders = JSON.parse(data);
} catch (err) {
  console.error("Failed to read orders file");
  process.exit(1);
}

// fetch weather for a city
async function getWeather(city) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weather = response.data.weather[0].main;

    // debug log (useful for demo)
    console.log(`Weather for ${city}: ${weather}`);

    return weather;

  } catch (err) {
    console.log(`Error for city: ${city}`);
    return null; // continue execution without breaking
  }
}

// generate delay message
function createMessage(name, city, weather) {
  return `Hi ${name}, your order for ${city} is delayed due to ${weather.toLowerCase()} conditions. Thank you for your understanding.`;
}

// main processing logic
async function main() {
  console.log("Processing orders...\n");

  const delayConditions = ["Rain", "Snow", "Extreme"]; // added Clouds for demo

  const updatedOrders = await Promise.all(
    orders.map(async (order) => {

      const weather = await getWeather(order.city);

      // skip if API failed
      if (!weather) {
        return order;
      }

      // check delay condition
      if (delayConditions.includes(weather)) {
        order.status = "Delayed";
        order.message = createMessage(
          order.customer,
          order.city,
          weather
        );
      }

      return order;
    })
  );

  // write output file
  try {
    fs.writeFileSync(
      "updated_orders.json",
      JSON.stringify(updatedOrders, null, 2)
    );
    console.log("\nDone Check updated_orders.json");
  } catch (err) {
    console.error("Error writing output file");
  }
}

// run script
main();
