// =============================
// CATEGORY CHART
// =============================
const ctx1 = document.getElementById('categoryChart');
if (ctx1) {
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['Road Damage','Water Leak','Street Light','Garbage','Noise'],
            datasets: [{
                data: [30,25,20,15,10],
                backgroundColor:['#3b82f6', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444']
            }]
        }
    });
}

// =============================
// MONTHLY CHART
// =============================
const ctx2 = document.getElementById('monthlyChart');
if (ctx2) {
    new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
            datasets:[
                { label:'Received', data:[320,360,290,400,350,410,280], backgroundColor:'#2563eb' },
                { label:'Resolved', data:[280,330,260,380,310,390,250], backgroundColor:'#22c55e' }
            ]
        }
    });
}

// =============================
// SIDEBAR NAVIGATION
// =============================
function showSection(sectionId){
    let sections = document.querySelectorAll(".section");
    sections.forEach(s => s.style.display = "none");
    document.getElementById(sectionId).style.display = "block";
    if(sectionId === "mapview") setTimeout(loadComplaintMap, 200);
}

function toggleComplaint(header){
    header.parentElement.classList.toggle("open");
}

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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var complaints = [[16.5062,80.6480], [16.5065,80.6483], [16.5067,80.6485], [16.5040,80.6460]];
    var areas = {};
    complaints.forEach(c => {
        let key = c[0].toFixed(2) + "," + c[1].toFixed(2);
        if(!areas[key]) areas[key] = [];
        areas[key].push(c);
    });
    for(let key in areas){
        let count = areas[key].length;
        let color = count >= 8 ? "#ff0000" : (count >= 4 ? "#ff6600" : "#ffd600");
        L.circle([areas[key][0][0], areas[key][0][1]], { radius:500, color:color, fillColor:color, fillOpacity:0.4 }).addTo(map);
    }
}

// DASHBOARD MAP
const mapDiv = document.getElementById('map');
if(mapDiv) {
    var dashboardMap = L.map('map').setView([16.5062, 80.6480], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(dashboardMap);
    L.marker([16.5062,80.6480]).addTo(dashboardMap).bindPopup("Road Damage Complaint");
}

// USER MANAGEMENT
function toggleBlock(btn){
    let row = btn.closest("tr");
    let status = row.querySelector(".user-status");
    if(status.classList.contains("active")){
        status.className = "user-status blocked";
        status.innerText = "Blocked";
        btn.innerText = "Unblock";
        btn.className = "unblock-btn";
        row.classList.add("blocked-row");
    } else {
        status.className = "user-status active";
        status.innerText = "Active";
        btn.innerText = "Block";
        btn.className = "block-btn";
        row.classList.remove("blocked-row");
    }
}

function filterUsers() {
    let input = document.getElementById("userSearch").value.toUpperCase();
    document.querySelectorAll("#usersBody tr").forEach(row => {
        row.style.display = row.cells[0].innerText.toUpperCase().includes(input) ? "" : "none";
    });
}

// SESSION INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    const adminName = localStorage.getItem("userName");
    if(adminName) {
        document.querySelector(".welcome h3").innerText = "Welcome, " + adminName;
        document.querySelector(".profile").innerText = adminName[0].toUpperCase();
    }
});

function logoutAdmin(){
    if(confirm("Logout from Admin Panel?")){
        localStorage.clear();
        window.location.href = "../../index.html";
    }
}