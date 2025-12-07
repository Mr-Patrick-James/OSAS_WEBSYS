<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Violations | OSAS System</title>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="../assets/styles/violation.css">
</head>
<body>
  
<!-- Violations.html -->
<main id="Violations-page">
  <!-- HEADER -->
  <div class="Violations-head-title">
    <div class="Violations-left">
      <h1>Violations</h1>
      <p class="Violations-subtitle">Manage and track student violations in the institution</p>
      <ul class="Violations-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Violations Data</a></li>
      </ul>
    </div>

    <div class="Violations-header-actions">
      <div class="Violations-button-group">
        <button id="btnImportViolations" class="Violations-btn outline small">
          <i class='bx bx-upload'></i>
          <span>Import</span>
        </button>
        <button id="btnExportViolations" class="Violations-btn outline small">
          <i class='bx bx-download'></i>
          <span>Export</span>
        </button>
        <button id="btnPrintViolations" class="Violations-btn outline small">
          <i class='bx bx-printer'></i>
          <span>Print</span>
        </button>
      </div>
      <button id="btnAddViolations" class="Violations-btn primary">
        <i class='bx bx-plus'></i> Record Violation
      </button>
    </div>
  </div>

  <!-- STATS CARDS -->
  <div class="Violations-stats-overview">
    <div class="Violations-stat-card">
      <div class="Violations-stat-icon">
        <i class='bx bx-error-circle'></i>
      </div>
      <div class="Violations-stat-content">
        <h3 class="Violations-stat-title">Total Violations</h3>
        <div class="Violations-stat-value" id="totalViolations">0</div>
        <div class="Violations-stat-change negative">
          <i class='bx bx-up-arrow-alt'></i>
          <span>+18 this week</span>
        </div>
      </div>
    </div>

    <div class="Violations-stat-card">
      <div class="Violations-stat-icon">
        <i class='bx bx-check-circle'></i>
      </div>
      <div class="Violations-stat-content">
        <h3 class="Violations-stat-title">Resolved</h3>
        <div class="Violations-stat-value" id="resolvedViolations">0</div>
        <div class="Violations-stat-percentage">68%</div>
      </div>
    </div>

    <div class="Violations-stat-card">
      <div class="Violations-stat-icon">
        <i class='bx bx-time-five'></i>
      </div>
      <div class="Violations-stat-content">
        <h3 class="Violations-stat-title">Pending</h3>
        <div class="Violations-stat-value" id="pendingViolations">0</div>
        <div class="Violations-stat-percentage">24%</div>
      </div>
    </div>

    <div class="Violations-stat-card">
      <div class="Violations-stat-icon">
        <i class='bx bx-user-voice'></i>
      </div>
      <div class="Violations-stat-content">
        <h3 class="Violations-stat-title">Disciplinary</h3>
        <div class="Violations-stat-value" id="disciplinaryViolations">0</div>
        <div class="Violations-stat-percentage">8%</div>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT CARD -->
  <div class="Violations-content-card">
    <!-- Table Header -->
    <div class="Violations-table-header">
      <div class="Violations-header-left">
        <h2 class="Violations-table-title">Violations List</h2>
        <p class="Violations-table-subtitle">All student violation records and their status</p>
      </div>

      <div class="Violations-header-right">
        <div class="Violations-search-box">
          <i class='bx bx-search'></i>
          <input type="text" id="searchViolation" placeholder="Search violations...">
        </div>

        <div class="Violations-filter-group">
          <select id="ViolationsFilter" class="Violations-filter-select">
            <option value="all">All Departments</option>
            <option value="BSIS">BSIS</option>
            <option value="WFT">WFT</option>
            <option value="BTVTED">BTVTED</option>
            <option value="CHS">CHS</option>
          </select>

          <select id="ViolationsStatusFilter" class="Violations-filter-select">
            <option value="all">All Status</option>
            <option value="permitted">Permitted</option>
            <option value="warning">Warning</option>
            <option value="disciplinary">Disciplinary</option>
            <option value="resolved">Resolved</option>
          </select>

          <button class="Violations-filter-btn" title="More filters">
            <i class='bx bx-filter-alt'></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Violations Table -->
    <div class="Violations-table-container">
      <table class="Violations-table">
        <thead>
          <tr>
            <th class="Violations-sortable" data-sort="id">
              <div class="Violations-table-header-content">
                <span>Case ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Student</th>
            <th class="Violations-sortable" data-sort="studentId">
              <div class="Violations-table-header-content">
                <span>Student ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Violations-sortable" data-sort="name">
              <div class="Violations-table-header-content">
                <span>Violation Type</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Level</th>
            <th class="Violations-sortable" data-sort="department">
              <div class="Violations-table-header-content">
                <span>Department</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Section</th>
            <th class="Violations-sortable" data-sort="date">
              <div class="Violations-table-header-content">
                <span>Date Reported</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody id="ViolationsTableBody">
          <!-- Sample Data -->
          <tr>
            <td class="violation-case-id">VIOL-2024-001</td>
            <td class="violation-student-cell">
              <div class="violation-student-info">
                <div class="violation-student-image">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=40" alt="John Doe" class="student-avatar">
                </div>
                <div class="violation-student-name">
                  <strong>John Doe</strong>
                </div>
              </div>
            </td>
            <td class="violation-student-id">2023-001</td>
            <td class="violation-type">
              <span class="violation-type-badge uniform">Improper Uniform</span>
            </td>
            <td class="violation-level">
              <span class="violation-level-badge warning">Warning 2</span>
            </td>
            <td class="violation-dept">
              <span class="dept-badge bsis">BSIS</span>
            </td>
            <td class="violation-section">BSIS-3A</td>
            <td class="violation-date">Feb 15, 2024</td>
            <td>
              <span class="Violations-status-badge warning">Warning</span>
            </td>
            <td>
              <div class="Violations-action-buttons">
                <button class="Violations-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Violations-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Violations-action-btn resolve" title="Mark Resolved">
                  <i class='bx bx-check'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="violation-case-id">VIOL-2024-002</td>
            <td class="violation-student-cell">
              <div class="violation-student-info">
                <div class="violation-student-image">
                  <img src="https://ui-avatars.com/api/?name=Maria+Santos&background=4361ee&color=fff&size=40" alt="Maria Santos" class="student-avatar">
                </div>
                <div class="violation-student-name">
                  <strong>Maria Santos</strong>
                </div>
              </div>
            </td>
            <td class="violation-student-id">2023-002</td>
            <td class="violation-type">
              <span class="violation-type-badge id">No ID</span>
            </td>
            <td class="violation-level">
              <span class="violation-level-badge permitted">Permitted 1</span>
            </td>
            <td class="violation-dept">
              <span class="dept-badge wft">WFT</span>
            </td>
            <td class="violation-section">WFT-2B</td>
            <td class="violation-date">Feb 14, 2024</td>
            <td>
              <span class="Violations-status-badge permitted">Permitted</span>
            </td>
            <td>
              <div class="Violations-action-buttons">
                <button class="Violations-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Violations-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Violations-action-btn resolve" title="Mark Resolved">
                  <i class='bx bx-check'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="violation-case-id">VIOL-2024-003</td>
            <td class="violation-student-cell">
              <div class="violation-student-info">
                <div class="violation-student-image">
                  <img src="https://ui-avatars.com/api/?name=Robert+Chen&background=10b981&color=fff&size=40" alt="Robert Chen" class="student-avatar">
                </div>
                <div class="violation-student-name">
                  <strong>Robert Chen</strong>
                </div>
              </div>
            </td>
            <td class="violation-student-id">2023-003</td>
            <td class="violation-type">
              <span class="violation-type-badge footwear">Improper Footwear</span>
            </td>
            <td class="violation-level">
              <span class="violation-level-badge disciplinary">Disciplinary</span>
            </td>
            <td class="violation-dept">
              <span class="dept-badge btvted">BTVTED</span>
            </td>
            <td class="violation-section">BTVTED-4A</td>
            <td class="violation-date">Feb 10, 2024</td>
            <td>
              <span class="Violations-status-badge disciplinary">Disciplinary</span>
            </td>
            <td>
              <div class="Violations-action-buttons">
                <button class="Violations-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Violations-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Violations-action-btn escalate" title="Escalate">
                  <i class='bx bx-alarm'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="violation-case-id">VIOL-2024-004</td>
            <td class="violation-student-cell">
              <div class="violation-student-info">
                <div class="violation-student-image">
                  <img src="https://ui-avatars.com/api/?name=Anna+Rodriguez&background=f59e0b&color=fff&size=40" alt="Anna Rodriguez" class="student-avatar">
                </div>
                <div class="violation-student-name">
                  <strong>Anna Rodriguez</strong>
                </div>
              </div>
            </td>
            <td class="violation-student-id">2023-004</td>
            <td class="violation-type">
              <span class="violation-type-badge uniform">Improper Uniform</span>
            </td>
            <td class="violation-level">
              <span class="violation-level-badge warning">Warning 3</span>
            </td>
            <td class="violation-dept">
              <span class="dept-badge chs">CHS</span>
            </td>
            <td class="violation-section">CHS-3C</td>
            <td class="violation-date">Feb 8, 2024</td>
            <td>
              <span class="Violations-status-badge resolved">Resolved</span>
            </td>
            <td>
              <div class="Violations-action-buttons">
                <button class="Violations-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Violations-action-btn edit" title="Edit">
                  <i class='bx bx-edit'></i>
                </button>
                <button class="Violations-action-btn reopen" title="Reopen">
                  <i class='bx bx-rotate-left'></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div class="Violations-table-footer">
      <div class="Violations-footer-info">
        Showing <span id="showingViolationsCount">4</span> of <span id="totalViolationsCount">48</span> violations
      </div>
      <div class="Violations-pagination">
        <button class="Violations-pagination-btn" disabled>
          <i class='bx bx-chevron-left'></i>
        </button>
        <button class="Violations-pagination-btn active">1</button>
        <button class="Violations-pagination-btn">2</button>
        <button class="Violations-pagination-btn">3</button>
        <button class="Violations-pagination-btn">4</button>
        <button class="Violations-pagination-btn">5</button>
        <button class="Violations-pagination-btn">
          <i class='bx bx-chevron-right'></i>
        </button>
      </div>
    </div>
  </div>

  <!-- VIOLATION RECORDING MODAL -->
  <div id="ViolationRecordModal" class="Violations-modal">
    <div class="Violations-modal-overlay" id="ViolationModalOverlay"></div>
    <div class="Violations-modal-container">
      <div class="Violations-modal-header">
        <h2 id="violationModalTitle">Record New Violation</h2>
        <button class="Violations-close-btn" id="closeRecordModal">
          <i class='bx bx-x'></i>
        </button>
      </div>

      <form id="ViolationRecordForm">
        <!-- Student Search Section -->
        <div class="Violations-form-group">
          <label for="studentSearch">Search Student</label>
          <div class="student-search-wrapper">
            <i class='bx bx-search'></i>
            <input type="text" id="studentSearch" placeholder="Search by Student ID or Name...">
            <button type="button" class="Violations-search-btn">
              <i class='bx bx-search-alt'></i> Search
            </button>
          </div>
        </div>

        <!-- Student Info Card -->
        <div class="violation-student-info-card selected">
          <div class="violation-student-image">
            <img id="modalStudentImage" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Ccircle cx='50' cy='100' r='40' fill='%23ccc'/%3E%3C/svg%3E" alt="Student Image">
          </div>
          <div class="violation-student-details">
            <div class="violation-detail-row">
              <span class="violation-detail-label">Student ID:</span>
              <span id="modalStudentId" class="violation-detail-value">2023-001</span>
            </div>
            <div class="violation-detail-row">
              <span class="violation-detail-label">Name:</span>
              <span id="modalStudentName" class="violation-detail-value">John Michael Doe</span>
            </div>
            <div class="violation-detail-row">
              <span class="violation-detail-label">Department:</span>
              <span id="modalStudentDept" class="violation-detail-value">BS Information Technology</span>
            </div>
            <div class="violation-detail-row">
              <span class="violation-detail-label">Section:</span>
              <span id="modalStudentSection" class="violation-detail-value">BSIT-3A</span>
            </div>
            <div class="violation-detail-row">
              <span class="violation-detail-label">Contact:</span>
              <span id="modalStudentContact" class="violation-detail-value">+63 912 345 6789</span>
            </div>
          </div>
        </div>

        <!-- Violation Type Selection -->
        <div class="violation-type-section">
          <h3>Violation Type</h3>
          <div class="violation-types">
            <div class="violation-type-card" data-violation="uniform">
              <input type="radio" id="uniformViolation" name="violationType" value="improper_uniform">
              <label for="uniformViolation">
                <i class='bx bx-t-shirt'></i>
                <span>Improper Uniform</span>
              </label>
            </div>
            <div class="violation-type-card" data-violation="footwear">
              <input type="radio" id="footwearViolation" name="violationType" value="improper_footwear">
              <label for="footwearViolation">
                <i class='bx bx-walk'></i>
                <span>Improper Footwear</span>
              </label>
            </div>
            <div class="violation-type-card" data-violation="id">
              <input type="radio" id="idViolation" name="violationType" value="no_id">
              <label for="idViolation">
                <i class='bx bx-id-card'></i>
                <span>No ID</span>
              </label>
            </div>
            <div class="violation-type-card" data-violation="behavior">
              <input type="radio" id="behaviorViolation" name="violationType" value="misconduct">
              <label for="behaviorViolation">
                <i class='bx bx-message-alt-error'></i>
                <span>Misconduct</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Violation Level Selection -->
        <div class="violation-level-section">
          <h3>Violation Level</h3>
          <div class="violation-level-buttons">
            <div class="violation-level-option">
              <input type="radio" id="permitted1" name="violationLevel" value="permitted1">
              <label for="permitted1" class="level-permitted">
                <span class="level-title">Permitted 1</span>
                <span class="level-desc">First offense - Verbal reminder</span>
              </label>
            </div>
            <div class="violation-level-option">
              <input type="radio" id="permitted2" name="violationLevel" value="permitted2">
              <label for="permitted2" class="level-permitted">
                <span class="level-title">Permitted 2</span>
                <span class="level-desc">Second offense - Written warning</span>
              </label>
            </div>
            <div class="violation-level-option">
              <input type="radio" id="warning1" name="violationLevel" value="warning1">
              <label for="warning1" class="level-warning">
                <span class="level-title">Warning 1</span>
                <span class="level-desc">Third offense - Parent notification</span>
              </label>
            </div>
            <div class="violation-level-option">
              <input type="radio" id="warning2" name="violationLevel" value="warning2">
              <label for="warning2" class="level-warning">
                <span class="level-title">Warning 2</span>
                <span class="level-desc">Fourth offense - Conference required</span>
              </label>
            </div>
            <div class="violation-level-option">
              <input type="radio" id="warning3" name="violationLevel" value="warning3">
              <label for="warning3" class="level-warning">
                <span class="level-title">Warning 3</span>
                <span class="level-desc">Fifth offense - Disciplinary action</span>
              </label>
            </div>
            <div class="violation-level-option">
              <input type="radio" id="disciplinary" name="violationLevel" value="disciplinary">
              <label for="disciplinary" class="level-disciplinary">
                <span class="level-title">Disciplinary</span>
                <span class="level-desc">Severe violation - Immediate action</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Additional Details -->
        <div class="violation-details-section">
          <div class="Violations-form-row">
            <div class="Violations-form-group">
              <label for="violationDate">Date of Violation</label>
              <input type="date" id="violationDate" name="violationDate" required>
            </div>
            
            <div class="Violations-form-group">
              <label for="violationTime">Time of Violation</label>
              <input type="time" id="violationTime" name="violationTime" required>
            </div>
          </div>

          <div class="Violations-form-group">
            <label for="violationLocation">Location</label>
            <select id="violationLocation" name="violationLocation" required>
              <option value="">Select location</option>
              <option value="gate_1">Main Gate 1</option>
              <option value="gate_2">Gate 2</option>
              <option value="classroom">Classroom</option>
              <option value="library">Library</option>
              <option value="cafeteria">Cafeteria</option>
              <option value="gym">Gymnasium</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div class="Violations-form-group">
            <label for="reportedBy">Reported By</label>
            <input type="text" id="reportedBy" name="reportedBy" required placeholder="Name of reporting officer">
          </div>

          <div class="Violations-form-group">
            <label for="violationNotes">Additional Notes</label>
            <textarea id="violationNotes" name="violationNotes" rows="3" placeholder="Enter detailed description of the violation..."></textarea>
          </div>
        </div>

        <!-- Attachments -->
        <div class="violation-attachments">
          <h4>Attachments (Optional)</h4>
          <div class="attachment-upload">
            <input type="file" id="violationAttachment" name="violationAttachment" accept="image/*,.pdf,.doc,.docx" multiple>
            <label for="violationAttachment" class="attachment-label">
              <i class='bx bx-paperclip'></i>
              <span>Upload evidence (photos, documents)</span>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="Violations-form-actions">
          <button type="button" class="Violations-btn-outline" id="cancelRecordModal">Cancel</button>
          <button type="submit" class="Violations-btn-primary">Record Violation</button>
        </div>
      </form>
    </div>
  </div>

  <!-- VIOLATION DETAILS MODAL -->
  <div id="ViolationDetailsModal" class="Violations-modal">
    <div class="Violations-modal-overlay" id="DetailsModalOverlay"></div>
    <div class="Violations-modal-container">
      <div class="Violations-modal-header">
        <h2>Violation Details</h2>
        <button class="Violations-close-btn" id="closeDetailsModal">
          <i class='bx bx-x'></i>
        </button>
      </div>

      <div class="violation-details-content">
        <!-- Case Header -->
        <div class="case-header">
          <span class="case-id">Case: VIOL-2024-001</span>
          <span class="case-status-badge warning">Warning</span>
        </div>

        <!-- Student Info -->
        <div class="violation-student-info-card detailed">
          <div class="violation-student-image">
            <img src="https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=80" alt="Student">
          </div>
          <div class="violation-student-details">
            <h3>John Michael Doe</h3>
            <div class="student-meta">
              <span class="student-id">ID: 2023-001</span>
              <span class="student-dept badge bsis">BSIS</span>
              <span class="student-section">Section: BSIT-3A</span>
            </div>
            <div class="student-contact">
              <i class='bx bx-phone'></i> +63 912 345 6789
              <i class='bx bx-envelope'></i> john.doe@example.com
            </div>
          </div>
        </div>

        <!-- Violation Details -->
        <div class="violation-details-grid">
          <div class="detail-item">
            <span class="detail-label">Violation Type:</span>
            <span class="detail-value badge uniform">Improper Uniform</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Level:</span>
            <span class="detail-value badge warning">Warning 2</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">Feb 15, 2024 • 08:15 AM</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Location:</span>
            <span class="detail-value">Main Gate 1</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Reported By:</span>
            <span class="detail-value">Officer Maria Santos</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Status:</span>
            <span class="detail-value badge warning">Active Warning</span>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="violation-notes-section">
          <h4>Violation Description</h4>
          <div class="notes-content">
            <p>Student was found wearing improper uniform - wearing colored undershirt instead of the required white undershirt. This is the second offense for improper uniform violation.</p>
          </div>
        </div>

        <!-- History Timeline -->
        <div class="violation-history">
          <h4>Violation History</h4>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <span class="timeline-date">Feb 15, 2024 • 08:15 AM</span>
                <span class="timeline-title">Warning 2 - Improper Uniform</span>
                <span class="timeline-desc">Reported at Main Gate 1 by Officer Maria Santos</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <span class="timeline-date">Jan 30, 2024 • 07:45 AM</span>
                <span class="timeline-title">Warning 1 - Improper Uniform</span>
                <span class="timeline-desc">First offense - Parent was notified</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <span class="timeline-date">Dec 12, 2023 • 08:30 AM</span>
                <span class="timeline-title">Permitted 2 - No ID</span>
                <span class="timeline-desc">Second offense for not wearing ID</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="violation-details-actions">
          <button class="Violations-action-btn edit" title="Edit">
            <i class='bx bx-edit'></i> Edit
          </button>
          <button class="Violations-action-btn resolve" title="Mark Resolved">
            <i class='bx bx-check'></i> Mark Resolved
          </button>
          <button class="Violations-action-btn escalate" title="Escalate">
            <i class='bx bx-alarm'></i> Escalate
          </button>
          <button class="Violations-action-btn print" title="Print">
            <i class='bx bx-printer'></i> Print Report
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div class="Violations-empty-state" id="ViolationsEmptyState" style="display: none;">
    <div class="Violations-empty-icon">
      <i class='bx bx-error-circle'></i>
    </div>
    <h3>No Violations Found</h3>
    <p>No violation records have been created yet</p>
    <button class="Violations-btn-primary" id="btnRecordFirstViolation">
      <i class='bx bx-plus'></i> Record First Violation
    </button>
  </div>

</main>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    // Print functionality
    const printBtn = document.getElementById('btnPrintViolations');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        const tableTitle = document.querySelector('.Violations-table-title').textContent;
        const tableSubtitle = document.querySelector('.Violations-table-subtitle').textContent;

        const printContent = `
          <html>
            <head>
              <title>Violations Report - OSAS System</title>
              <style>
                body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                th { background-color: #f8f9fa; font-weight: 600; }
                h1 { color: #333; margin-bottom: 10px; }
                .report-header { margin-bottom: 30px; }
                .report-date { color: #666; margin-bottom: 20px; }
                .status-badge, .type-badge, .level-badge, .dept-badge { 
                  padding: 4px 8px; 
                  border-radius: 4px; 
                  font-size: 11px; 
                  font-weight: 600; 
                  display: inline-block;
                }
                .permitted { background: #e8f5e9; color: #2e7d32; }
                .warning { background: #fff3e0; color: #ef6c00; }
                .disciplinary { background: #ffebee; color: #c62828; }
                .resolved { background: #e3f2fd; color: #1565c0; }
                .uniform { background: #f3e5f5; color: #7b1fa2; }
                .footwear { background: #e8f5e9; color: #2e7d32; }
                .id { background: #e3f2fd; color: #1565c0; }
                .bsis { background: #e8f5e9; color: #2e7d32; }
                .wft { background: #e3f2fd; color: #1565c0; }
                .btvted { background: #fff3e0; color: #ef6c00; }
                .chs { background: #f3e5f5; color: #7b1fa2; }
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
                    <th>Case ID</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Violation Type</th>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Section</th>
                    <th>Date Reported</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>VIOL-2024-001</td>
                    <td>2023-001</td>
                    <td>John Doe</td>
                    <td><span class="type-badge uniform">Improper Uniform</span></td>
                    <td><span class="level-badge warning">Warning 2</span></td>
                    <td><span class="dept-badge bsis">BSIS</span></td>
                    <td>BSIS-3A</td>
                    <td>Feb 15, 2024</td>
                    <td><span class="status-badge warning">Warning</span></td>
                  </tr>
                  <tr>
                    <td>VIOL-2024-002</td>
                    <td>2023-002</td>
                    <td>Maria Santos</td>
                    <td><span class="type-badge id">No ID</span></td>
                    <td><span class="level-badge permitted">Permitted 1</span></td>
                    <td><span class="dept-badge wft">WFT</span></td>
                    <td>WFT-2B</td>
                    <td>Feb 14, 2024</td>
                    <td><span class="status-badge permitted">Permitted</span></td>
                  </tr>
                  <tr>
                    <td>VIOL-2024-003</td>
                    <td>2023-003</td>
                    <td>Robert Chen</td>
                    <td><span class="type-badge footwear">Improper Footwear</span></td>
                    <td><span class="level-badge disciplinary">Disciplinary</span></td>
                    <td><span class="dept-badge btvted">BTVTED</span></td>
                    <td>BTVTED-4A</td>
                    <td>Feb 10, 2024</td>
                    <td><span class="status-badge disciplinary">Disciplinary</span></td>
                  </tr>
                  <tr>
                    <td>VIOL-2024-004</td>
                    <td>2023-004</td>
                    <td>Anna Rodriguez</td>
                    <td><span class="type-badge uniform">Improper Uniform</span></td>
                    <td><span class="level-badge warning">Warning 3</span></td>
                    <td><span class="dept-badge chs">CHS</span></td>
                    <td>CHS-3C</td>
                    <td>Feb 8, 2024</td>
                    <td><span class="status-badge resolved">Resolved</span></td>
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
    const recordModal = document.getElementById('ViolationRecordModal');
    const detailsModal = document.getElementById('ViolationDetailsModal');
    const openModalBtn = document.getElementById('btnAddViolations');
    const closeRecordBtn = document.getElementById('closeRecordModal');
    const closeDetailsBtn = document.getElementById('closeDetailsModal');
    const cancelRecordBtn = document.getElementById('cancelRecordModal');
    const recordOverlay = document.getElementById('ViolationModalOverlay');
    const detailsOverlay = document.getElementById('DetailsModalOverlay');

    // Open record modal
    if (openModalBtn) {
      openModalBtn.addEventListener('click', () => {
        recordModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    // Close modals
    const closeRecordModal = () => {
      recordModal.classList.remove('active');
      document.body.style.overflow = 'auto';
      document.getElementById('ViolationRecordForm').reset();
    };

    const closeDetailsModal = () => {
      detailsModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (closeRecordBtn) closeRecordBtn.addEventListener('click', closeRecordModal);
    if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeDetailsModal);
    if (cancelRecordBtn) cancelRecordBtn.addEventListener('click', closeRecordModal);
    if (recordOverlay) recordOverlay.addEventListener('click', closeRecordModal);
    if (detailsOverlay) detailsOverlay.addEventListener('click', closeDetailsModal);

    // Open details modal when view button is clicked
    const viewButtons = document.querySelectorAll('.Violations-action-btn.view');
    viewButtons.forEach(button => {
      button.addEventListener('click', () => {
        detailsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // Search functionality
    const searchInput = document.getElementById('searchViolation');
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#ViolationsTableBody tr');

        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
      });
    }

    // Sort functionality
    const sortHeaders = document.querySelectorAll('.Violations-sortable');
    sortHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const sortBy = this.dataset.sort;
        console.log('Sort by:', sortBy);
        // Add sorting logic here
      });
    });

    // Filter functionality
    const deptFilter = document.getElementById('ViolationsFilter');
    const statusFilter = document.getElementById('ViolationsStatusFilter');

    function applyFilters() {
      const deptValue = deptFilter.value;
      const statusValue = statusFilter.value;
      const rows = document.querySelectorAll('#ViolationsTableBody tr');

      rows.forEach(row => {
        const deptCell = row.querySelector('.violation-dept .dept-badge');
        const statusCell = row.querySelector('.Violations-status-badge');
        
        let showRow = true;
        
        if (deptValue !== 'all' && deptCell) {
          const deptClass = Array.from(deptCell.classList).find(cls => cls !== 'dept-badge');
          showRow = showRow && deptClass === deptValue.toLowerCase();
        }
        
        if (statusValue !== 'all' && statusCell) {
          const statusClass = statusCell.classList.contains(statusValue);
          showRow = showRow && statusClass;
        }
        
        row.style.display = showRow ? '' : 'none';
      });
    }

    if (deptFilter) deptFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    // Violation type selection
    const violationTypeCards = document.querySelectorAll('.violation-type-card');
    violationTypeCards.forEach(card => {
      card.addEventListener('click', function() {
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Remove active class from all cards
        violationTypeCards.forEach(c => c.classList.remove('active'));
        // Add active class to clicked card
        this.classList.add('active');
      });
    });

    // Violation level selection
    const levelOptions = document.querySelectorAll('.violation-level-option');
    levelOptions.forEach(option => {
      option.addEventListener('click', function() {
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Remove active class from all options
        levelOptions.forEach(o => o.classList.remove('active'));
        // Add active class to clicked option
        this.classList.add('active');
      });
    });

    // Form submission
    const form = document.getElementById('ViolationRecordForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Violation recorded');
        closeRecordModal();
      });
    }

    // Update stats
    function updateStats() {
      document.getElementById('totalViolations').textContent = '48';
      document.getElementById('resolvedViolations').textContent = '32';
      document.getElementById('pendingViolations').textContent = '12';
      document.getElementById('disciplinaryViolations').textContent = '4';
      document.getElementById('showingViolationsCount').textContent = '4';
      document.getElementById('totalViolationsCount').textContent = '48';
    }

    updateStats();

    // Add first violation button
    const addFirstBtn = document.getElementById('btnRecordFirstViolation');
    if (addFirstBtn) {
      addFirstBtn.addEventListener('click', () => {
        recordModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });
</script>
 
</body>
</html>