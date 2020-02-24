// DOM elements
const tweet = document.getElementById("tweet");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".lg-gallery");
let tempArray = [];


function generateHTML(data, index) {
  // const arrayLength = data.bill.history.length;
  let billHistory = "";
  let billStaus = 0;
  console.log("bill_id ", data.bill_id)
//  console.log("data.actions!!!!", data.actions.filter(d => d.type.every(x => x.type === 'bill:passed')))
  let lastBillAction = data.actions.pop();
  let firstBillAction = data.actions.shift();
  //let billPassedSenate =  data.actions.filter(x => x.type.find(y => y === 'bill:passed')  && x.actor==='upper')
 
  // let billPassedHouse =  data.actions.filter(x => x.type[0] === 'bill:passed' && x.actor==='lower')
  // let billPassedHouse =  data.actions.every(x => Object.entries(x.type).forEach(([key, val]) => val.find(c => type.includes('bill:passed')))) 
  // let billPassedHouse =  data.actions.filter(x => x.type.every(y => y.includes( 'bill:passed' )) && x.actor==='lower')

  // let billPassedHouse =  data.actions.filter(x =>  Object.values(x.type).every(c=> c=== "bill:passed"))
  // let billPassedHouse =  data.actions.filter(x =>  Object.entries(x.type).forEach(([key, val]) =>  val === "test"))
  let billPassedHouse =  data.actions.filter(x => x.type.every(y => y.includes( 'bill:passed'))  && x.actor==='lower')
  let billPassedSenate =  data.actions.filter(x => x.type.every(y => y.includes( 'bill:passed'))  && x.actor==='upper')
 
  // Object.entries(myObj).forEach(([key, val]) => console.log(key, val));
// let r = data.filter(d => d.courses.every(c => courses.includes(c.id)));
// let test = data.actions.filter(d => d.type.every(c => type.includes('bill:passed')));
   
  //  console.log("billPassed.actor", data.actions.type[0] )
   console.log("bill_id ", data.bill_id)
   console.log("TESTING", billPassedSenate )
   console.log("HAS Value", Object.values(billPassedSenate).includes("bill:passed") )
  //  console.log("billPassed Senate ", billPassedSenate)
  //  console.log("billPassed House ", Object.entries(billPassedHouse).length === 0)
   


  // console.log("firstBillAction", data.action_dates.first.length)
  // console.log("popped", popped)
 
  // if (arrayLength > 0) {
  //   billHistory = data.bill.history[arrayLength - 1];
  

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
    "bill:introduced" : {name:"Introduced or prefiled", color: "bg-blue"},
    "bill:passed": {name:"Bill has passed a chamber", color: "bg-yellow"},
    "bill:failed": {name:"Failed to pass a chamber", color: "bg-red"},
    "bill:withdrawn": {name:"Withdrawn from consideration", color: "bg-red"},
    "bill:veto_override:passed": {name:"Chamber attempted a veto override and succeeded", color: "bg-green"},
    "bill:veto_override:failed": {name:"Chamber attempted a veto override and failed", color: "bg-red"},
    "bill:reading:1": {name:"Bill has undergone its first reading" , color: "bg-yellow"},
    "bill:reading:2": {name:"Bill has undergone its second reading", color: "bg-yellow"},
    "bill:reading:3": {name:"Bill has undergone its third (or final) reading", color: "bg-yellow"},
    "bill:filed": {name:"Bill has been filed", color: "bg-yellow"},
    "bill:substituted": {name:"Bill has been replaced with a substituted wholesale", color: "bg-yellow"},
    "governor:received": {name:"Bill has been transmitted to the governor for consideration", color: "bg-yellow"},
    "governor:signed": {name:"Bill has signed into law by the governor", color: "bg-green"},
    "governor:vetoed": {name:"Bill has been vetoed by the governor", color: "bg-red"},
    "governor:vetoed:line-item":{name: "Governor has issued a  partial veto", color: "bg-pink"},
    "amendment:introduced": {name:"An amendment has been offered on the bill", color: "bg-yellow"},
    "amendment:passed": {name:"The bill has been amended", color: "bg-pink"},
    "amendment:failed": {name:"An offered amendment has failed", color: "bg-pink"},
    "amendment:amended": {name:"An offered amendment has been amended", color: "bg-pink"},
    "amendment:withdrawn": {name:"An offered amendment has been withdrawn", color: "bg-pink"},
    "amendment:tabled": {name:"An amendment has been ‘laid on the table’", color: "bg-yellow"},
    "committee:referred": {name:"Bill referred to a committee", color: "bg-yellow"},
    "committee:passed": {name:"Bill has been passed out of a committee", color: "bg-yellow"},
    "committee:passed:favorable": {name:"Bill has been passed out of a committee with a favorable report", color: "bg-yellow"},
    "committee:passed:unfavorable": {name:"Bill has been passed out of a committee with an unfavorable report", color: "bg-yellow"},
    "committee:failed": {name:"Bill has failed to make it out of committee", color: "bg-red"},
    "other": {name:"Other - view state website", color: "bg-pink"},
    "null": {name:"Pending",  color: "bg-pink"},
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

 

  if (
    typeof status[lastBillAction.type] === "undefined" ||
    status[lastBillAction.type] === null
  ) {

    // console.log("status[popped.type] is undefined!!!");
    billStatus = status["null"]
  } else {

    billStatus = status[lastBillAction.type]
  }
  //  console.log("(data.state) = ", (data.state))
  stateData = state[(data.state).toUpperCase()];


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
                                    <div class="f5 fw2 gray measure-narrow o-80 mv0">Latest Action:<span class= "lh-copy gray o-80 pa1 tracked-tight">${lastBillAction.action} <span  class="light-purple"> ${formatDate(lastBillAction.date)} </span>  </span></div>
                                    <div>
                                    <div class="pt3  f3-m fw5 white">
                                            
                                    <h3 class="f3 f3-m measure-narrow lh-title mv0">
                                        <span class="${billStatus.color} lh-copy black pa1 tracked-tight">
                                         ${billStatus.name} 
                                        </span>
                                      </h3>
                                </div>
                                        <div class="pt2 w-100 dt dt--fixed">
                                   
                                            <div class="dtc h1 white ${data.action_dates.first.length > 0 ? "bg-blue" : "bg-light-gray"} br1 br--left tc" style="width: 50%">
                                                <small>Introduced</small></div>
                                            <div class="dtc h1 white ${billPassedHouse = Object.entries(billPassedHouse).length === 0 ? "bg-light-gray" : "bg-blue"} br1 br--left tc" style="width: 50%">
                                                <small>House</small></div>
                                            <div class="dtc h1 white ${billPassedSenate = Object.entries(billPassedSenate).length === 0 ? "bg-light-gray" : "bg-blue"} br1 br--left tc" style="width: 50%">
                                                <small>Senate</small></div>
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>Gov</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>
                                        <div class="pt2 o-80 measure-narrow  truncate"><small>Updated on ${(data.updated_at =
                                          data.updated_at !== null
                                            ? formatDate(data.updated_at)
                                            : "No data available")} </small></div>
                                       
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
                      <span class="f6 db black-70">${
                        data.sponsors.length
                      } bill sponsors</span>
                    </div>
                    <div>
                    <a href="${
                      data.sources[0].url 
                    }" target="_blank" class="pa3 f6 link blue hover-dark-gray">More info</a>
                    </div>
                    </div>
                </div>
        </div>
  `;
}



 fetch("https://paidleavetracker.herokuapp.com/track", {
//  fetch("http://localhost:8887/track", {
// fetch("http://localhost:9000/index", {
//fetch('/.netlify/functions/index', {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})
  .then(r => r.json())
  .then(json => {
// console.log("JSON ",json)
    var html = json
      .map((currElement, index) => {
        return (html = generateHTML(currElement, index));
      })
      .join(" ");

    // console.log("OUTSIDE", html)
    gallery.innerHTML = html;
  });

  function formatDate(input) {
    var date = new Date(input);
    return [
       ("0" + date.getDate()).slice(-2),
       ("0" + (date.getMonth()+1)).slice(-2),
       date.getFullYear()
    ].join('/');
}