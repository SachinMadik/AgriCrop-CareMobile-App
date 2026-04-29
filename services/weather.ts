import { api, fetchWithRetry } from "./api";
import { mockWeather, mockForecast } from "./mockData";

export async function getWeather(lat: number, lon: number) {
  try {
    return await fetchWithRetry(() =>
      api.get(`/weather?lat=${lat}&lon=${lon}`).then((r) => r.data)
    );
  } catch {
    console.log("[weather] API failed — using offline data");
    return mockWeather;
  }
}

export async function getForecast(lat: number, lon: number) {
  try {
    return await fetchWithRetry(() =>
      api.get(`/weather/forecast?lat=${lat}&lon=${lon}`).then((r) => r.data)
    );
  } catch {
    console.log("[forecast] API failed — using offline data");
    return mockForecast;
  }
}
