// ✅ Updated backend/routes/jobs.js
const express = require("express");
const prisma = require("../prisma-client");
const { userMiddleware, roleMiddleware } = require("../middlewares/user");

const router = express.Router();

// ✅ PUBLIC - Get all active jobs
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location, company } = req.query;
    const skip = (page - 1) * limit;

    const where = { isActive: true };

    if (type) where.type = type.toUpperCase();
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (company) where.company = { contains: company, mode: "insensitive" };

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: parseInt(skip),
      take: parseInt(limit),
    });

    const total = await prisma.job.count({ where });

    return res.status(200).json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit) || 1,
      },
      message:
        jobs.length > 0 ? "Jobs fetched successfully" : "No active jobs found",
    });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

module.exports = router;
