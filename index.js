if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var _ = require("lodash");
let differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
let add = require("date-fns/add");
var formatDistance = require("date-fns/formatDistance");
var parseJSON = require("date-fns/parseJSON");
let billStatus = "";
let {state, status} = require("./helper");
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

console.log("Loading API...");



app.get("/track", async (req, res, next) => {
  console.log("app.get /tracked");

  let billsRef = db.collection("bills")
    .where("action_dates.first", ">=", "2019-01-01 00:00:00")
    .orderBy("action_dates.first", "desc")
    .get().then(snapshot => {
      var list = [];
      snapshot.forEach(doc => {
        list.push(doc.data());
      });

      let test = list.map((element, index) => {

        if (typeof element.New_DB_Time === "undefined") {

           let sorted = element.actions.sort((a, b) => parseJSON(a.date) - parseJSON(b.date));

          if (typeof element.actions[0].date !== "undefined") {
            var textTimeCreated = formatDistance(
              new Date(element.actions[0].date),
              new Date(Date.now()),
              {
                addSuffix: true
              }
            );
            _.assign(element, { timeCreatedText: textTimeCreated });
          }

          ////LOGIC TO CHECK IF BILL IS IMPORTANT //////
          importantValue = element.actions.some(
            value =>
              value.type.includes("governor:received") ||
              value.type.includes("bill:failed") ||
              value.type.includes("bill:withdrawn") ||
              value.type.includes("bill:veto_override:passed") ||
              value.type.includes("bill:veto_override:failed") ||
              value.type.includes("governor:received") ||
              value.type.includes("governor:signed") ||
              value.type.includes("governor:vetoed") ||
              value.type.includes("governor:vetoed:line-item") ||
              Object.values(value.action).includes("governor")
          );

          if (importantValue === true) {
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

          element.stateName = state[element.state.toUpperCase()].name;
          element.stateFlagURL = state[element.state.toUpperCase()].flag;

          billStatus = element.actions[element.actions.length - 1];

          if (
            typeof status[billStatus.type] === "undefined" ||
            status[billStatus] === null
          ) {
            element.statusName = billStatus.action;
            element.statusColor = "bg-light-yellow";
          } else {
            element.statusName = billStatus.action;
            element.statusColor = status[billStatus.type].color;
          }
        } 
        
        if((typeof (element.New_DB_Time) !== "undefined")){
        
            console.log("NEW Time ", element.New_DB_Time);

            var timeAgo = formatDistance(
              new Date(element.New_DB_Time),
              new Date(Date.now()),
              {
                addSuffix: true
              }
            );
            element.dbUpdatedTime = timeAgo;
            console.log(" 🍕 ", timeAgo);
        }
      });
      res.json(list);
    })
    .catch(err => {
      console.log("Error getting documents", err);
    });
});


// app.listen(3000, () => console.log("Pay Leave app listening on port 3000!"));

const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
const server_host = process.env.YOUR_HOST || "0.0.0.0";
app.listen(server_port, server_host, function() {
  console.log("Listening on port %d", server_port);
});
