const baseUrl = 'https://cars-api.zenithassurance.net/src/public/';
const carAPIURLs = {
  year: '', 
  marque: 'cars/marques', 
  model: 'cars/marque/models', 
  alimentation: 'cars/marque/model/alimentations', 
  chevaux: 'cars/marque/model/alimentation/chevaux', 
  carrosserie:  'cars/marque/model/alimentation/chevaux/carrosseries',
  version:  'cars/marque/model/alimentation/chevaux/carrosserie/versions',
};

$(function() {
  const ids = Object.keys(carAPIURLs);
  
  for (let index = 0; index < ids.length - 1; index++) {
    let id = ids[index];
    let _id = ids[index] === 'year' ? 'dateMEC' : ids[index];
    const nextId = ids[index + 1];
    
    $('#' + _id).on('change', function(e) {
      for (let i = index + 1; i < ids.length; i++) {
        $('#' + ids[i]).html('');
        $('#' + ids[i]).prop('disabled', true);
      }
      
      if (e.target.value === '')
        return;
      
      const parent = $('#' + nextId).parent();
      parent.append(`
        <div id='spinner' class="text-center">
          <div class="spinner-border" role="status" style="color:#3029d5">
            <span style ="background:red"class="visually-hidden">Loading...</span>
          </div>
        </div>
      `)
      $('#' + nextId).hide();

      
      let params = '?';
      for (let j = 0; j <= index; j++) {
        const __id = ids[j] === 'year' ? 'dateMEC' :ids[j];
        const __val = $('#' + __id).val();
        const _val = ids[j] === 'year' ? __val.split('-')[0] : __val;
        params += (j > 0 ? '&' : '') + ids[j] + '=' + _val;     
      }
      
      const res = $.ajax({ 
        type: "GET",
        dataType: 'json',
        url: baseUrl + carAPIURLs[ids[index + 1]] + params, 
        async: false,
      }).responseText;
    
      $('#spinner').remove();
    
      const jsonRes = JSON.parse(res);
      let html = `<option value="">Veuillez sélectionner</option>`;
      if (id === 'year') {
        optionsValues = jsonRes.marquesPopular.map(x => x.marque).sort();
        for (const optionsValue of optionsValues)
        html += `<option value="${optionsValue}">${capitalize(optionsValue)}</option>`;
        
        html += '<option disabled>---------------------------------</option>'
        
        optionsValues = jsonRes.marquesNotPopular.map(x => x.marque).sort();
        for (const optionsValue of optionsValues)
          html += `<option value="${optionsValue}">${capitalize(optionsValue)}</option>`;
      } else {
        const routeArray = carAPIURLs[ids[index + 1]].split('/');
        const plural = routeArray[routeArray.length - 1];
        optionsValues = [...jsonRes[plural].map(x => x[ids[index + 1]])].sort();
        // if (optionsValues.length === 1)
        //  html = '';
        for (const optionsValue of optionsValues)
          html += `<option value="${optionsValue}">${isNaN(optionsValue) ? capitalize(optionsValue) : optionsValue}</option>`;
      }


      $('#' + nextId).html(html);
      $('#' + nextId).prop('disabled', false);
      $('#' + nextId).show();
    })
  }

  $('#form input:radio').on('change', function(e) {
    if (e.target.id === e.target.name + 'Oui')
      $(`#form div[name=${e.target.name}]`).css('display', 'block');
    else
      $(`#form div[name=${e.target.name}]`).css('display', 'none');
  })
    
  $('#submit').on('click', function() {
    $.ajax({ type: "POST", url: "https://assurancezenith.com:99/devis-api/v2/src/public/auto", data: getFormData(), dataType: 'json',
      success: function(data) { console.log("success", data); },
      error: function(error) { console.log("error", error); }
    })
  })
})

function capitalize(input) {
  var words = input.split(' ');
  var capitalizedWords = [];
  words.forEach(element => {
    capitalizedWords.push(element.charAt(0).toUpperCase() + element.slice(1, element.length));
  });
  return capitalizedWords.join(' ');
}

const datesSinistres = [...$('[name=dateSinistre36DerniersMois').map(function () { return $(this).val() })];
const naturesSinistres = [...$('[name=natureSinistre36DerniersMois').map(function () { return $(this).val() })];

const sinistres = datesSinistres.map((date, i) => ({
  dateSinistre36DerniersMois: date,
  natureSinistre36DerniersMois: naturesSinistres[i],
}))

function getFormData() {
  return {
    vehicule: {
      yearDateMEC: $('#dateMEC').val().split('-')[0],
      dateMEC: $('#dateMEC').val(),
      marque: $('#marque').val(),
      model: $('#model').val(),
      alimentation: $('#alimentation').val(),
      chevaux: $('#chevaux').val(),
      carrosserie: $('#carrosserie').val(),
      version: $('#version').val(),
      stationnement: $('#stationnement').val(),
      usage: $('#usage').val(),
    },
    conducteurPrincipal: {
      antecedents: {
        isEteAssure36DerniersMois: $('#isEteAssure36DerniersMois').val(),
        bonusMalus: $('#bonusMalus').val().split(' ')[0],
        isEteResilie36DerniersMois: $('#isEteResilie36DerniersMois').val(),
        motifResiliation36DerniersMois: $('#motifResiliation36DerniersMois').val(),
        dateResiliation36DerniersMois: $('#dateResiliation36DerniersMois').val(),
        isEuSinistres36DerniersMois: $('#isEuSinistres36DerniersMois').val(),
        sinistres36DerniersMois: (() => {
          const datesSinistres = [...$('[name=dateSinistre36DerniersMois').map(function () { return $(this).val() })];
          const naturesSinistres = [...$('[name=natureSinistre36DerniersMois').map(function () { return $(this).val() })];
      
          return datesSinistres.map((date, i) => ({
            dateSinistre36DerniersMois: date,
            natureSinistre36DerniersMois: naturesSinistres[i],
          }))
        })(),
        // alcoolemie: { 
        // 	sanction: {
        // 		dateInitialPermisApresAnnulation: "2020-11-1",
        // 		dateAnnulationPermis36DerniersMois: "2020-11-1",
        // 		dateSanction36DerniersMois: "2020-11-1",
        // 		dateSuspensionPermis36DerniersMois: "2020-11-1",
        // 		dateInfraction36DerniersMois: "2020-11-1",
        // 		typeSuspensionPermis36DerniersMois: "Suspension permis",
        // 		typeSanction: "Suspension permis",
        // 		suspensionPermisMotif36DerniersMois: "Alcoolemie",
        // 		nombreSuspensionPermis36AvecSinistreDerniersMois: 1,
        // 		nombreSuspensionPermis36SansSinistreDerniersMois: 2,
        // 		nombreMoisSuspensionPermis36DerniersMois: 6
        // 	},
        // 	dateDernierAlcoolemie36DerniersMois: "2020-11-1",
        // 	nombreControlesPositifsAlcoolemie36DerniersMois: 1,
        // 	isRefusTestAlcoolemie36DerniersMois: "Non",
        // 	isDelitDeFuiteAlcoolemie36DerniersMois: "Oui",
        // 	controleAlcoolemieSuiteA36DerniersMois: "Controle routier",
        // 	controleAlcoolemieMethode36DerniersMois: "prise de sang",
        // 	tauxAlcoolemie: "2.0",
        // 	isAnnulationOuSuspensionPermis36DerniersMois: "suspension_permis"
        // },
        // stupefiant: {
        // 	sanction: {
        // 		typeAnnulationPermis36DerniersMois: "Annulation permis",
        // 		typeSanction: "Annulation permis",
        // 		annulationPermisMotif36DerniersMois: "Stupefiant",
        // 		annulationPermisAvecOuSansSinistre36DerniersMois: "Sans sinistre"
        // 	},
        // 	dateDernierStupefiant36DerniersMois: "2020-11-1",
        // 	nombreControlesPositifsStupefiants36DerniersMois: 1,
        // 	isRefusTestStupefiant36DerniersMois: "Non",
        // 	isDelitDeFuiteStupefiant36DerniersMois: "Non",
        // 	controleStupefiantSuiteA36DerniersMois: "Controle routier",
        // 	controleStupefiantMethode36DerniersMois: "prise de sang",
        // 	isAnnulationOuSuspensionPermis36DerniersMois: "annulation_permis"
        // }
      },
      dateNaissance: $('#dateNaissance').val(),
      datePermis: $('#datePermis').val(),
      civilite: $('#civilite').val(),
      nom: $('#nom').val(),
      prenom: $('#prenom').val(),
      situationFamiliale: $('#situationFamiliale').val(),
      adresse: $('#adresse').val(),
      codePostal: $('#codePostal').val(),
      ville: $('#ville').val(),
      tel: $('#tel').val(),
      email: $('#email').val()
    },
    urlSource: "https://zassauto.github.io/Auto-V1.2/form.html", 
    deviceType: "D", 
    titulaireCarteGrise: "Conducteur Principal", 
    garantieSouhaiteeConducteurPrincipal: $('#garantieSouhaiteeConducteurPrincipal').val(), 
    isAjouterConducteurSecondaire: "Non" 
  }
}
