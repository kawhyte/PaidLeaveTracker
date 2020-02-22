if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
const axios = require("axios");
const fetch = require("node-fetch");
// import express from "express";
//   import { getHTML, getTwitterTweets } from "./scraper";
//   import db from "./db";
//   import  "./cron";

const express = require("express");
const serverless = require('serverless-http')
const favicon = require("express-favicon");
var cors = require("cors");
const app = express();


app.use(cors());

app.use(favicon(__dirname + "../public/favicon.ico"));

app.use(express.json());

app.use(express.static("public"));


// app.use('./netlify/functions/index',app)
console.log("Loaded page");





// let urls = [
//   "1131994",
//   "1132030",
//   "1213345",
//   "1342525",
//   "1303785",
//   "1165825",
//   "1198065",
//   "1318698",
//   "1303138",
//   "1324288",
//   "1291907",
//   "1286276",
//   "1297227",
//   "1193578",
//   "1207169",
//   "1287917",
//   "1270984",
//   "1294120",
//   "1197632",
//   "1318643",
//   "1307599",
//   "1312205",
//   "1282526",
//   "1151760",
//   "1145281",
//   "1260026",
//   "1210507",
//   "1152593",
//   "1147552",
//   "1244082",
//   "1173620",
//   "1204223",
//   "1144027",
//   "1296474",
//   "1300816",
//   "1176055",
//   "1250964"
// ].map((bill, i) => {
//   return `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=${bill}`;
// });

app.get("/track", async (req, res, next) => {
  // console.log("FROM /Tracked ",req.body);
  // const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1327109`;
  // const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=20`
  const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&search_window=session:2019`
 //const URL =`https://openstates.org/api/v1/bills/?state=dc&q=taxi`

  //   axios({
  //     url: url,
   
      
  //     responseType: "json"
  //   }).then(data => {

  //  console.log(data.data)
  //     res.json(data.data);
  //   });



    axios.get(URL, { headers: {'X-API-KEY': process.env.OPENSTATES } }).then(response => {
      // If request is good...
      // console.log("AXIOS ",response.data);
      res.json(response.data);
    })
    .catch((error) => {
      console.log('error 3 ' + error);
    });




  // const options = {
  //   headers: new Headers({
  //     Accept: "application/json",
  //     Authorization: "Basic",
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   }),
  //   method: "GET"
  // };

  // Promise.all(urls.map(url => fetch(url)))
  //   .then(resp => Promise.all(resp.map(r => r.json())))
  //   .then(data => {
  //     console.log(data);
  //     res.json(data);
  //   });
});


// module.exports.handler =  serverless(app);

// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });
