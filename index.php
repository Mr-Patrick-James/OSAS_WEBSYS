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
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#4a2d6d">
    <link rel="apple-touch-icon" href="assets/img/default.png">
    <meta name="apple-mobile-web-app-capable" content="yes">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="./assets/styles/login.css">
    <style>
        /* Error toast styles */
        .error-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
        }

        .error-toast i {
            font-size: 1.2rem;
        }

        .error-toast button {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0;
            margin-left: auto;
        }

        .error-toast button:hover {
            opacity: 0.8;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }

            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        /* Loading spinner */
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        /* Background animation for light mode */
        @keyframes backgroundShift {

            0%,
            100% {
                background-position: 0% 50%;
            }

            50% {
                background-position: 100% 50%;
            }
        }



        /* 🔹 Toast Notification Styles */
        .toast {
            position: fixed;
            top: -60px;
            right: 20px;
            background: #222;
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.4s ease;
            z-index: 9999;
            font-size: 0.95rem;
        }

        .toast.show {
            top: 20px;
            opacity: 1;
            transform: translateY(0);
        }

        .toast i {
            font-size: 1.2rem;
        }

        .toast.success {
            background: linear-gradient(135deg, #4CAF50, #2E7D32);
        }

        .toast.error {
            background: linear-gradient(135deg, #E53935, #B71C1C);
        }

        /* 🔹 Spinner on Login Button */
        .spinner {
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid #fff;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            margin-right: 8px;
            animation: spin 0.8s linear infinite;
            display: inline-block;
            vertical-align: middle;
        }

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }

        .login-button {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }

        .login-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
    </style>
</head>

<body>
    <div class="login-container">
        <div class="login-card">
            <div class="gold-border"></div>

            <div class="theme-toggle" id="themeToggle">
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
                            <button type="button" class="toggle-password" id="passwordToggle">Fz
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

    <button id="installPWA" style="
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 10px;
    background:#4a2d6d;
    color:white;
    border:none;
    cursor:pointer;
    display:none;">
        Install App
    </button>

    <script src="service-worker.js"></script>
    <script src="assets/js/pwa.js"></script>
    <script src="assets/js/session.js"></script>
    <script src="assets/js/login.js"></script>

</body>

</html>