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
var parseJSON = require('date-fns/parseJSON')
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
  
  let query = billsRef.where('action_dates.first', '>=', '2019-01-22 00:00:00').orderBy('action_dates.first', 'desc').get()
  
  
  //let allCities = billsRef
    //.get()
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
          importantValue.includes("governor:received") ||
          importantValue.includes("governor:signed") ||
          importantValue.includes("governor:vetoed") ||
          importantValue.includes("governor:vetoed:line-item")
        ) {
          element.isLastUpdateImportant = 1;
        }

        ////LOGIC TO CHECK IF BILL IS NEW //////
        var futureDate = add(new Date(Date.now()), {
          days: 1,
          hours: 2,
          minutes: 9,
          seconds: 30
        });

        var result = differenceInCalendarDays(
          futureDate,
          new Date(parseJSON(element.action_dates.first))
        );


        if (result > 20) {
          element.isBillNew = false;
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
        // console.log("element.dbUpdatedTime  🍕 ", element.dbUpdatedTime );


         element.stateName = state[element.state.toUpperCase()].name;
         console.log("element.dbUpdatedTime  🍕 ", element.state, element.stateName );
       
      };

      })

      res.json(list);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});



const state = {
  AL: { name: "Alabama", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505244/flags/Flag_of_Alabama.svg" },
  AK: { name: "Alaska", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505244/flags/Flag_of_Alaska.svg" },
  AZ: { name: "Arizona", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505244/flags/Flag_of_Arizona.svg" },
  AR: { name: "Arkansas", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505244/flags/Flag_of_Arkansas.svg" },
  CA: { name: "California", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505245/flags/Flag_of_California.svg" },
  CO: { name: "Colorado", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505244/flags/Flag_of_Colorado.svg" },
  CT: { name: "Connecticut", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505246/flags/Flag_of_Connecticut.svg" },
  DE: { name: "Delaware", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505247/flags/Flag_of_Delaware.svg" },
  DC: {
    name: "D.C.",
    flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505261/flags/Flag_of_the_District_of_Columbia.svg"
  },
  FL: { name: "Florida", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505247/flags/Flag_of_Florida.svg" },
  GA: { name: "Georgia", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505246/flags/Flag_of_Georgia__U.S._state.svg" },
  HI: { name: "Hawaii", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505246/flags/Flag_of_Hawaii.svg" },
  ID: { name: "Idaho", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505247/flags/Flag_of_Idaho.svg" },
  IL: { name: "Illinois", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Illinois.svg" },
  IN: { name: "Indiana", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Indiana.svg" },
  IA: { name: "Iowa", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Iowa.svg" },
  KS: { name: "Kansas", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Kansas.svg" },
  KY: { name: "Kentucky", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Kentucky.svg" },
  LA: { name: "Louisiana", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505249/flags/Flag_of_Louisiana.svg" },
  ME: { name: "Maine", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505251/flags/Flag_of_Maine.svg" },
  MD: { name: "Maryland", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505251/flags/Flag_of_Maryland.svg" },
  MA: { name: "Massachusetts", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505251/flags/Flag_of_Massachusetts.svg" },
  MI: { name: "Michigan", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505251/flags/Flag_of_Michigan.svg" },
  MN: { name: "Minnesota", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505251/flags/Flag_of_Minnesota.svg" },
  MS: { name: "Mississippi", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505253/flags/Flag_of_Mississippi.svg" },
  MO: { name: "Missouri", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505253/flags/Flag_of_Missouri.svg" },
  MT: { name: "Montana", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505253/flags/Flag_of_Montana.svg" },
  NE: { name: "Nebraska", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505254/flags/Flag_of_Nebraska.svg" },
  NV: { name: "Nevada", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505254/flags/Flag_of_Nevada.svg" },
  NH: { name: "New Hampshire", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505255/flags/Flag_of_New_Hampshire.svg" },
  NJ: { name: "New Jersey", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_New_Jersey.svg" },
  NM: { name: "New Mexico", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_New_Mexico.svg" },
  NY: { name: "New York", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_New_York.svg" },
  NC: { name: "North Carolina", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_North_Carolina.svg" },
  ND: { name: "North Dakota", flag: "Fhttps://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_North_Dakota.svg" },
  OH: { name: "Ohio", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505257/flags/Flag_of_Ohio.svg" },
  OK: { name: "Oklahoma", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_Oklahoma.svg" },
  OR: { name: "Oregon", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_Oregon.svg" },
  PA: { name: "Pennsylvania", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_Pennsylvania.svg" },
  RI: { name: "Rhode Island", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_Rhode_Island.svg" },
  SC: { name: "South Carolina", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_South_Carolina.svg" },
  SD: { name: "South Dakota", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505259/flags/Flag_of_South_Dakota.svg" },
  TN: { name: "Tennessee", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505261/flags/Flag_of_Tennessee.svg" },
  TX: { name: "Texas", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505261/flags/Flag_of_Texas.svg" },
  UT: { name: "Utah", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505261/flags/Flag_of_Utah.svg" },
  VT: { name: "Vermont", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505261/flags/Flag_of_Vermont.svg" },
  VA: { name: "Virginia", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505262/flags/Flag_of_Virginia.svg" },
  WA: { name: "Washington", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505263/flags/Flag_of_Washington.svg" },
  WV: { name: "West Virginia", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505263/flags/Flag_of_West_Virginia.svg" },
  WI: { name: "Wisconsin", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505263/flags/Flag_of_Wisconsin.svg" },
  WY: { name: "Wyoming", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505263/flags/Flag_of_Wyoming.svg" },
  ALL: { name: "View All States", flag: "Flag_of_Wyoming.svg" }
};



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

app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });
