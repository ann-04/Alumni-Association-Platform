import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const BACKEND_URL = "http://172.17.73.76:3000";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          console.log("❌ No token found, redirecting to Login");
          navigation.replace("Login");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/api/user/information`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("❌ Home fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C2DC7" />
        <Text style={{ color: "#6C2DC7", marginTop: 10 }}>
          Loading your dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>AlmaConnect.</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { user })}
        >
          <Ionicons name="person-circle-outline" size={40} color="#6C2DC7" />
        </TouchableOpacity>
      </View>

      {/* Hero Section */}
      <LinearGradient
        colors={["#6C2DC7", "#0072FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.heroTitle}>Welcome Alumni!</Text>
        <Text style={styles.heroSubtitle}>
          Connecting the past, present, and future
        </Text>
        <TouchableOpacity style={styles.learnMoreBtn}>
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        <View style={styles.benefitsRow}>
          <View style={styles.benefitBox}>
            <Ionicons name="people-outline" size={36} color="#6C2DC7" />
            <Text style={styles.benefitTitle}>Networking Opportunities</Text>
            <Text style={styles.benefitText}>
              Connect with fellow alumni and expand your professional network.
            </Text>
          </View>

          <View style={styles.benefitBox}>
            <Ionicons name="briefcase-outline" size={36} color="#6C2DC7" />
            <Text style={styles.benefitTitle}>Career Support</Text>
            <Text style={styles.benefitText}>
              Access job boards, counseling, and resources.
            </Text>
          </View>
        </View>

        <View style={styles.benefitsRow}>
          <View style={styles.benefitBox}>
            <Ionicons name="calendar-outline" size={36} color="#6C2DC7" />
            <Text style={styles.benefitTitle}>Exclusive Events</Text>
            <Text style={styles.benefitText}>
              Alumni-only reunions, workshops, and meetups.
            </Text>
          </View>

          <View style={styles.benefitBox}>
            <Ionicons name="school-outline" size={36} color="#6C2DC7" />
            <Text style={styles.benefitTitle}>Lifelong Learning</Text>
            <Text style={styles.benefitText}>
              Continued education and university resources.
            </Text>
          </View>
        </View>
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {[
          {
            title: "Alumni Networking Night",
            desc: "Evening of reconnecting with alumni.",
            date: "20 September, 2025",
          },
          {
            title: "Career Guidance Workshop",
            desc: "Special workshop for alumni & students.",
            date: "05 October, 2025",
          },
          {
            title: "Annual Alumni Meet",
            desc: "Annual gathering with fun activities.",
            date: "15 December, 2025",
          },
        ].map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDesc}>{event.desc}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
        ))}
      </View>

      {/* Alumni Success Stories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alumni Success Stories</Text>
        {[
          {
            name: "Harman",
            quote:
              "The alumni network has been instrumental in my career growth.",
            batch: "Class of 2010",
          },
          {
            name: "Arjun",
            quote: "The events opened many doors for me.",
            batch: "Class of 2018",
          },
        ].map((alumni, i) => (
          <View key={i} style={styles.quoteCard}>
            <Text style={styles.quoteText}>"{alumni.quote}"</Text>
            <Text style={styles.alumniName}>{alumni.name}</Text>
            <Text style={styles.alumniBatch}>{alumni.batch}</Text>
          </View>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <Text style={styles.contactText}>📧 info@almaconnect.com</Text>
        <Text style={styles.contactText}>📞 99999-99999</Text>
        <Text style={styles.contactText}>
          📍 Presidency University, Bengaluru
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 AlmaConnect. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6C2DC7",
  },
  hero: {
    alignItems: "center",
    paddingVertical: 25,
    borderRadius: 15,
    marginVertical: 10,
  },
  heroTitle: { fontSize: 26, fontWeight: "700", color: "#fff" },
  heroSubtitle: { fontSize: 15, color: "#f0f0f0", marginTop: 5 },
  learnMoreBtn: {
    marginTop: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  learnMoreText: { color: "#6C2DC7", fontWeight: "700" },
  section: { marginTop: 25 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#430562",
    marginBottom: 10,
    textAlign: "center",
  },
  benefitsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  benefitBox: {
    width: "48%",
    backgroundColor: "#f8f8ff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  benefitTitle: {
    fontWeight: "600",
    textAlign: "center",
    marginTop: 5,
    color: "#430562",
  },
  benefitText: {
    fontSize: 13,
    textAlign: "center",
    color: "#555",
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: "#f4f0ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  eventTitle: { fontWeight: "600", fontSize: 16, color: "#430562" },
  eventDesc: { color: "#555", marginVertical: 4 },
  eventDate: { color: "#0072FF", fontWeight: "600" },
  quoteCard: {
    backgroundColor: "#f4f0ff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  quoteText: { fontStyle: "italic", color: "#333", textAlign: "center" },
  alumniName: {
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    color: "#430562",
  },
  alumniBatch: { color: "#777", textAlign: "center" },
  contactSection: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f0ff",
    borderRadius: 10,
    marginTop: 20,
  },
  contactText: { color: "#430562", marginVertical: 3 },
  footer: {
    marginTop: 30,
    alignItems: "center",
    paddingVertical: 15,
  },
  footerText: { color: "#777", fontSize: 13 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
