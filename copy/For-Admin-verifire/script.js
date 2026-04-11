// DOM Elements
const startVerificationBtn = document.getElementById('btn-start-verification');
const viewLogsBtn = document.getElementById('btn-view-logs');
const validationSection = document.getElementById('validation-section');
const logsSection = document.getElementById('logs-section');

const form = document.getElementById('verification-form');
const digitalIdInput = document.getElementById('digital-id');
const methodSelect = document.getElementById('verification-method');
const verifyBtn = document.getElementById('btn-verify');
const verifySpinner = document.getElementById('verify-spinner');
const verifyText = document.getElementById('verify-text');
const idError = document.getElementById('id-error');

// Last Result Elements
const lastNameEl = document.getElementById('last-name');
const lastIdEl = document.getElementById('last-id');
const lastStatusEl = document.getElementById('last-status');
const lastDateEl = document.getElementById('last-date');
const lastStatusBadge = document.getElementById('last-status-badge');
const lastStatusText = document.getElementById('last-status-text');

// Logs Elements
const logsBody = document.getElementById('logs-body');
const viewFullLogsBtn = document.getElementById('btn-view-full-logs');

// Quick Actions
const quickActionCards = document.querySelectorAll('.quick-action-card');

// Support
const supportBtn = document.querySelector('.btn-support');


// Initial Data
let logs = [
    {
        id: '123456789012',
        name: 'Rajesh Kumar Sharma',
        method: 'OTP (Mobile/Email)',
        status: 'VERIFIED',
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
    },
    {
        id: '987654321098',
        name: 'Anjali Gupta',
        method: 'Biometric',
        status: 'FAILED',
        date: new Date(Date.now() - 1000 * 60 * 95).toISOString()
    },
    {
        id: '555544443333',
        name: 'Mohit Verma',
        method: 'QR Code',
        status: 'PENDING',
        date: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    }
];

// Helper Functions
function maskId(id) {
    if (!id || id.length < 4) return '**** **** ****';
    return `**** **** ${id.slice(-4)}`;
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${d.getDate()} ${months[d.getMonth()]}, ${h}:${m}`;
}

function getStatusIcon(status) {
    if (status === 'VERIFIED') return '<i class="ph-fill ph-check-circle"></i>';
    if (status === 'FAILED') return '<i class="ph-fill ph-x-circle"></i>';
    return '<i class="ph-fill ph-dots-three-circle"></i>';
}

function renderLogs() {
    logsBody.innerHTML = '';
    // Show last 5 logs
    const displayLogs = [...logs].reverse().slice(0, 5);
    
    displayLogs.forEach(log => {
        const tr = document.createElement('tr');
        
        const statusClass = log.status.toLowerCase();
        
        tr.innerHTML = `
            <td><strong>${maskId(log.id)}</strong></td>
            <td>${log.name}</td>
            <td>${log.method}</td>
            <td>
                <span class="status-cell ${statusClass}">
                    ${getStatusIcon(log.status)} ${log.status}
                </span>
            </td>
            <td>${formatDate(log.date)}</td>
            <td class="action-btn-cell">
                <i class="ph ph-file-text" onclick="showLogDetails('${log.id}')"></i>
            </td>
        `;
        
        logsBody.appendChild(tr);
    });
}

function updateLastResult(log) {
    lastNameEl.textContent = log.name;
    lastIdEl.textContent = maskId(log.id);
    lastStatusEl.textContent = log.status === 'VERIFIED' ? 'Authenticated' : (log.status === 'FAILED' ? 'Rejected' : 'Awaiting');
    lastDateEl.textContent = formatDate(log.date);

    // Update Badge
    lastStatusBadge.className = `status-badge ${log.status.toLowerCase()}`;
    lastStatusText.textContent = log.status;

    // Add Glowing Effect to Card
    const card = document.getElementById('last-result-card');
    card.classList.remove('status-card-verified', 'status-card-failed', 'status-card-pending');
    if (log.status === 'VERIFIED') card.classList.add('status-card-verified');
    if (log.status === 'FAILED') card.classList.add('status-card-failed');
    if (log.status === 'PENDING') card.classList.add('status-card-pending');
}

// Format input to add spaces automatically
digitalIdInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, ''); // only digits
    if (val.length > 12) val = val.slice(0, 12);
    
    // Add space after every 4 digits
    let formatted = val;
    if (val.length > 4) formatted = val.slice(0,4) + ' ' + val.slice(4);
    if (val.length > 8) formatted = val.slice(0,4) + ' ' + val.slice(4,8) + ' ' + val.slice(8);
    
    e.target.value = formatted;
    
    if (val.length === 12) {
        idError.classList.remove('visible');
    }
});

// Setup Form Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const rawId = digitalIdInput.value.replace(/\D/g, '');
    
    if (rawId.length !== 12) {
        idError.classList.add('visible');
        return;
    }
    
    idError.classList.remove('visible');
    
    // UI Loading state
    verifyBtn.disabled = true;
    verifySpinner.classList.add('spin');
    verifyText.textContent = 'Verifying...';
    
    // Simulate API call (2 seconds)
    setTimeout(() => {
        const method = methodSelect.value;
        const now = new Date().toISOString();
        let name = '';
        let status = '';

        // Rules implementation
        if (rawId === '123456789012') {
            status = 'VERIFIED';
            name = 'Rajesh Kumar Sharma';
        } else if (rawId === '000000000000') {
            status = 'FAILED';
            name = 'Unknown';
        } else {
            status = 'PENDING';
            const randomNames = ['Amit Patel', 'Neha Singh', 'Vikram Rao', 'Pooja Reddy', 'Suresh Menon'];
            name = randomNames[Math.floor(Math.random() * randomNames.length)];
        }

        const newLog = {
            id: rawId,
            name: name,
            method: method,
            status: status,
            date: now
        };

        // Update State
        logs.push(newLog);
        
        // Update UI
        updateLastResult(newLog);
        renderLogs();

        // Reset UI
        verifyBtn.disabled = false;
        verifySpinner.classList.remove('spin');
        verifyText.textContent = 'Verify Now';
        
        digitalIdInput.value = '';

        // Optional: show a small success/failure alert
        // alert(`Verification completed with status: ${status}`);

    }, 2000);
});

// Interactivity
startVerificationBtn.addEventListener('click', () => {
    validationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => digitalIdInput.focus(), 500);
});

viewLogsBtn.addEventListener('click', () => {
    logsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

viewFullLogsBtn.addEventListener('click', () => {
    alert(`Showing ${logs.length} total verification logs in the system.\n\nIn a real app, this would open a full-page data table with pagination and filtering.`);
});

quickActionCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        alert(`Navigating to: ${title}`);
    });
});

supportBtn.addEventListener('click', () => {
    alert("Opening Verifire Support Center...");
});

// Global Function for inline onclick
window.showLogDetails = function(idSnippet) {
    const log = logs.find(l => l.id.includes(idSnippet));
    if(log) {
        alert(`Verification Details:\n\nName: ${log.name}\nID: ${maskId(log.id)}\nMethod: ${log.method}\nStatus: ${log.status}\nDate: ${formatDate(log.date)}`);
    } else {
        alert('Log not found.');
    }
}

// Initial Render
renderLogs();
// Update Last result to match the most recent initial data
updateLastResult(logs[0]);
