// =============================
// SHOW SECTION
// =============================
function showSection(sectionId) {

document.querySelectorAll(".section").forEach(sec=>{
sec.style.display="none";
});

document.getElementById(sectionId).style.display="block";

}


// =============================
// LOGOUT
// =============================
document.querySelector(".logout").addEventListener("click",()=>{

alert("Logging out...");
window.location.href="officer_login.html";

});


// =============================
// TOGGLE COMPLAINT DETAILS
// =============================
function toggleComplaint(header){

let card = header.parentElement;
card.classList.toggle("open");

}


// =============================
// UPDATE DASHBOARD STATS
// =============================
function updateDashboardStats(){

let total =
document.querySelectorAll(".complaint-card").length;

let active =
document.querySelectorAll("#tasksContainer .complaint-card").length;

let completed =
document.querySelectorAll("#completedContainer .complaint-card").length;

document.getElementById("totalTasks").innerText = total;
document.getElementById("activeTasks").innerText = active;
document.getElementById("completedTasks").innerText = completed;

}


// =============================
// ACCEPT COMPLAINT
// =============================
function acceptComplaint(btn,bounty){

let card = btn.closest(".complaint-card");

card.setAttribute("data-bounty",bounty);

btn.remove();

document.getElementById("tasksContainer").appendChild(card);

let details = card.querySelector(".complaint-details");

details.innerHTML += `

<br>

<select class="status-select" onchange="updateTracking(this)">
<option value="progress">In Progress</option>
<option value="completed">Completed</option>
</select>

<div class="proof-section" style="display:none;">

<input type="file" class="proof-upload">

<button class="submit-proof-btn" onclick="submitProof(this)">
Submit Proof
</button>

</div>

`;

updateDashboardStats();

}


// =============================
// UPDATE STATUS
// =============================
function updateTracking(select){

let card = select.closest(".complaint-card");

let proof = card.querySelector(".proof-section");

if(select.value==="completed"){

proof.style.display="block";

}else{

proof.style.display="none";

}

}


// =============================
// SUBMIT PROOF
// =============================
function submitProof(btn){

let card = btn.closest(".complaint-card");

let file =
card.querySelector(".proof-upload").files[0];

if(!file){

alert("Please upload proof first");
return;

}

let bounty =
parseInt(card.getAttribute("data-bounty"));

let current =
parseInt(
document.getElementById("bountyEarned")
.innerText.replace("₹","")
);

document.getElementById("bountyEarned").innerText =
"₹"+(current+bounty);

btn.innerText="Submitted ✔";
btn.disabled=true;

document
.getElementById("completedContainer")
.appendChild(card);

alert("Task completed! Bounty Added ₹"+bounty);

updateDashboardStats();

}


// =============================
// LOAD COMPLAINTS
// =============================
function loadComplaints(data){

const container =
document.getElementById("liveComplaintsContainer");

container.innerHTML="";

data.forEach(c=>{

let card=document.createElement("div");

card.className="complaint-card";

card.innerHTML=`

<div class="complaint-header" onclick="toggleComplaint(this)">

<div style="display:flex;align-items:center;gap:10px">

<img src="${c.photo}"
style="width:40px;height:40px;border-radius:50%">

<div>

<h4>${c.type}</h4>

<p>Reported by ${c.username}</p>

</div>

</div>

<div style="display:flex;align-items:center;gap:10px">

<span class="bounty">₹${c.bounty}</span>

<button class="accept-btn"
onclick="acceptComplaint(this,${c.bounty})">

Accept

</button>

</div>

</div>

<div class="complaint-details">

<p>${c.description}</p>

</div>

`;

container.appendChild(card);

});

updateDashboardStats();

}


// =============================
// SAMPLE DATABASE DATA
// =============================
const exampleComplaints=[

{
username:"Rahul",
type:"Pothole",
description:"Large pothole blocking traffic near bus stand.",
photo:"https://randomuser.me/api/portraits/men/32.jpg",
bounty:300
},

{
username:"Ayesha",
type:"Garbage Overflow",
description:"Garbage bins overflowing near market road.",
photo:"https://randomuser.me/api/portraits/women/44.jpg",
bounty:250
},

{
username:"Arjun",
type:"Street Light Issue",
description:"Street lights not working in sector 4.",
photo:"https://randomuser.me/api/portraits/men/76.jpg",
bounty:200
}

];


// =============================
// PAGE LOAD
// =============================
window.onload=()=>{

showSection("dashboard");

loadComplaints(exampleComplaints);

drawIncomeFlow();

};


// =============================
// GOOGLE SANKEY CHART
// =============================
google.charts.load('current',{'packages':['sankey']});

google.charts.setOnLoadCallback(drawIncomeFlow);


function drawIncomeFlow(){

var data =
new google.visualization.DataTable();

data.addColumn('string','From');
data.addColumn('string','To');
data.addColumn('number','Amount');

data.addRows([

['Pending Tasks','Accepted Tasks',1200],
['Accepted Tasks','Completed Tasks',800],
['Completed Tasks','Bounty Earned',500],
['Bounty Earned','Total Earnings',2500]

]);

var options={

width:'100%',
height:300,

sankey:{

node:{
colors:['#fbbf24','#3b82f6','#10b981','#2563eb']
},

link:{
colorMode:'gradient'
}

}

};

var chart=
new google.visualization.Sankey(
document.getElementById('incomeFlowChart')
);

chart.draw(data,options);

}
