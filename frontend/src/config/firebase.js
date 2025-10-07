import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
 
const firebaseConfig = {
  apiKey: "AIzaSyD83_9CxLPd-AMwSoGpW_0e_Te0_-rmeG8",
  authDomain: "app-notifications-294ad.firebaseapp.com",
  projectId: "app-notifications-294ad",
  storageBucket: "app-notifications-294ad.firebasestorage.app",
  messagingSenderId: "756906132227",
  appId: "1:756906132227:web:dd2d871dc33c1fa1f39f36",
  measurementId: "G-91J77E6PX3",
};

const vapidKey = "BLcAOOdb4wcUeggh3P8Beqcdp4cGTPr8QZNarbgKSe3LozDBe9SXoC5xBBQxw17CluEBRX_gtOzNzhCMH1OA87Y"

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


export const requestFCMToken = async () => {

   return Notification.requestPermission()
   .then(permission => {

        if(permission === "granted") {
          return getToken(messaging, { vapidKey })
        }
        else {
          throw new Error("Notification not Granted")
        }
   })
   .catch(err => console.error("Error: ", err  ))
}

export { messaging };
