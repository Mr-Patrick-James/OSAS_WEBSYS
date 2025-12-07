<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Students | OSAS System</title>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="../assets/styles/students.css">
</head>
<body>
  
<!-- Students.html -->
<main id="Students-page">

  <!-- HEADER -->
  <div class="Students-head-title">
    <div class="Students-left">
      <h1>Students</h1>
      <p class="Students-subtitle">Manage all student records in the institution</p>
      <ul class="Students-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Students Data</a></li>
      </ul>
    </div>

    <div class="Students-header-actions">
      <div class="Students-button-group">
        <button id="btnImportStudents" class="Students-btn outline small">
          <i class='bx bx-upload'></i>
          <span>Import</span>
        </button>
        <button id="btnExportStudents" class="Students-btn outline small">
          <i class='bx bx-download'></i>
          <span>Export</span>
        </button>
        <button id="btnPrintStudents" class="Students-btn outline small">
          <i class='bx bx-printer'></i>
          <span>Print</span>
        </button>
      </div>
      <button id="btnAddStudents" class="Students-btn primary">
        <i class='bx bx-plus'></i> Add Student
      </button>
    </div>
  </div>

  <!-- STATS CARDS -->
  <div class="Students-stats-overview">
    <div class="Students-stat-card">
      <div class="Students-stat-icon">
        <i class='bx bx-user'></i>
      </div>
      <div class="Students-stat-content">
        <h3 class="Students-stat-title">Total Students</h3>
        <div class="Students-stat-value" id="totalStudents">0</div>
        <div class="Students-stat-change positive">
          <i class='bx bx-up-arrow-alt'></i>
          <span>+25 this month</span>
        </div>
      </div>
    </div>

    <div class="Students-stat-card">
      <div class="Students-stat-icon">
        <i class='bx bx-user-check'></i>
      </div>
      <div class="Students-stat-content">
        <h3 class="Students-stat-title">Active</h3>
        <div class="Students-stat-value" id="activeStudents">0</div>
        <div class="Students-stat-percentage">96%</div>
      </div>
    </div>

    <div class="Students-stat-card">
      <div class="Students-stat-icon">
        <i class='bx bx-user-x'></i>
      </div>
      <div class="Students-stat-content">
        <h3 class="Students-stat-title">Inactive</h3>
        <div class="Students-stat-value" id="inactiveStudents">0</div>
        <div class="Students-stat-percentage">4%</div>
      </div>
    </div>

    <div class="Students-stat-card">
      <div class="Students-stat-icon">
        <i class='bx bx-calendar'></i>
      </div>
      <div class="Students-stat-content">
        <h3 class="Students-stat-title">Graduating</h3>
        <div class="Students-stat-value" id="graduatingStudents">0</div>
        <div class="Students-stat-percentage">15%</div>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT CARD -->
  <div class="Students-content-card">
    <!-- Table Header -->
    <div class="Students-table-header">
      <div class="Students-header-left">
        <h2 class="Students-table-title">Student List</h2>
        <p class="Students-table-subtitle">All student records and their details</p>
      </div>

      <div class="Students-header-right">
        <div class="Students-search-box">
          <i class='bx bx-search'></i>
          <input type="text" id="searchStudent" placeholder="Search students...">
        </div>

        <div class="Students-filter-group">
          <select id="StudentsFilterSelect" class="Students-filter-select">
            <option value="all">All Students</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive</option>
            <option value="graduating">Graduating</option>
          </select>

          <button class="Students-filter-btn" title="More filters">
            <i class='bx bx-filter-alt'></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Students Table -->
    <div id="StudentsPrintArea" class="Students-table-container">
      <table class="Students-table">
        <thead>
          <tr>
            <th class="Students-sortable" data-sort="id">
              <div class="Students-table-header-content">
                <span>ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Image</th>
            <th class="Students-sortable" data-sort="studentId">
              <div class="Students-table-header-content">
                <span>Student ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Students-sortable" data-sort="name">
              <div class="Students-table-header-content">
                <span>Name</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Students-sortable" data-sort="department">
              <div class="Students-table-header-content">
                <span>Department</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Students-sortable" data-sort="section">
              <div class="Students-table-header-content">
                <span>Section</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Contact No</th>
            <th class="Students-sortable" data-sort="status">
              <div class="Students-table-header-content">
                <span>Status</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody id="StudentsTableBody">
          <!-- Sample Data -->
          <tr>
            <td class="student-row-id">1</td>
            <td class="student-image-cell">
              <div class="student-image-wrapper">
                <img src="https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=40" alt="John Doe" class="student-avatar">
              </div>
            </td>
            <td class="student-id">2023-001</td>
            <td class="student-name">
              <div class="student-name-wrapper">
                <strong>John Michael Doe</strong>
                <small>john.doe@example.com</small>
              </div>
            </td>
            <td class="student-dept">
              <span class="dept-badge bsit">BSIT</span>
            </td>
            <td class="student-section">BSIT-3A</td>
            <td class="student-contact">+63 912 345 6789</td>
            <td>
              <span class="Students-status-badge active">Active</span>
            </td>
            <td>
              <div class="Students-action-buttons">
                <button class="Students-action-btn view" title="View Profile">
                  <i class='bx bx-user'></i>
                </button>
                <button class="Students-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Students-action-btn deactivate" title="Deactivate">
                  <i class='bx bx-user-x'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="student-row-id">2</td>
            <td class="student-image-cell">
              <div class="student-image-wrapper">
                <img src="https://ui-avatars.com/api/?name=Maria+Santos&background=4361ee&color=fff&size=40" alt="Maria Santos" class="student-avatar">
              </div>
            </td>
            <td class="student-id">2023-002</td>
            <td class="student-name">
              <div class="student-name-wrapper">
                <strong>Maria Clara Santos</strong>
                <small>maria.santos@example.com</small>
              </div>
            </td>
            <td class="student-dept">
              <span class="dept-badge nursing">Nursing</span>
            </td>
            <td class="student-section">NUR-2B</td>
            <td class="student-contact">+63 923 456 7890</td>
            <td>
              <span class="Students-status-badge active">Active</span>
            </td>
            <td>
              <div class="Students-action-buttons">
                <button class="Students-action-btn view" title="View Profile">
                  <i class='bx bx-user'></i>
                </button>
                <button class="Students-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Students-action-btn deactivate" title="Deactivate">
                  <i class='bx bx-user-x'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="student-row-id">3</td>
            <td class="student-image-cell">
              <div class="student-image-wrapper">
                <img src="https://ui-avatars.com/api/?name=Robert+Chen&background=10b981&color=fff&size=40" alt="Robert Chen" class="student-avatar">
              </div>
            </td>
            <td class="student-id">2023-003</td>
            <td class="student-name">
              <div class="student-name-wrapper">
                <strong>Robert James Chen</strong>
                <small>robert.chen@example.com</small>
              </div>
            </td>
            <td class="student-dept">
              <span class="dept-badge business">Business</span>
            </td>
            <td class="student-section">BA-4A</td>
            <td class="student-contact">+63 934 567 8901</td>
            <td>
              <span class="Students-status-badge graduating">Graduating</span>
            </td>
            <td>
              <div class="Students-action-buttons">
                <button class="Students-action-btn view" title="View Profile">
                  <i class='bx bx-user'></i>
                </button>
                <button class="Students-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Students-action-btn deactivate" title="Deactivate">
                  <i class='bx bx-user-x'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="student-row-id">4</td>
            <td class="student-image-cell">
              <div class="student-image-wrapper">
                <img src="https://ui-avatars.com/api/?name=Anna+Rodriguez&background=f59e0b&color=fff&size=40" alt="Anna Rodriguez" class="student-avatar">
              </div>
            </td>
            <td class="student-id">2023-004</td>
            <td class="student-name">
              <div class="student-name-wrapper">
                <strong>Anna Marie Rodriguez</strong>
                <small>anna.rodriguez@example.com</small>
              </div>
            </td>
            <td class="student-dept">
              <span class="dept-badge education">Education</span>
            </td>
            <td class="student-section">BEED-3C</td>
            <td class="student-contact">+63 945 678 9012</td>
            <td>
              <span class="Students-status-badge inactive">Inactive</span>
            </td>
            <td>
              <div class="Students-action-buttons">
                <button class="Students-action-btn view" title="View Profile">
                  <i class='bx bx-user'></i>
                </button>
                <button class="Students-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Students-action-btn activate" title="Activate">
                  <i class='bx bx-user-check'></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div class="Students-table-footer">
      <div class="Students-footer-info">
        Showing <span id="showingStudentsCount">4</span> of <span id="totalStudentsCount">250</span> students
      </div>
      <div class="Students-pagination">
        <button class="Students-pagination-btn" disabled>
          <i class='bx bx-chevron-left'></i>
        </button>
        <button class="Students-pagination-btn active">1</button>
        <button class="Students-pagination-btn">2</button>
        <button class="Students-pagination-btn">3</button>
        <button class="Students-pagination-btn">4</button>
        <button class="Students-pagination-btn">5</button>
        <button class="Students-pagination-btn">
          <i class='bx bx-chevron-right'></i>
        </button>
      </div>
    </div>
  </div>

  <!-- MODAL -->
  <div id="StudentsModal" class="Students-modal">
    <div class="Students-modal-overlay" id="StudentsModalOverlay"></div>
    <div class="Students-modal-container">
      <div class="Students-modal-header">
        <h2 id="StudentsModalTitle">Add New Student</h2>
        <button class="Students-close-btn" id="closeStudentsModal">
          <i class='bx bx-x'></i>
        </button>
      </div>

      <form id="StudentsForm">
        <div class="Students-form-row">
          <div class="Students-form-group">
            <label for="studentId">Student ID</label>
            <input type="text" id="studentId" name="studentId" required placeholder="e.g., 2023-001">
          </div>
          
          <div class="Students-form-group">
            <label for="studentStatus">Status</label>
            <select id="studentStatus" name="studentStatus" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduating">Graduating</option>
            </select>
          </div>
        </div>

        <div class="Students-form-group">
          <label for="studentImage">Student Photo</label>
          <div class="Students-image-upload">
            <div class="Students-image-preview" id="imagePreview">
              <div class="Students-preview-placeholder">
                <i class='bx bx-user'></i>
                <span>Upload photo</span>
              </div>
              <img class="Students-preview-img" style="display:none" alt="Preview">
            </div>
            <input type="file" id="studentImage" name="studentImage" accept="image/*" class="Students-file-input">
            <button type="button" class="Students-upload-btn" id="uploadImageBtn">
              <i class='bx bx-upload'></i> Choose Photo
            </button>
          </div>
        </div>

        <div class="Students-form-row">
          <div class="Students-form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required placeholder="e.g., John">
          </div>
          
          <div class="Students-form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required placeholder="e.g., Doe">
          </div>
        </div>

        <div class="Students-form-group">
          <label for="middleName">Middle Name (Optional)</label>
          <input type="text" id="middleName" name="middleName" placeholder="e.g., Michael">
        </div>

        <div class="Students-form-row">
          <div class="Students-form-group">
            <label for="studentEmail">Email Address</label>
            <input type="email" id="studentEmail" name="studentEmail" required placeholder="student@example.com">
          </div>
          
          <div class="Students-form-group">
            <label for="studentContact">Contact Number</label>
            <input type="tel" id="studentContact" name="studentContact" required placeholder="+63 912 345 6789">
          </div>
        </div>

        <div class="Students-form-row">
          <div class="Students-form-group">
            <label for="studentDept">Department</label>
            <select id="studentDept" name="studentDept" required>
              <option value="">Select Department</option>
              <option value="BSIT">BS Information Technology</option>
              <option value="BSCS">BS Computer Science</option>
              <option value="BSBA">BS Business Administration</option>
              <option value="BSN">BS Nursing</option>
              <option value="BEED">Bachelor of Elementary Education</option>
              <option value="BSED">Bachelor of Secondary Education</option>
            </select>
          </div>
          
          <div class="Students-form-group">
            <label for="studentSection">Section</label>
            <select id="studentSection" name="studentSection" required>
              <option value="">Select Section</option>
              <option value="BSIT-1A">BSIT-1A</option>
              <option value="BSIT-1B">BSIT-1B</option>
              <option value="BSIT-2A">BSIT-2A</option>
              <option value="BSIT-2B">BSIT-2B</option>
              <option value="BSIT-3A">BSIT-3A</option>
              <option value="BSIT-3B">BSIT-3B</option>
              <option value="BSIT-4A">BSIT-4A</option>
              <option value="BSIT-4B">BSIT-4B</option>
            </select>
          </div>
        </div>

        <div class="Students-form-group">
          <label for="studentAddress">Address</label>
          <textarea id="studentAddress" name="studentAddress" rows="2" placeholder="Complete address..."></textarea>
        </div>

        <div class="Students-form-actions">
          <button type="button" class="Students-btn-outline" id="cancelStudentsModal">Cancel</button>
          <button type="submit" class="Students-btn-primary">Save Student</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Empty State -->
  <div class="Students-empty-state" id="StudentsEmptyState" style="display: none;">
    <div class="Students-empty-icon">
      <i class='bx bx-user'></i>
    </div>
    <h3>No Students Found</h3>
    <p>Get started by adding your first student</p>
    <button class="Students-btn-primary" id="btnAddFirstStudent">
      <i class='bx bx-plus'></i> Add Student
    </button>
  </div>

</main>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Print functionality
    const printBtn = document.getElementById('btnPrintStudents');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        const tableTitle = document.querySelector('.Students-table-title').textContent;
        const tableSubtitle = document.querySelector('.Students-table-subtitle').textContent;

        const printContent = `
          <html>
            <head>
              <title>Students Report - OSAS System</title>
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
                .inactive { background: #ffebee; color: #c62828; }
                .graduating { background: #e3f2fd; color: #1565c0; }
                .dept-badge { 
                  padding: 4px 8px; 
                  border-radius: 4px; 
                  font-size: 11px; 
                  font-weight: 600; 
                }
                .bsit { background: #e8f5e9; color: #2e7d32; }
                .nursing { background: #f3e5f5; color: #7b1fa2; }
                .business { background: #fff3e0; color: #ef6c00; }
                .education { background: #e1f5fe; color: #0277bd; }
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
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Contact No</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2023-001</td>
                    <td>John Michael Doe<br><small>john.doe@example.com</small></td>
                    <td><span class="dept-badge bsit">BSIT</span></td>
                    <td>BSIT-3A</td>
                    <td>+63 912 345 6789</td>
                    <td><span class="status-badge active">Active</span></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2023-002</td>
                    <td>Maria Clara Santos<br><small>maria.santos@example.com</small></td>
                    <td><span class="dept-badge nursing">Nursing</span></td>
                    <td>NUR-2B</td>
                    <td>+63 923 456 7890</td>
                    <td><span class="status-badge active">Active</span></td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>2023-003</td>
                    <td>Robert James Chen<br><small>robert.chen@example.com</small></td>
                    <td><span class="dept-badge business">Business</span></td>
                    <td>BA-4A</td>
                    <td>+63 934 567 8901</td>
                    <td><span class="status-badge graduating">Graduating</span></td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>2023-004</td>
                    <td>Anna Marie Rodriguez<br><small>anna.rodriguez@example.com</small></td>
                    <td><span class="dept-badge education">Education</span></td>
                    <td>BEED-3C</td>
                    <td>+63 945 678 9012</td>
                    <td><span class="status-badge inactive">Inactive</span></td>
                  </tr>
                </tbody>
              </table>
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
    const modal = document.getElementById('StudentsModal');
    const openModalBtn = document.getElementById('btnAddStudents');
    const closeModalBtn = document.getElementById('closeStudentsModal');
    const cancelModalBtn = document.getElementById('cancelStudentsModal');
    const modalOverlay = document.getElementById('StudentsModalOverlay');

    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
      document.getElementById('StudentsForm').reset();
      // Reset image preview
      const previewImg = document.querySelector('.Students-preview-img');
      const previewPlaceholder = document.querySelector('.Students-preview-placeholder');
      previewImg.style.display = 'none';
      previewPlaceholder.style.display = 'flex';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Image upload preview
    const studentImageInput = document.getElementById('studentImage');
    const uploadImageBtn = document.getElementById('uploadImageBtn');
    const previewImg = document.querySelector('.Students-preview-img');
    const previewPlaceholder = document.querySelector('.Students-preview-placeholder');

    if (uploadImageBtn) {
      uploadImageBtn.addEventListener('click', () => {
        studentImageInput.click();
      });
    }

    if (studentImageInput) {
      studentImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
            previewPlaceholder.style.display = 'none';
          }
          reader.readAsDataURL(file);
        }
      });
    }

    // Search functionality
    const searchInput = document.getElementById('searchStudent');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#StudentsTableBody tr');

        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }

    // Sort functionality
    const sortHeaders = document.querySelectorAll('.Students-sortable');
    sortHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const sortBy = this.dataset.sort;
        console.log('Sort by:', sortBy);
        // Add sorting logic here
      });
    });

    // Filter functionality
    const filterSelect = document.getElementById('StudentsFilterSelect');
    if (filterSelect) {
      filterSelect.addEventListener('change', function(e) {
        const filterValue = e.target.value;
        const rows = document.querySelectorAll('#StudentsTableBody tr');

        rows.forEach(row => {
          if (filterValue === 'all') {
            row.style.display = '';
          } else {
            const statusBadge = row.querySelector('.Students-status-badge');
            if (statusBadge) {
              const status = statusBadge.classList.contains(filterValue) ? filterValue : 
                            statusBadge.classList.contains('active') ? 'active' : 'inactive';
              row.style.display = status === filterValue ? '' : 'none';
            }
          }
        });
      });
    }

    // Department filter
    const deptFilter = document.getElementById('StudentsFilterDept');
    if (deptFilter) {
      deptFilter.addEventListener('change', function(e) {
        const deptValue = e.target.value;
        const rows = document.querySelectorAll('#StudentsTableBody tr');

        rows.forEach(row => {
          if (deptValue === 'all') {
            row.style.display = '';
          } else {
            const deptBadge = row.querySelector('.dept-badge');
            if (deptBadge) {
              const deptClass = Array.from(deptBadge.classList).find(cls => cls !== 'dept-badge');
              row.style.display = deptClass === deptValue.toLowerCase() ? '' : 'none';
            }
          }
        });
      });
    }

    // Section filter
    const sectionFilter = document.getElementById('StudentsFilterSection');
    if (sectionFilter) {
      sectionFilter.addEventListener('change', function(e) {
        const sectionValue = e.target.value;
        const rows = document.querySelectorAll('#StudentsTableBody tr');

        rows.forEach(row => {
          if (sectionValue === 'all') {
            row.style.display = '';
          } else {
            const sectionCell = row.querySelector('.student-section');
            if (sectionCell) {
              row.style.display = sectionCell.textContent === sectionValue ? '' : 'none';
            }
          }
        });
      });
    }

    // Form submission
    const form = document.getElementById('StudentsForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        closeModal();
      });
    }

    // Update stats
    function updateStats() {
      document.getElementById('totalStudents').textContent = '250';
      document.getElementById('activeStudents').textContent = '240';
      document.getElementById('inactiveStudents').textContent = '10';
      document.getElementById('graduatingStudents').textContent = '38';
      document.getElementById('showingStudentsCount').textContent = '4';
      document.getElementById('totalStudentsCount').textContent = '250';
    }

    updateStats();

    // Add first student button
    const addFirstBtn = document.getElementById('btnAddFirstStudent');
    if (addFirstBtn) {
      addFirstBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });
</script>

</body>
</html>