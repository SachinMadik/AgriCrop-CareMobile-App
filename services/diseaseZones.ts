import { api, fetchWithRetry } from "./api";
import { mockDiseaseZones } from "./mockData";

export async function getDiseaseZones() {
  try {
    return await fetchWithRetry(() =>
      api.get("/disease-zones").then((r) => r.data)
    );
  } catch {
    console.log("[disease-zones] API failed — using offline data");
    return mockDiseaseZones;
  }
}

export async function getDiseaseHistory() {
  try {
    return await fetchWithRetry(() =>
      api.get("/disease-zones/history").then((r) => r.data)
    );
  } catch {
    return [];
  }
}

export async function getPreventionTips() {
  try {
    return await fetchWithRetry(() =>
      api.get("/disease-zones/prevention-tips").then((r) => r.data)
    );
  } catch {
    return [];
  }
}
