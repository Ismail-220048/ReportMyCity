// ====== MOCK DATA ======
let complaints = [
    { 
        id: 1, 
        type: "Pothole Repair", 
        name: "Rahul Sharma", 
        desc: "Large pothole on MG Road causing traffic slowdowns and vehicle damage. Needs immediate attention.", 
        bounty: 300, 
        img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80", 
        status: "live", 
        date: "10 mins ago" 
    },
    { 
        id: 2, 
        type: "Garbage Cleanup", 
        name: "Anita Desai", 
        desc: "Overflowing garbage bin near Sector 4 park. Emitting foul smell and attracting stray animals.", 
        bounty: 250, 
        img: "https://images.unsplash.com/photo-1605335805799-a86d2eb1035f?auto=format&fit=crop&w=400&q=80", 
        status: "live", 
        date: "1 hour ago" 
    },
    { 
        id: 3, 
        type: "Street Light Repair", 
        name: "Vikram Singh", 
        desc: "Street light pole no. 45 on Avenue Road is unlit for past 3 days making the street dark and unsafe.", 
        bounty: 200, 
        img: "https://images.unsplash.com/photo-1533038590840-1c584bf729ed?auto=format&fit=crop&w=400&q=80", 
        status: "live", 
        date: "2 hours ago" 
    },
    { 
        id: 4, 
        type: "Water Pipe Leak", 
        name: "Priya Kumar", 
        desc: "Underground pipe burst near the community center, wasting clean water continuously.", 
        bounty: 400, 
        img: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=400&q=80", 
        status: "live", 
        date: "5 hours ago" 
    }
];

let earningsStats = {
    totalEarned: 0,
    pendingEarned: 0,
    completedTasks: 0
};

let earningsHistory = [];

// ======= DOM ELEMENTS =======
const sidebar = document.querySelector(".sidebar");
const sidebarBtn = document.querySelector("#btn");

const uiLiveList = document.getElementById("live-complaints-grid");
const uiActiveList = document.getElementById("active-tasks-grid");
const uiCompletedList = document.getElementById("completed-tasks-list");

const uiMiniLive = document.getElementById("live-feed-mini");
const uiMiniActive = document.getElementById("active-tasks-mini");

const toast = document.getElementById("toast");

// Google Charts
google.charts.load("current", {packages:["sankey"]});
// We don't setOnLoadCallback here instantly because we draw it when the tab opens

// ======= INITIALIZATION =======
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    sidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("close");
    });

    // File upload mock preview
    const uploadInput = document.getElementById('proof-file');
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const previewImg = document.getElementById('image-preview');

    uploadArea.addEventListener('click', () => uploadInput.click());
    
    uploadInput.addEventListener('change', function() {
        if(this.files && this.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                uploadArea.classList.add('hidden');
                previewArea.classList.remove('hidden');
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    // Proof form submission
    document.getElementById('proof-form').addEventListener('submit', handleProofSubmit);

    // Initial Render
    renderDashboards();
});

// ======= NAVIGATION =======
function switchTab(tabId) {
    // Update sidebar active link
    document.querySelectorAll('.sidebar li a').forEach(el => el.classList.remove('active'));
    let link = document.querySelector(`a[onclick="switchTab('${tabId}')"]`);
    if(link) link.classList.add('active');

    // Update content tab active
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-tab'));
    document.getElementById(`tab-${tabId}`).classList.add('active-tab');

    // Draw chart if earnings tab
    if(tabId === 'earnings') {
        drawSankeyChart();
    }
}

// ======= DATA RENDERING =======
function renderDashboards() {
    // Clear UI
    uiLiveList.innerHTML = '';
    uiActiveList.innerHTML = '';
    uiCompletedList.innerHTML = '';
    uiMiniLive.innerHTML = '';
    uiMiniActive.innerHTML = '';

    let liveCount = 0;
    let activeCount = 0;
    let compCount = 0;

    complaints.forEach(item => {
        if(item.status === 'live') {
            liveCount++;
            uiLiveList.appendChild(createComplaintCard(item));
            if(liveCount <= 2) uiMiniLive.appendChild(createMiniListItem(item, 'live'));
        }
        else if(item.status === 'active') {
            activeCount++;
            uiActiveList.appendChild(createActiveCard(item));
            if(activeCount <= 2) uiMiniActive.appendChild(createMiniListItem(item, 'active'));
        }
        else if(item.status === 'completed') {
            compCount++;
            uiCompletedList.appendChild(createCompletedItem(item));
        }
    });

    // Update empty states
    if(liveCount === 0) uiLiveList.innerHTML = '<p class="text-muted">No live complaints available right now.</p>';
    if(activeCount === 0) uiActiveList.innerHTML = '<p class="text-muted">You have no active tasks. Accept some to start earning!</p>';
    if(compCount === 0) uiCompletedList.innerHTML = '<p class="text-muted">Complete tasks to see your history here.</p>';
    if(uiMiniLive.innerHTML === '') uiMiniLive.innerHTML = '<p class="text-muted" style="padding:15px; font-size:13px;">No new issues.</p>';
    if(uiMiniActive.innerHTML === '') uiMiniActive.innerHTML = '<p class="text-muted" style="padding:15px; font-size:13px;">No active tasks.</p>';

    // Update Top Overview Stats
    document.getElementById('stat-total').innerText = complaints.length;
    document.getElementById('stat-active').innerText = activeCount;
    document.getElementById('stat-completed').innerText = compCount;
    document.getElementById('stat-bounty').innerText = '₹' + earningsStats.totalEarned;

    // Update Earnings Stats
    document.getElementById('earn-total').innerText = earningsStats.totalEarned;
    document.getElementById('earn-pending').innerText = earningsStats.pendingEarned;
    document.getElementById('earn-tasks').innerText = earningsStats.completedTasks;
}

// ======= COMPONENT BUILDERS =======

function createComplaintCard(item) {
    const div = document.createElement('div');
    div.className = 'complaint-card';
    div.innerHTML = `
        <div class="card-header">
            <div class="reporter-info">
                <img src="https://ui-avatars.com/api/?name=${item.name.replace(' ', '+')}&background=random" alt="user">
                <div>
                    <div class="reporter-name">${item.name}</div>
                    <div class="time-ago">${item.date}</div>
                </div>
            </div>
            <div class="bounty-tag">₹${item.bounty}</div>
        </div>
        <div class="card-body">
            <img src="${item.img}" class="complaint-img" alt="issue">
            <div class="card-title">${item.type}</div>
            <div class="desc-text" id="desc-${item.id}">${item.desc}</div>
            <div class="read-more" onclick="toggleDesc(${item.id})">Read More</div>
        </div>
        <div class="card-footer">
            <button class="btn-primary w-100" onclick="acceptTask(${item.id})">Accept Task</button>
        </div>
    `;
    return div;
}

function createActiveCard(item) {
    const div = document.createElement('div');
    div.className = 'complaint-card';
    div.innerHTML = `
        <div class="card-header" style="border-bottom:none;">
            <div class="card-title w-100" style="margin-bottom:0;">
                ${item.type} 
                <span class="badge badge-warning">In Progress</span>
            </div>
        </div>
        <div class="card-body pt-0">
            <p class="text-muted mb-3" style="font-size:13px;">${item.desc}</p>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span style="font-size:14px;">Bounty: <strong class="text-secondary">₹${item.bounty}</strong></span>
            </div>
            <button class="btn-success w-100" onclick="openProofModal(${item.id})">
                <i class='bx bx-check-circle'></i> Mark as Completed
            </button>
        </div>
    `;
    return div;
}

function createCompletedItem(item) {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
        <div class="item-info">
            <div class="item-icon"><i class='bx bx-check'></i></div>
            <div class="item-details">
                <h4>${item.type}</h4>
                <p>Reported by ${item.name}</p>
            </div>
        </div>
        <div class="item-reward">
            <div class="amount">+ ₹${item.bounty}</div>
            <div class="date">Completed Just Now</div>
        </div>
    `;
    return div;
}

function createMiniListItem(item, context) {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.style.padding = '10px 15px';
    div.style.border = 'none';
    div.style.borderBottom = '1px solid var(--panel-border)';
    div.style.borderRadius = '0';
    div.style.background = 'transparent';
    
    let actionBtn = context === 'live' 
        ? `<button class="btn-sm" onclick="acceptTask(${item.id})">Accept</button>`
        : `<button class="btn-sm text-success" style="border-color:var(--success)" onclick="openProofModal(${item.id})">Done</button>`;

    div.innerHTML = `
        <div class="item-details" style="flex:1">
            <h4 style="font-size:14px; margin-bottom:2px;">${item.type}</h4>
            <p style="font-size:11px;">Bounty: ₹${item.bounty}</p>
        </div>
        <div>${actionBtn}</div>
    `;
    return div;
}

// ======= INTERACTIONS & WORKFLOW =======

function toggleDesc(id) {
    const el = document.getElementById(`desc-${id}`);
    if(el.classList.contains('expanded')) {
        el.classList.remove('expanded');
        event.target.innerText = "Read More";
    } else {
        el.classList.add('expanded');
        event.target.innerText = "Show Less";
    }
}

function acceptTask(id) {
    // Find item
    let taskIndex = complaints.findIndex(c => c.id === id);
    if(taskIndex !== -1) {
        complaints[taskIndex].status = 'active';
        showToast(`Task Accepted: ${complaints[taskIndex].type}`);
        renderDashboards();
    }
}

function openProofModal(taskId) {
    document.getElementById('modal-task-id').value = taskId;
    document.getElementById('proof-modal').classList.add('show');
    
    // Reset form
    document.getElementById('proof-form').reset();
    document.getElementById('upload-area').classList.remove('hidden');
    document.getElementById('preview-area').classList.add('hidden');
    document.getElementById('image-preview').src = "";
}

function closeModal() {
    document.getElementById('proof-modal').classList.remove('show');
}

function handleProofSubmit(e) {
    e.preventDefault();
    const taskId = parseInt(document.getElementById('modal-task-id').value);
    const file = document.getElementById('proof-file').files[0];
    
    if(!file) {
        alert("Please upload a proof image or video!");
        return;
    }

    let taskIndex = complaints.findIndex(c => c.id === taskId);
    if(taskIndex !== -1) {
        // Complete the task
        complaints[taskIndex].status = 'completed';
        
        let earn = complaints[taskIndex].bounty;
        // Update Earnings 
        earningsStats.totalEarned += earn;
        earningsStats.completedTasks += 1;
        
        // Add to history
        addTransactionHistory(complaints[taskIndex].type, earn);

        closeModal();
        showToast(`Great work! Earned ₹${earn}`);
        renderDashboards();
        
        // Refresh sankey if in earnings
        if(document.getElementById('tab-earnings').classList.contains('active-tab')) {
            drawSankeyChart();
        }
    }
}

function showToast(msg) {
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ======= EARNINGS LOGIC & GOOGLE CHART =======

function addTransactionHistory(title, amount) {
    const list = document.getElementById('transaction-list');
    const li = document.createElement('li');
    li.className = 'txn-item';
    li.innerHTML = `
        <div class="txn-info">
            <strong style="color:var(--text-main)">Bounty Released</strong> - <span style="font-size:12px;color:var(--text-muted)">${title}</span>
        </div>
        <div class="txn-amount text-success">+ ₹${amount}</div>
    `;
    list.prepend(li); // add to top
}

function drawSankeyChart() {
    // Collect data for sankey dynamically based on completed tasks
    let payoutCategories = {};
    complaints.forEach(c => {
        if(c.status === 'completed') {
            if(!payoutCategories[c.type]) payoutCategories[c.type] = 0;
            payoutCategories[c.type] += c.bounty;
        }
    });

    // If no data, show fake placeholder for looks
    let dataArray = [['From', 'To', 'Weight']];
    let showPlaceholder = Object.keys(payoutCategories).length === 0;

    if(showPlaceholder) {
        dataArray.push(['City Corp Fund', 'Pothole Repair', 600]);
        dataArray.push(['City Corp Fund', 'Garbage Cleanup', 500]);
        dataArray.push(['Pothole Repair', 'Your Wallet', 600]);
        dataArray.push(['Garbage Cleanup', 'Your Wallet', 500]);
    } else {
        let total = 0;
        for(let cat in payoutCategories) {
            dataArray.push(['City Corp Fund', cat, payoutCategories[cat]]);
            dataArray.push([cat, 'Your Wallet', payoutCategories[cat]]);
            total += payoutCategories[cat];
        }
    }

    var data = google.visualization.arrayToDataTable(dataArray);

    var colors = ['#00ffc3', '#7b6cff', '#38bdf8', '#ffbe0b'];
    var options = {
      sankey: {
        node: {
          colors: colors,
          label: { fontName: 'Poppins', fontSize: 13, color: '#ffffff' },
          nodePadding: 20
        },
        link: {
          colorMode: 'gradient',
          colors: colors
        }
      },
      backgroundColor: 'transparent'
    };

    var chart = new google.visualization.Sankey(document.getElementById('sankey_basic'));
    chart.draw(data, options);
}

// Draw chart on initial load if google charts is ready
google.charts.setOnLoadCallback(() => {
    // Only draw if earnings tab active initially (not standard, but safe practice)
    // We already trigger draw in switchTab
});
