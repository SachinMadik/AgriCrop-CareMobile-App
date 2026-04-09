import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../theme";

interface FarmStat {
  icon: string;
  label: string;
  value: string;
  color: string;
}

const FARM_STATS: FarmStat[] = [
  { icon: "resize", label: "Farm Area", value: "4.2 ha", color: "#44c2a8" },
  { icon: "leaf", label: "Crop", value: "Tomato", color: "#66bb6a" },
  {
    icon: "partly-sunny",
    label: "Season",
    value: "Kharif 2026",
    color: "#f9a825",
  },
  {
    icon: "shield-checkmark",
    label: "Disease Free",
    value: "24 days",
    color: "#42a5f5",
  },
];

interface ProfileField {
  icon: string;
  label: string;
  value: string;
  editable?: boolean;
}

const PROFILE_FIELDS: ProfileField[] = [
  {
    icon: "person-circle",
    label: "Farmer Name",
    value: "Sachchidanand M",
    editable: true,
  },
  {
    icon: "home",
    label: "Farm Name",
    value: "Green Valley Plot",
    editable: true,
  },
  {
    icon: "leaf",
    label: "Primary Crop",
    value: "Tomato (Solanum lycopersicum)",
    editable: true,
  },
  { icon: "layers", label: "Soil Type", value: "Sandy Loam", editable: true },
  { icon: "location", label: "Coordinates", value: "17.3850°N, 78.4867°E" },
  { icon: "map", label: "Region", value: "Telangana, India" },
  { icon: "call", label: "Contact", value: "+91 98765 43210", editable: true },
  { icon: "id-card", label: "Farmer ID", value: "TG-2026-042813" },
];

const ALERT_TYPES = [
  { label: "Disease Risk Alerts", desc: "Early warning for disease outbreaks" },
  { label: "Weather Warnings", desc: "Frost, storm, drought advisories" },
  { label: "Spray Reminders", desc: "Scheduled pesticide/fungicide tasks" },
  { label: "Market Updates", desc: "Price alerts for tomato produce" },
  { label: "Sensor Anomalies", desc: "Unexpected sensor readings" },
];

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [alertToggles, setAlertToggles] = useState(
    Object.fromEntries(ALERT_TYPES.map((a) => [a.label, true])),
  );

  function handleEnableNotifications() {
    setNotificationsEnabled(true);
    Alert.alert("Notifications Enabled", "You'll receive timely farm alerts.");
  }

  function toggleAlert(label: string) {
    setAlertToggles((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Farm Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons
            name="create-outline"
            size={18}
            color={theme.colors.accent}
          />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar / Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarInitials}>SM</Text>
          </View>
          <View style={styles.identityInfo}>
            <Text style={styles.farmerName}>Sachchidanand M</Text>
            <Text style={styles.farmerSub}>Verified Farmer · Since 2019</Text>
            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={13} color="#44c2a8" />
              <Text style={styles.verifiedText}>
                KYC Verified · Premium Plan
              </Text>
            </View>
          </View>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>PRO</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {FARM_STATS.map((stat, i) => (
            <View key={i} style={styles.statCard}>
              <View
                style={[
                  styles.statIcon,
                  { backgroundColor: `${stat.color}18` },
                ]}
              >
                <Ionicons
                  name={stat.icon as any}
                  size={18}
                  color={stat.color}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile Details */}
        <View style={styles.section}>
          <SectionHeader title="Farm Details" />
          <View style={styles.card}>
            {PROFILE_FIELDS.map((field, i) => (
              <ProfileRow
                key={i}
                field={field}
                isLast={i === PROFILE_FIELDS.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <SectionHeader title="Notifications" />

          {!notificationsEnabled ? (
            <View style={styles.notifPrompt}>
              <View style={styles.notifIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={28}
                  color="#f9a825"
                />
              </View>
              <Text style={styles.notifPromptTitle}>Enable Smart Alerts</Text>
              <Text style={styles.notifPromptSub}>
                Get real-time warnings for disease outbreaks, weather events,
                and spray schedules directly on your phone.
              </Text>
              <TouchableOpacity
                style={styles.enableBtn}
                onPress={handleEnableNotifications}
              >
                <Ionicons name="notifications" size={16} color="white" />
                <Text style={styles.enableBtnText}>
                  Enable Push Notifications
                </Text>
              </TouchableOpacity>
              <Text style={styles.permNote}>
                Notification permission required · No spam
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              {ALERT_TYPES.map((alert, i) => (
                <View
                  key={i}
                  style={[
                    styles.toggleRow,
                    i < ALERT_TYPES.length - 1 && styles.toggleBorder,
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>{alert.label}</Text>
                    <Text style={styles.toggleDesc}>{alert.desc}</Text>
                  </View>
                  <Switch
                    value={alertToggles[alert.label]}
                    onValueChange={() => toggleAlert(alert.label)}
                    trackColor={{
                      false: "#1a3d35",
                      true: "rgba(68,194,168,0.4)",
                    }}
                    thumbColor={
                      alertToggles[alert.label]
                        ? theme.colors.accent
                        : "#2d5a52"
                    }
                  />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Subscription */}
        <View style={styles.section}>
          <SectionHeader title="Subscription" />
          <View style={styles.subCard}>
            <View style={styles.subLeft}>
              <Text style={styles.subPlan}>CropGuard Pro</Text>
              <Text style={styles.subDetail}>
                Renews April 25, 2026 · ₹499/month
              </Text>
            </View>
            <TouchableOpacity style={styles.manageBtn}>
              <Text style={styles.manageBtnText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.dangerZone}>
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="log-out-outline" size={18} color="#ef5350" />
              <Text style={styles.dangerText}>Sign Out</Text>
            </TouchableOpacity>
            <View style={styles.dangerDivider} />
            <TouchableOpacity style={styles.dangerRow}>
              <Ionicons name="trash-outline" size={18} color="#ef5350" />
              <Text style={styles.dangerText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.version}>CropGuard AI v2.4.1 · Build 241</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

/* ── SUB-COMPONENTS ── */

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function ProfileRow({
  field,
  isLast,
}: {
  field: ProfileField;
  isLast: boolean;
}) {
  return (
    <View style={[styles.profileRow, !isLast && styles.rowBorder]}>
      <View style={styles.rowIcon}>
        <Ionicons name={field.icon as any} size={15} color="#3d6e64" />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{field.label}</Text>
        <Text style={styles.rowValue}>{field.value}</Text>
      </View>
      {field.editable && <Ionicons name="pencil" size={13} color="#1a4036" />}
    </View>
  );
}

/* ── STYLES ── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.background },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(68,194,168,0.1)",
    borderWidth: 1,
    borderColor: "rgba(68,194,168,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  editText: { color: theme.colors.accent, fontSize: 13, fontWeight: "700" },

  identityCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#0c2b24",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 18,
    gap: 14,
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#1a5c4a",
    borderWidth: 2,
    borderColor: "rgba(68,194,168,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: theme.colors.accent,
    fontSize: 22,
    fontWeight: "800",
  },
  identityInfo: { flex: 1 },
  farmerName: { color: theme.colors.text, fontSize: 17, fontWeight: "800" },
  farmerSub: { color: "#3d6e64", fontSize: 12, marginTop: 1 },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  verifiedText: { color: "#44c2a8", fontSize: 11, fontWeight: "600" },
  planBadge: {
    backgroundColor: "rgba(68,194,168,0.15)",
    borderWidth: 1,
    borderColor: "rgba(68,194,168,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  planText: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#0c2b24",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statValue: { color: theme.colors.text, fontSize: 13, fontWeight: "800" },
  statLabel: {
    color: "#3d6e64",
    fontSize: 9,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#0c2b24",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#123a32",
    overflow: "hidden",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#0f2e28" },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#1a3d35",
    alignItems: "center",
    justifyContent: "center",
  },
  rowContent: { flex: 1 },
  rowLabel: {
    color: "#3d6e64",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 1,
  },
  rowValue: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },

  notifPrompt: {
    backgroundColor: "#0c2b24",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#123a32",
    padding: 24,
    alignItems: "center",
  },
  notifIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(249,168,37,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  notifPromptTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  notifPromptSub: {
    color: "#5a7a72",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
  },
  enableBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1b5e20",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
    marginBottom: 10,
  },
  enableBtnText: { color: "white", fontWeight: "700", fontSize: 14 },
  permNote: { color: "#2d5a52", fontSize: 11 },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  toggleBorder: { borderBottomWidth: 1, borderBottomColor: "#0f2e28" },
  toggleLabel: { color: theme.colors.text, fontSize: 14, fontWeight: "600" },
  toggleDesc: { color: "#3d6e64", fontSize: 11, marginTop: 1 },

  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0c2b24",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(68,194,168,0.2)",
    padding: 16,
    gap: 12,
  },
  subLeft: { flex: 1 },
  subPlan: { color: theme.colors.text, fontSize: 15, fontWeight: "700" },
  subDetail: { color: "#3d6e64", fontSize: 12, marginTop: 2 },
  manageBtn: {
    backgroundColor: "rgba(68,194,168,0.1)",
    borderWidth: 1,
    borderColor: "rgba(68,194,168,0.3)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  manageBtnText: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: "700",
  },

  dangerZone: {
    backgroundColor: "#1a0a0a",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3a1010",
    overflow: "hidden",
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  dangerDivider: { height: 1, backgroundColor: "#3a1010" },
  dangerText: { color: "#ef5350", fontSize: 14, fontWeight: "600" },

  version: {
    color: "#1a3d35",
    textAlign: "center",
    fontSize: 11,
    marginTop: -8,
    marginBottom: 8,
  },
});
