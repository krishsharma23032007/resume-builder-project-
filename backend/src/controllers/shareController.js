const crypto = require("crypto");
const { admin } = require("../config/firebase");

const db = admin.firestore();
const resumesCollection = db.collection("shared_resumes");

/**
 * Creates a shareable link for a resume.
 * Stores resume data in Firestore with a unique ID.
 */
async function createShareLink(req, res) {
  try {
    const { resumeData, expiresIn = 30 } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      return res.status(400).json({ error: "resumeData is required." });
    }

    const userId = req.user?.uid || "anonymous";
    const shareId = crypto.randomBytes(8).toString("hex");

    const now = admin.firestore.Timestamp.now();
    const expirationDays = Math.min(Math.max(parseInt(expiresIn) || 30, 1), 365);
    const expiresAt = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
    );

    await resumesCollection.doc(shareId).set({
      userId,
      resumeData,
      createdAt: now,
      expiresAt,
      viewCount: 0
    });

    const baseUrl = process.env.FRONTEND_URL || "https://ai-resume-builder-rosy.vercel.app";
    const shareUrl = `${baseUrl.replace(/\/$/, "")}/resume/shared/${shareId}`;

    return res.json({
      shareId,
      shareUrl,
      expiresAt: expiresAt.toDate().toISOString()
    });
  } catch (error) {
    console.error("Create share link error:", error);
    return res.status(500).json({ error: "Failed to create share link." });
  }
}

/**
 * Retrieves a shared resume by its share ID.
 */
async function getSharedResume(req, res) {
  try {
    const { shareId } = req.params;

    if (!shareId || !/^[a-f0-9]{16}$/.test(shareId)) {
      return res.status(400).json({ error: "Invalid share ID." });
    }

    const doc = await resumesCollection.doc(shareId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Shared resume not found." });
    }

    const data = doc.data();

    // Check expiration
    if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
      return res.status(410).json({ error: "This shared resume link has expired." });
    }

    // Increment view count
    await resumesCollection.doc(shareId).update({
      viewCount: admin.firestore.FieldValue.increment(1)
    });

    return res.json({
      resumeData: data.resumeData,
      createdAt: data.createdAt.toDate().toISOString(),
      viewCount: (data.viewCount || 0) + 1
    });
  } catch (error) {
    console.error("Get shared resume error:", error);
    return res.status(500).json({ error: "Failed to retrieve shared resume." });
  }
}

/**
 * Deletes a shared resume link.
 */
async function deleteShareLink(req, res) {
  try {
    const { shareId } = req.params;
    const userId = req.user?.uid;

    if (!shareId || !/^[a-f0-9]{16}$/.test(shareId)) {
      return res.status(400).json({ error: "Invalid share ID." });
    }

    const doc = await resumesCollection.doc(shareId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Shared resume not found." });
    }

    const data = doc.data();
    if (data.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own shared resumes." });
    }

    await resumesCollection.doc(shareId).delete();

    return res.json({ message: "Share link deleted successfully." });
  } catch (error) {
    console.error("Delete share link error:", error);
    return res.status(500).json({ error: "Failed to delete share link." });
  }
}

/**
 * Lists all shared resumes for the authenticated user.
 */
async function listShareLinks(req, res) {
  try {
    const userId = req.user?.uid;

    if (!userId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const snapshot = await resumesCollection
      .where("userId", "==", userId)
      .limit(50)
      .get();

    const shares = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      shares.push({
        shareId: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        expiresAt: data.expiresAt?.toDate?.()?.toISOString() || null,
        viewCount: data.viewCount || 0,
        personalName: data.resumeData?.personal?.name || "Untitled"
      });
    });

    // Sort by createdAt descending in memory
    shares.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return res.json({ shares });
  } catch (error) {
    console.error("List share links error:", error);
    return res.status(500).json({ error: "Failed to list share links." });
  }
}

module.exports = {
  createShareLink,
  getSharedResume,
  deleteShareLink,
  listShareLinks
};
