/* ==============================
   ANALYTICS CHARTS FOR OFFICER DASHBOARD
============================== */

async function loadAnalytics(officerId) {
    try {
        const res = await fetch(`../BACKEND/officer/analytics.php?officer_id=${officerId}`);
        const data = await res.json();

        if (data.error) {
            console.error(data.error);
            return;
        }

        renderStatusChart(data.statusStats);
        renderCategoryChart(data.categoryStats);
        renderTrendChart(data.trend);

    } catch (err) {
        console.error("Analytics load error:", err);
    }
}

/* ==============================
   STATUS PIE CHART
============================== */
function renderStatusChart(statusStats) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'In Progress', 'Resolved', 'Overdue'],
            datasets: [{
                data: [
                    statusStats.pending || 0,
                    statusStats['in-progress'] || 0,
                    statusStats.resolved || 0,
                    statusStats.overdue || 0
                ],
                backgroundColor: ['#f97316','#f59e0b','#10b981','#e11d48']
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

/* ==============================
   CATEGORY BAR CHART
============================== */
function renderCategoryChart(categoryStats) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const labels = Object.keys(categoryStats);
    const values = Object.values(categoryStats);

    new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Complaints by Category',
                data: values,
                backgroundColor: '#38bdf8'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/* ==============================
   TREND LINE CHART
============================== */
function renderTrendChart(trendArray) {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    const labels = trendArray.map(d => d.date);
    const values = trendArray.map(d => d.count);

    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Complaints in Last 7 Days',
                data: values,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true },
                x: { ticks: { autoSkip: false } }
            }
        }
    });
}

/* ==============================
   AUTO LOAD ON PAGE
============================== */
document.addEventListener('DOMContentLoaded', () => {
    const officerId = localStorage.getItem("userId");
    if (officerId) loadAnalytics(officerId);
});