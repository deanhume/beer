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

    // Add the details
    // TODO: Not too happy about this large chunk of HTML!
     var detailsTemplate = "<section class=\"section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp\" style=\"margin-top: 50px;margin-bottom: 50px;width: 60%;\"> \
      <div class=\"mdl-card mdl-cell mdl-cell--12-col\"> \
        <div class=\"mdl-card__supporting-text mdl-grid mdl-grid--no-spacing\" style=\"padding-bottom: 30px;\"> \
        <h4 class=\"mdl-cell mdl-cell--12-col\" style=\"padding-top: 20px;\">Details</h4> \
          <div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"> \
            <i class=\"material-icons orange600\">show_chart</i> \
          </div> \
          <div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"> \
            <h5>International Bitterness Units scale</h5> \
            {{ibu}} \
          </div> \
          <div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"> \
            <i class=\"material-icons orange600\">opacity</i> \
          </div> \
          <div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"> \
            <h5>Alcohol by Volume</h5> \
            {{abvMin}} to {{abvMax}} \
          </div> \
          <div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"> \
             <i class=\"material-icons orange600\">checkbox</i> \
          </div> \
          <div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"> \
            <h5>Final Gravity</h5> \
            {{fgMin}} to {{fgMax}} \
          </div> \
          <div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"> \
             <i class=\"material-icons orange600\">palette</i> \
          </div> \
          <div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"> \
            <h5>Standard Reference Method</h5> \
            {{srmMin}} to {{srmMax}} \
          </div> \
        </div> \
      </div> \
    </section>";

    // Update the template
    var beerDetails = htmlDocument.getElementById('details');
    
    detailsTemplate = detailsTemplate.replace('{{ibu}}', beer.ibu);
    detailsTemplate = detailsTemplate.replace('{{abvMin}}', beer.style.abvMin);
    detailsTemplate = detailsTemplate.replace('{{abvMax}}', beer.style.abvMax);
    detailsTemplate = detailsTemplate.replace('{{fgMin}}', beer.style.fgMin);
    detailsTemplate = detailsTemplate.replace('{{fgMax}}', beer.style.fgMax);
    detailsTemplate = detailsTemplate.replace('{{srmMin}}', beer.style.srmMin);
    detailsTemplate = detailsTemplate.replace('{{srmMax}}', beer.style.srmMax);

    beerDetails.innerHTML = detailsTemplate;

    // Kill the loading icon
    htmlDocument.getElementById('loading-button').style.display = "none";
});
