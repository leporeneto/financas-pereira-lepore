import { db, ref, get, child, auth, onAuthStateChanged } from './db.js';

const entradasEl = document.getElementById("totalEntradas");
const gastosEl = document.getElementById("totalGastos");
const fixasEl = document.getElementById("totalFixas");
const saldoEl = document.getElementById("saldoFinal");
const graficoCtx = document.getElementById("graficoResumo").getContext("2d");

let chart;

function atualizarTexto(entradas, gastos, fixas) {
  const saldo = entradas - (gastos + fixas);
  entradasEl.textContent = entradas.toFixed(2);
  gastosEl.textContent = gastos.toFixed(2);
  fixasEl.textContent = fixas.toFixed(2);
  saldoEl.textContent = saldo.toFixed(2);
}

function desenharGrafico(entradas, gastos, fixas) {
  if (chart) chart.destroy();
  chart = new Chart(graficoCtx, {
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

function calcularTotais(uid) {
  const baseRef = ref(db);
  Promise.all([
    get(child(baseRef, `usuarios/${uid}/entradas`)),
    get(child(baseRef, `usuarios/${uid}/gastos`)),
    get(child(baseRef, `usuarios/${uid}/fixas`))
  ]).then(([entradas, gastos, fixas]) => {
    let totalEntradas = 0, totalGastos = 0, totalFixas = 0;

    if (entradas.exists()) {
      totalEntradas = Object.values(entradas.val()).reduce((sum, e) => sum + (e.valor || 0), 0);
    }
    if (gastos.exists()) {
      totalGastos = Object.values(gastos.val()).reduce((sum, g) => sum + (g.valor || 0), 0);
    }
    if (fixas.exists()) {
      totalFixas = Object.values(fixas.val()).reduce((sum, f) => sum + (f.valor || 0), 0);
    }

    atualizarTexto(totalEntradas, totalGastos, totalFixas);
    desenharGrafico(totalEntradas, totalGastos, totalFixas);
  });
}

onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "index.html";
  calcularTotais(user.uid);
});
