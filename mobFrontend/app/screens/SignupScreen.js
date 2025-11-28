import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const BACKEND_URL = "http://172.17.73.76:3000";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneVisibility, setPhoneVisibility] = useState("PUBLIC");
  const [role, setRole] = useState("ALUMNI");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/user/signup`, {
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        phoneVisibility,
        role,
      });

      if (res.status === 200 || res.status === 201) {
        Alert.alert("Success", "Signup successful! Please login.");
        navigation.replace("Login");
      } else {
        Alert.alert("Error", res.data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0a3d62", "#3c40c6", "#706fd3"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Create Your Alumni Account</Text>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>
              Already have an account?{" "}
              <Text style={styles.signInText}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#ccc"
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Phone Visibility Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Phone Visibility</Text>
            <Picker
              selectedValue={phoneVisibility}
              onValueChange={(itemValue) => setPhoneVisibility(itemValue)}
              style={styles.picker}
              dropdownIconColor="#00a8ff"
            >
              <Picker.Item label="Public" value="PUBLIC" />
              <Picker.Item label="Private" value="PRIVATE" />
            </Picker>
          </View>

          {/* Account Type Dropdown */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Account Type</Text>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
              dropdownIconColor="#00a8ff"
            >
              <Picker.Item label="Alumni" value="ALUMNI" />
              <Picker.Item label="Student" value="STUDENT" />
              <Picker.Item label="Faculty" value="FACULTY" />
            </Picker>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#00a8ff"
              style={{ marginTop: 20 }}
            />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          )}
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
    borderRadius: 40,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0a3d62",
    marginBottom: 10,
    textAlign: "center",
  },
  signInLink: {
    fontSize: 16,
    marginBottom: 25,
    color: "#555",
    textAlign: "center",
  },
  signInText: {
    color: "#3c40c6",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    marginBottom: -5,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#000",
  },
  button: {
    backgroundColor: "#00a8ff",
    borderRadius: 30,
    paddingVertical: 14,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
