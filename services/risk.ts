import { API_BASE } from "./api";

export async function getRisks(lat: number, lon: number) {
  const response = await fetch(`${API_BASE}/risks?lat=${lat}&lon=${lon}`);
  if (!response.ok) throw new Error("Failed to fetch risk data");
  return response.json();
}
