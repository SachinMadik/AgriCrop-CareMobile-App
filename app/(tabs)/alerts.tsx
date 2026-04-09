import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../theme";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
}

const SEVERITY_CONFIG: Record<
  Severity,
  { color: string; bg: string; dot: string }
> = {
  CRITICAL: { color: "#ef5350", bg: "#3a0f0f", dot: "#ef5350" },
  HIGH: { color: "#ff8a65", bg: "#2e1a0f", dot: "#ff8a65" },
  MEDIUM: { color: "#f9a825", bg: "#2e250f", dot: "#f9a825" },
  LOW: { color: "#66bb6a", bg: "#0f2e14", dot: "#66bb6a" },
};

const INITIAL_ALERTS: Alert[] = [
  {
    id: "1",
    severity: "CRITICAL",
    title: "Late Blight Detected",
    description:
      "Phytophthora infestans spores detected in zone A4. Immediate fungicide application recommended.",
    timestamp: "Today, 09:14 AM",
    source: "Sensor Node #12",
    acknowledged: false,
  },
  {
    id: "2",
    severity: "HIGH",
    title: "High Humidity Warning",
    description:
      "Relative humidity sustained above 85% for 6+ hours. Fungal growth conditions are favorable.",
    timestamp: "Today, 07:45 AM",
    source: "Weather Station",
    acknowledged: false,
  },
  {
    id: "3",
    severity: "MEDIUM",
    title: "Preventive Spray Due",
    description:
      "Scheduled fungicide spray task pending for zone B2. Planned: 2026-03-15 15:10 UTC.",
    timestamp: "Yesterday, 06:30 PM",
    source: "Task Scheduler",
    acknowledged: true,
  },
  {
    id: "4",
    severity: "MEDIUM",
    title: "Soil Moisture Low",
    description:
      "Soil moisture in zone C1 dropped below 30%. Consider irrigation within 24 hours.",
    timestamp: "Yesterday, 02:15 PM",
    source: "Soil Sensor",
    acknowledged: true,
  },
  {
    id: "5",
    severity: "LOW",
    title: "Temperature Fluctuation",
    description:
      "Nighttime temperature dropped 8°C below forecast. Monitor for cold stress symptoms.",
    timestamp: "2 days ago",
    source: "Weather Model",
    acknowledged: true,
  },
];

type FilterKey = "ALL" | Severity;
const FILTERS: FilterKey[] = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");

  const unacknowledged = alerts.filter((a) => !a.acknowledged).length;

  function acknowledge(id: string) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)),
    );
  }

  function acknowledgeAll() {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
  }

  const filtered =
    activeFilter === "ALL"
      ? alerts
      : alerts.filter((a) => a.severity === activeFilter);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Alerts & Prevention</Text>
          <Text style={styles.headerSub}>
            {unacknowledged > 0
              ? `${unacknowledged} unacknowledged alert${unacknowledged > 1 ? "s" : ""}`
              : "All alerts reviewed"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons
              name="options-outline"
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

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatPill
          count={alerts.filter((a) => a.severity === "CRITICAL").length}
          label="Critical"
          color="#ef5350"
        />
        <StatPill
          count={alerts.filter((a) => a.severity === "HIGH").length}
          label="High"
          color="#ff8a65"
        />
        <StatPill
          count={alerts.filter((a) => a.severity === "MEDIUM").length}
          label="Medium"
          color="#f9a825"
        />
        <StatPill
          count={alerts.filter((a) => a.severity === "LOW").length}
          label="Low"
          color="#66bb6a"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Ionicons name="pulse-outline" size={16} color="white" />
          <Text style={styles.primaryText}>Run Risk Check</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={acknowledgeAll}>
          <Ionicons
            name="checkmark-done-outline"
            size={16}
            color={theme.colors.accent}
          />
          <Text style={styles.secondaryText}>Acknowledge All</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterTab,
              activeFilter === f && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Alerts List */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={() => acknowledge(alert.id)}
          />
        ))}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="shield-checkmark-outline"
              size={48}
              color="#1a4036"
            />
            <Text style={styles.emptyText}>
              No {activeFilter !== "ALL" ? activeFilter.toLowerCase() : ""}{" "}
              alerts
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ── ALERT CARD ── */
function AlertCard({
  alert,
  onAcknowledge,
}: {
  alert: Alert;
  onAcknowledge: () => void;
}) {
  const cfg = SEVERITY_CONFIG[alert.severity];
  const scale = useRef(new Animated.Value(1)).current;

  function handlePress() {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start(onAcknowledge);
  }

  return (
    <Animated.View
      style={[
        styles.alertCard,
        alert.acknowledged && styles.alertCardAck,
        { transform: [{ scale }] },
      ]}
    >
      {/* Left accent */}
      <View style={[styles.alertAccent, { backgroundColor: cfg.dot }]} />

      <View style={styles.alertBody}>
        {/* Top Row */}
        <View style={styles.alertTop}>
          <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
            <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
            <Text style={[styles.badgeText, { color: cfg.color }]}>
              {alert.severity}
            </Text>
          </View>
          {alert.acknowledged && (
            <View style={styles.ackBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#44c2a8" />
              <Text style={styles.ackText}>Reviewed</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <Text
          style={[styles.alertTitle, alert.acknowledged && styles.textMuted]}
        >
          {alert.title}
        </Text>
        <Text style={styles.alertDesc}>{alert.description}</Text>

        {/* Footer */}
        <View style={styles.alertFooter}>
          <View style={styles.alertMeta}>
            <Ionicons name="time-outline" size={11} color="#3d6e64" />
            <Text style={styles.alertTime}>{alert.timestamp}</Text>
            <Text style={styles.alertDot}>·</Text>
            <Ionicons name="hardware-chip-outline" size={11} color="#3d6e64" />
            <Text style={styles.alertTime}>{alert.source}</Text>
          </View>

          {!alert.acknowledged && (
            <TouchableOpacity style={styles.ackBtn} onPress={handlePress}>
              <Text style={styles.ackBtnText}>Acknowledge</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

/* ── STAT PILL ── */
function StatPill({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.statPill, { borderColor: `${color}30` }]}>
      <Text style={[styles.statCount, { color }]}>{count}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ── STYLES ── */
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
  headerTitle: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: { color: "#3d6e64", fontSize: 13, marginTop: 2 },
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

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  statPill: {
    flex: 1,
    backgroundColor: "#0c2b24",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  statCount: { fontSize: 20, fontWeight: "800" },
  statLabel: {
    fontSize: 10,
    color: "#3d6e64",
    fontWeight: "600",
    letterSpacing: 0.3,
    marginTop: 1,
  },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#1b5e20",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },
  primaryText: { color: "white", fontWeight: "700", fontSize: 14 },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#0c2b24",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#123a32",
  },
  secondaryText: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 14,
  },

  filterScroll: { flexGrow: 0, marginBottom: 16 },
  filterContent: { paddingHorizontal: 20, gap: 8 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#0c2b24",
    borderWidth: 1,
    borderColor: "#123a32",
  },
  filterTabActive: {
    backgroundColor: "#1a4036",
    borderColor: theme.colors.accent,
  },
  filterText: {
    color: "#3d6e64",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  filterTextActive: { color: theme.colors.accent },

  list: { flex: 1, paddingHorizontal: 20 },

  alertCard: {
    flexDirection: "row",
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    marginBottom: 12,
    overflow: "hidden",
  },
  alertCardAck: { opacity: 0.65 },
  alertAccent: {
    width: 4,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  alertBody: { flex: 1, padding: 14 },
  alertTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  ackBadge: { flexDirection: "row", alignItems: "center", gap: 3 },
  ackText: { color: "#44c2a8", fontSize: 11, fontWeight: "600" },
  alertTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  textMuted: { color: "#5a8a82" },
  alertDesc: {
    color: "#5a7a72",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  alertMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  alertTime: { color: "#3d6e64", fontSize: 11 },
  alertDot: { color: "#1a4036", fontSize: 11 },
  ackBtn: {
    backgroundColor: "rgba(68,194,168,0.1)",
    borderWidth: 1,
    borderColor: "rgba(68,194,168,0.25)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  ackBtnText: { color: theme.colors.accent, fontSize: 12, fontWeight: "700" },

  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { color: "#1a4036", fontSize: 16, fontWeight: "600" },
});
