// Get the details from the querystring
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase(); // This is just to avoid case sensitiveness
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Create the hero text from the style name
function createHeroText(beerName){
  var styleHeroName = '<div class="mdl-grid style_name">{{beerName}}</div>';
  return styleHeroName.replace('{{beerName}}', beerName);
}

var styleUrl = getParameterByName('styleurl');
var beerId = getParameterByName('id');

// Fetch the beer styles
fetch(styleUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

    var beer = body.data[beerId]; console.log(beer);
    var htmlDocument = document;

    // Append the style name in the hero image
    var beerHeroElement = htmlDocument.getElementById('beerName');
    beerHeroElement.innerHTML += createHeroText(beer.nameDisplay);

    // Update the beer description
    var beerDescription = htmlDocument.getElementById('beer-description');
    beerDescription.innerHTML = beer.description;

    // Update the beer image
    if (beer.labels)
    {
      var beerImage = htmlDocument.getElementById('beer-image');
      beerImage.setAttribute("style", "background: url('" + beer.labels.large + "') center / cover; ");
    }
});
