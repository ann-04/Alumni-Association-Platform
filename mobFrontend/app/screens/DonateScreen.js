import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

export default function DonateScreen() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid donation amount.");
      return;
    }

    setLoading(true);

    // Simulate fake API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Success",
        `Payment simulated successfully using ${method.toUpperCase()}!`
      );
      setAmount("");
      setUpiId("");
      setBank("");
      setWallet("");
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Support Our Alumni Association</Text>
      <Text style={styles.subtitle}>
        Your contribution helps us fund scholarships, events, and alumni
        initiatives. Every donation makes a difference!
      </Text>

      {/* Donation Amount */}
      <Text style={styles.label}>Donation Amount (INR)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
      />

      {/* Payment Method */}
      <Text style={styles.label}>Select Payment Method</Text>
      <View style={styles.radioGroup}>
        {["card", "upi", "netbanking", "wallet"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => setMethod(option)}
          >
            <View
              style={[
                styles.radioCircle,
                method === option && styles.radioSelected,
              ]}
            />
            <Text style={styles.radioText}>
              {option === "card"
                ? "Credit/Debit Card"
                : option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Inputs */}
      {method === "card" && (
        <View>
          <Text style={styles.label}>Card Details</Text>
          <TextInput style={styles.input} placeholder="Card number" />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="MM/YY"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="CVC"
            />
          </View>
        </View>
      )}

      {method === "upi" && (
        <View>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="example@upi"
            value={upiId}
            onChangeText={setUpiId}
          />
        </View>
      )}

      {method === "netbanking" && (
        <View>
          <Text style={styles.label}>Select Bank</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter bank name (e.g. HDFC, SBI)"
            value={bank}
            onChangeText={setBank}
          />
        </View>
      )}

      {method === "wallet" && (
        <View>
          <Text style={styles.label}>Choose Wallet</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Paytm, PhonePe, Amazon Pay"
            value={wallet}
            onChangeText={setWallet}
          />
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleDonate}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay ₹{amount || 0}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>
        Payments are securely powered by Stripe.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 60,
    backgroundColor: "#f8f9fb",
    flexGrow: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  radioGroup: {
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#007AFF",
  },
  radioText: {
    fontSize: 15,
  },
  button: {
    backgroundColor: "#FFC107",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    color: "#777",
    marginTop: 15,
  },
});
