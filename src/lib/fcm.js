import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";


export const generateFCMToken = async () => {
  try {
    // 1. Check if the browser supports notifications
    if (!('Notification' in window)) {
      return;
    }

    // 2. Request permission (vibrate, sound, popup)
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
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
        localStorage.setItem("fcmToken", currentToken);
        return currentToken;
      }
    }
  } catch (error) {
    // Silent catch
  }
};

/**
 * Listener for foreground messages. 
 * This triggers when the app is active and focused.
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
