// Violations Module
let violationsData = [
  {
    id: 'V001',
    studentId: '2024-001',
    studentName: 'John Doe',
    department: 'Computer Science',
    section: 'CS-3A',
    violationType: 'improper_uniform',
    level: 'permitted1',
    date: '2024-01-15',
    status: 'resolved',
    notes: 'Wore non-school uniform shirt'
  },
  {
    id: 'V002',
    studentId: '2024-002',
    studentName: 'Jane Smith',
    department: 'Business',
    section: 'BS-2B',
    violationType: 'improper_footwear',
    level: 'warning1',
    date: '2024-01-14',
    status: 'pending',
    notes: 'Wore non-school approved shoes'
  },
  {
    id: 'V003',
    studentId: '2024-003',
    studentName: 'Mike Johnson',
    department: 'Engineering',
    section: 'ENG-4A',
    violationType: 'no_id',
    level: 'permitted2',
    date: '2024-01-13',
    status: 'resolved',
    notes: 'Failed to present school ID when requested'
  }
];

function initViolationsModule() {
  console.log('🛠 Initializing Violations module...');

  // Initialize elements
  const btnAddViolations = document.getElementById('btnAddViolations');
  const modal = document.getElementById('ViolationDetailsModal');
  const closeBtn = document.getElementById('closeDetailsModal');
  const exportBtn = document.getElementById('btnExportViolations');
  const refreshBtn = document.getElementById('refreshBtn');
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchViolations');

  // Filter elements
  const violationTypeFilter = document.getElementById('violationTypeFilter');
  const statusFilter = document.getElementById('statusFilter');
  const departmentFilter = document.getElementById('departmentFilter');

  if (!btnAddViolations || !modal || !closeBtn) {
    console.error('❗ Violations module elements not found!');
    return;
  }

  // Initialize data
  loadViolationsData();
  updateStatistics();

  // Event listeners
  btnAddViolations.addEventListener('click', openAddViolationModal);
  closeBtn.addEventListener('click', closeModal);
  exportBtn.addEventListener('click', exportViolations);
  refreshBtn.addEventListener('click', refreshData);
  searchBtn.addEventListener('click', searchViolations);
  searchInput.addEventListener('keyup', searchViolations);

  // Filter event listeners
  if (violationTypeFilter) {
    violationTypeFilter.addEventListener('change', filterViolations);
  }
  if (statusFilter) {
    statusFilter.addEventListener('change', filterViolations);
  }
  if (departmentFilter) {
    departmentFilter.addEventListener('change', filterViolations);
  }

  // Modal close on outside click
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Form submission
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', submitViolation);
  }

  console.log('✅ Violations module ready!');
}

// Load violations data into table
function loadViolationsData() {
  const tbody = document.getElementById('violationsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  violationsData.forEach(violation => {
    const row = createViolationRow(violation);
    tbody.appendChild(row);
  });
}

// Create violation table row
function createViolationRow(violation) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${violation.id}</td>
    <td>
      <div class="student-info">
        <img src="../assets/img/user.jpg" alt="Student" class="student-avatar">
        <div class="student-details">
          <span class="student-name">${violation.studentName}</span>
          <span class="student-id">${violation.studentId}</span>
        </div>
      </div>
    </td>
    <td>
      <span class="violation-type ${violation.violationType}">
        <i class='bx bxs-${getViolationIcon(violation.violationType)}'></i>
        ${getViolationTypeName(violation.violationType)}
      </span>
    </td>
    <td><span class="level-badge ${violation.level}">${getLevelName(violation.level)}</span></td>
    <td>${violation.date}</td>
    <td>${violation.department}</td>
    <td><span class="status ${violation.status}">${violation.status}</span></td>
    <td>
      <div class="action-buttons">
        <button class="btn-view" onclick="viewViolation('${violation.id}')" title="View Details">
          <i class='bx bx-show'></i>
        </button>
        <button class="btn-edit" onclick="editViolation('${violation.id}')" title="Edit">
          <i class='bx bx-edit'></i>
        </button>
        <button class="btn-delete" onclick="deleteViolation('${violation.id}')" title="Delete">
          <i class='bx bx-trash'></i>
        </button>
      </div>
    </td>
  `;
  return row;
}

// Helper functions
function getViolationIcon(type) {
  const icons = {
    'improper_uniform': 't-shirt',
    'improper_footwear': 'shoe',
    'no_id': 'id-card'
  };
  return icons[type] || 'error-circle';
}

function getViolationTypeName(type) {
  const names = {
    'improper_uniform': 'Improper Uniform',
    'improper_footwear': 'Improper Footwear',
    'no_id': 'No ID Card'
  };
  return names[type] || type;
}

function getLevelName(level) {
  const names = {
    'permitted1': 'Permitted 1',
    'permitted2': 'Permitted 2',
    'warning1': 'Warning 1',
    'warning2': 'Warning 2',
    'warning3': 'Warning 3'
  };
  return names[level] || level;
}

// Modal functions
function openAddViolationModal() {
  const modal = document.getElementById('ViolationDetailsModal');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('ViolationDetailsModal');
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

// Action functions
function viewViolation(id) {
  const violation = violationsData.find(v => v.id === id);
  if (violation) {
    showNotification(`Viewing violation ${id} for ${violation.studentName}`, 'info');
    // Here you can implement a detailed view modal
  }
}

function editViolation(id) {
  const violation = violationsData.find(v => v.id === id);
  if (violation) {
    showNotification(`Editing violation ${id} for ${violation.studentName}`, 'info');
    // Here you can implement edit functionality
  }
}

function deleteViolation(id) {
  if (confirm('Are you sure you want to delete this violation?')) {
    violationsData = violationsData.filter(v => v.id !== id);
    loadViolationsData();
    updateStatistics();
    showNotification('Violation deleted successfully', 'success');
  }
}

// Filter and search functions
function filterViolations() {
  const typeFilter = document.getElementById('violationTypeFilter')?.value || 'all';
  const statusFilter = document.getElementById('statusFilter')?.value || 'all';
  const departmentFilter = document.getElementById('departmentFilter')?.value || 'all';

  let filteredData = violationsData;

  if (typeFilter !== 'all') {
    filteredData = filteredData.filter(v => v.violationType === typeFilter);
  }

  if (statusFilter !== 'all') {
    filteredData = filteredData.filter(v => v.status === statusFilter);
  }

  if (departmentFilter !== 'all') {
    filteredData = filteredData.filter(v => v.department.toLowerCase().replace(' ', '_') === departmentFilter);
  }

  // Update table with filtered data
  const tbody = document.getElementById('violationsTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    filteredData.forEach(violation => {
      const row = createViolationRow(violation);
      tbody.appendChild(row);
    });
  }
}

function searchViolations() {
  const searchTerm = document.getElementById('searchViolations')?.value.toLowerCase() || '';
  
  if (searchTerm === '') {
    loadViolationsData();
    return;
  }

  const filteredData = violationsData.filter(v => 
    v.studentName.toLowerCase().includes(searchTerm) ||
    v.studentId.toLowerCase().includes(searchTerm) ||
    v.department.toLowerCase().includes(searchTerm)
  );

  const tbody = document.getElementById('violationsTableBody');
  if (tbody) {
    tbody.innerHTML = '';
    filteredData.forEach(violation => {
      const row = createViolationRow(violation);
      tbody.appendChild(row);
    });
  }
}

// Statistics functions
function updateStatistics() {
  const uniformCount = violationsData.filter(v => v.violationType === 'improper_uniform').length;
  const footwearCount = violationsData.filter(v => v.violationType === 'improper_footwear').length;
  const noIdCount = violationsData.filter(v => v.violationType === 'no_id').length;
  const totalCount = violationsData.length;

  const uniformCountEl = document.getElementById('uniformCount');
  const footwearCountEl = document.getElementById('footwearCount');
  const noIdCountEl = document.getElementById('noIdCount');
  const totalCountEl = document.getElementById('totalCount');

  if (uniformCountEl) uniformCountEl.textContent = uniformCount;
  if (footwearCountEl) footwearCountEl.textContent = footwearCount;
  if (noIdCountEl) noIdCountEl.textContent = noIdCount;
  if (totalCountEl) totalCountEl.textContent = totalCount;
}

// Other functions
function exportViolations() {
  showNotification('Exporting violations data...', 'info');
  // Here you can implement export functionality
}

function refreshData() {
  showNotification('Refreshing violations data...', 'info');
  loadViolationsData();
  updateStatistics();
}

function submitViolation() {
  showNotification('Violation recorded successfully!', 'success');
  closeModal();
  // Here you can implement form submission
}

// Notification function
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
