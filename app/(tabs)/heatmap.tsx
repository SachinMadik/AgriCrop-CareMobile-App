import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../theme";

type RiskLevel = "critical" | "high" | "moderate" | "low";

interface Zone {
  id: string;
  disease: string;
  pathogen: string;
  cases: number;
  radius: number;
  distance: number;
  risk: RiskLevel;
  direction: string;
  lastUpdated: string;
  trend: "rising" | "stable" | "falling";
}

const RISK_COLOR: Record<RiskLevel, string> = {
  critical: "#ef5350",
  high: "#ff8a65",
  moderate: "#f9a825",
  low: "#66bb6a",
};

const OUTBREAK_ZONES: Zone[] = [
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
  },
  {
    id: "3",
    disease: "Powdery Mildew",
    pathogen: "Erysiphe cichoracearum",
    cases: 3,
    radius: 3,
    distance: 12.1,
    risk: "moderate",
    direction: "W",
    lastUpdated: "1 hr ago",
    trend: "falling",
  },
  {
    id: "4",
    disease: "Root Rot",
    pathogen: "Fusarium oxysporum",
    cases: 1,
    radius: 2,
    distance: 19.4,
    risk: "low",
    direction: "S",
    lastUpdated: "2 hr ago",
    trend: "stable",
  },
];

const LEGEND = [
  { level: "critical", label: "Critical (>10 cases)" },
  { level: "high", label: "High (5–10 cases)" },
  { level: "moderate", label: "Moderate (2–4 cases)" },
  { level: "low", label: "Low (1 case)" },
] as const;

type TabKey = "zones" | "history" | "prevention";
const TABS: { key: TabKey; label: string }[] = [
  { key: "zones", label: "Outbreak Zones" },
  { key: "history", label: "History" },
  { key: "prevention", label: "Prevention" },
];

const PREVENTION_TIPS = [
  {
    icon: "shield-checkmark",
    tip: "Apply copper-based fungicide as preventive measure within 48 hours",
    priority: "Urgent",
  },
  {
    icon: "water",
    tip: "Avoid overhead irrigation; switch to drip irrigation to reduce leaf wetness",
    priority: "High",
  },
  {
    icon: "eye",
    tip: "Inspect plants in zone B4 daily for early blight symptoms",
    priority: "Medium",
  },
  {
    icon: "people",
    tip: "Coordinate with neighboring farms to synchronize spray schedules",
    priority: "Medium",
  },
];

export default function Heatmap() {
  const [activeTab, setActiveTab] = useState<TabKey>("zones");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Disease Heatmap</Text>
          <Text style={styles.subtitle}>4 active outbreak zones detected</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons
              name="layers-outline"
              size={20}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons
              name="refresh-outline"
              size={20}
              color={theme.colors.accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Visualization */}
        <View style={styles.mapSection}>
          <View style={styles.mapCard}>
            {/* Simulated map with concentric risk circles */}
            <View style={styles.mapBody}>
              {/* Outer grid lines */}
              <View
                style={[
                  styles.gridLine,
                  { top: "33%", left: 0, right: 0, height: 1 },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { top: "66%", left: 0, right: 0, height: 1 },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { left: "33%", top: 0, bottom: 0, width: 1 },
                ]}
              />
              <View
                style={[
                  styles.gridLine,
                  { left: "66%", top: 0, bottom: 0, width: 1 },
                ]}
              />

              {/* Outbreak markers */}
              <OutbreakMarker
                zone={OUTBREAK_ZONES[0]}
                top="38%"
                left="52%"
                size={64}
                onPress={setSelectedZone}
              />
              <OutbreakMarker
                zone={OUTBREAK_ZONES[1]}
                top="55%"
                left="28%"
                size={44}
                onPress={setSelectedZone}
              />
              <OutbreakMarker
                zone={OUTBREAK_ZONES[2]}
                top="25%"
                left="36%"
                size={30}
                onPress={setSelectedZone}
              />
              <OutbreakMarker
                zone={OUTBREAK_ZONES[3]}
                top="65%"
                left="65%"
                size={20}
                onPress={setSelectedZone}
              />

              {/* Your farm marker */}
              <View style={[styles.myFarm, { top: "47%", left: "48%" }]}>
                <View style={styles.myFarmDot} />
                <Text style={styles.myFarmLabel}>Your Farm</Text>
              </View>

              {/* Compass */}
              <View style={styles.compass}>
                <Text style={styles.compassN}>N</Text>
                <Ionicons
                  name="compass-outline"
                  size={22}
                  color="rgba(68,194,168,0.5)"
                />
              </View>

              {/* Scale */}
              <View style={styles.scale}>
                <View style={styles.scaleLine} />
                <Text style={styles.scaleText}>10 km</Text>
              </View>
            </View>

            {/* Legend */}
            <View style={styles.legendRow}>
              {LEGEND.map((l) => (
                <View key={l.level} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendDot,
                      { backgroundColor: RISK_COLOR[l.level] },
                    ]}
                  />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Selected Zone Detail Card */}
        {selectedZone && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailDisease}>{selectedZone.disease}</Text>
                <Text style={styles.detailPathogen}>
                  {selectedZone.pathogen}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedZone(null)}>
                <Ionicons name="close-circle" size={24} color="#3d6e64" />
              </TouchableOpacity>
            </View>
            <View style={styles.detailStats}>
              <DetailStat
                icon="pulse"
                label="Cases"
                value={`${selectedZone.cases}`}
                color={RISK_COLOR[selectedZone.risk]}
              />
              <DetailStat
                icon="locate"
                label="Distance"
                value={`${selectedZone.distance} km`}
                color="#42a5f5"
              />
              <DetailStat
                icon="radio-button-on"
                label="Spread"
                value={`${selectedZone.radius} km`}
                color="#ab47bc"
              />
              <DetailStat
                icon="navigate"
                label="Direction"
                value={selectedZone.direction}
                color="#f9a825"
              />
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, activeTab === t.key && styles.tabActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === t.key && styles.tabTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "zones" &&
            OUTBREAK_ZONES.map((zone) => (
              <ZoneCard key={zone.id} zone={zone} onSelect={setSelectedZone} />
            ))}

          {activeTab === "history" && (
            <View style={styles.historyCard}>
              {["March 24", "March 22", "March 19", "March 15"].map(
                (date, i) => (
                  <View key={i} style={styles.historyRow}>
                    <View style={styles.historyDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyDate}>{date}</Text>
                      <Text style={styles.historyEvent}>
                        {
                          [
                            "New late blight cluster detected in NE sector",
                            "Leaf blight confirmed in SW zone",
                            "Moderate risk advisory issued",
                            "Low-level fungal spores detected",
                          ][i]
                        }
                      </Text>
                    </View>
                  </View>
                ),
              )}
            </View>
          )}

          {activeTab === "prevention" && (
            <View style={styles.preventionList}>
              {PREVENTION_TIPS.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <View style={styles.tipIcon}>
                    <Ionicons
                      name={tip.icon as any}
                      size={18}
                      color="#44c2a8"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipPriority}>{tip.priority}</Text>
                    <Text style={styles.tipText}>{tip.tip}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ── SUB-COMPONENTS ── */

function OutbreakMarker({
  zone,
  top,
  left,
  size,
  onPress,
}: {
  zone: Zone;
  top: number | `${number}%`;
  left: number | `${number}%`;
  size: number;
  onPress: (z: Zone) => void;
}) {
  const color = RISK_COLOR[zone.risk];
  return (
    <TouchableOpacity
      style={[
        styles.marker,
        {
          top,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${color}22`,
          borderColor: `${color}66`,
        },
      ]}
      onPress={() => onPress(zone)}
    >
      <View
        style={[
          styles.markerDot,
          {
            backgroundColor: color,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: size * 0.15,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

function ZoneCard({
  zone,
  onSelect,
}: {
  zone: Zone;
  onSelect: (z: Zone) => void;
}) {
  const color = RISK_COLOR[zone.risk];
  const trendIcon =
    zone.trend === "rising"
      ? "trending-up"
      : zone.trend === "falling"
        ? "trending-down"
        : "remove";
  const trendColor =
    zone.trend === "rising"
      ? "#ef5350"
      : zone.trend === "falling"
        ? "#44c2a8"
        : "#f9a825";

  return (
    <TouchableOpacity style={styles.zoneCard} onPress={() => onSelect(zone)}>
      <View style={[styles.zoneAccent, { backgroundColor: color }]} />
      <View style={styles.zoneBody}>
        <View style={styles.zoneTop}>
          <View>
            <Text style={styles.zoneDisease}>{zone.disease}</Text>
            <Text style={styles.zonePathogen}>{zone.pathogen}</Text>
          </View>
          <View
            style={[
              styles.riskBadge,
              { backgroundColor: `${color}20`, borderColor: `${color}40` },
            ]}
          >
            <Text style={[styles.riskBadgeText, { color }]}>
              {zone.risk.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.zoneStats}>
          <StatChip icon="pulse" value={`${zone.cases} cases`} />
          <StatChip icon="locate" value={`${zone.distance} km away`} />
          <StatChip icon="radio-button-on" value={`${zone.radius} km radius`} />
        </View>
        <View style={styles.zoneMeta}>
          <Ionicons name="time-outline" size={11} color="#3d6e64" />
          <Text style={styles.zoneTime}>Updated {zone.lastUpdated}</Text>
          <Ionicons
            name={trendIcon as any}
            size={14}
            color={trendColor}
            style={{ marginLeft: 8 }}
          />
          <Text style={[styles.zoneTrend, { color: trendColor }]}>
            {zone.trend}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function StatChip({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon as any} size={11} color="#3d6e64" />
      <Text style={styles.chipText}>{value}</Text>
    </View>
  );
}

function DetailStat({ icon, label, value, color }: any) {
  return (
    <View style={styles.detailStat}>
      <View style={[styles.detailStatIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <Text style={[styles.detailStatValue, { color }]}>{value}</Text>
      <Text style={styles.detailStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 60 : 48,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: { color: "#3d6e64", fontSize: 13, marginTop: 2 },
  headerActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0c2b24",
    borderWidth: 1,
    borderColor: "#123a32",
    alignItems: "center",
    justifyContent: "center",
  },

  mapSection: { paddingHorizontal: 20, marginBottom: 16 },
  mapCard: {
    backgroundColor: "#0c2b24",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#123a32",
    overflow: "hidden",
  },
  mapBody: {
    height: 220,
    position: "relative",
    backgroundColor: "#071912",
  },
  gridLine: { position: "absolute", backgroundColor: "rgba(68,194,168,0.05)" },
  marker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  markerDot: {},
  myFarm: {
    position: "absolute",
    alignItems: "center",
    transform: [{ translateX: -20 }],
  },
  myFarmDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#44c2a8",
    borderWidth: 3,
    borderColor: "white",
  },
  myFarmLabel: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  compass: {
    position: "absolute",
    bottom: 12,
    right: 12,
    alignItems: "center",
  },
  compassN: { color: "rgba(68,194,168,0.6)", fontSize: 9, fontWeight: "700" },
  scale: {
    position: "absolute",
    bottom: 12,
    left: 12,
    alignItems: "flex-start",
  },
  scaleLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(68,194,168,0.4)",
    marginBottom: 3,
  },
  scaleText: { color: "rgba(68,194,168,0.5)", fontSize: 9 },

  legendRow: { padding: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#3d6e64", fontSize: 10, fontWeight: "500" },

  detailCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a4036",
    padding: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  detailDisease: { color: theme.colors.text, fontSize: 17, fontWeight: "700" },
  detailPathogen: {
    color: "#3d6e64",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  detailStats: { flexDirection: "row", justifyContent: "space-between" },
  detailStat: { alignItems: "center", gap: 4 },
  detailStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailStatValue: { fontSize: 14, fontWeight: "800" },
  detailStatLabel: { color: "#3d6e64", fontSize: 10, fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 0,
    marginBottom: 16,
    backgroundColor: "#071912",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: theme.colors.accent },
  tabText: { color: "#3d6e64", fontSize: 13, fontWeight: "700" },
  tabTextActive: { color: theme.colors.accent },
  tabContent: { paddingHorizontal: 20 },

  zoneCard: {
    flexDirection: "row",
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    marginBottom: 12,
    overflow: "hidden",
  },
  zoneAccent: { width: 4 },
  zoneBody: { flex: 1, padding: 14 },
  zoneTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  zoneDisease: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  zonePathogen: {
    color: "#3d6e64",
    fontSize: 11,
    fontStyle: "italic",
    marginTop: 1,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  riskBadgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  zoneStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1a3d35",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: { color: "#5a8a82", fontSize: 11, fontWeight: "500" },
  zoneMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  zoneTime: { color: "#3d6e64", fontSize: 11 },
  zoneTrend: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },

  historyCard: {
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 16,
    gap: 16,
  },
  historyRow: { flexDirection: "row", gap: 12 },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#44c2a8",
    marginTop: 5,
  },
  historyDate: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  historyEvent: { color: "#5a8a82", fontSize: 13 },

  preventionList: { gap: 10 },
  tipCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#0c2b24",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 14,
  },
  tipIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(68,194,168,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipPriority: {
    color: theme.colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tipText: { color: "#5a8a82", fontSize: 13, lineHeight: 18 },
});
