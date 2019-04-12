const styleId = getParameterByName('id');
const pageId = getParameterByName('pageId');

/**
 * Get the details from the querystring
 * @param {string} name 
 * @param {string} url 
 */
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  url = url.toLowerCase(); // This is just to avoid case sensitiveness
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Creates a URL that points to the correct style path
 * @param {number} styleId 
 * @param {number} pageId 
 * @param {boolean} includeRelative 
 */
function createStyleUrl(styleId, pageId, includeRelative) {
  var styleUrl = '/data/beers-style-';

  // Add the styleId
  styleUrl += styleId;

  // Add the pageId
  if (pageId < 1) { pageId = 1; }
  styleUrl += '-page-' + pageId + '.json';

  if (includeRelative) {
    return '.' + styleUrl;
  }
  else {
    return styleUrl;
  }
}

/**
 * Shows an Offline notification if we have this page saved in cache
 */
function showOfflineNotification() {
  if ('serviceWorker' in navigator) {
    // Open the cache and check if we have this page saved
    caches.open('beer-data').then(function (cache) {
      let urlToCheck = 'https://deanhume.github.io/beer' + createStyleUrl(styleId, pageId, false);
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
 * Create the hero text from the style name
 * @param {string} styleName 
 */
function createHeroText(styleName) {
  let styleHeroName = '<div class="mdl-grid style_name style_hero_text">{{styleName}}</div>';
  return styleHeroName.replace('{{styleName}}', styleName);
}

/**
 * Build up the details of the page
 */
async function buildPageTitles() {
  // Fetch the style details for this beer
  let url = createStyleUrl(styleId, pageId, true);
  const result = await fetch(url);
  const body = await result.json();

  // Select the current style
  let style = body.data[styleId - 1];

  // Append the style name in the hero image
  let styleHeroElement = document.getElementById('styleName');
  styleHeroElement.innerHTML += createHeroText(style.name);

  // Append the description
  let styleHeroDescription = document.getElementById('styleDescription');
  styleHeroDescription.innerHTML += style.description;

  // Update the page title
  document.title = "Progressive Beer - " + style.name;
}

async function init() {

  let url = `https://z2s71hp3o9.execute-api.us-east-1.amazonaws.com/default/beer-styles?id=${styleId}&pageId=${pageId || 0}`;

  // Fetch the style details for this beer
  const stylesResult = await fetch(url);
  const result = await stylesResult.text();

  // Show offline
  setTimeout(showOfflineNotification, 2000);

  buildPageTitles();

  document.getElementById("main").innerHTML = result;
  document.getElementById("loading-button").style.display = 'none';
}

init();

