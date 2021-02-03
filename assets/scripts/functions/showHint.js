import { saveCityInfo } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/functions/saveCityInfo.js";
import { chooseCity } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/functions/chooseCity.js";
import { input } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/index.js";
import { hint } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/index.js";
const currentCityKey = "CURRENT_CITY";

function showHint() {
  hint.innerHTML = "";
  if (input.value.length > 2) {
    fetch(
      "https://raw.githubusercontent.com/vadzim-su/Your_weather/master/assets/data/cityList.json"
    )
      .then((data) => data.json())
      .then((data) =>
        data.forEach((city) => {
          if (city.name.toLowerCase().startsWith(input.value.toLowerCase())) {
            let singleCity = document.createElement("li");
            singleCity.classList.add("hint__item");
            hint.classList.add("hint__show");
            singleCity.innerHTML = city.name + ", " + city.country;
            hint.appendChild(singleCity);
            singleCity.addEventListener("click", (e) => {
              saveCityInfo(currentCityKey, city);
              chooseCity(e);
              location.href =
                "https://github.com/vadzim-su/Your_weather/blob/master/main.html";
            });
          }
        })
      );
  } else {
    hint.classList.remove("hint__show");
  }
}

export { showHint, input, hint };
