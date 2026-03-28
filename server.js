const fs = require("fs");
const path = require("path");
const express = require("express");
const { processOrders } = require("./processOrders");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.type("html").send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Weather Check</title></head>
<body>
  <p>Weather Check API is running.</p>
  <ul>
    <li><a href="/health">GET /health</a> — health check</li>
    <li>GET /run — process orders (same as CLI)</li>
  </ul>
</body></html>`);
});

async function runProcess(req, res) {
  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY not configured" });
  }
  let orders;
  try {
    const raw = fs.readFileSync(path.join(__dirname, "orders.json"), "utf-8");
    orders = JSON.parse(raw);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read orders.json" });
  }
  try {
    const updatedOrders = await processOrders(orders, API_KEY);
    fs.writeFileSync(
      path.join(__dirname, "updated_orders.json"),
      JSON.stringify(updatedOrders, null, 2)
    );
    res.json({ ok: true, count: updatedOrders.length, orders: updatedOrders });
  } catch (err) {
    res.status(500).json({ error: err.message || "Processing failed" });
  }
}

app.get("/run", runProcess);
app.post("/run", runProcess);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
