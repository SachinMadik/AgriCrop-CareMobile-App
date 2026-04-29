// Offline fallback data — used when API is unreachable

export const mockWeather = {
  temperature: 28,
  humidity: 72,
  rainfall: 0,
  windSpeed: 3.2,
  cloudCover: 40,
};

export const mockForecast = [
  { day: "Mon", icon: "partly-sunny", high: 31, low: 22 },
  { day: "Tue", icon: "rainy", high: 27, low: 20 },
  { day: "Wed", icon: "cloudy", high: 26, low: 19 },
  { day: "Thu", icon: "sunny", high: 33, low: 23 },
  { day: "Fri", icon: "partly-sunny", high: 30, low: 21 },
  { day: "Sat", icon: "rainy", high: 25, low: 18 },
  { day: "Sun", icon: "sunny", high: 32, low: 22 },
];

export const mockRisks = {
  fungal: "Medium",
  drought: "Low",
  flood: "Low",
  pest: "Medium",
  frost: "Low",
  blight_pct: 44,
  frost_pct: 0,
  drought_pct: 10,
  risks: [
    {
      type: "fungal",
      severity: "MEDIUM",
      title: "Medium Fungal Disease Risk",
      description: "Humidity 72% and temperature 28°C favour fungal growth on tomato.",
      recommendation: "Monitor crops daily for early fungal symptoms. Reduce overhead irrigation.",
      timeline: "Within 48 hours",
      activity: "Inspect leaves for spots or discolouration. Improve field drainage.",
    },
  ],
  weather: { temperature: 28, humidity: 72, rainfall: 0, windSpeed: 3.2 },
  farmContext: { cropType: "tomato", season: "kharif", soilType: "sandy loam" },
};

export const mockAlerts = [
  {
    id: "1",
    severity: "CRITICAL",
    title: "Late Blight Detected",
    description: "Phytophthora infestans spores detected in zone A4.",
    recommendation: "Apply copper-based fungicide immediately.",
    timeline: "Within 24 hours",
    activity: "Spray fungicide on all leaves.",
    timestamp: "Today, 09:14 AM",
    source: "Sensor Node #12",
    acknowledged: false,
  },
  {
    id: "2",
    severity: "HIGH",
    title: "High Humidity Warning",
    description: "Relative humidity sustained above 85% for 6+ hours.",
    recommendation: "Improve ventilation and reduce irrigation.",
    timeline: "Today",
    activity: "Check drainage channels.",
    timestamp: "Today, 07:45 AM",
    source: "Weather Station",
    acknowledged: false,
  },
  {
    id: "3",
    severity: "MEDIUM",
    title: "Preventive Spray Due",
    description: "Scheduled fungicide spray task pending for zone B2.",
    recommendation: "Complete scheduled spray.",
    timeline: "Today",
    activity: "Prepare spray equipment.",
    timestamp: "Yesterday, 06:30 PM",
    source: "Task Scheduler",
    acknowledged: true,
  },
];

export const mockSoilNutrients = [
  {
    id: "N",
    name: "Nitrogen",
    symbol: "N",
    value: 42,
    unit: "kg/ha",
    min: 20,
    max: 80,
    optimal: 50,
    status: "WARNING",
    description: "Slightly below optimal for tomato cultivation.",
    action: "Apply 8 kg/ha urea within the next 5 days.",
  },
  {
    id: "P",
    name: "Phosphorus",
    symbol: "P",
    value: 28,
    unit: "kg/ha",
    min: 15,
    max: 60,
    optimal: 35,
    status: "SAFE",
    description: "Phosphorus levels are within the healthy range.",
    action: null,
  },
  {
    id: "K",
    name: "Potassium",
    symbol: "K",
    value: 65,
    unit: "kg/ha",
    min: 30,
    max: 100,
    optimal: 70,
    status: "SAFE",
    description: "Good potassium levels support fruit quality.",
    action: null,
  },
  {
    id: "pH",
    name: "Soil pH",
    symbol: "pH",
    value: 6.2,
    unit: "",
    min: 5.5,
    max: 7.5,
    optimal: 6.5,
    status: "SAFE",
    description: "Ideal pH for nutrient availability.",
    action: null,
  },
  {
    id: "OM",
    name: "Organic Matter",
    symbol: "OM",
    value: 1.4,
    unit: "%",
    min: 1.0,
    max: 5.0,
    optimal: 3.0,
    status: "LOW",
    description: "Organic matter is on the lower end.",
    action: "Incorporate compost or green manure before next season.",
  },
  {
    id: "EC",
    name: "Electrical Conductivity",
    symbol: "EC",
    value: 2.8,
    unit: "dS/m",
    min: 0,
    max: 4.0,
    optimal: 2.0,
    status: "WARNING",
    description: "EC approaching the upper tolerance limit.",
    action: "Flush soil with clean water and reduce fertilizer input.",
  },
];

export const mockSoilHealthScore = { score: 72, label: "Good" };

export const mockSoilTrend = [
  { label: "Mar 20", n: 38, p: 27, k: 62 },
  { label: "Mar 21", n: 40, p: 28, k: 63 },
  { label: "Mar 22", n: 41, p: 27, k: 65 },
  { label: "Mar 23", n: 42, p: 28, k: 66 },
  { label: "Mar 24", n: 42, p: 28, k: 65 },
  { label: "Mar 25", n: 43, p: 29, k: 65 },
  { label: "Mar 26", n: 42, p: 28, k: 64 },
];

export const mockChatReply = {
  reply:
    "I'm currently in offline mode. Please check your internet connection to get live AI responses. In the meantime: for tomato late blight, apply copper-based fungicide and remove infected leaves immediately.",
};

export const mockProfile = {
  name: "Sachchidanand M",
  farmName: "Green Valley Plot",
  primaryCrop: "Tomato (Solanum lycopersicum)",
  soilType: "Sandy Loam",
  coordinates: "17.3850°N, 78.4867°E",
  region: "Telangana, India",
  contact: "+91 98765 43210",
  farmerId: "TG-2026-042813",
  plan: "Premium",
  farmArea: "4.2 ha",
  season: "Kharif 2026",
  diseaseFreeDays: 24,
};

export const mockDiseaseZones = [
  {
    id: "1",
    disease: "Late Blight",
    pathogen: "Phytophthora infestans",
    cases: 14,
    radius: 8,
    distance: 3.2,
    risk: "critical",
    direction: "NE",
    lastUpdated: "12 min ago",
    trend: "rising",
    latitude: null,
    longitude: null,
  },
  {
    id: "2",
    disease: "Leaf Blight",
    pathogen: "Alternaria solani",
    cases: 6,
    radius: 5,
    distance: 7.8,
    risk: "high",
    direction: "SW",
    lastUpdated: "28 min ago",
    trend: "stable",
    latitude: null,
    longitude: null,
  },
];

export const mockReminders: any[] = [];
export const mockActivity = [
  { icon: "checkmark-circle", color: "#44c2a8", label: "Sensor check completed", time: "06:30 AM" },
  { icon: "warning", color: "#f9a825", label: "Moderate blight risk detected", time: "08:15 AM" },
  { icon: "flask", color: "#42a5f5", label: "Soil N-P-K within safe range", time: "09:00 AM" },
];
