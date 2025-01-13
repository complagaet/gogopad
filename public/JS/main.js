let map;

// Fetch and display weather data
document
    .getElementById("weather-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city").value;

        try {
            // Fetch weather data
            const weatherResponse = await fetch(`/api/weather?city=${city}`);
            const weatherData = await weatherResponse.json();

            if (weatherData.error) {
                document.getElementById("weather-result").innerHTML = `<p>Error: ${weatherData.error}</p>`;
            } else {
                document.getElementById("weather-result").innerHTML = `
          <p>Temperature: ${weatherData.temperature}°C</p>
          <p>Description: ${weatherData.description}</p>
          <p><img src="${weatherData.icon}" alt="${weatherData.description}" /></p>
          <p>Feels Like: ${weatherData.feels_like}°C</p>
          <p>Humidity: ${weatherData.humidity}%</p>
          <p>Pressure: ${weatherData.pressure} hPa</p>
          <p>Wind Speed: ${weatherData.wind_speed} m/s</p>
          <p>Rain Volume (last 1 hour): ${weatherData.rain_volume} mm</p>
          <p>Country Code: ${weatherData.country_code}</p>
        `;
            }

            // Fetch geocode data and update the map
            const geocodeResponse = await fetch(`/api/geocode?city=${city}`);
            const geocodeData = await geocodeResponse.json();

            if (geocodeData.error) {
                console.error("Error fetching geocode data:", geocodeData.error);
            } else {
                const lat = geocodeData.lat;
                const lon = geocodeData.lon;

                if (map) {
                    map.remove();
                }
                map = L.map("map").setView([lat, lon], 10);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
                L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`<b>${city}</b><br>Lat: ${lat}, Lon: ${lon}`)
                    .openPopup();
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
            document.getElementById("weather-result").innerHTML = `<p>Error fetching weather data</p>`;
        }
    });

// Fetch random facts
document
    .getElementById("get-fact-button")
    .addEventListener("click", async () => {
        try {
            const factResponse = await fetch("/api/facts");
            const factData = await factResponse.json();

            if (factData.error) {
                document.getElementById("facts-result").innerHTML = `<p>Error: ${factData.error}</p>`;
            } else {
                document.getElementById("facts-result").innerHTML = `<p>${factData[0].fact}</p>`;
            }
        } catch (error) {
            console.error("Error fetching facts:", error);
            document.getElementById("facts-result").innerHTML = `<p>Error fetching facts</p>`;
        }
    });

// Fetch timezone data
document
    .getElementById("timezone-form")
    .addEventListener("submit", async (e) => {
        e.preventDefault();
        const city = document.getElementById("city-timezone").value;

        try {
            const timezoneResponse = await fetch(`/api/timezone?city=${city}`);
            const timezoneData = await timezoneResponse.json();

            if (timezoneData.error) {
                document.getElementById("timezone-result").innerHTML = `<p>Error: ${timezoneData.error}</p>`;
            } else {
                document.getElementById("timezone-result").innerHTML = `
          <p>City: ${timezoneData.city}</p>
          <p>Timezone: ${timezoneData.timezone}</p>
          <p>UTC Offset: ${timezoneData.utc_offset}</p>
        `;
            }
        } catch (error) {
            console.error("Error fetching timezone data:", error);
            document.getElementById("timezone-result").innerHTML = `<p>Error fetching timezone data</p>`;
        }
    });
