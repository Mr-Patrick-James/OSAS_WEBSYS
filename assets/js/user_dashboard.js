// DOM Elements
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');
const mainContent = document.getElementById('main-content');

// Load default content (user dashboard)
document.addEventListener('DOMContentLoaded', function () {
  // Check if user is authenticated
  checkAuthentication();
  
  loadContent('user_dashcontent');

  // Set dashboard as active by default
  const dashboardLink = document.querySelector('[data-page="user_dashcontent"]');
  if (dashboardLink) {
    dashboardLink.parentElement.classList.add('active');
  }
});

// Check user authentication
function checkAuthentication() {
  const userSession = localStorage.getItem('userSession');
  
  if (!userSession) {
    // No session found, redirect to login
    window.location.href = '../includes/login.html';
    return;
  }
  
  const session = JSON.parse(userSession);
  
  // Check if user role is correct for this dashboard
  if (session.role !== 'user') {
    // Wrong role, redirect to appropriate dashboard
    if (session.role === 'admin') {
      window.location.href = 'dashboard.html';
    } else {
      window.location.href = '../includes/login.html';
    }
    return;
  }
  
  // Update user info in the interface
  updateUserInfo(session);
}

// Update user information in the interface
function updateUserInfo(session) {
  // Update profile name if element exists
  const profileName = document.querySelector('.profile-name');
  if (profileName) {
    profileName.textContent = session.name;
  }
  
  // Update student ID if element exists
  const studentId = document.querySelector('.student-id');
  if (studentId && session.studentId) {
    studentId.textContent = `ID: ${session.studentId}`;
  }
  
  console.log('User authenticated:', session.name, 'Role:', session.role);
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('userSession');
    window.location.href = '../includes/login.html';
  }
}

// Announcements functionality
function toggleAnnouncements() {
  const content = document.getElementById('announcementsContent');
  const toggle = document.querySelector('.announcement-toggle');
  
  if (content && toggle) {
    content.classList.toggle('collapsed');
    toggle.classList.toggle('rotated');
  }
}

// Initialize announcements
function initializeAnnouncements() {
  // Add click events to read more buttons
  const readMoreButtons = document.querySelectorAll('.btn-read-more');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      // Here you can add functionality to show full announcement details
      console.log('Read more clicked for announcement');
    });
  });

  // Auto-collapse announcements after 5 seconds (optional)
  setTimeout(() => {
    const content = document.getElementById('announcementsContent');
    const toggle = document.querySelector('.announcement-toggle');
    if (content && !content.classList.contains('collapsed')) {
      content.classList.add('collapsed');
      toggle.classList.add('rotated');
    }
  }, 5000);
}

// Enhanced announcement functions
function markAsRead(button) {
  const announcementItem = button.closest('.announcement-item');
  announcementItem.classList.remove('unread');
  button.style.display = 'none';
  
  // Update announcement count
  updateAnnouncementCount();
  
  // Show success message
  showNotification('Announcement marked as read', 'success');
}

function markAllAsRead() {
  const unreadItems = document.querySelectorAll('.announcement-item.unread');
  unreadItems.forEach(item => {
    item.classList.remove('unread');
    const markButton = item.querySelector('.btn-mark-read');
    if (markButton) {
      markButton.style.display = 'none';
    }
  });
  
  updateAnnouncementCount();
  showNotification('All announcements marked as read', 'success');
}

function updateAnnouncementCount() {
  const unreadCount = document.querySelectorAll('.announcement-item.unread').length;
  const countElement = document.querySelector('.announcement-count');
  if (countElement) {
    if (unreadCount > 0) {
      countElement.textContent = `${unreadCount} New`;
      countElement.style.display = 'inline-block';
    } else {
      countElement.style.display = 'none';
    }
  }
}

function openAnnouncement(id) {
  // Here you can implement opening full announcement details
  console.log(`Opening announcement ${id}`);
  showNotification('Opening announcement details...', 'info');
}

function viewAllAnnouncements() {
  // Here you can implement viewing all announcements
  console.log('Viewing all announcements');
  showNotification('Opening all announcements...', 'info');
}

// Settings functions
function showSettingsTab(tabName) {
  // Hide all panels
  const panels = document.querySelectorAll('.settings-panel');
  panels.forEach(panel => panel.classList.remove('active'));
  
  // Remove active class from all tabs
  const tabs = document.querySelectorAll('.settings-tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Show selected panel
  const selectedPanel = document.getElementById(`${tabName}-settings`);
  if (selectedPanel) {
    selectedPanel.classList.add('active');
  }
  
  // Add active class to selected tab
  const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
}

function saveSettings() {
  showNotification('Settings saved successfully!', 'success');
  // Here you can implement actual settings saving logic
}

function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
    showNotification('Settings reset to default', 'info');
    // Here you can implement actual settings reset logic
  }
}

function uploadProfilePicture() {
  showNotification('Profile picture upload feature coming soon!', 'info');
  // Here you can implement profile picture upload
}

function changePassword() {
  showNotification('Password change feature coming soon!', 'info');
  // Here you can implement password change modal
}

function manageSessions() {
  showNotification('Session management feature coming soon!', 'info');
  // Here you can implement session management
}

function clearCache() {
  if (confirm('Are you sure you want to clear the system cache?')) {
    showNotification('Cache cleared successfully!', 'success');
    // Here you can implement cache clearing logic
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
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
  
  // Add to body
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
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

// Initialize user dashboard
function initializeUserDashboard() {
  // Add event listeners for violation details buttons
  const viewDetailsButtons = document.querySelectorAll('.btn-view-details');
  viewDetailsButtons.forEach(button => {
    button.addEventListener('click', function() {
      showViolationDetails(this);
    });
  });

  // Update violation counts and status
  updateViolationStats();
  
  console.log('⚡ User dashboard initialized');
}

// Show violation details
function showViolationDetails(button) {
  const row = button.closest('tr');
  const violationType = row.querySelector('.violation-info span').textContent;
  const date = row.querySelector('td:first-child').textContent;
  
  showNotification(`Viewing details for ${violationType} on ${date}`, 'info');
  // Here you can implement a modal or detailed view
}

// Update violation statistics
function updateViolationStats() {
  // This would typically fetch data from an API
  // For now, we'll use mock data
  const stats = {
    activeViolations: 0,
    totalViolations: 3,
    status: 'Good',
    daysClean: 7
  };

  // Update the stats display
  const activeViolations = document.querySelector('.box-info li:nth-child(1) h3');
  const totalViolations = document.querySelector('.box-info li:nth-child(2) h3');
  const status = document.querySelector('.box-info li:nth-child(3) h3');
  const daysClean = document.querySelector('.box-info li:nth-child(4) h3');

  if (activeViolations) activeViolations.textContent = stats.activeViolations;
  if (totalViolations) totalViolations.textContent = stats.totalViolations;
  if (status) status.textContent = stats.status;
  if (daysClean) daysClean.textContent = stats.daysClean;
}

// Initialize settings page
function initializeSettings() {
  // Set default active tab
  showSettingsTab('general');
  
  // Add event listeners for toggle switches
  const toggleSwitches = document.querySelectorAll('.toggle-switch input');
  toggleSwitches.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const statusElement = this.closest('.setting-item').querySelector('.setting-status');
      if (statusElement) {
        if (this.checked) {
          statusElement.textContent = 'Enabled';
          statusElement.className = 'setting-status enabled';
        } else {
          statusElement.textContent = 'Disabled';
          statusElement.className = 'setting-status disabled';
        }
      }
    });
  });
  
  console.log('⚡ Settings page initialized');
}

// Chart initialization function
function initializeCharts() {
  // Check if Chart.js is available
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
        labels: ['Academic Dishonesty', 'Disruptive Behavior', 'Dress Code', 'Late Attendance', 'Other'],
        datasets: [{
          data: [25, 20, 15, 30, 10],
          backgroundColor: [
            '#FFD700',
            '#FFCE26',
            '#FD7238',
            '#DB504A',
            '#AAAAAA'
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

  // Department Violations Bar Chart
  const departmentViolationsCtx = document.getElementById('departmentViolationsChart');
  if (departmentViolationsCtx) {
    new Chart(departmentViolationsCtx, {
      type: 'bar',
      data: {
        labels: ['Engineering', 'Business', 'Education', 'Arts', 'Science'],
        datasets: [{
          label: 'Violations',
          data: [45, 32, 28, 19, 15],
          backgroundColor: [
            '#FFD700',
            '#FFCE26',
            '#FD7238',
            '#DB504A',
            '#AAAAAA'
          ],
          borderRadius: 8,
          borderSkipped: false,
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
              display: false
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

// Side menu functionality
allSideMenu.forEach(item => {
  const li = item.parentElement;

  item.addEventListener('click', function (e) {
    e.preventDefault();
    const page = this.getAttribute('data-page');

    // Update active menu item
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
    li.classList.add('active');

    // Load the corresponding content
    loadContent(page);
  });
});

// Function to load content dynamically
function loadContent(page) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `../pages/${page}.html`, true);

  xhr.onload = function () {
    if (this.status === 200) {
      mainContent.innerHTML = this.responseText;

      // Initialize charts and announcements if dashboard content is loaded
      if (page.toLowerCase() === 'user_dashcontent') {
        setTimeout(() => {
          initializeUserDashboard();
          initializeAnnouncements();
        }, 100);
      }

      // Initialize settings if settings page is loaded
      if (page.toLowerCase() === 'settings') {
        setTimeout(() => {
          initializeSettings();
        }, 100);
      }

      // Initialize module JS if needed
      if (page.toLowerCase() === 'department' && typeof initDepartmentModule === 'function') {
        console.log('⚡ Initializing Department module...');
        initDepartmentModule();
      }
      else if (page.toLowerCase() === 'students' && typeof initStudentsModule === 'function') {
        console.log('⚡ Initializing Students module...');
        initStudentsModule();
      }
      else if (page.toLowerCase() === 'sections' && typeof initSectionsModule === 'function') {
        console.log('⚡ Initializing Sections module...');
        initSectionsModule();
      }
      else if (page.toLowerCase() === 'violations' && typeof initViolationsModule === 'function') {
        console.log('⚡ Initializing Violations module...');
        initViolationsModule();
      }
      // Add more modules here...
    } else if (this.status === 404) {
      mainContent.innerHTML = '<h2>Page not found.</h2>';
    }
  };

  xhr.onerror = function () {
    mainContent.innerHTML = '<h2>Error loading page.</h2>';
  };

  xhr.send();
}


// Toggle sidebar
menuBar.addEventListener('click', function () {
  sidebar.classList.toggle('hide');
});

// Search button functionality for mobile
searchButton.addEventListener('click', function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle('show');
    searchButtonIcon.classList.toggle('bx-x', searchForm.classList.contains('show'));
    searchButtonIcon.classList.toggle('bx-search', !searchForm.classList.contains('show'));
  }
});

// Theme switcher: dark mode
switchMode.addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});

// Responsive adjustments on load
if (window.innerWidth < 768) {
  sidebar.classList.add('hide');
}
if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  searchForm.classList.remove('show');
}

// Responsive adjustments on resize
window.addEventListener('resize', function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
  }
});
