// Firebase Cloud Messaging Service Worker
// This file is served from the root and handles background push notifications.
// NOTE: Service Workers cannot access Next.js env vars.
// Replace the config values below with your own Firebase project values.
// These values are safe to expose in service workers (they are client-side public keys).

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain:        "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_NEXT_PUBLIC_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification ?? {};
  self.registration.showNotification(title ?? 'ReadyBite', {
    body: body ?? 'Update from ReadyBite',
    icon: icon ?? '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data,
  });
});
