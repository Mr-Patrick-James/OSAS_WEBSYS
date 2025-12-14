// DOM Elements
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');
const switchMode = document.getElementById('switch-mode');
const mainContent = document.getElementById('main-content');

// Global state
window.darkMode = true;

// Load default content (dashboard)
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Dashboard Framework initializing...');

    // Check if user is authenticated
    checkAuthentication();

    // Initialize theme from localStorage or system preference
    initializeTheme();

    // Load default dashboard content
    loadContent('admin_page/dashcontent');

    // Set dashboard as active by default
    const dashboardLink = document.querySelector('[data-page="admin_page/dashcontent"]');
    if (dashboardLink) {
        dashboardLink.parentElement.classList.add('active');
    }

    // Initialize service worker for PWA
    initializeServiceWorker();

    // Initialize core event listeners
    initializeEventListeners();

    console.log('✅ Dashboard Framework initialized successfully');
});

// Core Functions ==========================================================

// Initialize service worker for PWA
function initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('../sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
}

// Enhanced authentication check
function checkAuthentication() {
    // Check if PHP session is valid (cookies exist)
    const hasCookies = document.cookie.includes('user_id') && document.cookie.includes('role');
    
    if (hasCookies) {
        console.log('✅ PHP session cookies found, authentication valid');
        // Try to get localStorage session for UI updates
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            try {
                const session = JSON.parse(userSession);
                updateUserInfo(session);
                console.log('✅ Admin authenticated:', session.name, 'Role:', session.role);
            } catch (error) {
                console.warn('⚠️ Could not parse localStorage session, but cookies are valid');
            }
        }
        return; // Don't redirect if cookies exist
    }

    // Fallback to localStorage check
    const userSession = localStorage.getItem('userSession');

    if (!userSession) {
        console.log('❌ No user session found, redirecting to login...');
        window.location.href = '../index.php';
        return;
    }

    try {
        const session = JSON.parse(userSession);

        // Check session expiration
        if (session.expires && new Date() > new Date(session.expires)) {
            console.log('❌ Session expired, redirecting to login...');
            localStorage.removeItem('userSession');
            window.location.href = '../index.php';
            return;
        }

        // Check if user role is correct for this dashboard
        if (session.role !== 'admin') {
            console.log(`❌ Invalid role: ${session.role}, redirecting...`);
            if (session.role === 'user') {
                window.location.href = '../includes/user_dashboard.php';
            } else {
                window.location.href = '../index.php';
            }
            return;
        }

        // Update user info in the interface
        updateUserInfo(session);

        console.log('✅ Admin authenticated:', session.name, 'Role:', session.role);

    } catch (error) {
        console.error('❌ Error parsing user session:', error);
        localStorage.removeItem('userSession');
        window.location.href = '../index.php';
    }
}

// Enhanced user info update
function updateUserInfo(session) {
    // Update profile name if element exists
    const profileName = document.querySelector('.profile-name');
    if (profileName) {
        profileName.textContent = session.name;
    }

    // Update profile role if element exists
    const profileRole = document.querySelector('.profile-role');
    if (profileRole) {
        profileRole.textContent = session.role;
    }

    // Update profile picture if exists
    const profilePic = document.querySelector('.profile-photo');
    if (profilePic && session.avatar) {
        profilePic.src = session.avatar;
    }
}

// Enhanced logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        console.log('👋 User logging out...');

        // Clear all session data
        localStorage.removeItem('userSession');

        // Optional: Clear other temporary data
        // localStorage.removeItem('tempData');

        // Redirect to login page
        window.location.href = '../index.php';
    }
}

// Enhanced content loading with error handling and loading states
function loadContent(page) {
    // Show loading state
    mainContent.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading ${page.replace('admin_page/', '').replace(/_/g, ' ')}...</p>
    </div>
  `;

    // Add loading styles if not exists
    if (!document.querySelector('#loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-styles';
        styles.textContent = `
      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50px;
        text-align: center;
      }
      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ffb84fff;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
        document.head.appendChild(styles);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `../pages/${page}.php`, true);
    xhr.timeout = 10000; // 10 second timeout

    xhr.onload = function () {
        if (this.status === 200) {
            mainContent.innerHTML = this.responseText;

            // Ensure PWA theme is applied to new content
            updateThemeColor();

            // Initialize module JS
            initializeModule(page);

            console.log(`✅ ${page} loaded successfully`);

        } else if (this.status === 404) {
            mainContent.innerHTML = `
        <div class="error-state">
          <h2>Page not found</h2>
          <p>The requested page could not be found.</p>
          <button onclick="loadContent('admin_page/dashcontent')" class="btn-primary">
            Return to Dashboard
          </button>
        </div>
      `;
        }
    };

    xhr.onerror = function () {
        mainContent.innerHTML = `
      <div class="error-state">
        <h2>Error loading page</h2>
        <p>Please check your internet connection and try again.</p>
        <button onclick="loadContent('admin_page/dashcontent')" class="btn-primary">
          Return to Dashboard
        </button>
      </div>
    `;
    };

    xhr.ontimeout = function () {
        mainContent.innerHTML = `
      <div class="error-state">
        <h2>Request timeout</h2>
        <p>The page took too long to load. Please try again.</p>
        <button onclick="loadContent('admin_page/dashcontent')" class="btn-primary">
          Return to Dashboard
        </button>
      </div>
    `;
    };

    xhr.send();
}

// Module initializer function
// Module initializer function - UPDATED VERSION
function initializeModule(page) {
    // Always initialize modals for every page
    if (typeof initializeModals === 'function') {
        initializeModals();
    }

    // Initialize module-specific code
    const moduleMap = {
        'dashcontent': 'initDashboardModule',
        'department': 'initDepartmentModule',
        'students': 'initStudentsModule',
        'sections': 'initSectionsModule',
        'violations': 'initViolationsModule',  // This should match your violations.js function name
        'reports': 'initReportsModule',
        'users': 'initUsersModule',
        'settings': 'initSettingsModule'
    };

    const moduleName = page.toLowerCase().replace('admin_page/', '');
    const initFunctionName = moduleMap[moduleName];

    console.log(`🛠 Attempting to initialize: ${moduleName}`);
    console.log(`🔍 Looking for function: ${initFunctionName}`);

    // Check if function exists in global scope
    if (initFunctionName && typeof window[initFunctionName] === 'function') {
        console.log(`✅ Found ${initFunctionName}, initializing...`);
        try {
            window[initFunctionName]();
        } catch (error) {
            console.error(`❌ Error initializing ${moduleName}:`, error);
        }
    } else {
        console.warn(`⚠️ ${initFunctionName} not found for ${moduleName}`);
        
        // Try to load the module script dynamically if not found
        loadModuleScript(moduleName);
    }
}

// NEW FUNCTION: Load module script dynamically
function loadModuleScript(moduleName) {
    const moduleScripts = {
        'department': '../assets/js/department.js',
        'sections': '../assets/js/section.js',
        'students': '../assets/js/student.js',
        'violations': '../assets/js/violation.js',
        'reports': '../assets/js/reports.js',
        'users': '../assets/js/users.js',
        'settings': '../assets/js/settings.js'
    };

    const scriptPath = moduleScripts[moduleName];
    
    if (scriptPath && !document.querySelector(`script[src="${scriptPath}"]`)) {
        console.log(`📥 Loading ${moduleName} module script: ${scriptPath}`);
        
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = function() {
            console.log(`✅ ${moduleName} script loaded`);
            
            // Try to initialize again after script loads
            const initFunctionName = `init${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Module`;
            if (typeof window[initFunctionName] === 'function') {
                console.log(`⚡ Initializing ${moduleName} module...`);
                window[initFunctionName]();
            }
        };
        script.onerror = function() {
            console.error(`❌ Failed to load script: ${scriptPath}`);
        };
        document.head.appendChild(script);
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Enhanced side menu functionality
    allSideMenu.forEach(item => {
        const li = item.parentElement;

        item.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');

            // Update active menu item
            allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
            li.classList.add('active');

            // Close sidebar on mobile after selection
            if (window.innerWidth < 768) {
                sidebar.classList.add('hide');
            }

            // Load the corresponding content
            loadContent(page);
        });
    });

    // Toggle sidebar with animation
    if (menuBar) {
        menuBar.addEventListener('click', function () {
            sidebar.classList.toggle('hide');

            // Save sidebar state
            localStorage.setItem('sidebarHidden', sidebar.classList.contains('hide'));
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
            toggleTheme();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl/Cmd + D to toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            toggleTheme();
        }

        // Ctrl/Cmd + M to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            if (menuBar) menuBar.click();
        }

        // Escape to close search on mobile
        if (e.key === 'Escape' && searchForm && searchForm.classList.contains('show')) {
            searchForm.classList.remove('show');
            if (searchButtonIcon) {
                searchButtonIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    });
}

// Enhanced responsive adjustments
function handleResponsiveAdjustments() {
    // Sidebar behavior
    if (window.innerWidth < 768 && sidebar) {
        sidebar.classList.add('hide');
    } else if (window.innerWidth >= 768 && sidebar) {
        // Restore sidebar state on larger screens
        const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
        if (!sidebarHidden) {
            sidebar.classList.remove('hide');
        }
    }

    // Search form behavior
    if (window.innerWidth > 576 && searchButtonIcon) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        if (searchForm) {
            searchForm.classList.remove('show');
        }
    }
}

// Initial responsive adjustments
handleResponsiveAdjustments();

// Responsive adjustments on resize with debounce
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResponsiveAdjustments, 250);
});

console.log('🎯 Dashboard Framework loaded successfully!');