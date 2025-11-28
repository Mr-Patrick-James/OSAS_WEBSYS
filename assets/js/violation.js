// violations.js

// Global variables
let violationsData = {};
let currentEditingId = null;

// DOM Elements
const violationsTableBody = document.getElementById('ViolationsTableBody');
const violationDetailsModal = document.getElementById('ViolationDetailsModal');
const closeDetailsModal = document.getElementById('closeDetailsModal');
const violationModalTitle = document.getElementById('violationModalTitle');
const modalStudentId = document.getElementById('modalStudentId');
const modalStudentName = document.getElementById('modalStudentName');
const modalStudentDept = document.getElementById('modalStudentDept');
const modalStudentSection = document.getElementById('modalStudentSection');
const violationNotes = document.getElementById('violationNotes');
const btnAddViolations = document.getElementById('btnAddViolations');
const btnPrintViolations = document.getElementById('btnPrintViolations');
const btnCancel = document.querySelector('.btn-cancel');
const btnSubmit = document.querySelector('.btn-submit');
const violationsFilter = document.getElementById('ViolationsFilter');
const violationsStatusFilter = document.getElementById('ViolationsStatusFilter');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    loadViolationsData();
});

// Initialize event listeners
function initEventListeners() {
    // Add violation button
    if (btnAddViolations) {
        btnAddViolations.addEventListener('click', openAddViolationModal);
    }
    
    // Print button
    if (btnPrintViolations) {
        btnPrintViolations.addEventListener('click', printViolations);
    }
    
    // Modal close button
    if (closeDetailsModal) {
        closeDetailsModal.addEventListener('click', closeModal);
    }
    
    // Cancel button
    if (btnCancel) {
        btnCancel.addEventListener('click', closeModal);
    }
    
    // Submit button
    if (btnSubmit) {
        btnSubmit.addEventListener('click', handleViolationSubmit);
    }
    
    // Filter change events
    if (violationsFilter) {
        violationsFilter.addEventListener('change', filterViolations);
    }
    
    if (violationsStatusFilter) {
        violationsStatusFilter.addEventListener('change', filterViolations);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === violationDetailsModal) {
            closeModal();
        }
    });
    
    // Violation type selection
    document.querySelectorAll('.violation-type-card').forEach(card => {
        card.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update card appearance
            document.querySelectorAll('.violation-type-card').forEach(c => {
                c.style.borderColor = '#ddd';
                c.style.backgroundColor = 'white';
            });
            this.style.borderColor = '#3498db';
            this.style.backgroundColor = '#ebf5fb';
        });
    });
}

// Load violations data
function loadViolationsData() {
    // In a real application, you would fetch data from an API
    // For now, we'll start with an empty dataset
    violationsData = {};
    renderViolationsTable();
}

// Render violations table
function renderViolationsTable() {
    const violationsArray = Object.values(violationsData);
    
    if (violationsArray.length === 0) {
        violationsTableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="9">
                    <div class="empty-state">
                        <i class='bx bx-file-blank'></i>
                        <h3>No Violations Recorded</h3>
                        <p>Click "Add Violations" to record a new violation</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    let tableHTML = '';
    
    violationsArray.forEach(violation => {
        const statusClass = getStatusClass(violation.status);
        const statusText = getStatusText(violation.status);
        
        tableHTML += `
            <tr>
                <td>${violation.id}</td>
                <td>
                    <div style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;font-size:14px;">👤</div>
                </td>
                <td>${violation.studentId}</td>
                <td>${violation.studentName}</td>
                <td>${violation.department}</td>
                <td>${violation.section}</td>
                <td>${violation.contact}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td class="action-buttons">
                    <button class="action-btn edit" onclick="editViolation('${violation.id}')" title="Edit">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteViolation('${violation.id}')" title="Delete">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    violationsTableBody.innerHTML = tableHTML;
}

// Get status class for styling
function getStatusClass(status) {
    const statusMap = {
        'active': 'active',
        'pending': 'pending',
        'resolved': 'resolved',
        'warning': 'warning'
    };
    return statusMap[status] || 'pending';
}

// Get status text for display
function getStatusText(status) {
    const statusMap = {
        'active': 'Disciplinary Action',
        'pending': 'Permitted',
        'resolved': 'Warning',
        'warning': 'Warning'
    };
    return statusMap[status] || 'Pending';
}

// Open add violation modal
function openAddViolationModal() {
    currentEditingId = null;
    violationModalTitle.textContent = 'Record Violation';
    btnSubmit.textContent = 'Record Violation';
    
    // Reset form fields
    resetModalForm();
    
    // Show modal
    violationDetailsModal.style.display = 'block';
}

// Reset modal form
function resetModalForm() {
    // Clear student info
    modalStudentId.textContent = '-';
    modalStudentName.textContent = '-';
    modalStudentDept.textContent = '-';
    modalStudentSection.textContent = '-';
    
    // Clear violation type selection
    document.querySelectorAll('input[name="violationType"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Clear violation level selection
    document.querySelectorAll('input[name$="Level"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Clear notes
    violationNotes.value = '';
    
    // Reset card styles
    document.querySelectorAll('.violation-type-card').forEach(card => {
        card.style.borderColor = '#ddd';
        card.style.backgroundColor = 'white';
    });
}

// Edit violation function
function editViolation(violationId) {
    const violation = violationsData[violationId];
    if (!violation) {
        showNotification('Violation not found!', 'error');
        return;
    }

    currentEditingId = violationId;
    violationModalTitle.textContent = 'Edit Violation';
    btnSubmit.textContent = 'Update Violation';
    
    // Populate student info
    modalStudentId.textContent = violation.studentId;
    modalStudentName.textContent = violation.studentName;
    modalStudentDept.textContent = violation.department;
    modalStudentSection.textContent = violation.section;
    
    // Set violation type
    const violationTypeRadio = document.querySelector(`input[name="violationType"][value="${violation.violationType}"]`);
    if (violationTypeRadio) {
        violationTypeRadio.checked = true;
        // Update card appearance
        const card = violationTypeRadio.closest('.violation-type-card');
        card.style.borderColor = '#3498db';
        card.style.backgroundColor = '#ebf5fb';
    }
    
    // Set violation level
    const levelRadio = document.querySelector(`input[name="${violation.violationType.replace('_', '')}Level"][value="${violation.level}"]`);
    if (levelRadio) {
        levelRadio.checked = true;
    }
    
    // Set notes
    violationNotes.value = violation.notes;
    
    // Show modal
    violationDetailsModal.style.display = 'block';
}

// Handle violation submission (both add and edit)
function handleViolationSubmit() {
    const violationType = document.querySelector('input[name="violationType"]:checked');
    const level = violationType ? document.querySelector(`input[name="${violationType.value.replace('_', '')}Level"]:checked`) : null;
    const notes = violationNotes.value;
    
    if (!violationType || !level) {
        showNotification('Please select violation type and level!', 'error');
        return;
    }
    
    if (currentEditingId) {
        updateViolation(currentEditingId, violationType.value, level.value, notes);
    } else {
        submitViolation(violationType.value, level.value, notes);
    }
}

// Update violation function
function updateViolation(violationId, violationType, level, notes) {
    // Update the violation data
    violationsData[violationId].violationType = violationType;
    violationsData[violationId].level = level;
    violationsData[violationId].notes = notes;
    
    // Show success message
    showNotification('Violation updated successfully!', 'success');
    
    // Close modal and refresh table
    closeModal();
    renderViolationsTable();
}

// Submit new violation function
function submitViolation(violationType, level, notes) {
    // Generate new violation ID
    const newId = 'V' + String(Object.keys(violationsData).length + 1).padStart(3, '0');
    
    // Create new violation object
    violationsData[newId] = {
        id: newId,
        studentId: '2024-' + String(Object.keys(violationsData).length + 1).padStart(3, '0'),
        studentName: 'New Student',
        department: 'Bachelor of Science in Information System',
        section: 'BSIS-1',
        contact: '+63 099 000-0000',
        status: 'pending',
        violationType: violationType,
        level: level,
        date: new Date().toISOString().split('T')[0],
        notes: notes
    };
    
    showNotification('Violation recorded successfully!', 'success');
    closeModal();
    renderViolationsTable();
}

// Delete violation function
function deleteViolation(violationId) {
    if (confirm(`Are you sure you want to delete violation ${violationId}?`)) {
        // Remove from data
        delete violationsData[violationId];
        
        showNotification('Violation deleted successfully!', 'success');
        renderViolationsTable();
    }
}

// Close modal function
function closeModal() {
    violationDetailsModal.style.display = 'none';
    currentEditingId = null;
}

// Filter violations
function filterViolations() {
    // Implementation for filtering violations
    console.log('Filtering violations...');
    // In a real application, you would filter the violationsData and re-render the table
}

// Print functionality
function printViolations() {
    const printArea = document.getElementById('printArea');
    const originalContent = document.body.innerHTML;
    
    // Create print content
    const printContent = `
        <html>
            <head>
                <title>Violations Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
                    .status.active { background-color: #4CAF50; color: white; }
                    .status.pending { background-color: #FF9800; color: white; }
                    .status.resolved { background-color: #2196F3; color: white; }
                    .status.warning { background-color: #f44336; color: white; }
                    h1 { color: #333; margin-bottom: 10px; }
                    .report-date { color: #666; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                <h1>Violations Report</h1>
                <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
                ${printArea.innerHTML}
            </body>
        </html>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class='bx ${getNotificationIcon(type)}'></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class='bx bx-x'></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'bx-check-circle',
        error: 'bx-error-circle',
        warning: 'bx-error',
        info: 'bx-info-circle'
    };
    return icons[type] || icons.info;
}