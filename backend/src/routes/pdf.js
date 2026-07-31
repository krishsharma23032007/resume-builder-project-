const express = require("express");
const { generatePdf } = require("../controllers/pdfController");
const { validateBody, validateObject, validateEnum } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/generate",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    template: (value) => validateEnum(value, "template", ["classic", "modern", "compact"], { required: false })
  }),
  generatePdf
);

module.exports = router;
