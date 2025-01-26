let cityInput = document.getElementById("city-input"),
    searchBtn = document.getElementById("searchBtn"),
    locationBtn = document.getElementById("locationBtn"),
    addCityBtn = document.getElementById("addCityBtn"),
    favoriteCitiesList = document.getElementById("favoriteCitiesList"),
    api_Key = "6e98a32c37bf892173bd45336d21daee",
    currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
    fiveDaysForecast = document.querySelector('.day-forecast'),
    aqiCard = document.querySelectorAll('.highlights .card')[0],
    sunriseCard = document.querySelectorAll('.highlights .card')[1],
    humidityVal = document.getElementById('humidityVal'),
    pressureVal = document.getElementById('pressureVal'),
    visibilityVal = document.getElementById('visibilityVal'),
    windspeedVal = document.getElementById('windspeedVal'),
    feelsVal = document.getElementById('feelsVal'),
    hourlyForecastCard = document.querySelector('.hourly-forecast');

const aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

// Retrieve favorite cities from localStorage
function loadFavoriteCities() {
    const cities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    favoriteCitiesList.innerHTML = cities.map(city => `<li>${city}</li>`).join('');
}

// Save favorite cities to localStorage
function saveFavoriteCities(cities) {
    localStorage.setItem('favoriteCities', JSON.stringify(cities));
}

// Add city to favorite cities list
function addFavoriteCity(cityName) {
    const cities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!cities.includes(cityName)) {
        cities.push(cityName);
        saveFavoriteCities(cities);
        loadFavoriteCities();
    }
}

// Fetch weather details based on city coordinates
function getWeatherDetails(name, lat, lon, country, state) {
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`,
        WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`,
        AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_Key}`;

    fetch(AIR_POLLUTION_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqiCard.innerHTML = `
        <div class="card-head">
            <p>Air Quality Index</p>
            <p class="air-index-aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices">
            <i class="fa-regular fa-wind fa-3x"></i>
            <div class="item"><p>PM2.5</p><h2>${pm2_5}</h2></div>
            <div class="item"><p>PM10</p><h2>${pm10}</h2></div>
            <div class="item"><p>SO2</p><h2>${so2}</h2></div>
            <div class="item"><p>CO</p><h2>${co}</h2></div>
            <div class="item"><p>NO</p><h2>${no}</h2></div>
            <div class="item"><p>NO2</p><h2>${no2}</h2></div>
            <div class="item"><p>NH3</p><h2>${nh3}</h2></div>
            <div class="item"><p>O3</p><h2>${o3}</h2></div>
        </div>`;
    }).catch(() => alert('Failed to fetch Air Quality Index'));

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
            <div class="details">
                <p>Now</p>
                <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                <p>${data.weather[0].description}</p>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
            </div>
        </div>
        <hr>
        <div class="card-footer">
            <p><i class="fa-light fa-calendar"></i>${date.toLocaleDateString()}</p>
            <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
        </div>`;

        let {sunrise, sunset} = data.sys,
            {timezone} = data,
            {humidity, pressure, feels_like} = data.main,
            {speed} = data.wind,
            sRiseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A'),
            sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

        sunriseCard.innerHTML = `
        <div class="card-head"><p>Sunrise & Sunset</p></div>
        <div class="sunrise-sunset">
            <div class="item"><div class="icon"><i class="fa-light fa-sunrise fa-4x"></i></div>
                <div><p>Sunrise</p><h2>${sRiseTime}</h2></div>
            </div>
            <div class="item"><div class="icon"><i class="fa-light fa-sunset fa-4x"></i></div>
                <div><p>Sunset</p><h2>${sSetTime}</h2></div>
            </div>
        </div>`;

        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure} hPa`;
        visibilityVal.innerHTML = `${data.visibility / 1000} km`;
        windspeedVal.innerHTML = `${speed} m/s`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
    }).catch(() => alert('Failed to fetch current weather'));
}

// Fetch city coordinates based on the name input
function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    if (!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let { name, lat, lon, country } = data[0];
        getWeatherDetails(name, lat, lon, country);
    }).catch(() => alert(`Failed to fetch coordinates of ${cityName}`));
}

// Event listeners
searchBtn.addEventListener('click', getCityCoordinates);

addCityBtn.addEventListener('click', () => {
    let cityName = cityInput.value.trim();
    if (cityName) {
        addFavoriteCity(cityName);
        cityInput.value = '';  // Clear the input field
    }
});

// Initial load of favorite cities
loadFavoriteCities();
