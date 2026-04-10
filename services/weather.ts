import { API_BASE } from "./api";

export async function getWeather(lat: number, lon: number) {
  const response = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`);
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}

export async function getForecast(lat: number, lon: number) {
  const response = await fetch(
    `${API_BASE}/weather/forecast?lat=${lat}&lon=${lon}`,
  );
  if (!response.ok) throw new Error("Failed to fetch forecast data");
  return response.json();
}
