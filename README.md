# Weather Order Checker

This project checks weather conditions for different cities and updates order status based on potential delivery delays.

## Features
- Parallel API calls using Promise.all
- Weather-based delay detection (Rain, Snow, Extreme)
- Error handling for invalid cities
- Secure API key using .env file

## How it works
1. Reads orders from orders.json
2. Fetches weather data using OpenWeatherMap API
3. Updates order status if delay conditions are met
4. Writes output to updated_orders.json

## Run the project
npm install
node index.js

## Note
- Invalid city is handled without crashing the program
- API key is stored securely in .env file
