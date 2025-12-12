const pieColors = [
  '#3b82f6',
  '#10b981', 
  '#f59e0b',
  '#ef4444', 
  '#8b5cf6', 
  '#06b6d4', 
  '#f43f5e', 
  '#84cc16', 
  '#6366f1',
  '#ec4899'
];

//Dictionnaire pour raccourcir les noms des diplômes
const educationLabelsShort = {
  "Bachelor’s degree (B.A., B.S., B.Eng., etc.)": "Bachelor",
  "Master’s degree (M.A., M.S., M.Eng., MBA, etc.)": "Master",
  "Some college/university study without earning a degree": "Université (sans diplôme)",
  "Secondary school (e.g. American high school, German Realschule or Gymnasium, etc.)": "Lycée / Secondaire",
  "Associate degree (A.A., A.S., etc.)": "Associate Degree (Bac+2)",
  "Professional degree (JD, MD, Ph.D, Ed.D, etc.)": "Doctorat / Pro",
  "Primary/elementary school": "Primaire",
  "Something else": "Autre"
};
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
        tension: 0.3,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: { bottom: 10 } 
      },
      plugins: {
        legend: { labels: { color: '#e5e7eb' } }
      },
      scales: {
        x: { 
          ticks: { 
            color: '#9ca3af',
            maxRotation: 0,
            maxTicksLimit: 10,
            autoSkip: true 
          }, 
          grid: { color: '#1f2937' } 
        },
        y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
      }
    }
  });
}
function createPieChart(ctxId, labels, data) {
  const ctx = document.getElementById(ctxId);

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: pieColors.slice(0, data.length),
        borderColor: '#0f172a',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#e5e7eb', padding: 12 }
        }
      },
      layout: {
        padding: 10
      }
    }
  });
}

function createBarChart(ctxId, label, labels, data, axis = 'x') {
  const ctx = document.getElementById(ctxId);
  
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: '#3b82f6',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: axis, 
      responsive: true,
      maintainAspectRatio: false,
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

//Initialisation des 6 graphiques
function initCharts() {
  charts.revExp = createLineChart('chart-rev-experience', 'Revenu moyen (€)', [], []);
charts.revEdu = createBarChart('chart-rev-etudes', 'Revenu moyen (€)', [], [], 'y');
  charts.cloud = createBarChart('chart-cloud', 'Revenu moyen (€)', [], [], 'y');
  charts.frameworks = createBarChart('chart-frameworks', 'Revenu moyen (€)', [], [], 'y');
  charts.os = createPieChart('chart-os', [], []);
charts.comms = createPieChart('chart-comms', [], []);

}

function formatLabel(str, maxwidth) {
  const sections = [];
  const words = str.split(" ");
  let temp = "";
  words.forEach(function(item, index) {
    if (temp.length > 0) {
      const concat = temp + ' ' + item;
      if (concat.length > maxwidth) {
        sections.push(temp);
        temp = "";
      } else {
        if (index === (words.length - 1)) {
          sections.push(concat); return;
        } else {
          temp = concat; return;
        }
      }
    }
    if (index === (words.length - 1)) {
      sections.push(item); return;
    }
    if (item.length < maxwidth) {
      temp = item;
    } else {
      sections.push(item);
    }
  });
  return sections;
}
//Fonctions de mise à jour
function updateRevExpChart(labels, data) {
  charts.revExp.data.labels = labels;
  charts.revExp.data.datasets[0].data = data;
  charts.revExp.update();
}

function updateRevEdChart(labels, data) {
  const chart = charts.revEdu;
  const cleanLabels = labels.map(originalLabel => {
  return educationLabelsShort[originalLabel] || formatLabel(originalLabel, 20);
  });

  chart.data.labels = cleanLabels;
  chart.data.datasets[0].data = data;
  chart.options.indexAxis = 'y';
  chart.options.maintainAspectRatio = false;
  
  chart.options.scales.y = {
    ticks: {
      color: '#ffffff',
      autoSkip: false,
      font: {
        size: 11,
        weight: 'bold'
      }
    },
    grid: { display: false }
  };

  chart.update();
}

function updateCloudChart(labels, data) {
  const topLimit = 12;
  charts.cloud.data.labels = labels.slice(0, topLimit);
  charts.cloud.data.datasets[0].data = data.slice(0, topLimit);
  charts.cloud.options.indexAxis = 'y'; 
  charts.cloud.options.scales.x.ticks.color = '#9ca3af';
  charts.cloud.options.scales.y.ticks.color = '#ffffff';
  charts.cloud.options.scales.y.ticks.font = { weight: 'bold' };

  charts.cloud.update();
}

function updateFrameworksChart(labels, data) {
  const topLimit = 12;
  charts.frameworks.data.labels = labels.slice(0, topLimit);
  charts.frameworks.data.datasets[0].data = data.slice(0, topLimit);
  charts.frameworks.options.indexAxis = 'y';
  charts.frameworks.options.scales.x.ticks.color = '#9ca3af';
  charts.frameworks.options.scales.y.ticks.color = '#ffffff';
  charts.frameworks.options.scales.y.ticks.font = { weight: 'bold' };

  charts.frameworks.update();
}

function updateOsChart(labels, data) {
  charts.os.data.labels = labels;
  charts.os.data.datasets[0].data = data;
  charts.os.data.datasets[0].backgroundColor = data.map((_, i) => pieColors[i % pieColors.length]);
  charts.os.update();
}

function updateCommsChart(labels, data) {
  charts.comms.data.labels = labels;
  charts.comms.data.datasets[0].data = data;
  charts.comms.data.datasets[0].backgroundColor = data.map((_, i) => pieColors[i % pieColors.length]);
  charts.comms.update();
}