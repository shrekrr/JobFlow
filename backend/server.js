const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/jobs", require("./routes/jobs"));
app.use("/api/resume", require("./routes/resume"));
app.use("/api/ai", require("./routes/ai"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/application", require("./routes/application"));
app.use("/api/user", require("./routes/user"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`JobFlow backend running on port ${PORT}`);
});
