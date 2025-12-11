<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reports | OSAS System</title>
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <link rel="stylesheet" href="../assets/styles/Report.css">
</head>
<body>
  
<!-- Reports.html -->
<main id="Reports-page">
  <!-- Theme Toggle Button -->
 

  <!-- HEADER -->
  <div class="Reports-head-title">
    <div class="Reports-left">
      <h1>Reports</h1>
      <p class="Reports-subtitle">Analytics and insights on student violations</p>
      <ul class="Reports-breadcrumb">
        <li><a href="#">Dashboard</a></li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li><a class="active" href="#">Reports Data</a></li>
      </ul>
    </div>

    <div class="Reports-header-actions">
      <div class="Reports-button-group">
        <button id="btnExportReports" class="Reports-btn outline small">
          <i class='bx bx-download'></i>
          <span>Export</span>
        </button>
        <button id="btnPrintReports" class="Reports-btn outline small">
          <i class='bx bx-printer'></i>
          <span>Print</span>
        </button>
        <button id="btnRefreshReports" class="Reports-btn outline small">
          <i class='bx bx-refresh'></i>
          <span>Refresh</span>
        </button>
      </div>
      <button id="btnGenerateReports" class="Reports-btn primary">
        <i class='bx bx-plus'></i> Generate Report
      </button>
    </div>
  </div>

  <!-- STATS CARDS -->
  <div class="Reports-stats-overview">
    <div class="Reports-stat-card">
      <div class="Reports-stat-icon">
        <i class='bx bx-bar-chart-alt'></i>
      </div>
      <div class="Reports-stat-content">
        <h3 class="Reports-stat-title">Total Violations</h3>
        <div class="Reports-stat-value" id="totalViolationsCount">158</div>
        <div class="Reports-stat-change positive">
          <i class='bx bx-up-arrow-alt'></i>
          <span>+12% this week</span>
        </div>
      </div>
    </div>

    <div class="Reports-stat-card">
      <div class="Reports-stat-icon">
        <i class='bx bx-t-shirt'></i>
      </div>
      <div class="Reports-stat-content">
        <h3 class="Reports-stat-title">Uniform Violations</h3>
        <div class="Reports-stat-value" id="uniformViolations">74</div>
        <div class="Reports-stat-percentage">47%</div>
      </div>
    </div>

    <div class="Reports-stat-card">
      <div class="Reports-stat-icon">
        <i class='bx bx-walk'></i>
      </div>
      <div class="Reports-stat-content">
        <h3 class="Reports-stat-title">Footwear Violations</h3>
        <div class="Reports-stat-value" id="footwearViolations">48</div>
        <div class="Reports-stat-percentage">30%</div>
      </div>
    </div>

    <div class="Reports-stat-card">
      <div class="Reports-stat-icon">
        <i class='bx bx-id-card'></i>
      </div>
      <div class="Reports-stat-content">
        <h3 class="Reports-stat-title">No ID Violations</h3>
        <div class="Reports-stat-value" id="noIdViolations">36</div>
        <div class="Reports-stat-percentage">23%</div>
      </div>
    </div>
  </div>

  <!-- FILTERS CARD -->
  <div class="Reports-filter-card">
    <div class="filter-header">
      <h3><i class='bx bx-filter-alt'></i> Report Filters</h3>
      <button id="clearFilters" class="Reports-btn outline small">
        <i class='bx bx-x'></i> Clear All
      </button>
    </div>

    <div class="filter-grid">
      <div class="filter-group">
        <label for="ReportsDepartmentFilter">Department</label>
        <select id="ReportsDepartmentFilter" class="Reports-filter-select">
          <option value="all">All Departments</option>
          <option value="BSIS">BS Information System</option>
          <option value="WFT">Welding & Fabrication Tech</option>
          <option value="BTVTED">BTVTED</option>
          <option value="CHS">Computer Hardware Servicing</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ReportsSectionFilter">Section</label>
        <select id="ReportsSectionFilter" class="Reports-filter-select">
          <option value="all">All Sections</option>
          <option value="BSIS-1">BSIS-1</option>
          <option value="BSIS-2">BSIS-2</option>
          <option value="WFT-1">WFT-1</option>
          <option value="WFT-2">WFT-2</option>
          <option value="BTVTED-3">BTVTED-3</option>
          <option value="CHS-1">CHS-1</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ReportsStatusFilter">Status</label>
        <select id="ReportsStatusFilter" class="Reports-filter-select">
          <option value="all">All Status</option>
          <option value="permitted">Permitted</option>
          <option value="warning">Warning</option>
          <option value="disciplinary">Disciplinary</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="ReportsTimeFilter">Time Period</label>
        <select id="ReportsTimeFilter" class="Reports-filter-select">
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="this_year">This Year</option>
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_30_days">Last 30 Days</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <div class="filter-group date-range-group" id="dateRangeGroup" style="display: none;">
        <label>Date Range</label>
        <div class="date-range-inputs">
          <div class="date-input">
            <i class='bx bx-calendar'></i>
            <input type="date" id="ReportsStart" name="ReportsStart">
          </div>
          <span class="date-separator">to</span>
          <div class="date-input">
            <i class='bx bx-calendar'></i>
            <input type="date" id="ReportsEnd" name="ReportsEnd">
          </div>
        </div>
      </div>

      <div class="filter-group">
        <label for="ReportsSortBy">Sort By</label>
        <select id="ReportsSortBy" class="Reports-filter-select">
          <option value="total_desc">Total Violations (High to Low)</option>
          <option value="total_asc">Total Violations (Low to High)</option>
          <option value="name_asc">Name (A to Z)</option>
          <option value="name_desc">Name (Z to A)</option>
          <option value="dept_asc">Department (A to Z)</option>
          <option value="section_asc">Section (A to Z)</option>
        </select>
      </div>
    </div>

    <div class="filter-actions">
      <button id="applyFilters" class="Reports-btn primary small">
        <i class='bx bx-check'></i> Apply Filters
      </button>
      <button id="resetFilters" class="Reports-btn outline small">
        <i class='bx bx-reset'></i> Reset
      </button>
    </div>
  </div>

  <!-- MAIN CONTENT CARD -->
  <div class="Reports-content-card">
    <!-- Table Header -->
    <div class="Reports-table-header">
      <div class="Reports-header-left">
        <h2 class="Reports-table-title">Detailed Report</h2>
        <p class="Reports-table-subtitle">Student violation statistics and analysis</p>
      </div>

      <div class="Reports-header-right">
        <div class="Reports-search-box">
          <i class='bx bx-search'></i>
          <input type="text" id="searchReport" placeholder="Search reports...">
        </div>

        <div class="Reports-view-options">
          <button class="Reports-view-btn active" data-view="table" title="Table View">
            <i class='bx bx-table'></i>
          </button>
          <button class="Reports-view-btn" data-view="grid" title="Grid View">
            <i class='bx bx-grid-alt'></i>
          </button>
          <button class="Reports-view-btn" data-view="cards" title="Card View">
            <i class='bx bx-card'></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Reports Table -->
    <div class="Reports-table-container">
      <table class="Reports-table">
        <thead>
          <tr>
            <th class="Reports-sortable" data-sort="id">
              <div class="Reports-table-header-content">
                <span>Report ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Student Info</th>
            <th class="Reports-sortable" data-sort="department">
              <div class="Reports-table-header-content">
                <span>Department</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Reports-sortable" data-sort="section">
              <div class="Reports-table-header-content">
                <span>Section</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Reports-sortable" data-sort="uniform">
              <div class="Reports-table-header-content">
                <span>Improper Uniform</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Reports-sortable" data-sort="footwear">
              <div class="Reports-table-header-content">
                <span>Improper Footwear</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Reports-sortable" data-sort="idCount">
              <div class="Reports-table-header-content">
                <span>No ID</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th class="Reports-sortable" data-sort="total">
              <div class="Reports-table-header-content">
                <span>Total Violations</span>
                <i class='bx bx-sort'></i>
              </div>
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody id="ReportsTableBody">
          <tr>
            <td class="report-id">R001</td>
            <td class="report-student-info">
              <div class="student-info-wrapper">
                <div class="student-avatar">
                  <img src="https://ui-avatars.com/api/?name=John+Doe&background=ff6b6b&color=fff&size=40" alt="John Doe">
                </div>
                <div class="student-details">
                  <strong>John Doe</strong>
                  <small>2024-001 • 09171234567</small>
                </div>
              </div>
            </td>
            <td class="report-dept">
              <span class="dept-badge bsis">BS Information System</span>
            </td>
            <td class="report-section">BSIS-1</td>
            <td class="violation-count uniform">
              <div class="count-badge high">3</div>
            </td>
            <td class="violation-count footwear">
              <div class="count-badge medium">2</div>
            </td>
            <td class="violation-count no-id">
              <div class="count-badge low">1</div>
            </td>
            <td class="total-violations">
              <div class="total-badge">6</div>
            </td>
            <td>
              <span class="Reports-status-badge disciplinary">Disciplinary Action</span>
            </td>
            <td>
              <div class="Reports-action-buttons">
                <button class="Reports-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Reports-action-btn export" title="Export Report">
                  <i class='bx bx-download'></i>
                </button>
                <button class="Reports-action-btn print" title="Print Report">
                  <i class='bx bx-printer'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="report-id">R002</td>
            <td class="report-student-info">
              <div class="student-info-wrapper">
                <div class="student-avatar">
                  <img src="https://ui-avatars.com/api/?name=Maria+Santos&background=1dd1a1&color=fff&size=40" alt="Maria Santos">
                </div>
                <div class="student-details">
                  <strong>Maria Santos</strong>
                  <small>2024-002 • 09179876543</small>
                </div>
              </div>
            </td>
            <td class="report-dept">
              <span class="dept-badge wft">Welding & Fabrication Tech</span>
            </td>
            <td class="report-section">WFT-2</td>
            <td class="violation-count uniform">
              <div class="count-badge medium">2</div>
            </td>
            <td class="violation-count footwear">
              <div class="count-badge low">1</div>
            </td>
            <td class="violation-count no-id">
              <div class="count-badge low">1</div>
            </td>
            <td class="total-violations">
              <div class="total-badge">4</div>
            </td>
            <td>
              <span class="Reports-status-badge permitted">Permitted</span>
            </td>
            <td>
              <div class="Reports-action-buttons">
                <button class="Reports-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Reports-action-btn export" title="Export Report">
                  <i class='bx bx-download'></i>
                </button>
                <button class="Reports-action-btn print" title="Print Report">
                  <i class='bx bx-printer'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="report-id">R003</td>
            <td class="report-student-info">
              <div class="student-info-wrapper">
                <div class="student-avatar">
                  <img src="https://ui-avatars.com/api/?name=Pedro+Reyes&background=54a0ff&color=fff&size=40" alt="Pedro Reyes">
                </div>
                <div class="student-details">
                  <strong>Pedro Reyes</strong>
                  <small>2024-003 • 09171239876</small>
                </div>
              </div>
            </td>
            <td class="report-dept">
              <span class="dept-badge btvted">BTVTED</span>
            </td>
            <td class="report-section">BTVTED-3</td>
            <td class="violation-count uniform">
              <div class="count-badge low">1</div>
            </td>
            <td class="violation-count footwear">
              <div class="count-badge none">0</div>
            </td>
            <td class="violation-count no-id">
              <div class="count-badge medium">2</div>
            </td>
            <td class="total-violations">
              <div class="total-badge">3</div>
            </td>
            <td>
              <span class="Reports-status-badge permitted">Permitted</span>
            </td>
            <td>
              <div class="Reports-action-buttons">
                <button class="Reports-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Reports-action-btn export" title="Export Report">
                  <i class='bx bx-download'></i>
                </button>
                <button class="Reports-action-btn print" title="Print Report">
                  <i class='bx bx-printer'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="report-id">R004</td>
            <td class="report-student-info">
              <div class="student-info-wrapper">
                <div class="student-avatar">
                  <img src="https://ui-avatars.com/api/?name=Anna+Lopez&background=feca57&color=fff&size=40" alt="Anna Lopez">
                </div>
                <div class="student-details">
                  <strong>Anna Lopez</strong>
                  <small>2024-004 • 09174563218</small>
                </div>
              </div>
            </td>
            <td class="report-dept">
              <span class="dept-badge chs">Computer Hardware Servicing</span>
            </td>
            <td class="report-section">CHS-1</td>
            <td class="violation-count uniform">
              <div class="count-badge none">0</div>
            </td>
            <td class="violation-count footwear">
              <div class="count-badge low">1</div>
            </td>
            <td class="violation-count no-id">
              <div class="count-badge low">1</div>
            </td>
            <td class="total-violations">
              <div class="total-badge">2</div>
            </td>
            <td>
              <span class="Reports-status-badge warning">Warning</span>
            </td>
            <td>
              <div class="Reports-action-buttons">
                <button class="Reports-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Reports-action-btn export" title="Export Report">
                  <i class='bx bx-download'></i>
                </button>
                <button class="Reports-action-btn print" title="Print Report">
                  <i class='bx bx-printer'></i>
                </button>
              </div>
            </td>
          </tr>

          <tr>
            <td class="report-id">R005</td>
            <td class="report-student-info">
              <div class="student-info-wrapper">
                <div class="student-avatar">
                  <img src="https://ui-avatars.com/api/?name=Chris+Lim&background=ff6b6b&color=fff&size=40" alt="Chris Lim">
                </div>
                <div class="student-details">
                  <strong>Chris Lim</strong>
                  <small>2024-005 • 09175678901</small>
                </div>
              </div>
            </td>
            <td class="report-dept">
              <span class="dept-badge bsis">BS Information System</span>
            </td>
            <td class="report-section">BSIS-1</td>
            <td class="violation-count uniform">
              <div class="count-badge high">3</div>
            </td>
            <td class="violation-count footwear">
              <div class="count-badge none">0</div>
            </td>
            <td class="violation-count no-id">
              <div class="count-badge none">0</div>
            </td>
            <td class="total-violations">
              <div class="total-badge">3</div>
            </td>
            <td>
              <span class="Reports-status-badge warning">Warning</span>
            </td>
            <td>
              <div class="Reports-action-buttons">
                <button class="Reports-action-btn view" title="View Details">
                  <i class='bx bx-show'></i>
                </button>
                <button class="Reports-action-btn export" title="Export Report">
                  <i class='bx bx-download'></i>
                </button>
                <button class="Reports-action-btn print" title="Print Report">
                  <i class='bx bx-printer'></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Table Footer -->
    <div class="Reports-table-footer">
      <div class="Reports-footer-info">
        <div class="summary-stats">
          <span class="stat-item">
            <strong>Total Students:</strong> 5
          </span>
          <span class="stat-item">
            <strong>Total Violations:</strong> 18
          </span>
          <span class="stat-item">
            <strong>Avg per Student:</strong> 3.6
          </span>
        </div>
        <div class="pagination-info">
          Showing <span id="showingReportsCount">5</span> of <span id="totalReportsCount">158</span> records
        </div>
      </div>
      <div class="Reports-pagination">
        <button class="Reports-pagination-btn" disabled>
          <i class='bx bx-chevron-left'></i>
        </button>
        <button class="Reports-pagination-btn active">1</button>
        <button class="Reports-pagination-btn">2</button>
        <button class="Reports-pagination-btn">3</button>
        <button class="Reports-pagination-btn">4</button>
        <button class="Reports-pagination-btn">5</button>
        <button class="Reports-pagination-btn">
          <i class='bx bx-chevron-right'></i>
        </button>
      </div>
    </div>
  </div>

  <!-- GENERATE REPORT MODAL -->
  <div id="ReportsGenerateModal" class="Reports-modal">
    <div class="Reports-modal-overlay" id="ReportsModalOverlay"></div>
    <div class="Reports-modal-container">
      <div class="Reports-modal-header">
        <h2 id="ReportsModalTitle">Generate Custom Report</h2>
        <button class="Reports-close-btn" id="closeReportsModal">
          <i class='bx bx-x'></i>
        </button>
      </div>

      <form id="ReportsGenerateForm">
        <div class="Reports-form-group">
          <label for="reportName">Report Name</label>
          <input type="text" id="reportName" name="reportName" required placeholder="e.g., Monthly Violation Report - March 2024">
        </div>

        <div class="Reports-form-row">
          <div class="Reports-form-group">
            <label for="reportType">Report Type</label>
            <select id="reportType" name="reportType" required>
              <option value="">Select report type</option>
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="department">Department-wise Report</option>
              <option value="violation_type">Violation Type Report</option>
              <option value="time_series">Time Series Analysis</option>
            </select>
          </div>
          
          <div class="Reports-form-group">
            <label for="reportFormat">Format</label>
            <select id="reportFormat" name="reportFormat" required>
              <option value="">Select format</option>
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV File</option>
              <option value="html">HTML Report</option>
            </select>
          </div>
        </div>

        <div class="Reports-form-row">
          <div class="Reports-form-group">
            <label for="startDate">Start Date</label>
            <div class="date-input-wrapper">
              <i class='bx bx-calendar'></i>
              <input type="date" id="startDate" name="startDate" required>
            </div>
          </div>
          
          <div class="Reports-form-group">
            <label for="endDate">End Date</label>
            <div class="date-input-wrapper">
              <i class='bx bx-calendar'></i>
              <input type="date" id="endDate" name="endDate" required>
            </div>
          </div>
        </div>

        <div class="Reports-form-group">
          <label>Include Departments</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="departments" value="BSIS" checked>
              <span>BS Information System</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="departments" value="WFT" checked>
              <span>Welding & Fabrication Tech</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="departments" value="BTVTED" checked>
              <span>BTVTED</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="departments" value="CHS" checked>
              <span>Computer Hardware Servicing</span>
            </label>
          </div>
        </div>

        <div class="Reports-form-group">
          <label>Include Violation Types</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" name="violationTypes" value="uniform" checked>
              <span>Improper Uniform</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="violationTypes" value="footwear" checked>
              <span>Improper Footwear</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" name="violationTypes" value="no_id" checked>
              <span>No ID</span>
            </label>
          </div>
        </div>

        <div class="Reports-form-group">
          <label for="includeCharts">Include Charts & Graphs</label>
          <div class="toggle-switch">
            <input type="checkbox" id="includeCharts" name="includeCharts" checked>
            <label for="includeCharts" class="toggle-label">
              <span class="toggle-handle"></span>
            </label>
          </div>
        </div>

        <div class="Reports-form-group">
          <label for="reportNotes">Additional Notes (Optional)</label>
          <textarea id="reportNotes" name="reportNotes" rows="3" placeholder="Add any additional instructions or notes for the report..."></textarea>
        </div>

        <div class="Reports-form-actions">
          <button type="button" class="Reports-btn-outline" id="cancelReportsModal">Cancel</button>
          <button type="submit" class="Reports-btn-primary">
            <i class='bx bx-file'></i> Generate Report
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- REPORT DETAILS MODAL -->
  <div id="ReportDetailsModal" class="Reports-modal">
    <div class="Reports-modal-overlay" id="DetailsModalOverlay"></div>
    <div class="Reports-modal-container wide">
      <div class="Reports-modal-header">
        <h2>Report Details</h2>
        <div class="modal-actions">
          <button class="Reports-action-btn export">
            <i class='bx bx-download'></i> Export
          </button>
          <button class="Reports-action-btn print">
            <i class='bx bx-printer'></i> Print
          </button>
          <button class="Reports-close-btn" id="closeDetailsModal">
            <i class='bx bx-x'></i>
          </button>
        </div>
      </div>

      <div class="report-details-content">
        <!-- Report Header -->
        <div class="report-header">
          <h3>Student Violation Analysis Report</h3>
          <div class="report-meta">
            <span class="report-id">Report ID: R001</span>
            <span class="report-date">Generated: March 15, 2024 • 14:30 PM</span>
            <span class="report-status active">Active</span>
          </div>
        </div>

        <!-- Student Info Section -->
        <div class="report-student-section">
          <h4>Student Information</h4>
          <div class="student-info-grid">
            <div class="info-item">
              <span class="info-label">Student Name:</span>
              <span class="info-value">John Doe</span>
            </div>
            <div class="info-item">
              <span class="info-label">Student ID:</span>
              <span class="info-value">2024-001</span>
            </div>
            <div class="info-item">
              <span class="info-label">Department:</span>
              <span class="info-value">BS Information System</span>
            </div>
            <div class="info-item">
              <span class="info-label">Section:</span>
              <span class="info-value">BSIS-1</span>
            </div>
            <div class="info-item">
              <span class="info-label">Contact No:</span>
              <span class="info-value">09171234567</span>
            </div>
            <div class="info-item">
              <span class="info-label">Report Period:</span>
              <span class="info-value">Jan 1, 2024 - Mar 15, 2024</span>
            </div>
          </div>
        </div>

        <!-- Violation Statistics -->
        <div class="violation-statistics">
          <h4>Violation Statistics</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class='bx bx-t-shirt'></i>
              </div>
              <div class="stat-content">
                <span class="stat-title">Uniform Violations</span>
                <span class="stat-value">3</span>
                <span class="stat-trend up">+1 this month</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class='bx bx-walk'></i>
              </div>
              <div class="stat-content">
                <span class="stat-title">Footwear Violations</span>
                <span class="stat-value">2</span>
                <span class="stat-trend neutral">No change</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class='bx bx-id-card'></i>
              </div>
              <div class="stat-content">
                <span class="stat-title">No ID Violations</span>
                <span class="stat-value">1</span>
                <span class="stat-trend down">-1 this month</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">
                <i class='bx bx-bar-chart-alt'></i>
              </div>
              <div class="stat-content">
                <span class="stat-title">Total Violations</span>
                <span class="stat-value">6</span>
                <span class="stat-trend up">+2 this month</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Violation History -->
        <div class="violation-history">
          <h4>Violation Timeline</h4>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-date">Mar 15, 2024</div>
              <div class="timeline-content">
                <span class="timeline-title">Improper Uniform - Warning 3</span>
                <span class="timeline-desc">Third offense for improper uniform</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Mar 1, 2024</div>
              <div class="timeline-content">
                <span class="timeline-title">Improper Footwear - Warning 2</span>
                <span class="timeline-desc">Second offense for improper footwear</span>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-date">Feb 15, 2024</div>
              <div class="timeline-content">
                <span class="timeline-title">No ID - Warning 1</span>
                <span class="timeline-desc">First offense for not wearing ID</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="report-recommendations">
          <h4>Recommendations</h4>
          <div class="recommendations-list">
            <div class="recommendation-item">
              <i class='bx bx-check-circle'></i>
              <span>Schedule counseling session with student</span>
            </div>
            <div class="recommendation-item">
              <i class='bx bx-check-circle'></i>
              <span>Notify parents about disciplinary status</span>
            </div>
            <div class="recommendation-item">
              <i class='bx bx-check-circle'></i>
              <span>Monitor student for next 30 days</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="report-details-actions">
          <button class="Reports-btn-outline">
            <i class='bx bx-edit'></i> Edit Report
          </button>
          <button class="Reports-btn-primary">
            <i class='bx bx-share-alt'></i> Share Report
          </button>
          <button class="Reports-btn-secondary">
            <i class='bx bx-download'></i> Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div class="Reports-empty-state" id="ReportsEmptyState" style="display: none;">
    <div class="Reports-empty-icon">
      <i class='bx bx-bar-chart-alt'></i>
    </div>
    <h3>No Reports Generated</h3>
    <p>Generate your first report to view analytics and insights</p>
    <button class="Reports-btn-primary" id="btnGenerateFirstReport">
      <i class='bx bx-plus'></i> Generate First Report
    </button>
  </div>

</main>

</body>
</html>