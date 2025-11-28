import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function GetStartedScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#0a3d62", "#3c40c6", "#706fd3"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0a3d62" />

      <View style={styles.header}>
        <Text style={styles.appName}>AlmaConnect</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1520975922320-6ea564a6f83f?w=800",
            }}
            style={styles.illustration}
          />
        </View>

        <Text style={styles.title}>Welcome Alumni!</Text>
        <Text style={styles.subtitle}>
          Connecting the past, present, and future
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Signup")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Sign up with Email</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or continue with</Text>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 70,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  imageWrapper: {
    width: width * 0.8,
    height: width * 0.45,
    marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  illustration: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#dcdde1",
    textAlign: "center",
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: "#00a8ff",
    paddingVertical: 14,
    borderRadius: 30,
    width: "85%",
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  orText: {
    color: "#e1e1e1",
    marginVertical: 18,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
  },
  socialButton: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#fff",
    marginTop: 30,
    fontSize: 15,
  },
  loginLink: {
    color: "#00a8ff",
    fontWeight: "600",
  },
});
