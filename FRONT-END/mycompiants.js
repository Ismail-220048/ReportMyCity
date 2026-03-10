/* ==============================
   SEARCH COMPLAINT
============================== */

function searchComplaint(){

let input = document.getElementById("searchInput").value.toUpperCase();
let cards = document.querySelectorAll(".complaint-card");

cards.forEach(card => {

let text = card.innerText.toUpperCase();

if(text.includes(input)){
card.style.display = "";
}
else{
card.style.display = "none";
}

});

}


/* ==============================
   ANIMATED COUNTERS
============================== */

let counters = document.querySelectorAll(".card h2");

counters.forEach(counter => {

let target = parseInt(counter.innerText);
let count = 0;

function updateCounter(){

let speed = Math.ceil(target / 40);

count += speed;

if(count < target){
counter.innerText = count;
setTimeout(updateCounter,40);
}
else{
counter.innerText = target;
}

}

updateCounter();

});


/* ==============================
   TRACK COMPLAINT POPUP
============================== */

function trackComplaint(id){

document.getElementById("trackingModal").style.display="flex";
document.getElementById("trackID").innerText=id;

resetSteps();

let message="";

if(id=="CC1024"){   // Pending

activateStep(1);
setProgress(20);
setStatus("Pending");

message="Your complaint has been successfully submitted and is waiting for verification by the municipal department.";

}

else if(id=="CC1023"){   // Processing

activateStep(1);
activateStep(2);
activateStep(3);
setProgress(55);
setStatus("Processing");

message="Your complaint has been verified and assigned to a field officer. The maintenance team is currently inspecting the issue.";

}

else if(id=="CC1025"){  // Resolved

activateStep(1);
activateStep(2);
activateStep(3);
activateStep(4);
setProgress(76);
setStatus("Resolved");

message="The municipal maintenance team has resolved your complaint successfully. Thank you for helping improve the city.";

}

document.getElementById("officialMessage").innerText=message;

}


/* ==============================
   ACTIVATE PROGRESS STEP
============================== */

function activateStep(step){

document.getElementById("step" + step).classList.add("completed");

}


/* ==============================
   PROGRESS LINE
============================== */

function setProgress(percent){

document.getElementById("progressLine").style.width = percent + "%";

}


/* ==============================
   STATUS TEXT
============================== */

function setStatus(text){

let status=document.querySelector(".status-progress");

status.innerText=text;

status.classList.remove("pending","processing","resolved");

if(text=="Pending"){
status.classList.add("pending");
}

if(text=="Processing"){
status.classList.add("processing");
}

if(text=="Resolved"){
status.classList.add("resolved");
}

}

/* ==============================
   RESET PROGRESS
============================== */

function resetSteps(){

for(let i = 1; i <= 4; i++){

document.getElementById("step" + i).classList.remove("completed");

}

document.getElementById("progressLine").style.width = "0%";

}


/* ==============================
   CLOSE TRACKING POPUP
============================== */

function closeTracking(){

document.getElementById("trackingModal").style.display = "none";

}