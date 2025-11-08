<!-- My Violations Page -->
<main>
  <div class="head-title">
    <div class="left">
      <h1>My Violations</h1>
      <ul class="breadcrumb">
        <li>
          <a href="#">Dashboard</a>
        </li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li>
          <a class="active" href="#">My Violations</a>
        </li>
      </ul>
    </div>
    <a href="#" class="btn-download">
      <i class='bx bxs-download'></i>
      <span class="text">Download Report</span>
    </a>
  </div>

  <!-- Violation Summary Cards -->
  <ul class="box-info">
    <li>
      <i class='bx bxs-t-shirt'></i>
      <span class="text">
        <h3>1</h3>
        <p>Improper Uniform</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-shoe'></i>
      <span class="text">
        <h3>1</h3>
        <p>Improper Footwear</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-id-card'></i>
      <span class="text">
        <h3>1</h3>
        <p>No ID Card</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-calendar-check'></i>
      <span class="text">
        <h3>3</h3>
        <p>Total Violations</p>
      </span>
    </li>
  </ul>

  <!-- Violation History Table -->
  <div class="table-data">
    <div class="violation-history">
      <div class="head">
        <h3>Violation History</h3>
        <div class="filter-options">
          <select id="violationFilter">
            <option value="all">All Violations</option>
            <option value="improper_uniform">Improper Uniform</option>
            <option value="improper_footwear">Improper Footwear</option>
            <option value="no_id">No ID Card</option>
          </select>
          <select id="statusFilter">
            <option value="all">All Status</option>
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
            <option value="warning">Warning</option>
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Violation Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="violation-row" data-type="improper_uniform" data-status="resolved">
            <td>2024-01-15</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-t-shirt'></i>
                <span>Improper Uniform</span>
              </div>
            </td>
            <td>Wore non-school uniform shirt</td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details" onclick="viewViolationDetails(1)">View Details</button>
            </td>
          </tr>
          <tr class="violation-row" data-type="improper_footwear" data-status="resolved">
            <td>2023-12-20</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-shoe'></i>
                <span>Improper Footwear</span>
              </div>
            </td>
            <td>Wore non-school approved shoes</td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details" onclick="viewViolationDetails(2)">View Details</button>
            </td>
          </tr>
          <tr class="violation-row" data-type="no_id" data-status="resolved">
            <td>2023-12-05</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-id-card'></i>
                <span>No ID Card</span>
              </div>
            </td>
            <td>Failed to present school ID when requested</td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details" onclick="viewViolationDetails(3)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Violation Details Modal (Hidden by default) -->
  <div id="violationModal" class="modal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Violation Details</h3>
        <button class="modal-close" onclick="closeViolationModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="violation-detail">
          <div class="detail-row">
            <label>Date:</label>
            <span id="modalDate">-</span>
          </div>
          <div class="detail-row">
            <label>Type:</label>
            <span id="modalType">-</span>
          </div>
          <div class="detail-row">
            <label>Description:</label>
            <span id="modalDescription">-</span>
          </div>
          <div class="detail-row">
            <label>Status:</label>
            <span id="modalStatus">-</span>
          </div>
          <div class="detail-row">
            <label>Reported By:</label>
            <span id="modalReportedBy">-</span>
          </div>
          <div class="detail-row">
            <label>Resolution:</label>
            <span id="modalResolution">-</span>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-close" onclick="closeViolationModal()">Close</button>
      </div>
    </div>
  </div>
</main>

<script>
// Violation filtering functionality
document.addEventListener('DOMContentLoaded', function() {
  const violationFilter = document.getElementById('violationFilter');
  const statusFilter = document.getElementById('statusFilter');
  
  if (violationFilter) {
    violationFilter.addEventListener('change', filterViolations);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', filterViolations);
  }
});

function filterViolations() {
  const typeFilter = document.getElementById('violationFilter').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const rows = document.querySelectorAll('.violation-row');
  
  rows.forEach(row => {
    const rowType = row.getAttribute('data-type');
    const rowStatus = row.getAttribute('data-status');
    
    let showRow = true;
    
    if (typeFilter !== 'all' && rowType !== typeFilter) {
      showRow = false;
    }
    
    if (statusFilter !== 'all' && rowStatus !== statusFilter) {
      showRow = false;
    }
    
    row.style.display = showRow ? 'table-row' : 'none';
  });
}

// View violation details
function viewViolationDetails(violationId) {
  // Mock data - in real app, this would fetch from API
  const violationData = {
    1: {
      date: '2024-01-15',
      type: 'Improper Uniform',
      description: 'Wore non-school uniform shirt during school hours',
      status: 'Resolved',
      reportedBy: 'Security Guard - John Smith',
      resolution: 'Student was reminded of uniform policy and corrected the violation immediately.'
    },
    2: {
      date: '2023-12-20',
      type: 'Improper Footwear',
      description: 'Wore non-school approved shoes (sneakers)',
      status: 'Resolved',
      reportedBy: 'Teacher - Maria Garcia',
      resolution: 'Student was informed about proper footwear requirements and complied.'
    },
    3: {
      date: '2023-12-05',
      type: 'No ID Card',
      description: 'Failed to present school ID when requested by security',
      status: 'Resolved',
      reportedBy: 'Security Guard - Mike Johnson',
      resolution: 'Student was issued a temporary pass and reminded to always carry ID.'
    }
  };
  
  const data = violationData[violationId];
  if (data) {
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalType').textContent = data.type;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalStatus').textContent = data.status;
    document.getElementById('modalReportedBy').textContent = data.reportedBy;
    document.getElementById('modalResolution').textContent = data.resolution;
    
    document.getElementById('violationModal').style.display = 'block';
  }
}

function closeViolationModal() {
  document.getElementById('violationModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('violationModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}
</script>