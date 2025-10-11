<!-- department.html -->
<main id="department-page">
  <div class="head-title">
    <div class="left">
      <h1>Departments</h1>
      <ul class="breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Departments</a></li>
      </ul>
    </div>
    <div class="header-actions">
      <button id="btnAddDepartment" class="btn">
        <i class='bx bx-plus'></i> Add Department
      </button>
      <button id="btnPrintDepartments" class="btn">
        <i class='bx bx-printer'></i> Print
      </button>
    </div>
  </div>

  <div class="filter-container">
    <label for="departmentFilter">Filter:</label>
    <select id="departmentFilter">
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="archived">Archived</option>
    </select>
  </div>

  <div id="printArea" class="table-container">
    <table class="department-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Department Name</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody id="departmentTableBody">
        <!-- JS will populate rows -->
      </tbody>
    </table>
  </div>

  <!-- Modal -->
  <div id="departmentModal" class="modal">
    <div class="modal-content">
      <span class="close-btn" id="closeModal">&times;</span>
      <h2 id="modalTitle">Add Department</h2>
      <form id="departmentForm">
        <label for="deptName">Department Name:</label>
        <input type="text" id="deptName" name="deptName" required>

        <button type="submit" class="btn">Save</button>
      </form>
    </div>
  </div>
</main>

<script>
// Print functionality for Departments
document.addEventListener('DOMContentLoaded', function() {
  const printBtn = document.getElementById('btnPrintDepartments');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      const printArea = document.getElementById('printArea');
      
      // Create print content
      const printContent = `
        <html>
          <head>
            <title>Departments Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              h1 { color: #333; margin-bottom: 10px; }
              .report-date { color: #666; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>Departments Report</h1>
            <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
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
});
</script>