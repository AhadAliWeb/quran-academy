import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store.js'



// // ✅ Register Firebase service worker before rendering the app
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((registration) => {
//       console.log('✅ Service Worker registered:', registration);
//     })
//     .catch((err) => {
//       console.error('❌ Service Worker registration failed:', err);
//     });
// }

createRoot(document.getElementById('root')).render(
  <>
    <Provider store={store}> 
      <App />
    </Provider>
  </>
)
