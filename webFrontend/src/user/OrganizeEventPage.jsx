// src/user/OrganizeEventPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarPlus, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import axios from "axios";

const OrganizeEventPage = () => {
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:3000/api/events",
        formData,
        { withCredentials: true }
      );

      console.log("✅ Event created and approved:", response.data);
      setSuccess(true);
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

      setTimeout(() => navigate("/news&events"), 3000);
    } catch (err) {
      console.error("❌ Error creating event:", err);
      setError(
        err.response?.data?.error || "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 shadow-lg rounded-lg bg-white text-center">
        <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-green-700 mb-4">
          Event Created Successfully! 🎉
        </h2>
        <p className="text-gray-600 mb-4">
          Your event has been created and is now <strong>live</strong> on the
          events page!
        </p>
        <p className="text-sm text-gray-500">
          Redirecting to events page in a few seconds...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 min-h-[60vh]">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-extrabold text-indigo-800 flex items-center">
          <FaCalendarPlus className="mr-3 text-cyan-600" />
          Organize an Event
        </h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to create and publish your event
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg space-y-6"
      >
        {/* Essential Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            type="text"
            name="eventTitle"
            value={formData.eventTitle}
            onChange={handleChange}
            required
            placeholder="e.g., AI & Robotics Bootcamp 2025"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type *
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Event Type</option>
            <option value="SEMINAR">Seminar</option>
            <option value="WORKSHOP">Workshop</option>
            <option value="HACKATHON">Hackathon</option>
            <option value="GUEST_LECTURE">Guest Lecture</option>
            <option value="NETWORKING">Networking</option>
            <option value="CONFERENCE">Conference</option>
            <option value="CULTURAL">Cultural Event</option>
            <option value="SPORTS">Sports Event</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Venue / Mode *
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            placeholder="e.g., Campus Auditorium or Zoom Link"
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Provide a detailed description of your event..."
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Optional Fields */}
        <hr className="my-6" />
        <h3 className="text-lg font-semibold text-gray-700">
          Optional Details (Add if available)
        </h3>

        {[
          { label: "Organizer / Department", name: "organizer" },
          { label: "Registration Link", name: "registrationLink" },
          { label: "Event Banner Image URL", name: "imageUrl" },
          { label: "Speaker / Guest Name", name: "speaker" },
          { label: "Contact Person", name: "contactName" },
          { label: "Contact Email", name: "contactEmail", type: "email" },
          { label: "Max Participants", name: "maxParticipants", type: "number" },
          { label: "Entry Fee (if any)", name: "entryFee" },
          { label: "Eligibility / Target Audience", name: "eligibility" },
          { label: "Tags / Topics", name: "tags" },
          { label: "Group/Community Link (WhatsApp, Telegram etc.)", name: "groupLink" },
        ].map((field, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Event...
              </>
            ) : (
              <>
                <FaCalendarPlus className="mr-2" />
                Create & Publish Event
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizeEventPage;
