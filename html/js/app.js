import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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

document.getElementById("btnSalvar").addEventListener("click", async () => {
    const texto = document.getElementById("markdown").value;
    try {
      await addDoc(collection(db, "markdowns"), {
        content: texto,
        createdAt: serverTimestamp()
      });
      alert("Salvo!");
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("Erro ao salvar. Veja o console.");
    }
  });
