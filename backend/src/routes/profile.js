const express = require("express");
const { getProfile, updateProfile } = require("../controllers/profileController");
const { validateBody, validateString } = require("../middleware/validate");

const router = express.Router();

router.get("/", getProfile);

router.put(
  "/",
  validateBody({
    displayName: (value) => validateString(value, "displayName", { required: false, maxLength: 100 }),
    phone: (value) => validateString(value, "phone", { required: false, maxLength: 20 }),
    location: (value) => validateString(value, "location", { required: false, maxLength: 100 }),
    title: (value) => validateString(value, "title", { required: false, maxLength: 200 }),
    summary: (value) => validateString(value, "summary", { required: false, maxLength: 1000 }),
    linkedin: (value) => validateString(value, "linkedin", { required: false, maxLength: 300 }),
    website: (value) => validateString(value, "website", { required: false, maxLength: 300 }),
    github: (value) => validateString(value, "github", { required: false, maxLength: 300 })
  }),
  updateProfile
);

module.exports = router;
