export function calculateRisks(weather: any) {
  let fungal = "SAFE";
  let drought = "SAFE";
  let flood = "SAFE";

  // Fungal Disease Risk
  if (
    weather.humidity > 70 &&
    weather.temperature >= 20 &&
    weather.temperature <= 30
  ) {
    fungal = "HIGH";
  }

  // Drought Risk
  if (weather.rainfall === 0 && weather.temperature > 32) {
    drought = "HIGH";
  }

  // Flood Risk
  if (weather.rainfall > 10) {
    flood = "HIGH";
  }

  return { fungal, drought, flood };
}