let cityInput = document.getElementById(`city-input`),
  searchBtn = document.getElementById(`searchBtn`),
  api_Key = "6e98a32c37bf892173bd45336d21daee";
  currentWeatherCard = document.querySelectorAll(`.weather-left .card`)[0];

function getWeatherDetails(name, lat, lon, country, state) {
  let FORECAST_APT_URL = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`,
    WEATHER_APT_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`,
    days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

  fetch(WEATHER_APT_URL).then(res => res.json()).then(data => {
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
            <p><i class="fa-light fa-calendar"></i>${days[date.getDay()]}, ${date,getDate()}, ${months[date.getMonth()]} ${date.getFullYear()}</p>
            <p><i class="fa-light fa-location-dot"></i> ${name}, ${country}</p>
          </div>`;
  }).catch(() => {
    alert(`Failed to fetch current weather`);
  });
  fetch(FORECAST_APT_URL).then(res => res.json()).then(data =>{
    let uniqueForecastDays = [];
    let fiveDaysForecast = data.list.filter(forecast =>{
      let forecastDate = new Date(forecast.dt_txt).getDate();
      if(!uniqueForecastDays.includes(forecastDate)){
        return uniqueForecastDays.push(forecastDate);
      }
    
    })
    console.log(fiveDaysForecast);
  }).catch(() => {
    alert(`Failed to fetch weather forecast`);
  });
}


function getCityCoordinates() {
  let cityName = cityInput.Value.trim();
  console.log(cityName);
  if (!cityName) return;
  let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;
  fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
    let { name, lat, lon, country, state } = data[0];
    getWeatherDetails(name, lat, lon, country, state);
  }).catch(() => {
    alert(`Failed to fetch coordinates of ${cityName}`);
  });
}

searchBtn.addEventListener(`click`, getCityCoordinates);


