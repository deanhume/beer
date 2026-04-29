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
function createHeroText(styleName){
  var styleHeroName = '<h1 class="hero-heading hero-heading-small">{{styleName}}</h1>';
  return styleHeroName.replace('{{styleName}}', styleName);
}

// Get the url of the data
function createStyleUrl(styleId, pageId, includeRelative)
{
  var styleUrl = '/data/beers-style-';

  // Add the styleId
  styleUrl += styleId;

  // Add the pageId
  if (pageId < 1){ pageId = 1; }
  styleUrl += '-page-' + pageId + '.json';



  if (includeRelative){
    return '.' + styleUrl;
  }
  else{
    return styleUrl;
  }
}

var styleId = getParameterByName('id');
var pageId = getParameterByName('pageId');

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

function createPaging(numberOfPages, currentPage, styleId)
{
  var result = "";

  // Get the number of pages to cycle through
  if ((numberOfPages > 1) && (currentPage < numberOfPages))
  {
    var pagingHtml = "<div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--4-col\"></div><div class=\"mdl-cell mdl-cell--4-col\">{{previousButton}}<a style=\"float:right;\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" href='./style.html?id={{styleId}}&pageId={{page}}'>Next Page</a></div><div class=\"mdl-cell mdl-cell--4-col\"></div>";

    var page = currentPage + 1;
    pagingHtml = pagingHtml.replace('{{styleId}}', styleId);
    pagingHtml = pagingHtml.replace('{{page}}', page);

    result += pagingHtml;
  }

  // Do we need a back button?
  if ((numberOfPages > 1) && currentPage > 1){
    result = result.replace('{{previousButton}}', "<a style=\"float:left;\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" href='./style.html?id={{styleId}}&pageId={{previousPage}}'>Previous Page</a><div></div>");

    var previousPage = currentPage - 1;
    result = result.replace('{{styleId}}', styleId);
    result = result.replace('{{previousPage}}', previousPage);
  }
  else{
    result = result.replace('{{previousButton}}', ''); // Do nothing
  }

  return result;
}

// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var style = body.data[styleId - 1];
  
  // Append the style name in the hero image
  var styleHeroElement = document.getElementById('styleName');
  styleHeroElement.innerHTML += createHeroText(style.name);

  // Append the description
  var styleHeroDescription = document.getElementById('styleDescription');
  styleHeroDescription.innerHTML += style.description;

  // Update the page title
  document.title = "Progressive Beer - " + style.name;

  // Get the url of our beer styles
  var styleUrl = createStyleUrl(styleId, pageId, true);

    console.log(styleUrl);

  // Fetch the associated beers
  var innerCardDetails = "";
  var innerCount = 1;
  var result = '';
  fetch(styleUrl)
  .then(function(response) {
    return response.json();
  }).then(function(body) {
    // Loop through the results
    for(var i = 0; i < body.data.length; i++) {
      var beer = body.data[i];

      // We only want verified beers
      if(beer.status == 'verified' && beer)
      {
        // Simplified card structure for CSS Grid
        var cardDetails = '<div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand {{srmClass}}" style="{{beerimage}}">{{statsbadges}}{{beerGlass}}<h2 class="mdl-card__title-text">{{beername}}</h2></div><div class="mdl-card__supporting-text truncate">{{beerdescription}}</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="{{beerlink}}">Learn more</a></div></div>';
        cardDetails = cardDetails.replace('{{beername}}', beer.name);

        var beerDescription = beer.description;
        if (!beerDescription){ beerDescription = ""; } // Check if we have a value
        cardDetails = cardDetails.replace('{{beerdescription}}', beerDescription);

        cardDetails = cardDetails.replace('{{beerlink}}', "./beer.html?id=" + i + "&styleId=" + styleId+ "&pageId=" + pageId);

          // Use SRM gradient based on beer's SRM value
          var srmClass = '';
          var glassColor = 'pale';
          var srmValue = beer.style ? (beer.style.srmMax || beer.style.srmMin) : null;
          
          if (srmValue) {
            if (srmValue < 10) {
              srmClass = 'palebeer';
              glassColor = 'pale';
            } else if (srmValue >= 10 && srmValue < 20) {
              srmClass = 'amberbeer';
              glassColor = 'amber';
            } else {
              srmClass = 'darkbeer';
              glassColor = 'dark';
            }
          } else {
            srmClass = 'palebeer';
            glassColor = 'pale';
          }
          
          cardDetails = cardDetails.replace('{{beerimage}}', 'height:300px;');
          cardDetails = cardDetails.replace('{{srmClass}}', srmClass);

        // Add stat badges
        var statBadges = '<div class="beer-stats">';
        if (beer.abv) {
          statBadges += '<div class="stat-badge"><i class="material-icons">whatshot</i><span class="stat-value">' + beer.abv + '%</span> ABV</div>';
        }
        if (beer.ibu) {
          statBadges += '<div class="stat-badge"><i class="material-icons">local_florist</i><span class="stat-value">' + beer.ibu + '</span> IBU</div>';
        }
        statBadges += '</div>';
        cardDetails = cardDetails.replace('{{statsbadges}}', statBadges);

        // Add beer glass indicator
        var beerGlass = '<div class="beer-glass-indicator"><div class="beer-glass"><div class="glass-fill ' + glassColor + '"><div class="glass-foam"></div></div><div class="glass-outline"></div></div></div>';
        cardDetails = cardDetails.replace('{{beerGlass}}', beerGlass);

        // Add card directly to result (CSS Grid handles layout)
        result += cardDetails;
        innerCount++;
      }
    }

    // Add paging if necessary
    result += createPaging(body.numberOfPages, body.currentPage, styleId);

    // Show offline
    setTimeout(showOfflineNotification, 2000);

    document.getElementById("main").innerHTML = result;
    document.getElementById("loading-button").style.display = 'none';
  });
});