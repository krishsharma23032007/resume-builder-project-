const { admin, getAuth } = require("../config/firebase");

function getProfilesCollection() {
  return admin.firestore().collection("user_profiles");
}

/**
 * Get user profile settings.
 */
async function getProfile(req, res) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const profilesCollection = getProfilesCollection();
    const doc = await profilesCollection.doc(userId).get();

    if (!doc.exists) {
      // Return default profile from Firebase Auth
      const authUser = await getAuth().getUser(userId);
      return res.json({
        displayName: authUser.displayName || "",
        email: authUser.email || "",
        phone: "",
        location: "",
        title: "",
        summary: "",
        linkedin: "",
        website: "",
        github: ""
      });
    }

    const data = doc.data();
    return res.json({
      displayName: data.displayName || "",
      email: req.user.email || "",
      phone: data.phone || "",
      location: data.location || "",
      title: data.title || "",
      summary: data.summary || "",
      linkedin: data.linkedin || "",
      website: data.website || "",
      github: data.github || ""
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Failed to get profile." });
  }
}

/**
 * Update user profile settings.
 */
async function updateProfile(req, res) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const { displayName, phone, location, title, summary, linkedin, website, github } = req.body;

    // Update Firebase Auth displayName if provided
    if (displayName !== undefined) {
      try {
        await getAuth().updateUser(userId, { displayName });
      } catch (authError) {
        console.error("Failed to update Firebase Auth displayName:", authError);
      }
    }

    // Build profile data (only update provided fields)
    const profileData = {};
    if (displayName !== undefined) profileData.displayName = displayName;
    if (phone !== undefined) profileData.phone = phone;
    if (location !== undefined) profileData.location = location;
    if (title !== undefined) profileData.title = title;
    if (summary !== undefined) profileData.summary = summary;
    if (linkedin !== undefined) profileData.linkedin = linkedin;
    if (website !== undefined) profileData.website = website;
    if (github !== undefined) profileData.github = github;

    profileData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    const profilesCollection = getProfilesCollection();
    await profilesCollection.doc(userId).set(profileData, { merge: true });

    return res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile." });
  }
}

module.exports = {
  getProfile,
  updateProfile
};
