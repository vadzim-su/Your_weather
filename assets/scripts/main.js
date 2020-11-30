import { showHint } from "./functions/showHint.js";
import { showLocalForecast } from "./functions/showLocal.js";
import { showLocalForecastButton } from "./index.js";

const linkAPI = "https://api.openweathermap.org/data/2.5/onecall?";
const historyAPI =
  "https://api.openweathermap.org/data/2.5/onecall/timemachine?";
const userKey = "0a3b4d1b5edcc4fdf23c2763d08dc233";
const currentCityKey = "CURRENT_CITY";
const currentCityInfo = getCityinfo(currentCityKey);
const content = document.querySelector(".weather__main");
const tabs = document.querySelectorAll(".nav-link");
const cityInput = document.querySelector(".search__field");
const showForecastButtons = document.querySelectorAll(".show-forecast");
let activeTab = document.querySelector(".active");
let currentCityTime; //now time in chosen city
let currentHours;
let currentDay;
let time;

content.innerHTML = "";
getCityForecast(currentCityInfo, activeTab);

showForecastButtons.forEach((day) =>
  day.addEventListener("click", (e) => {
    e.preventDefault();
    activeTab = document.querySelector(".active");
    getCityForecast(currentCityInfo, activeTab);
  })
);

showLocalForecastButton.addEventListener("click", showLocalForecast);

cityInput.addEventListener("input", showHint);

tabs.forEach((tab) => {
  tab.addEventListener("click", doActiveTab);
});

async function getCityForecast(cityInfo, tab) {
  content.innerHTML = "";
  const response = await fetch(
    `${linkAPI}lat=${cityInfo.coord.lat}&lon=${cityInfo.coord.lon}&exclude=minutely,alerts&appid=${userKey}`
  );
  if (response.ok) {
    const json = await response.json();
    const timezone = json.timezone_offset;
    const allHourlyData = json.hourly;
    const sections = [];
    let weatherData = [];
    let index = -1;
    currentCityTime = getCurrentCityDateNumber(json.current.dt, timezone);
    currentDay = getHourByDataText(currentCityTime / 1000).getDate();

    if (timezone <= 10800) {
      const responseToPast = await fetch(
        `${historyAPI}lat=${cityInfo.coord.lat}&lon=${cityInfo.coord.lon}&dt=${
          currentCityTime / 1000 - timezone
        }&appid=${userKey}`
      );
      if (responseToPast.ok) {
        const jsonHistory = await responseToPast.json();
        jsonHistory.hourly.splice(-1);
        jsonHistory.hourly.reverse();
        jsonHistory.hourly.forEach((item) => allHourlyData.unshift(item));
      } else {
        alert("HTTP error: " + response.status);
      }
    }

    if (tab.closest("li").classList.contains("today")) {
      weatherData = json.current;
      index = allHourlyData.findIndex(
        (hour) => hour.dt - currentCityTime / 1000 >= 0
      );
    }

    if (tab.closest("li").classList.contains("tomorrow")) {
      weatherData = json.daily[1];
      index = allHourlyData.findIndex(
        (hour) =>
          new Date(hour.dt * 1000).getHours() === 0 &&
          new Date(hour.dt * 1000).getDate() !== currentDay
      );
    }
    if (index !== -1) {
      for (
        let i = 0;
        index + i < allHourlyData.length && sections.length < 6;
        i = i + 4
      ) {
        sections.push(allHourlyData[index + i]);
      }

      drawSingleForecast(cityInfo, weatherData, timezone);
      drawHourTemp(sections);
    }

    if (tab.closest("li").classList.contains("three-days")) {
      weatherData = json.daily.slice(2, 5);
      weatherData.forEach((day) => drawSingleForecast(cityInfo, day, timezone));
    }
  } else {
    alert("HTTP error: " + response.status);
  }
}

function drawSingleForecast(cityInfo, weatherData, timezone) {
  const city = cityInfo.name;
  const country = cityInfo.country;
  const currentTemp = weatherData.temp.day
    ? Math.round(weatherData.temp.day - 273)
    : Math.round(weatherData.temp - 273);
  const tempFeelsLike = weatherData["feels_like"].day
    ? Math.round(weatherData["feels_like"].day - 273)
    : Math.round(weatherData.temp - 273);
  const humidity = weatherData.humidity;
  const pressure = weatherData.pressure;
  const wind = weatherData["wind_speed"].toFixed(1);
  const windDegree = weatherData["wind_deg"];
  const visibility = weatherData.visibility / 1000 || "";
  const icon = weatherData.weather[0].icon;
  const weatherDescription = weatherData.weather[0].description;
  const card = document.createElement("div");
  time = setCurrentDate(
    getCurrentCityDateNumber(weatherData.dt, timezone) / 1000
  );
  card.classList.add("card-body", "col-md-4", "weather");
  card.innerHTML = `
  <h5 class="card-text">Local time ${time}</h5>
  <h1 class="card-title">${city}, ${country}</h1>
  <div class="weather__info d-flex justify-content-center align-items-center">
    <img
      class="weather__icon"
      src="./assets/images/temp.svg"
      alt=""
    /><span class="weather__temp ${
      currentTemp > 0 ? "weather__temp-hot" : "weather__temp-cold"
    }
    
    } ">${addPlusToTemp(currentTemp.toString())}&deg;C</span>
  </div>
  <div class="weather__info">
    <img class="weather__picture" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" />
    <span>${weatherDescription}</span>
  </div>
  <div class="weather__info">
    <img class="weather__icon" src="./assets/images/360.svg" alt="" />Feels
    like: ${addPlusToTemp(tempFeelsLike)}&degC
  </div>
  <div class="weather__info">
    <img
      class="weather__icon"
      src="./assets/images/humidity.svg"
      alt=""
    />Humidity: ${humidity}%
  </div>
  <div class="weather__info">
    <img
      class="weather__icon"
      src="./assets/images/pressure.svg"
      alt=""
    />Pressure: ${Math.round(pressure * 0.75)}mmHg
  </div>
  <div class="weather__info">
    <img
      class="weather__icon"
      src="./assets/images/wind-direction.svg"
      alt=""
    />Wind: ${wind} m/sec, ${setWindDirection(windDegree)}
  </div>
  <div class="weather__info">
    <img
      class="weather__icon"
      src="./assets/images/eye.svg"
      alt=""
    />Visibility: ${visibility}${visibility ? "km" : "-"}
  </div>
  `;
  content.appendChild(card);
}

function drawHourTemp(hours) {
  const card = document.createElement("div");
  card.classList.add(
    "card-body",
    "col-md-8",
    "d-flex",
    "justify-content-between",
    "flex-wrap",
    "align-self-start"
  );

  hours.forEach((hour) => {
    const period = document.createElement("div");
    period.classList.add("card__row", "align-self-start");
    period.innerHTML = `
    <div class="card__time">${setCurrentDate(hour.dt).slice(0, 5)}</div>
    <div class="hour__date">${setCurrentDate(hour.dt).slice(6, 11)}</div>
    <div class="d-flex">
      <img
        class="hour__icon"
        src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png"
        alt=""
      />
    </div>
    <div class="hour__temp">
      ${addPlusToTemp(Math.round(hour.temp - 273))}&deg;C
    </div>
    <div class="weather__wind">
      <img class="weather__img" src="./assets/images/wind-direction.svg" alt="" />
      <span class="weather__value">${hour["wind_speed"].toFixed(1)}m/sec</span>
    </div>
    `;
    card.appendChild(period);
  });

  const adsBlock = document.createElement("div");
  adsBlock.classList.add("weather__ads");
  adsBlock.innerHTML = "Here can be your ads";
  card.appendChild(adsBlock);

  content.appendChild(card);
}

function setCurrentDate(currentDateNumber) {
  currentDay = getHourByDataText(currentDateNumber).getDate();
  currentHours = getHourByDataText(currentDateNumber).getHours();
  let currentMinutes = getHourByDataText(currentDateNumber).getMinutes();
  let currentMonth = getHourByDataText(currentDateNumber).getMonth() + 1;
  let currentYear = getHourByDataText(currentDateNumber).getFullYear();

  const time = `${getFormatedDate(currentHours)}:${getFormatedDate(
    currentMinutes
  )} ${getFormatedDate(currentDay)}.${getFormatedDate(
    currentMonth
  )}.${currentYear}`;

  return time;
}

function getHourByDataText(dataText) {
  const date = new Date(dataText * 1000);
  return date;
}

function getCurrentCityDateNumber(dateNumber, timezone) {
  const date = new Date((dateNumber + timezone - 10800) * 1000);
  return +date;
}

function setWindDirection(degree) {
  const direction =
    degree === 0
      ? "N"
      : degree === 90
      ? "E"
      : degree === 180
      ? "S"
      : degree === 270
      ? "W"
      : degree > 0 && degree < 90
      ? "NE"
      : degree > 90 && degree < 180
      ? "SE"
      : degree > 180 && degree < 270
      ? "SW"
      : "NW";
  return direction;
}

function getFormatedDate(time) {
  return time < 10 ? "0" + time : time;
}

function addPlusToTemp(temp) {
  return temp > 0 ? "+" + temp : temp;
}

function getCityinfo(key) {
  const currentCity = JSON.parse(localStorage.getItem(key));
  return currentCity;
}

function doActiveTab() {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  this.classList.add("active");
}

export { currentCityKey };
