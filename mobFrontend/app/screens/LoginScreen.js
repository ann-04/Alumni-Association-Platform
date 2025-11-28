import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const BACKEND_URL = "http://172.17.73.76:3000";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/signin`, {
        email: email.trim(),
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;

        if (!token) {
          throw new Error("Token not received from server");
        }

        await AsyncStorage.multiRemove(["authToken", "userData"]);

        try {
          await AsyncStorage.setItem("authToken", token);
          await AsyncStorage.setItem("userData", JSON.stringify(user));
          await AsyncStorage.flushGetRequests?.();
          const storedToken = await AsyncStorage.getItem("authToken");
          console.log("✅ Token stored successfully:", storedToken);

          if (storedToken) {
            Alert.alert("Success", "Login successful!");
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            });
          } else {
            Alert.alert(
              "Warning",
              "Could not confirm login. Please try again."
            );
          }
        } catch (storageError) {
          console.error("❌ Error saving token:", storageError);
        }
      } else {
        Alert.alert("Error", "Invalid credentials.");
      }
    } catch (error) {
      console.error("❌ Login error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0052D4", "#4364F7", "#6FB1FC"]}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0052D4" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#0052D4"
              style={{ marginTop: 20 }}
            />
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["#00C6FF", "#0072FF"]}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.signUpLink}>
              Don’t have an account?{" "}
              <Text style={styles.signUpText}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 30,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    borderRadius: 30,
    overflow: "hidden",
    marginTop: 10,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signUpLink: {
    fontSize: 15,
    marginTop: 25,
    color: "#444",
    textAlign: "center",
  },
  signUpText: {
    color: "#0052D4",
    fontWeight: "600",
  },
});
