<!-- User Dashboard Content -->
<main>
  <div class="head-title">
    <div class="left">
      <h1>My Dashboard</h1>
      <ul class="breadcrumb">
        <li>
          <a href="#">Dashboard</a>
        </li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li>
          <a class="active" href="#">My Profile</a>
        </li>
      </ul>
    </div>
    <a href="#" class="btn-download">
      <i class='bx bxs-download'></i>
      <span class="text">Download Report</span>
    </a>
  </div>

  <!-- Announcements Section -->
  <div class="announcements-container">
    <div class="announcements-header">
      <h3><i class='bx bxs-megaphone'></i> Latest Announcements</h3>
      <button class="announcement-toggle" onclick="toggleAnnouncements()">
        <i class='bx bx-chevron-down'></i>
      </button>
    </div>
    <div class="announcements-content" id="announcementsContent">
      <div class="announcement-item urgent">
        <div class="announcement-icon">
          <i class='bx bxs-error-circle'></i>
        </div>
        <div class="announcement-details">
          <h4>Important: New Dress Code Policy</h4>
          <p>Effective immediately, all students must wear proper uniform and footwear. ID cards are mandatory at all times.</p>
          <span class="announcement-time">2 hours ago</span>
        </div>
        <div class="announcement-actions">
          <button class="btn-read-more">Read More</button>
        </div>
      </div>
      
      <div class="announcement-item">
        <div class="announcement-icon">
          <i class='bx bxs-info-circle'></i>
        </div>
        <div class="announcement-details">
          <h4>ID Card Replacement Schedule</h4>
          <p>Students who have lost their ID cards can get replacements every Tuesday and Thursday from 9 AM to 3 PM.</p>
          <span class="announcement-time">1 day ago</span>
        </div>
        <div class="announcement-actions">
          <button class="btn-read-more">Read More</button>
        </div>
      </div>
      
      <div class="announcement-item">
        <div class="announcement-icon">
          <i class='bx bxs-bell'></i>
        </div>
        <div class="announcement-details">
          <h4>Uniform Guidelines Update</h4>
          <p>Please ensure your uniform is clean, properly fitted, and follows the school's dress code standards.</p>
          <span class="announcement-time">3 days ago</span>
        </div>
        <div class="announcement-actions">
          <button class="btn-read-more">Read More</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Personal Stats -->
  <ul class="box-info">
    <li>
      <i class='bx bxs-user-check'></i>
      <span class="text">
        <h3>0</h3>
        <p>Active Violations</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-calendar-check'></i>
      <span class="text">
        <h3>3</h3>
        <p>Total Violations</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-shield-check'></i>
      <span class="text">
        <h3>Good</h3>
        <p>Permitted</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-time'></i>
      <span class="text">
        <h3>7</h3>
        <p>Days Clean</p>
      </span>
    </li>
  </ul>

  <!-- My Violations Section -->
  <div class="table-data">
    <div class="my-violations">
      <div class="head">
        <h3>My Violations</h3>
        <i class='bx bx-refresh'></i>
        <i class='bx bx-filter'></i>
      </div>
      <div class="violation-summary">
        <div class="violation-type">
          <div class="violation-icon improper-uniform">
            <i class='bx bxs-t-shirt'></i>
          </div>
          <div class="violation-details">
            <h4>Improper Uniform</h4>
            <p>Violations: <span class="count">1</span></p>
            <span class="last-violation">Last: 2 weeks ago</span>
          </div>
          <div class="violation-status">
            <span class="status resolved">Permitted</span>
          </div>
        </div>

        <div class="violation-type">
          <div class="violation-icon improper-footwear">
            <i class='bx bxs-shoe'></i>
          </div>
          <div class="violation-details">
            <h4>Improper Footwear</h4>
            <p>Violations: <span class="count">1</span></p>
            <span class="last-violation">Last: 1 month ago</span>
          </div>
          <div class="violation-status">
            <span class="status resolved">Permitted</span>
          </div>
        </div>

        <div class="violation-type">
          <div class="violation-icon no-id">
            <i class='bx bxs-id-card'></i>
          </div>
          <div class="violation-details">
            <h4>No ID Card</h4>
            <p>Violations: <span class="count">1</span></p>
            <span class="last-violation">Last: 3 weeks ago</span>
          </div>
          <div class="violation-status">
            <span class="status resolved">Permitted</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Violations History -->
    <div class="violation-history">
      <div class="head">
        <h3>Recent Violations</h3>
        <i class='bx bx-search'></i>
        <i class='bx bx-filter'></i>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Violation Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-01-15</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-t-shirt'></i>
                <span>Improper Uniform</span>
              </div>
            </td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details">View Details</button>
            </td>
          </tr>
          <tr>
            <td>2023-12-20</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-shoe'></i>
                <span>Improper Footwear</span>
              </div>
            </td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details">View Details</button>
            </td>
          </tr>
          <tr>
            <td>2023-12-05</td>
            <td>
              <div class="violation-info">
                <i class='bx bxs-id-card'></i>
                <span>No ID Card</span>
              </div>
            </td>
            <td><span class="status resolved">Permitted</span></td>
            <td>
              <button class="btn-view-details">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Tips and Guidelines -->
  <div class="tips-container">
    <div class="tips-header">
      <h3><i class='bx bxs-lightbulb'></i> Tips to Avoid Violations</h3>
    </div>
    <div class="tips-content">
      <div class="tip-item">
        <div class="tip-icon">
          <i class='bx bxs-t-shirt'></i>
        </div>
        <div class="tip-details">
          <h4>Proper Uniform</h4>
          <p>Always wear the complete school uniform with proper fit and cleanliness.</p>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">
          <i class='bx bxs-shoe'></i>
        </div>
        <div class="tip-details">
          <h4>Appropriate Footwear</h4>
          <p>Wear school-approved shoes that are clean and in good condition.</p>
        </div>
      </div>
      <div class="tip-item">
        <div class="tip-icon">
          <i class='bx bxs-id-card'></i>
        </div>
        <div class="tip-details">
          <h4>ID Card</h4>
          <p>Always carry your school ID card and display it when required.</p>
        </div>
      </div>
    </div>
  </div>
</main>
