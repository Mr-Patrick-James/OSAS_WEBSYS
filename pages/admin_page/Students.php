<!-- Students.html (SAFE + NON-CONFLICTING + CONSISTENT) -->
<main id="Students-page">

  <!-- HEADER -->
  <div class="Students-head-title">
    <div class="Students-left">
      <h1>Students</h1>
      <ul class="Students-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Students Data</a></li>
      </ul>
    </div>

    <div class="Students-header-actions">
      <button id="btnAddStudents" class="Students-btn">
        <i class='bx bx-plus'></i> Add Students
      </button>

      <button id="btnPrintStudents" class="Students-btn">
        <i class='bx bx-printer'></i> Print
      </button>
    </div>
  </div>

  <!-- FILTERS -->
  <div class="Students-filter-container">

    <label for="StudentsFilterDept">Department:</label>
    <select id="StudentsFilterDept">
      <option value="all">All</option>
      <option value="BSIS">BSIS</option>
      <option value="WFT">WFT</option>
      <option value="BTVTED">BTVTED</option>
      <option value="CHS">CHS</option>
    </select>

    <label for="StudentsFilterSection">Section:</label>
    <select id="StudentsFilterSection">
      <option value="all">All</option>
      <option value="BSIS-1">BSIS-1</option>
      <option value="BSIS-2">BSIS-2</option>
      <option value="BSIS-3">BSIS-3</option>
      <option value="WFT-1">WFT-1</option>
      <option value="WFT-2">WFT-2</option>
      <option value="BTVTED-1">BTVTED-1</option>
      <option value="BTVTED-2">BTVTED-2</option>
      <option value="BTVTED-3">BTVTED-3</option>
      <option value="CHS-1">CHS-1</option>
      <option value="CHS-2">CHS-2</option>
      <option value="CHS-3">CHS-3</option>
    </select>
  </div>

  <!-- TABLE -->
  <div id="StudentsPrintArea" class="Students-table-container">
    <table class="Students-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Image</th>
          <th>Student ID</th>
          <th>Name</th>
          <th>Department</th>
          <th>Section</th>
          <th>Contact No</th>
        </tr>
      </thead>

      <tbody id="StudentsTableBody">
        <!-- JS will populate rows -->
      </tbody>
    </table>
  </div>

  <!-- MODAL -->
  <div id="StudentsModal" class="Students-modal">
    <div class="Students-modal-content">

      <span class="Students-close-btn" id="closeStudentsModal">&times;</span>

      <h2 id="StudentsModalTitle">Add Student</h2>

      <form id="StudentsForm">

        <label for="studentId">Student ID:</label>
        <input type="text" id="studentId" required>

        <label for="studentImage">Student Photo:</label>
        <div class="Students-image-upload">
          <div class="Students-image-preview" id="imagePreview">
            <img class="Students-preview-img" style="display:none">
            <span class="Students-preview-text">Image preview</span>
          </div>
          <input type="file" id="studentImage" accept="image/*">
        </div>

        <label for="studentName">Student Name:</label>
        <input type="text" id="studentName" required>

        <label for="studentDept">Department:</label>
        <input type="text" id="studentDept" required>

        <label for="studentSection">Section:</label>
        <input type="text" id="studentSection" required>

        <label for="studentContact">Contact No:</label>
        <input type="tel" id="studentContact" required>

        <button type="submit" class="Students-btn">Save</button>
      </form>
    </div>
  </div>

</main>
