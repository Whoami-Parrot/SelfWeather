const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const icon = document.getElementById('weather-icon');
const resultsContainer = document.getElementById('search-results');

let APIKey = ''; 

window.addEventListener('load', () => {
    APIKey = prompt("Enter your OpenWeatherMap API Key:");
});

search.addEventListener('click', () => {
    const city = document.querySelector('.search-box input').value;
    if (!city || !APIKey) return;

    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
        .then(res => res.json())
        .then(async data => {
            if (data.length === 0) {
                container.style.height = '400px';
                error404.style.display = 'block';
                return;
            }

            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'block';
            container.style.height = '450px';

            for (const loc of data) {
                const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${loc.lat}&lon=${loc.lon}&units=metric&appid=${APIKey}`);
                const wData = await weatherRes.json();
                
                const flagEmoji = loc.country.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
                const div = document.createElement('div');
                div.classList.add('result-item');
                div.innerHTML = `
                    <div class="res-geo">${loc.name}, ${loc.country} ${flagEmoji}</div>
                    <div class="res-temp">${Math.round(wData.main.temp)}°C</div>
                    <div class="res-icon"><img src="https://openweathermap.org/img/wn/${wData.weather[0].icon}.png"></div>
                    <div class="res-coords">${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}</div>
                `;

                div.addEventListener('click', () => {
                    getWeather(loc.lat, loc.lon, loc.name);
                    resultsContainer.style.display = 'none';
                });
                resultsContainer.appendChild(div);
            }
        });
});

function getWeather(lat, lon, cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
        .then(res => res.json())
        .then(json => {
            document.querySelector('.search-box input').value = cityName;
            
            switch (json.weather[0].main) {
                case 'Clear': icon.src = 'images/sunny.png'; break;
                case 'Clouds': icon.src = 'images/cloudy.png'; break;
                case 'Rain': icon.src = 'images/rainy.png'; break;
                case 'Haze': icon.src = 'images/windy.png'; break;
                default: icon.src = 'images/sunny.png';
            }

            document.querySelector('.weather-box .temperature').innerHTML = `${Math.round(json.main.temp)}<span>°C</span>`;
            document.querySelector('.weather-box .description').innerHTML = json.weather[0].description;
            document.querySelector('.weather-details .humidity span').innerHTML = `${json.main.humidity}%`;
            document.querySelector('.weather-details .wind span').innerHTML = `${Math.round(json.wind.speed)} km/h`;

            weatherBox.style.display = 'block';
            weatherDetails.style.display = 'flex';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '600px';
        });
}