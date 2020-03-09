let cron = require("node-cron");

// Imports
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

console.log('jsonToFirestore()');
// JSON To Firestore
const jsonToFirestore = async () => {
  try {
if (firestoreService.admin.apps.length  === 0 ) {
  console.log('Initialzing Firebase');
  await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
  console.log('Firebase Initialized');
}
    await firestoreService.restore('./data-clean/firebase/test.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};


 module.exports = jsonToFirestore;