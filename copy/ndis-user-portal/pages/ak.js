// Toggle Edit Mode
function toggleEdit(section) {
    const form = document.querySelectorAll(`[id$="-${section}"]`);
    const editButtons = document.querySelector(`[onclick*="toggleEdit('${section}')"]`).closest('.card-header').querySelector('.button-group');
    
    if (section === 'personal') {
        const displayElements = ['name-display', 'dob-display', 'gender-display', 'email-display', 'phone-display', 'address-display'];
        const editElements = ['name-edit', 'dob-edit', 'gender-edit', 'email-edit', 'phone-edit', 'address-edit'];
        const buttonGroup = document.querySelector('.edit-buttons');

        displayElements.forEach((id, index) => {
            const display = document.getElementById(id);
            const edit = document.getElementById(editElements[index]);
            if (display && edit) {
                display.classList.toggle('edit-hidden');
                edit.classList.toggle('edit-hidden');
            }
        });

        if (buttonGroup) {
            buttonGroup.classList.toggle('edit-hidden');
        }
    }
}

// Save Changes with Smooth Animations
function saveChanges(section) {
    if (section === 'personal') {
        // Add loading animation to save button
        const saveBtn = document.querySelector('.btn-save');
        const originalText = saveBtn.textContent;
        
        saveBtn.style.animation = 'pulse 0.6s ease-in-out';
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        
        // Simulate save delay for animation
        setTimeout(() => {
            // Get values from inputs
            const name = document.getElementById('name-edit').value;
            const dob = document.getElementById('dob-edit').value;
            const gender = document.getElementById('gender-edit').value;
            const email = document.getElementById('email-edit').value;
            const phone = document.getElementById('phone-edit').value;
            const address = document.getElementById('address-edit').value;

            // Apply fade before updating
            const displayElements = ['name-display', 'dob-display', 'gender-display', 'email-display', 'phone-display', 'address-display'];
            displayElements.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.animation = 'fadeOut 0.2s ease-out';
                }
            });

            setTimeout(() => {
                // Update display values
                document.getElementById('name-display').textContent = name;
                document.getElementById('dob-display').textContent = formatDate(dob);
                document.getElementById('gender-display').textContent = gender;
                document.getElementById('email-display').textContent = email;
                document.getElementById('phone-display').textContent = phone;
                document.getElementById('address-display').textContent = address;

                // Apply fade-in animation
                displayElements.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) {
                        el.style.animation = 'fadeInUp 0.4s ease-out';
                    }
                });

                // Reset button
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
                saveBtn.style.animation = 'none';

                // Show success message with animation
                showNotification('Personal information updated successfully!', 'success');

                // Toggle back to display mode
                toggleEdit(section);
            }, 300);
        }, 800);
    }
}

// Format date to DD-MM-YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Update Document
function updateDocument(docType) {
    const message = `Please upload your updated ${docType.charAt(0).toUpperCase() + docType.slice(1)} document.`;
    alert(message);
    // In a real application, this would open a file upload dialog
}

// Download Document
function downloadDocument(docType) {
    showNotification(`${docType.charAt(0).toUpperCase() + docType.slice(1)} document download started!`, 'success');
    // In a real application, this would trigger a file download
}

// Show Notification with Enhanced Animation
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-weight: 500;
        letter-spacing: 0.5px;
    `;
    notification.textContent = message;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px) rotate(5deg);
                opacity: 0;
            }
            to {
                transform: translateX(0) rotate(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0) rotate(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px) rotate(-5deg);
                opacity: 0;
            }
        }
        @keyframes pulse-notification {
            0%, 100% {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            50% {
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Add pulse animation
    notification.style.animation += ', pulse-notification 1s ease-in-out infinite';

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// File Upload Handler
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#007bff';
            uploadArea.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            uploadArea.classList.add('drag-over');
            
            // Add animation
            uploadArea.style.animation = 'none';
            setTimeout(() => {
                uploadArea.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = '#f8f9fa';
            uploadArea.classList.remove('drag-over');
            uploadArea.style.animation = 'none';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#dee2e6';
            uploadArea.style.backgroundColor = '#f8f9fa';
            uploadArea.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });

        fileInput.addEventListener('change', function(e) {
            handleFileUpload(e.target.files);
        });

        // Smooth scroll animation for info items on hover
        const infoItems = document.querySelectorAll('.info-item');
        infoItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = 'wordPulse 0.4s ease-out';
                }, 10);
            });
        });
    }
});

// Handle File Upload
function handleFileUpload(files) {
    if (files.length === 0) return;

    Array.from(files).forEach(file => {
        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Only PDF and image files are allowed!', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('File size must be less than 5MB!', 'error');
            return;
        }

        // Add file to list
        addDocumentToList(file.name);
        showNotification(`${file.name} uploaded successfully!`, 'success');
    });
}

// Add Document to List with Animation
function addDocumentToList(fileName) {
    const documentsList = document.querySelector('.documents-list');
    const newDoc = document.createElement('div');
    newDoc.className = 'doc-item';
    
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    newDoc.innerHTML = `
        <span>${fileName}</span>
        <span class="doc-date">Uploaded: ${dateStr}</span>
        <button class="btn-remove" onclick="removeDocument(this)">Remove</button>
    `;
    
    // Start with hidden state
    newDoc.style.opacity = '0';
    newDoc.style.transform = 'translateX(-20px)';
    
    documentsList.appendChild(newDoc);
    
    // Trigger animation
    setTimeout(() => {
        newDoc.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        newDoc.style.opacity = '1';
        newDoc.style.transform = 'translateX(0)';
    }, 10);
}

// Remove Document with Animation
function removeDocument(button) {
    const docItem = button.parentElement;
    const fileName = docItem.querySelector('span').textContent;
    
    if (confirm(`Are you sure you want to remove ${fileName}?`)) {
        // Remove with smooth animation
        docItem.style.animation = 'fadeOut 0.4s ease-out';
        docItem.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        docItem.style.opacity = '0';
        docItem.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            docItem.remove();
            showNotification(`${fileName} removed successfully!`, 'success');
        }, 400);
    }
}

// Logout functionality with animations
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                // Add fade-out animation to entire page
                const container = document.querySelector('.container');
                if (container) {
                    container.style.animation = 'fadeOut 0.6s ease-out';
                    container.style.opacity = '0';
                }
                
                showNotification('Logging out...', 'info');
                setTimeout(() => {
                    // In a real application, this would redirect to login page
                    alert('You have been logged out. Redirecting to login page...');
                }, 1500);
            }
        });
    }
});

// Print Profile
function printProfile() {
    window.print();
}

// Export Profile to PDF
function exportProfilePDF() {
    showNotification('Profile export feature coming soon!', 'info');
}

// Real-time validation for email with animations
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email-edit');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            if (email && !isValidEmail(email)) {
                this.style.borderColor = '#dc3545';
                this.style.animation = 'shake 0.4s ease-in-out';
                
                const errorMsg = document.createElement('small');
                errorMsg.style.cssText = `
                    color: #dc3545;
                    animation: slideInLeft 0.3s ease-out;
                    display: block;
                    margin-top: 0.3rem;
                `;
                errorMsg.textContent = 'Invalid email format';
                if (!this.nextElementSibling || this.nextElementSibling.tagName !== 'SMALL') {
                    this.parentElement.appendChild(errorMsg);
                }
            } else {
                this.style.borderColor = '#28a745';
                this.style.animation = 'none';
                
                const errorMsg = this.nextElementSibling;
                if (errorMsg && errorMsg.tagName === 'SMALL') {
                    errorMsg.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => errorMsg.remove(), 300);
                }
            }
        });
    }
});

// Add shake animation keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone-edit');
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const phone = this.value.replace(/\D/g, '');
            if (phone && phone.length < 10) {
                this.style.borderColor = '#dc3545';
                showNotification('Phone number must have at least 10 digits', 'error');
            } else {
                this.style.borderColor = '#dee2e6';
            }
        });
    }
});

// Add keyboard shortcuts with animations
document.addEventListener('keydown', function(e) {
    // Ctrl + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.querySelector('.btn-save:not(.edit-hidden)');
        if (saveBtn) {
            // Add ripple animation
            saveBtn.style.animation = 'none';
            setTimeout(() => {
                saveBtn.style.animation = 'pulse 0.6s ease-in-out';
            }, 10);
            saveBtn.click();
        }
    }
    
    // Esc to cancel edit
    if (e.key === 'Escape') {
        const cancelBtn = document.querySelector('.btn-cancel:not(.edit-hidden)');
        if (cancelBtn) {
            cancelBtn.style.animation = 'none';
            setTimeout(() => {
                cancelBtn.style.animation = 'slideInUp 0.3s ease-out';
            }, 10);
            cancelBtn.click();
        }
    }
});

// Add smooth animations to all buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        btn.addEventListener('click', function() {
            if (!this.classList.contains('logout-btn')) {
                // Add click animation
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    left: ${event.clientX - rect.left}px;
                    top: ${event.clientY - rect.top}px;
                `;
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
});

// Add ripple animation keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('Profile page loaded with smooth animations!');

// Add smooth animations on page load
document.addEventListener('DOMContentLoaded', function() {
    // Animate page elements on load
    const elements = document.querySelectorAll('.card, .profile-card, .quick-stats, .sidebar');
    elements.forEach((element, index) => {
        element.style.animation = `fadeInUp 0.6s ease-out ${0.2 + index * 0.1}s both`;
    });

    // Add text animations to headings
    const headings = document.querySelectorAll('.card-header h3');
    headings.forEach(heading => {
        heading.classList.add('text-slide');
    });

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Animate Save/Cancel buttons when showing
function animateButtonGroup(buttonGroup) {
    if (buttonGroup) {
        buttonGroup.style.animation = 'slideInUp 0.4s ease-out';
    }
}

// Enhanced Edit Mode with Animations
function toggleEdit(section) {
    const form = document.querySelectorAll(`[id$="-${section}"]`);
    const editButtons = document.querySelector(`[onclick*="toggleEdit('${section}')"]`)?.closest('.card-header').querySelector('.button-group');
    
    if (section === 'personal') {
        const displayElements = ['name-display', 'dob-display', 'gender-display', 'email-display', 'phone-display', 'address-display'];
        const editElements = ['name-edit', 'dob-edit', 'gender-edit', 'email-edit', 'phone-edit', 'address-edit'];
        const buttonGroup = document.querySelector('.edit-buttons');

        displayElements.forEach((id, index) => {
            const display = document.getElementById(id);
            const edit = document.getElementById(editElements[index]);
            if (display && edit) {
                if (display.classList.contains('edit-hidden')) {
                    // Showing edit fields
                    display.style.animation = 'fadeOut 0.3s ease-out';
                    edit.style.animation = 'slideInUp 0.4s ease-out';
                } else {
                    // Hiding edit fields
                    display.style.animation = 'slideInUp 0.4s ease-out';
                    edit.style.animation = 'fadeOut 0.3s ease-out';
                }
                
                setTimeout(() => {
                    display.classList.toggle('edit-hidden');
                    edit.classList.toggle('edit-hidden');
                }, 150);
            }
        });

        if (buttonGroup) {
            if (!buttonGroup.classList.contains('edit-hidden')) {
                buttonGroup.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    buttonGroup.classList.add('edit-hidden');
                }, 300);
            } else {
                buttonGroup.style.animation = 'slideInUp 0.4s ease-out';
                buttonGroup.classList.remove('edit-hidden');
            }
        }
    }
}
