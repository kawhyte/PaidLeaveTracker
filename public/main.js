// DOM elements
const tweet = document.getElementById("tweet");
const tracked_header = document.getElementById("tracked_head");
const twitter_handle = document.getElementById("twitter_handle");
const gallery = document.querySelector(".lg-gallery");
let tempArray = [];
// Replace ./data.json with your JSON feed
// fetch('/db.json').then(response => {
//     return response.json();
//   }).then(data => {
//     // Work with JSON data here
//     console.log(data);

//     tweet.innerHTML =  data.twitter[2].message;
//     twitter_handle.innerHTML = data.twitter[2].name;

//     const html = data.map(generateHTML).join("");
//     console.log(html);
//     gallery.innerHTML = html;
//   }).catch(err => {
//     // Do something for an error here
//   });

function generateHTML(data, index) {
  const arrayLength = data.bill.history.length;
  let billHistory = "";
  let val = " "; // "url('./img/triangles.png') no-repeat center";

  if (arrayLength > 0) {
    billHistory = data.bill.history[arrayLength - 1];
  }

  //   console.log("Bill History length ",data.bill.history.length)
  //   console.log("Bill History ",data.bill.status_date)

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

  console.log("SKY ", skyGradient[index]);

  if (
    typeof skyGradient[index] === "undefined" ||
    skyGradient[index] === null
  ) {
    val = "url('./img/blur.jpg') no-repeat center";
    //document.getElementById("bg").style.background =
    console.log("VAL inside ", val);
    //return;
    //br
  } else {
    val = skyGradient[index];
  }
  console.log("VAL ", val);

  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div id ="bg" class="vh-10 dt w-100 tc bg-dark-gray white cover" style="background:url('./img/triangles.png') no-repeat center;">

                    <h1 class="f3 fw2 white mv0 pv4 ph3">${
                      data.bill.state
                    } - <span>${data.bill.bill_number}</span></h1>
                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph3 pv3">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                <div class="">
                                    <div class="ttu f6 fw2 gray">Bill<span> Introduced - ${(data.bill.status_date =
                                      data.bill.status_date !== null
                                        ? data.bill.status_date
                                        : "No date available")} </span></div>
                                    <div>
                                        <div class="pt3 f2 f2-m fw5">1 of 3</div>
                                        <div class="pt2 w-100 dt dt--fixed">
                                   
                                            <div class="dtc h1 white bg-blue br1 br--left tc" style="width: 50%">
                                                <small>House</small></div>
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>Senate</small></div>
                                            <div class="dtc h1 white bg-light-gray br1 br--left tc" style="width: 50%">
                                                <small>Gov</small></div>
                                            <div class="dtc h1 bg-white o-30 br1 br--right"></div>
                                        </div>
                                        <div class="pt2 o-80 measure-narrow  truncate"><small> Last Action: ${(billHistory.action =
                                          arrayLength > 0
                                            ? billHistory.action
                                            : "No history available")}  ${(billHistory.date =
    arrayLength > 0 ? billHistory.date : " ")}</small></div>
                                       
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

                   
                    <img class="w2 h2 w3-ns h3-ns br-100" src="http://tachyons.io/img/avatar-mrmrs.jpg" />
                    <div class="pl3 flex-auto">
                      <span class="f6 db black-70">Mrmrs</span>
                      <span class="f6 db black-70">Medium Hexagon, LLC</span>
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

fetch("http://localhost:8887/track", {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
})
  .then(r => r.json())
  .then(json => {
    //   tempArray.push(json.bill)
    console.log("(LG.JS", json);
    var html = json
      .map((currElement, index) => {
        return (html = generateHTML(currElement, index));
      })
      .join(" ");

    // console.log("OUTSIDE", html)
    gallery.innerHTML = html;
  });


// let state = {

// Alabama - AL
// Alaska - AK
// Arizona - AZ
// Arkansas - AR
// California - CA
// Colorado - CO
// Connecticut - CT
// Delaware - DE
// Florida - FL
// Georgia - GA
// Hawaii - HI
// Idaho - ID
// Illinois - IL
// Indiana - IN
// Iowa - IA
// Kansas - KS
// Kentucky - KY
// Louisiana - LA
// Maine - ME
// Maryland - MD
// Massachusetts - MA
// Michigan - MI
// Minnesota - MN
// Mississippi - MS
// Missouri - MO
// Montana - MT
// Nebraska - NE
// Nevada - NV
// New Hampshire - NH
// New Jersey - NJ
// New Mexico - NM
// New York - NY
// North Carolina - NC
// North Dakota - ND
// Ohio - OH
// Oklahoma - OK
// Oregon - OR
// Pennsylvania - PA
// Rhode Island - RI
// South Carolina - SC
// South Dakota - SD
// Tennessee - TN
// Texas - TX
// Utah - UT
// Vermont - VT
// Virginia - VA
// Washington - WA
// West Virginia - WV
// Wisconsin - WI
// Wyoming - WY
// }