import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function OrganizeEventScreen({ navigation }) {
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventType: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    organizer: "",
    registrationLink: "",
    imageUrl: "",
    speaker: "",
    contactName: "",
    contactEmail: "",
    maxParticipants: "",
    entryFee: "",
    eligibility: "",
    tags: "",
    groupLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async () => {
    if (
      !formData.eventTitle ||
      !formData.eventType ||
      !formData.date ||
      !formData.time ||
      !formData.venue ||
      !formData.description
    ) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/events",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("✅ Event created:", response.data);
      Alert.alert("Success 🎉", "Your event has been created successfully!");
      setFormData({
        eventTitle: "",
        eventType: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        organizer: "",
        registrationLink: "",
        imageUrl: "",
        speaker: "",
        contactName: "",
        contactEmail: "",
        maxParticipants: "",
        entryFee: "",
        eligibility: "",
        tags: "",
        groupLink: "",
      });
      navigation.navigate("Events"); // or adjust to your route
    } catch (err) {
      console.error("❌ Error creating event:", err);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color="#4F46E5" marginTop="20" />
        <Text
          style={{
            marginLeft: 8,
            color: "#4F46E5",
            fontWeight: "600",
            marginTop: 20,
          }}
        >
          Back
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "800",
          color: "#3730A3",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <Ionicons name="calendar" size={26} color="#06B6D4" /> Organize an Event
      </Text>
      <Text style={{ color: "#6B7280", marginBottom: 20 }}>
        Fill in the details below to create and publish your event.
      </Text>

      {/* Input Fields */}
      <Text style={styles.label}>Event Title *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., AI & Robotics Bootcamp 2025"
        value={formData.eventTitle}
        onChangeText={(text) => handleChange("eventTitle", text)}
      />

      <Text style={styles.label}>Event Type *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.eventType}
          onValueChange={(value) => handleChange("eventType", value)}
        >
          <Picker.Item label="Select Event Type" value="" />
          <Picker.Item label="Seminar" value="SEMINAR" />
          <Picker.Item label="Workshop" value="WORKSHOP" />
          <Picker.Item label="Hackathon" value="HACKATHON" />
          <Picker.Item label="Guest Lecture" value="GUEST_LECTURE" />
          <Picker.Item label="Networking" value="NETWORKING" />
          <Picker.Item label="Conference" value="CONFERENCE" />
          <Picker.Item label="Cultural Event" value="CULTURAL" />
          <Picker.Item label="Sports Event" value="SPORTS" />
          <Picker.Item label="Other" value="OTHER" />
        </Picker>
      </View>

      {/* Date and Time */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Event Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: formData.date ? "#000" : "#9CA3AF" }}>
              {formData.date || "Select Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={getTomorrow()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={getTomorrow()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange(
                    "date",
                    selectedDate.toISOString().split("T")[0]
                  );
                }
              }}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Time *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={{ color: formData.time ? "#000" : "#9CA3AF" }}>
              {formData.time || "Select Time"}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) {
                  const hours = selectedTime
                    .getHours()
                    .toString()
                    .padStart(2, "0");
                  const minutes = selectedTime
                    .getMinutes()
                    .toString()
                    .padStart(2, "0");
                  handleChange("time", `${hours}:${minutes}`);
                }
              }}
            />
          )}
        </View>
      </View>

      <Text style={styles.label}>Venue / Mode *</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Campus Auditorium or Zoom Link"
        value={formData.venue}
        onChangeText={(text) => handleChange("venue", text)}
      />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, { height: 120, textAlignVertical: "top" }]}
        multiline
        placeholder="Provide a detailed description of your event..."
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      {/* Optional Fields */}
      <Text style={styles.subHeading}>Optional Details</Text>
      {[
        { label: "Organizer / Department", name: "organizer" },
        { label: "Registration Link", name: "registrationLink" },
        { label: "Event Banner Image URL", name: "imageUrl" },
        { label: "Speaker / Guest Name", name: "speaker" },
        { label: "Contact Person", name: "contactName" },
        { label: "Contact Email", name: "contactEmail" },
        { label: "Max Participants", name: "maxParticipants" },
        { label: "Entry Fee (if any)", name: "entryFee" },
        { label: "Eligibility / Target Audience", name: "eligibility" },
        { label: "Tags / Topics", name: "tags" },
        { label: "Group/Community Link", name: "groupLink" },
      ].map((field, index) => (
        <View key={index}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            value={formData[field.name]}
            onChangeText={(text) => handleChange(field.name, text)}
          />
        </View>
      ))}

      {/* Submit */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        disabled={loading}
        onPress={handleSubmit}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 8 }}>
              Create & Publish Event
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = {
  label: {
    color: "#374151",
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  button: {
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
  },
  subHeading: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
};
