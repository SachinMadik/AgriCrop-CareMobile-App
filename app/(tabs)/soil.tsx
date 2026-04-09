import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
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

type Status = "SAFE" | "WARNING" | "CRITICAL" | "LOW";

interface Nutrient {
  id: string;
  name: string;
  symbol: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: number;
  status: Status;
  description: string;
  action?: string;
}

const STATUS_CONFIG: Record<
  Status,
  { color: string; bg: string; icon: string }
> = {
  SAFE: {
    color: "#66bb6a",
    bg: "rgba(102,187,106,0.12)",
    icon: "checkmark-circle",
  },
  WARNING: { color: "#f9a825", bg: "rgba(249,168,37,0.12)", icon: "warning" },
  CRITICAL: {
    color: "#ef5350",
    bg: "rgba(239,83,80,0.12)",
    icon: "alert-circle",
  },
  LOW: {
    color: "#42a5f5",
    bg: "rgba(66,165,245,0.12)",
    icon: "arrow-down-circle",
  },
};

const NUTRIENTS: Nutrient[] = [
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
    description:
      "Slightly below optimal for tomato cultivation. Nitrogen supports leaf growth and chlorophyll production.",
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
    description:
      "Phosphorus levels are within the healthy range. Supports root development and energy transfer.",
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
    description:
      "Good potassium levels support fruit quality, disease resistance, and water regulation.",
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
    description:
      "Ideal pH for nutrient availability. Most micronutrients are accessible in this range.",
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
    description:
      "Organic matter is on the lower end. Higher OM improves water retention, nutrient holding, and microbial activity.",
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
    description:
      "EC approaching the upper tolerance limit. High EC may cause osmotic stress and reduce water uptake.",
    action: "Flush soil with clean water and reduce fertilizer input.",
  },
];

const SOIL_HEALTH_SCORE = 72;

const LEACHING_HISTORY = [
  { label: "Mar 20", n: 38, p: 27, k: 62 },
  { label: "Mar 21", n: 40, p: 28, k: 63 },
  { label: "Mar 22", n: 41, p: 27, k: 65 },
  { label: "Mar 23", n: 42, p: 28, k: 66 },
  { label: "Mar 24", n: 42, p: 28, k: 65 },
];

export default function Soil() {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Soil Intelligence</Text>
          <Text style={styles.subtitle}>
            Sandy loam · Last updated 1 hr ago
          </Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons
            name="refresh-outline"
            size={20}
            color={theme.colors.accent}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Health Score */}
        <View style={styles.scoreSection}>
          <HealthGauge score={SOIL_HEALTH_SCORE} />
          <View style={styles.scoreMeta}>
            <Text style={styles.scoreLabel}>Overall Soil Health</Text>
            <Text style={styles.scoreSub}>2 nutrients need attention</Text>
            <View style={styles.scoreStatusRow}>
              <StatusPill count={3} label="Optimal" color="#66bb6a" />
              <StatusPill count={2} label="Warning" color="#f9a825" />
              <StatusPill count={1} label="Low" color="#42a5f5" />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Ionicons name="flask-outline" size={16} color="white" />
            <Text style={styles.primaryBtnText}>Run Soil Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Ionicons
              name="document-text-outline"
              size={16}
              color={theme.colors.accent}
            />
            <Text style={styles.secondaryBtnText}>Leaching Report</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrients */}
        <View style={styles.section}>
          <SectionHeader title="Nutrient Analysis" />
          {NUTRIENTS.map((n) => (
            <NutrientCard key={n.id} nutrient={n} />
          ))}
        </View>

        {/* Trend Chart */}
        <View style={styles.section}>
          <SectionHeader title="7-Day Trend" />
          <View style={styles.chartCard}>
            <View style={styles.chartLegend}>
              <LegendItem color="#44c2a8" label="Nitrogen (N)" />
              <LegendItem color="#f9a825" label="Phosphorus (P)" />
              <LegendItem color="#42a5f5" label="Potassium (K)" />
            </View>
            <View style={styles.chartBody}>
              {LEACHING_HISTORY.map((entry, i) => (
                <View key={i} style={styles.chartCol}>
                  <MiniBar value={entry.n} max={100} color="#44c2a8" />
                  <MiniBar value={entry.p} max={100} color="#f9a825" />
                  <MiniBar value={entry.k} max={100} color="#42a5f5" />
                  <Text style={styles.chartLabel}>{entry.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <SectionHeader title="AI Recommendations" />
          <View style={styles.recCard}>
            {NUTRIENTS.filter((n) => n.action).map((n) => (
              <View key={n.id} style={styles.recRow}>
                <View
                  style={[
                    styles.recIcon,
                    { backgroundColor: STATUS_CONFIG[n.status].bg },
                  ]}
                >
                  <Ionicons
                    name={STATUS_CONFIG[n.status].icon as any}
                    size={16}
                    color={STATUS_CONFIG[n.status].color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recTitle}>{n.name}</Text>
                  <Text style={styles.recAction}>{n.action}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ── COMPONENTS ── */

function HealthGauge({ score }: { score: number }) {
  const color = score >= 80 ? "#66bb6a" : score >= 60 ? "#f9a825" : "#ef5350";
  return (
    <View style={styles.gauge}>
      <View style={[styles.gaugeRing, { borderColor: `${color}40` }]}>
        <View style={[styles.gaugeInner, { borderColor: color }]}>
          <Text style={[styles.gaugeScore, { color }]}>{score}</Text>
          <Text style={styles.gaugeUnit}>/ 100</Text>
        </View>
      </View>
    </View>
  );
}

function NutrientCard({ nutrient: n }: { nutrient: Nutrient }) {
  const cfg = STATUS_CONFIG[n.status];
  const pct = (n.value - n.min) / (n.max - n.min);
  const optPct = (n.optimal - n.min) / (n.max - n.min);
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: Math.max(0, Math.min(1, pct)),
      duration: 800,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.nutrientCard}>
      <View style={styles.nutrientTop}>
        <View style={styles.nutrientLeft}>
          <View style={[styles.symbolBadge, { backgroundColor: cfg.bg }]}>
            <Text style={[styles.symbol, { color: cfg.color }]}>
              {n.symbol}
            </Text>
          </View>
          <View>
            <Text style={styles.nutrientName}>{n.name}</Text>
            <Text style={styles.nutrientValue}>
              {n.value}
              {n.unit}{" "}
              <Text style={{ color: "#3d6e64", fontWeight: "400" }}>
                ({n.min}–{n.max}
                {n.unit})
              </Text>
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={12} color={cfg.color} />
          <Text style={[styles.statusText, { color: cfg.color }]}>
            {n.status}
          </Text>
        </View>
      </View>

      {/* Bar */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              backgroundColor: cfg.color,
              width: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
        {/* Optimal marker */}
        <View style={[styles.optimalMark, { left: `${optPct * 100}%` }]} />
      </View>
      <View style={styles.barLabels}>
        <Text style={styles.barLabelText}>Min</Text>
        <Text style={styles.barLabelOptimal}>
          ▲ Optimal: {n.optimal}
          {n.unit}
        </Text>
        <Text style={styles.barLabelText}>Max</Text>
      </View>

      <Text style={styles.nutrientDesc}>{n.description}</Text>
    </View>
  );
}

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const h = Math.round((value / max) * 80);
  return (
    <View style={[styles.miniBar, { height: h, backgroundColor: color }]} />
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function StatusPill({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.statusPill, { borderColor: `${color}30` }]}>
      <Text style={[styles.statusPillCount, { color }]}>{count}</Text>
      <Text style={styles.statusPillLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
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
  title: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: { color: "#3d6e64", fontSize: 13, marginTop: 2 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#0c2b24",
    borderWidth: 1,
    borderColor: "#123a32",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 20,
    backgroundColor: "#0c2b24",
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#123a32",
    marginBottom: 16,
  },
  gauge: { padding: 4 },
  gaugeRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeScore: { fontSize: 26, fontWeight: "900" },
  gaugeUnit: { color: "#3d6e64", fontSize: 10 },
  scoreMeta: { flex: 1 },
  scoreLabel: { color: theme.colors.text, fontSize: 16, fontWeight: "700" },
  scoreSub: { color: "#3d6e64", fontSize: 12, marginTop: 2, marginBottom: 8 },
  scoreStatusRow: { flexDirection: "row", gap: 6 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#0a2018",
    borderRadius: 10,
    borderWidth: 1,
  },
  statusPillCount: { fontSize: 13, fontWeight: "800" },
  statusPillLabel: { color: "#3d6e64", fontSize: 10, fontWeight: "600" },

  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
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
  primaryBtnText: { color: "white", fontWeight: "700", fontSize: 14 },
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
  secondaryBtnText: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 14,
  },

  section: { paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 12,
  },

  nutrientCard: {
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 16,
    marginBottom: 10,
  },
  nutrientTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  nutrientLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  symbolBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: { fontSize: 18, fontWeight: "900" },
  nutrientName: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  nutrientValue: {
    color: theme.colors.accent,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  barTrack: {
    height: 8,
    backgroundColor: "#1a3d35",
    borderRadius: 4,
    overflow: "visible",
    marginBottom: 4,
    position: "relative",
  },
  barFill: { height: "100%", borderRadius: 4 },
  optimalMark: {
    position: "absolute",
    top: -3,
    width: 2,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: 1,
  },
  barLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  barLabelText: { color: "#2d5a52", fontSize: 9 },
  barLabelOptimal: { color: "rgba(255,255,255,0.3)", fontSize: 9 },
  nutrientDesc: { color: "#5a7a72", fontSize: 12, lineHeight: 17 },

  chartCard: {
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 16,
    marginBottom: 10,
  },
  chartLegend: { flexDirection: "row", gap: 16, marginBottom: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: "#5a8a82", fontSize: 11 },
  chartBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
  },
  chartCol: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    justifyContent: "flex-end",
  },
  miniBar: { width: 8, borderRadius: 4 },
  chartLabel: { color: "#2d5a52", fontSize: 9, marginTop: 6 },

  recCard: {
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 4,
  },
  recRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#0f2e28",
  },
  recIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recTitle: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  recAction: { color: "#5a7a72", fontSize: 12, lineHeight: 17 },
});
