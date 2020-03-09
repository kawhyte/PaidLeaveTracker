let cron = require("node-cron");

// Imports
const firestoreService = require('firestore-export-import');
const firebaseConfig = require('./config.js');
const serviceAccount = require('./serviceAccount.json');

console.log('jsonToFirestore()');
// JSON To Firestore
const jsonToFirestore = async () => {
  try {
    console.log("firestoreService.admin.app.length",firestoreService.admin.apps.length  )
    //  console.log("firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL)",firestoreService.initializeApp(serviceAccount, firebaseConfig.databaseURL)  )


console.log('Initialzing Firebase');
if (firestoreService.admin.apps.length  === 0 ) {
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


 
//sendDataToFirestore() 


// function sendDataToFirestore() {
//  //cron.schedule('* * * * *', () => {

//    jsonToFirestore();
   
  
//   //});
  
//   }

 module.exports = jsonToFirestore;