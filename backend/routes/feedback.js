const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

// Save swipe feedback (like/dislike)
router.post("/swipe", verifyToken, async (req, res) => {
  try {
    const { jobId, liked } = req.body;
    const userId = req.user.uid;

    await db.ref(`feedback/${userId}/${jobId}`).update({
      liked,
      swipedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Save application feedback
router.post("/applied", verifyToken, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.uid;

    await db.ref(`feedback/${userId}/${jobId}`).update({
      applied: true,
      appliedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Update success status
router.post("/success", verifyToken, async (req, res) => {
  try {
    const { jobId, success } = req.body;
    const userId = req.user.uid;

    await db.ref(`feedback/${userId}/${jobId}`).update({
      success,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// Get user feedback history
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.ref(`feedback/${userId}`).once("value");
    const feedback = snapshot.val() || {};

    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

module.exports = router;
