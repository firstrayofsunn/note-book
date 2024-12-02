import { initializeApp, getApps, getApp  } from "firebase/app"; 
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCbBkOPnhsqw65rPKN87jPRMTdUTDCjnZc",
  authDomain: "notion-rooshi.firebaseapp.com",
  projectId: "notion-rooshi",
  storageBucket: "notion-rooshi.firebasestorage.app",
  messagingSenderId: "598101191780",
  appId: "1:598101191780:web:400740b82975aae1ba8371"
  };

  const app= getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db= getFirestore(app);

  export { db };