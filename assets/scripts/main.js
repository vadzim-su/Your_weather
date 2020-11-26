import { showHint } from "./functions/showHint.js";
import { showLocalForecastButton } from "./index.js";
import { showLocalForecast } from "./functions/showLocal.js";
// import { showForecast } from "./functions/historyAPI.js";

const linkAPIFuture = "http://api.openweathermap.org/data/2.5/forecast?q=";
const linkAPICurrent = "http://api.openweathermap.org/data/2.5/weather?q=";
const userKey = "0a3b4d1b5edcc4fdf23c2763d08dc233";
// const cityLondon = "London,uk";
const currentCityKey = "CURRENT_CITY";
const city = getCity(currentCityKey);
const content = document.querySelector(".card__main");
const tabs = document.querySelectorAll(".nav-link");
const cityInput = document.querySelector("#exampleInputEmail1");
const date = new Date();
let currentHours;
let hours;

getCityForecast();
getHoursForecast();

showLocalForecastButton.addEventListener("click", showLocalForecast);

cityInput.addEventListener("input", showHint);

tabs.forEach((tab) => {
  tab.addEventListener("click", doActiveTab);
});

async function getCityForecast() {
  let response = await fetch(`${linkAPICurrent}${city}&appid=${userKey}`);
  if (response.ok) {
    const json = await response.json();
    const city = json.name;
    const country = json.sys.country;
    const temp = Math.round(json.main.temp - 273);
    const tempFeelsLike = Math.round(json.main["feels_like"] - 273);
    const humidity = json.main.humidity;
    const pressure = json.main.pressure;
    const wind = json.wind.speed.toFixed(1);
    const windDegree = json.wind.deg;
    const visibility = json.visibility;
    const icon = json.weather[0].icon;
    const weatherDescription = json.weather[0].description;
    const timezone = json.timezone;

    drawSingleForecast(
      city,
      country,
      temp,
      icon,
      weatherDescription,
      tempFeelsLike,
      humidity,
      pressure,
      wind,
      windDegree,
      visibility,
      timezone
    );
  } else {
    alert("HTTP error: " + response.status);
  }
}

function getCity(key) {
  const currentCity = localStorage.getItem(key);
  return currentCity;
}

function drawSingleForecast(
  city,
  country,
  temp,
  icon,
  weatherDescription,
  tempFeelsLike,
  humidity,
  pressure,
  wind,
  windDegree,
  visibility,
  timezone
) {
  const card = document.createElement("div");
  const time = setCurrentDate(timezone);
  card.classList.add("card-body", "col-md-5");
  card.innerHTML = `
  <h5 class="card-text">Local time ${time}</h5>
  <h1 class="card-title">${city}, ${country}</h1>
  <div class="card__info d-flex justify-content-center align-items-center">
    <img
      class="weather__icon"
      src="./assets/images/temp.svg"
      alt=""
    /><span class="card__temp ${temp > 0 ? "card__temp-hot" : "card__temp-cold"}
    
    } ">${addPlusToTemp(temp)}&deg;C</span>
  </div>
  <div class="card__info">
    <img class="card__ico" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" />
    <span>${weatherDescription}</span>
  </div>
  <div class="card__info">
    <img class="weather__icon" src="./assets/images/360.svg" alt="" />Feels
    like: ${addPlusToTemp(tempFeelsLike)}&degC
  </div>
  <div class="card__info">
    <img
      class="weather__icon"
      src="./assets/images/humidity.svg"
      alt=""
    />Humidity: ${humidity}%
  </div>
  <div class="card__info">
    <img
      class="weather__icon"
      src="./assets/images/pressure.svg"
      alt=""
    />Pressure: ${Math.round(pressure * 0.75)}mmHg
  </div>
  <div class="card__info">
    <img
      class="weather__icon"
      src="./assets/images/wind-direction.svg"
      alt=""
    />Wind: ${wind} m/sec, ${setWindDirection(windDegree)}
  </div>
  <div class="card__info">
    <img
      class="weather__icon"
      src="./assets/images/eye.svg"
      alt=""
    />Visibility: ${visibility / 1000}km
  </div>
  `;
  content.appendChild(card);
}

function doActiveTab() {
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  this.classList.add("active");
}

function setCurrentDate(timezone) {
  hours = date.getHours();
  let minutes = date.getMinutes();
  let day = date.getDate();
  const timeLondon = hours - 3;
  currentHours = timeLondon + timezone / 3600;
  if (currentHours < 0) {
    currentHours += 24;
  }
  if (currentHours >= 24) {
    currentHours -= 24;
    ++day;
  }
  if (!isInteger(currentHours)) {
    currentHours -= 0.5;
    minutes += 30;
    if (minutes > 60) {
      minutes -= 60;
      currentHours++;
    }
  }

  const time = `${currentHours}:${getFormatedDate(
    minutes
  )} ${day}.${getFormatedDate(date.getMonth() + 1)}.${getFormatedDate(
    date.getFullYear()
  )}`;
  return time;
}

function getFormatedDate(time) {
  return time < 10 ? "0" + time : time;
}

function addPlusToTemp(temp) {
  return temp > 0 ? "+" + temp : temp;
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

async function getHoursForecast() {
  let response = await fetch(`${linkAPIFuture}${city}&appid=${userKey}`);
  if (response.ok) {
    const json = await response.json();
    console.log(json);
    const days = await json.list;
    let daysForHourly;

    let index = days.findIndex(
      (day) =>
        currentHours - day.dt_txt.slice(-8, -6) < 3 &&
        currentHours - day.dt_txt.slice(-8, -6) >= 0
    );
    if (index < 7) {
      daysForHourly = days.slice(index, 5 + index);
      drawHourTemp(daysForHourly);
      console.log(daysForHourly);
    } else {
      // days.forEach(day=>)
    }
  } else {
    alert("HTTP error: " + response.status);
  }
}

function drawHourTemp(hours) {
  const card = document.createElement("div");
  card.classList.add(
    "card-body",
    "col-md-7",
    "d-flex",
    "justify-content-between",
    "flex-wrap"
  );
  hours.forEach((hour) => {
    const period = document.createElement("div");
    period.classList.add("card__row");
    period.innerHTML = `
    <div class="card__time">${hour.dt_txt.slice(-8, -3)}</div>
    <div class = "card__date">
      ${hour.dt_txt.slice(8, 10)}/${hour.dt_txt.slice(5, 7)}
    </div>
    <div class = "d-flex">
    <img class="card__weather "
      src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png"
      alt=""
    />
    </div>
    <div class="card__hour">${addPlusToTemp(
      Math.round(hour.main.temp - 273)
    )}&deg;C</div>
    <div class="weather__wind">
      <img class="weather__img" src="./assets/images/wind-direction.svg" alt="" />
      <span class="weather__value">${hour.wind.speed.toFixed(1)}m/sec</span>
    </div>
    `;
    card.appendChild(period);
  });
  content.appendChild(card);
}

function isInteger(num) {
  return (num ^ 0) === num;
}
