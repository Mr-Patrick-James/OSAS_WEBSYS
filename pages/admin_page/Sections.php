<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sections | OSAS System</title>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="../assets/styles/section.css">
</head>

<body>

  <!-- section.html -->
  <main id="sections-page">
    <!-- Header Section -->
    <div class="sections-head-title">
      <div class="sections-left">
        <h1>Sections</h1>
        <p class="sections-subtitle">Manage all academic sections in the institution</p>
        <ul class="sections-breadcrumb">
          <li><a href="#">Dashboard</a></li>
          <li><i class='bx bx-chevron-right'></i></li>
          <li><a class="active" href="#">Sections</a></li>
        </ul>
      </div>

      <div class="sections-header-actions">
        <div class="sections-button-group">
          <button id="btnImportSections" class="sections-btn outline small">
            <i class='bx bx-upload'></i>
            <span>Import</span>
          </button>
          <button id="btnExportSections" class="sections-btn outline small">
            <i class='bx bx-download'></i>
            <span>Export</span>
          </button>
          <button id="btnPrintSection" class="sections-btn outline small">
            <i class='bx bx-printer'></i>
            <span>Print</span>
          </button>
        </div>
        <button id="btnAddSection" class="sections-btn primary">
          <i class='bx bx-plus'></i> Add Section
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="sections-stats-overview">
      <div class="sections-stat-card">
        <div class="sections-stat-icon">
          <i class='bx bx-layer'></i>
        </div>
        <div class="sections-stat-content">
          <h3 class="sections-stat-title">Total Sections</h3>
          <div class="sections-stat-value" id="totalSections">0</div>
          <div class="sections-stat-change positive">
            <i class='bx bx-up-arrow-alt'></i>
            <span>+5 this month</span>
          </div>
        </div>
      </div>

      <div class="sections-stat-card">
        <div class="sections-stat-icon">
          <i class='bx bx-check-circle'></i>
        </div>
        <div class="sections-stat-content">
          <h3 class="sections-stat-title">Active</h3>
          <div class="sections-stat-value" id="activeSections">0</div>
          <div class="sections-stat-percentage">92%</div>
        </div>
      </div>

      <div class="sections-stat-card">
        <div class="sections-stat-icon">
          <i class='bx bx-archive'></i>
        </div>
        <div class="sections-stat-content">
          <h3 class="sections-stat-title">Archived</h3>
          <div class="sections-stat-value" id="archivedSections">0</div>
          <div class="sections-stat-percentage">8%</div>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="sections-content-card">
      <!-- Table Header -->
      <div class="sections-table-header">
        <div class="sections-header-left">
          <h2 class="sections-table-title">Section List</h2>
          <p class="sections-table-subtitle">All academic sections and their details</p>
        </div>

        <div class="sections-header-right">
          <div class="sections-search-box">
            <i class='bx bx-search'></i>
            <input type="text" id="searchSection" placeholder="Search sections...">
          </div>

          <div class="sections-filter-group">
            <select id="sectionFilterSelect" class="sections-filter-select">
              <option value="all">All Sections</option>
              <option value="active">Active Only</option>
              <option value="archived">Archived</option>
            </select>

            <button class="sections-filter-btn" title="More filters">
              <i class='bx bx-filter-alt'></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Section Table -->
      <div id="sectionsPrintArea" class="sections-table-container">
        <table class="sections-table">
          <thead>
            <tr>
              <th class="sections-sortable" data-sort="id">
                <div class="sections-table-header-content">
                  <span>Section ID</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th class="sections-sortable" data-sort="name">
                <div class="sections-table-header-content">
                  <span>Section Name</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th>Associated Department</th>
              <th>Student Count</th>
              <th class="sections-sortable" data-sort="date">
                <div class="sections-table-header-content">
                  <span>Date Created</span>
                  <i class='bx bx-sort'></i>
                </div>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="sectionsTableBody">
            <!-- JS will populate rows -->
            <tr>
              <td class="section-id">SEC-001</td>
              <td class="section-name">
                <div class="section-name-wrapper">
                  <div class="section-icon">
                    <i class='bx bx-group'></i>
                  </div>
                  <div>
                    <strong>Section A</strong>
                    <small class="section-year">2023-2024</small>
                  </div>
                </div>
              </td>
              <td class="department-name">Computer Science</td>
              <td class="student-count">45</td>
              <td class="date-created">Jan 15, 2023</td>
              <td>
                <span class="sections-status-badge active">Active</span>
              </td>
              <td>
                <div class="sections-action-buttons">
                  <button class="sections-action-btn edit" title="Edit">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="sections-action-btn archive" title="Archive">
                    <i class='bx bx-archive'></i>
                  </button>
                  <button class="sections-action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td class="section-id">SEC-002</td>
              <td class="section-name">
                <div class="section-name-wrapper">
                  <div class="section-icon">
                    <i class='bx bx-group'></i>
                  </div>
                  <div>
                    <strong>Section B</strong>
                    <small class="section-year">2023-2024</small>
                  </div>
                </div>
              </td>
              <td class="department-name">Business Administration</td>
              <td class="student-count">38</td>
              <td class="date-created">Jan 15, 2023</td>
              <td>
                <span class="sections-status-badge active">Active</span>
              </td>
              <td>
                <div class="sections-action-buttons">
                  <button class="sections-action-btn edit" title="Edit">
                    <i class='bx bx-edit'></i>
                  </button>
                  <button class="sections-action-btn archive" title="Archive">
                    <i class='bx bx-archive'></i>
                  </button>
                  <button class="sections-action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr>
              <td class="section-id">SEC-003</td>
              <td class="section-name">
                <div class="section-name-wrapper">
                  <div class="section-icon">
                    <i class='bx bx-group'></i>
                  </div>
                  <div>
                    <strong>Section C</strong>
                    <small class="section-year">2022-2023</small>
                  </div>
                </div>
              </td>
              <td class="department-name">Nursing</td>
              <td class="student-count">42</td>
              <td class="date-created">Aug 10, 2022</td>
              <td>
                <span class="sections-status-badge archived">Archived</span>
              </td>
              <td>
                <div class="sections-action-buttons">
                  <button class="sections-action-btn restore" title="Restore">
                    <i class='bx bx-reset'></i>
                  </button>
                  <button class="sections-action-btn delete" title="Delete">
                    <i class='bx bx-trash'></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer -->
      <div class="sections-table-footer">
        <div class="sections-footer-info">
          Showing <span id="showingSectionsCount">3</span> of <span id="totalSectionsCount">15</span> sections
        </div>
        <div class="sections-pagination">
          <button class="sections-pagination-btn" disabled>
            <i class='bx bx-chevron-left'></i>
          </button>
          <button class="sections-pagination-btn active">1</button>
          <button class="sections-pagination-btn">2</button>
          <button class="sections-pagination-btn">3</button>
          <button class="sections-pagination-btn">
            <i class='bx bx-chevron-right'></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div id="sectionsModal" class="sections-modal">
      <div class="sections-modal-overlay" id="sectionsModalOverlay"></div>
      <div class="sections-modal-container">
        <div class="sections-modal-header">
          <h2 id="sectionsModalTitle">Add New Section</h2>
          <button class="sections-close-btn" id="closeSectionsModal">
            <i class='bx bx-x'></i>
          </button>
        </div>

        <form id="sectionsForm">
          <div class="sections-form-group">
            <label for="sectionName">Section Name</label>
            <input type="text" id="sectionName" name="sectionName" required placeholder="e.g., Section A">
          </div>

          <div class="sections-form-group">
            <label for="sectionCode">Section Code</label>
            <input type="text" id="sectionCode" name="sectionCode" required placeholder="e.g., SEC-A" maxlength="10">
          </div>

          <div class="sections-form-group">
            <label for="sectionDepartment">Department</label>
            <select id="sectionDepartment" name="sectionDepartment" required>
              <option value="">Select Department</option>
              <option value="CS">Computer Science</option>
              <option value="BA">Business Administration</option>
              <option value="NUR">Nursing</option>
            </select>
          </div>

          <div class="sections-form-group">
            <label for="academicYear">Academic Year</label>
            <input type="text" id="academicYear" name="academicYear" required placeholder="e.g., 2023-2024">
          </div>

          <div class="sections-form-group">
            <label for="sectionStatus">Status</label>
            <select id="sectionStatus" name="sectionStatus" required>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div class="sections-form-actions">
            <button type="button" class="sections-btn-outline" id="cancelSectionsModal">Cancel</button>
            <button type="submit" class="sections-btn-primary">Save Section</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Empty State (hidden by default) -->
    <div class="sections-empty-state" id="sectionsEmptyState" style="display: none;">
      <div class="sections-empty-icon">
        <i class='bx bx-layer'></i>
      </div>
      <h3>No Sections Found</h3>
      <p>Get started by adding your first section</p>
      <button class="sections-btn-primary" id="btnAddFirstSection">
        <i class='bx bx-plus'></i> Add Section
      </button>
    </div>
  </main>

  <script>
    // Enhanced JavaScript with all features
    document.addEventListener('DOMContentLoaded', function() {
      // Print functionality
      const printBtn = document.getElementById('btnPrintSection');
      if (printBtn) {
        printBtn.addEventListener('click', function() {
          const printArea = document.getElementById('sectionsPrintArea');
          const tableTitle = document.querySelector('.sections-table-title').textContent;
          const tableSubtitle = document.querySelector('.sections-table-subtitle').textContent;

          const printContent = `
        <html>
          <head>
            <title>Sections Report - OSAS System</title>
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
              <h1>${tableTitle}</h1>
              <p style="color: #666;">${tableSubtitle}</p>
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

      // Modal functionality
      const modal = document.getElementById('sectionsModal');
      const openModalBtn = document.getElementById('btnAddSection');
      const closeModalBtn = document.getElementById('closeSectionsModal');
      const cancelModalBtn = document.getElementById('cancelSectionsModal');
      const modalOverlay = document.getElementById('sectionsModalOverlay');

      if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      }

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        document.getElementById('sectionsForm').reset();
      };

      if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
      if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
      if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

      // Search functionality
      const searchInput = document.getElementById('searchSection');
      if (searchInput) {
        searchInput.addEventListener('input', function(e) {
          const searchTerm = e.target.value.toLowerCase();
          const rows = document.querySelectorAll('#sectionsTableBody tr');

          rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
          });
        });
      }

      // Sort functionality
      const sortHeaders = document.querySelectorAll('.sections-sortable');
      sortHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const sortBy = this.dataset.sort;
          console.log('Sort by:', sortBy);
          // Add sorting logic here
        });
      });

      // Filter functionality
      const filterSelect = document.getElementById('sectionFilterSelect');
      if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
          const filterValue = e.target.value;
          const rows = document.querySelectorAll('#sectionsTableBody tr');

          rows.forEach(row => {
            if (filterValue === 'all') {
              row.style.display = '';
            } else {
              const statusBadge = row.querySelector('.sections-status-badge');
              if (statusBadge) {
                const status = statusBadge.classList.contains('active') ? 'active' : 'archived';
                row.style.display = status === filterValue ? '' : 'none';
              }
            }
          });
        });
      }

      // Form submission
      const form = document.getElementById('sectionsForm');
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          // Add form submission logic here
          console.log('Form submitted');
          closeModal();
        });
      }

      // Update stats (example)
      function updateStats() {
        document.getElementById('totalSections').textContent = '15';
        document.getElementById('activeSections').textContent = '12';
        document.getElementById('archivedSections').textContent = '3';
      }

      updateStats();
    });
  </script>
</body>

</html>