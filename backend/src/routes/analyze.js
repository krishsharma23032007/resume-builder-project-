const express = require("express");
const multer = require("multer");
const { analyzeResume, matchResumeToJob } = require("../controllers/analyzeController");
const { validateBody, validateObject, validateString } = require("../middleware/validate");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted."), false);
    }
  }
});

router.post(
  "/analyze",
  (req, res, next) => {
    upload.single("resume")(req, res, (err) => {
      if (err) {
        if (err.message === "Only PDF files are accepted.") {
          return res.status(400).json({ error: err.message });
        }
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({ error: "File size exceeds the 5MB limit." });
        }
        return res.status(400).json({ error: "File upload failed.", details: err.message });
      }
      next();
    });
  },
  analyzeResume
);

router.post(
  "/match",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    jobDescription: (value) => validateString(value, "jobDescription", { maxLength: 5000 })
  }),
  matchResumeToJob
);

module.exports = router;
