import admin from "firebase-admin";
import { readFileSync } from "fs";

// Initialize Firebase Admin SDK with service account
const serviceAccount = JSON.parse(readFileSync("./firebase-service-account.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export Firestore instance
export const db = admin.firestore();
export default admin;
