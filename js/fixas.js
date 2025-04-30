import { db, ref, push, auth, onAuthStateChanged } from './db.js';

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";

  window.salvarFixa = () => {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const vencimento = document.getElementById("vencimento").value;

    const fixa = { descricao, valor, vencimento };
    push(ref(db, `usuarios/${user.uid}/fixas`), fixa)
      .then(() => alert("Conta fixa registrada"))
      .catch(e => alert("Erro: " + e.message));
  };
});