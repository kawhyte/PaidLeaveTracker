if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const LEGISCAN_API_KEY = process.env.LEGISCAN;
  const axios = require("axios");
  
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


  app.get("/track", async (req, res, next) => {
    console.log("FROM /Tracked ",req.body);
    const url = `https://api.legiscan.com/?key=${process.env.LEGISCAN}&op=getBill&id=1137133`;
  
    axios({
      url: url,
      responseType: "json"
    }).then(data => {
  
   console.log(data.data)
      res.json(data.data);
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