const express = require("express");
const multer = require("multer");
const { analyzeResume, matchResumeToJob } = require("../controllers/analyzeController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post("/analyze", upload.single("resume"), analyzeResume);
router.post("/match", matchResumeToJob);

module.exports = router;
