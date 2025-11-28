<!-- Violations.html -->
<main id="Violations-page">
  <div class="Violations-head-title">
    <div class="Violations-left">
      <h1>Violations</h1>
      <ul class="Violations-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Violations Data</a></li>
      </ul>
    </div>
    <div class="Violations-header-actions">
      <button id="btnAddViolations" class="Violations-btn">
        <i class='bx bx-plus'></i> Add Violations
      </button>
      <button id="btnPrintViolations" class="Violations-btn Violations-btn-print">
        <i class='bx bx-printer'></i> Print
      </button>
    </div>
  </div>

  <div class="Violations-filter-container">
    <label for="ViolationsFilter">Filter:</label>
    <select id="ViolationsFilter">
      <option value="all">All Departments</option>
      <option value="bsis">BSIS</option>
      <option value="wft">WFT</option>
      <option value="btvted">BTVTED</option>
      <option value="chs">CHS</option>
    </select>
    <select id="ViolationsStatusFilter">
      <option value="all">All Status</option>
      <option value="permitted">Permitted</option>
      <option value="warning">Warning</option>
      <option value="disciplinary">Disciplinary Action</option>
    </select>
  </div>

  <div id="printArea" class="Violations-table-container">
    <table class="Violations-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Students ID</th>
          <th>Student Name</th>
          <th>Department</th>
          <th>Section</th>
          <th>Contact No</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody id="ViolationsTableBody">
        <!-- Data will be populated by JavaScript -->
      </tbody>
    </table>
  </div>

  <!-- Violation Details Modal -->
  <div id="ViolationDetailsModal" class="Violations-modal">
    <div class="Violations-modal-content">
      <span class="Violations-close-btn" id="closeDetailsModal">&times;</span>
      <h2 id="violationModalTitle">Record Violation</h2>

      <!-- Student Info Section -->
      <div class="violation-student-info-card">
        <div class="violation-student-image">
          <img id="modalStudentImage" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='40' r='20' fill='%23ccc'/%3E%3Ccircle cx='50' cy='100' r='40' fill='%23ccc'/%3E%3C/svg%3E" alt="Student Image">
        </div>
        <div class="violation-student-details">
          <div class="violation-detail-row">
            <span class="violation-detail-label">Student ID:</span>
            <span id="modalStudentId" class="violation-detail-value">-</span>
          </div>
          <div class="violation-detail-row">
            <span class="violation-detail-label">Name:</span>
            <span id="modalStudentName" class="violation-detail-value">-</span>
          </div>
          <div class="violation-detail-row">
            <span class="violation-detail-label">Department:</span>
            <span id="modalStudentDept" class="violation-detail-value">-</span>
          </div>
          <div class="violation-detail-row">
            <span class="violation-detail-label">Section:</span>
            <span id="modalStudentSection" class="violation-detail-value">-</span>
          </div>
        </div>
      </div>

      <!-- Violation Type Selection -->
      <div class="violation-type-section">
        <h3>Violation Type</h3>
        <div class="violation-types">
          <div class="violation-type-card" data-violation="uniform">
            <input type="radio" id="uniformViolation" name="violationType" value="improper_uniform">
            <label for="uniformViolation">Improper Uniform</label>
          </div>
          <div class="violation-type-card" data-violation="footwear">
            <input type="radio" id="footwearViolation" name="violationType" value="improper_footwear">
            <label for="footwearViolation">Improper Footwear</label>
          </div>
          <div class="violation-type-card" data-violation="id">
            <input type="radio" id="idViolation" name="violationType" value="no_id">
            <label for="idViolation">No ID</label>
          </div>
        </div>
      </div>

      <!-- Violation Level Table -->
      <div class="violation-levels">
        <table class="violation-level-table">
          <thead>
            <tr>
              <th>Level</th>
              <th>Permitted 1</th>
              <th>Permitted 2</th>
              <th>Warning 1</th>
              <th>Warning 2</th>
              <th>Warning 3</th>
            </tr>
          </thead>
          <tbody>
            <tr data-violation="uniform">
              <td>Improper Uniform</td>
              <td><input type="radio" name="uniformLevel" value="permitted1"></td>
              <td><input type="radio" name="uniformLevel" value="permitted2"></td>
              <td><input type="radio" name="uniformLevel" value="warning1"></td>
              <td><input type="radio" name="uniformLevel" value="warning2"></td>
              <td><input type="radio" name="uniformLevel" value="warning3"></td>
            </tr>
            <tr data-violation="footwear">
              <td>Improper Footwear</td>
              <td><input type="radio" name="footwearLevel" value="permitted1"></td>
              <td><input type="radio" name="footwearLevel" value="permitted2"></td>
              <td><input type="radio" name="footwearLevel" value="warning1"></td>
              <td><input type="radio" name="footwearLevel" value="warning2"></td>
              <td><input type="radio" name="footwearLevel" value="warning3"></td>
            </tr>
            <tr data-violation="id">
              <td>No ID</td>
              <td><input type="radio" name="idLevel" value="permitted1"></td>
              <td><input type="radio" name="idLevel" value="permitted2"></td>
              <td><input type="radio" name="idLevel" value="warning1"></td>
              <td><input type="radio" name="idLevel" value="warning2"></td>
              <td><input type="radio" name="idLevel" value="warning3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Additional Notes -->
      <div class="violation-notes">
        <label for="violationNotes">Additional Notes:</label>
        <textarea id="violationNotes" rows="3"
          placeholder="Enter any additional details about the violation..."></textarea>
      </div>

      <!-- Action Buttons -->
      <div class="violation-modal-actions">
        <button type="button" class="Violations-btn violation-btn-cancel">Cancel</button>
        <button type="button" class="Violations-btn violation-btn-submit">Record Violation</button>
      </div>
    </div>
  </div>
</main>

<script src="../assets/js/violation.js"></script>