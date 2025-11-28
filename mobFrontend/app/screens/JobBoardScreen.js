// JobBoardScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const JobBoardScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigation = useNavigation();

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...(filters.type && { type: filters.type }),
        ...(filters.location && { location: filters.location }),
        ...(filters.company && { company: filters.company }),
      });

      const response = await axios.get(
        `http://172.17.73.76:3000/api/jobs?${queryParams}`,
        { withCredentials: true }
      );

      const jobsData = response.data.jobs || [];
      setJobs(jobsData);
      setTotalPages(response.data.pagination?.pages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      if (err.response?.status === 404 || err.response?.data?.jobs === null) {
        setJobs([]);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        setError("Failed to load jobs. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, [filters]);

  const clearFilters = () => {
    setFilters({ type: "", location: "", company: "" });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${diffDays >= 14 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 30)} month${diffDays >= 60 ? "s" : ""} ago`;
  };

  const formatJobType = (type) =>
    type
      ? type
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(" ")
      : "N/A";

  const renderJobCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.companyName}>{item.company}</Text>

      <View style={styles.row}>
        <Entypo name="location-pin" size={16} color="gray" />
        <Text style={styles.text}>{item.location}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="time-outline" size={16} color="gray" />
        <Text style={styles.text}>
          {formatJobType(item.type)} • Posted {getTimeAgo(item.createdAt)}
        </Text>
      </View>

      {(item.salaryMin || item.salaryMax) && (
        <Text style={styles.salary}>
          ₹{item.salaryMin ? item.salaryMin.toLocaleString() : ""}
          {item.salaryMin && item.salaryMax ? " - " : ""}
          {item.salaryMax ? item.salaryMax.toLocaleString() : ""} per annum
        </Text>
      )}

      <Text style={styles.desc}>
        {item.description?.substring(0, 120) || ""}...
      </Text>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      >
        <Text style={styles.detailsText}>View Details →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Ionicons name="briefcase" size={24} color="#2563eb" marginTop="25" />
          <Text style={styles.headerText}>Alumni Job Board</Text>
        </View>

        <TouchableOpacity
          style={styles.postButton}
          onPress={() => navigation.navigate("PostJob")}
        >
          <MaterialIcons name="add-circle" size={20} color="white" />
          <Text style={styles.postButtonText}>Post a Job</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Ionicons name="filter" size={18} color="#2563eb" />
          <Text style={styles.filterHeaderText}>Filter Jobs</Text>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.label}>Job Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filters.type}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, type: value }))
              }
            >
              <Picker.Item label="All Types" value="" />
              <Picker.Item label="Full Time" value="FULL_TIME" />
              <Picker.Item label="Part Time" value="PART_TIME" />
              <Picker.Item label="Contract" value="CONTRACT" />
              <Picker.Item label="Internship" value="INTERNSHIP" />
              <Picker.Item label="Remote" value="REMOTE" />
              <Picker.Item label="Hybrid" value="HYBRID" />
            </Picker>
          </View>

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={filters.location}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, location: text }))
            }
          />

          <Text style={styles.label}>Company</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter company"
            value={filters.company}
            onChangeText={(text) =>
              setFilters((prev) => ({ ...prev, company: text }))
            }
          />

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading Jobs...</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchJobs(currentPage)}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* No Jobs */}
      {!loading && !error && jobs.length === 0 && (
        <View style={styles.center}>
          <Ionicons name="briefcase-outline" size={64} color="#ccc" />
          <Text style={styles.noJobsText}>No Jobs Found</Text>
          <Text style={styles.noJobsSub}>
            Try adjusting your filters or be the first to post a job!
          </Text>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => navigation.navigate("PostJob")}
          >
            <MaterialIcons name="add-circle" size={20} color="white" />
            <Text style={styles.postButtonText}>Post the First Job</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Jobs List */}
      {!loading && !error && jobs.length > 0 && (
        <>
          <FlatList
            data={jobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.disabledButton,
                ]}
                disabled={currentPage === 1}
                onPress={() => fetchJobs(currentPage - 1)}
              >
                <Text>Previous</Text>
              </TouchableOpacity>

              {[...Array(totalPages)].map((_, i) => (
                <TouchableOpacity
                  key={i + 1}
                  style={[
                    styles.pageButton,
                    currentPage === i + 1 && styles.activePage,
                  ]}
                  onPress={() => fetchJobs(i + 1)}
                >
                  <Text
                    style={
                      currentPage === i + 1
                        ? styles.activePageText
                        : styles.pageText
                    }
                  >
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledButton,
                ]}
                disabled={currentPage === totalPages}
                onPress={() => fetchJobs(currentPage + 1)}
              >
                <Text>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default JobBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#1e3a8a",
    marginTop: 25,
  },
  postButton: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
  },
  postButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 4,
  },
  filterContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterHeaderText: {
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 6,
  },
  filterGroup: {
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#4b5563",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "white",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderTopWidth: 4,
    borderTopColor: "#06b6d4",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  jobTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  companyName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4f46e5",
    marginBottom: 6,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  text: { color: "gray", marginLeft: 4, fontSize: 13 },
  salary: { color: "#16a34a", fontWeight: "600", marginTop: 4 },
  desc: { color: "#4b5563", fontSize: 13, marginTop: 6 },
  detailsButton: {
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 10,
    alignItems: "center",
  },
  detailsText: { color: "#4338ca", fontWeight: "600" },
  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  loadingText: { color: "#2563eb", marginTop: 10 },
  errorText: { color: "red", marginBottom: 10 },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "white", fontWeight: "600" },
  noJobsText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    color: "#374151",
  },
  noJobsSub: { color: "#6b7280", textAlign: "center", marginVertical: 8 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 3,
  },
  disabledButton: { opacity: 0.5 },
  activePage: { backgroundColor: "#2563eb" },
  activePageText: { color: "white", fontWeight: "600" },
  pageText: { color: "black" },
});
