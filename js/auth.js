import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  signInWithEmailAndPassword(auth, email, senha)
    .then(() => window.location.href = "inicio.html")
    .catch(e => alert("Erro ao entrar: " + e.message));
};

window.registrar = () => {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  createUserWithEmailAndPassword(auth, email, senha)
    .then(() => alert("Conta criada! Faça login."))
    .catch(e => alert("Erro: " + e.message));
};

window.resetarSenha = () => {
  const email = document.getElementById("email").value;
  sendPasswordResetEmail(auth, email)
    .then(() => alert("Email de redefinição enviado."))
    .catch(e => alert("Erro: " + e.message));
};
