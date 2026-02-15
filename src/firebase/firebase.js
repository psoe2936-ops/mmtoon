import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAlcVlunHZ0AXElUrReZ9RrnI06cTsuSG4",
  authDomain: "mmtoon-903bb.firebaseapp.com",
  projectId: "mmtoon-903bb",
  storageBucket: "mmtoon-903bb.firebasestorage.app",
  messagingSenderId: "441028935367",
  appId: "1:441028935367:web:0223fa4c8684722ced88e2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
