// Gestion des onglets
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = {
    revenus: document.getElementById('tab-revenus'),
    competences: document.getElementById('tab-competences'),
    technos: document.getElementById('tab-technos')
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.toggle('active', b === btn));
      Object.entries(tabContents).forEach(([name, section]) => {
        section.classList.toggle('active', name === tab);
      });

      if (tab === 'revenus') refreshRevenueTab();
      if (tab === 'competences') refreshSkillsTab();
      if (tab === 'technos') refreshTechTab();
    });
  });
}

// Initialisation des filtres + listeners
function initFilters() {
  const continentRev = document.getElementById('continent-rev');
  const countryRev = document.getElementById('pays-rev');

  const continentComp = document.getElementById('continent-comp');
  const countryComp = document.getElementById('pays-comp');
  const expComp = document.getElementById('exp-comp');

  const continentTech = document.getElementById('continent-tech');
  const devTypeTech = document.getElementById('devtype-tech');
  const topNTech = document.getElementById('topn-tech');

  // Remplissage initial des listes selon continent par défaut
  populateCountrySelect(countryRev, continentRev.value);
  populateCountrySelect(countryComp, continentComp.value);
  populateDevTypeSelect(devTypeTech, continentTech.value);

  // Listeners Revenus
  continentRev.addEventListener('change', () => {
    populateCountrySelect(countryRev, continentRev.value);
    refreshRevenueTab();
  });
  countryRev.addEventListener('change', refreshRevenueTab);

  // Listeners Compétences
  continentComp.addEventListener('change', () => {
    populateCountrySelect(countryComp, continentComp.value);
    refreshSkillsTab();
  });
  countryComp.addEventListener('change', refreshSkillsTab);
  expComp.addEventListener('change', refreshSkillsTab);

  // Listeners Technologies
  continentTech.addEventListener('change', () => {
    populateDevTypeSelect(devTypeTech, continentTech.value);
    refreshTechTab();
  });
  devTypeTech.addEventListener('change', refreshTechTab);
  topNTech.addEventListener('change', refreshTechTab);
}

// --- Chargement des données JSON (NA + WE) ---
async function loadData() {
  try {
    const [naRes, weRes] = await Promise.all([
      fetch('data/NA.json'),
      fetch('data/WE.json')
    ]);

    if (!naRes.ok || !weRes.ok) {
      console.error('Erreur de chargement des fichiers JSON', naRes.status, weRes.status);
      return { na: [], we: [] };
    }

    const na = await naRes.json();
    const we = await weRes.json();
    return { na, we };
  } catch (err) {
    console.error('Erreur lors du fetch des données :', err);
    return { na: [], we: [] };
  }
}

// Point d’entrée
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Charger les données JSON
  const { na, we } = await loadData();

  // 2. Les transmettre au parser (dataParser.js)
  setRawData(na, we);

  // 3. Initialiser l’UI
  initTabs();
  initCharts();
  initFilters();

  // 4. Premier affichage des graphes
  refreshRevenueTab();
  refreshSkillsTab();
  refreshTechTab();
});
