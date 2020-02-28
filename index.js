if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
const axios = require("axios");
const fetch = require("node-fetch");

let cron = require('node-cron');
// const runCron = require('./getAndSaveJson')


const express = require("express");
const serverless = require('serverless-http')
const favicon = require("express-favicon");

const admin = require('firebase-admin');

let serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();


var cors = require("cors");
const app = express();



app.use(cors());

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(express.json());

app.use(express.static("public"));


let arrObj = [];
console.log("Loaded page");





app.get("/track", async (req, res, next) => {
   console.log("FROM /Tracked ",req.body);
  // const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1327109`;
  // const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=20`
  //const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&search_window=session:2019`
//  const URL =`https://openstates.org/api/v1/bills/?state=dc&q=taxi`

    // axios.get(URL, { headers: {'X-API-KEY': process.env.OPENSTATES } }).then(response => {
    //   // If request is good...
    //   console.log("💁‍♂️")
    //   res.json(response.data);

    // })
    // .catch((error) => {
    //   console.log('error:' + error);
    // });

    let billsRef = db.collection('bills')//.orderBy('updated_at','desc');
    let allCities = billsRef.get()
      .then(snapshot => {
        var list = [];
        snapshot.forEach(doc => {
       // console.log("I love 🍕", doc.data())
       list.push(doc.data());
          // console.log(doc.id, '=>', doc.data());
        });
        
        res.json(list);
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });



  

});


// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
