<?php
session_start();
$error = '';
if (isset($_GET['error'])) {
    $error = $_GET['error'];
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OSAS | Login</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="./assets/styles/login.css">
</head>

<body>
    <div class="login-container">
        <div class="login-card">
            <div class="gold-border"></div>

            <div class="theme-toggle" onclick="toggleTheme()">
                <i class="fas fa-sun"></i>
            </div>

            <div class="login-header">
                <div class="logo">
                    <img src="./assets/img/default.png" alt="Logo" width="55" height="55">
                </div>
                <h2>Welcome Back</h2>
                <p>Please enter your credentials to login</p>
            </div>

            <?php if (!empty($error)): ?>
                <div class="error-toast">
                    <i class="fas fa-exclamation-circle"></i>
                    <span><?= htmlspecialchars($error) ?></span>
                    <button onclick="this.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            <?php endif; ?>

            <form id="loginForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="username">Username or Email</label>
                        <input id="username" name="username" type="text" placeholder="Enter your username or email" required>
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-input-wrapper">
                            <input id="password" name="password" type="password" placeholder="Enter your password" required>
                            <button type="button" class="toggle-password" onclick="togglePasswordVisibility()">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-options">
                    <label class="remember-me">
                        <input type="checkbox" id="rememberMe">
                        <span class="checkmark"></span>
                        Remember me
                    </label>
                    <a href="./includes/forgot_password.php" class="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" class="login-button" id="loginButton">
                    <span>Login</span>
                </button>

                <div class="social-login">
                    <div class="divider">
                        <span class="divider-line"></span>
                        <span class="divider-text">OR</span>
                        <span class="divider-line"></span>
                    </div>
                    <div class="social-buttons">
                        <button type="button" class="social-button google">
                            <i class="fab fa-google"></i>
                            Continue with Google
                        </button>
                        <button type="button" class="social-button facebook">
                            <i class="fab fa-facebook-f"></i>
                            Continue with Facebook
                        </button>
                    </div>
                </div>
            </form>

            <div class="login-footer">
                <p>Don't have an account?
                    <a href="./includes/signup.php" class="signup-link">Sign up</a>
                </p>
            </div>
        </div>
    </div>
    <script src="assets/js/initModules.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // 🔹 Persistent login check
            const userSession = localStorage.getItem('userSession'); // Always persistent
            if (userSession) {
                try {
                    const session = JSON.parse(userSession);
                    const now = new Date().getTime();

                    if (session.expires && session.expires > now) {
                        // Redirect based on role
                        if (session.role === 'admin') {
                            window.location.href = './includes/dashboard.php';
                        } else if (session.role === 'user') {
                            window.location.href = './includes/user_dashboard.php';
                        }
                    } else {
                        // Remove expired session
                        localStorage.removeItem('userSession');
                    }
                } catch {
                    localStorage.removeItem('userSession');
                }
            }
        });

        // 🔹 Password toggle
        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const toggleButton = document.querySelector('.toggle-password i');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleButton.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleButton.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        // 🔹 Toast Notification
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
            document.body.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 50);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        // 🔹 AJAX Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginButton = document.getElementById('loginButton');

            if (!username || !password) {
                showToast('Please fill in all fields.', 'error');
                return;
            }

            // Loading state
            loginButton.disabled = true;
            loginButton.innerHTML = `<div class="spinner"></div><span>Logging in...</span>`;

            fetch('./auth/login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&rememberMe=true` // Always true
                })
                .then(res => res.json())
                .then(data => {
                    loginButton.disabled = false;
                    loginButton.innerHTML = `<span>Login</span>`;

                    if (data.status === 'success') {
                        showToast('Login successful! Redirecting...', 'success');

                        // Always use localStorage for persistent login
                        const sessionData = {
                            name: data.name,
                            role: data.role,
                            studentId: data.studentId,
                            expires: data.expires * 1000 // convert PHP timestamp to JS ms
                        };

                        localStorage.setItem('userSession', JSON.stringify(sessionData));

                        setTimeout(() => {
                            if (data.role === 'admin') {
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
                    loginButton.disabled = false;
                    loginButton.innerHTML = `<span>Login</span>`;
                    console.error('Login error:', err);
                    showToast('Server error. Please try again later.', 'error');
                });
        });
    </script>
</body>

</html>