import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // ✅ Use the exact same key used in LoginScreen
        const token = await AsyncStorage.getItem("authToken");
        console.log("🔹 Token from storage:", token);

        if (token) {
          try {
            // ✅ Optional token verification — use the correct backend endpoint
            const res = await axios.get(
              "http://172.17.73.76:3000/api/user/information",
              {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 3000,
              }
            );

            if (res.status === 200) {
              console.log("✅ Token valid, redirecting to MainTabs");
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              });
              return;
            }
          } catch (verifyErr) {
            console.log("⚠️ Token invalid or expired:", verifyErr.message);
            await AsyncStorage.removeItem("authToken");
          }
        }

        // ❌ No valid token found → redirect to GetStarted
        console.log("❌ No valid token found, redirecting to GetStarted");
        navigation.reset({
          index: 0,
          routes: [{ name: "GetStarted" }],
        });
      } catch (error) {
        console.error("❌ Splash error:", error);
        navigation.reset({
          index: 0,
          routes: [{ name: "GetStarted" }],
        });
      }
    };

    // Add slight delay for smoother transition
    const timer = setTimeout(checkLoginStatus, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
