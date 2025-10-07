import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import axios from 'axios'

const VAPID_KEY = 'BLcAOOdb4wcUeggh3P8Beqcdp4cGTPr8QZNarbgKSe3LozDBe9SXoC5xBBQxw17CluEBRX_gtOzNzhCMH1OA87Y';

// Force unregister ALL service workers
export const forceUnregisterAllServiceWorkers = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`Found ${registrations.length} service workers`);
        
        for (const registration of registrations) {
          const success = await registration.unregister();
          console.log('Unregistered service worker:', success);
        }
        
        // Small delay to ensure cleanup
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('All service workers unregistered');
      } catch (error) {
        console.error('Error unregistering service workers:', error);
      }
    }
  };
  
  // Register service worker with clean slate
  export const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Workers are not supported');
      return null;
    }
  
    try {
      // Force unregister everything first
      await forceUnregisterAllServiceWorkers();
      
      console.log('Registering new service worker...');
      
      // Register fresh service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('Service Worker registered');
      
      // Wait for it to be active
      if (registration.installing) {
        await new Promise((resolve) => {
          registration.installing.addEventListener('statechange', function() {
            if (this.state === 'activated') {
              resolve();
            }
          });
        });
      }
      
      // Ensure it's ready
      await navigator.serviceWorker.ready;
      console.log('Service Worker is ready');
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };
  
  export const requestNotificationPermission = async () => {
    try {
      // Check if we've already initialized (prevent multiple calls)
      const hasInitialized = sessionStorage.getItem('fcm_initialized');
      
      if (hasInitialized) {
        console.log('FCM already initialized this session');
        // Just get existing registration
        const registration = await navigator.serviceWorker.getRegistration('/');
        if (registration) {
          const token = await getToken(messaging, { 
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration 
          });
          return token;
        }
      }
      
      // Register the service worker
      const registration = await registerServiceWorker();
      
      if (!registration) {
        console.error('Service worker registration failed');
        return null;
      }
      
      // Request notification permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return null;
      }
      
      console.log('Getting FCM token...');
      
      // Get FCM token
      const token = await getToken(messaging, { 
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration 
      });
      
      console.log('FCM Token obtained:', token);
      
      // Save token to backend
      await saveTokenToBackend(token);
      
      // Mark as initialized
      sessionStorage.setItem('fcm_initialized', 'true');
      
      return token;
    } catch (error) {
      console.error('Error in notification setup:', error);
      
      // If it's a pushManager error, clear everything and reload
      if (error.message?.includes('pushManager') || 
          error.message?.includes('registration') ||
          error.code === 'messaging/failed-service-worker-registration') {
        
        console.log('Critical error detected, forcing cleanup...');
        
        // Clear session storage
        sessionStorage.removeItem('fcm_initialized');
        
        // Force unregister all
        await forceUnregisterAllServiceWorkers();
        
        // Clear caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        alert('Notification setup needs to restart. The page will reload.');
        
        // Reload after small delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
      
      return null;
    }
  };

const saveTokenToBackend = async (token) => {
  
    await axios.post("/api/v1/users/save-token", { fcmToken: token }).then(res => console.log("Token Saved Successfully")).catch(err => console.log(err))
};

// Handle foreground messages
export const setupForegroundListener = () => {
    onMessage(messaging, (payload) => {
      console.log('Foreground notification:', payload);
      
      // Browser will automatically show the notification
      // You can also show custom UI here if needed
      const { title, body } = payload.notification;
      
      // Optional: Show browser notification manually for foreground
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: body,
          icon: '/logo192.png',
          badge: '/badge.png',
          data: payload.data,
        });
      }
    });
  };