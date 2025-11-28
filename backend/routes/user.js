// ✅ Updated backend/routes/user.js
const express = require("express");
const upload = require("../middlewares/upload");
const { userMiddleware, roleMiddleware } = require("../middlewares/user");
const { signup, signin, logout, updateSignup } = require("../controllers/auth");
const {
  addProfile,
  updateProfile,
  getProfile,
  getInformation,
  uploadProfilePicture,
  deleteProfilePicture,
} = require("../controllers/profile");
const {
  addEducation,
  addSocialMedia,
  addWorkExperience,
  addStudentDetails,
  addFacultyDetails,
  updateStudentDetails,
  updateFacultyDetails,
  updateEducation,
  updateSocialMedia,
  updateWorkExperience,
  getAllUsers,
  getUserById,
  getSocialMedia,
} = require("../controllers/userDetails");
const prisma = require("../prisma-client");
const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.json({ message: "Server is up and running 🚀" });
});

// 🔹 Authentication
router.post("/signup", signup);
router.put("/signup", userMiddleware, updateSignup);
router.post("/signin", signin);
router.post("/logout", logout);

// ✅ NEW — verify token validity (for SplashScreen)
router.get("/verify", userMiddleware, (req, res) => {
  try {
    res.status(200).json({ message: "Token valid", user: req.user });
  } catch (error) {
    console.error("❌ Token verify error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// 🔹 Profile routes
router.get("/information", userMiddleware, getInformation);
router.get("/profile", userMiddleware, getProfile);
router.post("/profile", userMiddleware, addProfile);
router.put("/profile", userMiddleware, updateProfile);

// 🔹 Profile picture
router.post(
  "/profile/picture",
  userMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);
router.delete("/profile/picture", userMiddleware, deleteProfilePicture);

// 🔹 Student and Faculty details
router.post(
  "/student",
  userMiddleware,
  roleMiddleware(["STUDENT", "ALUMNI", "ADMIN"]),
  addStudentDetails
);
router.put(
  "/student",
  userMiddleware,
  roleMiddleware(["STUDENT", "ALUMNI", "ADMIN"]),
  updateStudentDetails
);
router.post(
  "/faculty",
  userMiddleware,
  roleMiddleware(["FACULTY", "ADMIN"]),
  addFacultyDetails
);
router.put(
  "/faculty",
  userMiddleware,
  roleMiddleware(["FACULTY", "ADMIN"]),
  updateFacultyDetails
);

// 🔹 Education / Work / Social
router.post("/education", userMiddleware, addEducation);
router.put("/education/:id", userMiddleware, updateEducation);
router.get("/socialMedia", userMiddleware, getSocialMedia);
router.post("/socialMedia", userMiddleware, addSocialMedia);
router.put("/socialMedia", userMiddleware, updateSocialMedia);
router.post("/workExperience", userMiddleware, addWorkExperience);
router.put("/workExperience/:id", userMiddleware, updateWorkExperience);

// 🔹 Make this PUBLIC for Alumni Directory
router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { isVerified: true },
      include: {
        profile: true,
        education: true,
        socialMedia: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!users || users.length === 0)
      return res.status(200).json({ users: [], message: "No users found" });

    console.log(`👥 Returned ${users.length} verified users`);
    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get specific user (public for directory)
router.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        profile: true,
        student: true,
        faculty: true,
        education: true,
        socialMedia: true,
        workExperience: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Keep secure routes last
router.get("/:id", userMiddleware, getUserById);

module.exports = router;
