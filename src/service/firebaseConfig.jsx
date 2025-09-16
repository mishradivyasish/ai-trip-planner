// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // ✅ correct
// import { getAnalytics } from "firebase/analytics"; // optional

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQn5wf6h2UiwAqHDCLQptpGuQeG3pcNak",
  authDomain: "ai-trip-planner-647c8.firebaseapp.com",
  projectId: "ai-trip-planner-647c8",
  storageBucket: "ai-trip-planner-647c8.appspot.com",  // ✅ fixed: should be .appspot.com
  messagingSenderId: "652704948885",
  appId: "1:652704948885:web:5c970b8189b5c62667319c",
  measurementId: "G-VW59211HLQ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // ✅ small "s"

// const analytics = getAnalytics(app); // optional
