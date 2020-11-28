function saveCityInfo(key, city) {
  localStorage.setItem(key, JSON.stringify(city));
}
export { saveCityInfo };
