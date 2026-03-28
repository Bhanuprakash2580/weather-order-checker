const fs = require("fs");
const path = require("path");
const { processOrders } = require("./processOrders");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

let orders;
try {
  const data = fs.readFileSync(path.join(__dirname, "orders.json"), "utf-8");
  orders = JSON.parse(data);
} catch (err) {
  console.error("Failed to read orders file");
  process.exit(1);
}

async function main() {
  console.log("Processing orders...\n");

  const updatedOrders = await processOrders(orders, API_KEY);

  try {
    fs.writeFileSync(
      path.join(__dirname, "updated_orders.json"),
      JSON.stringify(updatedOrders, null, 2)
    );
    console.log("\nDone Check updated_orders.json");
  } catch (err) {
    console.error("Error writing output file");
  }
}

main();
