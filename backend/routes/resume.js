const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and DOC/DOCX files are allowed"));
    }
  },
});

// Upload resume — store extracted text in Realtime DB
router.post("/upload", verifyToken, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.uid;

    // Extract text from PDF
    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text;
      } catch (pdfErr) {
        console.error("PDF parsing error:", pdfErr.message);
        extractedText = "Could not extract text from PDF";
      }
    } else {
      extractedText = req.file.buffer.toString("utf-8");
    }

    // Save to Realtime Database (no Storage needed)
    await db.ref(`users/${userId}/resume`).set({
      fileName: req.file.originalname,
      extractedText,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      fileName: req.file.originalname,
      extractedText,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

// Get user's resume
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await db.ref(`users/${userId}/resume`).once("value");
    const resume = snapshot.val();

    if (!resume) {
      return res.status(404).json({ error: "No resume found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Failed to fetch resume" });
  }
});

module.exports = router;