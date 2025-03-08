// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBV2bclYG_v0L9V7MsqHf5KSfigm_EDm4",
  authDomain: "haha-eb1f0.firebaseapp.com",
  databaseURL: "https://haha-eb1f0-default-rtdb.firebaseio.com",
  projectId: "haha-eb1f0",
  storageBucket: "e-kalat.appspot.com",
  messagingSenderId: "1087894428984",
  appId: "1:1087894428984:web:c49fb357f759e525f875cd",
  measurementId: "G-7STDKLJSH9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);
