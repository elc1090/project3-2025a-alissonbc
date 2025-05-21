import { db, auth, mostrarLoading, esconderLoading } from './firebase.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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

        if (isPublic) {
            carregarReviewsPublicas();
        }
        
    } catch (e) {
        console.error("Erro ao salvar review:", e);
        alert("Erro ao salvar review. Veja o console.");
    }
});

// Reviews publicas
function exibirReviewsPublicas(reviews) {
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = ""; // limpa antes de renderizar

    reviews.forEach((review) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "card review-card text-bg-light";
    card.style.cursor = "pointer";
    card.onclick = () => abrirReviewDetalhada(review); // Abre o card com a review completa

    const imagem = review.image && review.image.trim() !== "" ? review.image : "img/pipocaGPT.png";

    card.innerHTML = `
        <img src="${imagem}" class="card-img-top" alt="Capa do filme" style="height: 200px; object-fit: cover;" onerror="this.onerror=null;this.src='img/pipocaGPT.png';">
        <div class="card-body d-flex flex-column">
        <h5 class="card-title text-truncate" title="${review.title}">${review.title}</h5>
        <p class="card-text review-descricao">${review.review.replace(/\n/g, "<br>")}</p>
        </div>
    `;

    col.appendChild(card);
    container.appendChild(col); 
    });
}
  
function abrirReviewDetalhada(review){
    alert("O card de review completa abriria agora");
}

async function carregarReviewsPublicas() {
    mostrarLoading();
    try {
        const q = query(collection(db, "reviews"), where("isPublic", "==", true));
        const querySnapshot = await getDocs(q);

        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        exibirReviewsPublicas(reviews);
    } catch (e) {
        console.error("Erro ao carregar reviews públicas:", e);
        alert("Erro ao carregar reviews públicas.");
    } finally {
        esconderLoading();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarReviewsPublicas();
});