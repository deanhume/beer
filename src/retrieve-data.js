var express = require('express');
var path = require('path');
var request = require('request');
var fs = require('fs');

// The app
var app = express();

app.use("/data", express.static(__dirname + '/data'));

// Fetch the contents of each pageId
function writeToDisk(theUrl, style, pageId){
  request(theUrl, function (errorDetails, responseDetails, bodyDetails) {
    if (!errorDetails && responseDetails.statusCode == 200) {
      var fileName = './data/beers-style-' + style + '-page-' + pageId + '.json';
      console.log('fileName', fileName);

      // Write the body to file
      fs.writeFile(fileName, bodyDetails);
    }
  });
}

// Get the home page
app.get('/', function (req, res) {
// Loop through each style
for(var styleId = 1; styleId <= 1; styleId++) {
  var newBeerUrl = 'http://api.brewerydb.com/v2/beers?styleId=' + styleId + '&key=4f01238618e344bee9537ae5f5bb74cf&withBreweries=Y';
  console.log('Hitting this style Url:', newBeerUrl);

  request(newBeerUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var beers = JSON.parse(body);
      var totalPages = beers.numberOfPages;

      // Loop through and get the beers per style
      for(var pages = 1; pages <= totalPages; pages++) {
        console.log('Looping through pages - on index:', pages);

        // Because we are zero based index
        var pagedBeerUrl = newBeerUrl + '&p=' + pages;
        writeToDisk(pagedBeerUrl, styleId, pages);
      }
    }
    else{
        console.log('Hit the limit for today');
    }
  });
  }
});

// Open the server
var server = app.listen(8019, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
