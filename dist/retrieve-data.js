var express = require('express');
var path = require('path');
var request = require('sync-request');
var fs = require('fs');

// The app
var app = express();

app.use("/data", express.static(__dirname + '/data'));

// Get the home page
app.get('/', function (req, res) {
// Loop through each style
for(var styleId = 93; styleId <= 164; styleId++) {

  var newBeerUrl = 'http://api.brewerydb.com/v2/beers?styleId=' + styleId + '&key=4f01238618e344bee9537ae5f5bb74cf&withBreweries=Y';
  console.log('Hitting this style Url:', newBeerUrl);

  var styleResults = request('GET', newBeerUrl);
  var beers = JSON.parse(styleResults.getBody());
  var totalPages = beers.numberOfPages;

  // Loop through the results
  for(var pages = 1; pages <= totalPages; pages++) {
    console.log('Looping through pages - on index:', pages);

    // Because we are zero based index
    var pagedBeerUrl = newBeerUrl + '&p=' + pages;
    var beerResults = request('GET', pagedBeerUrl);

    var fileName = './data/beers-style-' + styleId + '-page-' + pages + '.json';
    console.log('Writing fileName:', fileName);

    // Write the body to file
    fs.writeFile(fileName, beerResults.getBody());
    }
  }

  res.send('Finished processing');
});

// Open the server
var server = app.listen(8019, function () {

	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
