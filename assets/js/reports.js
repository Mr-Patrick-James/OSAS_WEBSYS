// Reports Module
let reportsData = {
  totalViolations: 45,
  affectedStudents: 32,
  departments: 4,
  trend: 12,
  departmentAnalysis: [
    {
      department: 'BSIS',
      totalViolations: 15,
      improperUniform: 8,
      improperFootwear: 4,
      noId: 3,
      mostCommon: 'improper_uniform',
      trend: 12
    },
    {
      department: 'WFT',
      totalViolations: 12,
      improperUniform: 5,
      improperFootwear: 6,
      noId: 1,
      mostCommon: 'improper_footwear',
      trend: -8
    },
    {
      department: 'BTVTED',
      totalViolations: 8,
      improperUniform: 3,
      improperFootwear: 2,
      noId: 3,
      mostCommon: 'no_id',
      trend: 0
    },
    {
      department: 'CHS',
      totalViolations: 10,
      improperUniform: 4,
      improperFootwear: 3,
      noId: 3,
      mostCommon: 'improper_uniform',
      trend: 5
    }
  ]
};

function initReportsModule() {
  console.log('🛠 Initializing Reports module...');

  // Initialize elements
  const btnGenerateReport = document.getElementById('btnGenerateReport');
  const btnExportReport = document.getElementById('btnExportReport');
  const refreshBtn = document.getElementById('refreshReportsBtn');
  const exportBtn = document.getElementById('exportReportsBtn');

  // Filter elements
  const reportTypeFilter = document.getElementById('reportTypeFilter');
  const dateRangeFilter = document.getElementById('dateRangeFilter');
  const departmentFilter = document.getElementById('departmentFilter');
  const violationTypeFilter = document.getElementById('violationTypeFilter');

  if (!btnGenerateReport) {
    console.error('❗ Reports module elements not found!');
    return;
  }

  // Initialize data
  loadReportsData();
  updateStatistics();
  initializeCharts();

  // Event listeners
  btnGenerateReport.addEventListener('click', generateReport);
  btnExportReport.addEventListener('click', exportReport);
  refreshBtn.addEventListener('click', refreshReports);
  exportBtn.addEventListener('click', exportReport);

  // Filter event listeners
  if (reportTypeFilter) {
    reportTypeFilter.addEventListener('change', filterReports);
  }
  if (dateRangeFilter) {
    dateRangeFilter.addEventListener('change', filterReports);
  }
  if (departmentFilter) {
    departmentFilter.addEventListener('change', filterReports);
  }
  if (violationTypeFilter) {
    violationTypeFilter.addEventListener('change', filterReports);
  }

  console.log('✅ Reports module ready!');
}

// Load reports data
function loadReportsData() {
  const tbody = document.getElementById('reportsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  reportsData.departmentAnalysis.forEach(dept => {
    const row = createDepartmentRow(dept);
    tbody.appendChild(row);
  });
}

// Create department analysis row
function createDepartmentRow(dept) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>
      <div class="department-info">
        <i class='bx bxs-${getDepartmentIcon(dept.department)}'></i>
        <span>${dept.department}</span>
      </div>
    </td>
    <td><span class="count-badge">${dept.totalViolations}</span></td>
    <td><span class="count-badge uniform">${dept.improperUniform}</span></td>
    <td><span class="count-badge footwear">${dept.improperFootwear}</span></td>
    <td><span class="count-badge no-id">${dept.noId}</span></td>
    <td><span class="violation-type ${dept.mostCommon}">${getViolationTypeName(dept.mostCommon)}</span></td>
    <td><span class="trend ${getTrendClass(dept.trend)}">${getTrendSymbol(dept.trend)} ${dept.trend > 0 ? '+' : ''}${dept.trend}%</span></td>
  `;
  return row;
}

// Helper functions
function getDepartmentIcon(department) {
  const icons = {
    'BSIS': 'laptop',
    'WFT': 'code-alt',
    'BTVTED': 'graduation',
    'CHS': 'health'
  };
  return icons[department] || 'building';
}

function getViolationTypeName(type) {
  const names = {
    'improper_uniform': 'Improper Uniform',
    'improper_footwear': 'Improper Footwear',
    'no_id': 'No ID Card'
  };
  return names[type] || type;
}

function getTrendClass(trend) {
  if (trend > 0) return 'up';
  if (trend < 0) return 'down';
  return 'stable';
}

function getTrendSymbol(trend) {
  if (trend > 0) return '↗';
  if (trend < 0) return '↘';
  return '→';
}

// Statistics functions
function updateStatistics() {
  const totalViolationsEl = document.getElementById('totalViolations');
  const affectedStudentsEl = document.getElementById('affectedStudents');
  const departmentsEl = document.getElementById('departments');
  const trendEl = document.getElementById('trend');

  if (totalViolationsEl) totalViolationsEl.textContent = reportsData.totalViolations;
  if (affectedStudentsEl) affectedStudentsEl.textContent = reportsData.affectedStudents;
  if (departmentsEl) departmentsEl.textContent = reportsData.departments;
  if (trendEl) trendEl.textContent = `${reportsData.trend > 0 ? '+' : ''}${reportsData.trend}%`;
}

// Chart initialization
function initializeCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js is not loaded');
    return;
  }

  // Violation Types Pie Chart
  const violationTypesCtx = document.getElementById('violationTypesChart');
  if (violationTypesCtx) {
    new Chart(violationTypesCtx, {
      type: 'pie',
      data: {
        labels: ['Improper Uniform', 'Improper Footwear', 'No ID Card'],
        datasets: [{
          data: [20, 15, 10],
          backgroundColor: [
            '#FFD700',
            '#FFCE26',
            '#FD7238'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  // Monthly Trends Line Chart
  const monthlyTrendsCtx = document.getElementById('monthlyTrendsChart');
  if (monthlyTrendsCtx) {
    new Chart(monthlyTrendsCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Violations',
          data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 28, 24, 20],
          borderColor: '#FFD700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: '#FFD700',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    });
  }
}

// Filter functions
function filterReports() {
  const reportType = document.getElementById('reportTypeFilter')?.value || 'violation_summary';
  const dateRange = document.getElementById('dateRangeFilter')?.value || 'last_month';
  const department = document.getElementById('departmentFilter')?.value || 'all';
  const violationType = document.getElementById('violationTypeFilter')?.value || 'all';

  showNotification(`Filtering reports: ${reportType} for ${dateRange}`, 'info');
  
  // Here you can implement actual filtering logic
  loadReportsData();
}

// Action functions
function generateReport() {
  showNotification('Generating report...', 'info');
  
  // Simulate report generation
  setTimeout(() => {
    showNotification('Report generated successfully!', 'success');
  }, 2000);
}

function exportReport() {
  showNotification('Exporting report...', 'info');
  
  // Simulate export
  setTimeout(() => {
    showNotification('Report exported successfully!', 'success');
  }, 1500);
}

function refreshReports() {
  showNotification('Refreshing reports data...', 'info');
  loadReportsData();
  updateStatistics();
  initializeCharts();
}

// Notification function
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification-toast notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class='bx ${getNotificationIcon(type)}'></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" onclick="this.parentElement.remove()">
      <i class='bx bx-x'></i>
    </button>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'bx-check-circle',
    error: 'bx-error-circle',
    warning: 'bx-error',
    info: 'bx-info-circle'
  };
  return icons[type] || icons.info;
}
