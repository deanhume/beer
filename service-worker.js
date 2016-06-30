(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('./bower_components/sw-toolbox/sw-toolbox.js');

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = false;

  // We want to precache the following items
  toolbox.precache([ './index.html',
                     './about.html',
                     './style.html',
                     './beer.html']);

  // The route for any requests from the googleapis origin
  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'googleapis',
      maxEntries: 30,
      maxAgeSeconds: 604800
    },
    origin: /\.googleapis\.com$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'fonts',
      maxEntries: 30,
      maxAgeSeconds: 604800
    },
    origin: /\.gstatic\.com$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/css/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'stylesheets',
      maxEntries: 10,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/images/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'images',
      maxEntries: 10,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/js/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'javascript',
      maxEntries: 10,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-images-amazon',
      maxEntries: 200,
      maxAgeSeconds: 604800
    },
    origin: /\.amazonaws\.com$/,
    // Set a timeout threshold of 2 seconds
    networkTimeoutSeconds: 4
  });

  toolbox.router.get('/data/(.*)', global.toolbox.cacheFirst, {
    cache: {
      name: 'beer-data',
      maxEntries: 200,
      maxAgeSeconds: 604800
    },
    // Set a timeout threshold of 2 seconds
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
});
