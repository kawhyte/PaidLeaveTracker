if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    }
    const axios = require("axios");
    const fetch = require("node-fetch");
    let sendToFirebase = require("./import");
    let db = require("./db");
    var fs = require('fs');
    var _ = require("lodash");
    
    function getData() {
    try {
    console.log("Waiting on for Cron...");
    
    runCron();
    } catch (error) {
    return error;
    }
    }
    
    async function getEntireUserList () {
    const options = {
    headers: { "X-API-KEY": process.env.OPENSTATES },
    };
    
    let one = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=10&state=hi`;
    let two = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=10&state=ca`;
    let three = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=10&state=co`;
    let four = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=10&state=az`;
    
    const requestOne = axios.get(one, options);
    const requestTwo = axios.get(two, options);
    const requestThree = axios.get(three, options);
    const requestFour = axios.get(four, options);
    
    let [res] = await axios.all([requestOne, requestTwo, requestThree, requestFour])
    
    let data = res.data;
    console.log(data);
    
    var dictstring = JSON.stringify(data);
     return data
    // console.log(dictstring);
    
    //db.get("bills").push(data).write();
    
    //console.log("PUSHEDD")
    
    
    };
    
    async function runCron() {
    (async () => {
    const entireList = await getEntireUserList()
     .then(res => {
    console.log("Updating LowDB File...");
     addToJsonFile(res);
     })
    .then(() => {
    console.log("Uploading to Firebase... ");
    sendToFirebase();
    console.log("Sign off");
    })
    })();
    }


    function addToJsonFile(entireList) {
        for (let index = 0; index < entireList.length; index++) {
          let value = db
            .get("bills")
            .find({ bill_id: entireList[index].bill_id })
            .value();
      
          if (typeof value === "undefined" || value.bill_id === "undefined") {
            db.get("bills")
              .push({
                dateAddedToTracker: Date.now(),
                DB_Time: Date.now(),
                isBillNew: true,
                isLastUpdateImportant: 0,
                title: entireList[index].title,
                summary: entireList[index].summary,
                created_at: entireList[index].created_at,
                updated_at: entireList[index].updated_at,
                id: entireList[index].id,
                all_ids: entireList[index].all_ids,
                chamber: entireList[index].chamber,
                state: entireList[index].state,
                stateName: "",
                stateFlagURL: "",
                statusName: "",
                statusColor: "",
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
                companions: entireList[index].companions,
                notificationSent: false
              })
              .write();
            console.log("🌈 New record added");
          } else if (_.isEqual(value.bill_id, entireList[index].bill_id)) {
            if (
              !_.isEqual(value.actions, entireList[index].actions) ||
              !_.isEqual(value.updated_at, entireList[index].updated_at) ||
              !_.isEqual(value.action_dates, entireList[index].action_dates)
            ) {
              db.get("bills")
                .find({ bill_id: entireList[index].bill_id })
                .assign({
                  dbUpdatedTime: "",
                  DB_Time: Date.now(),
                  isBillNew: true,
                  isLastUpdateImportantCounter: 0,
                  title: entireList[index].title,
                  summary: entireList[index].summary,
                  created_at: entireList[index].created_at,
                  updated_at: entireList[index].updated_at,
                  id: entireList[index].id,
                  all_ids: entireList[index].all_ids,
                  chamber: entireList[index].chamber,
                  state: entireList[index].state,
                  stateName: "",
                  stateFlagURL: "",
                  statusName: "",
                  statusColor: "",
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
                  companions: entireList[index].companions,
                  notificationSent: false
                })
                .write();
      
           console.log(`Updated at ${Date.now()}  👍🏾`, );
            }
          }
      
        }
      
        let timeValue = db
        .get("bills")
        .find({ New_DB_Time_id: 1})
        .value();
       
        
      if (typeof timeValue === "undefined" || timeValue.New_DB_Time_id === "undefined") {
      
          db.get("bills")
          .push({
            New_DB_Time_id:1, 
            New_DB_Time: Date.now(),
            action_dates: {
              "first": "2099-02-19 00:00:00",
              "last": "2099-03-09 00:00:00",
              "passed_upper": null,
              "passed_lower": null,
              "signed": null
            }
      
        }).write(); 
        console.log(`Time Updated ⏲️`, );  
      } else if (_.isEqual(timeValue.New_DB_Time_id, 1)) {
        
         db.get("bills")
          .find({ New_DB_Time_id: 1})
          .assign({
           New_DB_Time: Date.now(),
           action_dates: {
             "first": "2099-02-19 00:00:00",
             "last": "2099-03-09 00:00:00",
             "passed_upper": null,
             "passed_lower": null,
             "signed": null
           }
          }).write()
      
      }
      }
    
    getData();