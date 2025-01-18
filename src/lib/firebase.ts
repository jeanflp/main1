import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC7-Aigtg9RJaw9QqlK4tmmFheGZN9etqs",
  authDomain: "factions-manager.firebaseapp.com",
  projectId: "factions-manager",
  storageBucket: "factions-manager.firebasestorage.app",
  messagingSenderId: "588392686089",
  appId: "1:588392686089:web:f9611ad4168de317200ed8",
  measurementId: "G-VGE8TJ6J8C",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
