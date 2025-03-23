import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, writeBatch, QuerySnapshot } from "firebase/firestore";

let analytics;

const firebaseConfig = {
  apiKey: "AIzaSyCFtg38gQ-jYibCGWfoTPLBv6jzxTJKovU",
  authDomain: "chatpg-31eb7.firebaseapp.com",
  projectId: "chatpg-31eb7",
  storageBucket: "chatpg-31eb7.firebasestorage.app",
  messagingSenderId: "179533408001",
  appId: "1:179533408001:web:decbd1f686eb4301dddd00",
  measurementId: "G-ENEQETZ111"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Chỉ khởi tạo Analytics trên client-side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { db, collection, addDoc, query, orderBy, onSnapshot, getDocs, getDoc, doc, setDoc, writeBatch, QuerySnapshot };
