import { db, auth, mostrarLoading, esconderLoading } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

document.getElementById("btnSalvar").addEventListener("click", async () => {
    const texto = document.getElementById("markdown").value;
    mostrarLoading();
    try {
      await addDoc(collection(db, "markdowns"), {
        content: texto,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      alert("Salvo!");
    } catch (e) {
      console.error("Erro ao salvar:", e);
      alert("Erro ao salvar. Veja o console.");
    } finally {
        esconderLoading();
    }
});
