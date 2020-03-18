// DOM elements
const count = document.getElementById("count");
let newBillCount = document.getElementById("newBillCount");
let majorUpdatesCount = document.getElementById("MajorUpdatesCount");
let pageUpdatedTime = document.getElementById("pageLastUpdated");
const filter_list = document.getElementById("filter-list");
const searchBar = document.getElementById("searchBar");
const gallery = document.querySelector(".lg-gallery");
let listArray = ["ALL"];
let billFilterButton = ["ALL"];
let fetchedBills = [];
let html = "";
let filteredItems = "";
let newBillsAdded = 0;
let pageUpdatedAt =""
let billsWithMajorUpdates = 0;



searchBar.addEventListener("keyup", e => {
  const searchString = e.target.value.toLowerCase().trim();

  const filteredBills = fetchedBills.filter(bill => {
    return (
      bill.state.toLowerCase().includes(searchString) ||
      // state[list].name.toLowerCase().includes(searchString) ||
      bill.bill_id.toLowerCase().includes(searchString) ||
      bill.bill_id
        .replace(/\s+/g, "")
        .toLowerCase()
        .includes(searchString)
    );
  });

  displayBills(filteredBills);
});

document.getElementById("filter-list").addEventListener("click", function(e) {
  console.log("EEEEE ", e);
  if (e.target && e.target.matches("a.item")) {
    console.log("searchItem ", e.target.dataset.parent);

    const searchItem = e.target.dataset.parent.toLowerCase().trim();
    console.log("searchItem ", searchItem); 

    if (searchItem === "all") {
      console.log("EE "); 
      displayBills(fetchedBills);
      return;
    } else if (searchItem === "recent") {
      filteredItems = fetchedBills.filter(bill => {
        return bill.isBillNew === true;
      });
    } else if (searchItem === "major") {
      filteredItems = fetchedBills.filter(bill => {
        return bill.isLastUpdateImportant === 1;
      });
    }

    console.log("📽️ Filtered ", filteredItems);
    displayBills(filteredItems);
  }
});

function generateHTML(data, index) {

  let billPassed = data.actions.filter(house => {
    let found = false;
    house.type.forEach(element => {
      if (element === "bill:passed" || element === "governor:signed") {
        found = true;
      }
    });
    return found;
  });

  // let status = {
  //   "bill:introduced": {
  //     name: "Introduced or prefiled",
  //     color: "bg-blue",
  //     importance: 0
  //   },
  //   "bill:passed": {
  //     name: "Bill has passed a chamber",
  //     color: "bg-yellow",
  //     importance: 1
  //   },
  //   "bill:failed": {
  //     name: "Failed to pass a chamber",
  //     color: "bg-red",
  //     importance: 1
  //   },
  //   "bill:withdrawn": {
  //     name: "Withdrawn from consideration",
  //     color: "bg-red",
  //     importance: 1
  //   },
  //   "bill:veto_override:passed": {
  //     name: "Chamber attempted a veto override and succeeded",
  //     color: "bg-green",
  //     importance: 1
  //   },
  //   "bill:veto_override:failed": {
  //     name: "Chamber attempted a veto override and failed",
  //     color: "bg-red",
  //     importance: 1
  //   },
  //   "bill:reading:1": {
  //     name: "Bill has undergone its first reading",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "bill:reading:2": {
  //     name: "Bill has undergone its second reading",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "bill:reading:3": {
  //     name: "Bill has undergone its third (or final) reading",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "bill:filed": {
  //     name: "Bill has been filed",
  //     color: "bg-yellow",
  //     importance: 1
  //   },
  //   "bill:substituted": {
  //     name: "Bill has been replaced with a substituted wholesale",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "governor:received": {
  //     name: "Bill has been transmitted to the governor for consideration",
  //     color: "bg-yellow",
  //     importance: 1
  //   },
  //   "governor:signed": {
  //     name: "Bill was signed into law by the governor",
  //     color: "bg-green",
  //     importance: 1
  //   },
  //   "governor:vetoed": {
  //     name: "Bill has been vetoed by the governor",
  //     color: "bg-red",
  //     importance: 1
  //   },
  //   "governor:vetoed:line-item": {
  //     name: "Governor has issued a partial veto",
  //     color: "bg-light-yellow",
  //     importance: 1
  //   },
  //   "amendment:introduced": {
  //     name: "An amendment has been offered on the bill",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "amendment:passed": {
  //     name: "The bill has been amended",
  //     color: "bg-light-yellow",
  //     importance: 0
  //   },
  //   "amendment:failed": {
  //     name: "An offered amendment has failed",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "amendment:amended": {
  //     name: "An offered amendment has been amended",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "amendment:withdrawn": {
  //     name: "An offered amendment has been withdrawn",
  //     color: "bg-pink",
  //     importance: 0
  //   },
  //   "amendment:tabled": {
  //     name: "An amendment has been ‘laid on the table’",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "committee:referred": {
  //     name: "Bill referred to a committee",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "committee:passed": {
  //     name: "Bill has been passed out of a committee",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "committee:passed:favorable": {
  //     name: "Bill has been passed out of a committee with a favorable report",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "committee:passed:unfavorable": {
  //     name:
  //       "Bill has been passed out of a committee with an unfavorable report",
  //     color: "bg-yellow",
  //     importance: 0
  //   },
  //   "committee:failed": {
  //     name: "Bill has failed to make it out of committee",
  //     color: "bg-red",
  //     importance: 0
  //   },

  //   null: {
  //     name: "(Pending) View state website",
  //     color: "bg-light-yellow",
  //     importance: 0
  //   }
  // };

   let lastBillAction = data.actions[data.actions.length - 1];

  // if (
  //   typeof status[lastBillAction.type] === "undefined" ||
  //   status[lastBillAction.type] === null
  // ) {

  //   //billStatus = status["null"];
  //   billStatus.name  = null;
  // } else {
  //   billStatus = status[lastBillAction.type];
  // }

  // stateData   = state[data.state.toUpperCase()];

  listArray.push(data.state.toUpperCase());
  lowercaseTitle = data.title.toLowerCase()

  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div id ="bg" class="vh-10 dt w-100 tc bg-black white">

                    <div class="pt3 f3-m flex  justify-around fw5 black">    
                    <span><img class="white h2 w3-ns h2-ns br3" src="${data.stateFlagURL}" /> </span>                    
                    <h3 class="f5 f4-m measure-narrow lh-title mv0">
                        <span class=" lh-copy bg-near-black white pa1 tracked-tight">${data.stateName} - ${data.bill_id}</span>
                    </h3>
                    <span>${data.isBillNew ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib black bg-light-gray">Recently Added</a>': ""} 
                          ${data.isLastUpdateImportant ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib white bg-blue">Major Update</a>': ""}
                    </span>
                    </div>

                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph3 pv3">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                    <div class="pt3  f3-m fw5 white">
                                            
                                    <h3 class="f4 f4-m measure-narrow lh-title mv0">
                                        <span class="${
                                          data.statusColor
                                        } lh-copy black pa1 tracked-tight">
                                         ${data.statusName} 
                                        </span>
                                      </h3>
                               
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
                       
                        <dl class="lh-title pt0 pl3 pr3 mt0">
                        <dt class="f6 b mt2">LATEST ACTION</dt>
                        <dd class="f6 ml0">${lastBillAction.action} (${formatDate(lastBillAction.date)})</dd>
                        <dt class="f6 b">BILL TITLE</dt>
                        <dd class="f6 ml0 truncate">${ lowercaseTitle[0].toUpperCase() + lowercaseTitle.substring(1)}</dd>
                        <dt class="f6 b mt2">BILL CREATED</dt>
                        <dd class="f6 ml0">${(data.created_at = data.created_at !== null ? (data.created_at): "No data available")}</dd>
                        <dt class="f6 b mt2">BILL SPONSORS</dt>
                        <dd class="ml0">${data.sponsors.length} ${data.sponsors.length > 1 ? "bill sponsors" : "bill sponsor"}</dd>
                        <dt class="f6 b mt2">STATE WEBSITE</dt>
                        <dd class="ml0">   <a href="${data.sources[0].url}" target="_blank" class="f6 link blue hover-dark-gray">${data.stateName } State Legislature</a></dd>
                      </dl>
                </div>
              </article>
   </div>
  `;
}

const loadBills = () => {
  try {
    // const res = fetch("/data-clean/firebase/test.json", {
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
        newBillsAdded = json.filter(bill => {
          return bill.isBillNew === true;
        });

        billsWithMajorUpdates = json.filter(bill => {
          return bill.isLastUpdateImportant === 1;
        });

        pageUpdatedAt = json.filter(bill => {
          return bill.dbUpdatedTime;
        });

        count.innerHTML = `All Bills (${Object.keys(json).length})`;
        newBillCount.innerHTML = `New Bills (${Object.keys(newBillsAdded).length})`;
        majorUpdatesCount.innerHTML = `Major Updates (${Object.keys(billsWithMajorUpdates).length})`;
        pageUpdatedTime.innerHTML = `Information updated ${pageUpdatedAt[pageUpdatedAt.length - 1].dbUpdatedTime}`;

        fetchedBills = json;

        displayBills(fetchedBills);
      });
  } catch (err) {
    console.error(err);
  }
};

const displayBills = bills => {

  html = bills
    .map((bills, index) => {
      return (html = generateHTML(bills, index));
    })
    .join("");

  // list = Array.from(new Set(listArray))
  //   .map(item => {
  //     return (list = createList(item));
  //   })
  //   .join("");

  // filter_list.innerHTML = list;

  gallery.innerHTML = html;
};

loadBills();
// createList();

function formatDate(input) {
  var date = new Date(input);
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear()
  ].join("/");
}

