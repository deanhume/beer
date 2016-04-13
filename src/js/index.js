// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var result = "";
  var innerCardDetails = "";
  var innerCount = 1;
  // Loop through the results
  for(var i = 0; i < body.data.length; i++) {
    var style = body.data[i];
      var cardDetails = '<div class="mdl-cell mdl-cell--4-col"><div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand {{beercolour}}"></div><div class="mdl-card__supporting-text">' + style.name + '</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/style.html?id=' + style.id + '">Find out more</a></div></div></div>';

      // Beer colour is determined by SRM (http://www.twobeerdudes.com/beer/srm)
      if (style.srmMax < 10)
      {
        // pale
        cardDetails = cardDetails.replace('{{beercolour}}','palebeer');
      }
      else if (style.srmMax > 10 && style.srmMax < 20)
      {
        // amber
        cardDetails = cardDetails.replace('{{beercolour}}','amberbeer');
      }
      else if (style.srmMax > 20){
        // dark
        cardDetails = cardDetails.replace('{{beercolour}}','darkbeer');
      }
      else{
        cardDetails = cardDetails.replace('{{beercolour}}','palebeer');
      }

      // We want to keep a responsive grid in place
      if (innerCount % 3 === 0)
      {
        cardDetails = '<div class="mdl-grid">' + innerCardDetails + cardDetails; //add the opening tag
        cardDetails = cardDetails + '</div>'; // closing tag
        result += cardDetails;
        innerCardDetails = ""; // reset the innercard details
      }
      else{
        innerCardDetails += cardDetails;
      }
      innerCount++;
}

  document.getElementById("main").innerHTML = result;
});
