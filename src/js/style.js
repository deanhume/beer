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
  var beers = "";
  fetch(styleUrl)
  .then(function(response) {
    return response.json();
  }).then(function(body) {
      // Loop through the results
      for(var i = 0; i < body.data.length; i++) {
        var beer = body.data[i];
          beers += "<p>" + beer.name + "</p>";
          // Display the label if we have one
          if (beer.labels)
          {
            beers += "<img src='" + beer.labels.large + "' />";
          }

          // Add a link to the brewery
    }
    result += beers;

    // Get the number of pages to cycle through
    if ((body.numberOfPages > 1) && (body.currentPage < body.numberOfPages))
    {
      const currentPage = body.currentPage + 1;
      result += "<a href='/style.html?id=" + styleId + "&page=" + currentPage + "'>Next Page</a><br>";
    }

    document.body.innerHTML = result;
  });
});
