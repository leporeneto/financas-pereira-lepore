import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBD21CdmT5YukoHzwB3Zm2zbwHuKdoOlYY",
  authDomain: "financeiropereiralepore.firebaseapp.com",
  databaseURL: "https://financeiropereiralepore-default-rtdb.firebaseio.com",
  projectId: "financeiropereiralepore",
  storageBucket: "financeiropereiralepore.appspot.com",
  messagingSenderId: "601293313257",
  appId: "1:601293313257:web:default" // (se não tiver appId exato, pode deixar assim por enquanto)
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
