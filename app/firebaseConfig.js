// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAG73x53S9RfrxqgxdDo91F8peGoYIlIi0",
  authDomain: "valorize-app.firebaseapp.com",
  projectId: "valorize-app",
  storageBucket: "valorize-app.firebasestorage.app",
  messagingSenderId: "14768153992",
  appId: "1:14768153992:web:723ad9a0b802a6f8c3063d",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
async function getDownloadUrl(storagePath) {
  try {
    const storageRef = ref(storage, storagePath);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error fetching download URL:", error);
    return null;
  }
}
export { auth, db, storage, getDownloadUrl };
