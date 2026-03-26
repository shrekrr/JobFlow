const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// Save preferences
router.post("/preferences", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { jobTypes, locations, skills, experienceLevel } = req.body;

    await db.ref(`users/${userId}/preferences`).set({
      jobTypes: jobTypes || [],
      locations: locations || [],
      skills: skills || [],
      experienceLevel: experienceLevel || "any",
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

// Get preferences
router.get("/preferences", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.ref(`users/${userId}/preferences`).once("value");
    const preferences = snapshot.val();

    res.json(preferences || {});
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Failed to fetch preferences" });
  }
});

// Save user profile
router.post("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { displayName, email } = req.body;

    await db.ref(`users/${userId}/profile`).set({
      displayName,
      email,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

module.exports = router;
