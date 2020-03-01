// Imports
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log('Initialzing Firebase');
    await firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL);
    console.log('Firebase Initialized');

    await firestoreService.restore('./data-clean/firebase/test.json');
    console.log('Upload Success');
  }
  catch (error) {
    console.log(error);
  }
};



getData() 


function getData() {
  cron.schedule('* * * * *', () => {
    console.log('running Update Database cron every minute');
  jsonToFirestore();
   
  
  });
  
  }