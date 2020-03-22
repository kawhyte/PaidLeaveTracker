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
    // console.log("searchItem ", searchItem); 

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

    // console.log("📽️ Filtered ", filteredItems);
    displayBills(filteredItems);
  }
});

function generateHTML(data, index) {

  // console.log("🍧 ", index, data)
  let billPassed = data.actions.filter(house => {
    let found = false;
    house.type.forEach(element => {
      if (element === "bill:passed" || element === "governor:signed") {
        found = true;
      }
    });
    return found;
  });


   let houseDate = billPassed.filter(h =>{
    let found = false;
    h.type.forEach(element => {
      if (element === "bill:passed") {
        found = true;
      }
    });
    return found;

  })

   let senateDate = billPassed.filter(s =>{
    let found = false;
    s.type.forEach(element => {
      if (element === "bill:passed") {
        found = true;
      }
    });
    return found;

  })

   let govDate = billPassed.filter(s =>{
    let found = false;
    s.type.forEach(element => {
      if (element === "governor:signed") {
        found = true;
      }
    });
    return found;

  })


  
  let lastBillAction = data.actions[data.actions.length - 1];

  listArray.push(data.state.toUpperCase());
  lowercaseTitle = data.title.toLowerCase()

  return `
  <div class="div1 container ">

            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20 shadow-5">
                <div class="vh-10 dt w-100 tc b--black-20">

                <div class="tc mt3">
                <img src="${data.stateFlagURL}" alt= "Flag_of_${data.stateName}" class="br-100 h3 w3 dib" title="Photo of a kitty staring at you">
                <h1 class="f4">${data.stateName} - ${data.bill_id}</h1>
                <span>${data.isBillNew ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib navy bg-light-yellow">New</a>': ""} 
                ${data.isLastUpdateImportant ? '<a class="f6 grow no-underline br-pill ph2 pv1 mb2 dib navy bg-washed-green">Major Update</a>': ""}
                </span>

                <hr class="mw3 bb bw1 b--black-10">
              </div>

                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph0 pv0">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                    <div class="pt2 f3-m fw5 white">
                                            
                                    <h3 class="tc f4 f4-m measure-narrow lh-title mv0">
                                        <span class="${
                                          data.statusColor
                                        } lh-copy black pa1 tracked-tight">
                                         ${data.statusName} 
                                        </span>
                                      </h3>
                               
                                        <div class="pt3 pl3 pr3 w-100 dt dt--fixed">
                                   
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
                                                  item.actor === "executive" 
                                              ) || 
                                              billPassed.some(
                                                item =>
                                                  item.type.includes("governor:signed")  
                                              )
                                                ? "bg-green"
                                                : "bg-light-gray"
                                            } br1 br--left tc" style="width: 50%">
                                                <small>Gov</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>



                                        <div class="pt1 pl3 pr3 w-100 dt dt--fixed">
                                   
                                            <div class="dtc h1 black  br1 br--left tc" style="width: 50%">
                                                <small class= "f7 gray">${( data.actions[0].date = data.actions.length > 0  ? (data.actions[0].date).substring(0,10) : "No data available")}</small></div>
                                            <div class="dtc h1 black br1 br--left tc" style="width: 50%">
                                                <small class= "f7 gray">${ houseDate.length > 0 && houseDate.some(d => d.actor === "lower")
                                                    ? (houseDate[0].date).substring(0,10)
                                                    : " "
                                                }</small></div>
                                            <div class="dtc h1 black br1 br--left tc" style="width: 50%">
                                                <small class= "f7 gray" >${ senateDate.length > 0 && senateDate.some(d => d.actor === "upper")
                                                ? (senateDate[0].date).substring(0,10)
                                                : " "
                                            }</small></div>
                                            <div class="dtc h1 black  br1 br--left tc" style="width: 50%">
                                                <small class= "f7 gray" >${ govDate.length > 0 && (govDate.some(d => d.actor === "upper") || govDate.some(d => d.actor === "legislature") || govDate.some(d => d.actor === "executive") || govDate.some(d => d.type.includes() === "governor:signed"))
                                                ? (govDate[0].date).substring(0,10)
                                                : " "
                                            }</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>

                                </div>
                            </div>

                        </div>

                        <div class="pt3 pl3 pb0">
                        <small class="gray lh-title">Bill Title</small>
                        <span class="f6 db pv1 pr3 truncate">${ lowercaseTitle[0].toUpperCase() + lowercaseTitle.substring(1)}</span>
                        </div>

                        <div class="pt3 pl3 pb0">
                        <small class="gray lh-title">Latest Action Date</small>
                        <span class="f6 db pv1"><time>${(lastBillAction.date).substring(0,10)}</time></span>
                        </div>

                       

                        <div class="pt3 pl3 pb0">
                        <small class="gray lh-title">State Website</small>

                        ${data.sources.map((url, i) =>{

                          return(`<span class="f6 db pv2"> <a href="${data.sources[i].url}" target="_blank" rel="noopener" class="f6 link dark-blue hover-dark-gray">${data.stateName } State Legislature (Link ${i+1})</a></span>`)

                        }).join("")}

                        </div>

                </div>
                <div class=" pb3" > </div>
              </article>
   </div>
  `;
}

const loadBills = () => {
  try {
    // const res = fetch("/data-clean/firebase/test.json", {
    // const res = fetch("http://localhost:3000/track", {
      // const res = fetch("http://localhost:5001/track", {

      const res = fetch("https://paidleavetracker.herokuapp.com/track", {
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

  gallery.innerHTML = html;
};

loadBills();

function formatDate(input) {
  console.log("DATE ", input)
  var date = new Date(input);
  console.log("DATE ", date)
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear()
  ].join("/");
}

