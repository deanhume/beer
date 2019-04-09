function showOfflineNotification() {
  if ('serviceWorker' in navigator) {
    // Open the cache and check if we have this page saved
    caches.open('beer-data').then(function (cache) {
      const urlToCheck = 'https://z2s71hp3o9.execute-api.us-east-1.amazonaws.com/default/styles';
      cache.match(urlToCheck)
        .then(function (response) {
          if (response == undefined) { return; } // return if we found nothing
          // We found the resource in cache
          if (response.ok && localStorage.getItem(urlToCheck) === null) {
            var snackbarContainer = document.querySelector('#offline-notification');
            var data = { message: 'This page is now available offline' };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);

            // Save the message into storage
            localStorage.setItem(urlToCheck, true);
          }
        });
    });
  }
}
/**
 * Fetch the beer styles
 */
async function init(){
  const stylesResult = await fetch('https://z2s71hp3o9.execute-api.us-east-1.amazonaws.com/default/styles');
  const result = await stylesResult.text();

  // Paint the page
  document.getElementById("main").innerHTML = result + document.getElementById("main").innerHTML;
  document.getElementById("loading-button").style.display = 'none';

  // Show offline
  setTimeout(showOfflineNotification, 2000);

  // Search filter
  var options = {
    valueNames: ['name']
  };

  var styleList = new List('styles', options);
}

init();


