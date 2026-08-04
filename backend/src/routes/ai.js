const express = require("express");
const { generateCoverLetter, generateSummary, improveBullet, fixGrammar, suggestAchievements } = require("../controllers/aiController");
const { validateBody, validateObject, validateString, validateEnum } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/improve",
  validateBody({
    bullet: (value) => validateString(value, "bullet", { maxLength: 1000 }),
    context: (value) => validateString(value, "context", { required: false, maxLength: 5000 }),
    jobTitle: (value) => validateString(value, "jobTitle", { required: false, maxLength: 200 })
  }),
  improveBullet
);

router.post(
  "/grammar",
  validateBody({
    text: (value) => validateString(value, "text", { maxLength: 5000 })
  }),
  fixGrammar
);

router.post(
  "/suggest-achievements",
  validateBody({
    role: (value) => validateString(value, "role", { maxLength: 500 }),
    context: (value) => validateString(value, "context", { required: false, maxLength: 5000 }),
    type: (value) => validateEnum(value, "type", ["experience", "project"], { required: false })
  }),
  suggestAchievements
);

router.post(
  "/summary",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData")
  }),
  generateSummary
);

router.post(
  "/cover-letter",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    jobDescription: (value) => validateString(value, "jobDescription", { maxLength: 5000 }),
    tone: (value) => validateEnum(value, "tone", ["formal", "enthusiastic", "concise"], { required: false }),
    company: (value) => validateString(value, "company", { required: false, maxLength: 200 }),
    jobTitle: (value) => validateString(value, "jobTitle", { required: false, maxLength: 200 })
  }),
  generateCoverLetter
);

module.exports = router;
