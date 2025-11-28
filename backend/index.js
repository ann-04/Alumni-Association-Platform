const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const jobRouter = require("./routes/jobs");
const eventRoutes = require("./routes/events");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://172.17.73.76:19000",
      "http://172.17.73.76:8081",
      "exp://172.17.73.76",
      "*", // Expo mobile apps to connect
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/events", eventRoutes);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const cron = require("node-cron");
const { fetchAndStoreNews } = require("./controllers/newsUpdater");

// 🔹 Fetch latest news once when server starts
fetchAndStoreNews();

// 🔹 Schedule every day at 9 AM (IST)
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Daily news update triggered...");
  fetchAndStoreNews();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
