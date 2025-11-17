const charts = {};

function createLineChart(ctxId, label, labels, data) {
  const ctx = document.getElementById(ctxId);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label,
        data,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#e5e7eb' } }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
        y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
      }
    }
  });
}

function createBarChart(ctxId, label, labels, data) {
  const ctx = document.getElementById(ctxId);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#e5e7eb' } }
      },
      scales: {
        x: { ticks: { color: '#9ca3af' }, grid: { color: '#111827' } },
        y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
      }
    }
  });
}

// Initialisation des 6 graphiques avec des données vides
function initCharts() {
  charts.revExp = createLineChart('chart-rev-experience', 'Revenu moyen (€)', [], []);
  charts.revEdu = createBarChart('chart-rev-etudes', 'Revenu moyen (€)', [], []);
  charts.cloud = createBarChart('chart-cloud', 'Revenu moyen (€)', [], []);
  charts.frameworks = createBarChart('chart-frameworks', 'Revenu moyen (€)', [], []);
  charts.os = createBarChart('chart-os', 'Nombre de développeurs', [], []);
  charts.comms = createBarChart('chart-comms', 'Nombre de développeurs', [], []);
}

// Fonctions de mise à jour

function updateRevExpChart(labels, data) {
  charts.revExp.data.labels = labels;
  charts.revExp.data.datasets[0].data = data;
  charts.revExp.update();
}

function updateRevEdChart(labels, data) {
  charts.revEdu.data.labels = labels;
  charts.revEdu.data.datasets[0].data = data;
  charts.revEdu.update();
}

function updateCloudChart(labels, data) {
  charts.cloud.data.labels = labels;
  charts.cloud.data.datasets[0].data = data;
  charts.cloud.update();
}

function updateFrameworksChart(labels, data) {
  charts.frameworks.data.labels = labels;
  charts.frameworks.data.datasets[0].data = data;
  charts.frameworks.update();
}

function updateOsChart(labels, data) {
  charts.os.data.labels = labels;
  charts.os.data.datasets[0].data = data;
  charts.os.update();
}

function updateCommsChart(labels, data) {
  charts.comms.data.labels = labels;
  charts.comms.data.datasets[0].data = data;
  charts.comms.update();
}
