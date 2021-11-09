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
const formData = {};

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
      let html = `<option value=""></option>`;
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
    $.ajax({ type: "POST", url: "http://example.com/form.php", data: formData, dataType: 'json',
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