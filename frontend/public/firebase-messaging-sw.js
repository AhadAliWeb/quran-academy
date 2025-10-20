importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD83_9CxLPd-AMwSoGpW_0e_Te0_-rmeG8",
  authDomain: "app-notifications-294ad.firebaseapp.com",
  projectId: "app-notifications-294ad",
  storageBucket: "app-notifications-294ad.firebasestorage.app",
  messagingSenderId: "756906132227",
  appId: "1:756906132227:web:dd2d871dc33c1fa1f39f36",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    // icon: '/logo192.png', // or your own icon in /public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

 });