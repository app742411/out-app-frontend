import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";


export const generateFCMToken = async () => {
  try {
    // 1. Check if the browser supports notifications
    if (!('Notification' in window)) {
      console.warn("FCM: This browser does not support notifications.");
      return;
    }

    // 2. Request permission (vibrate, sound, popup)
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.info("FCM: Notification permission granted.");

      // 3. Register the Service Worker (Critical for Background Handling)
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/'
      });

      // 4. Retrieve the token from FCM
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // Now using the correct VAPID key
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        console.info("FCM: Token successfully generated:", currentToken);
        localStorage.setItem("fcmToken", currentToken);
        return currentToken;
      } else {
        console.warn('FCM: No registration token available. Ensure VAPID key is correct.');
      }
    } else {
      console.error('FCM: Notification permission denied or not granted.');
    }
  } catch (error) {
    console.error('FCM: An error occurred during token generation:', error);
  }
};

/**
 * Listener for foreground messages. 
 * This triggers when the app is active and focused.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.info("FCM: Foreground message received:", payload);
      resolve(payload);
    });
  });
