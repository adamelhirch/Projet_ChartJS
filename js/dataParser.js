// --- Conversion monnaie -> euros ---
const currencyRates = {
  USD: 0.93,
  GBP: 1.16,
  EUR: 1
};

function getCurrencyCode(currencyField) {
  if (!currencyField) return "EUR";
  return currencyField.split("\t")[0]; // "USD\tUnited States dollar" -> "USD"
}

function convertToEuro(amount, currencyCode) {
  const rate = currencyRates[currencyCode] || 1;
  return amount * rate;
}

// --- Utilitaires généraux ---

function parseList(str) {
  if (!str || str === "NA") return [];
  return str.split(";").map((s) => s.trim()).filter(Boolean);
}

// Transforme un enregistrement brut en objet simplifié
function processRecord(item) {
  const currencyCode = getCurrencyCode(item.Currency);
  const salaryRaw = parseFloat(item.CompTotal);
  const salary = isNaN(salaryRaw) ? null : convertToEuro(salaryRaw, currencyCode);

  return {
    country: item.Country,
    experience: parseInt(item.YearsCodePro) || null,
    devType: item.DevType,
    salary,
    edLevel: item.EdLevel,
    cloud: parseList(item.PlatformHaveWorkedWith),
    webframeworks: parseList(item.WebframeHaveWorkedWith),
    os: parseList(item.OpSysProfessionaluse),
    comms: parseList(item.OfficeStackSyncHaveWorkedWith)
  };
}

// rawNA et rawWE seront fournis par main.js après chargement des JSON
let rawNA = [];
let rawWE = [];

function setRawData(na, we) {
  rawNA = na;
  rawWE = we;
}

function getDatasetByContinent(continent) {
  if (continent === "north_america") return rawNA;
  return rawWE;
}

function getProcessedData(continent) {
  const raw = getDatasetByContinent(continent);
  return raw.map(processRecord).filter(r => r.salary !== null);
}

// Filtre par pays
function filterByCountry(data, countryValue) {
  if (!countryValue || countryValue === "all") return data;
  return data.filter((d) => d.country === countryValue);
}

// Filtre par expérience (intervalle texte comme "0-2", "3-5", etc.)
function filterByExperienceRange(data, expRange) {
  if (!expRange || expRange === "all") return data;

  return data.filter((d) => {
    if (d.experience == null) return false;
    if (expRange === "0-2") return d.experience >= 0 && d.experience <= 2;
    if (expRange === "3-5") return d.experience >= 3 && d.experience <= 5;
    if (expRange === "6-10") return d.experience >= 6 && d.experience <= 10;
    if (expRange === "10+") return d.experience > 10;
    return true;
  });
}

// Filtre par DevType
function filterByDevType(data, devType) {
  if (!devType || devType === "all") return data;
  return data.filter((d) => d.devType === devType);
}

// --- Agrégations pour les graphes ---

function average(values) {
  if (!values.length) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
}

// Revenu moyen par années d'expérience
function getAvgSalaryByExperience(data) {
  const groups = {};

  data.forEach((d) => {
    if (d.experience == null || d.salary == null) return;
    const key = d.experience; // nombre d'années exact
    if (!groups[key]) groups[key] = [];
    groups[key].push(d.salary);
  });

  const labels = Object.keys(groups)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);

  const dataset = labels.map((exp) => average(groups[exp]));

  return { labels: labels.map((e) => `${e} ans`), data: dataset };
}

// Revenu moyen par niveau d'études
function getAvgSalaryByEdLevel(data) {
  const groups = {};

  data.forEach((d) => {
    if (!d.edLevel || d.salary == null) return;
    if (!groups[d.edLevel]) groups[d.edLevel] = [];
    groups[d.edLevel].push(d.salary);
  });

  const labels = Object.keys(groups);
  const dataset = labels.map((label) => average(groups[label]));

  return { labels, data: dataset };
}

// Revenu moyen par plateforme cloud
function getAvgSalaryByCloud(data) {
  const groups = {};

  data.forEach((d) => {
    if (!d.cloud.length || d.salary == null) return;
    d.cloud.forEach((cloud) => {
      if (!groups[cloud]) groups[cloud] = [];
      groups[cloud].push(d.salary);
    });
  });

  const labels = Object.keys(groups);
  const dataset = labels.map((label) => average(groups[label]));

  return { labels, data: dataset };
}

// Revenu moyen par framework web
function getAvgSalaryByFramework(data) {
  const groups = {};

  data.forEach((d) => {
    if (!d.webframeworks.length || d.salary == null) return;
    d.webframeworks.forEach((fw) => {
      if (!groups[fw]) groups[fw] = [];
      groups[fw].push(d.salary);
    });
  });

  const labels = Object.keys(groups);
  const dataset = labels.map((label) => average(groups[label]));

  return { labels, data: dataset };
}

// Top N systèmes d'exploitation
function getTopOs(data, topN) {
  const counts = {};

  data.forEach((d) => {
    d.os.forEach((os) => {
      counts[os] = (counts[os] || 0) + 1;
    });
  });

  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return {
    labels: entries.map((e) => e[0]),
    data: entries.map((e) => e[1])
  };
}

// Top N outils de communication
function getTopComms(data, topN) {
  const counts = {};

  data.forEach((d) => {
    d.comms.forEach((tool) => {
      counts[tool] = (counts[tool] || 0) + 1;
    });
  });

  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);

  return {
    labels: entries.map((e) => e[0]),
    data: entries.map((e) => e[1])
  };
}
