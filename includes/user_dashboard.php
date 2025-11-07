<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
  <title>E-OSAS SYSTEM</title>
  <link rel="stylesheet" href="../assets/styles/user_dashboard.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
  
  <section id="sidebar">
    <a href="#" class="brand">
      <img src="../assets/img/default.png" alt="Crown Icon"
        style="width: 38px; height: 38px; vertical-align: middle; margin-right: 24px; margin-left: 10px;">
      <span class="text">Osas System</span>
    </a>

    <ul class="side-menu top">
      <li class="active">
        <a href="#" data-page="user_dashcontent">
          <i class='bx bxs-dashboard'></i>
          <span class="text">My Dashboard</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="my_violations">
          <i class='bx bxs-shield-x'></i>
          <span class="text">My Violations</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="my_profile">
          <i class='bx bxs-user'></i>
          <span class="text">My Profile</span>
        </a>
      </li>
      <li>
        <a href="#" data-page="announcements">
          <i class='bx bxs-megaphone'></i>
          <span class="text">Announcements</span>
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
        <span class="num">7</span>
      </a>
      <a href="#" class="profile">
        <img src="../assets/img/default.png">
      </a>
    </nav>
    <!-- NAVBAR -->

    <!-- MAIN CONTENT CONTAINER -->
    <div id="main-content">
      <!-- Content will be loaded here dynamically -->
    </div>
  </section>
  <!-- CONTENT -->

  <script src="../assets/js/user_dashboard.js"></script>
</body>

</html>