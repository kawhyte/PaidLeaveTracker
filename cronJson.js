if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let cron = require("node-cron");
const fetch = require("node-fetch");
let db = require("./db");
let sendToFirebase = require("./import");
const limitPerPage = 25;
var _ = require("lodash");
// const { DateTime } = require("luxon");
// import { formatDistance, subDays } from 'date-fns'
let differenceInCalendarDays = require("date-fns/differenceInCalendarDays");
var format = require("date-fns/format");

let state = [
  'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
  'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
  'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
  'VT','VI','VA','WA','WV','WI','WY'
 ];

function getData() {
  try {
    console.log("Waiting on for Cron...");
    runCron();
    // cron.schedule("*/6 * * * *", () => {
    //   // cron.schedule("05 0,12,15 * * SUN-SAT", () => {
    //   console.log("running a cron every XX minute");

    //   runCron();
    // });
  } catch (error) {
    // Sentry.captureException("Failed to run Cron Job ", error);
    return error;
  }
}

console.log("Loading cron job");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getUsers = async function(pageNo = 0) {

  //console.log("STATE ",state[pageNo])
  // let actualUrl = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}&search_window=term&updated_since=2019-08-01`;
  let actualUrl = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=1&per_page=${limitPerPage}&state=${state[pageNo].toLowerCase()}`;

  var apiResults = await fetch(actualUrl, {
    headers: { "X-API-KEY": process.env.OPENSTATES }
  }).then(resp => {
  
    return resp.json();
  });
  console.log("💤 🛌...I am sleeping for 4 seconds" );
    await sleep(4000);
  return apiResults;
};

const getEntireUserList = async function(pageNo = 0) {
  const results = await getUsers(pageNo);
  console.log("Retreiving data from API for : " + state[pageNo]);
  var removed = state.splice(pageNo,1);

  console.log("Just removed ", removed)
  
  if (state && state.length) {
    
    return results.concat(await getEntireUserList(pageNo));
  } else {
    return results;
  }
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
      }).then( () =>{ 

        console.log("Populate array......")

        state = [
          'AL','AK','AS','AZ','AR','CA','CO','CT','DE','DC','FM','FL','GA',
          'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
          'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
          'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
          'VT','VI','VA','WA','WV','WI','WY'
         ];

        });
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


getData()

