// عناصر DOM
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherCard = document.querySelector('.weather-left .card');
const fiveDaysForecastCard = document.querySelector('.day-forecast');
const favoriteCityInput = document.getElementById('favorite-city-input');
const addCityBtn = document.getElementById('addCityBtn');
const favoriteCitiesList = document.getElementById('favoriteCitiesList');

const api_Key = '6e98a32c37bf892173bd45336d21daee';

// دوال مساعدة
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// حفظ المدن المفضلة في LocalStorage
const saveFavoriteCities = () => {
  const cities = Array.from(favoriteCitiesList.querySelectorAll('li')).map((li) =>
    li.querySelector('.city-name').textContent.trim()
  );
  localStorage.setItem('favoriteCities', JSON.stringify(cities));
};

// استعادة المدن المفضلة من LocalStorage
const loadFavoriteCities = () => {
  const storedCities = JSON.parse(localStorage.getItem('favoriteCities')) || [];
  storedCities.forEach((city) => addCityToList(city));
};

// إضافة مدينة إلى قائمة المفضلة
const addCityToList = (cityName) => {
  const listItem = document.createElement('li');
  listItem.innerHTML = `
    <span class="city-name">${cityName}</span>
    <button class="delete-btn">
      <i class="fa fa-trash"></i>
    </button>
  `;

  listItem.querySelector('.delete-btn').addEventListener('click', () => {
    favoriteCitiesList.removeChild(listItem);
    saveFavoriteCities();
  });

  favoriteCitiesList.appendChild(listItem);
};

// استرجاع تفاصيل الطقس
const getWeatherDetails = (name, lat, lon, country) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_Key}`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_Key}`;

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const date = new Date();
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
          <p>${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
          <p>${name}, ${country}</p>
        </div>`;
    })
    .catch(() => alert('Failed to fetch current weather'));

  fetch(FORECAST_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          uniqueForecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      fiveDaysForecastCard.innerHTML = '';
      fiveDaysForecast.forEach((forecast) => {
        const date = new Date(forecast.dt_txt);
        fiveDaysForecastCard.innerHTML += `
          <div class="forecast-item">
            <div class="icon-wrapper">
              <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="">
              <span>${(forecast.main.temp - 273.15).toFixed(2)}&deg;C</span>
            </div>
            <p>${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
          </div>`;
      });
    })
    .catch(() => alert('Failed to fetch weather forecast'));
};

// الحصول على إحداثيات المدينة
const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_Key}`;

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        alert('City not found');
        return;
      }
      const { name, lat, lon, country } = data[0];
      getWeatherDetails(name, lat, lon, country);
    })
    .catch(() => alert(`Failed to fetch coordinates of ${cityName}`));
};

// أحداث المستخدم
searchBtn.addEventListener('click', getCityCoordinates);

addCityBtn.addEventListener('click', () => {
  const cityName = favoriteCityInput.value.trim();
  if (cityName) {
    addCityToList(cityName);
    saveFavoriteCities();
    favoriteCityInput.value = '';
  }
});

// تحميل المدن المفضلة عند فتح الصفحة
loadFavoriteCities();
