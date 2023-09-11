import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDpw4tg4w_h7DnC5Ghv5PCb1wb7I7-V9rI",
    authDomain: "wallet-wise-baaf0.firebaseapp.com",
    projectId: "wallet-wise-baaf0",
    storageBucket: "wallet-wise-baaf0.appspot.com",
    messagingSenderId: "476283153582",
    appId: "1:476283153582:web:ec9322580c166d8865913f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
