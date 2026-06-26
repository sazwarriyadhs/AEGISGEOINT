const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

/* ===========================
   UPLOAD DIRECTORY
=========================== */

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/* ===========================
   STORAGE CONFIG
=========================== */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname || ".jpg"));
  }
});

/* ===========================
   MULTER CONFIG
=========================== */

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

/* ===========================
   INCIDENT UPLOAD ROUTE
=========================== */

router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    console.log("================================");
    console.log("🚨 INCIDENT UPLOAD RECEIVED");
    console.log("================================");

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No photo uploaded (field must be 'photo')"
      });
    }

    const incident = {
      id: Date.now(),
      filename: req.file.filename,
      filepath: "/uploads/" + req.file.filename,
      lat: req.body.lat ? parseFloat(req.body.lat) : null,
      lng: req.body.lng ? parseFloat(req.body.lng) : null,
      timestamp: new Date().toISOString(),
      ai_status: "pending",
      threat_level: "unknown"
    };

    console.log("🚨 INCIDENT CREATED:");
    console.log(incident);

    console.log("🤖 AI PIPELINE: queued");
    console.log("📡 ALERT SYSTEM: queued");

    return res.json({
      success: true,
      message: "Incident captured successfully",
      incident
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;