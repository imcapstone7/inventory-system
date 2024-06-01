// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyw95QASesNXeV3uhE-ORXQratpr7SbOU",
  authDomain: "inventory-system-5f079.firebaseapp.com",
  databaseURL: "https://inventory-system-5f079-default-rtdb.firebaseio.com",
  projectId: "inventory-system-5f079",
  storageBucket: "inventory-system-5f079.appspot.com",
  messagingSenderId: "399077083893",
  appId: "1:399077083893:web:681b024960c36e083953bc",
  measurementId: "G-CZK8N63SR0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
