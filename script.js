// // ==================================
// //         API Configuration        
// // ==================================
// // NOTE: Replace 'YOUR_OPENWEATHER_API_KEY' with your actual key
// const API_KEY = '58debbf5a23140a3e077bfa0520522d5';
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';
// const GEO_URL = 'http://api.openweathermap.org/geo/1.0/direct';
// const AQI_URL = 'http://api.openweathermap.org/data/2.5/air_pollution';
// const MAPS_URL = 'https://tile.openweathermap.org/map';

// // ==================================
// //         DOM Element References        
// // ==================================
// const DOMElements = {
//   cityInput: document.getElementById('cityInput'),
//   searchBtn: document.querySelector('.search-btn'),
//   locationBtn: document.querySelector('.location-btn'),
//   location: document.getElementById('location'),
//   temperature: document.getElementById('temperature'),
//   description: document.getElementById('description'),
//   tempMin: document.getElementById('temp-min'),
//   tempMax: document.getElementById('temp-max'),
//   feelsLike: document.getElementById('feelsLike'),
//   windSpeed: document.getElementById('wind-speed'),
//   windDirection: document.getElementById('wind-direction'),
//   humidity: document.getElementById('humidity'),
//   visibility: document.getElementById('visibility'),
//   cloudCover: document.getElementById('cloud-cover'),
//   pressure: document.getElementById('pressure'),
//   sunrise: document.getElementById('sunrise'),
//   sunset: document.getElementById('sunset'),
//   daylight: document.getElementById('daylight'),
//   latitude: document.getElementById('latitude'),
//   longitude: document.getElementById('longitude'),
//   recentSearches: document.getElementById('recentSearches'),
//   hourlyForecast: document.getElementById('hourlyForecast'),
//   forecastContainer: document.getElementById('forecast'),
//   weatherAlerts: document.getElementById('weatherAlerts'),
//   alertCount: document.getElementById('alertCount'),
//   aqiValue: document.getElementById('aqiValue'),
//   aqiCategory: document.getElementById('aqiCategory'),
//   loadingScreen: document.getElementById('loadingScreen'),
//   currentTime: document.getElementById('currentTime'),
//   currentDate: document.getElementById('currentDate'),
//   lottieContainer: document.getElementById('lottie'),
//   temperatureChart: document.getElementById('temperatureChart'),
//   mapTabs: document.querySelectorAll('.map-tab'),
//   mapDisplays: document.querySelectorAll('.map-display'),
//   mapImages: {
//     temperature: document.getElementById('tempMapImg'),
//     precipitation: document.getElementById('precipMapImg'), // assuming these exist
//     wind: document.getElementById('windMapImg'),
//     clouds: document.getElementById('cloudsMapImg')
//   },
//   alertToast: document.getElementById('alertToast'),
//   toastMessage: document.getElementById('toastMessage'),
//   toastCloseBtn: document.querySelector('.toast-close'),
//   navToggle: document.getElementById('navToggle'),
//   navMenu: document.getElementById('navMenu'),
//   navLinks: document.querySelectorAll('.nav-list .nav-link'),
//   backToTopBtn: document.getElementById('backToTop')
// };

// // Global State
// let currentCity = 'Lahore';
// let recentCities = JSON.parse(localStorage.getItem('recentCities')) || ['Lahore', 'Karachi', 'Islamabad'];
// let weatherAnimation;
// let temperatureChart;
// let currentCoords = { lat: 31.5204, lon: 74.3587 }; // Default to Lahore

// // ==================================
// //         Initialization & Event Listeners        
// // ==================================
// document.addEventListener('DOMContentLoaded', () => {
//   // Initial setup
//   DOMElements.loadingScreen.classList.add('hidden'); // Fix to ensure loading screen can be hidden

//   // Load weather for default city
//   fetchWeather(currentCity);
  
//   // Set up event listeners
//   DOMElements.cityInput.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') fetchWeather(DOMElements.cityInput.value);
//   });
//   DOMElements.searchBtn.addEventListener('click', () => fetchWeather(DOMElements.cityInput.value));
//   DOMElements.locationBtn.addEventListener('click', getLocation);
//   DOMElements.toastCloseBtn.addEventListener('click', () => DOMElements.alertToast.classList.remove('show'));

//   // Initialize UI components
//   updateRecentSearches();
//   updateDateTime();
//   setInterval(updateDateTime, 1000);
//   setupBackToTopButton();
//   setupMapTabs();
//   setupNavigation();
  
//   // Initialize GSAP animations for cards
//   gsap.from('.card', {
//     duration: 0.8,
//     y: 50,
//     opacity: 0,
//     stagger: 0.1,
//     ease: 'power2.out'
//   });
// });

// // ==================================
// //         Core Functions        
// // ==================================

// /**
//  * Fetches and displays all weather data for a given city.
//  * @param {string} city The name of the city.
//  */
// async function fetchWeather(city = currentCity) {
//   showLoading();
//   try {
//     const coords = await getCoordinates(city);
//     if (!coords) {
//       showError('City not found in Pakistan. Please try another city.');
//       return;
//     }

//     // Update global state
//     currentCity = city;
//     currentCoords = coords;
//     addToRecentCities(city);

//     const [weatherData, forecastData, airQualityData] = await Promise.all([
//       getWeatherData(coords.lat, coords.lon),
//       getForecastData(coords.lat, coords.lon),
//       getAirQualityData(coords.lat, coords.lon)
//     ]);

//     // Update UI components
//     updateLocationInfo(coords, city);
//     updateCurrentWeather(weatherData);
//     updateHourlyForecast(forecastData.list.slice(0, 8)); // Next 8 hours
//     update5DayForecast(forecastData.list);
//     updateAirQuality(airQualityData);
//     updateWeatherAnimation(weatherData.weather[0].main);
//     checkForAlerts(weatherData);
//     updateBackground(weatherData.weather[0].main, weatherData.dt, weatherData.sys.sunset);
    
//     // Load maps for the new location
//     loadAllMaps(coords.lat, coords.lon);

//   } catch (error) {
//     console.error('Error fetching weather data:', error);
//     showError('Failed to fetch weather data. Please check your API key and try again.');
//   } finally {
//     hideLoading();
//   }
// }

// /**
//  * Retrieves coordinates for a given city.
//  * @param {string} city The city name.
//  * @returns {object|null} An object with lat and lon, or null if not found.
//  */
// async function getCoordinates(city) {
//   try {
//     const response = await fetch(`${GEO_URL}?q=${city},Pakistan&limit=1&appid=${API_KEY}`);
//     if (!response.ok) throw new Error('Network response was not ok.');
//     const data = await response.json();
//     if (data.length > 0) {
//       return { lat: data[0].lat, lon: data[0].lon };
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching coordinates:', error);
//     return null;
//   }
// }

// /**
//  * Fetches current weather data.
//  * @param {number} lat Latitude.
//  * @param {number} lon Longitude.
//  * @returns {object} Weather data object.
//  */
// async function getWeatherData(lat, lon) {
//   const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
//   if (!response.ok) throw new Error('Failed to fetch current weather data.');
//   return await response.json();
// }

// /**
//  * Fetches 5-day forecast data.
//  * @param {number} lat Latitude.
//  * @param {number} lon Longitude.
//  * @returns {object} Forecast data object.
//  */
// async function getForecastData(lat, lon) {
//   const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
//   if (!response.ok) throw new Error('Failed to fetch forecast data.');
//   return await response.json();
// }

// /**
//  * Fetches air pollution data.
//  * @param {number} lat Latitude.
//  * @param {number} lon Longitude.
//  * @returns {object} Air pollution data object.
//  */
// async function getAirQualityData(lat, lon) {
//   const response = await fetch(`${AQI_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
//   if (!response.ok) throw new Error('Failed to fetch air quality data.');
//   return await response.json();
// }

// /**
//  * Retrieves the user's current location via Geolocation API.
//  */
// function getLocation() {
//   if (navigator.geolocation) {
//     showLoading();
//     const geoOptions = {
//       enableHighAccuracy: true,
//       timeout: 10000,
//       maximumAge: 0
//     };
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         const city = await getCityName(latitude, longitude);
//         if (city) {
//           fetchWeather(city);
//         } else {
//           showError('Could not determine city from your location. Defaulting to Lahore.');
//           fetchWeather('Lahore');
//         }
//       },
//       (error) => {
//         console.error('Geolocation error:', error);
//         showError('Unable to retrieve your location. Defaulting to Lahore.');
//         fetchWeather('Lahore');
//         hideLoading();
//       },
//       geoOptions
//     );
//   } else {
//     showError('Geolocation is not supported by your browser. Defaulting to Lahore.');
//     fetchWeather('Lahore');
//   }
// }

// /**
//  * Gets a city name from coordinates using a reverse geocoding API.
//  * @param {number} lat Latitude.
//  * @param {number} lon Longitude.
//  * @returns {string|null} The city name.
//  */
// async function getCityName(lat, lon) {
//   try {
//     const response = await fetch(`${GEO_URL}?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`);
//     const data = await response.json();
//     return data[0]?.name || null;
//   } catch (error) {
//     console.error('Error getting city name:', error);
//     return null;
//   }
// }

// /**
//  * Adds a city to the list of recent searches.
//  * @param {string} city The city name.
//  */
// function addToRecentCities(city) {
//   if (city && !recentCities.includes(city)) {
//     recentCities.unshift(city);
//     if (recentCities.length > 3) {
//       recentCities.pop();
//     }
//     localStorage.setItem('recentCities', JSON.stringify(recentCities));
//     updateRecentSearches();
//   }
// }

// // ==================================
// //         UI Update Functions        
// // ==================================

// function updateCurrentWeather(data) {
//   const { main, weather, wind, visibility, clouds, sys } = data;
  
//   DOMElements.location.textContent = `Weather in ${currentCity}`;
//   DOMElements.temperature.textContent = `${Math.round(main.temp)}°C`;
//   DOMElements.description.textContent = weather[0].description;
//   DOMElements.tempMin.textContent = `${Math.round(main.temp_min)}°`;
//   DOMElements.tempMax.textContent = `${Math.round(main.temp_max)}°`;
//   DOMElements.feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}°C`;
//   DOMElements.windSpeed.textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
//   DOMElements.windDirection.textContent = `(${getWindDirection(wind.deg)})`;
//   DOMElements.humidity.textContent = `${main.humidity}%`;
//   DOMElements.visibility.textContent = `${(visibility / 1000).toFixed(1)} km`;
//   DOMElements.cloudCover.textContent = `${clouds.all}%`;
//   DOMElements.pressure.textContent = `${main.pressure} hPa`;
  
//   const sunriseTime = new Date(sys.sunrise * 1000);
//   const sunsetTime = new Date(sys.sunset * 1000);
//   DOMElements.sunrise.textContent = sunriseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   DOMElements.sunset.textContent = sunsetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
//   const daylightMs = sys.sunset - sys.sunrise;
//   const daylightHours = Math.floor(daylightMs / 3600);
//   const daylightMinutes = Math.floor((daylightMs % 3600) / 60);
//   DOMElements.daylight.textContent = `${daylightHours}h ${daylightMinutes}m`;
// }

// function updateHourlyForecast(hourlyData) {
//   DOMElements.hourlyForecast.innerHTML = '';
//   hourlyData.forEach(hour => {
//     const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit' });
//     const temp = Math.round(hour.main.temp);
//     const icon = getWeatherIcon(hour.weather[0].main);
    
//     const hourElement = document.createElement('div');
//     hourElement.className = 'hourly-item';
//     hourElement.innerHTML = `
//       <div class="hour-time">${time}</div>
//       <div class="hour-icon">${icon}</div>
//       <div class="hour-temp">${temp}°</div>
//     `;
//     DOMElements.hourlyForecast.appendChild(hourElement);
//   });
// }

// function update5DayForecast(forecastData) {
//   DOMElements.forecastContainer.innerHTML = '';
//   const dailyData = {};
//   forecastData.forEach(item => {
//     const date = new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' });
//     if (!dailyData[date]) {
//       dailyData[date] = { temps: [], weather: item.weather[0].main, description: item.weather[0].description };
//     }
//     dailyData[date].temps.push(item.main.temp);
//   });
  
//   Object.entries(dailyData).slice(0, 5).forEach(([day, data]) => {
//     const minTemp = Math.round(Math.min(...data.temps));
//     const maxTemp = Math.round(Math.max(...data.temps));
//     const icon = getWeatherIcon(data.weather);
    
//     const dayElement = document.createElement('div');
//     dayElement.className = 'forecast-day';
//     dayElement.innerHTML = `
//       <h4>${day}</h4>
//       <div class="forecast-icon">${icon}</div>
//       <div class="forecast-temp">
//         <span>${minTemp}°</span> / <span>${maxTemp}°</span>
//       </div>
//       <div class="forecast-desc">${data.description}</div>
//     `;
//     DOMElements.forecastContainer.appendChild(dayElement);
//   });
  
//   updateTemperatureChart(forecastData.slice(0, 24));
// }

// function updateTemperatureChart(hourlyData) {
//   if (temperatureChart) {
//     temperatureChart.destroy();
//   }
  
//   const ctx = DOMElements.temperatureChart.getContext('2d');
//   const labels = hourlyData.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' }));
//   const temps = hourlyData.map(item => Math.round(item.main.temp));
  
//   temperatureChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Temperature (°C)',
//         data: temps,
//         borderColor: '#f72585',
//         backgroundColor: 'rgba(247, 37, 133, 0.1)',
//         borderWidth: 2,
//         tension: 0.3,
//         fill: true,
//         pointStyle: 'circle',
//         pointRadius: 5,
//         pointHoverRadius: 8
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           backgroundColor: 'rgba(0, 0, 0, 0.8)',
//           titleColor: '#fff',
//           bodyColor: '#fff',
//           callbacks: {
//             label: function(context) {
//               let label = context.dataset.label || '';
//               if (label) {
//                 label += ': ';
//               }
//               if (context.parsed.y !== null) {
//                 label += `${context.parsed.y}°C`;
//               }
//               return label;
//             }
//           }
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: false,
//           grid: { color: 'rgba(255,255,255,0.1)' },
//           ticks: { color: 'rgba(255,255,255,0.7)' }
//         },
//         x: {
//           grid: { display: false },
//           ticks: { color: 'rgba(255,255,255,0.7)' }
//         }
//       }
//     }
//   });
// }

// function updateAirQuality(data) {
//   const aqi = data.list[0].main.aqi;
//   const pollutants = data.list[0].components;
  
//   DOMElements.aqiValue.textContent = aqi;
//   const { category, color } = getAQICategory(aqi);
//   DOMElements.aqiCategory.textContent = category;
//   DOMElements.aqiValue.style.backgroundColor = color;
  
//   document.getElementById('pm25').textContent = `${pollutants.pm2_5.toFixed(1)} μg/m³`;
//   document.getElementById('pm10').textContent = `${pollutants.pm10.toFixed(1)} μg/m³`;
//   document.getElementById('o3').textContent = `${pollutants.o3.toFixed(1)} μg/m³`;
//   document.getElementById('no2').textContent = `${pollutants.no2.toFixed(1)} μg/m³`;
//   document.getElementById('so2').textContent = `${pollutants.so2.toFixed(1)} μg/m³`;
//   document.getElementById('co').textContent = `${pollutants.co.toFixed(1)} mg/m³`;
  
//   updatePollutantBar('pm25Level', pollutants.pm2_5, 50);
//   updatePollutantBar('pm10Level', pollutants.pm10, 100);
//   updatePollutantBar('o3Level', pollutants.o3, 100);
//   updatePollutantBar('no2Level', pollutants.no2, 100);
//   updatePollutantBar('so2Level', pollutants.so2, 100);
//   updatePollutantBar('coLevel', pollutants.co, 5);
  
//   updateHealthRecommendations(aqi);
// }

// function updateHealthRecommendations(aqi) {
//   const recommendationsElement = document.getElementById('healthRecommendations');
//   recommendationsElement.innerHTML = '';
  
//   let recommendations = [];
//   if (aqi <= 50) { recommendations = ['Perfect day for outdoor activities', 'Great air quality for everyone']; }
//   else if (aqi <= 100) { recommendations = ['Good air quality for most people', 'Unusually sensitive individuals should consider reducing prolonged outdoor exertion']; }
//   else if (aqi <= 150) { recommendations = ['Sensitive groups should reduce outdoor exertion', 'People with heart or lung disease, older adults, and children should limit prolonged outdoor activity']; }
//   else if (aqi <= 200) { recommendations = ['Everyone may begin to experience health effects', 'Sensitive groups should avoid prolonged outdoor exertion', 'Consider wearing an N95 mask outdoors']; }
//   else if (aqi <= 300) { recommendations = ['Health alert - everyone may experience more serious health effects', 'Avoid outdoor activities', 'Use air purifiers indoors', 'Keep windows and doors closed']; }
//   else { recommendations = ['Health warning of emergency conditions', 'Everyone should avoid all outdoor exertion', 'Stay indoors with air purifiers running', 'Consider temporarily relocating if possible']; }
  
//   recommendations.forEach(rec => {
//     const recElement = document.createElement('div');
//     recElement.className = 'recommendation';
//     recElement.innerHTML = `<i class="fas fa-check-circle"></i><p>${rec}</p>`;
//     recommendationsElement.appendChild(recElement);
//   });
// }

// function updateLocationInfo(coords, city) {
//   DOMElements.latitude.textContent = `${coords.lat.toFixed(4)}° N`;
//   DOMElements.longitude.textContent = `${coords.lon.toFixed(4)}° E`;
//   DOMElements.cityInput.value = city;
// }

// function updateWeatherAnimation(weatherCondition) {
//   let animationPath = 'animations/partly-cloudy.json'; // Default animation
  
//   switch (weatherCondition.toLowerCase()) {
//     case 'clear': animationPath = 'animations/sunny.json'; break;
//     case 'clouds': animationPath = 'animations/cloudy.json'; break;
//     case 'rain': case 'drizzle': animationPath = 'animations/rain.json'; break;
//     case 'thunderstorm': animationPath = 'animations/thunderstorm.json'; break;
//     case 'snow': animationPath = 'animations/snow.json'; break;
//     case 'mist': case 'fog': case 'haze': animationPath = 'animations/fog.json'; break;
//   }
  
//   if (weatherAnimation) {
//     weatherAnimation.destroy();
//   }
  
//   weatherAnimation = lottie.loadAnimation({
//     container: DOMElements.lottieContainer,
//     renderer: 'svg',
//     loop: true,
//     autoplay: true,
//     path: animationPath
//   });
// }

// function updateBackground(weatherCondition, currentTime, sunsetTime) {
//   const isDaytime = currentTime < sunsetTime;
//   let gradient;
  
//   switch (weatherCondition.toLowerCase()) {
//     case 'clear': gradient = isDaytime ? 'var(--gradient-day)' : 'var(--gradient-night)'; break;
//     case 'rain': case 'drizzle': gradient = 'var(--gradient-rain)'; break;
//     case 'thunderstorm': gradient = 'linear-gradient(135deg, #0f0c29, #302b63)'; break;
//     case 'snow': gradient = 'linear-gradient(135deg, #e0eafc, #cfdef3)'; break;
//     case 'clouds': gradient = isDaytime ? 'linear-gradient(135deg, #bdc3c7, #2c3e50)' : 'var(--gradient-night)'; break;
//     default: gradient = 'var(--gradient-default)';
//   }
//   document.body.style.background = gradient;
// }

// function checkForAlerts(currentWeather) {
//   const alerts = [];
//   const currentTemp = currentWeather.main.temp;
  
//   if (currentTemp > 40) alerts.push({ type: 'extreme heat', severity: 'red', message: `Extreme heat warning: ${currentTemp}°C in ${currentCity}. Stay hydrated.` });
//   else if (currentTemp < 5) alerts.push({ type: 'cold wave', severity: 'blue', message: `Cold weather alert: ${currentTemp}°C in ${currentCity}. Dress warmly.` });
  
//   if (currentWeather.weather[0].main === 'Rain' && currentWeather.rain && currentWeather.rain['1h'] > 10) {
//     alerts.push({ type: 'heavy rain', severity: 'orange', message: `Heavy rainfall alert: ${currentWeather.rain['1h']}mm in the past hour. Potential flooding risk.` });
//   }
  
//   updateAlertsDisplay(alerts);
// }

// function updateAlertsDisplay(alerts) {
//   DOMElements.weatherAlerts.innerHTML = '';
//   DOMElements.alertCount.textContent = alerts.length;
  
//   if (alerts.length === 0) {
//     DOMElements.weatherAlerts.innerHTML = `<div class="no-alerts"><i class="fas fa-check-circle"></i><p>No active weather alerts for your location</p></div>`;
//     return;
//   }
  
//   alerts.forEach(alert => {
//     const alertElement = document.createElement('div');
//     alertElement.className = `alert ${alert.severity}`;
//     alertElement.innerHTML = `<div class="alert-icon"><i class="fas fa-exclamation-triangle"></i></div><div class="alert-content"><h4>${alert.type.toUpperCase()} ALERT</h4><p>${alert.message}</p></div>`;
//     DOMElements.weatherAlerts.appendChild(alertElement);
    
//     if (alert.severity === 'red' || alert.severity === 'orange') {
//       showAlertToast(alert.message);
//     }
//   });
// }

// function showAlertToast(message) {
//   DOMElements.toastMessage.textContent = message;
//   DOMElements.alertToast.classList.add('show');
  
//   setTimeout(() => {
//     DOMElements.alertToast.classList.remove('show');
//   }, 5000);
// }

// function updateRecentSearches() {
//   DOMElements.recentSearches.innerHTML = '<span>Recent:</span>';
//   recentCities.forEach(city => {
//     const cityElement = document.createElement('span');
//     cityElement.className = 'recent-city';
//     cityElement.textContent = city;
//     cityElement.addEventListener('click', () => fetchWeather(city));
//     DOMElements.recentSearches.appendChild(cityElement);
//   });
// }

// // ==================================
// //         Utility & Helper Functions        
// // ==================================

// function updateDateTime() {
//   const now = new Date();
//   DOMElements.currentTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   DOMElements.currentDate.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
// }

// function setupBackToTopButton() {
//   window.addEventListener('scroll', () => {
//     if (window.pageYOffset > 300) {
//       DOMElements.backToTopBtn.style.display = 'block';
//     } else {
//       DOMElements.backToTopBtn.style.display = 'none';
//     }
//   });
//   DOMElements.backToTopBtn.addEventListener('click', () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   });
// }

// function setupMapTabs() {
//   DOMElements.mapTabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//       DOMElements.mapTabs.forEach(t => t.classList.remove('active'));
//       DOMElements.mapDisplays.forEach(d => d.classList.remove('active'));
      
//       tab.classList.add('active');
//       const mapType = tab.dataset.map;
//       document.getElementById(`${mapType}Map`).classList.add('active');
//     });
//   });
// }

// function loadAllMaps(lat, lon) {
//   const zoomLevel = 8; // Adjust based on your preference
//   const tileX = Math.floor((lon + 180) / 360 * Math.pow(2, zoomLevel));
//   const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoomLevel));

//   const mapTypes = ['temperature', 'precipitation', 'wind', 'clouds'];
//   mapTypes.forEach(type => {
//     const img = DOMElements.mapImages[type];
//     if (img) {
//       img.src = `${MAPS_URL}/2.0/weather/${type}_new/${zoomLevel}/${tileX}/${tileY}?appid=${API_KEY}`;
//     }
//   });
// }

// function setupNavigation() {
//   if (DOMElements.navToggle && DOMElements.navMenu) {
//     DOMElements.navToggle.addEventListener('click', () => {
//       DOMElements.navMenu.classList.toggle('show');
//     });
//   }
//   DOMElements.navLinks.forEach(link => {
//     link.addEventListener('click', () => {
//       DOMElements.navMenu.classList.remove('show');
//       DOMElements.navLinks.forEach(l => l.classList.remove('active'));
//       link.classList.add('active');
//     });
//   });
// }

// function getWindDirection(degrees) {
//   const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
//   const index = Math.round((degrees % 360) / 45) % 8;
//   return directions[index];
// }

// function getWeatherIcon(condition) {
//   const icons = {
//     'clear': '<i class="fas fa-sun"></i>',
//     'clouds': '<i class="fas fa-cloud"></i>',
//     'rain': '<i class="fas fa-cloud-rain"></i>',
//     'thunderstorm': '<i class="fas fa-bolt"></i>',
//     'snow': '<i class="fas fa-snowflake"></i>',
//     'mist': '<i class="fas fa-smog"></i>',
//     'fog': '<i class="fas fa-smog"></i>',
//     'haze': '<i class="fas fa-smog"></i>',
//     'drizzle': '<i class="fas fa-cloud-rain"></i>'
//   };
//   return icons[condition.toLowerCase()] || '<i class="fas fa-cloud-sun"></i>';
// }

// function getAQICategory(aqi) {
//   if (aqi <= 50) return { category: 'Good', color: '#00e400' };
//   if (aqi <= 100) return { category: 'Moderate', color: '#ffff00' };
//   if (aqi <= 150) return { category: 'Unhealthy for Sensitive', color: '#ff7e00' };
//   if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000' };
//   if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97' };
//   return { category: 'Hazardous', color: '#7e0023' };
// }

// function updatePollutantBar(elementId, value, maxValue) {
//   const element = document.getElementById(elementId);
//   if (!element) return;
//   const percentage = Math.min((value / maxValue) * 100, 100);
//   element.style.width = `${percentage}%`;
  
//   if (percentage < 50) element.style.backgroundColor = '#4CAF50';
//   else if (percentage < 75) element.style.backgroundColor = '#FFC107';
//   else if (percentage < 100) element.style.backgroundColor = '#FF9800';
//   else element.style.backgroundColor = '#F44336';
// }

// function showLoading() {
//   DOMElements.loadingScreen.classList.remove('hidden');
//   DOMElements.loadingScreen.style.display = 'flex';
//   gsap.from(DOMElements.loadingScreen, {
//     duration: 0.5,
//     opacity: 0,
//     ease: 'power2.out'
//   });
// }

// function hideLoading() {
//   gsap.to(DOMElements.loadingScreen, {
//     duration: 0.3,
//     opacity: 0,
//     ease: 'power2.in',
//     onComplete: () => {
//       DOMElements.loadingScreen.classList.add('hidden');
//     }
//   });
// }

// function showError(message) {
//   console.error('Error:', message);
//   const toast = DOMElements.alertToast;
//   const toastMessage = DOMElements.toastMessage;
//   if (toast && toastMessage) {
//     toastMessage.textContent = message;
//     toast.classList.add('show', 'error');
    
//     setTimeout(() => {
//       toast.classList.remove('show', 'error');
//     }, 5000);
//   }
// }
// ==================================
//          Dummy Data
// ==================================
const DUMMY_WEATHER_DATA = {
  main: {
    temp: 35,
    temp_min: 28,
    temp_max: 38,
    feels_like: 38,
    humidity: 65,
    pressure: 1012
  },
  weather: [{
    description: "clear sky",
    main: "Clear"
  }],
  wind: {
    speed: 4.1,
    deg: 90
  },
  visibility: 10000,
  clouds: {
    all: 10
  },
  sys: {
    sunrise: 1722485700, // Dummy sunrise time
    sunset: 1722534300 // Dummy sunset time
  },
  dt: 1722515700
};

const DUMMY_FORECAST_DATA = {
  list: [{
    dt: 1722522000,
    main: {
      temp: 36
    },
    weather: [{
      main: "Clear"
    }]
  }, {
    dt: 1722525600,
    main: {
      temp: 37
    },
    weather: [{
      main: "Clouds"
    }]
  }, {
    dt: 1722529200,
    main: {
      temp: 37
    },
    weather: [{
      main: "Clouds"
    }]
  }, {
    dt: 1722532800,
    main: {
      temp: 36
    },
    weather: [{
      main: "Rain"
    }]
  }, {
    dt: 1722536400,
    main: {
      temp: 34
    },
    weather: [{
      main: "Thunderstorm"
    }]
  }, {
    dt: 1722540000,
    main: {
      temp: 32
    },
    weather: [{
      main: "Clear"
    }]
  }, {
    dt: 1722543600,
    main: {
      temp: 31
    },
    weather: [{
      main: "Clouds"
    }]
  }, {
    dt: 1722547200,
    main: {
      temp: 30
    },
    weather: [{
      main: "Clear"
    }]
  }, {
    dt: 1722550800,
    main: {
      temp: 29
    },
    weather: [{
      main: "Clear"
    }]
  }, {
    dt: 1722554400,
    main: {
      temp: 28
    },
    weather: [{
      main: "Clear"
    }]
  }]
};

// Dummy air quality data with a 'list' property
const DUMMY_AQI_DATA = {
  list: [{
    components: {
      aqi: 2
    },
    main: {
      aqi: 2
    }
  }]
};

// Dummy weather alert data
const DUMMY_ALERTS = [{
  event: "Heavy Rainfall Warning",
  sender_name: "Pakistan Met Department",
  start: 1722515700,
  end: 1722525700,
  description: "Expect heavy rainfall and flash floods in low-lying areas. Avoid unnecessary travel.",
  severity: "High"
}];

// ==================================
//         DOM Element References
// ==================================
const DOMElements = {
  cityInput: document.getElementById('cityInput'),
  searchBtn: document.querySelector('.search-btn'),
  locationBtn: document.querySelector('.location-btn'),
  location: document.getElementById('location'),
  temperature: document.getElementById('temperature'),
  description: document.getElementById('description'),
  tempMin: document.getElementById('temp-min'),
  tempMax: document.getElementById('temp-max'),
  feelsLike: document.getElementById('feelsLike'),
  windSpeed: document.getElementById('wind-speed'),
  windDirection: document.getElementById('wind-direction'),
  humidity: document.getElementById('humidity'),
  visibility: document.getElementById('visibility'),
  cloudCover: document.getElementById('cloud-cover'),
  pressure: document.getElementById('pressure'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  daylight: document.getElementById('daylight'),
  latitude: document.getElementById('latitude'),
  longitude: document.getElementById('longitude'),
  recentSearches: document.getElementById('recentSearches'),
  hourlyForecast: document.getElementById('hourlyForecast'),
  forecastContainer: document.getElementById('forecast'),
  weatherAlerts: document.getElementById('weatherAlerts'),
  alertCount: document.getElementById('alertCount'),
  aqiValue: document.getElementById('aqiValue'),
  aqiCategory: document.getElementById('aqiCategory'),
  loadingScreen: document.getElementById('loadingScreen'),
  currentTime: document.getElementById('currentTime'),
  currentDate: document.getElementById('currentDate'),
  lottieContainer: document.getElementById('lottie'),
  temperatureChart: document.getElementById('temperatureChart'),
  mapTabs: document.querySelectorAll('.map-tab'),
  mapDisplays: document.querySelectorAll('.map-display'),
  mapImages: {
    temperature: document.getElementById('tempMapImg'),
    precipitation: document.getElementById('precipMapImg'),
    wind: document.getElementById('windMapImg'),
    clouds: document.getElementById('cloudsMapImg')
  },
  alertToast: document.getElementById('alertToast'),
  toastMessage: document.getElementById('toastMessage'),
  toastCloseBtn: document.querySelector('.toast-close'),
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  navLinks: document.querySelectorAll('.nav-list .nav-link'),
  backToTopBtn: document.getElementById('backToTop'),
  aboutSection: document.getElementById('about')
};

// Global State
let currentCity = 'Lahore';
let recentCities = JSON.parse(localStorage.getItem('recentCities')) || ['Lahore', 'Karachi', 'Islamabad'];
let weatherAnimation;
let temperatureChart;
let currentCoords = {
  lat: 31.5204,
  lon: 74.3587
}; // Default to Lahore

// ==================================
//      Initialization & Event Listeners
// ==================================
document.addEventListener('DOMContentLoaded', () => {
  // Remove this line, as it will be handled by the loading functions
  // DOMElements.loadingScreen.classList.add('hidden'); 
  fetchWeather(currentCity); // This call will now show and then hide the loader.

  DOMElements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather(DOMElements.cityInput.value);
  });
  DOMElements.searchBtn.addEventListener('click', () => fetchWeather(DOMElements.cityInput.value));
  DOMElements.locationBtn.addEventListener('click', () => {
    showError('Geolocation is disabled in this dummy data version.');
    fetchWeather('Lahore');
  });
  DOMElements.toastCloseBtn.addEventListener('click', () => DOMElements.alertToast.classList.remove('show'));

  updateRecentSearches();
  updateDateTime();
  setInterval(updateDateTime, 1000);
  setupBackToTopButton();
  setupMapTabs();
  setupNavigation();

  // Initialize GSAP animations for cards
  gsap.from('.card', {
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out'
  });
});

// ==================================
//         Core Functions
// ==================================

/**
 * Fetches and displays all weather data for a given city.
 * @param {string} city The name of the city.
 */
async function fetchWeather(city = currentCity) {
  showLoading();
  // Using dummy data instead of API calls
  updateLocationInfo(currentCoords, city);
  updateCurrentWeather(DUMMY_WEATHER_DATA);
  updateHourlyForecast(DUMMY_FORECAST_DATA.list.slice(0, 8));
  update5DayForecast(DUMMY_FORECAST_DATA.list);
  updateAirQuality(DUMMY_AQI_DATA);
  updateWeatherAnimation(DUMMY_WEATHER_DATA.weather[0].main);
  checkForAlerts();
  updateBackground(DUMMY_WEATHER_DATA.weather[0].main, DUMMY_WEATHER_DATA.dt, DUMMY_WEATHER_DATA.sys.sunset);
  loadAllMaps();
  addToRecentCities(city);
  // hideLoading() will be called at the end of the fetch
  hideLoading(); 
}

// Dummy API functions
async function getCoordinates(city) {
  return {
    lat: 31.5204,
    lon: 74.3587
  };
}

async function getWeatherData(lat, lon) {
  return DUMMY_WEATHER_DATA;
}

async function getForecastData(lat, lon) {
  return DUMMY_FORECAST_DATA;
}

async function getAirQualityData(lat, lon) {
  return DUMMY_AQI_DATA;
}

function getLocation() {
  showError('Geolocation is disabled in this dummy data version.');
  fetchWeather('Lahore');
}

async function getCityName(lat, lon) {
  return "Lahore";
}

function addToRecentCities(city) {
  if (city && !recentCities.includes(city)) {
    recentCities.unshift(city);
    if (recentCities.length > 3) {
      recentCities.pop();
    }
    localStorage.setItem('recentCities', JSON.stringify(recentCities));
    updateRecentSearches();
  }
}

// ==================================
//         UI Update Functions
// ==================================
function updateCurrentWeather(data) {
  const {
    main,
    weather,
    wind,
    visibility,
    clouds,
    sys
  } = data;
  DOMElements.location.textContent = `Weather in ${currentCity}`;
  DOMElements.temperature.textContent = `${Math.round(main.temp)}°C`;
  DOMElements.description.textContent = weather[0].description;
  DOMElements.tempMin.textContent = `${Math.round(main.temp_min)}°`;
  DOMElements.tempMax.textContent = `${Math.round(main.temp_max)}°`;
  DOMElements.feelsLike.textContent = `Feels like ${Math.round(main.feels_like)}°C`;
  DOMElements.windSpeed.textContent = `${(wind.speed * 3.6).toFixed(1)} km/h`;
  DOMElements.windDirection.textContent = `(${getWindDirection(wind.deg)})`;
  DOMElements.humidity.textContent = `${main.humidity}%`;
  DOMElements.visibility.textContent = `${(visibility / 1000).toFixed(1)} km`;
  DOMElements.cloudCover.textContent = `${clouds.all}%`;
  DOMElements.pressure.textContent = `${main.pressure} hPa`;
  const sunriseTime = new Date(sys.sunrise * 1000);
  const sunsetTime = new Date(sys.sunset * 1000);
  DOMElements.sunrise.textContent = sunriseTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  DOMElements.sunset.textContent = sunsetTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  DOMElements.daylight.textContent = formatDaylightDuration(sys.sunrise, sys.sunset);
}

function updateHourlyForecast(data) {
  const container = DOMElements.hourlyForecast;
  container.innerHTML = '';
  data.forEach(item => {
    const time = new Date(item.dt * 1000).getHours();
    const temp = Math.round(item.main.temp);
    const iconClass = getWeatherIcon(item.weather[0].main);

    const hourlyItem = document.createElement('div');
    hourlyItem.classList.add('hourly-item');
    hourlyItem.innerHTML = `
            <div class="hourly-time">${time}:00</div>
            <div class="hourly-icon"><i class="${iconClass}"></i></div>
            <div class="hourly-temp">${temp}°</div>
        `;
    container.appendChild(hourlyItem);
  });
}

function update5DayForecast(data) {
  const dailyData = groupForecastByDay(data);
  const container = DOMElements.forecastContainer;
  container.innerHTML = '';
  const labels = [];
  const minTemps = [];
  const maxTemps = [];

  dailyData.forEach((day, index) => {
    if (index < 5) {
      const date = new Date(day.timestamp * 1000);
      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'short'
      });
      const dateString = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      const tempMin = Math.round(day.minTemp);
      const tempMax = Math.round(day.maxTemp);
      const description = day.description;
      const iconClass = getWeatherIcon(day.icon);

      const forecastItem = document.createElement('div');
      forecastItem.classList.add('forecast-item');
      forecastItem.innerHTML = `
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-date">${dateString}</div>
                <div class="forecast-icon"><i class="${iconClass}"></i></div>
                <div class="forecast-temp">${tempMax}° / ${tempMin}°</div>
                <div class="forecast-desc">${description}</div>
            `;
      container.appendChild(forecastItem);

      labels.push(dayName);
      minTemps.push(tempMin);
      maxTemps.push(tempMax);
    }
  });
  renderTemperatureChart(labels, minTemps, maxTemps);
}

function updateAirQuality(data) {
  if (data && data.list && data.list.length > 0) {
    const aqi = data.list[0].main.aqi;
    let aqiCategory = '';
    let aqiStatus = '';
    let aqiColor = '';

    if (aqi === 1) {
      aqiCategory = 'Good';
      aqiStatus = 'Air quality is considered satisfactory, and air pollution poses little or no risk.';
      aqiColor = '#00e400';
    } else if (aqi === 2) {
      aqiCategory = 'Moderate';
      aqiStatus = 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people.';
      aqiColor = '#ffff00';
    } else if (aqi === 3) {
      aqiCategory = 'Unhealthy for Sensitive Groups';
      aqiStatus = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
      aqiColor = '#ff7e00';
    } else if (aqi === 4) {
      aqiCategory = 'Unhealthy';
      aqiStatus = 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.';
      aqiColor = '#ff0000';
    } else if (aqi === 5) {
      aqiCategory = 'Very Unhealthy';
      aqiStatus = 'Health warnings of emergency conditions. The entire population is more likely to be affected.';
      aqiColor = '#8f3f97';
    } else if (aqi === 6) {
      aqiCategory = 'Hazardous';
      aqiStatus = 'Health alert: everyone may experience more serious health effects.';
      aqiColor = '#7e0023';
    }

    const aqiScaleElement = DOMElements.aqiCategory;
    if (aqiScaleElement) {
      aqiScaleElement.textContent = aqiCategory;
      aqiScaleElement.style.color = aqiColor;
      // You can also add more details to the HTML if you have elements for them
    }
  } else {
    showError('Air Quality data not available.');
  }
}

/**
 * Dummy function to check for weather alerts.
 */
function checkForAlerts() {
  const container = DOMElements.weatherAlerts;
  const countBadge = DOMElements.alertCount;
  container.innerHTML = '';

  if (DUMMY_ALERTS.length > 0) {
    countBadge.textContent = DUMMY_ALERTS.length;
    DOMElements.alertToast.classList.add('show');
    DOMElements.toastMessage.textContent = `${DUMMY_ALERTS.length} Weather Alert${DUMMY_ALERTS.length > 1 ? 's' : ''} in effect.`;

    DUMMY_ALERTS.forEach(alert => {
      const alertItem = document.createElement('div');
      alertItem.classList.add('alert-item');
      alertItem.classList.add(alert.severity.toLowerCase());
      alertItem.innerHTML = `
                <div class="alert-icon"><i class="fas fa-bell"></i></div>
                <div class="alert-info">
                    <h4 class="alert-title">${alert.event}</h4>
                    <p class="alert-description">${alert.description}</p>
                    <div class="alert-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(alert.start * 1000).toLocaleDateString()}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(alert.start * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(alert.end * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span><i class="fas fa-user-shield"></i> ${alert.sender_name}</span>
                    </div>
                </div>
            `;
      container.appendChild(alertItem);
    });
  } else {
    countBadge.textContent = '0';
    DOMElements.alertToast.classList.remove('show');
    container.innerHTML = `
            <div class="no-alerts">
                <i class="fas fa-bell-slash"></i>
                <p>No active weather alerts for this city.</p>
            </div>
        `;
  }
}

/**
 * Dummy function to load weather maps.
 */
function loadAllMaps() {
  const dummyMapUrl = 'https://via.placeholder.com/600x400/1e293b/ffffff?text=Dummy+Map';
  DOMElements.mapImages.temperature.src = dummyMapUrl;
  DOMElements.mapImages.precipitation.src = dummyMapUrl;
  DOMElements.mapImages.wind.src = dummyMapUrl;
  DOMElements.mapImages.clouds.src = dummyMapUrl;
}

// Rest of the functions remain the same
function groupForecastByDay(forecastList) {
  const dailyData = new Map();
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyData.has(date)) {
      dailyData.set(date, {
        minTemp: item.main.temp,
        maxTemp: item.main.temp,
        icon: item.weather[0].main,
        description: item.weather[0].description,
        timestamp: item.dt
      });
    } else {
      const day = dailyData.get(date);
      if (item.main.temp < day.minTemp) day.minTemp = item.main.temp;
      if (item.main.temp > day.maxTemp) day.maxTemp = item.main.temp;
    }
  });
  return Array.from(dailyData.values());
}

function getWeatherIcon(weatherMain) {
  switch (weatherMain) {
    case 'Clear':
      return 'fas fa-sun';
    case 'Clouds':
      return 'fas fa-cloud';
    case 'Rain':
      return 'fas fa-cloud-showers-heavy';
    case 'Drizzle':
      return 'fas fa-cloud-rain';
    case 'Thunderstorm':
      return 'fas fa-bolt';
    case 'Snow':
      return 'fas fa-snowflake';
    case 'Mist':
    case 'Smoke':
    case 'Haze':
    case 'Dust':
    case 'Fog':
    case 'Sand':
    case 'Ash':
    case 'Squall':
    case 'Tornado':
      return 'fas fa-smog';
    default:
      return 'fas fa-cloud-sun';
  }
}

function getWindDirection(degrees) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45);
  return directions[index % 8];
}

function formatDaylightDuration(sunrise, sunset) {
  const diff = sunset - sunrise;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function showLoading() {
  DOMElements.loadingScreen.classList.remove('hidden');
}

function hideLoading() {
  DOMElements.loadingScreen.classList.add('hidden');
}

function showError(message) {
  alert(message);
  hideLoading();
}

function updateDateTime() {
  const now = new Date();
  DOMElements.currentTime.textContent = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  DOMElements.currentDate.textContent = now.toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function updateRecentSearches() {
  const container = DOMElements.recentSearches;
  container.innerHTML = '<span>Recent:</span>';
  recentCities.forEach(city => {
    const span = document.createElement('span');
    span.textContent = city;
    span.classList.add('city-btn');
    span.onclick = () => fetchWeather(city);
    container.appendChild(span);
  });
}

function setupBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function renderTemperatureChart(labels, minTemps, maxTemps) {
  const ctx = DOMElements.temperatureChart.getContext('2d');
  if (temperatureChart) {
    temperatureChart.destroy();
  }

  temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Max Temp (°C)',
        data: maxTemps,
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.2)',
        tension: 0.4,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 8
      }, {
        label: 'Min Temp (°C)',
        data: minTemps,
        borderColor: '#4facfe',
        backgroundColor: 'rgba(79, 172, 254, 0.2)',
        tension: 0.4,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#b3b3c7'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#b3b3c7'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ffffff'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += `${context.parsed.y}°C`;
              }
              return label;
            }
          }
        }
      }
    }
  });
}

function setupMapTabs() {
  DOMElements.mapTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      DOMElements.mapTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mapType = tab.dataset.mapType;
      DOMElements.mapDisplays.forEach(display => {
        display.classList.remove('active');
        if (display.id === `${mapType}Map`) {
          display.classList.add('active');
        }
      });
    });
  });
}

function setupNavigation() {
  DOMElements.navToggle.addEventListener('click', () => {
    DOMElements.navMenu.classList.toggle('show');
  });

  DOMElements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      DOMElements.navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      DOMElements.navMenu.classList.remove('show');
      // Smooth scroll to section
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - DOMElements.navMenu.offsetHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}