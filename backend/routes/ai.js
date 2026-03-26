const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { tailorResume, generateCoverLetter, matchJobScore } = require("../services/aiService");
const { db } = require("../config/firebase");

// Tailor resume for a job
router.post("/tailor", verifyToken, async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle } = req.body;

    if (!resumeText || !jobDescription || !jobTitle) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const tailoredResume = await tailorResume(resumeText, jobDescription, jobTitle);

    // Save tailored version
    const userId = req.user.uid;
    await db.ref(`users/${userId}/tailoredResumes`).push({
      jobTitle,
      original: resumeText,
      tailored: tailoredResume,
      createdAt: new Date().toISOString(),
    });

    res.json({ tailoredResume });
  } catch (error) {
    console.error("Tailor error:", error);
    res.status(500).json({ error: "Failed to tailor resume" });
  }
});

// Generate cover letter
router.post("/cover-letter", verifyToken, async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle, company } = req.body;

    if (!resumeText || !jobDescription || !jobTitle || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const coverLetter = await generateCoverLetter(resumeText, jobDescription, jobTitle, company);

    res.json({ coverLetter });
  } catch (error) {
    console.error("Cover letter error:", error);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

// Match score
router.post("/match", verifyToken, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const matchResult = await matchJobScore(resumeText, jobDescription);
    res.json(matchResult);
  } catch (error) {
    console.error("Match error:", error);
    res.status(500).json({ error: "Failed to analyze match" });
  }
});

module.exports = router;
