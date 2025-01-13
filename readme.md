# Gogopad

Gogopad is a dynamic web application that provides weather information, city locations, random facts, and timezone details. The app combines multiple functionalities into a single interface, offering users an interactive and informative experience.

## Features

1. **Weather Information**:
   - Fetches current weather details for a specified city.
   - Displays temperature, weather description, humidity, pressure, and wind speed.

2. **City Location**:
   - Integrates with Leaflet.js to display the geographical location of a city on a map.
   - Provides an interactive map with zoom and marker functionality.

3. **Random Facts**:
   - Generates interesting random facts with the click of a button.

4. **Timezone Information**:
   - Retrieves the timezone and UTC offset for a specified city.

## Technology Stack

- **Frontend**: HTML5, CSS3 (embedded styles), JavaScript (ES6+)
- **Map Integration**: Leaflet.js
- **API Integration**: Custom backend APIs (for weather, geocode, facts, and timezone data)

## Setup Instructions

1. **Prerequisites**:
   - A web browser (latest versions of Chrome, Firefox, Edge, etc.).
   - Internet connection (to fetch API data).

2. **Running the Application**:
   - Open the `index.html` file in a web browser.
   - Ensure that `JS/main.js` is located in the `JS/` directory relative to the HTML file.

3. **API Endpoints**:
   - `/api/weather?city={city}`: Fetches weather information for the given city.
   - `/api/geocode?city={city}`: Retrieves geographical coordinates for the city.
   - `/api/facts`: Fetches a random fact.
   - `/api/timezone?city={city}`: Gets timezone details for the city.
