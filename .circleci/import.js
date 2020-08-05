let cron = require("node-cron");
var format = require('date-fns/format')
// Imports
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('config.js')
const serviceAccount = require('serviceAccount.json');

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
    var time = format(
      new Date(Date.now()),
      'MM/dd/yyyy:HH:mm:ss'
    )
    console.log('Upload Success at: ', time );
  }
  catch (error) {
    // Sentry.captureException("Failed to Push JSON To Firestore ", error);
    console.log(error);
  }
};

//jsonToFirestore()
 module.exports = jsonToFirestore;