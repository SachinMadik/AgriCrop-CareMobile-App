import { api, fetchWithRetry } from "./api";
import { mockProfile } from "./mockData";

export async function getProfile() {
  try {
    return await fetchWithRetry(() => api.get("/profile").then((r) => r.data));
  } catch {
    console.log("[profile] API failed — using offline data");
    return mockProfile;
  }
}

export async function updateProfile(body: object) {
  try {
    return await fetchWithRetry(() =>
      api.put("/profile", body).then((r) => r.data)
    );
  } catch {
    console.log("[profile] update failed offline");
    return null;
  }
}

export async function getProfileStats() {
  try {
    return await fetchWithRetry(() =>
      api.get("/profile/stats").then((r) => r.data)
    );
  } catch {
    return {
      farmArea: mockProfile.farmArea,
      crop: mockProfile.primaryCrop,
      season: mockProfile.season,
      diseaseFreeDays: mockProfile.diseaseFreeDays,
    };
  }
}
