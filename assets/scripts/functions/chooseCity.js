import { input } from "https://raw.githubusercontent.com/vadzim-su/Your_weather/dev/assets/scripts/functions/showHint.js";

function chooseCity(e) {
  let target = e.target;
  if (target.className === "hint__item") {
    input.value = target.innerHTML;
  }
}

export { chooseCity };
