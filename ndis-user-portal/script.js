// Default User Data
const defaultUser = {
    name: 'Karttikeswar Das',
    id: '**** **** 1234',
    mobile: '+91 98765 43210',
    address: '123, Identity Avenue, Capital City, 110001',
    fullId: '123456789012'
};

// Activity History state
let activityHistory = [];

// DOM Elements
const els = {
    navUserName: document.getElementById('nav-user-name'),
    displayName: document.getElementById('display-name'),
    displayId: document.getElementById('display-id'),
    displayMobile: document.getElementById('display-mobile'),
    displayAddress: document.getElementById('display-address'),

    // Status Check
    statusInput: document.getElementById('status-input'),
    checkStatusBtn: document.getElementById('check-status-btn'),
    statusResult: document.getElementById('status-result'),
    statusIcon: document.getElementById('status-icon'),
    statusText: document.getElementById('status-text'),
    statusMessage: document.getElementById('status-message'),

    // History
    historyTbody: document.getElementById('history-tbody'),

    // Modal
    modal: document.getElementById('edit-profile-modal'),
    editBtn: document.getElementById('edit-profile-btn'),
    cancelBtn: document.getElementById('cancel-edit-btn'),
    saveBtn: document.getElementById('save-profile-btn'),

    editName: document.getElementById('edit-name'),
    editMobile: document.getElementById('edit-mobile'),
    editAddress: document.getElementById('edit-address'),
};

// Initialize App
function init() {
    loadUser();
    loadHistory();
    setupEventListeners();
}

// Load user from localStorage or use default
function loadUser() {
    const saved = localStorage.getItem('ndis_user');
    const user = saved ? JSON.parse(saved) : defaultUser;

    // Update UI
    if (els.navUserName) els.navUserName.textContent = user.name;
    if (els.displayName) els.displayName.textContent = user.name;
    if (els.displayId) els.displayId.textContent = user.id;
    if (els.displayMobile) els.displayMobile.textContent = user.mobile;
    if (els.displayAddress) els.displayAddress.textContent = user.address;

    // Fill modal
    if (els.editName) els.editName.value = user.name;
    if (els.editMobile) els.editMobile.value = user.mobile;
    if (els.editAddress) els.editAddress.value = user.address;
}

// Save user data
function saveUser() {
    const user = {
        name: els.editName.value.trim() || defaultUser.name,
        id: defaultUser.id,
        mobile: els.editMobile.value.trim(),
        address: els.editAddress.value.trim(),
        fullId: defaultUser.fullId
    };

    localStorage.setItem('ndis_user', JSON.stringify(user));
    loadUser();
    els.modal.classList.remove('show');

    showNotification('Profile updated successfully', 'success');
    addActivity('Profile Update', 'Success');
}

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('ndis_history');
    if (saved) {
        activityHistory = JSON.parse(saved);
    } else {
        // Init with dummy data
        activityHistory = [
            { date: new Date().toISOString(), action: 'Account Created', status: 'Success' }
        ];
        saveHistory();
    }
    renderHistory();
}

// Save history
function saveHistory() {
    localStorage.setItem('ndis_history', JSON.stringify(activityHistory));
    renderHistory();
}

// Add activity
function addActivity(action, status) {
    activityHistory.unshift({
        date: new Date().toISOString(),
        action: action,
        status: status
    });

    // Keep only last 10 entries
    if (activityHistory.length > 10) activityHistory.pop();
    saveHistory();
}

// Render history to table
function renderHistory() {
    if (!els.historyTbody) return;
    els.historyTbody.innerHTML = '';

    if (activityHistory.length === 0) {
        els.historyTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No recent activity</td></tr>';
        return;
    }

    activityHistory.forEach(item => {
        const dateObj = new Date(item.date);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let badgeClass = 'badge-info';
        if (item.status === 'Success' || item.status === 'APPROVED') badgeClass = 'badge-success';
        else if (item.status === 'REJECTED') badgeClass = 'badge-warning'; // Style handles red for warning classes if needed, or we just map it.

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dateStr}</td>
            <td>${item.action}</td>
            <td><span class="status-badge ${badgeClass}">${item.status}</span></td>
        `;
        els.historyTbody.appendChild(tr);
    });
}

// Check Verification Status
function checkStatus() {
    const id = els.statusInput.value.trim();
    if (!id) {
        showNotification('Please enter an ID number', 'error');
        return;
    }

    // Checking logic based on requirements
    // If ID = 123456789012 → Status = APPROVED
    // If ID = 000000000000 → Status = REJECTED
    // Else → Status = PENDING

    let status, message, colorClass, iconClass;

    if (id === '123456789012') {
        status = 'APPROVED';
        message = 'Your identity is verified';
        colorClass = 'status-approved';
        iconClass = 'ph-check-circle';
    } else if (id === '000000000000') {
        status = 'REJECTED';
        message = 'Your request was rejected';
        colorClass = 'status-rejected';
        iconClass = 'ph-x-circle';
    } else {
        status = 'PENDING';
        message = 'Under review';
        colorClass = 'status-pending';
        iconClass = 'ph-clock';
    }

    // Update UI
    els.statusResult.className = `status-result ${colorClass}`;
    els.statusIcon.innerHTML = `<i class="ph-fill ${iconClass}"></i>`;
    els.statusText.textContent = status;
    els.statusMessage.textContent = message;

    els.statusResult.classList.remove('hidden');

    showNotification(`Status checked: ${status}`, 'info');
    addActivity(`Verification Check`, status);
}

// Show Notifications (Popup Messages)
function showNotification(msg, type = 'info') {
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.className = 'notification';

    let icon = 'ph-info';
    let iconColor = 'var(--primary-blue)';

    if (type === 'success') { icon = 'ph-check-circle'; iconColor = 'var(--success)'; }
    if (type === 'error') { icon = 'ph-warning-circle'; iconColor = 'var(--error)'; }

    notif.innerHTML = `
        <i class="ph-fill ${icon}" style="font-size: 1.75rem; color: ${iconColor}"></i>
        <div style="font-weight: 500; color: var(--text-main);">${msg}</div>
    `;

    container.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('closing');
        setTimeout(() => notif.remove(), 300);
    }, 3500);
}

// Document Actions
function viewDocument(docName) {
    showNotification(`Opening ${docName} viewer...`, 'info');
    addActivity(`Viewed ${docName}`, 'Success');
}

function downloadDocument(docName) {
    showNotification(`Downloading ${docName}...`, 'success');
    addActivity(`Downloaded ${docName}`, 'Success');
}

// Services Actions
function handleServiceClick(serviceName) {
    if (serviceName === 'Update Profile') {
        els.modal.classList.add('show');
    } else if (serviceName === 'Check Verification Status') {
        document.getElementById('check-status-section').scrollIntoView({ behavior: 'smooth' });
        els.statusInput.focus();
    } else {
        showNotification(`${serviceName} action initiated`, 'info');
        addActivity(`Initiated ${serviceName}`, 'Success');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Edit Profile Modal
    if (els.editBtn) els.editBtn.addEventListener('click', () => els.modal?.classList.add('show'));
    if (els.cancelBtn) els.cancelBtn.addEventListener('click', () => els.modal?.classList.remove('show'));
    if (els.saveBtn) els.saveBtn.addEventListener('click', saveUser);

    // Status Check
    if (els.checkStatusBtn) els.checkStatusBtn.addEventListener('click', checkStatus);
    if (els.statusInput) {
        els.statusInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkStatus();
        });
    }

    // Close modal completely on outside click
    window.addEventListener('click', (e) => {
        if (els.modal && e.target === els.modal) els.modal.classList.remove('show');
    });

    // Sidebar Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarLinksElems = document.querySelectorAll('.sidebar-links a');

    function toggleSidebar(show) {
        if (!mobileSidebar || !sidebarOverlay) return;
        if (show) {
            mobileSidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        } else {
            mobileSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleSidebar(true));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => toggleSidebar(false));
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => toggleSidebar(false));
    
    // Close sidebar on link click
    if (sidebarLinksElems) {
        sidebarLinksElems.forEach(link => {
            link.addEventListener('click', () => toggleSidebar(false));
        });
    }
}

// Bootstrap application once DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
