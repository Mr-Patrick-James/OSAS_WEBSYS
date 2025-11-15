<!-- dashboardContent.html -->
<main>
  <div class="head-title">
    <div class="left">
      <h1>Dashboard</h1>
      <ul class="breadcrumb">
        <li>
          <a href="#">Dashboard</a>
        </li>
        <li><i class='bx bx-chevron-right'></i></li>
        <li>
          <a class="active" href="#">Home</a>
        </li>
      </ul>
    </div>
    <a href="#" class="btn-download">
      <i class='bx bxs-cloud-download'></i>
      <span class="text">Export PDF</span>
    </a>
  </div>

  <!-- Announcements Section -->
  <div class="announcements-container">
    <div class="announcements-header">
      <h3><i class='bx bxs-megaphone'></i> Latest Announcements</h3>
      <div class="header-actions">
        <button id="addAnnouncementBtn" class="btn-add" onclick="openAddModal()">
          <i class='bx bx-plus'></i> Add Announcement
        </button>
        <button class="announcement-toggle" onclick="toggleAnnouncements()">
          <i class='bx bx-chevron-down'></i>
        </button>
      </div>
    </div>

    <div class="announcements-content" id="announcementsContent">
      <div class="announcement-item urgent">
        <div class="announcement-icon">
          <i class='bx bxs-error-circle'></i>
        </div>
        <div class="announcement-details">
          <h4>Important: New Violation Policies</h4>
          <p>Effective immediately, new disciplinary policies have been implemented. Please review the updated
            guidelines.</p>
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
          <h4>Violation Exemption</h4>
          <p>Students are allowed to wear a plain white T-shirt tomorrow due to extreme heat conditions. Regular dress
            code will resume the following day.</p>
          <span class="announcement-time">1 hour ago</span>
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
          <h4>Violation Exemption</h4>
          <p>Due to continuous rain, students are temporarily allowed to wear slippers and bring jackets for comfort.
            Please return to proper uniform once the weather improves.</p>
          <span class="announcement-time">3 hours ago</span>
        </div>
        <div class="announcement-actions">
          <button class="btn-read-more">Read More</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Announcement Modal -->
  <div id="addAnnouncementModal" class="modal" aria-hidden="true">
    <div class="modal-backdrop" onclick="closeAddModal()"></div>
    <div class="modal-panel" role="dialog" aria-modal="true">
      <header class="modal-header">
        <h3><i class='bx bxs-megaphone'></i> Add New Announcement</h3>
        <button class="modal-close" onclick="closeAddModal()">&times;</button>
      </header>

      <form id="addAnnForm" onsubmit="event.preventDefault(); addAnnouncement();">
        <label>Title
          <input type="text" id="annTitle" placeholder="Announcement title" required />
        </label>

        <label>Message
          <textarea id="annMessage" placeholder="Write your announcement..." rows="3" required></textarea>
        </label>

        <label>Type
          <select id="annType">
            <option value="info">Info</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" onclick="closeAddModal()">Cancel</button>
          <button type="submit" class="btn-submit">Publish</button>
        </div>
      </form>
    </div>
  </div>


  <ul class="box-info">
    <li>
      <i class='bx bxs-calendar-check'></i>
      <span class="text">
        <h3>10</h3>
        <p>Violators</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-group'></i>
      <span class="text">
        <h3>2834</h3>
        <p>Students</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-building'></i>
      <span class="text">
        <h3>4</h3>
        <p>Departments</p>
      </span>
    </li>
    <li>
      <i class='bx bxs-error-circle penalty-icon'></i>
      <span class="text">
        <h3>43</h3>
        <p>Penalties</p>
      </span>
    </li>
  </ul>

  <!-- Charts Section -->
  <div class="charts-container">
    <div class="chart-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3>Violation Types Distribution</h3>
          <i class='bx bx-pie-chart-alt-2'></i>
        </div>
        <div class="chart-container">
          <canvas id="violationTypesChart"></canvas>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-header">
          <h3>Violations by Department</h3>
          <i class='bx bx-bar-chart-alt-2'></i>
        </div>
        <div class="chart-container">
          <canvas id="departmentViolationsChart"></canvas>
        </div>
      </div>
    </div>

    <div class="chart-section">
      <div class="chart-card full-width">
        <div class="chart-header">
          <h3>Monthly Violation</h3>
          <i class='bx bx-line-chart'></i>
        </div>
        <div class="chart-container">
          <canvas id="monthlyTrendsChart"></canvas>
        </div>
      </div>
    </div>
  </div>

  <div class="table-data">
    <div class="order">
      <div class="head">
        <h3>Recent Violators</h3>
        <i class='bx bx-search'></i>
        <i class='bx bx-filter'></i>
      </div>
      <table>
        <thead>
          <tr>
            <th>Violator</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="../assets/img/default.png" alt="Violator Image">
              <p>Some One Else</p>
            </td>
            <td>01-10-2021</td>
            <td><span class="status completed">Permitted</span></td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/default.png" alt="Violator Image">
              <p>Some One Else</p>
            </td>
            <td>01-10-2021</td>
            <td><span class="status pending">Permitted</span></td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/default.png" alt="Violator Image">
              <p>Some One Else</p>
            </td>
            <td>01-10-2021</td>
            <td><span class="status process">Warning</span></td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/default.png" alt="Violator Image">
              <p>Some One Else</p>
            </td>
            <td>01-10-2021</td>
            <td><span class="status pending">Permitted</span></td>
          </tr>
          <tr>
            <td>
              <img src="../assets/img/default.png" alt="Violator Image">
              <p>Some One Else</p>
            </td>
            <td>01-10-2021</td>
            <td><span class="status completed">Diciplinary Action</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="violators">
      <div class="head">
        <h3>Top Violators</h3>
        <i class='bx bx-refresh'></i>
        <i class='bx bx-filter'></i>
      </div>
      <ul class="violator-list">
        <li class="high-priority">
          <div class="violator-info">
            <span class="rank">1</span>
            <span class="name">Lebron James</span>
            <span class="violations">12 violations</span>
          </div>
          <i class='bx bx-chevron-right'></i>
        </li>
        <li class="high-priority">
          <div class="violator-info">
            <span class="rank">2</span>
            <span class="name">Manny Pacquiao</span>
            <span class="violations">9 violations</span>
          </div>
          <i class='bx bx-chevron-right'></i>
        </li>
        <li class="medium-priority">
          <div class="violator-info">
            <span class="rank">3</span>
            <span class="name">Jhony Died On Our Sins</span>
            <span class="violations">6 violations</span>
          </div>
          <i class='bx bx-chevron-right'></i>
        </li>
        <li class="medium-priority">
          <div class="violator-info">
            <span class="rank">4</span>
            <span class="name">Some One Else</span>
            <span class="violations">5 violations</span>
          </div>
          <i class='bx bx-chevron-right'></i>
        </li>
        <li class="low-priority">
          <div class="violator-info">
            <span class="rank">5</span>
            <span class="name">Robert Wilson</span>
            <span class="violations">3 violations</span>
          </div>
          <i class='bx bx-chevron-right'></i>
        </li>
      </ul>
    </div>
</main>