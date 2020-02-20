// DOM elements
const tweet = document.getElementById("tweet");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".lg-gallery");
let tempArray = [];


function generateHTML(data, index) {
  const arrayLength = data.bill.history.length;
  let billHistory = "";
  let val = " "; 





  if (arrayLength > 0) {
    billHistory = data.bill.history[arrayLength - 1];
  }
 //   console.log("Bill History ",data.bill.status_date)
  // console.log("Bill History date ", billHistory.date)
  // console.log("Bill History action ", billHistory.action)
 

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

  let billStatus = {
    0: "I dont know what happened",
    1: "Introduced",
    2: "Engrossed",
    3: "Enrolled",
    4: "Passed",
    5: "Vetoed",
    6: "Failed",
    7: "Override",
    8: "Chaptered",
    9: "Refer",
    10: "Report Pass",
    10: "Report DNP",
    10: "Draft"
  };

  // let state = {
  //   "AL": "Alabama", 
  //   "AK": "Alaska",
  //   "AZ": "Arizona", 
  //   "AR": "Arkansas",
  //   "CA": "California", 
  //   "CO": "Colorado",
  //   "CT": "Connecticut",
  //   "DE": "Delaware", 
  //   "FL": "Florida", 
  //   "GA": "Georgia", 
  //   "HI": "Hawaii",
  //   "ID": "Idaho",  
  //   "IL": "Illinois",
  //   "IN": "Indiana",
  //   "IA": "Iowa",
  //   "KS": "Kansas",
  //   "KY": "Kentucky", 
  //   "LA": "Louisiana", 
  //   "ME": "Maine", 
  //   "MD": "Maryland", 
  //   "MA": "Massachusetts", 
  //   "MI": "Michigan", 
  //   "MN": "Minnesota", 
  //   "MS": "Mississippi", 
  //   "MO": "Missouri", 
  //   "MT": "Montana", 
  //   "NE": "Nebraska", 
  //   "NV": "Nevada", 
  //   "NH": "New Hampshire", 
  //   "NJ": "New Jersey", 
  //   "NM": "New Mexico", 
  //   "NY": "New York", 
  //   "NC": "North Carolina", 
  //   "ND": "North Dakota", 
  //   "OH": "Ohio", 
  //   "OK": "Oklahoma", 
  //   "OR": "Oregon", 
  //   "PA": "Pennsylvania", 
  //   "RI": "Rhode Island", 
  //   "SC": "South Carolina",
  //   "SD": "South Dakota", 
  //   "TN": "Tennessee", 
  //   "TX": "Texas", 
  //   "UT": "Utah", 
  //   "VT": "Vermont", 
  //   "VA": "Virginia", 
  //   "WA": "Washington", 
  //   "WV": "West Virginia", 
  //   "WI": "Wisconsin", 
  //   "WY": "Wyoming", 
  //   }
  let state = {
    "AL": {name:"Alabama", flag:"Flag_of_Alabama.svg"}, 
    "AK": {name:"Alaska", flag:"Flag_of_Alaska.svg"},
    "AZ": {name:"Arizona", flag:"Flag_of_Arizona.svg"}, 
    "AR": {name:"Arkansas", flag:"Flag_of_Arkansas.svg"},
    "CA": {name: "California", flag:"Flag_of_California.svg"}, 
    "CO": {name:"Colorado", flag:"Flag_of_Colorado.svg"},
    "CT": {name:"Connecticut", flag:"Flag_of_Connecticut.svg"},
    "DE": {name:"Delaware", flag:"Flag_of_Delaware.svg"}, 
    "FL": {name:"Florida", flag:"Flag_of_Florida.svg"}, 
    "GA": {name:"Georgia", flag:"Flag_of_Georgia.svg"}, 
    "HI": {name:"Hawaii", flag:"Flag_of_Hawaii.svg"},
    "ID": {name:"Idaho", flag:"Flag_of_Idaho.svg"},  
    "IL": {name:"Illinois", flag:"Flag_of_Illinois.svg"},
    "IN": {name:"Indiana", flag:"Flag_of_Illinois.svg"},
    "IA": {name:"Iowa", flag:"Flag_of_Iowa.svg"},
    "KS": {name:"Kansas", flag:"Flag_of_Kansas.svg"},
    "KY": {name:"Kentucky", flag:"Flag_of_Kentucky.svg"}, 
    "LA": {name:"Louisiana", flag:"Flag_of_Louisiana.svg"}, 
    "ME": {name:"Maine", flag:"Flag_of_Maine.svg"}, 
    "MD": {name:"Maryland", flag:"Flag_of_Maryland.svg"}, 
    "MA": {name:"Massachusetts", flag:"Flag_of_Massachusetts.svg"}, 
    "MI": {name:"Michigan", flag:"Flag_of_Michigan.svg"}, 
    "MN": {name:"Minnesota", flag:"Flag_of_Minnesota.svg"}, 
    "MS": {name:"Mississippi", flag:"Flag_of_Mississippi.svg"}, 
    "MO": {name:"Missouri", flag:"Flag_of_Missouri.svg"}, 
    "MT": {name:"Montana", flag:"Flag_of_Montana.svg"}, 
    "NE": {name:"Nebraska", flag:"Flag_of_Nebraska.svg"}, 
    "NV": {name:"Nevada", flag:"Flag_of_Nevada.svg"}, 
    "NH": {name:"New Hampshire", flag:"Flag_of_New_Hampshire.svg"}, 
    "NJ": {name:"New Jersey", flag:"Flag_of_New_Jersey.svg"}, 
    "NM": {name:"New Mexico", flag:"Flag_of_New_Mexico.svg"}, 
    "NY": {name:"New York", flag:"Flag_of_New_York.svg"}, 
    "NC": {name:"North Carolina", flag:"Flag_of_North_Carolina.svg"}, 
    "ND": {name:"North Dakota", flag:"Flag_of_North_Dakota.svg"}, 
    "OH": {name: "Ohio",flag:"Flag_of_Ohio.svg"}, 
    "OK": {name:"Oklahoma", flag:"Flag_of_Oklahoma.svg"}, 
    "OR": {name:"Oregon", flag:"Flag_of_Oregon.svg"}, 
    "PA": {name:"Pennsylvania", flag:"Pennsylvania.svg"}, 
    "RI": {name:"Rhode Island", flag:"Rhode_Island.svg"}, 
    "SC": {name:"South Carolina", flag:"Flag_of_South_Carolina.svg"},
    "SD": {name:"South Dakota", flag:"Flag_of_South_Dakota.svg"}, 
    "TN": {name:"Tennessee", flag:"Flag_of_Tennessee.svg"}, 
    "TX": {name:"Texas", flag:"Flag_of_Texas.svg"}, 
    "UT": {name:"Utah", flag:"Flag_of_Utah.svg"}, 
    "VT": {name:"Vermont", flag:"Flag_of_Vermont.svg"}, 
    "VA": {name:"Virginia", flag:"Flag_of_Virginia.svg"}, 
    "WA": {name:"Washington", flag:"Flag_of_Washington.svg"}, 
    "WV": {name:"West Virginia", flag:"Flag_of_West_Virginia.svg"}, 
    "WI": {name:"Wisconsin", flag:"Flag_of_Wisconsin.svg"}, 
    "WY": {name:"Wyoming", flag:"Flag_of_Wyoming.svg"}
    }

   console.log("STATE ", state[data.bill.state][0]);

  // if (
  //   typeof skyGradient[index] === "undefined" ||
  //   skyGradient[index] === null
  // ) {
  //   val = "url('./img/blur.jpg') no-repeat center";
  //   //document.getElementById("bg").style.background =
  //   // console.log("VAL inside ", val);
  //   //return;
  //   //br
  // } else {
    
  // }
  
  stateData = state[data.bill.state];
  console.log("VAL amm ", stateData.name);

  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div id ="bg" class="vh-10 dt w-100 tc bg-dark-gray white cover" style="background:url('./img/triangles.png') no-repeat center;">

                    <h1 class="f3 fw2 white mv0 pv4 ph3">${
                      stateData.name
                    } - <span>${data.bill.bill_number}</span></h1>
                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph3 pv3">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                <div class="">
                                    <div class="ttu f6 fw2 gray"><span> ${(data.bill.status_date =
                                      data.bill.status_date !== null
                                        ? data.bill.status_date
                                        : "No data available")} ${billHistory.action =  billHistory.action !== null || billHistory.action.length >0  ? "- Bill " + billHistory.action : "null"}</span></div>
                                    <div>
                                        <div class="pt3 f2 f2-m fw5">1 of 3</div>
                                        <div class="pt2 w-100 dt dt--fixed">
                                   
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>House</small></div>
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>Senate</small></div>
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>Gov</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>
                                        <div class="pt2 o-80 measure-narrow  truncate"><small> Last Action: ${(billHistory.date =
                                            arrayLength > 0 ? billHistory.date : " ")}  ${(billHistory.action =
                                          arrayLength > 0
                                            ? billHistory.action
                                            : "No history available")}  </small></div>
                                       
                                    </div>

                                </div>
                            </div>

                        </div>

                    </article>

                    <div class=" bb b--light-gray bg-white gray w-100 ph3 pv0">
                        <div class="w-100 pb0 flex items-center justify-between">
                        
                        <p class= " mw4 f6 lh-copy measure-narrow  truncate tl"> ${
                          data.bill.title
                        }</p>
                         
                        </div>

                    </div>

                    <div class="flex items-center lh-copy pa3 s ph0-l bb b--black-10">

                   
                    <img class="pl3 w2 h2 w3-ns h3-ns br-100" src="./img/state_flags/${stateData.flag}" />
                    <div class="pl3 flex-auto">
                      <span class="f6 db black-70">${data.bill.state}</span>
                      <span class="f6 db black-70">${data.bill.sponsers.length} bill sponsers</span>
                    </div>
                    <div>
                    <a href="${
                        data.bill.state_link
                      }" target="_blank" class="pa3 f6 link blue hover-dark-gray">More info</a>
                    </div>
                    
                    
                    
                   

                    </div>
                </div>
        </div>
  `;
}

//  fetch('/db.json', options)
// .then(resp => { return resp.json()})
// .then(data => {
//   //console.log(data);

//   const html = data.map(generateHTML).join("");
//   console.log(html);
//   gallery.innerHTML = html;
// }
// );
// let sorted = fetch("./db.json", {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// })
//   .then(r => r.json())
//   .then(json => {
//     let sortedBydate = json.twitter.sort((a, b) => {
//       return new Date(b.dateTweeted) - new Date(a.dateTweeted);
//     });

//     console.log("SORTED ", sortedBydate);

//     var html = sortedBydate
//       .map((currElement, index) => {
//         return (html = generateHTML(currElement, index));
//       })
//       .join(" ");

//     console.log("OUTSIDE", html);
//     gallery.innerHTML = html;
//   });

// fetch("http://localhost:8887/track", {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json"
//   }
// })
//   .then(r => r.json())
//   .then(json => {
// // console.log("LG.JS", json);

//  arraySize = json[0].bill.history[0];
// // console.log("arraySize", arraySize);
 
//     let sortedBydate = json.sort((a, b) => {
        
//         // let test = b.bill.history.sort((c,d) =>{
//         //     // console.log("c", c.date);
//         //     return new Date(c.date) - new Date(d.date);

//         // });
//         // if (
//         //     b.bill.history > 0 ||typeof b.bill.history.pop().date !== "undefined" ||
//         //     b.bill.history.pop().date !== null
//         //   ) {

//         //    console.log("popped", b.bill.history.pop().date); 
//         //   }
//         // console.log("b", b.bill.history);
//         // console.log("b.date", b.date);
        
//         //  console.log("a.status_date", a.status_date);

//         // let popped =  b.bill.history.pop()

     
//         // console.log("b.popped ", b.popped)

       
//         return new Date(b.status_date) - new Date(a.status_date);
//       });

//       console.log("SORTED ", sortedBydate);


//     //   tempArray.push(json.bill)
    
//     var html = sortedBydate
//       .map((currElement, index) => {
//         return (html = generateHTML(currElement, index));
//       })
//       .join(" ");

//     // console.log("OUTSIDE", html)
//     gallery.innerHTML = html;
//   });


