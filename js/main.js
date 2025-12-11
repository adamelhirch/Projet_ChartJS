
function initTabs() {
  var tabButtons = document.querySelectorAll('.tab-btn');

  function activerOnglet(tabName) {
    for (var i = 0; i < tabButtons.length; i++) {
      var b = tabButtons[i];
      var bTab = b.getAttribute('data-tab');
      if (bTab === tabName) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    }

    var sections = [
      { name: 'revenus', elem: document.getElementById('tab-revenus') },
      { name: 'competences', elem: document.getElementById('tab-competences') },
      { name: 'technos', elem: document.getElementById('tab-technos') }
    ];

    for (var j = 0; j < sections.length; j++) {
      if (sections[j].name === tabName) {
        sections[j].elem.classList.add('active');
      } else {
        sections[j].elem.classList.remove('active');
      }
    }

    if (tabName === 'revenus') {
      refreshRevenueTab();
    } else if (tabName === 'competences') {
      refreshSkillsTab();
    } else if (tabName === 'technos') {
      refreshTechTab();
    }
  }

  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function () {
      var tab = this.getAttribute('data-tab');
      activerOnglet(tab);
    });
  }

  activerOnglet('revenus');
}

function initFilters() {
  var continentRev = document.getElementById('continent-rev');
  var countryRev   = document.getElementById('pays-rev');

  var continentComp = document.getElementById('continent-comp');
  var countryComp   = document.getElementById('pays-comp');
  var expComp       = document.getElementById('exp-comp');

  var continentTech = document.getElementById('continent-tech');
  var devTypeTech   = document.getElementById('devtype-tech');
  var topNTech      = document.getElementById('topn-tech');

  populateCountrySelect(countryRev,  continentRev.value);
  populateCountrySelect(countryComp, continentComp.value);
  populateDevTypeSelect(devTypeTech, continentTech.value);

  continentRev.addEventListener('change', function () {
    populateCountrySelect(countryRev, continentRev.value);
    refreshRevenueTab();
  });

  countryRev.addEventListener('change', function () {
    refreshRevenueTab();
  });

  continentComp.addEventListener('change', function () {
    populateCountrySelect(countryComp, continentComp.value);
    refreshSkillsTab();
  });

  countryComp.addEventListener('change', function () {
    refreshSkillsTab();
  });

  expComp.addEventListener('change', function () {
    refreshSkillsTab();
  });

  continentTech.addEventListener('change', function () {
    populateDevTypeSelect(devTypeTech, continentTech.value);
    refreshTechTab();
  });

  devTypeTech.addEventListener('change', function () {
    refreshTechTab();
  });

  topNTech.addEventListener('change', function () {
    refreshTechTab();
  });
}

function loadData(callback) {
  $.when(
    $.getJSON('data/NA.json'),
    $.getJSON('data/WE.json')
  ).done(function (naRes, weRes) {
    var na = naRes[0];
    var we = weRes[0];

    console.log('Données NA chargées : ', na.length);
    console.log('Données WE chargées : ', we.length);

    setRawData(na, we);

    if (typeof callback === 'function') {
      callback();
    }
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log('Erreur lors du chargement des JSON : ', textStatus, errorThrown);
    alert('Erreur de chargement des données (voir console).');
  });
}

$(document).ready(function () {
  initCharts();
  loadData(function () {
    initTabs();
    initFilters();

    refreshRevenueTab();
    refreshSkillsTab();
    refreshTechTab();
  });
});
