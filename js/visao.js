import { db, ref, get, child, auth, onAuthStateChanged } from './db.js';

const entradasEl = document.getElementById("totalEntradas");
const gastosEl = document.getElementById("totalGastos");
const fixasEl = document.getElementById("totalFixas");
const saldoEl = document.getElementById("saldoFinal");

const graficoPizzaCtx = document.getElementById("graficoResumo").getContext("2d");
const graficoLinhaCtx = document.createElement("canvas");
graficoLinhaCtx.width = 400;
graficoLinhaCtx.height = 300;
document.querySelector(".container").appendChild(graficoLinhaCtx);

const destaqueEl = document.createElement("div");
document.querySelector(".container").appendChild(destaqueEl);

let chartPizza, chartLinha;

function atualizarTexto(entradas, gastos, fixas) {
  const saldo = entradas - (gastos + fixas);
  entradasEl.textContent = entradas.toFixed(2);
  gastosEl.textContent = gastos.toFixed(2);
  fixasEl.textContent = fixas.toFixed(2);
  saldoEl.textContent = saldo.toFixed(2);
}

function desenharGraficoPizza(entradas, gastos, fixas) {
  if (chartPizza) chartPizza.destroy();
  chartPizza = new Chart(graficoPizzaCtx, {
    type: "pie",
    data: {
      labels: ["Entradas", "Gastos", "Fixas"],
      datasets: [{
        label: "Resumo Financeiro",
        data: [entradas, gastos, fixas],
        backgroundColor: ["green", "red", "orange"]
      }]
    }
  });
}

function desenharGraficoLinha(mensal) {
  if (chartLinha) chartLinha.destroy();

  const meses = Object.keys(mensal);
  const entradas = meses.map(m => mensal[m].entradas || 0);
  const gastos = meses.map(m => mensal[m].gastos || 0);
  const fixas = meses.map(m => mensal[m].fixas || 0);
  const saldo = meses.map((_, i) => entradas[i] - (gastos[i] + fixas[i]));

  chartLinha = new Chart(graficoLinhaCtx.getContext("2d"), {
    type: "line",
    data: {
      labels: meses,
      datasets: [
        { label: "Entradas", data: entradas, borderColor: "green", fill: false },
        { label: "Gastos", data: gastos, borderColor: "red", fill: false },
        { label: "Fixas", data: fixas, borderColor: "orange", fill: false },
        { label: "Saldo", data: saldo, borderColor: "blue", fill: false }
      ]
    }
  });
}

function formatarMes(dataBR) {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}`; // yyyy-mm
}

function calcularTotais(uid) {
  const baseRef = ref(db);
  Promise.all([
    get(child(baseRef, `usuarios/${uid}/entradas`)),
    get(child(baseRef, `usuarios/${uid}/gastos`)),
    get(child(baseRef, `usuarios/${uid}/fixas`))
  ]).then(([entradasSnap, gastosSnap, fixasSnap]) => {
    let totalEntradas = 0, totalGastos = 0, totalFixas = 0;
    const mensal = {};
    let maiorGasto = { valor: 0, descricao: "", data: "" };

    if (entradasSnap.exists()) {
      Object.values(entradasSnap.val()).forEach(e => {
        const mes = formatarMes(e.data);
        mensal[mes] = mensal[mes] || {};
        mensal[mes].entradas = (mensal[mes].entradas || 0) + (e.valor || 0);
        totalEntradas += e.valor || 0;
      });
    }

    if (gastosSnap.exists()) {
      Object.values(gastosSnap.val()).forEach(g => {
        const mes = formatarMes(g.data);
        mensal[mes] = mensal[mes] || {};
        mensal[mes].gastos = (mensal[mes].gastos || 0) + (g.valor || 0);
        totalGastos += g.valor || 0;
        if (g.valor > maiorGasto.valor) {
          maiorGasto = { valor: g.valor, descricao: g.descricao, data: g.data };
        }
      });
    }

    if (fixasSnap.exists()) {
      Object.values(fixasSnap.val()).forEach(f => {
        const mes = formatarMes(f.vencimento || f.data || "01/01/1900");
        mensal[mes] = mensal[mes] || {};
        mensal[mes].fixas = (mensal[mes].fixas || 0) + (f.valor || 0);
        totalFixas += f.valor || 0;
      });
    }

    atualizarTexto(totalEntradas, totalGastos, totalFixas);
    desenharGraficoPizza(totalEntradas, totalGastos, totalFixas);
    desenharGraficoLinha(mensal);

    // Destaques
    const meses = Object.keys(mensal).sort();
    const ultimo = meses[meses.length - 1];
    const penultimo = meses[meses.length - 2];

    const saldoAtual = ultimo ? (mensal[ultimo].entradas || 0) - ((mensal[ultimo].gastos || 0) + (mensal[ultimo].fixas || 0)) : 0;
    const saldoAnterior = penultimo ? (mensal[penultimo].entradas || 0) - ((mensal[penultimo].gastos || 0) + (mensal[penultimo].fixas || 0)) : 0;
    const diff = saldoAtual - saldoAnterior;
    const comparativo = saldoAnterior ? `Comparado ao mês anterior: ${diff >= 0 ? "+" : ""}${diff.toFixed(2)}` : "Sem mês anterior para comparar.";

    destaqueEl.innerHTML = `
      <h3>Destaques do Mês</h3>
      <p><strong>Maior gasto:</strong> ${maiorGasto.descricao || "-"} - R$ ${maiorGasto.valor.toFixed(2)} (${maiorGasto.data})</p>
      <p><strong>${ultimo}:</strong> saldo R$ ${saldoAtual.toFixed(2)}</p>
      <p>${comparativo}</p>
    `;
  });
}

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  calcularTotais(user.uid);
});
