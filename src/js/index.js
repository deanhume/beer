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
      var cardDetails = '<div class="mdl-cell mdl-cell--4-col"><div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand"><h2 class="mdl-card__title-text">Update</h2></div><div class="mdl-card__supporting-text">' + style.name + '</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/style.html?id=' + style.id + '">Find out more</a></div></div></div>';

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
