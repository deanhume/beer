// Get the details from the querystring
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase();
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
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

function createHeroStyleText(tagline){
  var heroStyleName = '<div class="mdl-grid styleTagline tagline-padding">{{tagline}}</div>';
  return heroStyleName.replace('{{tagline}}', tagline);
}

// Sometimes the API returns empty results
function cleanUnknownText(text){
  if (text != undefined){
    return text;
  }
  else{
    return 'N/A';
  }
}

// Get the url of the data
function createStyleUrl(styleId, pageId, includeRelative)
{
  var styleUrl = '/data/beers-style-' + styleId;
  if (pageId > 1){
    styleUrl += '-page-' + pageId + '.json';
  }
  else{
    styleUrl += '-page-' + 1 + '.json';
  }

  if (includeRelative){
    return '.' + styleUrl;
  }
  else{
    return styleUrl;
  }
}

var styleId = getParameterByName('styleId');
var pageId = getParameterByName('pageId');
var beerId = getParameterByName('id');

function showOfflineNotification() {
  if ('serviceWorker' in navigator) {
    // Open the cache and check if we have this page saved
    caches.open('beer-data').then(function(cache) {
      var urlToCheck = 'https://deanhume.github.io/beer' + createStyleUrl(styleId, pageId, false);
        cache.match(urlToCheck)
        .then(function(response) {
          if (response == undefined){ return; } // return if we found nothing
          // We found the resource in cache
          if (response.ok && localStorage.getItem(urlToCheck) === null) {
              var snackbarContainer = document.querySelector('#offline-notification');
              var data = {message: 'This page is now available offline'};
              snackbarContainer.MaterialSnackbar.showSnackbar(data);

              // Save the message into storage
              localStorage.setItem(urlToCheck, true);
          }
        });
    });
  }
}

var styleUrl = createStyleUrl(styleId, pageId, true);

// Fetch the beer styles
fetch(styleUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

    var beer = body.data[beerId];
    var htmlDocument = document;

    // Append the style name in the hero image
    var beerHeroElement = htmlDocument.getElementById('beerName');
    beerHeroElement.innerHTML += createHeroText(beer.nameDisplay);

    // Append the tagline name in the hero images
    var styleHeroElement = htmlDocument.getElementById('tagline');
    styleHeroElement.innerHTML += createHeroStyleText(beer.style.shortName);

    // Update the beer description
    var beerDescription = htmlDocument.getElementById('beer-description');
    beerDescription.innerHTML = cleanUnknownText(beer.description);

    // Update the page title
    document.title = "Progressive Beer - " + beer.style.shortName;

    // Update the beer image
    if (beer.labels)
    {
      var beerImage = htmlDocument.getElementById('beer-image');
      beerImage.setAttribute("style", "background: url('" + beer.labels.large + "') center / cover; ");
    }

    // Add the details
    // Not too happy about this large chunk of HTML!
     var detailsTemplate = "<section class=\"section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp\" style=\"margin-top: 50px;margin-bottom: 50px;width: 60%;\"><div class=\"mdl-card mdl-cell mdl-cell--12-col\"><div class=\"mdl-card__supporting-text mdl-grid mdl-grid--no-spacing\" style=\"padding-bottom: 30px;\"><h4 class=\"mdl-cell mdl-cell--12-col\" style=\"padding-top: 20px;\">Details</h4><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\">show_chart</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>International Bitterness Units scale</h5>{{ibu}}</div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\">opacity</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Alcohol by Volume</h5>{{abvMin}} to {{abvMax}}</div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\">checkbox</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Final Gravity</h5>{{fgMin}} to {{fgMax}}</div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\">palette</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Standard Reference Method</h5>{{srmMin}} to {{srmMax}}</div></div></div></section>";

    // Update the template
    var beerDetails = htmlDocument.getElementById('details');

    detailsTemplate = detailsTemplate.replace('{{ibu}}', cleanUnknownText(beer.ibu));
    detailsTemplate = detailsTemplate.replace('{{abvMin}}', cleanUnknownText(beer.style.abvMin));
    detailsTemplate = detailsTemplate.replace('{{abvMax}}', cleanUnknownText(beer.style.abvMax));
    detailsTemplate = detailsTemplate.replace('{{fgMin}}', cleanUnknownText(beer.style.fgMin));
    detailsTemplate = detailsTemplate.replace('{{fgMax}}', cleanUnknownText(beer.style.fgMax));
    detailsTemplate = detailsTemplate.replace('{{srmMin}}', cleanUnknownText(beer.style.srmMin));
    detailsTemplate = detailsTemplate.replace('{{srmMax}}', cleanUnknownText(beer.style.srmMax));

    beerDetails.innerHTML = detailsTemplate;

    // The Brewery details
    var breweryTemplate = "<section class=\"section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp\" style=\"margin-top: 50px;margin-bottom: 50px;width: 60%;\"><div class=\"mdl-card mdl-cell mdl-cell--12-col\"><div class=\"mdl-card__supporting-text mdl-grid mdl-grid--no-spacing\" style=\"padding-bottom: 30px;\"><h4 class=\"mdl-cell mdl-cell--12-col\" style=\"padding-top: 20px;\">Brewery Info</h4><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\" style=\"padding-top: 20px;\">local_drink</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Brewery Name</h5>{{name}}</div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\" style=\"padding-top: 20px;\">help</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>About</h5>{{description}}</div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\" style=\"padding-top: 20px;\">http</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Website</h5><a href=\"{{website}}\">{{{website}}}</a></div><div class=\"section__circle-container mdl-cell mdl-cell--2-col mdl-cell--1-col-phone\"><i class=\"material-icons orange600\" style=\"padding-top: 10px;\">cake</i></div><div class=\"section__text mdl-cell mdl-cell--10-col-desktop mdl-cell--6-col-tablet mdl-cell--3-col-phone\"><h5>Established</h5>{{established}}</div></div></div></section>";

   // Update the template
   var breweryDetails = htmlDocument.getElementById('breweryDetails');

   breweryTemplate = breweryTemplate.replace('{{name}}', cleanUnknownText(beer.breweries[0].name));
   breweryTemplate = breweryTemplate.replace('{{description}}', cleanUnknownText(beer.breweries[0].description));
   breweryTemplate = breweryTemplate.replace('{{website}}', cleanUnknownText(beer.breweries[0].website));
   breweryTemplate = breweryTemplate.replace('{{{website}}}', cleanUnknownText(beer.breweries[0].website));
   breweryTemplate = breweryTemplate.replace('{{established}}', cleanUnknownText(beer.breweries[0].established));

   breweryDetails.innerHTML = breweryTemplate;

   // Set the back link
   var backlink = htmlDocument.getElementById('backlink');
   backlink.href = "./style.html?id=" + styleId + "&pageId=" + pageId;

  // Kill the loading icon
  htmlDocument.getElementById('loading-button').style.display = "none";

  setTimeout(showOfflineNotification, 2000);
});
