import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: { color: "#e53e3e" },
  },
};

const DonationForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("card");
  const [upiId, setUpiId] = useState("");
  const [netbanking, setNetbanking] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess(false);

    if (!amount || amount <= 0) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    setLoading(true);

    // Fake delay to simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Amount */}
      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          Donation Amount (INR)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payment Method */}
      <div>
        <p className="block mb-2 font-semibold text-gray-700">
          Select Payment Method
        </p>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="card"
              checked={method === "card"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Credit/Debit Card</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="upi"
              checked={method === "upi"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>UPI</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="netbanking"
              checked={method === "netbanking"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Netbanking</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="wallet"
              checked={method === "wallet"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <span>Wallet</span>
          </label>
        </div>
      </div>

      {/* Conditional Inputs */}
      {method === "card" && (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Card Details
          </label>
          <div className="border p-3 rounded">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
      )}

      {method === "upi" && (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="example@upi"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {method === "netbanking" && (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Select Bank
          </label>
          <select
            value={netbanking}
            onChange={(e) => setNetbanking(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choose Bank --</option>
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
          </select>
        </div>
      )}

      {method === "wallet" && (
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Choose Wallet
          </label>
          <select
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Wallet --</option>
            <option value="paytm">Paytm</option>
            <option value="phonepe">PhonePe</option>
            <option value="amazonpay">Amazon Pay</option>
          </select>
        </div>
      )}

      {/* Messages */}
      {errorMessage && (
        <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm font-medium">
          ✅ Payment simulated successfully with {method.toUpperCase()}!
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-500 text-black font-semibold py-2 rounded hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ₹${amount || 0}`}
      </button>
    </form>
  );
};

export default DonationForm;
