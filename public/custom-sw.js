// Service Worker listener for Native Notifications in Android PWA / Chrome

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If PWA or browser tab is already open, bring it to focus
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // If not open, launch the PWA window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
