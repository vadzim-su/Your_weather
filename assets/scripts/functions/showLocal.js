import { saveCityInfo } from "./saveCityInfo.js";
const currentCityKey = "CURRENT_CITY";

function showLocalForecast() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      findCity(lat, lon);
      location.href =
        "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/main.html";
    });
  } else {
    alert("Sorry, your browser does not support geolocation defenition");
  }
}

async function findCity(lat, lon) {
  let response = await fetch(
    "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/assets/data/cityList.json"
  );
  if (response.ok) {
    const json = await response.json();
    const city = await json.find(
      (city) =>
        Math.trunc(city.coord.lat) === Math.trunc(lat) &&
        Math.trunc(city.coord.lon) === Math.trunc(lon)
    );
    saveCityInfo(currentCityKey, city);
  } else {
    alert("HTTP error: " + response.status);
  }
}

export { showLocalForecast };
