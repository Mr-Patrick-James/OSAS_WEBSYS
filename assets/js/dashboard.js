// DOM Elements
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');
const mainContent = document.getElementById('main-content');

// Load default content (dashboard)
document.addEventListener('DOMContentLoaded', function () {
  loadContent('dashcontent');

  // Set dashboard as active by default
  const dashboardLink = document.querySelector('[data-page="dashcontent"]');
  if (dashboardLink) {
    dashboardLink.parentElement.classList.add('active');
  }
});

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
