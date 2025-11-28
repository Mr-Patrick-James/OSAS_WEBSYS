// DOM Elements
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');
const mainContent = document.getElementById('main-content');

// Theme state (sync with login.js)
let darkMode = true;

// Load default content (dashboard)
document.addEventListener('DOMContentLoaded', function () {
  // Check if user is authenticated
  checkAuthentication();
  
  // Initialize theme from localStorage or system preference
  initializeTheme();
  
  loadContent('admin_page/dashcontent');

  // Set dashboard as active by default
  const dashboardLink = document.querySelector('[data-page="admin_page/dashcontent"]');
  if (dashboardLink) {
    dashboardLink.parentElement.classList.add('active');
  }
});

// Initialize theme from localStorage
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    darkMode = savedTheme === 'dark';
  } else {
    darkMode = systemPrefersDark;
  }
  
  updateTheme();
  
  // Sync the switch mode checkbox
  if (switchMode) {
    switchMode.checked = darkMode;
  }
}

// Update theme across the application
function updateTheme() {
  // Toggle dark class on body (for your current CSS)
  document.body.classList.toggle('dark', darkMode);
  
  // Also add dark-mode class for compatibility with login.js
  document.body.classList.toggle('dark-mode', darkMode);
  
  // Update theme toggle icon if exists
  const themeToggle = document.querySelector('.theme-toggle i');
  if (themeToggle) {
    if (darkMode) {
      themeToggle.classList.remove('fa-sun');
      themeToggle.classList.add('fa-moon');
    } else {
      themeToggle.classList.remove('fa-moon');
      themeToggle.classList.add('fa-sun');
    }
  }
  
  // Update theme-color meta tag for PWA
  updateThemeColor();
}

// Update theme color meta tag
function updateThemeColor() {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', darkMode ? '#121212' : '#4a2d6d');
  }
}

// Toggle theme function (compatible with login.js)
function toggleTheme() {
  darkMode = !darkMode;
  updateTheme();
  localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  console.log('Theme toggled to:', darkMode ? 'dark' : 'light');
}

// Check user authentication
function checkAuthentication() {
  const userSession = localStorage.getItem('userSession');
  
  if (!userSession) {
    // No session found, redirect to login
    window.location.href = '../index.php';
    return;
  }
  
  const session = JSON.parse(userSession);
  
  // Check if user role is correct for this dashboard
  if (session.role !== 'admin') {
    // Wrong role, redirect to appropriate dashboard
    if (session.role === 'user') {
      window.location.href = '../includes/user_dashboard.php';
    } else {
      window.location.href = '../index.php';
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
  
  console.log('Admin authenticated:', session.name, 'Role:', session.role);
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('userSession');
    // Also clear theme preference if you want fresh start on next login
    // localStorage.removeItem('theme');
    window.location.href = '../index.php';
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

  // Get colors based on current theme
  const isDark = document.body.classList.contains('dark');
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDark ? '#ffffff' : '#333333';

  // Violation Types Pie Chart
  const violationTypesCtx = document.getElementById('violationTypesChart');
  if (violationTypesCtx) {
    new Chart(violationTypesCtx, {
      type: 'pie',
      data: {
        labels: ['Improper Uniform', 'Improper Footwear', 'No ID'],
        datasets: [{
          data: [45, 35, 20],
          backgroundColor: [
            '#FFD700',
            '#FFCE26',
            '#FD7238'
          ],
          borderWidth: 2,
          borderColor: isDark ? '#2d3748' : '#ffffff'
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
              },
              color: textColor
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
        labels: ['BSIS', 'WFT', 'BTVTED', 'CHS'],
        datasets: [{
          label: 'Violations',
          data: [28, 22, 18, 15],
          backgroundColor: [
            '#FFD700',
            '#FFCE26',
            '#FD7238',
            '#DB504A'
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
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: textColor
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
          backgroundColor: isDark ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 215, 0, 0.1)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: '#FFD700',
          pointBorderColor: isDark ? '#2d3748' : '#ffffff',
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
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
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
  xhr.open('GET', `../pages/${page}.php`, true);

  xhr.onload = function () {
    if (this.status === 200) {
      mainContent.innerHTML = this.responseText;

      // Initialize charts and announcements if dashboard content is loaded
      if (page.toLowerCase().includes('dashcontent')) {
        setTimeout(() => {
          initializeCharts();
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
if (menuBar) {
  menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
  });
}

// Search button functionality for mobile
if (searchButton) {
  searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
      e.preventDefault();
      searchForm.classList.toggle('show');
      searchButtonIcon.classList.toggle('bx-x', searchForm.classList.contains('show'));
      searchButtonIcon.classList.toggle('bx-search', !searchForm.classList.contains('show'));
    }
  });
}

// Theme switcher: dark mode (compatible with login.js)
if (switchMode) {
  switchMode.addEventListener('change', function () {
    toggleTheme(); // Use the unified theme toggle function
  });
}

// Listen for system theme changes (compatible with login.js)
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', function (e) {
  // Only update if user hasn't explicitly set a preference
  if (!localStorage.getItem('theme')) {
    darkMode = e.matches;
    updateTheme();
    if (switchMode) {
      switchMode.checked = darkMode;
    }
  }
});

// Responsive adjustments on load
if (window.innerWidth < 768 && sidebar) {
  sidebar.classList.add('hide');
}
if (window.innerWidth > 576 && searchButtonIcon) {
  searchButtonIcon.classList.replace('bx-x', 'bx-search');
  if (searchForm) {
    searchForm.classList.remove('show');
  }
}

// Responsive adjustments on resize
window.addEventListener('resize', function () {
  if (this.innerWidth > 576 && searchButtonIcon) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    if (searchForm) {
      searchForm.classList.remove('show');
    }
  }
});