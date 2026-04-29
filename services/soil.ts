import { api, fetchWithRetry } from "./api";
import { mockSoilNutrients, mockSoilHealthScore, mockSoilTrend } from "./mockData";

export async function getSoilNutrients() {
  try {
    return await fetchWithRetry(() => api.get("/soil").then((r) => r.data));
  } catch {
    console.log("[soil] API failed — using offline data");
    return mockSoilNutrients;
  }
}

export async function getSoilHealthScore() {
  try {
    return await fetchWithRetry(() =>
      api.get("/soil/health-score").then((r) => r.data)
    );
  } catch {
    return mockSoilHealthScore;
  }
}

export async function getSoilTrend() {
  try {
    return await fetchWithRetry(() =>
      api.get("/soil/trend").then((r) => r.data)
    );
  } catch {
    return mockSoilTrend;
  }
}

export async function getSoilRecommendations() {
  try {
    return await fetchWithRetry(() =>
      api.get("/soil/recommendations").then((r) => r.data)
    );
  } catch {
    return [];
  }
}
