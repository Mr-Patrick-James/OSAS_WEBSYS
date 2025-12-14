<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up - OSAS System</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/styles/register.css">
</head>

<body>
    <div class="signup-container">
        <div class="signup-card">
            <div class="gold-border"></div>

            <div class="theme-toggle" onclick="toggleTheme()">
                <i class="fas fa-sun"></i>
            </div>

            <div class="signup-header">
                <div class="logo">
                    <img src="../assets/img/default.png" alt="Logo" width="55" height="55">
                </div>

                <h2>Create Account</h2>
                <p>Please fill in your details to sign up</p>
            </div>

            <form class="signup-form" onsubmit="handleSignup(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input id="firstName" type="text" placeholder="First name" required
                            oninput="clearError('firstName')">
                        <span class="error-message" id="firstName-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input id="lastName" type="text" placeholder="Last name" required
                            oninput="clearError('lastName')">
                        <span class="error-message" id="lastName-error"></span>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="studentId">Student ID</label>
                        <input id="studentId" type="text" placeholder="Student ID" required
                            oninput="clearError('studentId')">
                        <span class="error-message" id="studentId-error"></span>
                    </div>

                    <div class="form-group">
                        <label for="department">Department</label>
                        <select id="department" required onchange="clearError('department')">
                            <option value="">Select Department</option>
                            <option value="bsis">BSIS</option>
                            <option value="wft">WFT</option>
                            <option value="btvted">BTVTED</option>
                            <option value="chs">CHS</option>
                        </select>
                        <span class="error-message" id="department-error"></span>
                    </div>
                </div>

                <div class="form-group full-width">
                    <label for="email">Email Address</label>
                    <input id="email" type="email" placeholder="Enter your email address" required
                        oninput="clearError('email')">
                    <span class="error-message" id="email-error"></span>
                </div>

                <div class="form-group full-width">
                    <label for="username">Username</label>
                    <input id="username" type="text" placeholder="Choose a username" required
                        oninput="clearError('username')">
                    <span class="error-message" id="username-error"></span>
                </div>

                <div class="form-group full-width">
                    <label for="password">Password</label>
                    <div class="password-input-wrapper">
                        <input id="password" type="password" placeholder="Create a password" required
                            oninput="clearError('password')">
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span class="error-message" id="password-error"></span>
                </div>

                <div class="form-group full-width">
                    <label for="confirmPassword">Confirm Password</label>
                    <div class="password-input-wrapper">
                        <input id="confirmPassword" type="password" placeholder="Confirm your password" required
                            oninput="clearError('confirmPassword')">
                        <button type="button" class="toggle-password" onclick="togglePasswordVisibility('confirmPassword')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <span class="error-message" id="confirmPassword-error"></span>
                </div>

                <div class="terms-agreement">
                    <input type="checkbox" id="agreeTerms" required>
                    <span class="checkmark"></span>
                    <span class="terms-text">I agree to the 
                        <a class="terms-link" onclick="openModal('termsModal')">Terms of Service</a> 
                        and 
                        <a class="terms-link" onclick="openModal('privacyModal')">Privacy Policy</a>
                    </span>
                </div>

                <button type="submit" class="signup-button" id="signupButton">
                    <span>Create Account</span>
                </button>

                <div class="social-signup">
                    <div class="divider">
                        <span class="divider-line"></span>
                        <span class="divider-text">OR</span>
                        <span class="divider-line"></span>
                    </div>
                    <div class="social-buttons">
                        <button type="button" class="social-button google">
                            <i class="fab fa-google"></i>
                            Sign up with Google
                        </button>
                        <button type="button" class="social-button facebook">
                            <i class="fab fa-facebook-f"></i>
                            Sign up with Facebook
                        </button>
                    </div>
                </div>
            </form>

            <div class="signup-footer">
                <p>Already have an account?
                    <a href="../index.php" class="login-link">Log in</a>
                </p>
            </div>
        </div>
    </div>

    <!-- Terms of Service Modal -->
    <div id="termsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Terms of Service</h2>
                <span class="close-modal" onclick="closeModal('termsModal')">&times;</span>
            </div>
            <div class="modal-body">
                <div class="terms-content">
                    <div class="highlight-box">
                        <p><strong>Important:</strong> By using the OSAS Management System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
                    </div>
                    
                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing and using the OSAS (Office of Student Affairs and Services) Management System, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</p>
                    
                    <h3>2. User Accounts</h3>
                    <p>You must provide accurate, current, and complete information during registration. Student ID must match official university records. You are responsible for maintaining the confidentiality of your account credentials.</p>
                    
                    <h3>3. Permitted Uses</h3>
                    <p>You may use the OSAS System for:</p>
                    <ul>
                        <li>Submitting student organization applications</li>
                        <li>Requesting student documents and certifications</li>
                        <li>Accessing student services and support</li>
                        <li>Viewing academic and co-curricular records</li>
                        <li>Communicating with OSAS staff</li>
                        <li>Registering for student activities and events</li>
                    </ul>
                    
                    <h3>4. Prohibited Activities</h3>
                    <p>You agree NOT to:</p>
                    <ul>
                        <li>Use false information or impersonate others</li>
                        <li>Attempt to gain unauthorized access to system data</li>
                        <li>Upload or transmit viruses or malicious code</li>
                        <li>Use the system for commercial purposes</li>
                        <li>Harass other users or OSAS staff</li>
                        <li>Violate university policies or codes of conduct</li>
                    </ul>
                    
                    <h3>5. Data Privacy and Security</h3>
                    <p>All data is protected under the Data Privacy Act of 2012. Information is stored on secure servers with role-based access control. Regular security audits are conducted to ensure data protection.</p>
                    
                    <h3>6. Service Availability</h3>
                    <p>The system is available 24/7 except during maintenance periods. We reserve the right to modify or discontinue services with appropriate notice. Scheduled maintenance will be announced in advance.</p>
                    
                    <h3>7. Termination of Access</h3>
                    <p>Access to the OSAS System may be suspended or terminated for violation of these Terms of Service, graduation or separation from the university, academic or disciplinary suspension, or extended periods of inactivity.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="modal-button secondary" onclick="closeModal('termsModal')">Close</button>
                <button type="button" class="modal-button primary" onclick="acceptTerms()">I Accept</button>
            </div>
        </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div id="privacyModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Privacy Policy</h2>
                <span class="close-modal" onclick="closeModal('privacyModal')">&times;</span>
            </div>
            <div class="modal-body">
                <div class="terms-content">
                    <div class="highlight-box">
                        <p><strong>Data Privacy Notice:</strong> Your privacy rights are protected under Republic Act No. 10173 (Data Privacy Act of 2012).</p>
                    </div>
                    
                    <h3>1. Information We Collect</h3>
                    <p>We collect personal identification information, academic records, student organization memberships, service utilization data, and system usage analytics necessary for providing OSAS services.</p>
                    
                    <h3>2. How We Use Your Information</h3>
                    <ul>
                        <li>Provide and maintain student services</li>
                        <li>Process applications and requests</li>
                        <li>Communicate important announcements</li>
                        <li>Monitor and improve system performance</li>
                        <li>Ensure compliance with university policies</li>
                        <li>Generate statistical reports for institutional planning</li>
                    </ul>
                    
                    <h3>3. Data Sharing and Disclosure</h3>
                    <p>Your information may be shared with academic departments for student support, university administration for reporting, and faculty advisors for guidance purposes. We do not sell, trade, or rent your personal information to third parties for commercial purposes.</p>
                    
                    <h3>4. Data Security</h3>
                    <p>We implement encryption of sensitive data, regular security audits, role-based access control systems, and secure data backup procedures to protect your information.</p>
                    
                    <h3>5. Your Rights</h3>
                    <p>Under the Data Privacy Act of 2012, you have the right to:</p>
                    <ul>
                        <li>Access your personal information</li>
                        <li>Correct inaccurate or incomplete data</li>
                        <li>Request deletion of personal data (with limitations)</li>
                        <li>Object to processing of personal data</li>
                        <li>Data portability for certain information</li>
                    </ul>
                    
                    <h3>6. Data Retention</h3>
                    <p>Active student records are retained throughout enrollment. Alumni records are retained for 10 years after graduation. Financial and disciplinary records are retained for 7 years. System logs are retained for 2 years.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="modal-button secondary" onclick="closeModal('privacyModal')">Close</button>
                <button type="button" class="modal-button primary" onclick="acceptTerms()">I Accept</button>
            </div>
        </div>
    </div>

  <script src="../assets/js/register.js"></script>
</body>
</html>