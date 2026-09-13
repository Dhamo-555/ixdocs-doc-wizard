/**
 * IXDocs Service Worker — Cleanup Only
 *
 * This service worker exists solely to remove any previously installed
 * Monetag push-notification service worker from users' browsers.
 *
 * It makes NO external network requests and provides NO ongoing
 * service-worker functionality. It activates immediately and
 * then unregisters itself.
 */

self.addEventListener("install", () => {
  // Skip waiting so this SW activates immediately, replacing any
  // previously installed Monetag SW at the same scope.
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  // Claim all clients in this scope so the cleanup applies to
  // any currently open tabs.
  await self.clients.claim();

  // Self-unregister: after this fires, the browser removes this SW
  // and there will be no active service worker for this origin.
  const registration = await self.registration;
  if (registration) {
    registration.unregister();
  }
});
