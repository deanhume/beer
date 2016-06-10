var express = require('express');
var path = require('path');
var request = require('request');
var fs = require('fs');

// The app
var app = express();

app.use("/data", express.static(__dirname + '/data'));

// Get the home page
app.get('/', function (req, res) {
  // The URL to fetch from
  var beerUrl = 'http://api.brewerydb.com/v2/beers?styleId={{styleId}}&key=4f01238618e344bee9537ae5f5bb74cf&';

  var fileName = './data/beers-style-{{styleId}}-page-{{pageId}}.json';

for(var i = 1; i < 171; i++) {
  var newBeerUrl = beerUrl.replace('{{styleId}}', i);

  request(newBeerUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var beers = JSON.parse(body);

      var numberOfPages = beers.numberOfPages;

      console.log('numberOfPages',numberOfPages);

      // Loop through and get the beers per style
      for(var x = 1; x < numberOfPages; x++) {

        var pagedBeerUrl = beerUrl + '&p=' + x;
        console.log('beerUrl', pagedBeerUrl);

        // Fetch the contents of each pageId
        request(pagedBeerUrl, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var fullBeerPage = JSON.parse(body);

            var newFileName = fileName.replace('{{styleId}}', i);
            newFileName = fileName.replace('{{pageId}}', x);

            console.log('fileName', newFileName);

            // Now fetch the beers based on the style
            fs.writeFile(newFileName, fullBeerPage);
          }
        });
      }
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
