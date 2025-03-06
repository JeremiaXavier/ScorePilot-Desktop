// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtTWGp8HFNf9cmGlcL9pR9BkWJLECbOSM",
  authDomain: "classroom-2a384.firebaseapp.com",
  projectId: "classroom-2a384",
  storageBucket: "classroom-2a384.firebasestorage.app",
  messagingSenderId: "491567379011",
  appId: "1:491567379011:web:06e075e8fccac12f209af6",
  measurementId: "G-H4CB8JNF5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);