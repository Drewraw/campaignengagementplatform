import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA-NuhEIDr1H1W2zojPqm18L3VdiWl5xlU",
  authDomain: "pro2-5f35b.firebaseapp.com",
  projectId: "pro2-5f35b",
  storageBucket: "pro2-5f35b.firebasestorage.app",
  messagingSenderId: "23053695380",
  appId: "1:23053695380:web:d563713ad462f1b408b781"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions };