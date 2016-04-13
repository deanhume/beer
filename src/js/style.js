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

// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var styleId = getParameterByName('id');
  var pageId = getParameterByName('page');
  var style = body.data[styleId];
  var result = "<p>" + style.name +  "</p><br>" + style.description + "<br><hr> ";

  // Check if we are being page
  var styleUrl = './data/beers-style-' + styleId;
  if (pageId > 0){
    styleUrl += '-page-' + pageId + '.json';
  }
  else{
    styleUrl += '.json';
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

        var cardDetails = '<div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand" style="{{beerimage}}"><h2 class="mdl-card__title-text">{{beername}}</h2></div><div class="mdl-card__supporting-text">{{beerdescription}}</div><div class="mdl-card__actions mdl-card--border"></div></div>';
        cardDetails = cardDetails.replace('{{beername}}', beer.name);
        cardDetails = cardDetails.replace('{{beerdescription}}', beer.description);

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

    // Get the number of pages to cycle through
    if ((body.numberOfPages > 1) && (body.currentPage < body.numberOfPages))
    {
      var currentPage = body.currentPage + 1;
      result += "<a href='/style.html?id=" + styleId + "&page=" + currentPage + "'>Next Page</a><br>";
    }

    document.getElementById("main").innerHTML = result;
  });
});
