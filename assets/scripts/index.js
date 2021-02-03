import { showHint } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/functions/showHint.js";
import { showLocalForecast } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/functions/showLocal.js";
const input = document.querySelector(
  "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/index.js"
);
const hint = document.querySelector(".hint");
const showLocalForecastButton = document.querySelector(".local__button");

input.addEventListener("input", showHint);
showLocalForecastButton.addEventListener("click", showLocalForecast);
window.addEventListener("click", closeHint);

function closeHint(e) {
  let target = e.target;
  if (!target.classList.contains("hint")) {
    hint.classList.remove("hint__show");
  }
}

export { showLocalForecastButton };
export { input, hint };
