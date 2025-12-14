<?php
// Start session and check authentication
session_start();

// Check if user is logged in - check cookies first (more reliable)
if (isset($_COOKIE['user_id']) && isset($_COOKIE['role'])) {
    // Restore session from cookies
    $_SESSION['user_id'] = $_COOKIE['user_id'];
    $_SESSION['username'] = $_COOKIE['username'] ?? '';
    $_SESSION['role'] = $_COOKIE['role'];
} elseif (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    // No session or cookies, redirect to login
    header('Location: ../index.php');
    exit;
}

// Check if user is admin (required for admin dashboard)
if ($_SESSION['role'] !== 'admin') {
    // If user is not admin, redirect to appropriate dashboard
    if ($_SESSION['role'] === 'user') {
        header('Location: user_dashboard.php');
    } else {
        header('Location: ../index.php');
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <title>E-OSAS SYSTEM</title>
  <link rel="stylesheet" href="../assets/styles/dashboard.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
  <!-- SIDEBAR -->
  <section id="sidebar">
    <a href="#" class="brand">
      <img src="../assets/img/default.png" alt="Crown Icon"
        style="width: 38px; height: 38px; vertical-align: middle; margin-right: 24px; margin-left: 10px;">
      <span class="text">Osas System</span>
    </a>

    <ul class="side-menu top">
      <li class="active">
        <a href="#" data-page="admin_page/dashcontent">
          <i class='bx bxs-dashboard'></i>
          <span class="text">Dashboard</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="admin_page/Department">
          <i class='bx bxs-building'></i>
          <span class="text">Department</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="admin_page/Sections">
          <i class='bx bxs-layer'></i>
          <span class="text">Sections</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="admin_page/Students">
          <i class='bx bxs-group'></i>
          <span class="text">Students</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="admin_page/Violations">
          <i class='bx bxs-shield-x'></i>
          <span class="text">Violations</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="admin_page/Reports">
          <i class='bx bxs-file'></i>
          <span class="text">Reports</span>
        </a>
      </li>
    </ul>
    <ul class="side-menu">
      <li>
        <a href="../pages/settings.html" class="logout">
          <i class='bx bxs-cog'></i>
          <span class="text">Settings</span>
        </a>
      </li>
      <li>
        <a href="#" class="logout" onclick="logout()">
          <i class='bx bx-log-out'></i>
          <span class="text">Logout</span>
        </a>
      </li>
    </ul>
  </section>
  <!-- SIDEBAR -->

  <!-- CONTENT -->
  <section id="content">
    <!-- NAVBAR -->
    <nav>
      <i class='bx bx-menu'></i>
      <a href="#" class="nav-link">Categories</a>
      <form action="#">
        <div class="form-input">
          <input type="search" placeholder="Search...">
          <button type="submit" class="search-btn"><i class='bx bx-search'></i></button>
        </div>
      </form>
      <input type="checkbox" id="switch-mode" hidden>
      <label for="switch-mode" class="switch-mode"></label>
      <a href="#" class="notification">
        <i class='bx bxs-bell'></i>
        <span class="num">1</span>
      </a>
      <a href="#" class="profile">
        <img src="../assets/img/user.jpg">
      </a>
    </nav>
    <!-- NAVBAR -->

    <!-- MAIN CONTENT CONTAINER -->
    <div id="main-content">
      <!-- Content will be loaded here dynamically -->
    </div>
  </section>
  <!-- CONTENT -->

  <script src="../assets/js/dashboard.js"></script>
  <script src="../assets/js/utils/notification.js"></script>
  <script src="../assets/js/modules/dashboardModule.js"></script>
  <script src="../assets/js/utils/theme.js"></script>


  
  <script src="../assets/js/department.js"></script>
  <script src="../assets/js/section.js"></script>
  <script src="../assets/js/student.js"></script>
  <script src="../assets/js/violation.js"></script>
  <script src="../assets/js/reports.js"></script>
</body>

</html>