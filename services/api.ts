import axios from "axios";

export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.9:3000";

// Centralized axios instance
export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Retry helper: 2 retries with 1s delay
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < retries) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastError;
}
