import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker, MapPressEvent, Region } from "react-native-maps";
import { API_BASE } from "../../services/api";
import { theme } from "../../theme";

// ─── Types ───────────────────────────────────────────────────────────────────

type Severity = "low" | "moderate" | "high" | "critical";

interface DiseaseZone {
  id: string;
  disease: string;
  severity?: string;
  risk?: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  lastUpdated?: string;
  createdAt?: string;
  cases?: number;
  pathogen?: string;
}

interface LatLng {
  latitude: number;
  longitude: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SEVERITY_COLOR: Record<Severity, string> = {
  low: "#66bb6a",
  moderate: "#f9a825",
  high: "#ff8a65",
  critical: "#ef5350",
};

const SEVERITY_OPTIONS: Severity[] = ["low", "moderate", "high", "critical"];

// Default center: Telangana, India (farm location from profile)
const DEFAULT_REGION: Region = {
  latitude: 17.385,
  longitude: 78.4867,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSeverity(zone: DiseaseZone): Severity {
  const raw = (zone.severity ?? zone.risk ?? "low").toLowerCase();
  if (raw === "critical") return "critical";
  if (raw === "high") return "high";
  if (raw === "moderate" || raw === "medium") return "moderate";
  return "low";
}

function getColor(zone: DiseaseZone): string {
  return SEVERITY_COLOR[getSeverity(zone)];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Heatmap() {
  const mapRef = useRef<MapView>(null);

  // Data
  const [zones, setZones] = useState<DiseaseZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  // Modal
  const [showForm, setShowForm] = useState(false);
  const [pinLocation, setPinLocation] = useState<LatLng | null>(null);
  const [pinMode, setPinMode] = useState(false); // true = waiting for map tap

  // Form fields
  const [formDisease, setFormDisease] = useState("");
  const [formSeverity, setFormSeverity] = useState<Severity>("low");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── Load data ──────────────────────────────────────────────────────────────

  async function fetchZones() {
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
      const res = await fetch(`${API_BASE}/disease-zones`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: DiseaseZone[] = await res.json();
      setZones(Array.isArray(data) ? data : []);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        Alert.alert("Timeout", "Server took too long to respond. Is the backend running?");
      } else {
        Alert.alert(
          "Connection Error",
          "Could not load disease zones. Make sure the backend is running and you are on the same WiFi.",
        );
      }
      console.log("Fetch zones error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      const coords: LatLng = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(coords);
      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.3, longitudeDelta: 0.3 },
        800,
      );
    } catch (e) {
      console.log("Location error:", e);
    }
  }

  useEffect(() => {
    fetchZones();
    requestLocation();
  }, []);

  // ── Map press → pin location ───────────────────────────────────────────────

  function handleMapPress(e: MapPressEvent) {
    if (!pinMode) return;
    const coords = e.nativeEvent.coordinate;
    setPinLocation(coords);
    setPinMode(false);
    setShowForm(true);
  }

  // ── Open form with GPS ─────────────────────────────────────────────────────

  async function openFormWithGPS() {
    setPinLocation(userLocation);
    setShowForm(true);
  }

  // ── Open form with map tap ─────────────────────────────────────────────────

  function openFormWithMapTap() {
    setShowForm(false);
    setPinMode(true);
    Alert.alert("Tap on Map", "Tap anywhere on the map to set the disease location.");
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function submitZone() {
    if (!formDisease.trim()) {
      Alert.alert("Required", "Please enter a disease name.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        disease: formDisease.trim(),
        severity: formSeverity,
        description: formDescription.trim() || null,
        latitude: pinLocation?.latitude ?? null,
        longitude: pinLocation?.longitude ?? null,
      };
      const res = await fetch(`${API_BASE}/disease-zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      closeForm();
      await fetchZones();
      Alert.alert("Success", "Disease zone reported and visible to all users.");
    } catch (e) {
      console.log("Submit error:", e);
      Alert.alert("Error", "Could not submit. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  function closeForm() {
    setShowForm(false);
    setFormDisease("");
    setFormSeverity("low");
    setFormDescription("");
    setPinLocation(null);
    Keyboard.dismiss();
  }

  // ── Resolve (delete) a zone ────────────────────────────────────────────────

  async function resolveZone(zone: DiseaseZone) {
    Alert.alert(
      "Resolve Disease Zone",
      `Mark "${zone.disease}" as resolved? It will be removed from the map for all users.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Resolve",
          style: "destructive",
          onPress: async () => {
            try {
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 8000);
              const res = await fetch(`${API_BASE}/disease-zones/${zone.id}`, {
                method: "DELETE",
                signal: controller.signal,
              });
              clearTimeout(timeout);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              // Remove instantly from local state — no need to refetch
              setZones((prev) => prev.filter((z) => z.id !== zone.id));
            } catch (e) {
              console.log("Resolve error:", e);
              Alert.alert("Error", "Could not resolve zone. Check your connection.");
            }
          },
        },
      ],
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const zonesWithCoords = zones.filter(
    (z) => z.latitude != null && z.longitude != null,
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Disease Heatmap</Text>
          <Text style={styles.subtitle}>
            {loading ? "Loading..." : `${zones.length} zones · ${zonesWithCoords.length} on map`}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={requestLocation}
            activeOpacity={0.7}
          >
            <Ionicons name="locate" size={20} color={theme.colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={fetchZones}
            activeOpacity={0.7}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.accent} />
            ) : (
              <Ionicons name="refresh-outline" size={20} color={theme.colors.accent} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Map ── */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={DEFAULT_REGION}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={handleMapPress}
          mapType="standard"
        >
          {/* Disease zone markers */}
          {zonesWithCoords.map((zone) => {
            const color = getColor(zone);
            const sev = getSeverity(zone);
            return (
              <Marker
                key={zone.id}
                coordinate={{
                  latitude: zone.latitude!,
                  longitude: zone.longitude!,
                }}
                pinColor={color}
              >
                <View style={[styles.markerPin, { backgroundColor: color, borderColor: `${color}88` }]}>
                  <Ionicons name="warning" size={14} color="white" />
                </View>
                <Callout tooltip>
                  <View style={styles.callout}>
                    <Text style={styles.calloutTitle}>{zone.disease}</Text>
                    <View style={[styles.calloutBadge, { backgroundColor: `${color}22` }]}>
                      <Text style={[styles.calloutSeverity, { color }]}>
                        {sev.toUpperCase()}
                      </Text>
                    </View>
                    {zone.description ? (
                      <Text style={styles.calloutDesc}>{zone.description}</Text>
                    ) : null}
                    {zone.cases ? (
                      <Text style={styles.calloutMeta}>{zone.cases} cases reported</Text>
                    ) : null}
                    <Text style={styles.calloutMeta}>
                      {zone.lastUpdated ?? zone.createdAt ?? ""}
                    </Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}

          {/* Temporary pin for new zone */}
          {pinLocation && !showForm && (
            <Marker coordinate={pinLocation} pinColor="#44c2a8" />
          )}
        </MapView>

        {/* Pin mode overlay */}
        {pinMode && (
          <View pointerEvents="none" style={styles.pinModeOverlay}>
            <View style={styles.pinModeBanner}>
              <Ionicons name="pin" size={16} color="white" />
              <Text style={styles.pinModeText}>Tap on the map to place marker</Text>
            </View>
          </View>
        )}

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={openFormWithGPS}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* ── Zone List ── */}
      <View style={styles.listSection}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Reported Zones</Text>
          <Text style={styles.listCount}>{zones.length}</Text>
        </View>
        <ScrollView
          horizontal={false}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {zones.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={36} color="#1a4036" />
              <Text style={styles.emptyText}>No disease zones reported yet.</Text>
              <Text style={styles.emptySubText}>Tap + to add the first one.</Text>
            </View>
          )}
          {zones.map((zone) => {
            const color = getColor(zone);
            const sev = getSeverity(zone);
            return (
              <TouchableOpacity
                key={zone.id}
                style={styles.zoneCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (zone.latitude && zone.longitude) {
                    mapRef.current?.animateToRegion(
                      {
                        latitude: zone.latitude,
                        longitude: zone.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      },
                      600,
                    );
                  }
                }}
              >
                <View style={[styles.zoneAccent, { backgroundColor: color }]} />
                <View style={styles.zoneBody}>
                  <View style={styles.zoneRow}>
                    <Text style={styles.zoneDisease}>{zone.disease}</Text>
                    <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}44` }]}>
                      <Text style={[styles.badgeText, { color }]}>{sev.toUpperCase()}</Text>
                    </View>
                  </View>
                  {zone.description ? (
                    <Text style={styles.zoneDesc} numberOfLines={2}>{zone.description}</Text>
                  ) : null}
                  <View style={styles.zoneMeta}>
                    {zone.latitude ? (
                      <View style={styles.metaChip}>
                        <Ionicons name="location" size={10} color="#3d6e64" />
                        <Text style={styles.metaText}>
                          {zone.latitude.toFixed(4)}, {zone.longitude?.toFixed(4)}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.metaChip}>
                        <Ionicons name="location-outline" size={10} color="#1a4036" />
                        <Text style={[styles.metaText, { color: "#1a4036" }]}>No location</Text>
                      </View>
                    )}
                    <Text style={styles.metaTime}>{zone.lastUpdated ?? zone.createdAt ?? ""}</Text>
                  </View>
                  {/* Resolve button */}
                  <TouchableOpacity
                    style={styles.resolveBtn}
                    onPress={() => resolveZone(zone)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark-circle-outline" size={13} color="#44c2a8" />
                    <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
          <View style={{ height: 16 }} />
        </ScrollView>
      </View>

      {/* ── Add Disease Modal ── */}
      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={closeForm}
      >
        <KeyboardAvoidingView
          style={styles.modalWrapper}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalOverlay} onPress={closeForm} />
          <View style={styles.modalCard}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Report Disease Zone</Text>
            <Text style={styles.modalSubtitle}>
              Visible to all users in real-time
            </Text>

            {/* Disease Name */}
            <Text style={styles.fieldLabel}>Disease Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Late Blight, Powdery Mildew"
              placeholderTextColor="#3d6e64"
              value={formDisease}
              onChangeText={setFormDisease}
              autoCapitalize="words"
              returnKeyType="next"
            />

            {/* Severity */}
            <Text style={styles.fieldLabel}>Severity *</Text>
            <View style={styles.severityRow}>
              {SEVERITY_OPTIONS.map((s) => {
                const active = formSeverity === s;
                const c = SEVERITY_COLOR[s];
                return (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.severityBtn,
                      active && { backgroundColor: c, borderColor: c },
                    ]}
                    onPress={() => setFormSeverity(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.severityText, active && { color: "white" }]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description */}
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Describe symptoms, affected area..."
              placeholderTextColor="#3d6e64"
              value={formDescription}
              onChangeText={setFormDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Location */}
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.locationRow}>
              <TouchableOpacity
                style={[styles.locBtn, pinLocation && styles.locBtnActive]}
                onPress={openFormWithGPS}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="locate"
                  size={15}
                  color={pinLocation ? theme.colors.accent : "#3d6e64"}
                />
                <Text style={[styles.locBtnText, pinLocation && { color: theme.colors.accent }]}>
                  Use GPS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.locBtn}
                onPress={openFormWithMapTap}
                activeOpacity={0.7}
              >
                <Ionicons name="pin-outline" size={15} color="#3d6e64" />
                <Text style={styles.locBtnText}>Tap on Map</Text>
              </TouchableOpacity>
            </View>
            {pinLocation && (
              <Text style={styles.coordText}>
                📍 {pinLocation.latitude.toFixed(5)}, {pinLocation.longitude.toFixed(5)}
              </Text>
            )}

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeForm}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={submitZone}
                disabled={submitting}
                activeOpacity={0.7}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.submitText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 60 : 48,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
  },
  title: { color: theme.colors.text, fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#3d6e64", fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#0c2b24", borderWidth: 1, borderColor: "#123a32",
    alignItems: "center", justifyContent: "center",
  },

  // Map
  mapContainer: { height: 320, position: "relative" },
  map: { flex: 1 },

  markerPin: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, elevation: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 3,
  },

  callout: {
    backgroundColor: "#0c2b24",
    borderRadius: 12, padding: 12,
    minWidth: 160, maxWidth: 220,
    borderWidth: 1, borderColor: "#1a4036",
    elevation: 6,
  },
  calloutTitle: { color: theme.colors.text, fontSize: 14, fontWeight: "700", marginBottom: 4 },
  calloutBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginBottom: 6 },
  calloutSeverity: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  calloutDesc: { color: "#9fbdb5", fontSize: 12, lineHeight: 16, marginBottom: 4 },
  calloutMeta: { color: "#3d6e64", fontSize: 10, marginTop: 2 },

  pinModeOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  pinModeBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "rgba(68,194,168,0.9)",
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
  },
  pinModeText: { color: "white", fontWeight: "700", fontSize: 13 },

  fab: {
    position: "absolute", bottom: 16, right: 16,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#1b5e20",
    alignItems: "center", justifyContent: "center",
    elevation: 6,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 4,
    borderWidth: 1, borderColor: "#2E7D32",
  },

  // Zone list
  listSection: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  listHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  listTitle: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  listCount: {
    color: theme.colors.accent, fontSize: 12, fontWeight: "700",
    backgroundColor: "rgba(68,194,168,0.1)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  list: { flex: 1 },

  emptyState: { alignItems: "center", paddingVertical: 32, gap: 8 },
  emptyText: { color: "#3d6e64", fontSize: 14, fontWeight: "600" },
  emptySubText: { color: "#1a4036", fontSize: 12 },

  zoneCard: {
    flexDirection: "row", backgroundColor: "#0c2b24",
    borderRadius: 14, borderWidth: 1, borderColor: "#123a32",
    marginBottom: 10, overflow: "hidden",
  },
  zoneAccent: { width: 4 },
  zoneBody: { flex: 1, padding: 12 },
  zoneRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  zoneDisease: { color: theme.colors.text, fontSize: 14, fontWeight: "700", flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1, marginLeft: 8 },
  badgeText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  zoneDesc: { color: "#5a7a72", fontSize: 12, lineHeight: 16, marginBottom: 6 },
  zoneMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { color: "#3d6e64", fontSize: 10 },
  metaTime: { color: "#1a4036", fontSize: 10 },

  resolveBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    marginTop: 8, alignSelf: "flex-start",
    backgroundColor: "rgba(68,194,168,0.08)",
    borderWidth: 1, borderColor: "rgba(68,194,168,0.2)",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  resolveBtnText: { color: "#44c2a8", fontSize: 11, fontWeight: "700" },

  // Modal
  modalWrapper: { flex: 1, justifyContent: "flex-end" },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  modalCard: {
    backgroundColor: "#0c2b24",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderWidth: 1, borderColor: "#1a4036",
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#1a4036", alignSelf: "center", marginBottom: 16,
  },
  modalTitle: { color: theme.colors.text, fontSize: 20, fontWeight: "800", marginBottom: 4 },
  modalSubtitle: { color: "#3d6e64", fontSize: 13, marginBottom: 16 },

  fieldLabel: { color: "#9fbdb5", fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: "#071912", borderRadius: 12,
    borderWidth: 1, borderColor: "#1a4036",
    padding: 12, color: "white", fontSize: 14,
  },
  inputMulti: { height: 80, textAlignVertical: "top" },

  severityRow: { flexDirection: "row", gap: 8 },
  severityBtn: {
    flex: 1, paddingVertical: 9, borderRadius: 10,
    borderWidth: 1, borderColor: "#1a4036",
    backgroundColor: "#071912", alignItems: "center",
  },
  severityText: { color: "#3d6e64", fontSize: 11, fontWeight: "700" },

  locationRow: { flexDirection: "row", gap: 10 },
  locBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: "#1a4036", backgroundColor: "#071912",
  },
  locBtnActive: { borderColor: theme.colors.accent, backgroundColor: "rgba(68,194,168,0.08)" },
  locBtnText: { color: "#3d6e64", fontSize: 12, fontWeight: "600" },
  coordText: { color: theme.colors.accent, fontSize: 11, marginTop: 6, textAlign: "center" },

  modalActions: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: "#1a4036", alignItems: "center",
  },
  cancelText: { color: "#3d6e64", fontWeight: "700" },
  submitBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 12,
    backgroundColor: "#1b5e20", borderWidth: 1, borderColor: "#2E7D32",
    alignItems: "center", justifyContent: "center",
  },
  submitText: { color: "white", fontWeight: "700", fontSize: 15 },
});
