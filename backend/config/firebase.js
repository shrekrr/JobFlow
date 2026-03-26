const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccount = require("../serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://job-application-1ce2f-default-rtdb.firebaseio.com/",
    storageBucket: "job-application-1ce2f.firebasestorage.app",
  });
}

const db = admin.database();
const storage = admin.storage().bucket();
const auth = admin.auth();

module.exports = { admin, db, storage, auth };