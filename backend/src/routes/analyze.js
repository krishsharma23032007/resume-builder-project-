const express = require("express");
const multer = require("multer");
const { analyzeResume, matchResumeToJob } = require("../controllers/analyzeController");
const { validateBody, validateObject, validateString } = require("../middleware/validate");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.post(
  "/analyze",
  upload.single("resume"),
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
