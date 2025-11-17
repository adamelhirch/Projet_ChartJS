// Remplit les listes de pays et DevType en fonction du continent

function populateCountrySelect(selectElement, continent) {
  const processed = getProcessedData(continent);
  const countries = Array.from(new Set(processed.map(d => d.country))).sort();

  selectElement.innerHTML = '<option value="all">Tous les pays</option>' +
    countries.map(c => `<option value="${c}">${c}</option>`).join('');
}

function populateDevTypeSelect(selectElement, continent) {
  const processed = getProcessedData(continent);
  const devTypes = Array.from(new Set(processed.map(d => d.devType).filter(Boolean))).sort();

  selectElement.innerHTML = '<option value="all">Tous les métiers</option>' +
    devTypes.map(d => `<option value="${d}">${d}</option>`).join('');
}

// Fonctions pour mettre à jour tous les graphes d'un onglet

function refreshRevenueTab() {
  const continent = document.getElementById('continent-rev').value;
  const country = document.getElementById('pays-rev').value;

  let data = getProcessedData(continent);
  data = filterByCountry(data, country);

  const expAgg = getAvgSalaryByExperience(data);
  const eduAgg = getAvgSalaryByEdLevel(data);

  updateRevExpChart(expAgg.labels, expAgg.data);
  updateRevEdChart(eduAgg.labels, eduAgg.data);
}

function refreshSkillsTab() {
  const continent = document.getElementById('continent-comp').value;
  const country = document.getElementById('pays-comp').value;
  const expRange = document.getElementById('exp-comp').value;

  let data = getProcessedData(continent);
  data = filterByCountry(data, country);
  data = filterByExperienceRange(data, expRange);

  const cloudAgg = getAvgSalaryByCloud(data);
  const fwAgg = getAvgSalaryByFramework(data);

  updateCloudChart(cloudAgg.labels, cloudAgg.data);
  updateFrameworksChart(fwAgg.labels, fwAgg.data);
}

function refreshTechTab() {
  const continent = document.getElementById('continent-tech').value;
  const devType = document.getElementById('devtype-tech').value;
  const topN = parseInt(document.getElementById('topn-tech').value) || 5;

  let data = getProcessedData(continent);
  data = filterByDevType(data, devType);

  const osAgg = getTopOs(data, topN);
  const commsAgg = getTopComms(data, topN);

  updateOsChart(osAgg.labels, osAgg.data);
  updateCommsChart(commsAgg.labels, commsAgg.data);
}
