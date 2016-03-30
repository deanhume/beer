// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var result = "";
  // Loop through the results
  for(var i = 0; i < body.data.length; i++) {
    var style = body.data[i];
      result += "<a href='/style.html?id=" + style.id + "'>" + style.name +  "</a><br>" + style.description + "<br><hr> ";
}

  document.body.innerHTML = result;
});
