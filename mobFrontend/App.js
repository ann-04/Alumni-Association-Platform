import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import SplashScreen from "./app/screens/SplashScreen";
import GetStartedScreen from "./app/screens/GetStartedScreen";
import LoginScreen from "./app/screens/LoginScreen";
import SignupScreen from "./app/screens/SignupScreen";
import HomeScreen from "./app/screens/HomeScreen";
import ProfileScreen from "./app/screens/ProfileScreen";
import MainTabs from "./app/navigation/MainTabs";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Step 1: App Launch */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Step 2: Get Started */}
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />

        {/* Step 3: Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Step 4: Main App (with Bottom Tabs) */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* Step 5: Profile Screen (can be accessed from Home or Tabs) */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
