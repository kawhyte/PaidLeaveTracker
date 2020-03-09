if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let cron = require("node-cron");

const fetch = require("node-fetch");
let db = require("./db");
let sendToFirebase = require("./import");
const limitPerPage = 50;
var _ = require("lodash");


console.log("Loaded cronJson");

function getData() {
  console.log("Waiting on Cron...");
  // cron.schedule("* * * * *", () => {
  cron.schedule("*/30 * * * *", () => {
    console.log("running a cron every XX minute");

    runCron();
  });
}



const getUsers = async function(pageNo = 1) {
  let actualUrl = `https://openstates.org/api/v1/bills/?q="paid+family+leave"&page=${pageNo}&per_page=${limitPerPage}&search_window=session:2019&updated_since=2019-08-01`;

  var apiResults = await fetch(actualUrl, {
    headers: { "X-API-KEY": process.env.OPENSTATES }
  }).then(resp => {
    return resp.json();
  });

  return apiResults;
};

const getEntireUserList = async function(pageNo = 1) {

  const results = await getUsers(pageNo);
  console.log("Retreiving data from API for page : " + pageNo);

  if (results.length > 0) {

    return results.concat(await getEntireUserList(pageNo + 1));
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
      });
  })();
}

function addToJsonFile(entireList) {
  for (let index = 0; index < entireList.length; index++) {
    let value = db
      .get("bills")
      .find({ bill_id: entireList[index].bill_id })
      .value();

    // console.log("🌈 typeof value", typeof (value) );
    // console.log("🌈 value bill id", typeof (value.bill_id) );
    // console.log("🌈  JSON.stringify(entireList[index].bill_id.trim())",  JSON.stringify(entireList[index].bill_id.trim()));

    if (typeof value === "undefined" || value.bill_id === "undefined") {
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
          companions: entireList[index].companions,
          notificationSent: false
        })
        .write();
      console.log("🌈 Undefined - new record added");
    } else if (_.isEqual(value.bill_id, entireList[index].bill_id)) {
      if (
        !_.isEqual(value.actions, entireList[index].actions) ||
        !_.isEqual(value.updated_at, entireList[index].updated_at) ||
        !_.isEqual(value.action_dates, entireList[index].action_dates)
      ) {
        db.get("bills")
          .find({ bill_id: entireList[index].bill_id })
          .assign({
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
            companions: entireList[index].companions,
            notificationSent: false
          })
          .write();
        console.log("Updated ");
      }
    }
  }
}


getData(); 