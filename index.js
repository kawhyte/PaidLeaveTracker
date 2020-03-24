if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
const axios = require("axios");
const fetch = require("node-fetch");

let cron = require("node-cron");
var _ = require("lodash");
let differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
let add = require("date-fns/add");
var formatDistance = require("date-fns/formatDistance");
var parseJSON = require('date-fns/parseJSON')
let billStatus =""
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

  let billsRef = db.collection("bills"); //.orderBy('updated_at','desc');
  
  let query = billsRef.where('action_dates.first', '>=', '2019-01-01 00:00:00').orderBy('action_dates.first', 'desc').get()
  
    .then(snapshot => {
      var list = [];
      snapshot.forEach(doc => {
        list.push(doc.data());
      //  console.log(list)
      });

      let test = list.map((element, index) => {

      //  console.log("DB_Time ", element.DB_Time) 
        
        let sorted = element.actions.sort((a, b) => parseJSON(a.date) - parseJSON(b.date));
        
        if (typeof (element.actions[0].date) !== "undefined") {
          var textTimeCreated = formatDistance(
            new Date(element.actions[0].date),
            new Date(Date.now()),
            {
              addSuffix: true
            }
          )
          //element.da
          _.assign(element, {'timeCreatedText': textTimeCreated});
        };

        ////LOGIC TO CHECK IF BILL IS IMPORTANT //////
        importantValue  = element.actions.some(value => 
          
          value.type.includes("governor:received" )||
          value.type.includes("bill:failed") ||
          value.type.includes("bill:withdrawn") ||
          value.type.includes("bill:veto_override:passed") ||
          value.type.includes("bill:veto_override:failed") ||
          value.type.includes("governor:received") ||
          value.type.includes("governor:signed") ||
          value.type.includes("governor:vetoed") ||
          value.type.includes("governor:vetoed:line-item") || 
          Object.values(value.action).includes("governor")
          ) 
        
        if ( importantValue === true) {
          // console.log("🏈 Yaaas");
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


        if (result > 10) {
          element.isBillNew = false;
        } 

        if (typeof (element.DB_Time) !== "undefined") {
        var timeAgo = formatDistance(
          new Date(element.DB_Time),
          new Date(Date.now()),
          {
            addSuffix: true
          }
        )
       // _.assign(element, {'dbUpdatedTime2': timeAgo});
        element.dbUpdatedTime = timeAgo;
        console.log(" 🍕 ", timeAgo);
      };
 
      //element.dbUpdatedTime = timeAgo;

         element.stateName = state[element.state.toUpperCase()].name;
         element.stateFlagURL = state[element.state.toUpperCase()].flag;


          // console.log(" 🍕 ", element.stateName, element.stateFlagURL);
         
         
         billStatus = element.actions[element.actions.length - 1]

        //  element.statusName = element.actions[element.actions.length - 1].action;

         if (
          typeof (status[billStatus.type]) === "undefined" ||
          status[billStatus] === null
        ) {
          //billStatus = status["null"]
          element.statusName  = billStatus.action;
          element.statusColor ="bg-light-yellow";
         
        } else {
          //   billStatus = status[lastBillAction.type];
          element.statusName  = billStatus.action;
          element.statusColor = status[billStatus.type].color
         }


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
  ND: { name: "North Dakota", flag: "https://res.cloudinary.com/babyhulk/image/upload/v1584505256/flags/Flag_of_North_Dakota.svg" },
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





let status = {
  "bill:introduced": {
    name: "Introduced or prefiled",
    color: "bg-blue",
    importance: 0
  },
  "bill:passed": {
    name: "Bill has passed a chamber",
    color: "bg-yellow",
    importance: 1
  },
  "bill:failed": {
    name: "Failed to pass a chamber",
    color: "bg-red",
    importance: 1
  },
  "bill:withdrawn": {
    name: "Withdrawn from consideration",
    color: "bg-red",
    importance: 1
  },
  "bill:veto_override:passed": {
    name: "Chamber attempted a veto override and succeeded",
    color: "bg-green",
    importance: 1
  },
  "bill:veto_override:failed": {
    name: "Chamber attempted a veto override and failed",
    color: "bg-red",
    importance: 1
  },
  "bill:reading:1": {
    name: "Bill has undergone its first reading",
    color: "bg-yellow",
    importance: 0
  },
  "bill:reading:2": {
    name: "Bill has undergone its second reading",
    color: "bg-yellow",
    importance: 0
  },
  "bill:reading:3": {
    name: "Bill has undergone its third (or final) reading",
    color: "bg-yellow",
    importance: 0
  },
  "bill:filed": {
    name: "Bill has been filed",
    color: "bg-yellow",
    importance: 1
  },
  "bill:substituted": {
    name: "Bill has been replaced with a substituted wholesale",
    color: "bg-yellow",
    importance: 0
  },
  "governor:received": {
    name: "Bill has been transmitted to the governor for consideration",
    color: "bg-yellow",
    importance: 1
  },
  "governor:signed": {
    name: "Bill was signed into law by the governor",
    color: "bg-green",
    importance: 1
  },
  "governor:vetoed": {
    name: "Bill has been vetoed by the governor",
    color: "bg-red",
    importance: 1
  },
  "governor:vetoed:line-item": {
    name: "Governor has issued a partial veto",
    color: "bg-light-yellow",
    importance: 1
  },
  "amendment:introduced": {
    name: "An amendment has been offered on the bill",
    color: "bg-yellow",
    importance: 0
  },
  "amendment:passed": {
    name: "The bill has been amended",
    color: "bg-light-yellow",
    importance: 0
  },
  "amendment:failed": {
    name: "An offered amendment has failed",
    color: "bg-yellow",
    importance: 0
  },
  "amendment:amended": {
    name: "An offered amendment has been amended",
    color: "bg-yellow",
    importance: 0
  },
  "amendment:withdrawn": {
    name: "An offered amendment has been withdrawn",
    color: "bg-pink",
    importance: 0
  },
  "amendment:tabled": {
    name: "An amendment has been ‘laid on the table’",
    color: "bg-yellow",
    importance: 0
  },
  "committee:referred": {
    name: "Bill referred to a committee",
    color: "bg-yellow",
    importance: 0
  },
  "committee:passed": {
    name: "Bill has been passed out of a committee",
    color: "bg-yellow",
    importance: 0
  },
  "committee:passed:favorable": {
    name: "Bill has been passed out of a committee with a favorable report",
    color: "bg-yellow",
    importance: 0
  },
  "committee:passed:unfavorable": {
    name:
      "Bill has been passed out of a committee with an unfavorable report",
    color: "bg-yellow",
    importance: 0
  },
  "committee:failed": {
    name: "Bill has failed to make it out of committee",
    color: "bg-red",
    importance: 0
  },

  null: {
    name: "(Pending) View state website",
    color: "bg-light-yellow",
    importance: 0
  }
};



// app.listen(3000, () => console.log("Pay Leave app listening on port 3000!"));

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
