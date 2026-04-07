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
    const nameHeader = document.getElementById('header-user-name');
    const nameProfile = document.getElementById('profile-name');
    const idProfile = document.getElementById('profile-id');
    const mobileProfile = document.getElementById('profile-mobile');
    const addressProfile = document.getElementById('profile-address');

    if (nameHeader) nameHeader.textContent = currentUser.name.split(' ')[0];
    if (nameProfile) nameProfile.textContent = currentUser.name;
    if (idProfile) idProfile.textContent = maskId(currentUser.id);
    if (mobileProfile) mobileProfile.textContent = currentUser.mobile;
    if (addressProfile) addressProfile.textContent = currentUser.address;
}

function renderHistory() {
    const tbody = document.getElementById('history-body');
    if (!tbody) return;
    
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

const btnViewProfile = document.getElementById('btn-view-profile');
if (btnViewProfile) {
    btnViewProfile.addEventListener('click', () => {
        document.getElementById('profile-section').scrollIntoView({ behavior: 'smooth' });
    });
}

const btnHeroStatus = document.getElementById('btn-hero-status');
if (btnHeroStatus) {
    btnHeroStatus.addEventListener('click', () => {
        document.getElementById('status-section').scrollIntoView({ behavior: 'smooth' });
    });
}

const navAbout = document.getElementById('nav-about');
if (navAbout) {
    navAbout.addEventListener('click', (e) => {
        // Only prevent default and scroll if we are on the page with the section
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            e.preventDefault();
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const navServices = document.getElementById('nav-services');
if (navServices) {
    navServices.addEventListener('click', (e) => {
        const servicesSection = document.getElementById('services-section');
        if (servicesSection) {
            e.preventDefault();
            servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const navDocuments = document.getElementById('nav-documents');
if (navDocuments) {
    navDocuments.addEventListener('click', (e) => {
        const docsSection = document.getElementById('docs-section');
        if (docsSection) {
            e.preventDefault();
            docsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

const btnEditProfile = document.getElementById('btn-edit-profile');
if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
        const newName = prompt("Enter new Full Name:", currentUser.name);
        if(newName && newName.trim() !== '') {
            currentUser.name = newName;
            localStorage.setItem('ndis_user', JSON.stringify(currentUser));
            renderProfile();
            addActivity("Profile Update", "success", "Updated");
            showNotification("Profile updated successfully");
        }
    });
}

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

// --- Help Center Specific Logic ---

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close other open items
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Report Issue Form
const reportForm = document.getElementById('report-form');
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const successEl = document.getElementById('report-success');
        reportForm.style.display = 'none';
        successEl.style.display = 'block';
        
        showNotification("Issue reported successfully!");
        addActivity("Reported Issue", "info", "Sent");
    });
}

// Global Handlers (Existing)
window.handleService = function(serviceName) {
    if(serviceName === 'Update Profile') {
        const btnEdit = document.getElementById('btn-edit-profile');
        if (btnEdit) btnEdit.click();
    } else if(serviceName === 'Check Verification Status') {
        const statusSec = document.getElementById('status-section');
        if (statusSec) {
            statusSec.scrollIntoView({ behavior: 'smooth' });
            if (statusInput) statusInput.focus();
        }
    } else {
        alert(`${serviceName} functionality is currently undergoing maintenance.`);
    }
}

// Quick Help Actions
window.quickHelpAction = function(type) {
    if (type === 'Login Issues') {
        alert("Redirecting to account recovery...");
    } else if (type === 'ID Verification Problems') {
        const faqSection = document.getElementById('faq-section');
        if (faqSection) faqSection.scrollIntoView({ behavior: 'smooth' });
        else alert("Please check the FAQ section on the Help Center page.");
    } else if (type === 'Update Request Status') {
        window.location.href = 'index.html#status-section';
    }
}

// --- Services Page Logic ---
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

window.checkServiceStatus = function() {
    const idInput = document.getElementById('service-status-input');
    const resultDiv = document.getElementById('service-status-result');
    const id = idInput.value.trim();

    if (id.length !== 12) {
        alert("Please enter a valid 12-digit Digital ID.");
        return;
    }

    resultDiv.classList.add('show');
    resultDiv.style.display = 'block';

    if (id === '123456789012') {
        resultDiv.style.backgroundColor = 'var(--success-bg)';
        resultDiv.style.color = 'var(--success-text)';
        resultDiv.innerHTML = '<strong>APPROVED</strong><br>Your ID is verified and ready for use.';
    } else if (id === '000000000000') {
        resultDiv.style.backgroundColor = 'var(--danger-bg)';
        resultDiv.style.color = 'var(--danger-text)';
        resultDiv.innerHTML = '<strong>REJECTED</strong><br>Identity verification failed. Contact support.';
    } else {
        resultDiv.style.backgroundColor = 'var(--pending-bg)';
        resultDiv.style.color = 'var(--pending-text)';
        resultDiv.innerHTML = '<strong>PENDING</strong><br>Your request is currently under review.';
    }
    
    addActivity(`Service Status Check (${id.slice(-4)})`, "info", "Checked");
}

window.handleGenericService = function(service) {
    alert(`${service} Coming Soon!\nThis feature is currently being integrated into the system.`);
}

// --- Documents Page Logic ---
window.viewDocDetails = function(name, status, date) {
    const modal = document.getElementById('doc-view-modal');
    document.getElementById('modal-doc-name').textContent = name;
    document.getElementById('modal-doc-status').textContent = status;
    document.getElementById('modal-doc-date').textContent = date;
    
    // Set status color
    const statusEl = document.getElementById('modal-doc-status');
    statusEl.className = status === 'Available' ? 'doc-status-badge available' : 'doc-status-badge missing';
    
    openModal('doc-view-modal');
}

window.downloadDoc = function(name) {
    showNotification(`Downloading ${name}...`);
    setTimeout(() => {
        alert(`${name} download started successfully.`);
        addActivity(`Downloaded: ${name}`, "success", "Downloaded");
    }, 500);
}

window.triggerUpload = function(docId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            showNotification(`Uploading ${file.name}...`);
            setTimeout(() => {
                const card = document.getElementById(docId);
                const badge = card.querySelector('.doc-status-badge');
                
                // Update Badge
                badge.textContent = 'Available';
                badge.className = 'doc-status-badge available';
                
                // Update Buttons
                const footer = card.querySelector('.doc-footer-actions');
                footer.innerHTML = `
                    <button class="btn btn-secondary" onclick="viewDocDetails('${docId.replace('-',' ')}', 'Available', '07 Apr 2026')">View</button>
                    <button class="btn btn-primary" onclick="downloadDoc('${docId.replace('-',' ')}')">Download</button>
                `;
                
                showNotification(`${docId.replace('-',' ')} uploaded successfully!`);
                addActivity(`Uploaded: ${docId.replace('-',' ')}`, "success", "Uploaded");
            }, 1500);
        }
    };
    
    input.click();
}

window.filterDocs = function() {
    const searchVal = document.getElementById('doc-search-input').value.toLowerCase();
    const filterVal = document.getElementById('doc-filter-select').value;
    const cards = document.querySelectorAll('.doc-card-large');
    
    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const status = card.querySelector('.doc-status-badge').textContent;
        
        const matchesSearch = name.includes(searchVal);
        const matchesFilter = filterVal === 'All' || 
                             (filterVal === 'Available' && status === 'Available') ||
                             (filterVal === 'Not Uploaded' && status === 'Not Uploaded');
                             
        if (matchesSearch && matchesFilter) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Slideshow Logic ---
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function nextSlide() {
    if (slides.length < 2) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

if (slides.length > 1) {
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Init
renderProfile();
renderHistory();



