// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDu0ogcEanj8odBK7dRSpQAVQG72_GixNc",
    authDomain: "apex-fce2b.firebaseapp.com",
    projectId: "apex-fce2b",
    storageBucket: "apex-fce2b.appspot.com",
    messagingSenderId: "174318420583",
    appId: "1:174318420583:web:22e4384693b41c2648cac2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
