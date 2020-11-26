import { input } from "./showHint.js";
import { saveCityToLocalSrorage } from "./saveCity.js";

const currentCityKey = "CURRENT_CITY";

function chooseCity(e) {
  let target = e.target;
  if (target.className === "hint__item") {
    input.value = target.innerHTML;
    saveCityToLocalSrorage(currentCityKey, input.value);
    location.href = "../../main.html";
  }
}

export { chooseCity };
