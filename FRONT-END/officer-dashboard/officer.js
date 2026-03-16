/* ==============================
   INIT ON LOAD & SESSION MGMT
 ============================== */
const mockOfficer = {
    name: 'Officer Raj',
    officerId: 'OFC-001',
    photoUrl: 'https://ui-avatars.com/api/?name=Officer+Raj&background=0D8ABC&color=fff'
};

let mockComplaints = [];

document.addEventListener('DOMContentLoaded', () => {
    // Load session data
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    
    if (userName) mockOfficer.name = userName;
    if (userId) mockOfficer.officerId = userId;

    // Top Right Timer
    setInterval(() => {
        const timeEl = document.getElementById('currentTime');
        if(timeEl) {
            timeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        }
    }, 1000);

    // Routing
    const fullPath = window.location.pathname;
    const currentPage = fullPath.split('/').pop() || 'officer.html';

    if (currentPage === 'officer.html' || currentPage === '') {
        initDashboard();
    } else if (currentPage === 'officer-omplaints.html') {
        initComplaints();
    } else if (currentPage === 'officer-analytics.html') {
        initAnalytics();
    } else if (currentPage === 'officer-workflow.html') {
        initWorkflow();
    }
});

// --- UTILITIES ---
const getStats = () => {
    let stats = { new_complaints: 0, in_progress: 0, overdue: 0, resolved: 0 };
    mockComplaints.forEach(c => {
        if(c.status === 'New') stats.new_complaints++;
        else if(c.status === 'In Progress') stats.in_progress++;
        else if(c.status === 'Overdue') stats.overdue++;
        else if(c.status === 'Resolved') stats.resolved++;
    });
    return stats;
};

const populateProfile = (officer) => {
    ['navPhoto', 'sidePhoto'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.src = officer.photoUrl;
    });
    const navName = document.getElementById('navName');
    if(navName) navName.innerHTML = `${officer.name.split(' ')[0]} <i class="fa-solid fa-caret-down"></i>`;
    
    ['sideName', 'sideId', 'welcomeText'].forEach(id => {
         const el = document.getElementById(id);
         if(el) {
             if(id === 'sideName') el.innerText = officer.name;
             if(id === 'sideId') el.innerText = `ID: ${officer.officerId}`;
             if(id === 'welcomeText' && el.innerText.includes('Welcome')) el.innerText = `Welcome, Officer ${officer.name.split(' ').pop()}!`;
         }
    });
};

const parseDate = (dateObj) => new Date(dateObj);
const timeAgo = (dateStr) => {
    const date = parseDate(dateStr);
    const seconds = Math.max(0, Math.floor((new Date() - date) / 1000));
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds || 0) + " secs ago";
};

const getIconForType = (type) => {
    const icons = { 'Garbage': 'fa-trash', 'Water Supply': 'fa-faucet-drip', 'Electricity': 'fa-lightbulb', 'Roads': 'fa-road', 'Drainage': 'fa-water' };
    return icons[type] || 'fa-circle-exclamation';
};

const fetchOfficerContext = async () => {
    populateProfile(mockOfficer);
    return {
        officer: mockOfficer,
        stats: getStats(),
        recentComplaints: mockComplaints.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    };
};

// --- DASHBOARD ---
async function initDashboard() {
    const data = await fetchOfficerContext();
    const stats = data.stats;
    document.getElementById('statNew').innerText = stats.new_complaints;
    document.getElementById('statProgress').innerText = stats.in_progress;
    document.getElementById('statOverdue').innerText = stats.overdue;
    document.getElementById('statResolved').innerText = stats.resolved;
    const total = stats.new_complaints + stats.in_progress + stats.overdue + stats.resolved;
    const pct = total === 0 ? 0 : Math.round((stats.resolved / total) * 100);
    document.getElementById('statProgressBar').style.width = pct + '%';

    const listEl = document.getElementById('complaints-list');
    if(listEl) {
        listEl.innerHTML = data.recentComplaints.map(c => `
            <div class="complaint-item">
                <div class="item-left">
                    <div class="item-icon"><i class="fa-solid ${getIconForType(c.type)}"></i></div>
                    <div class="item-info"><h4>${c.title}</h4><p>${c.location}</p></div>
                </div>
                <div class="item-right">
                    <p>${timeAgo(c.createdAt)}</p>
                    <span class="status ${c.status.replace(' ', '-')}">${c.status}</span>
                </div>
            </div>`).join('');
    }

    const wfEl = document.getElementById('mini-workflow-list');
    if(wfEl) {
        wfEl.innerHTML = data.recentComplaints.slice(0,3).map(c => `
            <div class="complaint-item" style="border-bottom:none; padding-bottom:5px;">
                <div class="item-info"><h4 style="font-size:0.85rem">${c.title}</h4></div>
                <div class="item-right"><span class="status ${c.status.replace(' ', '-')}">${c.status}</span></div>
            </div>`).join('');
    }

    if(document.getElementById('main-map')) {
        const mainMap = L.map('main-map').setView([16.5062, 80.6480], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mainMap);
        data.recentComplaints.forEach(c => {
            const lat = 16.5062 + (Math.random() - 0.5) * 0.1;
            const lng = 80.6480 + (Math.random() - 0.5) * 0.1;
            L.marker([lat, lng]).addTo(mainMap).bindPopup(`<b>${c.title}</b><br>${c.location}`);
        });
    }

    const ctxEl = document.getElementById('dashboardChart');
    if(ctxEl) {
        new Chart(ctxEl.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['New', 'In Progress', 'Overdue', 'Resolved'],
                datasets: [{ data: [stats.new_complaints, stats.in_progress, stats.overdue, stats.resolved], backgroundColor: ['#f97316', '#0ea5e9', '#e11d48', '#10b981'], borderWidth: 0}]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '70%'}
        });
    }
}

// --- COMPLAINTS ---
async function initComplaints() {
    await fetchOfficerContext();
    renderComplaintsTable(mockComplaints);
    document.querySelectorAll('.tabs .tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            renderComplaintsTable(filter === 'All' ? mockComplaints : mockComplaints.filter(c => c.status === filter));
        });
    });
}

function renderComplaintsTable(data) {
    const tbody = document.getElementById('complaintsTableBody');
    if(!tbody) return;
    tbody.innerHTML = data.length === 0 ? `<tr><td colspan="5" style="text-align:center;">No complaints found.</td></tr>` : 
    data.map(c => {
        let buttons = '';
        if(c.status !== 'Resolved') {
            if(c.status === 'New' || c.status === 'Overdue') buttons += `<button class="btn-sm btn-warning" onclick="updateStatus('${c.complaintId}', 'In Progress')">Start</button>`;
            buttons += `<button class="btn-sm btn-success" onclick="updateStatus('${c.complaintId}', 'Resolved')"><i class="fa-solid fa-check"></i> Resolve</button>`;
        }
        return `<tr>
            <td><div class="complaint-title-cell"><div class="type-icon"><i class="fa-solid ${getIconForType(c.type)}"></i></div>
            <div class="title-text"><h4>${c.title}</h4><p>${c.complaintId} • ${c.type}</p></div></div></td>
            <td><i class="fa-solid fa-map-pin" style="color:var(--primary)"></i> ${c.location}</td>
            <td>${parseDate(c.createdAt).toLocaleDateString()}<br><small style="color:#64748b">${timeAgo(c.createdAt)}</small></td>
            <td><span class="status ${c.status.replace(' ', '-')}">${c.status}</span></td>
            <td class="action-buttons">${buttons || 'Completed'}</td></tr>`;
    }).join('');
}

window.updateStatus = async (compId, newStatus) => {
    const c = mockComplaints.find(c => c.complaintId === compId);
    if(c) { c.status = newStatus; initComplaints(); }
};

// --- ANALYTICS ---
async function initAnalytics() {
    await fetchOfficerContext();
    const typeCounts = {};
    mockComplaints.forEach(c => typeCounts[c.type] = (typeCounts[c.type] || 0) + 1);
    const stats = getStats();
    
    new Chart(document.getElementById('typeChart').getContext('2d'), {
        type: 'pie',
        data: { labels: Object.keys(typeCounts), datasets: [{ data: Object.values(typeCounts), backgroundColor: ['#0ea5e9', '#f59e0b', '#10b981', '#6366f1'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });

    new Chart(document.getElementById('statusChart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['New', 'In Progress', 'Overdue', 'Resolved'], datasets: [{ data: [stats.new_complaints, stats.in_progress, stats.overdue, stats.resolved], backgroundColor: ['#f97316', '#0ea5e9', '#e11d48', '#10b981'] }] },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

// --- WORKFLOW ---
async function initWorkflow() {
    await fetchOfficerContext();
    const tl = document.getElementById('workflowTimeline');
    if(!tl) return;
    const active = mockComplaints.filter(c => c.status !== 'Resolved').sort((a,b) => {
        const weight = { 'Overdue': 3, 'In Progress': 2, 'New': 1 };
        return weight[b.status] - weight[a.status];
    });

    tl.innerHTML = active.length === 0 ? `<div class="timeline-item"><div class="timeline-content"><h3>No active tasks!</h3></div></div>` :
    active.map(c => `
        <div class="timeline-item">
            <div class="timeline-icon ${c.status.replace(' ', '-')}"><i class="fa-solid ${getIconForType(c.type)}"></i></div>
            <div class="timeline-content">
                <h3>${c.title} <span class="badge ${c.status.replace(' ', '-')}">${c.status}</span></h3>
                <p>${c.description}</p>
                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                    <span class="timeline-date"><i class="fa-solid fa-map-pin"></i> ${c.location} | Assigned ${timeAgo(c.createdAt)}</span>
                    <button class="btn-sm ${c.status==='In Progress'?'btn-success':'btn-warning'}" onclick="updateStatusWorkflow('${c.complaintId}', '${c.status==='In Progress'?'Resolved':'In Progress'}')">${c.status==='In Progress'?'Mark Resolved':'Start Review'}</button>
                </div>
            </div>
        </div>`).join('');
}

window.updateStatusWorkflow = async (compId, newStatus) => {
    const c = mockComplaints.find(c => c.complaintId === compId);
    if(c) { c.status = newStatus; initWorkflow(); }
};

window.logoutOfficer = () => { if(confirm("Are you sure you want to logout?")) window.location.href = "../../index.html"; };
