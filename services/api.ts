// Base URL for the CropGuard backend
// Using local network IP so Android devices can reach the backend on the same WiFi
export const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.9:3000";
