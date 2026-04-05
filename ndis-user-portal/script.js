// User State Initial Data
const DEFAULT_USER = {
    name: "John Doe",
    id: "987654321234",
    mobile: "+1 (555) 123-4567",
    address: "123 Secure Ave, Block B, Tech City"
};

// Initial Activity History
const DEFAULT_HISTORY = [
    {
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        action: "Profile Update",
        statusType: "success",
        statusText: "Completed"
    },
    {
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        action: "Verification Check",
        statusType: "info",
        statusText: "Checked"
    }
];

// Initialize Local Storage if empty
if (!localStorage.getItem('ndis_user')) {
    localStorage.setItem('ndis_user', JSON.stringify(DEFAULT_USER));
}
if (!localStorage.getItem('ndis_history')) {
    localStorage.setItem('ndis_history', JSON.stringify(DEFAULT_HISTORY));
}

// Load Data
let currentUser = JSON.parse(localStorage.getItem('ndis_user'));
let activityHistory = JSON.parse(localStorage.getItem('ndis_history'));

// Format functions
function maskId(id) {
    if(!id || id.length < 4) return '**** **** ****';
    return `**** **** ${id.slice(-4)}`;
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Notification System
function showNotification(msg) {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="ph-fill ph-check-circle" style="color: var(--accent)"></i> <span>${msg}</span>`;
    
    container.appendChild(notif);

    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            notif.remove();
        }, 300);
    }, 3000);
}

// Add Activity
function addActivity(action, statusType="info", statusText="Completed") {
    const newActivity = {
        date: new Date().toISOString(),
        action: action,
        statusType: statusType,
        statusText: statusText
    };
    
    activityHistory.unshift(newActivity); // Add to beginning
    if(activityHistory.length > 10) activityHistory.pop(); // Keep max 10
    
    localStorage.setItem('ndis_history', JSON.stringify(activityHistory));
    renderHistory();
}

// Render Functions
function renderProfile() {
    document.getElementById('header-user-name').textContent = currentUser.name.split(' ')[0];
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-id').textContent = maskId(currentUser.id);
    document.getElementById('profile-mobile').textContent = currentUser.mobile;
    document.getElementById('profile-address').textContent = currentUser.address;
}

function renderHistory() {
    const tbody = document.getElementById('history-body');
    tbody.innerHTML = '';
    
    if (activityHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center">No recent activity</td></tr>`;
        return;
    }

    activityHistory.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.action}</td>
            <td><span class="status-text ${item.statusType}">${item.statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Event Listeners

document.getElementById('btn-view-profile').addEventListener('click', () => {
    document.getElementById('profile-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-hero-status').addEventListener('click', () => {
    document.getElementById('status-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('nav-services').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('nav-documents').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('docs-section').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-edit-profile').addEventListener('click', () => {
    const newName = prompt("Enter new Full Name:", currentUser.name);
    if(newName && newName.trim() !== '') {
        currentUser.name = newName;
        localStorage.setItem('ndis_user', JSON.stringify(currentUser));
        renderProfile();
        addActivity("Profile Update", "success", "Updated");
        showNotification("Profile updated successfully");
    }
});

// Check Status Logic
const statusForm = document.getElementById('status-form');
const statusInput = document.getElementById('status-input');
const resultContainer = document.getElementById('status-result');
const resultBadge = document.getElementById('result-badge');
const resultIcon = document.getElementById('result-icon');
const resultText = document.getElementById('result-text');
const resultMessage = document.getElementById('result-message');

statusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = statusInput.value.replace(/\D/g, ''); // only allow digits in logic check
    
    // Simulate API Check
    resultContainer.style.display = 'block';
    
    let statusConfig = {};

    if (id === '123456789012') {
        statusConfig = {
            class: 'approved',
            icon: 'ph-check-circle',
            label: 'APPROVED',
            message: 'Your identity is verified and active.'
        };
        addActivity(`Verification Check (ID ending **${id.slice(-4)})`, "success", "Approved");
    } else if (id === '000000000000') {
        statusConfig = {
            class: 'rejected',
            icon: 'ph-x-circle',
            label: 'REJECTED',
            message: 'Your request was rejected. Please contact support.'
        };
        addActivity(`Verification Check (ID ending **${id.slice(-4)})`, "danger", "Rejected");
    } else {
        statusConfig = {
            class: 'pending',
            icon: 'ph-clock-circle',
            label: 'PENDING',
            message: 'Under review. Please check back later.'
        };
        addActivity(`Verification Check`, "warning", "Pending");
    }

    resultBadge.className = `status-badge ${statusConfig.class}`;
    resultIcon.className = `ph-fill ${statusConfig.icon}`;
    resultText.textContent = statusConfig.label;
    resultMessage.textContent = statusConfig.message;

    showNotification("Status checked");
});

// Global Handlers
window.handleService = function(serviceName) {
    if(serviceName === 'Update Profile') {
        document.getElementById('btn-edit-profile').click();
    } else if(serviceName === 'Check Verification Status') {
        document.getElementById('status-section').scrollIntoView({ behavior: 'smooth' });
        statusInput.focus();
    } else {
        alert(`${serviceName} functionality is currently undergoing maintenance.`);
    }
}

window.viewDocument = function(docName) {
    alert(`Opening viewer for: ${docName}`);
    addActivity(`Viewed Document: ${docName}`);
}

window.downloadDocument = function(docName) {
    alert(`Downloading: ${docName}...`);
    addActivity(`Downloaded Document: ${docName}`, "success", "Downloaded");
    showNotification("Document download started");
}

// Init
renderProfile();
renderHistory();
