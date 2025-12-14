// Dark/Light Mode Functionality
let darkMode = true;

function toggleTheme() {
    darkMode = !darkMode;
    updateTheme();
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    console.log('Theme toggled to:', darkMode ? 'dark' : 'light');
}

function updateTheme() {
    // Toggle dark-mode class on body
    document.body.classList.toggle('dark-mode', darkMode);

    // Update theme toggle icon
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

function updateThemeColor() {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
        themeColorMeta.setAttribute('content', darkMode ? '#121212' : '#ffffff');
    }
}

// Check for saved theme preference or system preference
function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        darkMode = savedTheme === 'dark';
    } else {
        darkMode = systemPrefersDark;
    }

    updateTheme();
}

// Password visibility toggle
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password i');

    if (passwordInput && toggleButton) {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.classList.remove('fa-eye');
            toggleButton.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleButton.classList.remove('fa-eye-slash');
            toggleButton.classList.add('fa-eye');
        }
    }
}

// Toast Notification Function
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconClass = 'fa-info-circle';
    if (type === 'success') iconClass = 'fa-check-circle';
    if (type === 'error') iconClass = 'fa-exclamation-circle';

    toast.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 400);
    }, 5000);
}

// Form validation
function validateForm(username, password) {
    if (!username || !password) {
        showToast('Please fill in all fields.', 'error');
        return false;
    }

    if (username.length < 3) {
        showToast('Username must be at least 3 characters long.', 'error');
        return false;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return false;
    }

    return true;
}

// AJAX Login Handler
function handleLoginFormSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginButton = document.getElementById('loginButton');
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    if (!validateForm(username, password)) {
        return;
    }

    // Loading Animation
    loginButton.disabled = true;
    loginButton.innerHTML = `<div class="spinner"></div><span>Logging in...</span>`;

    fetch('./auth/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&rememberMe=${rememberMe}`
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            loginButton.disabled = false;
            loginButton.innerHTML = `<span>Login</span>`;

            if (data.status === 'success') {
                showToast('Login successful! Redirecting...', 'success');

                // Extract data from response (Controller wraps it in 'data' property)
                const responseData = data.data || data;
                const sessionData = {
                    name: responseData.name,
                    role: responseData.role,
                    studentId: responseData.studentId,
                    expires: responseData.expires * 1000,
                    theme: darkMode ? 'dark' : 'light'
                };

                localStorage.setItem('userSession', JSON.stringify(sessionData));

                setTimeout(() => {
                    if (responseData.role === 'admin') {
                        window.location.href = './includes/dashboard.php';
                    } else {
                        window.location.href = './includes/user_dashboard.php';
                    }
                }, 1000);
            } else {
                showToast(data.message || 'Invalid credentials.', 'error');
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            loginButton.disabled = false;
            loginButton.innerHTML = `<span>Login</span>`;
            showToast('Server error. Please try again later.', 'error');
        });
}

// Initialize application
function initApp() {
    console.log('Initializing app...');

    // Initialize theme
    checkSavedTheme();

    // Add event listeners
    const loginForm = document.getElementById('loginForm');
    const themeToggle = document.getElementById('themeToggle');
    const passwordToggle = document.getElementById('passwordToggle');

    console.log('Elements found:', {
        loginForm: !!loginForm,
        themeToggle: !!themeToggle,
        passwordToggle: !!passwordToggle
    });

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginFormSubmit);
        console.log('Login form event listener added');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Theme toggle event listener added');
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
        console.log('Password toggle event listener added');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function (e) {
        // Only update if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
            darkMode = e.matches;
            updateTheme();
        }
    });

    console.log('App initialization complete');
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded');
    initApp();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('DOM already ready, initializing immediately');
    initApp();
}