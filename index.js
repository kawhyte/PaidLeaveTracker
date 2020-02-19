if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const LEGISCAN_API_KEY = process.env.LEGISCAN;
  const axios = require("axios");
  const fetch = require("node-fetch");
  // import express from "express";
//   import { getHTML, getTwitterTweets } from "./scraper";
//   import db from "./db";
//   import  "./cron";
  
  const express = require('express');
  const favicon = require('express-favicon');
  var cors = require('cors')
  const app = express();
  
  app.use(cors())
  
  app.use(favicon(__dirname + '/public/favicon.ico'));
  
  app.use(express.json());
  
  app.use(express.static("public"));
  

  console.log("Loaded page");



  let urls = [
    "1327109",
    "1342525"
  
  ].map((bill, i) => {
    return `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=${bill}`;
  });



  app.get("/track", async (req, res, next) => {
    // console.log("FROM /Tracked ",req.body);
    // const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1327109`;
  
  //   axios({
  //     url: url,
  //     responseType: "json"
  //   }).then(data => {
  
  //  console.log(data.data)
  //     res.json(data.data);
  //   });
  

  // const options = {
  //   headers: new Headers({
  //     Accept: "application/json",
  //     Authorization: "Basic",
  //     "Content-Type": "application/x-www-form-urlencoded",
  //   }),
  //   method: "GET"
  // };
  
  Promise.all(urls.map(url => fetch(url)))
    .then(resp => Promise.all(resp.map(r => r.json())))
    .then(data => {
      console.log(data);
      res.json(data);
      // const html = data.map(generateHTML).join("");
      // console.log(html);
      // gallery.innerHTML = html;
    });
    
  });


  // const server = app.listen(3000, function(){
//   console.log('server is running at %s .', server.address().port);
// });

app.listen(8887, () => console.log("Scraping app listening on port 8887!"));


// const server_port = process.env.YOUR_PORT || process.env.PORT || 3000;
// const server_host = process.env.YOUR_HOST || '0.0.0.0';
// app.listen(server_port, server_host, function() {
//     console.log('Listening on port %d', server_port);
// });