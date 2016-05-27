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

var styleUrl = getParameterByName('styleurl');
var beerId = getParameterByName('id');

// Fetch the beer styles
fetch(styleUrl)
.then(function(response) {
  return response.json();
}).then(function(body) {

    var beer = body.data[beerId];
    console.log(beer);

    // Build up the contents to return
    
});
