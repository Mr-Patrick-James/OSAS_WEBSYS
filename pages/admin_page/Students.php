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
      <button id="btnArchiveStudents" class="Students-btn outline small">
          <i class='bx bx-archive'></i>
          <span>Archive</span>
        </button>
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
            <option value="archived">Archived</option>
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
          <!-- JS will populate rows from database -->
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

      <div class="Students-modal-body">
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

</body>
</html>