// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAOOMAIbGEYrdsNm-wihRWGuFQ7Gtkhcvg",
  authDomain: "madhurakkuri.firebaseapp.com",
  projectId: "madhurakkuri",
  storageBucket: "madhurakkuri.appspot.com",
  messagingSenderId: "800666195541",
  appId: "1:800666195541:web:84bfdf72b52b5179b4a6dc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realTimeDb = getDatabase(app);
