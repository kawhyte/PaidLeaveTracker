if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
const axios = require("axios");
const fetch = require("node-fetch");

let cron = require("node-cron");

let differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
let add = require("date-fns/add");
var formatDistance = require("date-fns/formatDistance");
const express = require("express");

const favicon = require("express-favicon");

const admin = require("firebase-admin");

let serviceAccount = require("./serviceAccount.json");

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

const limitPerPage = 50;
let pageNo = 1;
console.log("Loaded page");

app.get("/track", async (req, res, next) => {
  console.log("app.get /tracked");
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

  // const entireList=await getEntireUserList();
  // console.log("Here!! entireList ", entireList[0]);

  // res.json(entireList);

  let billsRef = db.collection("bills"); //.orderBy('updated_at','desc');
  let allCities = billsRef
    .get()
    .then(snapshot => {
      var list = [];
      snapshot.forEach(doc => {
        list.push(doc.data());
      });

      let test = list.map((element, index) => {
        ////LOGIC TO CHECK IF BILL IS IMPORTANT //////
        importantValue = element.actions[element.actions.length - 1].type;
        if (
          importantValue.includes("bill:failed") ||
          importantValue.includes("bill:withdrawn") ||
          importantValue.includes("bill:veto_override:passed") ||
          importantValue.includes("bill:veto_override:failed") ||
          importantValue.includes("bill:filed") ||
          importantValue.includes("governor:received") ||
          importantValue.includes("governor:signed") ||
          importantValue.includes("governor:vetoed") ||
          importantValue.includes("governor:vetoed:line-item")
        ) {
          element.isLastUpdateImportant = 1;
        }

        ////LOGIC TO CHECK IF BILL IS NEW //////
        var futureDate = add(new Date(Date.now()), {
          days: 5,
          hours: 5,
          minutes: 9,
          seconds: 30
        });

        var result = differenceInCalendarDays(
          futureDate,
          new Date(element.dateAddedToTracker)
        );

        if (result < 2) {
          element.isBillNew = false;
          // console.log("After 🍕", element.isBillNew);
        } 

        if (typeof (element.databaseUpdated) !== "undefined") {
        var timeAgo = formatDistance(
          new Date(element.databaseUpdated),
          new Date(Date.now()),
          {
            addSuffix: true
          }
        )

        element.dbUpdatedTime = timeAgo;
        console.log("element.dbUpdatedTime  🍕 ", element.dbUpdatedTime );
       
      };

      })

      res.json(list);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});

// const getUsers = async function(pageNo = 1) {

//    let actualUrl =  `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}&search_window=session:2019&updated_since=2019-01-01`;

//   var apiResults = await fetch(actualUrl, { headers: { "X-API-KEY": process.env.OPENSTATES } })
//   .then(resp=>{
//   return resp.json();
//   });

//   return apiResults;

//   }

//   const getEntireUserList = async function(pageNo = 1) {
//       const results = await getUsers(pageNo);
//       console.log("Retreiving data from API for page : " + pageNo);

//     if (results.length > 0) {
//       // console.log("Result from  loop", results)
//       return results.concat(await getEntireUserList(pageNo+1));
//     } else {
//       return results;
//     }
//   };

// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
