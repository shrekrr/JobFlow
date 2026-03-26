const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");
const { sendApplicationEmail } = require("../services/emailService");

// Submit application
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { jobId, jobTitle, company, coverLetter, tailoredResume, candidateName } = req.body;
    const userId = req.user.uid;

    // Get resume text from database
    const resumeSnap = await db.ref(`users/${userId}/resume`).once("value");
    const resumeData = resumeSnap.val();

    // Create a PDF-like text attachment of the tailored resume
    const resumeContent = tailoredResume || resumeData?.extractedText || "No resume available";
    const resumeBuffer = Buffer.from(resumeContent, "utf-8");
    const resumeFilename = "tailored_resume.txt";

    // Send email
    const emailResult = await sendApplicationEmail({
      to: process.env.HR_EMAIL || "hr@example.com",
      candidateName: candidateName || "Applicant",
      jobTitle,
      company,
      resumeBuffer,
      resumeFilename,
      coverLetterText: coverLetter,
    });

    // Save application record
    await db.ref(`applications/${userId}`).push({
      jobId,
      jobTitle,
      company,
      coverLetter,
      tailoredResume,
      emailSent: emailResult.success,
      submittedAt: new Date().toISOString(),
    });

    // Update feedback
    await db.ref(`feedback/${userId}/${jobId}`).update({
      applied: true,
      appliedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      emailSent: emailResult.success,
      message: emailResult.success
        ? "Application submitted successfully"
        : "Application saved but email delivery may be delayed",
    });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Get user's applications
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.ref(`applications/${userId}`).once("value");
    const applications = snapshot.val() || {};

    const appList = Object.keys(applications).map((key) => ({
      id: key,
      ...applications[key],
    }));

    res.json(appList);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;