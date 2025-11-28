import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const BACKEND_URL = "http://172.17.73.76:3000";

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          navigation.replace("GetStarted");
          return;
        }

        const response = await fetch(`${BACKEND_URL}/api/user/information`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile(data.user || data);
      } catch (error) {
        console.error("❌ Profile fetch error:", error);
        Alert.alert("Error", "Unable to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authtoken");
      Alert.alert("Logged Out", "You have been logged out successfully.");
      navigation.replace("GetStarted");
    } catch (error) {
      console.error("❌ Logout error:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0052D4" />
        <Text style={{ marginTop: 10, color: "#333" }}>Loading Profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found.</Text>
      </View>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <LinearGradient
      colors={["#FFFFFF", "#EAF2FF"]}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <LinearGradient
          colors={["#0052D4", "#4364F7", "#6FB1FC"]}
          style={styles.profileHeader}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.roleText}>{profile.role || "Alumni"}</Text>
        </LinearGradient>

        {/* Profile Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          {[
            { icon: "mail-outline", label: profile.email || "N/A" },
            { icon: "call-outline", label: profile.phone || "N/A" },
            {
              icon: "calendar-outline",
              label: profile.dob ? profile.dob.split("T")[0] : "Not provided",
            },
            {
              icon: "person-outline",
              label: profile.gender || "Not specified",
            },
            {
              icon: "heart-outline",
              label: profile.maritalStatus || "Not specified",
            },
            {
              icon: "location-outline",
              label: profile.location || "Not provided",
            },
          ].map((item, index) => (
            <View key={index} style={styles.infoRow}>
              <Ionicons name={item.icon} size={20} color="#0052D4" />
              <Text style={styles.infoText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#0052D4",
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },
  roleText: { fontSize: 16, color: "#f0f0f0", marginTop: 3 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    margin: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#0052D4",
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "#F4F7FF",
    borderRadius: 10,
    padding: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    marginHorizontal: 30,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorText: { textAlign: "center", fontSize: 16, color: "red" },
});
