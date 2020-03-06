if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const LEGISCAN_API_KEY = process.env.LEGISCAN;
const OPENSTATES_API_KEY = process.env.OPENSTATES;
let cron = require('node-cron');
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

async function runCron2() {
//app.get("/track", async (req, res, next) => {
 console.log("Started Cron 🙈 ");
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

getData() 

function getData() {
cron.schedule('* * * * *', () => {
  console.log('running a cron every minute');

  runCron();

});

}



const limitPerPage=50;
let pageNo = 1
const apiUrl=`https://openstates.org/api/v1/bills/?state=dc&q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}
`;

const getUsers = async function(pageNo = 1) {
//  let actualUrl =  `https://openstates.org/api/v1/bills/?state=dc&q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}
//   `;
 let actualUrl =  `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}&search_window=session:2019`;
  //const URL =`https://openstates.org/api/v1/bills/?q="paid+family+leave"&search_window=session:2019`

// let actualUrl=apiUrl + `?page=${pageNo}&limit=${limitPerPage}`;
var apiResults = await fetch(actualUrl, { headers: { "X-API-KEY": process.env.OPENSTATES } })
.then(resp=>{
return resp.json();
});

return apiResults;

}

const getEntireUserList = async function(pageNo = 1) {

  //setTimeout(async function() {
    const results = await getUsers(pageNo);
    console.log("Retreiving data from API for page : " + pageNo);
    //your code to be executed after 1 second
 
  if (results.length > 0) {
    // console.log("Result from  loop", results)
    return results.concat(await getEntireUserList(pageNo+1));
  } else {
    return results;
  }
//}, 10000);


};


async function runCron() {

(async ()=>{

    const entireList=await getEntireUserList();
    console.log("Here!! ");
    console.log("entireList ", entireList);

    db.get("bills")
    .push({
      siteLastUpdated: Date.now(),
      bills:entireList

    })
    .write();

    console.log("SAVE cron job ");

})();

}

// app.listen(8887, () => console.log("Pay Leave app listening on port 8887!"));

// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });

// module.exports = runCron; 