# Pakistan Weather Dashboard

A sleek and responsive real-time weather dashboard for cities in Pakistan. It features current conditions, short- and long-term forecasts, air quality info, and interactive weather maps with dynamic animations and a dark theme.

---

## Features

- **Current Weather:** Real-time data including temperature, "feels like", wind speed, humidity, visibility, cloud cover, and pressure.
- **Hourly Forecast:** Next 8-hour forecast.
- **5-Day Forecast:** Daily highs and lows for 5 days.
- **Air Quality Index (AQI):** Live AQI with health recommendations.
- **Weather Maps:** Interactive layers for temperature, precipitation, wind, and clouds.
- **Geolocation:** Get weather data based on current location.
- **City Search:** Search cities across Pakistan with recent history.
- **Responsive Design:** Fully optimized for all screen sizes.
- **Dynamic UI:** Smooth animations via GSAP and Lottie.

## Technologies Used

- **HTML:** Layout and structure.
- **CSS:** Responsive dark UI with gradients and animations.
- **JavaScript:** Fetches and handles dynamic data.
- **External Libraries:**
  - `OpenWeatherMap API` – Weather, AQI, forecast, and geolocation.
  - `GSAP` – Animation library.
  - `Lottie` – Weather animations.
  - `Chart.js` – Line chart for hourly temperature.
  - `Font Awesome` – UI icons.
  - `Google Fonts` – Poppins and Orbitron fonts.

## How to Run

1. Open `index.html` in a modern browser.
2. Get an API key from [OpenWeatherMap](https://openweathermap.org/).
3. In `script.js`, replace the placeholder API key `'58debbf5a23140a3e077bfa0520522d5'` with your own.
4. Use the search bar or "My Location" button to retrieve weather data.
