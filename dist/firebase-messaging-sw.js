// Import Firebase scripts from CDN (Compat version for Service Workers)
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

/**
 * Configure Firebase inside the Service Worker.
 * Note: These MUST be hardcoded or injected during build time.
 */
firebase.initializeApp({
  apiKey: "AIzaSyD9VsvlXSaUGwdJgSupviPES7XNLq3WqHU", // Must match exactly with your .env
  authDomain: "outapp-80a04.firebaseapp.com",
  projectId: "outapp-80a04",
  storageBucket: "outapp-80a04.firebasestorage.app",
  messagingSenderId: "1077003230117",
  appId: "1:1077003230117:web:fe3400456008064ca1e64c"
});

const messaging = firebase.messaging();

/**
 * Listener for background messages.
 * This triggers when the app is in the background or closed.
 */
messaging.onBackgroundMessage((payload) => {
  console.info('[FCM Service Worker] Received background message:', payload);

  const notificationTitle = payload.notification.title || "New Notification";
  const notificationOptions = {
    body: payload.notification.body || "Check your message.",
    icon: '/favicon.ico', // Ensure this file exists in your public folder
    badge: '/favicon.ico', // Small monochromatic icon for Android
    vibrate: [200, 100, 200] // Haptic feedback pattern
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
