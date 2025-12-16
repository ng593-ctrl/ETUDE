// study-sync/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; // <-- NEW IMPORT NEEDED

// Access the secure keys from the .env file
const firebaseConfig = {
  apiKey: "AIzaSyCXkprPNeWU3x-JE6kqO3HPEMyCkyT9Abw",
  authDomain: "the-study-sync-37008.firebaseapp.com",
  projectId: "the-study-sync-37008",
  storageBucket: "the-study-sync-37008.firebasestorage.app",
  messagingSenderId: "215123082298",
  appId: "1:215123082298:web:b0fe0b2f4556b46d500903",
  measurementId: "G-XZL2W81LJ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const db = getFirestore(app); // <-- NEW EXPORT NEEDED
// Save this file.      