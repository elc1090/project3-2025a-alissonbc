import { db, auth, mostrarLoading, esconderLoading } from './firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const selectNota = document.getElementById("selectNota");
for(let i = 0; i <= 10; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    selectNota.appendChild(opt);
}

const addReviewContainer = document.getElementById("addReviewContainer");
const btnMostrarAddReview = document.getElementById("btnMostrarAddReview");
const btnCancelarAddReview = document.getElementById("btnCancelarAddReview");
const btnSalvarReview = document.getElementById("btnSalvarReview");

btnMostrarAddReview.addEventListener("click", () => {
    addReviewContainer.classList.remove("d-none");
});

btnCancelarAddReview.addEventListener("click", () => {
    addReviewContainer.classList.add("d-none");
});

btnSalvarReview.addEventListener("click", async () => {
    const titulo = document.getElementById("inputTitulo").value.trim();
    const linkImagem = document.getElementById("inputImagem").value.trim();
    const nota = selectNota.value;
    const textoDaReview = document.getElementById("textareaReview").value.trim();
    const isPublic = document.getElementById("visibilidadePublico").checked;

    if (!titulo || !nota || !textoDaReview) {
        alert("Preencha pelo menos título, nota e review.");
        return;
    }

    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert("Você precisa estar logado para salvar uma review.");
            return;
        }

        mostrarLoading();
        try {
            await addDoc(collection(db, "reviews"), {
                title: titulo,
                image: linkImagem,
                rating: Number(nota),
                review: textoDaReview,
                isPublic: isPublic,
                userId: currentUser.uid,
                createdAt: serverTimestamp()
            });
            alert("Review salva!");
        } catch (e) {
            console.error("Erro ao salvar:", e);
            alert("Erro ao salvar. Veja o console.");
        } finally {
            esconderLoading();
        }
        addReviewContainer.classList.add("d-none");

        // limpando os campos
        document.getElementById("inputTitulo").value = "";
        document.getElementById("inputImagem").value = "";
        selectNota.value = "";
        document.getElementById("textareaReview").value = "";
        document.getElementById("visibilidadePrivado").checked = true;
    } catch (e) {
        console.error("Erro ao salvar review:", e);
        alert("Erro ao salvar review. Veja o console.");
    }
});
