import { db, ref, push, auth, onAuthStateChanged } from './db.js';

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";

  window.salvarConta = () => {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;

    const conta = { nome, tipo };
    push(ref(db, `usuarios/${user.uid}/contas`), conta)
      .then(() => alert("Conta cadastrada com sucesso"))
      .catch(e => alert("Erro: " + e.message));
  };
});