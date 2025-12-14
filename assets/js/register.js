// Global Theme Manager
class ThemeManager {
    constructor() {
        this.darkMode = true;
        this.init();
    }

    init() {
        // Check for saved theme preference
        this.checkSavedTheme();
        
        // Watch for system theme changes
        this.watchSystemTheme();
        
        // Apply theme to all pages
        this.applyGlobalTheme();
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.updateTheme();
        localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { darkMode: this.darkMode }
        }));
    }

    updateTheme() {
        // Apply to current page
        document.body.classList.toggle('dark-mode', this.darkMode);
        
        // Update CSS custom properties
        this.updateCSSVariables();
        
        // Update theme toggle icon
        this.updateThemeToggle();
        
        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor();
    }

    updateCSSVariables() {
        const root = document.documentElement;
        
        if (this.darkMode) {
            root.style.setProperty('--bg-primary', '#121212');
            root.style.setProperty('--bg-secondary', '#1e1e1e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#b0b0b0');
            root.style.setProperty('--accent-color', '#4a6cf7');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--card-bg', '#1e1e1e');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.3)');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f5f5f5');
            root.style.setProperty('--text-primary', '#333333');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--accent-color', '#4a6cf7');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--shadow', '0 2px 10px rgba(0, 0, 0, 0.1)');
        }
    }

    updateThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle i');
        if (!themeToggle) return;
        
        if (this.darkMode) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
        } else {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
        }
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = this.darkMode ? '#121212' : '#ffffff';
    }

    checkSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            this.darkMode = savedTheme === 'dark';
        } else {
            this.darkMode = systemPrefersDark;
        }

        this.updateTheme();
    }

    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                this.darkMode = e.matches;
                this.updateTheme();
            }
        });
    }

    applyGlobalTheme() {
        // Apply theme to iframes and other embedded content
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    iframe.contentDocument.body.classList.toggle('dark-mode', this.darkMode);
                }
            } catch (e) {
                // Cross-origin iframe, can't access
            }
        });
    }

    // Get current theme state
    getCurrentTheme() {
        return this.darkMode ? 'dark' : 'light';
    }

    // Set theme directly
    setTheme(theme) {
        this.darkMode = theme === 'dark';
        this.updateTheme();
        localStorage.setItem('theme', theme);
    }
}

// Initialize global theme manager
const themeManager = new ThemeManager();

// Global functions for HTML onclick attributes
function toggleTheme() {
    themeManager.toggleTheme();
}

function setTheme(theme) {
    themeManager.setTheme(theme);
}

// Password visibility toggle
function togglePasswordVisibility(fieldId) {
    const passwordInput = document.getElementById(fieldId);
    const toggleButton = passwordInput.parentNode.querySelector('.toggle-password i');

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

// Clear error message
function clearError(field) {
    document.getElementById(`${field}-error`).textContent = '';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Accept terms function
function acceptTerms() {
    document.getElementById('agreeTerms').checked = true;
    closeModal('termsModal');
    closeModal('privacyModal');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let modal of modals) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    }
});

// Modern Notification System
function showNotification(type, title, message, duration = 5000) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    let icon = '';
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 400);
            }
        }, duration);
    }
    
    return notification;
}

// Form validation and submission - CONNECTED TO YOUR PHP BACKEND
function handleSignup(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const department = document.getElementById('department').value;
    const email = document.getElementById('email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Clear previous errors
    clearError('firstName');
    clearError('lastName');
    clearError('studentId');
    clearError('department');
    clearError('email');
    clearError('username');
    clearError('password');
    clearError('confirmPassword');

    // Basic validation
    let hasErrors = false;

    if (!agreeTerms) {
        showNotification('error', 'Terms Required', 'Please agree to the Terms of Service and Privacy Policy');
        hasErrors = true;
    }

    if (password !== confirmPassword) {
        document.getElementById("confirmPassword-error").textContent = "Passwords do not match.";
        showNotification('error', 'Password Mismatch', 'Please make sure your passwords match');
        hasErrors = true;
    }

    // Email validation
    if (!isValidEmail(email)) {
        document.getElementById("email-error").textContent = "Please enter a valid email address.";
        hasErrors = true;
    }

    // Required field validation (matching your PHP validation)
    if (!firstName) {
        document.getElementById("firstName-error").textContent = "First name is required.";
        hasErrors = true;
    }

    if (!lastName) {
        document.getElementById("lastName-error").textContent = "Last name is required.";
        hasErrors = true;
    }

    if (!email) {
        document.getElementById("email-error").textContent = "Email is required.";
        hasErrors = true;
    }

    if (!username) {
        document.getElementById("username-error").textContent = "Username is required.";
        hasErrors = true;
    }

    if (!password) {
        document.getElementById("password-error").textContent = "Password is required.";
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    const signupButton = document.getElementById('signupButton');
    signupButton.disabled = true;
    signupButton.innerHTML = '<span class="loading-spinner"></span>';

    // Send data to PHP backend
    fetch('../auth/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            student_id: studentId,
            first_name: firstName,
            last_name: lastName,
            department: department,
            email: email,
            username: username,
            password: password,
            role: 'user'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        signupButton.disabled = false;
        signupButton.innerHTML = '<span>Create Account</span>';

        if (data.status === 'success') {
            showNotification(
                'success', 
                'Account Created Successfully!', 
                data.message,
                6000
            );
            
            // Reset form
            event.target.reset();
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = '../index.php';
            }, 3000);
        } else {
            // Handle error response from your PHP
            showNotification('error', 'Registration Failed', data.message);
            
            // You can add specific field error handling here if needed
            if (data.message.includes('Email or username already exists')) {
                document.getElementById("email-error").textContent = "Email or username already exists.";
                document.getElementById("username-error").textContent = "Email or username already exists.";
            }
        }
    })
    .catch(error => {
        signupButton.disabled = false;
        signupButton.innerHTML = '<span>Create Account</span>';
        console.error('Error:', error);
        showNotification('error', 'Network Error', 'Unable to connect to server. Please check your connection and try again.');
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Theme is already initialized by the ThemeManager class
    // Add any additional initialization here
    
    // Listen for theme changes if needed
    window.addEventListener('themeChanged', (event) => {
        console.log('Theme changed to:', event.detail.darkMode ? 'dark' : 'light');
        // Add any custom logic for theme changes
    });
});