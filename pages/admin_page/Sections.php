<!-- section.html -->
<main id="sections-page"> 
  <div class="sections-head-title">
    <div class="sections-left">
      <h1>Sections</h1>
      <ul class="sections-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Sections</a></li>
      </ul>
    </div>

    <div class="sections-header-actions">
      <button id="btnAddSection" class="sections-btn">
        <i class='bx bx-plus'></i> Add Section
      </button>
      <button id="btnPrintSection" class="sections-btn">
        <i class='bx bx-printer'></i> Print
      </button>
    </div>
  </div>

  <div class="sections-filter-container">
    <label for="sectionFilterSelect">Filter:</label>
    <select id="sectionFilterSelect">
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="archived">Archived</option>
    </select>
  </div>

  <div id="sectionsPrintArea" class="sections-table-container">
    <table class="sections-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Section Name</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody id="sectionsTableBody">
        <!-- JS will populate -->
      </tbody>
    </table>
  </div>

  <!-- Modal -->
  <div id="sectionsModal" class="sections-modal">
    <div class="sections-modal-content">
      <span class="sections-close-btn" id="closeSectionsModal">&times;</span>
      <h2 id="sectionsModalTitle">Add Section</h2>

      <form id="sectionsForm">
        <label for="sectionsNameInput">Section Name:</label>
        <input type="text" id="sectionsNameInput" name="sectionsNameInput" required>
        <button type="submit" class="sections-btn">Save</button>
      </form>
    </div>
  </div>
</main>

<script>
// SECTION PRINT FUNCTION
document.addEventListener("DOMContentLoaded", () => {
  const printBtn = document.getElementById("btnPrintSection");
  if (!printBtn) return;

  printBtn.addEventListener("click", () => {
    const printArea = document.getElementById("sectionsPrintArea");

    const printContent = `
      <html>
        <head>
          <title>Sections Report</title>
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
          <h1>Sections Report</h1>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
          ${printArea.innerHTML}
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  });
});
</script>
