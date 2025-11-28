import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BACKEND_URL = "http://172.17.73.76:3000"; // your backend IP

export default function AlumniDirectoryScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          Alert.alert("Error", "You must be logged in to view users.");
          return;
        }

        const response = await axios.get(`${BACKEND_URL}/api/user/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data?.users || []);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        if (error.response?.status === 401) {
          Alert.alert("Unauthorized", "Please log in again.");
        } else {
          Alert.alert("Error", "Failed to load alumni data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    const profilePicture = item?.profile?.profilePicture
      ? `${BACKEND_URL}${item.profile.profilePicture}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          item?.name || "User"
        )}&background=a7c7e7&color=fff&size=300&bold=true`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("UserDetailScreen", { user: item })}
      >
        <Image
          source={{ uri: profilePicture }}
          style={styles.profileImage}
          resizeMode="cover"
        />

        <View style={styles.onlineDot} />

        <View style={styles.cardContent}>
          <Text style={styles.name}>{item?.name}</Text>

          <View style={styles.roleContainer}>
            <Text
              style={[
                styles.roleBadge,
                item?.role === "ALUMNI"
                  ? styles.alumniBadge
                  : item?.role === "STUDENT"
                  ? styles.studentBadge
                  : styles.facultyBadge,
              ]}
            >
              {item?.role || "USER"}
            </Text>
          </View>

          {item?.profile?.location && (
            <Text style={styles.location}>📍 {item.profile.location}</Text>
          )}

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate("UserDetailScreen", { user: item })
            }
          >
            <Text style={styles.viewButtonText}>View Profile →</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={{ marginTop: 10, color: "#555" }}>Loading alumni...</Text>
      </View>
    );
  }

  if (!users || users.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: "#777" }}>No users found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alumni Directory</Text>
      <Text style={styles.subtitle}>
        Connect with fellow alumni and faculty members
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id?.toString() || item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 80,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    flex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  onlineDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 12,
    height: 12,
    backgroundColor: "#22c55e",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  cardContent: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  roleContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  roleBadge: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  alumniBadge: {
    backgroundColor: "#e0e7ff",
    color: "#4338ca",
  },
  studentBadge: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  facultyBadge: {
    backgroundColor: "#ede9fe",
    color: "#6d28d9",
  },
  location: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 6,
  },
  viewButton: {
    marginTop: 8,
  },
  viewButtonText: {
    color: "#4f46e5",
    fontSize: 13,
    fontWeight: "500",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
