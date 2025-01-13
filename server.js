require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Использование ключей из .env
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const FACTS_API_KEY = process.env.FACTS_API_KEY;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const TIMEZONE_API_KEY = process.env.TIMEZONE_API_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Эндпоинт для получения погоды
app.get("/api/weather", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );
    const weatherData = response.data;

    res.json({
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
      feels_like: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      wind_speed: weatherData.wind.speed,
      rain_volume: weatherData.rain ? weatherData.rain["1h"] : 0,
      country_code: weatherData.sys.country,
    });
  } catch (error) {
    console.error("Error retrieving weather data:", error.message);
    res.status(500).json({ error: "Failed to retrieve weather data" });
  }
});

// Эндпоинт для получения геокодинга
app.get("/api/geocode", async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: city,
          key: OPENCAGE_API_KEY,
        },
      }
    );
    const result = response.data.results[0];
    if (!result) return res.status(404).json({ error: "City not found" });

    res.json({ lat: result.geometry.lat, lon: result.geometry.lng });
  } catch (error) {
    console.error("Error retrieving geolocation data:", error.message);
    res.status(500).json({ error: "Failed to retrieve geolocation data" });
  }
});

// Эндпоинт для получения фактов
app.get("/api/facts", async (req, res) => {
  try {
    const response = await axios.get("https://api.api-ninjas.com/v1/facts", {
      headers: { "X-Api-Key": FACTS_API_KEY },
    });

    // Логируем ответ от API для диагностики
    console.log("API Ninjas response data:", response.data);

    if (response.data && response.data.length > 0) {
      res.json(response.data);
    } else {
      res.status(404).json({ error: "No facts found" });
    }
  } catch (error) {
    console.error(
      "Error retrieving facts data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to retrieve facts data" });
  }
});

// Эндпоинт для получения данных о времени (timezone)
app.get("/api/timezone", async (req, res) => {
  const { city } = req.query;  // Get the city from the query string
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const geocodeResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: city,
          key: OPENCAGE_API_KEY,
        },
      }
    );
    const result = geocodeResponse.data.results[0];
    if (!result) return res.status(404).json({ error: "City not found" });

    const lat = result.geometry.lat;
    const lon = result.geometry.lng;

    // Use the lat and lon for the timezone API request
    const response = await axios.get("https://api.api-ninjas.com/v1/timezone", {
      headers: { "X-Api-Key": TIMEZONE_API_KEY },
      params: { lat, lon },
    });

    // Add the city name to the response
    const timezoneData = response.data;
    timezoneData.city = city;

    res.json(timezoneData);  // Return the timezone data along with the city
  } catch (error) {
    console.error("Error retrieving timezone data:", error.message);
    res.status(500).json({ error: "Failed to retrieve timezone data" });
  }
});


// Главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
