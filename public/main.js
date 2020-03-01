// DOM elements
const tweet = document.getElementById("tweet");
const searchBar = document.getElementById("searchBar");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".lg-gallery");
let tempArray = [];
let fetchedBills = [];
let html = "";
let passedSenate = false;
let passedHouse = false;

searchBar.addEventListener("keyup", e => {
  const searchString = e.target.value.toLowerCase().trim();
  // console.log(searchString);

  const filteredBills = fetchedBills.filter(bill => {
    return (
      bill.state.toLowerCase().includes(searchString) ||
      bill.bill_id.toLowerCase().includes(searchString)
    );
  });
  // console.log("✊Filtered ", filteredBills);
  displayBills(filteredBills);
});

function generateHTML(data) {
  let billHistory = "";
  let billStaus = 0;

  //  console.log("🧪 Bill ID: ",data.bill_id);
  //let billPassedSenate =  data.actions.filter(x => x.type.find(y => y === 'bill:passed')  && x.actor==='upper')

  // let billPassedHouse =  data.actions.filter(x => x.type[0] === 'bill:passed' && x.actor==='lower')
  
  
  
  let billPassed = data.actions.filter(house => {
    let found = false;
    house.type.forEach(element => {
      // console.log(element);
      if (element === "bill:passed" || element === "governor:signed") {
        found = true;
      }
    });
    return found;
  });


  let skyGradient = {
    1: "url('./img/pencils.jpg') no-repeat center",
    2: "url('./img/triangles.png') no-repeat center",
    3: "url('./img/trianglify1.png') no-repeat center",
    4: "url('./img/triangles.png') no-repeat center",
    5: "url('./img/triangles.png') no-repeat center",
    6: "url('./img/triangles.png') no-repeat center",
    7: "url('./img/triangles.png') no-repeat center",
    8: "url('./img/triangles.png') no-repeat center",
    9: "url('./img/triangles.png') no-repeat center",
    10: "url('./img/triangles.png') no-repeat center"
  };

  let status = {
    "bill:introduced": { name: "Introduced or prefiled", color: "bg-blue" },
    "bill:passed": { name: "Bill has passed a chamber", color: "bg-yellow" },
    "bill:failed": { name: "Failed to pass a chamber", color: "bg-red" },
    "bill:withdrawn": { name: "Withdrawn from consideration", color: "bg-red" },
    "bill:veto_override:passed": {
      name: "Chamber attempted a veto override and succeeded",
      color: "bg-green"
    },
    "bill:veto_override:failed": {
      name: "Chamber attempted a veto override and failed",
      color: "bg-red"
    },
    "bill:reading:1": {
      name: "Bill has undergone its first reading",
      color: "bg-yellow"
    },
    "bill:reading:2": {
      name: "Bill has undergone its second reading",
      color: "bg-yellow"
    },
    "bill:reading:3": {
      name: "Bill has undergone its third (or final) reading",
      color: "bg-yellow"
    },
    "bill:filed": { name: "Bill has been filed", color: "bg-yellow" },
    "bill:substituted": {
      name: "Bill has been replaced with a substituted wholesale",
      color: "bg-yellow"
    },
    "governor:received": {
      name: "Bill has been transmitted to the governor for consideration",
      color: "bg-yellow"
    },
    "governor:signed": {
      name: "Bill was signed into law by the governor",
      color: "bg-green"
    },
    "governor:vetoed": {
      name: "Bill has been vetoed by the governor",
      color: "bg-red"
    },
    "governor:vetoed:line-item": {
      name: "Governor has issued a partial veto",
      color: "bg-light-yellow"
    },
    "amendment:introduced": {
      name: "An amendment has been offered on the bill",
      color: "bg-yellow"
    },
    "amendment:passed": { name: "The bill has been amended", color: "bg-light-yellow" },
    "amendment:failed": {
      name: "An offered amendment has failed",
      color: "bg-yellow"
    },
    "amendment:amended": {
      name: "An offered amendment has been amended",
      color: "bg-yellow"
    },
    "amendment:withdrawn": {
      name: "An offered amendment has been withdrawn",
      color: "bg-pink"
    },
    "amendment:tabled": {
      name: "An amendment has been ‘laid on the table’",
      color: "bg-yellow"
    },
    "committee:referred": {
      name: "Bill referred to a committee",
      color: "bg-yellow"
    },
    "committee:passed": {
      name: "Bill has been passed out of a committee",
      color: "bg-yellow"
    },
    "committee:passed:favorable": {
      name: "Bill has been passed out of a committee with a favorable report",
      color: "bg-yellow"
    },
    "committee:passed:unfavorable": {
      name:
        "Bill has been passed out of a committee with an unfavorable report",
      color: "bg-yellow"
    },
    "committee:failed": {
      name: "Bill has failed to make it out of committee",
      color: "bg-red"
    },

    null: { name: "(Pending) View state website", color: "bg-light-yellow" }
  };

  let state = {
    AL: { name: "Alabama", flag: "Flag_of_Alabama.svg" },
    AK: { name: "Alaska", flag: "Flag_of_Alaska.svg" },
    AZ: { name: "Arizona", flag: "Flag_of_Arizona.svg" },
    AR: { name: "Arkansas", flag: "Flag_of_Arkansas.svg" },
    CA: { name: "California", flag: "Flag_of_California.svg" },
    CO: { name: "Colorado", flag: "Flag_of_Colorado.svg" },
    CT: { name: "Connecticut", flag: "Flag_of_Connecticut.svg" },
    DE: { name: "Delaware", flag: "Flag_of_Delaware.svg" },
    DC: { name: "Delaware", flag: "Flag_of_Delaware.svg" },
    FL: { name: "Florida", flag: "Flag_of_Florida.svg" },
    GA: { name: "Georgia", flag: "Flag_of_Georgia.svg" },
    HI: { name: "Hawaii", flag: "Flag_of_Hawaii.svg" },
    ID: { name: "Idaho", flag: "Flag_of_Idaho.svg" },
    IL: { name: "Illinois", flag: "Flag_of_Illinois.svg" },
    IN: { name: "Indiana", flag: "Flag_of_Illinois.svg" },
    IA: { name: "Iowa", flag: "Flag_of_Iowa.svg" },
    KS: { name: "Kansas", flag: "Flag_of_Kansas.svg" },
    KY: { name: "Kentucky", flag: "Flag_of_Kentucky.svg" },
    LA: { name: "Louisiana", flag: "Flag_of_Louisiana.svg" },
    ME: { name: "Maine", flag: "Flag_of_Maine.svg" },
    MD: { name: "Maryland", flag: "Flag_of_Maryland.svg" },
    MA: { name: "Massachusetts", flag: "Flag_of_Massachusetts.svg" },
    MI: { name: "Michigan", flag: "Flag_of_Michigan.svg" },
    MN: { name: "Minnesota", flag: "Flag_of_Minnesota.svg" },
    MS: { name: "Mississippi", flag: "Flag_of_Mississippi.svg" },
    MO: { name: "Missouri", flag: "Flag_of_Missouri.svg" },
    MT: { name: "Montana", flag: "Flag_of_Montana.svg" },
    NE: { name: "Nebraska", flag: "Flag_of_Nebraska.svg" },
    NV: { name: "Nevada", flag: "Flag_of_Nevada.svg" },
    NH: { name: "New Hampshire", flag: "Flag_of_New_Hampshire.svg" },
    NJ: { name: "New Jersey", flag: "Flag_of_New_Jersey.svg" },
    NM: { name: "New Mexico", flag: "Flag_of_New_Mexico.svg" },
    NY: { name: "New York", flag: "Flag_of_New_York.svg" },
    NC: { name: "North Carolina", flag: "Flag_of_North_Carolina.svg" },
    ND: { name: "North Dakota", flag: "Flag_of_North_Dakota.svg" },
    OH: { name: "Ohio", flag: "Flag_of_Ohio.svg" },
    OK: { name: "Oklahoma", flag: "Flag_of_Oklahoma.svg" },
    OR: { name: "Oregon", flag: "Flag_of_Oregon.svg" },
    PA: { name: "Pennsylvania", flag: "Flag_of_Pennsylvania.svg" },
    RI: { name: "Rhode Island", flag: "Rhode_Island.svg" },
    SC: { name: "South Carolina", flag: "Flag_of_South_Carolina.svg" },
    SD: { name: "South Dakota", flag: "Flag_of_South_Dakota.svg" },
    TN: { name: "Tennessee", flag: "Flag_of_Tennessee.svg" },
    TX: { name: "Texas", flag: "Flag_of_Texas.svg" },
    UT: { name: "Utah", flag: "Flag_of_Utah.svg" },
    VT: { name: "Vermont", flag: "Flag_of_Vermont.svg" },
    VA: { name: "Virginia", flag: "Flag_of_Virginia.svg" },
    WA: { name: "Washington", flag: "Flag_of_Washington.svg" },
    WV: { name: "West Virginia", flag: "Flag_of_West_Virginia.svg" },
    WI: { name: "Wisconsin", flag: "Flag_of_Wisconsin.svg" },
    WY: { name: "Wyoming", flag: "Flag_of_Wyoming.svg" }
  };

  // let lastBillAction = data.actions.pop();
  let lastBillAction = data.actions[data.actions.length - 1];
  // console.log(lastBillAction)

  if (
    typeof status[lastBillAction.type] === "undefined" ||
    status[lastBillAction.type] === null
  ) {
    // console.log("status[popped.type] is undefined!!!");
    billStatus = status["null"];
  } else {
    billStatus = status[lastBillAction.type];
  }
  // console.log("🧢 status", data.bill_id, lastBillAction.type);

  stateData = state[data.state.toUpperCase()];
  //  console.log( "DATE ",formatDate(data.created_at))

  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div id ="bg" class="vh-10 dt w-100 tc bg-dark-gray white cover" style="background:url('./img/triangles.png') no-repeat center;">

                    <div class="pt3 f3-m fw5 white">                       
                    <h3 class="f3 f3-m measure-narrow lh-title mv0">
                        <span class=" lh-copy white pa1 tracked-tight">
                        ${stateData.name} - ${data.bill_id}</span>
                    </h3>
                    </div>

                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph3 pv3">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                <div class="">
                                    <div class="f5 fw2 gray measure-narrow o-80 mv0">Last update:<span class= "lh-copy gray o-80 pa1 tracked-tight">${
                                      lastBillAction.action
                                    } <span  class="gray o-80"> - ${formatDate(
    lastBillAction.date
  )} </span>  </span></div>
                                    <div>
                                    <div class="pt3  f3-m fw5 white">
                                            
                                    <h3 class="f3 f3-m measure-narrow lh-title mv0">
                                        <span class="${
                                          billStatus.color
                                        } lh-copy black pa1 tracked-tight">
                                         ${billStatus.name} 
                                        </span>
                                      </h3>
                                </div>
                                        <div class="pt2 w-100 dt dt--fixed">
                                   
                                            <div class="dtc h1 white ${
                                              data.action_dates.first.length > 0
                                                ? "bg-blue"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Introduced</small></div>
                                            <div class="dtc h1 white ${
                                              billPassed.some(
                                                item => item.actor === "lower"
                                              )
                                                ? "bg-blue"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>House</small></div>
                                            <div class="dtc h1 white ${
                                              billPassed.some(
                                                item => item.actor === "upper"
                                              )
                                                ? "bg-blue"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Senate</small></div>
                                            <div class="dtc h1 white ${
                                              billPassed.some(
                                                item =>
                                                  item.actor === "executive" ||
                                                  lastBillAction.type ===
                                                    "governor:received" ||
                                                  lastBillAction.type ===
                                                    "governor:signed" ||
                                                  lastBillAction.type ===
                                                    "governor:vetoed" ||
                                                  lastBillAction.type ===
                                                    "governor:vetoed:line-item"
                                              )
                                                ? "bg-blue"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Gov</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>
                                 
                                       
                                    </div>

                                </div>
                            </div>

                        </div>

                    </article>

                    <div class=" bb b--light-gray bg-white gray w-100 ph3 pv0">
                        <div class="w-100 pb0 flex items-center justify-between">
                        
                        <p class= " mw4 f6 lh-copy measure-narrow  truncate tl"> ${
                          data.title
                        }</p>
                         
                        </div>

                    </div>

                    <div class="flex items-center lh-copy pa3 s ph0-l bb b--black-10">

                   
                    <img class="pl3 w2 h2 w3-ns h3-ns br-100" src="./img/state_flags/${
                      stateData.flag
                    }" />
                    <div class="pl3 flex-auto">
                      <span class="f6 db black-70">Bill created on ${(data.created_at =
                        data.created_at !== null
                          ? formatDate(data.created_at)
                          : "No data available")}</span>
                      <span class="f6 db black-70">${data.sponsors.length} ${
    data.sponsors.length > 1 ? "bill sponsors" : "bill sponsor"
  }</span>
                    </div>
                    <div>
                    <a href="${
                      data.sources[0].url
                    }" target="_blank" class="pa3 f6 link blue hover-dark-gray">State website</a>
                    </div>
                    </div>
                </div>
        </div>
  `;
}

const loadBills = () => {
  try {
    // const res = fetch("./test.json", {
    const res = fetch("http://localhost:8887/track", {
      // const res = fetch("http://localhost:5001/track", {
      // const res = fetch("https://paidleavetracker.herokuapp.com/track", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(r => r.json())
      .then(json => {
        // console.log(json)
        fetchedBills = json;

        displayBills(fetchedBills);
      });
  } catch (err) {
    console.error(err);
  }
};

const displayBills = bills => {
  html = bills
    .map(bills => {
      return (html = generateHTML(bills));
    })
    .join("");
  gallery.innerHTML = html;
};

// //  fetch("https://paidleavetracker.herokuapp.com/track", {
// fetch("http://localhost:8887/track", {
//   // fetch("http://localhost:9000/index", {
//   //fetch('/.netlify/functions/index', {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// })
//   .then(r => r.json())
//   .then(json => {
//     fetchedBills = json;

//     var html = fetchedBills
//       .map((currElement, index) => {
//         return (html = generateHTML(currElement, index));
//       })
//       .join(" ");

//     gallery.innerHTML = html;
//   });

loadBills();

function formatDate(input) {
  var date = new Date(input);
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear()
  ].join("/");
}
