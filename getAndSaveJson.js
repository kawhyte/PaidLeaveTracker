if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
const axios = require("axios");
const fetch = require("node-fetch");
let db = require('./db');

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
  headers: {'X-API-KEY': process.env.OPENSTATES}
};

console.log("Loaded cron");

async function runCron() {
//app.get("/track", async (req, res, next) => {
  // console.log("FROM /Tracked ",req.body);
  // const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1327109`;
  // const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=20`
  const URL = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&search_window=session:2019`;
  //const URL =`https://openstates.org/api/v1/bills/?state=dc&q=taxi`


  // console.log("CBefire", URL);
  // console.log("CBefire", process.env.OPENSTATES);

  


  axios.get(URL, { headers: { "X-API-KEY": process.env.OPENSTATES } })
    .then(response => {
      // If request is good...

      console.log("CRON SAVE", response.data.title);


      db.get("bills")
        .push({
          siteLastUpdated: Date.now(),
          bills:response.data

        })
        .write();

        console.log("SAVE cron job ");

      //res.json(response.data);
    })
    .catch(error => {
      console.log("error:" + error);
    });
  console.log("cron job done");
//});
}
// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });

module.exports = runCron; 