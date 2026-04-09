const API_KEY = "63b6da1735938cc22e1110802dada21f";

export async function getWeather(lat: number, lon: number) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    temperature: data.main?.temp ?? 0,
    humidity: data.main?.humidity ?? 0,
    rainfall: data.rain?.["1h"] ?? 0,
    windSpeed: data.wind?.speed ?? 0,
    cloudCover: data.clouds?.all ?? 0,
  };
}
