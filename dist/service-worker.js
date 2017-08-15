(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('./bower_components/sw-toolbox/sw-toolbox.js');

  // Load the Offline Google Analytics library
  importScripts('./js/offline-google-analytics-import.js');
  goog.offlineGoogleAnalytics.initialize();

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = false;

  // We want to precache the following items
  toolbox.precache([ './index.html',
                     './about.html',
                     './style.html',
                     './settings.html',
                     './beer.html']);

  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'googleapis'
    },
    origin: /\.googleapis\.com$/,
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'fonts'
    },
    origin: /\.gstatic\.com$/,
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/beer/css/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-stylesheets'
    },
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/beer/images/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-images'
    },
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/beer/js/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-javascript'
    },
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-images-amazon'
    },
    origin: /\.amazonaws\.com$/,
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/beer/data/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-data'
    },
    networkTimeoutSeconds: 4
  });

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);

function getFilenameFromUrl(path){
    path = path.substring(path.lastIndexOf("/")+ 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

// Add in some offline functionality
this.addEventListener('fetch', event => {
  // request.mode = navigate isn't supported in all browsers
  // so include a check for Accept: text/html header.
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
          fetch(event.request.url).catch(error => {
              var cachedFile = getFilenameFromUrl(event.request.url);
              // Return the offline page
              return caches.match(cachedFile);
          })
    );
  }

  // Check for WebP support
  if (/\.jpg$|.gif$|.png$/.test(event.request.url)) {
    // Inspect the accept header for WebP support
    let supportsWebp = false;
    if (event.request.headers.has('accept')){
        supportsWebp = event.request.headers
                                    .get('accept')
                                    .includes('webp');
    }

    // If we support WebP
    if (supportsWebp)
    {
        // Build the return URL
        let returnUrl = event.request.url.substr(0, event.request.url.lastIndexOf(".")) + ".webp";

        event.respondWith(
          fetch(returnUrl, {
            mode: 'no-cors'
          })
        );
    }
  }
});
