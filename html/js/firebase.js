import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCtYzmvJUYqU3srgZv9PBdxCh_K9cjtC0c",
    authDomain: "webdev-t3.firebaseapp.com",
    projectId: "webdev-t3",
    storageBucket: "webdev-t3.firebasestorage.app",
    messagingSenderId: "156895109192",
    appId: "1:156895109192:web:a7a489094c01a1641b787d"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
