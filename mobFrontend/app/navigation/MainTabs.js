import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import OrganizeEventScreen from "../screens/OrganizeEventScreen";
import DonateScreen from "../screens/DonateScreen";
import JobBoardScreen from "../screens/JobBoardScreen";
import AlumniDirectoryScreen from "../screens/AlumniDirectoryScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#6C2DC7",
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          elevation: 20,
          height: 70,
          paddingBottom: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Organize Event")
            iconName = "calendar-outline";
          else if (route.name === "Donate") iconName = "heart-outline";
          else if (route.name === "Job Board") iconName = "briefcase-outline";
          else if (route.name === "Alumni Directory")
            iconName = "people-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Organize Event" component={OrganizeEventScreen} />
      <Tab.Screen name="Donate" component={DonateScreen} />
      <Tab.Screen name="Job Board" component={JobBoardScreen} />
      <Tab.Screen name="Alumni Directory" component={AlumniDirectoryScreen} />
    </Tab.Navigator>
  );
}
