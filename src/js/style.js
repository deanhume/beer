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
  var styleHeroName = '<div class="mdl-grid style_name">{{styleName}}</div>';
  return styleHeroName.replace('{{styleName}}', styleName);
}

function createPaging(numberOfPages, currentPage, styleId)
{
  var result = "";

  // Get the number of pages to cycle through
  if ((numberOfPages > 1) && (currentPage < numberOfPages))
  {
    var pagingHtml = "<div class=\"mdl-grid\"><div class=\"mdl-cell mdl-cell--4-col\"></div><div class=\"mdl-cell mdl-cell--4-col\">{{previousButton}}<a style=\"float:right;\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" href='/style.html?id={{styleId}}&page={{page}}'>Next Page</a></div><div class=\"mdl-cell mdl-cell--4-col\"></div>";

    var page = currentPage + 1;
    pagingHtml = pagingHtml.replace('{{styleId}}', styleId);
    pagingHtml = pagingHtml.replace('{{page}}', page);

    result += pagingHtml;
  }

  // Do we need a back button?
  if ((numberOfPages > 1) && currentPage > 1){
    result = result.replace('{{previousButton}}', "<a style=\"float:left;\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\" href='/style.html?id={{styleId}}&page={{previousPage}}'>Previous Page</a><div></div>");

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

  var styleId = getParameterByName('id');
  var pageId = getParameterByName('page');
  var style = body.data[styleId];
  var result = "<div class='mdl-grid'>" + style.description + "</div>";

  // Append the style name in the hero image
  var styleHeroElement = document.getElementById('styleName');
  styleHeroElement.innerHTML += createHeroText(style.name);

  // Check if we are being page
  var styleUrl = './data/beers-style-' + styleId;
  if (pageId > 1){
    styleUrl += '-page-' + pageId + '.json';
  }
  else{
    styleUrl += '-page-' + 1 + '.json';
  }

  // Fetch the associated beers
  var innerCardDetails = "";
  var innerCount = 1;
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
        var cardDetails = '<div class="mdl-cell mdl-cell--4-col"><div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand" style="{{beerimage}}"><h2 class="mdl-card__title-text">{{beername}}</h2></div><div class="mdl-card__supporting-text">{{beerdescription}}</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="{{beerlink}}">Find out more</a></div></div></div>';
        cardDetails = cardDetails.replace('{{beername}}', beer.name);

        var beerDescription = beer.description;
        if (!beerDescription){ beerDescription = ""; } // Check if we have a value
        cardDetails = cardDetails.replace('{{beerdescription}}', beerDescription);

        cardDetails = cardDetails.replace('{{beerlink}}', "/beer.html?id=" + i + "&styleurl=" + styleUrl);

        // Display the label if we have one
        if (beer.labels)
        {
          cardDetails = cardDetails.replace('{{beerimage}}', "background: url('" + beer.labels.large + "') center / cover; height:300px;");
        }
        else{
          cardDetails = cardDetails.replace('{{beerimage}}', "background: url('/images/srm/light.jpg') center / cover; height:300px;");
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
    }

    // Add paging if necessary
    result += createPaging(body.numberOfPages, body.currentPage, styleId);

    document.getElementById("main").innerHTML = result;
  });
});
