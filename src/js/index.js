// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var result = "";
  // Loop through the results
  for(var i = 0; i < body.data.length; i++) {
    var style = body.data[i];
      //result += "<a href='/style.html?id=" + style.id + "'>" + style.name +  "</a><br>" + style.description + "<br><hr> ";

      // We want to keep a responsive grid in place
      if (i % 3)
      {
        
      }
      result += '<div class="mdl-grid"></div>';

      result += '<div class="mdl-cell mdl-cell--4-col"><div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand"><h2 class="mdl-card__title-text">Update</h2></div><div class="mdl-card__supporting-text">' + style.description + '</div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="/style.html?id="' + style.id + '">"' + style.name +  '"</a></div></div></div>';
}

  document.getElementById("main").innerHTML = result;
});
