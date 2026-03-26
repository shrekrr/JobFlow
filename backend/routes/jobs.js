const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.ref("jobs").once("value");
    const jobs = snapshot.val();

    if (!jobs) {
      return res.json([]);
    }

    const jobList = Object.keys(jobs).map((key) => ({
      id: key,
      ...jobs[key],
    }));

    res.json(jobList);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// Get jobs filtered by preferences
router.post("/recommend", verifyToken, async (req, res) => {
  try {
    const { preferences, resumeText } = req.body;
    const snapshot = await db.ref("jobs").once("value");
    const jobs = snapshot.val();

    if (!jobs) {
      return res.json([]);
    }

    let jobList = Object.keys(jobs).map((key) => ({
      id: key,
      ...jobs[key],
    }));

    // Filter by preferences
    if (preferences) {
      if (preferences.jobTypes && preferences.jobTypes.length > 0) {
        jobList = jobList.filter((job) =>
          preferences.jobTypes.includes(job.jobType)
        );
      }
      if (preferences.locations && preferences.locations.length > 0) {
        jobList = jobList.filter((job) =>
          preferences.locations.some(
            (loc) =>
              job.location.toLowerCase().includes(loc.toLowerCase()) ||
              loc.toLowerCase() === "remote"
          )
        );
      }
      if (preferences.skills && preferences.skills.length > 0) {
        jobList.sort((a, b) => {
          const aMatch = a.skillsRequired.filter((s) =>
            preferences.skills.some((ps) =>
              s.toLowerCase().includes(ps.toLowerCase())
            )
          ).length;
          const bMatch = b.skillsRequired.filter((s) =>
            preferences.skills.some((ps) =>
              s.toLowerCase().includes(ps.toLowerCase())
            )
          ).length;
          return bMatch - aMatch;
        });
      }
    }

    // Check user feedback to exclude already-seen jobs
    const userId = req.user.uid;
    const feedbackSnap = await db.ref(`feedback/${userId}`).once("value");
    const feedback = feedbackSnap.val() || {};

    jobList = jobList.filter((job) => !feedback[job.id]);

    res.json(jobList);
  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ error: "Failed to recommend jobs" });
  }
});

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const snapshot = await db.ref(`jobs/${req.params.id}`).once("value");
    const job = snapshot.val();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ id: req.params.id, ...job });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

module.exports = router;
