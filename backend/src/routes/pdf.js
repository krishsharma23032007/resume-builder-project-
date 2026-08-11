const express = require("express");
const { generatePdf, generateDocx } = require("../controllers/pdfController");
const { validateBody, validateObject, validateEnum } = require("../middleware/validate");

const router = express.Router();

const TEMPLATES = ["classic", "modern", "compact", "executive", "creative", "technical"];

router.post(
  "/generate",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    template: (value) => validateEnum(value, "template", TEMPLATES, { required: false })
  }),
  generatePdf
);

router.post(
  "/generate-docx",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    template: (value) => validateEnum(value, "template", TEMPLATES, { required: false })
  }),
  generateDocx
);

module.exports = router;
