// department.js
function initDepartmentModule() {
  console.log('🛠 Initializing Department module...');

  // Elements
  const tableBody = document.getElementById('departmentTableBody');
  const btnAddDepartment = document.getElementById('btnAddDepartment');
  const btnAddFirstDept = document.getElementById('btnAddFirstDepartment');
  const modal = document.getElementById('departmentModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelModal');
  const departmentForm = document.getElementById('departmentForm');
  const searchInput = document.getElementById('searchDepartment');
  const filterSelect = document.getElementById('departmentFilter');
  const printBtn = document.getElementById('btnPrintDepartments');

  // Check for essential elements
  if (!tableBody) {
    console.error('❗ #departmentTableBody not found. Table won\'t render.');
    return;
  }

  if (!modal) {
    console.warn('⚠️ #departmentModal not found. Modal functionality disabled.');
  }

  // --- Department data (loaded from database) ---
  let departments = [];
  let currentView = 'active'; // 'active' or 'archived'

  // Get department icon based on code
  function getDeptIcon(code) {
    const icons = {
      'CS': 'bx-code-alt',
      'BA': 'bx-briefcase-alt',
      'NUR': 'bx-heart',
      'BSIS': 'bx-laptop',
      'WFT': 'bx-cog',
      'BTVTEd': 'bx-wrench',
      'ENG': 'bx-calculator',
      'ART': 'bx-palette'
    };
    return icons[code] || 'bx-building';
  }

  // --- Render helper (updated for new table structure) ---
  function renderDepartments(deptArray = departments) {
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filterValue = filterSelect ? filterSelect.value : 'all';
    
    // Filter departments
    const filteredDepts = deptArray.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm) || 
                           d.code.toLowerCase().includes(searchTerm) ||
                           d.hod.toLowerCase().includes(searchTerm);
      const matchesFilter = filterValue === 'all' || d.status === filterValue;
      return matchesSearch && matchesFilter;
    });

    // Show/hide empty state
    const emptyState = document.getElementById('emptyState');
    if (filteredDepts.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      tableBody.innerHTML = '';
      return;
    } else {
      if (emptyState) emptyState.style.display = 'none';
    }

    tableBody.innerHTML = filteredDepts.map(d => `
      <tr data-id="${d.id}">
        <td class="department-id">${d.id}</td>
        <td class="department-name">
          <div class="name-wrapper">
            <div class="department-icon">
              <i class='bx ${getDeptIcon(d.code)}'></i>
            </div>
            <div>
              <strong>${d.name}</strong>
              <small class="department-code">${d.code}</small>
            </div>
          </div>
        </td>
        <td class="hod-name">${d.hod}</td>
        <td class="student-count">${d.studentCount}</td>
        <td class="date-created">${d.date}</td>
        <td>
          <span class="status-badge ${d.status}">${d.status === 'active' ? 'Active' : 'Archived'}</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="action-btn edit" data-id="${d.id}" title="Edit">
              <i class='bx bx-edit'></i>
            </button>
            ${d.status === 'archived' ? 
              `<button class="action-btn restore" data-id="${d.id}" title="Restore">
                <i class='bx bx-reset'></i>
              </button>` : 
              ''
            }
            <button class="action-btn delete" data-id="${d.id}" title="Delete">
              <i class='bx bx-trash'></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    // Update stats and counts
    updateStats();
    updateCounts(filteredDepts);
  }

  // Update statistics (now loaded from database)
  function updateStats() {
    // Stats are loaded from database via loadStats()
    // This function is kept for compatibility but stats are updated via API
  }

  // Update showing/total counts
  function updateCounts(filteredDepts) {
    const showingEl = document.getElementById('showingCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (showingEl) showingEl.textContent = filteredDepts.length;
    if (totalCountEl) totalCountEl.textContent = departments.length;
  }

  // --- Load departments from database ---
  async function loadDepartments(filter = 'active') {
    try {
      // Determine correct API path based on context
      const apiPath = window.location.pathname.includes('admin_page') 
        ? '../../api/departments.php' 
        : '../api/departments.php';
      
      const url = `${apiPath}?action=get&filter=${filter}`;
      console.log('Fetching from:', url); // Debug log
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Raw API Response:', text); // Debug log
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      console.log('Parsed API Response:', result); // Debug log
      
      if (result.status === 'success') {
        departments = result.data.map(dept => ({
          id: dept.department_id,
          name: dept.name,
          code: dept.code,
          hod: dept.hod,
          studentCount: dept.student_count,
          date: dept.date,
          status: dept.status,
          description: dept.description,
          dbId: dept.id // Store database ID for API calls
        }));
        renderDepartments();
        loadStats();
      } else {
        console.error('Error loading departments:', result.message);
        alert('Error loading departments: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      console.error('Full error details:', error.message, error.stack);
      alert('Error fetching departments. Please check your connection and console for details.');
    }
  }

  // --- Load statistics from database ---
  async function loadStats() {
    try {
      const response = await fetch('../api/departments.php?action=stats');
      const result = await response.json();
      
      if (result.status === 'success') {
        const stats = result.data;
        const totalEl = document.getElementById('totalDepartments');
        const activeEl = document.getElementById('activeDepartments');
        const archivedEl = document.getElementById('archivedDepartments');
        
        if (totalEl) totalEl.textContent = stats.total;
        if (activeEl) activeEl.textContent = stats.active;
        if (archivedEl) archivedEl.textContent = stats.archived;
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  // Initial load - fetch from database
  loadDepartments('active');

  // --- Modal functions ---
  function openModal(editId = null) {
    if (!modal) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('departmentForm');
    
    if (editId) {
      // Edit mode
      modalTitle.textContent = 'Edit Department';
      const dept = departments.find(d => d.id === editId);
      if (dept) {
        document.getElementById('deptName').value = dept.name;
        document.getElementById('deptCode').value = dept.code;
        document.getElementById('hodName').value = dept.hod === 'N/A' ? '' : dept.hod;
        document.getElementById('deptDescription').value = dept.description || '';
        document.getElementById('deptStatus').value = dept.status;
      }
      modal.dataset.editingId = editId;
      modal.dataset.editingDbId = dept ? dept.dbId : null;
    } else {
      // Add mode
      modalTitle.textContent = 'Add New Department';
      if (form) form.reset();
      delete modal.dataset.editingId;
      delete modal.dataset.editingDbId;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    const form = document.getElementById('departmentForm');
    if (form) form.reset();
    delete modal.dataset.editingId;
  }

  // --- Actions (event delegation) ---
  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.action-btn.edit');
    const restoreBtn = e.target.closest('.action-btn.restore');
    const deleteBtn = e.target.closest('.action-btn.delete');

    if (editBtn) {
      const id = editBtn.dataset.id;
      openModal(id);
    }

    if (restoreBtn) {
      const id = restoreBtn.dataset.id;
      const dept = departments.find(d => d.id === id);
      if (dept && confirm(`Restore department "${dept.name}"?`)) {
        restoreDepartment(dept.dbId);
      }
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const dept = departments.find(d => d.id === id);
      if (dept && confirm(`Archive department "${dept.name}"? This will move it to archived.`)) {
        deleteDepartment(dept.dbId);
      }
    }
  });

  // --- Modal open/close + Save ---
  if (btnAddDepartment && modal) {
    // Add Department button
    btnAddDepartment.addEventListener('click', () => {
      openModal();
    });

    // Add First Department button (empty state)
    if (btnAddFirstDept) {
      btnAddFirstDept.addEventListener('click', () => {
        openModal();
      });
    }

    // Close modal buttons
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Form submission
    if (departmentForm) {
      departmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const deptName = document.getElementById('deptName').value.trim();
        const deptCode = document.getElementById('deptCode').value.trim();
        const hodName = document.getElementById('hodName').value.trim();
        const deptDescription = document.getElementById('deptDescription').value.trim();
        const deptStatus = document.getElementById('deptStatus').value;
        
        if (!deptName || !deptCode) {
          alert('Please fill in Department Name and Department Code.');
          return;
        }

        const editingDbId = modal.dataset.editingDbId;
        
        if (editingDbId) {
          // Update existing department
          updateDepartment(editingDbId, {
            deptName,
            deptCode,
            hodName,
            deptDescription,
            deptStatus
          });
        } else {
          // Add new department
          addDepartment({
            deptName,
            deptCode,
            hodName,
            deptDescription,
            deptStatus
          });
        }
      });
    }
  } else {
    console.warn('ℹ️ Department modal elements not found or not mounted (skipping modal wiring).');
  }

  // --- Search functionality ---
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          loadDepartmentsWithSearch(currentView, searchTerm);
        } else {
          loadDepartments(currentView);
        }
      }, 300); // Debounce search
    });
  }

  // --- Load departments with search ---
  async function loadDepartmentsWithSearch(filter = 'active', search = '') {
    try {
      const url = `../api/departments.php?action=get&filter=${filter}&search=${encodeURIComponent(search)}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.status === 'success') {
        departments = result.data.map(dept => ({
          id: dept.department_id,
          name: dept.name,
          code: dept.code,
          hod: dept.hod,
          studentCount: dept.student_count,
          date: dept.date,
          status: dept.status,
          description: dept.description,
          dbId: dept.id
        }));
        renderDepartments();
      } else {
        console.error('Error loading departments:', result.message);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }

  // --- Archived button functionality ---
  const btnArchived = document.getElementById('btnArchived');

  // --- Filter functionality ---
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      const filterValue = filterSelect.value;
      if (filterValue === 'archived') {
        currentView = 'archived';
        loadDepartments('archived');
        if (btnArchived) btnArchived.classList.add('active');
      } else if (filterValue === 'active') {
        currentView = 'active';
        loadDepartments('active');
        if (btnArchived) btnArchived.classList.remove('active');
      } else {
        currentView = 'all';
        loadDepartments('all');
        if (btnArchived) btnArchived.classList.remove('active');
      }
    });
  }

  if (btnArchived) {
    btnArchived.addEventListener('click', () => {
      if (currentView === 'archived') {
        // Switch back to active view
        currentView = 'active';
        if (filterSelect) filterSelect.value = 'active';
        loadDepartments('active');
        btnArchived.classList.remove('active');
      } else {
        // Switch to archived view
        currentView = 'archived';
        if (filterSelect) filterSelect.value = 'archived';
        loadDepartments('archived');
        btnArchived.classList.add('active');
      }
    });
  }

  // --- API Functions ---
  async function addDepartment(data) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));

      const response = await fetch('../api/departments.php?action=add', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert(result.message);
        closeModal();
        loadDepartments(currentView);
        loadStats();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error adding department:', error);
      alert('Error adding department. Please try again.');
    }
  }

  async function updateDepartment(dbId, data) {
    try {
      const formData = new FormData();
      formData.append('deptId', dbId);
      Object.keys(data).forEach(key => formData.append(key, data[key]));

      const response = await fetch('../api/departments.php?action=update', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert(result.message);
        closeModal();
        loadDepartments(currentView);
        loadStats();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Error updating department. Please try again.');
    }
  }

  async function deleteDepartment(dbId) {
    try {
      const response = await fetch(`../api/departments.php?action=delete&id=${dbId}`, {
        method: 'GET'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert(result.message);
        loadDepartments(currentView);
        loadStats();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Error deleting department. Please try again.');
    }
  }

  async function archiveDepartment(dbId) {
    try {
      const response = await fetch(`../api/departments.php?action=archive&id=${dbId}`, {
        method: 'GET'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert(result.message);
        loadDepartments(currentView);
        loadStats();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error archiving department:', error);
      alert('Error archiving department. Please try again.');
    }
  }

  async function restoreDepartment(dbId) {
    try {
      const response = await fetch(`../api/departments.php?action=restore&id=${dbId}`, {
        method: 'GET'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        alert(result.message);
        loadDepartments(currentView);
        loadStats();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error restoring department:', error);
      alert('Error restoring department. Please try again.');
    }
  }

  // --- Sort functionality ---
  const sortHeaders = document.querySelectorAll('.sortable');
  sortHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const sortBy = this.dataset.sort;
      sortDepartments(sortBy);
    });
  });

  function sortDepartments(sortBy) {
    departments.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.date) - new Date(a.date); // newest first
        case 'id':
        default:
          return a.id.localeCompare(b.id);
      }
    });
    renderDepartments();
  }

  // --- Print functionality ---
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      const printArea = document.querySelector('.content-card');

      const printContent = `
        <html>
          <head>
            <title>Departments Report - OSAS System</title>
            <style>
              body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
              th { background-color: #f8f9fa; font-weight: 600; }
              h1 { color: #333; margin-bottom: 10px; }
              .report-header { margin-bottom: 30px; }
              .report-date { color: #666; margin-bottom: 20px; }
              .status-badge { 
                padding: 4px 12px; 
                border-radius: 20px; 
                font-size: 12px; 
                font-weight: 600; 
              }
              .active { background: #e8f5e9; color: #2e7d32; }
              .archived { background: #ffebee; color: #c62828; }
            </style>
          </head>
          <body>
            <div class="report-header">
              <h1>Departments Report</h1>
              <div class="report-date">Generated on: ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
            ${printArea.innerHTML}
          </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    });
  }

  console.log('✅ Department module ready!');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initDepartmentModule();
});