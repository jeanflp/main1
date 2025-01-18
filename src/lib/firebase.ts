import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmKbag5JSYpi7NTAehAKw--WL-60XyDx8",
  authDomain: "factions-d95b2.firebaseapp.com",
  projectId: "factions-d95b2",
  storageBucket: "factions-d95b2.firebasestorage.app",
  messagingSenderId: "72792151606",
  appId: "1:72792151606:web:7d2bf2a00eb7a36e4aea97",
  measurementId: "G-Y3CN22LG2X"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
