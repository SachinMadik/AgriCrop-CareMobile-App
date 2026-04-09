import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { theme } from "../../theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#07201a",
          borderTopWidth: 1,
          borderTopColor: "#0f3329",
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: "#3d6e64",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.3,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="home" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Monitor",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="analytics"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: "Heatmap",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="map" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="warning"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="soil"
        options={{
          title: "Soil",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="leaf" focused={focused} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatbot"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="chatbubble-ellipses"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              name="person"
              focused={focused}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  focused,
  color,
  size,
}: {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 32,
        borderRadius: 10,
        backgroundColor: focused ? "rgba(68,194,168,0.12)" : "transparent",
      }}
    >
      <Ionicons
        name={focused ? (name as any) : (`${name}-outline` as any)}
        size={focused ? size : size - 1}
        color={color}
      />
    </View>
  );
}
