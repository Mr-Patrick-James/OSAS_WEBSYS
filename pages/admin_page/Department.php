<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Departments | OSAS System</title>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="../assets/styles/Department.css">
</head>

<body>

  <!-- department.html -->
  <main id="department-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Departments</h1>
          <p class="page-subtitle">Manage all academic departments in the institution</p>
        </div>
        <div class="breadcrumb-wrapper">
          <nav class="breadcrumb">
            <a href="#" class="breadcrumb-item">Dashboard</a>
            <i class='bx bx-chevron-right'></i>
            <span class="breadcrumb-item active">Departments</span>
          </nav>
        </div>
      </div>

      <div class="header-actions">
        <div class="button-group">
          <button class="action-btn outline small" id="btnImport">
            <i class='bx bx-upload'></i>
            <span>Import</span>
          </button>
          <button class="action-btn outline small" id="btnExport">
            <i class='bx bx-download'></i>
            <span>Export</span>
          </button>
          <button class="action-btn outline small" id="btnPrintDepartments">
            <i class='bx bx-printer'></i>
            <span>Print</span>
          </button>
        </div>
        <button class="action-btn primary" id="btnAddDepartment">
          <i class='bx bx-plus'></i>
          <span>Add Department</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">
          <i class='bx bx-buildings'></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Total Departments</h3>
          <div class="stat-value" id="totalDepartments">0</div>
          <div class="stat-change positive">
            <i class='bx bx-up-arrow-alt'></i>
            <span>+2 this month</span>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class='bx bx-user-check'></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Active</h3>
          <div class="stat-value" id="activeDepartments">0</div>
          <div class="stat-percentage">95%</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class='bx bx-archive'></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-title">Archived</h3>
          <div class="stat-value" id="archivedDepartments">0</div>
          <div class="stat-percentage">5%</div>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="content-card">
      <!-- Table Header -->
      <div class="table-header">
        <div class="header-left">
          <h2 class="table-title">Department List</h2>
          <p class="table-subtitle">All academic departments and their details</p>
        </div>

        <div class="header-right">
          <div class="search-box">
            <i class='bx bx-search'></i>
            <input type="text" id="searchDepartment" placeholder="Search departments...">
          </div>

          <div class="filter-group">
            <select id="departmentFilter" class="filter-select">
              <option value="all">All Departments</option>
              <option value="active">Active Only</option>
              <option value="archived">Archived</option>
            </select>

            <button class="filter-btn" title="More filters">
              <i class='bx bx-filter-alt'></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Department Table -->
      <div class="table-wrapper">
        <table class="department-table">
          <thead>
            <tr>
              <th class="sortable" data-sort="id">
                <div class="table-header-content">
                  <span>ID</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th class="sortable" data-sort="name">
                <div class="table-header-content">
                  <span>Department Name</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th>Head of Department</th>
              <th>Student Count</th>
              <th class="sortable" data-sort="date">
                <div class="table-header-content">
                  <span>Date Created</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="departmentTableBody">
            <!-- JS will populate rows -->
            <!-- Sample data for preview -->
            <tr>
              <td class="department-id">DEPT-001</td>
              <td class="department-name">
                <div class="name-wrapper">
                  <div class="department-icon">
                    <i class='bx bx-code-alt'></i>
                  </div>
                  <div>
                    <strong>Computer Science</strong>
                    <small class="department-code">CS</small>
                  </div>
                </div>
              </td>
              <td class="hod-name">Dr. Maria Santos</td>
              <td class="student-count">342</td>
              <td class="date-created">Jan 15, 2020</td>
              <td>
                <span class="status-badge active">Active</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" title="Edit">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="action-btn archive" title="Archive">
                    <i class='bx bx-archive'></i>
                  </button>
                  <button class="action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td class="department-id">DEPT-002</td>
              <td class="department-name">
                <div class="name-wrapper">
                  <div class="department-icon">
                    <i class='bx bx-briefcase-alt'></i>
                  </div>
                  <div>
                    <strong>Business Administration</strong>
                    <small class="department-code">BA</small>
                  </div>
                </div>
              </td>
              <td class="hod-name">Dr. Robert Chen</td>
              <td class="student-count">285</td>
              <td class="date-created">Mar 22, 2019</td>
              <td>
                <span class="status-badge active">Active</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" title="Edit">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="action-btn archive" title="Archive">
                    <i class='bx bx-archive'></i>
                  </button>
                  <button class="action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td class="department-id">DEPT-003</td>
              <td class="department-name">
                <div class="name-wrapper">
                  <div class="department-icon">
                    <i class='bx bx-heart'></i>
                  </div>
                  <div>
                    <strong>Nursing</strong>
                    <small class="department-code">NUR</small>
                  </div>
                </div>
              </td>
              <td class="hod-name">Dr. Anna Rodriguez</td>
              <td class="student-count">412</td>
              <td class="date-created">Aug 10, 2018</td>
              <td>
                <span class="status-badge archived">Archived</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn restore" title="Restore">
                    <i class='bx bx-reset'></i>
                  </button>
                  <button class="action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="table-footer">
        <div class="footer-info">
          Showing <span id="showingCount">3</span> of <span id="totalCount">12</span> departments
        </div>
        <div class="pagination">
          <button class="pagination-btn" disabled>
            <i class='bx bx-chevron-left'></i>
          </button>
          <button class="pagination-btn active">1</button>
          <button class="pagination-btn">2</button>
          <button class="pagination-btn">3</button>
          <button class="pagination-btn">
            <i class='bx bx-chevron-right'></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div id="departmentModal" class="modal">
      <div class="modal-overlay" id="modalOverlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h2 id="modalTitle">Add New Department</h2>
          <button class="close-btn" id="closeModal">
            <i class='bx bx-x'></i>
          </button>
        </div>

        <form id="departmentForm">
          <div class="form-group">
            <label for="deptName">Department Name</label>
            <input type="text" id="deptName" name="deptName" required placeholder="e.g., Computer Science">
          </div>

          <div class="form-group">
            <label for="deptCode">Department Code</label>
            <input type="text" id="deptCode" name="deptCode" required placeholder="e.g., CS" maxlength="10">
          </div>

          <div class="form-group">
            <label for="hodName">Head of Department</label>
            <input type="text" id="hodName" name="hodName" placeholder="Dr. Firstname Lastname">
          </div>

          <div class="form-group">
            <label for="deptDescription">Description (Optional)</label>
            <textarea id="deptDescription" name="deptDescription" rows="3" placeholder="Brief description of the department..."></textarea>
          </div>

          <div class="form-group">
            <label for="deptStatus">Status</label>
            <select id="deptStatus" name="deptStatus" required>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-outline" id="cancelModal">Cancel</button>
            <button type="submit" class="btn-primary">Save Department</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty State (hidden by default) -->
    <div class="empty-state" id="emptyState" style="display: none;">
      <div class="empty-icon">
        <i class='bx bx-building-house'></i>
      </div>
      <h3>No Departments Found</h3>
      <p>Get started by adding your first department</p>
      <button class="btn-primary" id="btnAddFirstDepartment">
        <i class='bx bx-plus'></i> Add Department
      </button>
    </div>
  </main>

  <script>
    // Print functionality for Departments
    document.addEventListener('DOMContentLoaded', function() {
      const printBtn = document.getElementById('btnPrintDepartments');
      if (printBtn) {
        printBtn.addEventListener('click', function() {
          const printArea = document.querySelector('.content-card');

          // Create print content
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

          // Open print window
          const printWindow = window.open('', '_blank');
          printWindow.document.write(printContent);
          printWindow.document.close();
          printWindow.print();
        });
      }

      // Modal functionality
      const modal = document.getElementById('departmentModal');
      const openModalBtn = document.getElementById('btnAddDepartment');
      const closeModalBtn = document.getElementById('closeModal');
      const cancelModalBtn = document.getElementById('cancelModal');
      const modalOverlay = document.getElementById('modalOverlay');

      if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      };

      if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
      if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
      if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

      // Search functionality
      const searchInput = document.getElementById('searchDepartment');
      if (searchInput) {
        searchInput.addEventListener('input', function(e) {
          const searchTerm = e.target.value.toLowerCase();
          const rows = document.querySelectorAll('#departmentTableBody tr');

          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
          });
        });
      }

      // Sort functionality
      const sortHeaders = document.querySelectorAll('.sortable');
      sortHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const sortBy = this.dataset.sort;
          // Add sorting logic here
          console.log('Sort by:', sortBy);
        });
      });
    });
  </script>
</body>

</html>