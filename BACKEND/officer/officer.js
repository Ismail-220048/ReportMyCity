/* ==============================
   GLOBAL DATA
============================== */
let officer = {};
let complaints = [];

/* ==============================
   INIT ON LOAD
============================== */
document.addEventListener('DOMContentLoaded', () => {

    const userRole = localStorage.getItem("userRole");
    if (!userRole || userRole !== "officer") {
        alert("Unauthorized access. Please login as an officer.");
        window.location.href = "../login-signup/login.html";
        return;
    }

    const userEmail = localStorage.getItem("userEmail");
    const userId = localStorage.getItem("userId");

    loadDashboard(userEmail, userId);
});

/* ==============================
   FETCH DATA
============================== */
async function loadDashboard(email, officerId) {
    try {
        // Officer details
        const officerRes = await fetch(`../BACKEND/officer/getofficer.php?email=${email}`);
        officer = await officerRes.json();

        // Complaints assigned to officer
        const compRes = await fetch(`../BACKEND/officer/getassignedcomplaints.php?officer_id=${officerId}`);
        complaints = await compRes.json();

        populateProfile(officer);

        // Detect page
        if (document.getElementById('complaintsTableBody')) {
            initComplaintsPage();
        } else if (document.getElementById('workflowTimeline')) {
            loadWorkflow(officerId);
        } else {
            initDashboard();
        }

    } catch (err) {
        console.error("Error loading data:", err);
    }
}

/* ==============================
   PROFILE
============================== */
function populateProfile(officer) {
    if (!officer) return;

    document.getElementById('navName').innerHTML = `${officer.name} <i class="fa-solid fa-caret-down"></i>`;
    document.getElementById('sideName').innerText = officer.name;
    document.getElementById('sideId').innerText = `ID: ${officer.id}`;
}

/* ==============================
   DASHBOARD STATS
============================== */
function getStats() {
    let stats = { new: 0, progress: 0, overdue: 0, resolved: 0 };

    complaints.forEach(c => {
        const s = c.status;
        if (s === 'New') stats.new++;
        else if (s === 'In Progress') stats.progress++;
        else if (s === 'Overdue') stats.overdue++;
        else if (s === 'Resolved') stats.resolved++;
    });

    return stats;
}

/* ==============================
   DASHBOARD PAGE
============================== */
function initDashboard() {
    const stats = getStats();

    const statNew = document.getElementById('statNew');
    const statProgress = document.getElementById('statProgress');
    const statOverdue = document.getElementById('statOverdue');
    const statResolved = document.getElementById('statResolved');

    if (statNew) statNew.innerText = stats.new;
    if (statProgress) statProgress.innerText = stats.progress;
    if (statOverdue) statOverdue.innerText = stats.overdue;
    if (statResolved) statResolved.innerText = stats.resolved;

    const listEl = document.getElementById('complaints-list');

    if (listEl) {
        listEl.innerHTML = complaints.map(c => `
            <div class="complaint-item">
                <b>${c.title}</b><br>
                <small>${c.location}</small><br>
                <span>${c.status}</span>
            </div>
        `).join('');
    }

    loadChart(stats);
}

/* ==============================
   COMPLAINTS PAGE
============================== */
function initComplaintsPage() {
    renderComplaintsTable(complaints);
    setupFilters();
}

/* ==============================
   TABLE RENDER
============================== */
function renderComplaintsTable(data) {
    const table = document.getElementById("complaintsTableBody");
    if (!table) return;

    if (!data.length) {
        table.innerHTML = `<tr><td colspan="5">No complaints found</td></tr>`;
        return;
    }

    table.innerHTML = data.map(c => `
        <tr>
            <td>
                <b>${c.complaintId}</b><br>
                ${c.title}
            </td>
            <td>${c.location}</td>
            <td>${c.date || '-'}</td>
            <td>
                <span class="status ${c.status.replace(/\s/g, '')}">
                    ${c.status}
                </span>
            </td>
            <td>
                <button onclick="updateStatus('${c.id}', 'In Progress')">Start</button>
                <button onclick="updateStatus('${c.id}', 'Resolved')">Resolve</button>
            </td>
        </tr>
    `).join('');
}

/* ==============================
   FILTERS
============================== */
function setupFilters() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            if (filter === "All") renderComplaintsTable(complaints);
            else renderComplaintsTable(complaints.filter(c => c.status === filter));
        });
    });
}

/* ==============================
   UPDATE STATUS
============================== */
window.updateStatus = async (id, status) => {
    try {
        await fetch('../BACKEND/officer/updateStatus.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}&status=${status}`
        });

        // Update locally
        complaints = complaints.map(c => c.id === id ? { ...c, status } : c);

        // Re-render
        if (document.getElementById('complaintsTableBody')) {
            renderComplaintsTable(complaints);
        } else {
            initDashboard();
        }

    } catch (err) {
        console.error(err);
    }
};

/* ==============================
   CHART
============================== */
function loadChart(stats) {
    const ctx = document.getElementById('dashboardChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['New', 'In Progress', 'Overdue', 'Resolved'],
            datasets: [{
                data: [stats.new, stats.progress, stats.overdue, stats.resolved],
                backgroundColor: ['#f97316','#f59e0b','#e11d48','#10b981']
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

/* ==============================
   LOGOUT
============================== */
function logoutOfficer() {
    localStorage.clear();
    window.location.href = "../../index.html";
}

/* ==============================
   WORKFLOW TIMELINE
============================== */
async function loadWorkflow(officerId) {
    try {
        const res = await fetch(`../BACKEND/officer/getworkflow.php?officer_id=${officerId}`);
        const data = await res.json();

        const timeline = document.getElementById('workflowTimeline');
        if (!timeline) return;

        if (!data.length) {
            timeline.innerHTML = `<div style="margin-left:50px;"><i class="fa-solid fa-circle-exclamation"></i> No workflow items</div>`;
            return;
        }

        timeline.innerHTML = data.map(c => `
            <div class="timeline-item">
                <div class="timeline-icon ${c.status.replace(/\s/g,'')}">
                    <i class="fa-solid fa-clipboard-check"></i>
                </div>
                <div class="timeline-content">
                    <h3>${c.title} <span class="${c.status.replace(/\s/g,'')}">${c.status}</span></h3>
                    <p>Location: ${c.location}</p>
                    <div class="timeline-date"><i class="fa-regular fa-calendar"></i> ${c.date || '-'}</div>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
    }
}

// Auto-load workflow if timeline exists
document.addEventListener('DOMContentLoaded', () => {
    const officerId = localStorage.getItem("userId");
    if (document.getElementById('workflowTimeline') && officerId) {
        loadWorkflow(officerId);
    }
});