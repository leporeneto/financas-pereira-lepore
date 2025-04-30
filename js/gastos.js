import { db, ref, push, auth, onAuthStateChanged, get, child } from './db.js';

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  carregarContas(user.uid);

  window.salvarGasto = () => {
    const data = document.getElementById("data").value;
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const conta = document.getElementById("contaSelect").value;

    const gasto = { data, descricao, valor, conta };
    push(ref(db, `usuarios/${user.uid}/gastos`), gasto)
      .then(() => alert("Gasto registrado com sucesso"))
      .catch(e => alert("Erro: " + e.message));
  };
});

function carregarContas(uid) {
  const select = document.getElementById("contaSelect");
  get(child(ref(db), `usuarios/${uid}/contas`)).then(snapshot => {
    if (snapshot.exists()) {
      select.innerHTML = "";
      Object.values(snapshot.val()).forEach(conta => {
        const option = document.createElement("option");
        option.value = conta.nome;
        option.textContent = conta.nome;
        select.appendChild(option);
      });
    }
  });
}