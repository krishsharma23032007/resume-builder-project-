const admin = require("firebase-admin");

function normalizePrivateKey(privateKey) {
  if (!privateKey) return undefined;

  const trimmed = privateKey.trim();

  try {
    return JSON.parse(trimmed).replace(/\\n/g, "\n");
  } catch (_) {
    return trimmed.replace(/\\n/g, "\n");
  }
}

function getFirebaseApp() {
  if (admin.apps.length) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin env vars are missing.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

function getAuth() {
  getFirebaseApp();
  return admin.auth();
}

module.exports = {
  admin,
  getAuth
};
