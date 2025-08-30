// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVs6CtjOShDUUot6wJ_MCVU0i72Lnr1Lo",
    authDomain: "bahceden-1257d.firebaseapp.com",
    projectId: "bahceden-1257d",
    storageBucket: "bahceden-1257d.firebasestorage.app",
    messagingSenderId: "928312461902",
    appId: "1:928312461902:web:e06fa1998bd9b02ab9511f",
    measurementId: "G-0QNQSJ51Y6"
};

// Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, serverTimestamp };
