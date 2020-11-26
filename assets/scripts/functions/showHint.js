import { chooseCity } from "./chooseCity.js";
const input = document.querySelector(".search__field");
const hint = document.querySelector(".hint");
let cities = [];

function showHint() {
  hint.innerHTML = "";
  if (input.value.length > 2) {
    fetch("../../assets/data/cityList.json")
      .then((data) => data.json())
      .then((data) =>
        data.forEach((city) => cities.push(city.name + ", " + city.country))
      )
      .then(() =>
        cities.forEach((city) => {
          if (city.toLowerCase().startsWith(input.value.toLowerCase())) {
            let singleCity = document.createElement("li");
            singleCity.classList.add("hint__item");
            hint.classList.add("hint__show");
            singleCity.innerHTML = city;
            hint.appendChild(singleCity);
            singleCity.addEventListener("click", chooseCity);
          }
        })
      )
      .then(() => (cities = []));
  } else {
    hint.classList.remove("hint__show");
  }
}

export { showHint, input, hint };
