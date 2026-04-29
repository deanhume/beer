function showOfflineNotification() {
  if ('serviceWorker' in navigator) {
    // Open the cache and check if we have this page saved
    caches.open('beer-data').then(function(cache) {
      var urlToCheck = 'https://deanhume.github.io/beer/data/styles.json';
        cache.match(urlToCheck)
        .then(function(response) {
          if (response == undefined){ return; } // return if we found nothing
          // We found the resource in cache
          if (response.ok && localStorage.getItem(urlToCheck) === null) {
              var snackbarContainer = document.querySelector('#offline-notification');
              var data = {message: 'This page is now available offline'};
              snackbarContainer.MaterialSnackbar.showSnackbar(data);

              // Save the message into storage
              localStorage.setItem(urlToCheck, true);
          }
        });
    });
  }
}

// Fetch the beer styles
fetch('./data/styles.json')
.then(function(response) {
  return response.json();
}).then(function(body) {

  var result = "";
  
  // Loop through the results
  for(var i = 0; i < body.data.length; i++) {
    var style = body.data[i];
    var styleId = style.id;

    // Simplified card structure for CSS Grid
    var cardDetails = '<div class="demo-card-square mdl-card mdl-shadow--2dp"><div class="mdl-card__title mdl-card--expand {{beercolour}}"></div><div class="mdl-card__supporting-text"><h3 class="name">{{name}}</h3><p>{{description}}</p></div><div class="mdl-card__actions mdl-card--border"><a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" href="./style.html?id=' + styleId + '">Learn more</a></div></div>';

    // Beer colour is determined by SRM (http://www.twobeerdudes.com/beer/srm)
    if (style.srmMax < 10)
    {
      // pale
      cardDetails = cardDetails.replace('{{beercolour}}','palebeer');
    }
    else if (style.srmMax > 10 && style.srmMax < 20)
    {
      // amber
      cardDetails = cardDetails.replace('{{beercolour}}','amberbeer');
    }
    else if (style.srmMax > 20){
      // dark
      cardDetails = cardDetails.replace('{{beercolour}}','darkbeer');
    }
    else{
      cardDetails = cardDetails.replace('{{beercolour}}','palebeer');
    }

    cardDetails = cardDetails.replace('{{name}}', style.name);
    cardDetails = cardDetails.replace('{{description}}', style.description || 'Discover this unique beer style');

    // Add card directly to result (CSS Grid handles layout)
    result += cardDetails;
  }

  // Paint the page
  document.getElementById("main").innerHTML = result + document.getElementById("main").innerHTML;
  document.getElementById("loading-button").style.display = 'none';
  document.getElementById("skeleton-loader").style.display = 'none';

  // Show offline
  setTimeout(showOfflineNotification, 2000);

  // Search filter
  var options = {
    valueNames: [ 'name' ]
  };

  var styleList = new List('styles', options);

  // Filter chips functionality
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
      // Remove active class from all chips
      filterChips.forEach(c => c.classList.remove('active'));
      // Add active class to clicked chip
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      
      if (category === 'all') {
        styleList.filter(); // Clear all filters
      } else if (category === 'ipa') {
        // Special handling for IPAs - match "India Pale Ale" or "IPA"
        styleList.filter(function(item) {
          const name = item.values().name.toLowerCase();
          return name.includes('india pale ale') || name.includes('ipa');
        });
      } else {
        styleList.filter(function(item) {
          const name = item.values().name.toLowerCase();
          return name.includes(category);
        });
      }
    });
  });
});