// Firebase Cloud Messaging — browser-side notification management
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import app from './firebase';

let messaging: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (!messaging) {
    try {
      messaging = getMessaging(app);
    } catch {
      return null;
    }
  }
  return messaging;
}

// Request permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  const m = getMessagingInstance();
  if (!m) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    // VAPID key from Firebase Console > Project Settings > Cloud Messaging
    const token = await getToken(m, {
      vapidKey: 'YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE',
      serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js'),
    });
    console.log('[FCM] Token:', token);
    return token;
  } catch (err) {
    console.warn('[FCM] Could not get token:', err);
    return null;
  }
}

// Listen for foreground messages
export function listenForMessages(callback: (payload: { title: string; body: string }) => void) {
  const m = getMessagingInstance();
  if (!m) return () => {};

  return onMessage(m, (payload) => {
    const title = payload.notification?.title ?? 'ReadyBite';
    const body = payload.notification?.body ?? 'You have a new update';
    callback({ title, body });
  });
}

// Show an in-app toast notification (Pub/Sub event simulation)
export function showLocalNotification(title: string, body: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('readybite:notification', { detail: { title, body } });
    window.dispatchEvent(event);
  }
}
