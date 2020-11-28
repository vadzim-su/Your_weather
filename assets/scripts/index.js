import { showHint } from "./functions/showHint.js";
import { showLocalForecast } from "./functions/showLocal.js";
const input = document.querySelector(".search__field");
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
