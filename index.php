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

    <script>
    document.addEventListener('DOMContentLoaded', function () {
        // 🔹 Persistent login check
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            try {
                const session = JSON.parse(userSession);
                const now = new Date().getTime();

                if (!session.expires || session.expires > now) {
                    if (session.role === 'admin') {
                        window.location.href = './includes/dashboard.php';
                    } else if (session.role === 'user') {
                        window.location.href = './includes/user_dashboard.php';
                    }
                } else {
                    localStorage.removeItem('userSession'); // expired
                }
            } catch {
                localStorage.removeItem('userSession');
            }
        }
    });

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

    // 🔹 AJAX login
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('rememberMe').checked;

        fetch('./auth/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&rememberMe=${remember}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                // Store session in localStorage
                const expires = remember ? new Date().getTime() + 30*24*60*60*1000 : null; // 30 days if remember
                localStorage.setItem('userSession', JSON.stringify({
                    name: data.name,
                    role: data.role,
                    studentId: data.studentId,
                    expires: expires
                }));

                if (data.role === 'admin') {
                    window.location.href = './includes/dashboard.php';
                } else {
                    window.location.href = './includes/user_dashboard.php';
                }
            } else {
                alert(data.message);
            }
        })
        .catch(err => console.error('Login error:', err));
    });
    </script>
</body>
</html>
