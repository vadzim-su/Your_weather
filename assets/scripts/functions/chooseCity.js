import { input } from "./showHint.js";

function chooseCity(e) {
  let target = e.target;
  if (target.className === "hint__item") {
    input.value = target.innerHTML;
  }
}

export { chooseCity };
