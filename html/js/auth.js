import { auth, mostrarLoading, esconderLoading } from './firebase.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Elementos
const emailEl = document.getElementById("email");
const senhaEl = document.getElementById("senha");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnLogin = document.getElementById("btnLogin");
const btnFecharLogin = document.getElementById("btnFecharLogin");
const loginCardContainer = document.getElementById("loginCardContainer");
const btnMostrarLogin = document.getElementById("btnMostrarLogin");
const btnLogout = document.getElementById("btnLogout");
const userInfo = document.getElementById("userInfo");

// Mostrar e ocultar card
btnMostrarLogin.addEventListener("click", () => {
    loginCardContainer.style.display = "flex";
    loginCardContainer.classList.remove("d-none");
});

btnFecharLogin.addEventListener("click", () => {
    loginCardContainer.classList.add("d-none");
});

// Registro
btnRegistrar.addEventListener("click", async () => {
    mostrarLoading();
    try {
        await createUserWithEmailAndPassword(auth, emailEl.value, senhaEl.value);
        loginCardContainer.classList.add("d-none");
    } catch (e) {
        alert("Erro ao registrar: " + e.message);
    } finally {
        esconderLoading();
    }
});

// Login
btnLogin.addEventListener("click", async () => {
    mostrarLoading();
    try {
        await signInWithEmailAndPassword(auth, emailEl.value, senhaEl.value);
        loginCardContainer.classList.add("d-none");
    } catch (e) {
        alert("Erro ao logar: " + e.message);
    } finally {
        esconderLoading();
    }
});

document.getElementById("btnLogout").addEventListener("click", async () => {
    mostrarLoading();
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Erro ao deslogar:", e);
    } finally {
        esconderLoading();
    }
});

// Detecta mudanças de login
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário logado:", user.email);

        loginCardContainer.classList.add("d-none");
        btnMostrarLogin.classList.add("d-none");
        btnLogout.classList.remove("d-none");
        userInfo.classList.remove("d-none");
        userInfo.textContent = user.email;
        
    } else {
        console.log("Usuário deslogado.");

        btnMostrarLogin.classList.remove("d-none");
        btnLogout.classList.add("d-none");
        userInfo.classList.add("d-none");
        userInfo.textContent = "";
    }
});
