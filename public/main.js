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
  // tracked_header.innerHTML = `Currently tracking ${index} twitter accounts`
  console.log("DATA from generateHTML ",data.history.length)
  console.log("DATA from generateHTML ",data.history[(data.history.length)-1])
  // console.log("InDEX ",index)
  //let counter = counter+1

  const billHistory =  data.history[(data.history.length)-1]

  // console.log(counter)
  //console.log("inside generate " + data.ratings[0].count);
  // const name  = data.name;
  // let rating = (data.rating)*2;

  // const background_image = data.background_image;
  // const released  = data.twitter[2].message;
  return `
  <div class="div1 container ">
            <article class="mw6 center bg-white br3 pa3 pa0-ns mv3 ba b--black-20">
                <div class ="vh-10 dt w-100 tc bg-dark-gray white cover" style="background:url(triangles.png) no-repeat center;">

                    <h1 class="f3 fw2 white mv0 pv4 ph3">${data.state} - <span>${data.bill_number}</span></h1>
                </div>

                <div>
                    <article class="w-100 pa0">

                        <div class=" bg-white black w-100 mt1 ph3 pv3">
                            <div class="w-100 pb3 bb b--light-gray flex items-center justify-between">

                                <div class="">
                                    <div class="ttu f6 fw2 gray">Bill<span> Introduced - ${data.status_date} </span></div>
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
                                        <div class="pt2 o-80 truncate"><small>${billHistory.action} - ${billHistory.date}</small></div>
                                       
                                    </div>

                                </div>
                            </div>

                        </div>

                    </article>

                    <div class=" bb b--light-gray bg-white gray w-100 ph3 pv0">
                        <div class="w-100 pb0  flex items-center justify-between">${data.description}
                         
                        </div>

                    </div>

                    <div class="flex items-center lh-copy pa3 s ph0-l bb b--black-10">

                        <div>
                            <a href="${data.state_link}" target="_blank" class="pa3 f6 link blue hover-dark-gray">More info</a>
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

fetch('http://localhost:8887/track',
{
  headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   }

}

)
.then(r => r.json())
.then(json => {
  tempArray.push(json.bill)
//    console.log("(LG.JS",json.bill);
  var html = tempArray.map((currElement, index) => {

  return html = generateHTML(currElement, index);

}).join(' ')

// console.log("OUTSIDE", html)
  gallery.innerHTML = html;

});


