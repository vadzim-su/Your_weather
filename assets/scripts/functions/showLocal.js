import { saveCityToLocalSrorage } from "./saveCity.js";

function showLocalForecast() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      findCity(lat, lon);
      location.href = "../../../main.html";
    });
  } else {
    alert("Sorry, your browser does not support geolocation defenition");
  }
}

async function findCity(lat, lon) {
  let response = await fetch("../../../assets/data/cities.json");
  if (response.ok) {
    const json = await response.json();
    const city = await json.find(
      (city) =>
        Math.trunc(city.coord.lat) === Math.trunc(lat) &&
        Math.trunc(city.coord.lon) === Math.trunc(lon)
    );
    saveCityToLocalSrorage("CURRENT_CITY", city.name);
  } else {
    alert("HTTP error: " + response.status);
  }
}

export { showLocalForecast };
