import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDfts1PnPj5iwbkZnZP2uzAtY64cgqsew",
  authDomain: "job-application-1ce2f.firebaseapp.com",
  databaseURL: "https://job-application-1ce2f-default-rtdb.firebaseio.com",
  projectId: "job-application-1ce2f",
  storageBucket: "job-application-1ce2f.firebasestorage.app",
  messagingSenderId: "236602822714",
  appId: "1:236602822714:web:0a94fb7b8704a856006503",
  measurementId: "G-08C99E5JQP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export default app;
