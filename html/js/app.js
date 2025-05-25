import { db, auth, mostrarLoading, esconderLoading } from './firebase.js';
import { collection, addDoc, deleteDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

const selectNota = document.getElementById("selectNota");
for(let i = 0; i <= 10; i++) {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = i;
    selectNota.appendChild(opt);
}

const addReviewContainer = document.getElementById("addReviewContainer");
const btnMostrarAddReview = document.getElementById("btnMostrarAddReview");
const btnMostrarReviewPublicas = document.getElementById("btnMostrarReviewPublicas");
const btnCancelarAddReview = document.getElementById("btnCancelarAddReview");
const btnSalvarReview = document.getElementById("btnSalvarReview");
const btnFecharDetalhada = document.getElementById("btnFecharDetalhada");
const reviewDetalhadaContainer = document.getElementById("reviewDetalhadaContainer");

const userInfo = document.getElementById("userInfo");
const reviewType = document.getElementById("reviewType");

let reviewEditandoId = null;

btnMostrarAddReview.addEventListener("click", () => {
    addReviewContainer.classList.remove("d-none");
});

btnMostrarReviewPublicas.addEventListener("click", () => carregarReviewsPublicas());


btnCancelarAddReview.addEventListener("click", () => {
    addReviewContainer.classList.add("d-none");

    // Limpar e resetar estado de edição
    limparCamposFormulario();
    reviewEditandoId = null;
    btnSalvarReview.textContent = "Salvar";
});

btnFecharDetalhada.addEventListener("click", () => {
    reviewDetalhadaContainer.classList.add("d-none");
});

// Fechar review detalhada com ESC
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        reviewDetalhadaContainer.classList.add("d-none");
    }
});

// Fechar review detalhada ao clicar fora do card
reviewDetalhadaContainer.addEventListener("click", function (event) {
    const card = document.getElementById("reviewDetalhadaCard");
    if (!card.contains(event.target)) {
        reviewDetalhadaContainer.classList.add("d-none");
    }
});

btnSalvarReview.addEventListener("click", async () => {
    if (reviewEditandoId) {
        // Se estiver editando, chama a função para editar
        await editarReview();
    } else {
        // Se não, adiciona uma nova review
        await salvarNovaReview();
    }
});

async function salvarNovaReview() {
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
                username: currentUser.email.split("@")[0],
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

        limparCamposFormulario();

        carregarReviewsPublicas();
        
    } catch (e) {
        console.error("Erro ao salvar review:", e);
        alert("Erro ao salvar review. Veja o console.");
    }
}

async function editarReview() {
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
            alert("Você precisa estar logado para editar uma review.");
            return;
        }

        mostrarLoading();
        try {
            const reviewRef = doc(db, "reviews", reviewEditandoId);
            await updateDoc(reviewRef, {
                title: titulo,
                image: linkImagem,
                rating: Number(nota),
                review: textoDaReview,
                isPublic: isPublic,
                // Não altera userId, username ou createdAt
                updatedAt: serverTimestamp()
            });
            alert("Review atualizada!");
        } catch (e) {
            console.error("Erro ao atualizar:", e);
            alert("Erro ao atualizar. Veja o console.");
        } finally {
            esconderLoading();
        }

        addReviewContainer.classList.add("d-none");
        limparCamposFormulario();

        carregarReviewsPublicas();

    } catch (e) {
        console.error("Erro ao editar review:", e);
        alert("Erro ao editar review. Veja o console.");
    } finally {
        reviewEditandoId = null; // Limpa o ID de edição
    }
}

function limparCamposFormulario() {
    document.getElementById("inputTitulo").value = "";
    document.getElementById("inputImagem").value = "";
    selectNota.value = "";
    document.getElementById("textareaReview").value = "";
    document.getElementById("visibilidadePrivado").checked = true;
}

// Exibe as reviews
function exibirReviews(reviews) {
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

function abrirReviewDetalhada(review) {
    document.getElementById("reviewDetalhadaTitulo").textContent = review.title;
    document.getElementById("reviewDetalhadaImagem").src = review.image?.trim() !== "" ? review.image : "img/pipocaGPT.png";

    document.getElementById("reviewDetalhadaTexto").textContent = review.review;

    const data = review.createdAt?.toDate?.() || new Date();
    const dataFormatada = data.toLocaleDateString("pt-BR");

    const reviewDetalhadaAutorData = document.getElementById("reviewDetalhadaAutorData");

    if (review.username) {
        reviewDetalhadaAutorData.innerHTML = `Publicado por <span id="autorReview" style="text-decoration: underline; cursor: pointer;">${review.username}</span> em ${dataFormatada}`;
        
        document.getElementById("autorReview").addEventListener("click", () => carregarReviewsUser(review.username));
    }
    else {
        reviewDetalhadaAutorData.textContent = `Publicado por Desconhecido em ${dataFormatada}`;
    }

    const btnDeletar = document.getElementById("btnDeletarReview");
    const btnEditar = document.getElementById("btnEditarReview");

    // Mostrar botão de deletar se for o autor da review
    if (auth.currentUser && review.userId === auth.currentUser.uid) {
        btnDeletar.classList.remove("invisible");
        btnEditar.classList.remove("invisible");

        // Definir listener do botão
        btnDeletar.onclick = async () => {
            if (!confirm("Tem certeza que deseja deletar esta review?")) return;

            try {
                await deleteDoc(doc(db, "reviews", review.id));
                reviewDetalhadaContainer.classList.add("d-none");
                carregarReviewsPublicas();
            } catch (e) {
                console.error("Erro ao deletar review:", e);
                alert("Erro ao deletar review.");
            }
        };

        btnEditar.onclick = () => editar(review);
    } else {
        btnDeletar.classList.add("invisible");
        btnEditar.classList.add("invisible");
    }

    reviewDetalhadaContainer.classList.remove("d-none");
}

function editar(review) {
    // Guardar o id da review que será editada
    reviewEditandoId = review.id;

    // Preencher campos do formulário
    document.getElementById("inputTitulo").value = review.title;
    document.getElementById("inputImagem").value = review.image || "";
    selectNota.value = review.rating;
    document.getElementById("textareaReview").value = review.review;
    if (review.isPublic) {
        document.getElementById("visibilidadePublico").checked = true;
    } else {
        document.getElementById("visibilidadePrivado").checked = true;
    }

    // Mostrar o formulário
    addReviewContainer.classList.remove("d-none");

    // Fechar a review detalhada
    reviewDetalhadaContainer.classList.add("d-none");

    // Mudar texto do botão salvar para "Atualizar"
    btnSalvarReview.textContent = "Atualizar";
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

        exibirReviews(reviews);
    } catch (e) {
        console.error("Erro ao carregar reviews públicas:", e);
        alert("Erro ao carregar reviews públicas.");
    } finally {
        esconderLoading();
        reviewType.textContent = "Reviews Públicas";
    }
}

userInfo.addEventListener("click", () => carregarReviewsUser());

async function carregarReviewsUser(user = null) {
    mostrarLoading();
    try {
        let q;

        if (user === null) {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                alert("Você precisa estar logado para ver suas reviews.");
                return;
            }
            q = query(collection(db, "reviews"), where("userId", "==", currentUser.uid));
        } else {
            q = query(collection(db, "reviews"), where("username", "==", user), where("isPublic", "==", true));
        }

        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => {
            reviews.push({ id: doc.id, ...doc.data() });
        });

        exibirReviews(reviews);
    } catch (e) {
        console.error("Erro ao carregar reviews do usuário:", e);
        alert("Erro ao carregar reviews do usuário.");
    } finally {
        esconderLoading();
        reviewType.textContent = user ? `Reviews de ${user}` : "Suas Reviews";
    }
}


document.addEventListener("DOMContentLoaded", () => {
    carregarReviewsPublicas();
});