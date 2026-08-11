const express = require("express");
const { createShareLink, getSharedResume, deleteShareLink, listShareLinks } = require("../controllers/shareController");
const { validateBody, validateObject } = require("../middleware/validate");

const router = express.Router();

// Create a shareable link (requires auth)
router.post(
  "/create",
  validateBody({
    resumeData: (value) => validateObject(value, "resumeData"),
    expiresIn: (value) => {
      if (value !== undefined && value !== null) {
        if (typeof value !== "number" || value < 1 || value > 365) {
          return "expiresIn must be a number between 1 and 365";
        }
      }
      return null;
    }
  }),
  createShareLink
);

// Get a shared resume (public, no auth required)
router.get("/:shareId", getSharedResume);

// Delete a share link (requires auth)
router.delete("/:shareId", deleteShareLink);

// List all share links for authenticated user
router.get("/", listShareLinks);

module.exports = router;
