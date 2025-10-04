const admin = require('firebase-admin');
const serviceAccount = require('../app-notifications-294ad-firebase-adminsdk-fbsvc-3c95df49e1.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
module.exports = admin;