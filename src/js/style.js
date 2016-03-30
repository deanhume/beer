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
  var style = body.data[styleId];
  var result = "<p>" + style.name +  "</p><br>" + style.description + "<br><hr> ";

  // Fetch the associated beers
  var beers = "";
  var styleUrl = './data/beers-style-' + styleId  + '.json';
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
    }

    result += beers;
    document.body.innerHTML = result;
  });
});
