const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();
admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT)
});
module.exports = admin;