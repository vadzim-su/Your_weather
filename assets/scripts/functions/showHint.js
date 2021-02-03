import { saveCityInfo } from "./saveCityInfo.js";
import { chooseCity } from "./chooseCity.js";
import { input } from "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/assets/scripts/index.js";
import { hint } from "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/assets/scripts/index.js";
const currentCityKey = "CURRENT_CITY";

function showHint() {
  hint.innerHTML = "";
  if (input.value.length > 2) {
    fetch(
      "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/assets/data/cityList.json"
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
                "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/main.html";
            });
          }
        })
      );
  } else {
    hint.classList.remove("hint__show");
  }
}

export { showHint, input, hint };
