// controllers/profile.js - Fixed version that handles missing profiles
const prisma = require("../prisma-client");
const fs = require("fs");
const path = require("path");

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: { id },
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

    // Flatten profile data into the main user object
    const mergedUser = {
      ...user,
      ...user.profile, // merge profile fields
      profile: undefined, // remove nested profile
    };

    res.status(200).json(mergedUser);
  } catch (error) {
    console.error("❌ getProfile error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getInformation = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const mergedUser = {
      ...user,
      ...user.profile,
      profile: undefined,
    };

    res.status(200).json(mergedUser);
  } catch (error) {
    console.error("❌ getInformation error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.addProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { gender, maritalStatus, location, dob, about } = req.body;

    // Handle profile picture
    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    const profile = await prisma.profile.create({
      data: {
        userId: id,
        gender,
        maritalStatus,
        location,
        dob,
        about,
        profilePicture,
      },
    });

    console.log("✅ Profile created with picture:", profilePicture);
    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error creating profile:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { gender, maritalStatus, location, dob, about } = req.body;

    // Get existing profile to handle old profile picture
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    let updateData = {
      gender,
      maritalStatus,
      location,
      dob,
      about,
    };

    // Handle new profile picture
    if (req.file) {
      // Delete old profile picture if exists
      if (existingProfile?.profilePicture) {
        const oldPicturePath = path.join(
          __dirname,
          "..",
          existingProfile.profilePicture
        );
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
          console.log("🗑️ Deleted old profile picture");
        }
      }

      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
      console.log("📸 New profile picture:", updateData.profilePicture);
    }

    const profile = await prisma.profile.update({
      where: {
        userId: id,
      },
      data: updateData,
    });

    res.status(200).json(profile);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// FIXED: Upload profile picture only - handles missing profile
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    const profilePicture = `/uploads/profiles/${req.file.filename}`;

    if (existingProfile) {
      // Profile exists - update it

      // Delete old profile picture if exists
      if (existingProfile.profilePicture) {
        const oldPicturePath = path.join(
          __dirname,
          "..",
          existingProfile.profilePicture
        );
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
          console.log("🗑️ Deleted old profile picture");
        }
      }

      // Update existing profile
      const profile = await prisma.profile.update({
        where: { userId: id },
        data: { profilePicture },
      });

      console.log("✅ Profile picture updated:", profilePicture);
      res
        .status(200)
        .json({
          profilePicture,
          message: "Profile picture uploaded successfully",
        });
    } else {
      // Profile doesn't exist - create basic profile with picture
      const profile = await prisma.profile.create({
        data: {
          userId: id,
          profilePicture,
          // Set default values for required fields if needed
          gender: "NOT_SPECIFIED",
          maritalStatus: "NOT_SPECIFIED",
        },
      });

      console.log("✅ Profile created with picture:", profilePicture);
      res
        .status(200)
        .json({
          profilePicture,
          message: "Profile created with picture successfully",
        });
    }
  } catch (error) {
    console.error("❌ Error uploading profile picture:", error);

    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "profiles",
        req.file.filename
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑️ Cleaned up uploaded file after error");
      }
    }

    res.status(500).json({ error: error.message });
  }
};

// FIXED: Delete profile picture - handles missing profile
exports.deleteProfilePicture = async (req, res) => {
  try {
    const { id } = req.user;

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: id },
    });

    if (!existingProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    if (existingProfile.profilePicture) {
      // Delete file from filesystem
      const picturePath = path.join(
        __dirname,
        "..",
        existingProfile.profilePicture
      );
      if (fs.existsSync(picturePath)) {
        fs.unlinkSync(picturePath);
        console.log("🗑️ Deleted profile picture file");
      }

      // Remove from database
      await prisma.profile.update({
        where: { userId: id },
        data: { profilePicture: null },
      });

      console.log("✅ Profile picture removed from database");
      res.status(200).json({ message: "Profile picture deleted successfully" });
    } else {
      res.status(404).json({ error: "No profile picture found" });
    }
  } catch (error) {
    console.error("❌ Error deleting profile picture:", error);
    res.status(500).json({ error: error.message });
  }
};
