// BTLTech PWA Service Worker
// Version 1.0.0

const CACHE_NAME = 'btltech-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/repairs.html',
  '/data-recovery.html',
  '/faq.html',
  '/book.html',
  '/contact.html',
  '/warranty.html',
  '/landing.html',
  '/offline.html',
  '/styles.min.css',
  '/script.js',
  '/menu.js',
  '/cookie-consent.js',
  '/btltech-logo-192.png',
  '/btltech-logo-512.png',
  '/favicon.ico',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.8.0/dist/cookieconsent.css',
  'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@v2.8.0/dist/cookieconsent.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('BTLTech Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('BTLTech Service Worker: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('BTLTech Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('BTLTech Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('BTLTech Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('BTLTech Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('BTLTech Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (except CDN resources)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && 
      !url.hostname.includes('cdn.tailwindcss.com') && 
      !url.hostname.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version if available
        if (response) {
          console.log('BTLTech Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        console.log('BTLTech Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('BTLTech Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'repair-booking') {
    console.log('BTLTech Service Worker: Background sync for repair booking');
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineBookings()
    );
  }
});

// Push notifications
self.addEventListener('push', event => {
  console.log('BTLTech Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New repair booking notification',
    icon: '/btltech-logo-192.png',
    badge: '/btltech-logo-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/btltech-logo-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/btltech-logo-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('BTLTech Repair Service', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  console.log('BTLTech Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/book.html')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle offline bookings
async function handleOfflineBookings() {
  try {
    // Get stored offline bookings from IndexedDB
    const offlineBookings = await getOfflineBookings();
    
    for (const booking of offlineBookings) {
      try {
        // Attempt to submit the booking
        const response = await fetch('/book.html', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking)
        });

        if (response.ok) {
          // Remove from offline storage
          await removeOfflineBooking(booking.id);
          console.log('BTLTech Service Worker: Offline booking synced successfully');
        }
      } catch (error) {
        console.error('BTLTech Service Worker: Failed to sync offline booking', error);
      }
    }
  } catch (error) {
    console.error('BTLTech Service Worker: Error handling offline bookings', error);
  }
}

// IndexedDB helpers for offline storage
function getOfflineBookings() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BTLTechOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['bookings'], 'readonly');
      const store = transaction.objectStore('bookings');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

function removeOfflineBooking(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('BTLTechOffline', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['bookings'], 'readwrite');
      const store = transaction.objectStore('bookings');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
  }
});

console.log('BTLTech Service Worker: Loaded successfully');