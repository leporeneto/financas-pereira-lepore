import { db, ref, get, child, auth, onAuthStateChanged } from './db.js';

const historicoDiv = document.getElementById("historico");

function criarSelect(id, options) {
  const select = document.createElement("select");
  select.id = id;
  const todos = document.createElement("option");
  todos.value = "";
  todos.textContent = "Todos";
  select.appendChild(todos);
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
  return select;
}

function aplicarFiltros(registros, tipoFiltro, categoriaFiltro, contaFiltro) {
  return registros.filter(item => {
    return (!tipoFiltro || item.tipo === tipoFiltro) &&
           (!categoriaFiltro || item.categoria === categoriaFiltro) &&
           (!contaFiltro || item.conta === contaFiltro);
  });
}

function renderizar(registros) {
  historicoDiv.innerHTML = "";
  if (registros.length === 0) {
    historicoDiv.innerHTML = "<p>Nenhum registro encontrado.</p>";
    return;
  }

  const lista = document.createElement("ul");

  registros.forEach(r => {
    const item = document.createElement("li");
    item.innerHTML = `<strong>[${r.tipo.toUpperCase()}]</strong> ${r.data} - ${r.descricao} - R$ ${r.valor.toFixed(2)} (${r.conta || 'sem conta'})`;
    item.style.color = r.tipo === "entrada" ? "green" : r.tipo === "gasto" ? "red" : "orange";
    lista.appendChild(item);
  });

  historicoDiv.appendChild(lista);
}

function carregarHistorico(uid) {
  const tipos = [], categorias = new Set(), contas = new Set();
  const registros = [];

  const baseRef = ref(db);
  Promise.all([
    get(child(baseRef, `usuarios/${uid}/entradas`)),
    get(child(baseRef, `usuarios/${uid}/gastos`)),
    get(child(baseRef, `usuarios/${uid}/fixas`))
  ]).then(([entradas, gastos, fixas]) => {
    if (entradas.exists()) {
      Object.values(entradas.val()).forEach(e => {
        registros.push({ ...e, tipo: "entrada" });
        categorias.add(e.categoria || "");
        contas.add(e.conta || "");
      });
    }
    if (gastos.exists()) {
      Object.values(gastos.val()).forEach(g => {
        registros.push({ ...g, tipo: "gasto" });
        categorias.add(g.categoria || "");
        contas.add(g.conta || "");
      });
    }
    if (fixas.exists()) {
      Object.values(fixas.val()).forEach(f => {
        registros.push({ ...f, tipo: "fixa" });
        categorias.add(f.categoria || "fixa");
        contas.add(f.conta || "fixa");
      });
    }

    tipos.push("entrada", "gasto", "fixa");
    criarInterfaceFiltro(tipos, Array.from(categorias), Array.from(contas), registros);
  });
}

function criarInterfaceFiltro(tipos, categorias, contas, registros) {
  const container = document.createElement("div");
  const tipoSelect = criarSelect("filtroTipo", tipos);
  const catSelect = criarSelect("filtroCategoria", categorias);
  const contaSelect = criarSelect("filtroConta", contas);
  const botao = document.createElement("button");
  botao.textContent = "Filtrar";
  botao.onclick = () => {
    const tipo = tipoSelect.value;
    const categoria = catSelect.value;
    const conta = contaSelect.value;
    const filtrados = aplicarFiltros(registros, tipo, categoria, conta);
    renderizar(filtrados);
  };

  container.appendChild(tipoSelect);
  container.appendChild(catSelect);
  container.appendChild(contaSelect);
  container.appendChild(botao);
  historicoDiv.appendChild(container);

  renderizar(registros);
}

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  carregarHistorico(user.uid);
});
