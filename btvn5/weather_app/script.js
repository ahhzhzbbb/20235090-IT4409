const citySelect = document.getElementById("city-select");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherPanel = document.getElementById("weather-panel");

const weatherIcon = document.getElementById("weather-icon");
const mainTemperature = document.getElementById("main-temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const windGust = document.getElementById("wind-gust");
const weatherMain = document.getElementById("weather-main");
const locationName = document.getElementById("location");

function displayValue(value, suffix = "") {
  if (value === undefined || value === null || value === "") {
    return "N/A";
  }
  return `${value}${suffix}`;
}

async function getWeather(city) {
  try {
    const response = await fetch(
      `https://weather-proxy.freecodecamp.rocks/api/city/${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function showWeather(city) {
  try {
    const weatherData = await getWeather(city);

    if (!weatherData) {
      alert("Something went wrong, please try again later.");
      return;
    }

    weatherPanel.classList.remove("hidden");

    const weatherInfo = Array.isArray(weatherData.weather)
      ? weatherData.weather[0] || {}
      : {};
    const mainInfo = weatherData.main || {};
    const windInfo = weatherData.wind || {};

    const iconUrl = weatherInfo.icon;
    weatherIcon.src = iconUrl || "";
    weatherIcon.alt = iconUrl
      ? weatherInfo.description || weatherInfo.main || "Weather icon"
      : "N/A";

    mainTemperature.textContent = displayValue(mainInfo.temp);
    feelsLike.textContent = displayValue(mainInfo.feels_like);
    humidity.textContent = displayValue(mainInfo.humidity);
    wind.textContent = displayValue(windInfo.speed);
    windGust.textContent = displayValue(windInfo.gust);
    weatherMain.textContent = displayValue(weatherInfo.main);
    locationName.textContent = displayValue(weatherData.name);
  } catch (error) {
    alert("Something went wrong, please try again later.");
  }
}

getWeatherBtn.addEventListener("click", () => {
  const city = citySelect.value;

  if (!city) {
    return;
  }

  showWeather(city);
});
