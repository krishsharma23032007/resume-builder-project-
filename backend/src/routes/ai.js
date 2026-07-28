const express = require("express");
const { generateCoverLetter, generateSummary, improveBullet } = require("../controllers/aiController");

const router = express.Router();

router.post("/improve", improveBullet);
router.post("/summary", generateSummary);
router.post("/cover-letter", generateCoverLetter);

module.exports = router;
