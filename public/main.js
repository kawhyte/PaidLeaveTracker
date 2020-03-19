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
  console.log("🍧 ", index, data)
  let billPassed = data.actions.filter(house => {
    let found = false;
    house.type.forEach(element => {
      if (element === "bill:passed" || element === "governor:signed") {
        found = true;
      }
    });
    return found;
  });

  
  let lastBillAction = data.actions[data.actions.length - 1];

  listArray.push(data.state.toUpperCase());
  lowercaseTitle = data.title.toLowerCase()

  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div class="vh-10 dt w-100 tc bg-black white">

                    <div class="pt3 f3-m flex  justify-around fw5 black">    
                    <span><img class="white h2 w3-ns h2-ns br3"  alt= "Flag_of_${data.stateName}" src="${data.stateFlagURL}" /> </span>                    
                    <h3 class="f5 f4-m measure-narrow lh-title mv0">
                        <span class=" lh-copy bg-near-black white pa1 tracked-tight">${data.stateName} - ${data.bill_id}</span>
                    </h3>
                    <span>${data.isBillNew ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib navy bg-washed-red">Recently Added</a>': ""} 
                          ${data.isLastUpdateImportant ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib navy bg-washed-green">Major Update</a>': ""}
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
                                   
                                            <div class="dtc h1 black ${
                                              data.action_dates.first.length > 0
                                                ? "bg-green"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Introduced</small></div>
                                            <div class="dtc h1 black ${
                                              billPassed.some(
                                                item => item.actor === "lower"
                                              )
                                                ? "bg-green"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>House</small></div>
                                            <div class="dtc h1 black ${
                                              billPassed.some(
                                                item => item.actor === "upper"
                                              )
                                                ? "bg-green"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Senate</small></div>
                                            <div class="dtc h1 black ${
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
                                                ? "bg-green"
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
                        <dt class="f6 b mt2 bg-white">STATE WEBSITE</dt>
                      
                        ${data.sources.map((url, i) =>{

                          return(`<dd class="ml0"> <a href="${data.sources[i].url}" target="_blank" rel="noopener" class="f6 link dark-blue hover-dark-gray">${data.stateName } State Legislature (Link ${i+1})</a></dd>`)

                        }).join("")}
                        
                      </dl>
                </div>
              </article>
   </div>
  `;
}

const loadBills = () => {
  try {
    // const res = fetch("/data-clean/firebase/test.json", {
    // const res = fetch("http://localhost:8887/track", {
      // const res = fetch("http://localhost:5001/track", {
      const res = fetch("https://paidleavetracker.herokuapp.com/track", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(r => r.json())
      .then(json => {


         console.log(json)
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

  gallery.innerHTML = html;
};

loadBills();

function formatDate(input) {
  var date = new Date(input);
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear()
  ].join("/");
}

