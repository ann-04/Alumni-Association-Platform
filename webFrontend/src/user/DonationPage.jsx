import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import DonationForm from "../components/DonationForm";

const stripePromise = loadStripe("pk_test_12345YOURKEY");

const DonationPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Support Our Alumni Association
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Your contribution helps us fund scholarships, events, and alumni
          initiatives. Every donation makes a difference!
        </p>
        <Elements stripe={stripePromise}>
          <DonationForm />
        </Elements>
        <p className="text-xs text-gray-400 mt-6 text-center">
          Payments are securely powered by Stripe.
        </p>
      </div>
    </div>
  );
};

export default DonationPage;
