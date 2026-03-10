// =============================
// CATEGORY CHART
// =============================

const ctx1 = document.getElementById('categoryChart');

new Chart(ctx1, {
type: 'doughnut',
data: {
labels: ['Road Damage','Water Leak','Street Light','Garbage','Noise'],
datasets: [{
data: [30,25,20,15,10],
backgroundColor:[
'#3b82f6',
'#06b6d4',
'#22c55e',
'#f59e0b',
'#ef4444'
]
}]
}
});


// =============================
// MONTHLY CHART
// =============================

const ctx2 = document.getElementById('monthlyChart');

new Chart(ctx2, {
type: 'bar',
data: {

labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'],

datasets:[
{
label:'Received',
data:[320,360,290,400,350,410,280],
backgroundColor:'#2563eb'
},
{
label:'Resolved',
data:[280,330,260,380,310,390,250],
backgroundColor:'#22c55e'
}
]

}
});


// =============================
// SIDEBAR NAVIGATION
// =============================

function showSection(sectionId){

let sections = document.querySelectorAll(".section");

sections.forEach(function(section){
section.style.display = "none";
});

document.getElementById(sectionId).style.display = "block";

/* Load map only when mapview opens */

if(sectionId === "mapview"){
setTimeout(loadComplaintMap,200);
}

}


// =============================
// ACTIVE COMPLAINT EXPAND
// =============================

function toggleComplaint(header){

let card = header.parentElement;

card.classList.toggle("open");

}


// =============================
// RESOLVE BUTTON
// =============================

function resolveComplaint(event){

event.stopPropagation();

let card = event.target.closest(".complaint-card");

let badge = card.querySelector(".status");

badge.innerText = "Resolved";

badge.classList.remove("active");

badge.classList.add("resolved");

event.target.innerText = "Resolved";

event.target.disabled = true;

}


// =============================
// MAP + HEATMAP
// =============================

let mapLoaded = false;

function loadComplaintMap(){

if(mapLoaded) return;

mapLoaded = true;

var map = L.map('complaintMap').setView([16.5062, 80.6480], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19,
attribution:'© OpenStreetMap'
}).addTo(map);


/* Example complaint coordinates */

var complaints = [

[16.5062,80.6480],
[16.5065,80.6483],
[16.5067,80.6485],
[16.5069,80.6486],
[16.5070,80.6487],

[16.5040,80.6460],
[16.5042,80.6462],
[16.5045,80.6463],

[16.5020,80.6440]

];


/* Group complaints by area */

var areas = {};

complaints.forEach(function(c){

let lat = c[0].toFixed(2);
let lng = c[1].toFixed(2);

let key = lat+","+lng;

if(!areas[key]) areas[key] = [];

areas[key].push(c);

});


/* Draw colored zones */

for(let key in areas){

let points = areas[key];

let lat = points[0][0];
let lng = points[0][1];

let count = points.length;
let color = "#ffd600";   // yellow

if(count >= 8){
color = "#ff0000";      // red
}
else if(count >= 4){
color = "#ff6600";      // dark orange
}
else{
color = "#ffd600";      // yellow
}

L.circle([lat,lng],{

radius:500,
color:color,
fillColor:color,
fillOpacity:0.4

})
.addTo(map)
.bindPopup("Complaints in this area: "+count);

}

}
// DASHBOARD MAP

var dashboardMap = L.map('map').setView([16.5062, 80.6480], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom:19,
attribution:'© OpenStreetMap'
}).addTo(dashboardMap);


// Example markers

L.marker([16.5062,80.6480])
.addTo(dashboardMap)
.bindPopup("Road Damage Complaint");

L.marker([16.5120,80.6400])
.addTo(dashboardMap)
.bindPopup("Water Leak Complaint");
// user
function toggleBlock(btn){

let row = btn.closest("tr");

let status = row.querySelector(".user-status");

if(status.classList.contains("active")){

status.classList.remove("active");
status.classList.add("blocked");
status.innerText = "Blocked";

btn.innerText = "Unblock";
btn.classList.remove("block-btn");
btn.classList.add("unblock-btn");

row.classList.add("blocked-row");

}else{

status.classList.remove("blocked");
status.classList.add("active");
status.innerText = "Active";

btn.innerText = "Block";
btn.classList.remove("unblock-btn");
btn.classList.add("block-btn");

row.classList.remove("blocked-row");

}

}
// user filtering
function filterUsers() {
    let input = document.getElementById("userSearch").value.toUpperCase();
    let rows = document.querySelectorAll("#usersBody tr"); // Correct ID

    rows.forEach(function(row) {
        let id = row.cells[0].innerText.toUpperCase();
        if (id.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}