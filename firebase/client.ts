import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCitcP7WpdTeSxY8-f92RoXVf-3EG_iezU",
    authDomain: "ia-interview-91820.firebaseapp.com",
    projectId: "ia-interview-91820",
    storageBucket: "ia-interview-91820.firebasestorage.app",
    messagingSenderId: "290636459797",
    appId: "1:290636459797:web:410be25aaba125e049c31c",
    measurementId: "G-ZK9FR66FLC"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);