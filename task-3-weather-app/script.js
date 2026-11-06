const API_KEY = '31e556896fc4bef980fdc3aeaa0d8812'; 

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const errorMsg = document.getElementById('error-msg');
const loader = document.getElementById('loader');
const weatherDashboard = document.getElementById('weather-dashboard');

const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecast-container');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if(city) fetchWeatherData(city);
});

cityInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const city = cityInput.value.trim();
        if(city) fetchWeatherData(city);
    }
});

// Default load on start
fetchWeatherData('London');

async function fetchWeatherData(city) {
    try {
        errorMsg.classList.add('hidden');
        weatherDashboard.classList.add('hidden');
        loader.classList.remove('hidden');

        // Fetch Current Weather
        const currentRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        if(!currentRes.ok) throw new Error('City not found');
        const currentData = await currentRes.json();

        // Fetch 5-Day Forecast
        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastRes.json();

        updateCurrentUI(currentData);
        updateForecastUI(forecastData);

        loader.classList.add('hidden');
        weatherDashboard.classList.remove('hidden');

    } catch (error) {
        loader.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

function updateCurrentUI(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherCondition.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

function updateForecastUI(data) {
    forecastContainer.innerHTML = '';
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    dailyForecasts.slice(0, 5).forEach(day => {
        const dateObj = new Date(day.dt * 1000);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <small>${dayName}</small>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="Icon">
            <span>${Math.round(day.main.temp)}°C</span>
        `;
        forecastContainer.appendChild(card);
    });
}