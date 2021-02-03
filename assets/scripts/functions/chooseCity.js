import { input } from "https://github.com/vadzim-su/Your_weather/blob/master/assets/scripts/functions/showHint.js";

function chooseCity(e) {
  let target = e.target;
  if (target.className === "hint__item") {
    input.value = target.innerHTML;
  }
}

export { chooseCity };
