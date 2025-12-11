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

  // --- Demo data (updated for new structure) ---
  let departments = [
    { 
      id: 'DEPT-001', 
      name: 'Computer Science', 
      code: 'CS',
      hod: 'Dr. Maria Santos',
      studentCount: 342,
      date: 'Jan 15, 2020', 
      status: 'active',
      description: 'Computer Science and Information Technology'
    },
    { 
      id: 'DEPT-002', 
      name: 'Business Administration', 
      code: 'BA',
      hod: 'Dr. Robert Chen',
      studentCount: 285,
      date: 'Mar 22, 2019', 
      status: 'active',
      description: 'Business and Management Studies'
    },
    { 
      id: 'DEPT-003', 
      name: 'Nursing', 
      code: 'NUR',
      hod: 'Dr. Anna Rodriguez',
      studentCount: 412,
      date: 'Aug 10, 2018', 
      status: 'archived',
      description: 'Nursing and Healthcare'
    },
    { 
      id: 'DEPT-004', 
      name: 'Bachelor of Science in Information System', 
      code: 'BSIS',
      hod: 'Dr. John Smith',
      studentCount: 256,
      date: '2023-06-12', 
      status: 'active',
      description: 'Information Systems and Technology'
    },
    { 
      id: 'DEPT-005', 
      name: 'Welding and Fabrication Technology', 
      code: 'WFT',
      hod: 'Engr. Michael Johnson',
      studentCount: 189,
      date: '2023-06-18', 
      status: 'active',
      description: 'Technical and Vocational Education'
    },
    { 
      id: 'DEPT-006', 
      name: 'Bachelor of Technical-Vocational Education and Training', 
      code: 'BTVTEd',
      hod: 'Dr. Sarah Williams',
      studentCount: 167,
      date: '2023-07-02', 
      status: 'active',
      description: 'Technical-Vocational Education'
    }
  ];

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
            ${d.status === 'active' ? 
              `<button class="action-btn archive" data-id="${d.id}" title="Archive">
                <i class='bx bx-archive'></i>
              </button>` : 
              `<button class="action-btn restore" data-id="${d.id}" title="Restore">
                <i class='bx bx-reset'></i>
              </button>`
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

  // Update statistics
  function updateStats() {
    const total = departments.length;
    const active = departments.filter(d => d.status === 'active').length;
    const archived = departments.filter(d => d.status === 'archived').length;
    
    const totalEl = document.getElementById('totalDepartments');
    const activeEl = document.getElementById('activeDepartments');
    const archivedEl = document.getElementById('archivedDepartments');
    
    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (archivedEl) archivedEl.textContent = archived;
  }

  // Update showing/total counts
  function updateCounts(filteredDepts) {
    const showingEl = document.getElementById('showingCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (showingEl) showingEl.textContent = filteredDepts.length;
    if (totalCountEl) totalCountEl.textContent = departments.length;
  }

  // Initial render - keep the sample data visible initially
  renderDepartments();

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
        document.getElementById('hodName').value = dept.hod;
        document.getElementById('deptDescription').value = dept.description || '';
        document.getElementById('deptStatus').value = dept.status;
      }
      modal.dataset.editingId = editId;
    } else {
      // Add mode
      modalTitle.textContent = 'Add New Department';
      if (form) form.reset();
      delete modal.dataset.editingId;
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
    const archiveBtn = e.target.closest('.action-btn.archive');
    const restoreBtn = e.target.closest('.action-btn.restore');
    const deleteBtn = e.target.closest('.action-btn.delete');

    if (editBtn) {
      const id = editBtn.dataset.id;
      openModal(id);
    }

    if (archiveBtn) {
      const id = archiveBtn.dataset.id;
      const dept = departments.find(d => d.id === id);
      if (dept && confirm(`Archive department "${dept.name}"?`)) {
        dept.status = 'archived';
        renderDepartments();
      }
    }

    if (restoreBtn) {
      const id = restoreBtn.dataset.id;
      const dept = departments.find(d => d.id === id);
      if (dept && confirm(`Restore department "${dept.name}"?`)) {
        dept.status = 'active';
        renderDepartments();
      }
    }

    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      const dept = departments.find(d => d.id === id);
      if (dept && confirm(`Delete department "${dept.name}"? This cannot be undone.`)) {
        departments = departments.filter(d => d.id !== id);
        renderDepartments();
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

        const editingId = modal.dataset.editingId;
        
        if (editingId) {
          // Update existing department
          const dept = departments.find(d => d.id === editingId);
          if (dept) {
            dept.name = deptName;
            dept.code = deptCode;
            dept.hod = hodName;
            dept.description = deptDescription;
            dept.status = deptStatus;
          }
        } else {
          // Add new department
          const newId = `DEPT-${String(departments.length + 1).padStart(3, '0')}`;
          departments.push({
            id: newId,
            name: deptName,
            code: deptCode,
            hod: hodName,
            studentCount: Math.floor(Math.random() * 400) + 50,
            date: new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            status: deptStatus,
            description: deptDescription
          });
        }

        renderDepartments();
        closeModal();
      });
    }
  } else {
    console.warn('ℹ️ Department modal elements not found or not mounted (skipping modal wiring).');
  }

  // --- Search functionality ---
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDepartments();
    });
  }

  // --- Filter functionality ---
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      renderDepartments();
    });
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