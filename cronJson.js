if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
let cron = require("node-cron");
const axios = require("axios");
const fetch = require("node-fetch");
let db = require("./db");

const express = require("express");
const serverless = require("serverless-http");
const favicon = require("express-favicon");
var cors = require("cors");
const app = express();

app.use(cors());

app.use(favicon(__dirname + "/public/favicon.ico"));

app.use(express.json());

app.use(express.static("public"));

const options = {
  headers: { "X-API-KEY": process.env.OPENSTATES }
};

console.log("Loaded cron");

// async function runCron2() {
// //app.get("/track", async (req, res, next) => {
//  console.log("Started Cron 🙈 ");
//   // const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1327109`;
//   // const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=20`
//   const URL = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&search_window=session:2019`;
//   //const URL =`https://openstates.org/api/v1/bills/?state=dc&q=taxi`

//   // console.log("CBefire", URL);
//   // console.log("CBefire", process.env.OPENSTATES);

//   axios.get(URL, { headers: { "X-API-KEY": process.env.OPENSTATES } })
//     .then(response => {
//       // If request is good...

//       console.log("CRON SAVE", response.data.title);

//       db.get("bills")
//         .push({
//           siteLastUpdated: Date.now(),
//           bills:response.data

//         })
//         .write();

//         console.log("SAVE cron job ");

//       //res.json(response.data);
//     })
//     .catch(error => {
//       console.log("error:" + error);
//     });
//   console.log("cron job done");
// //});
// }

function getData() {
  console.log("Waiting on Cron...");
  cron.schedule("* * * * *", () => {
    console.log("running a cron every minute");

    runCron();
  });
}

const limitPerPage = 50;

const getUsers = async function(pageNo = 1) {
  let actualUrl = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}&search_window=session:2019&updated_since=2019-07-01`;

  var apiResults = await fetch(actualUrl, {
    headers: { "X-API-KEY": process.env.OPENSTATES }
  }).then(resp => {
    return resp.json();
  });

  return apiResults;
};

const getEntireUserList = async function(pageNo = 1) {
  //setTimeout(async function() {
  const results = await getUsers(pageNo);
  console.log("Retreiving data from API for page : " + pageNo);
  //your code to be executed after 1 second

  if (results.length > 0) {
    // console.log("Result from  loop", results)
    return results.concat(await getEntireUserList(pageNo + 1));
  } else {
    return results;
  }
  //}, 10000);
};

async function runCron() {
  (async () => {
    const entireList = await getEntireUserList();
    console.log("Here!! ");
    console.log("entireList ", entireList)
    console.log("entireList ", entireList[1].title);

    for (let index = 0; index < entireList.length; index++) {
      console.log("entireList ", entireList[index].actions);
    db.get("bills")
      .push({
        date: Date.now(),
        title: entireList[index].title,
        summary: entireList[index].summary,
        created_at: entireList[index].created_at,
        updated_at: entireList[index].updated_at,
        id: entireList[index].id,
        all_ids: entireList[index].all_ids,
        chamber: entireList[index].chamber,
        state: entireList[index].state,
        session: entireList[index].session,
        type: entireList[index].type,
        bill_id: entireList[index].bill_id,
        actions: entireList[index].actions,
        sources: entireList[index].sources,
        sponsors: entireList[index].sponsors,
        versions: entireList[index].versions,
        documents: entireList[index].documents,
        alternate_titles: entireList[index].alternate_titles,
        votes: entireList[index].votes,
        action_dates: entireList[index].action_dates,
        scraped_subjects: entireList[index].scraped_subjects,
        alternate_bill_ids: entireList[index].alternate_bill_ids,
        subjects: entireList[index].subjects,
        companions: entireList[index].companions
        //siteLastUpdated: Date.now(),
         
      })
      .write();

    console.log("SAVE cron job ");
    }
  })();
}

getData();
// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });

// module.exports = runCron;
