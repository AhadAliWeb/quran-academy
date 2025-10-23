import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
 
const firebaseConfig = {
  apiKey: "AIzaSyDT5AlwMA9qSObty8eeB5jovJSvn3ccPDo",
  authDomain: "notifications-app-8d49e.firebaseapp.com",
  projectId: "notifications-app-8d49e",
  storageBucket: "notifications-app-8d49e.firebasestorage.app",
  messagingSenderId: "653255879137",
  appId: "1:653255879137:web:e4806394d58e38599a0aa0",
  measurementId: "G-WWF6G783F0"
};

const vapidKey = "BPwZ7MtHY5PB-0u3d78VUVPK5M3deDPzqLevD0vB_SLS91s-Cuquplpij_0BeViH-_y-aNQibZcUZoaBlb3m3lU"

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
