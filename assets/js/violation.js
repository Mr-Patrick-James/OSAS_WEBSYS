// violations.js - COMPLETE WORKING VERSION
function initViolationsModule() {
    console.log('🛠 Violations module initializing...');
    
    try {
        // ========== DYNAMIC API PATH DETECTION ==========
        // Detect the correct API path based on current page location
        function getAPIBasePath() {
            const currentPath = window.location.pathname;
            console.log('📍 Current path:', currentPath);
            
            // Try to extract the base project path from the URL
            // e.g., /OSAS_WEBSYS/pages/admin_page/Violations.php -> /OSAS_WEBSYS/
            const pathMatch = currentPath.match(/^(\/[^\/]+)\//);
            const projectBase = pathMatch ? pathMatch[1] : '';
            console.log('📁 Project base:', projectBase);
            
            // Use absolute path from project root for reliability
            if (projectBase) {
                // We have a project folder (e.g., /OSAS_WEBSYS)
                return projectBase + '/api/';
            }
            
            // Fallback to relative paths
            // Check if we're in pages/admin_page/ directory
            if (currentPath.includes('/pages/admin_page/')) {
                return '../../api/';
            }
            // Check if we're in pages/ directory (user pages, etc.)
            else if (currentPath.includes('/pages/')) {
                return '../api/';
            }
            // Default: we're in the root or another location
            else {
                return 'api/';
            }
        }
        
        const API_BASE = getAPIBasePath();
        console.log('🔗 API Base Path:', API_BASE);
        console.log('🌐 Full API URL will be:', window.location.origin + API_BASE + 'violations.php');

        // Helper function to convert relative image paths to absolute URLs
        function getImageUrl(imagePath, fallbackName = 'Student') {
            if (!imagePath || imagePath.trim() === '') {
                // Return a default avatar with the name
                return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=ffd700&color=333&size=80`;
            }
            
            // If it's already a full URL (http/https or data:), return as-is
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
                return imagePath;
            }
            
            // Extract project base from API_BASE (e.g., /OSAS_WEBSYS/)
            const projectBase = API_BASE.replace('/api/', '/');
            
            // If the path starts with assets/, prepend the project base
            if (imagePath.startsWith('assets/')) {
                return projectBase + imagePath;
            }
            
            // If the path starts with ../, it's a relative path from pages/admin_page/
            if (imagePath.startsWith('../')) {
                // Remove ../ and use project base
                return projectBase + imagePath.replace(/^\.\.\//, '');
            }
            
            // If it's just a filename, assume it's in assets/img/students/
            if (!imagePath.includes('/')) {
                return projectBase + 'assets/img/students/' + imagePath;
            }
            
            // Default: prepend project base
            return projectBase + imagePath;
        }

        // Elements
        const tableBody = document.getElementById('ViolationsTableBody');
        const btnAddViolation = document.getElementById('btnAddViolations');
        const btnRecordFirst = document.getElementById('btnRecordFirstViolation');
        const recordModal = document.getElementById('ViolationRecordModal');
        const detailsModal = document.getElementById('ViolationDetailsModal');
        const closeRecordBtn = document.getElementById('closeRecordModal');
        const closeDetailsBtn = document.getElementById('closeDetailsModal');
        const cancelRecordBtn = document.getElementById('cancelRecordModal');
        const recordOverlay = document.getElementById('ViolationModalOverlay');
        const detailsOverlay = document.getElementById('DetailsModalOverlay');
        const searchInput = document.getElementById('searchViolation');
        const deptFilter = document.getElementById('ViolationsFilter');
        const statusFilter = document.getElementById('ViolationsStatusFilter');
        const printBtn = document.getElementById('btnPrintViolations');
        const studentSearchInput = document.getElementById('studentSearch');
        const searchStudentBtn = document.getElementById('searchStudentBtn');
        const selectedStudentCard = document.getElementById('selectedStudentCard');
        const violationForm = document.getElementById('ViolationRecordForm');

        // Debug logging
        console.log('🔍 Modal found:', recordModal);
        console.log('🔍 Button found:', btnAddViolation);

        if (!btnAddViolation) {
            console.error('❌ #btnAddViolations NOT FOUND!');
            return;
        }

        if (!recordModal) {
            console.error('❌ #ViolationRecordModal NOT FOUND!');
            return;
        }

        // ========== DATA & CONFIG ==========
        
        // Dynamic data
        let violations = [];
        let students = [];
        let isLoading = false;

        // Student data will be loaded dynamically

        // ========== DATA LOADING FUNCTIONS ==========

        // Check API connectivity - using GET instead of HEAD for better compatibility
        async function checkAPIConnectivity() {
            try {
                console.log('🔍 Checking API connectivity...');
                console.log('🔗 Using API path:', API_BASE);

                let violationsOk = false;
                let studentsOk = false;

                // Test violations API with actual GET request
                try {
                    const violationsResponse = await fetch(API_BASE + 'violations.php');
                    console.log('Violations API status:', violationsResponse.status);
                    // Consider it OK if we get any response (even error JSON is fine - means API is accessible)
                    violationsOk = violationsResponse.status !== 404;
                    if (violationsOk) {
                        const text = await violationsResponse.text();
                        console.log('Violations API response preview:', text.substring(0, 100));
                        // Check if it's valid JSON (not an HTML error page)
                        try {
                            JSON.parse(text);
                            violationsOk = true;
                        } catch (e) {
                            console.warn('Violations API returned non-JSON:', text.substring(0, 200));
                            violationsOk = false;
                        }
                    }
                } catch (e) {
                    console.error('Violations API check error:', e);
                }

                // Test students API with actual GET request
                try {
                    const studentsResponse = await fetch(API_BASE + 'students.php');
                    console.log('Students API status:', studentsResponse.status);
                    studentsOk = studentsResponse.status !== 404;
                    if (studentsOk) {
                        const text = await studentsResponse.text();
                        console.log('Students API response preview:', text.substring(0, 100));
                        try {
                            JSON.parse(text);
                            studentsOk = true;
                        } catch (e) {
                            console.warn('Students API returned non-JSON:', text.substring(0, 200));
                            studentsOk = false;
                        }
                    }
                } catch (e) {
                    console.error('Students API check error:', e);
                }

                return {
                    violations: violationsOk,
                    students: studentsOk
                };
            } catch (error) {
                console.error('API connectivity check failed:', error);
                return { violations: false, students: false };
            }
        }

        // Show/Hide global loading overlay
        function showLoadingOverlay(message = 'Loading...') {
            let overlay = document.getElementById('ViolationsLoadingOverlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'ViolationsLoadingOverlay';
                overlay.className = 'violations-loading-overlay';
                overlay.innerHTML = `
                    <div class="violations-loading-content">
                        <i class='bx bx-loader-alt bx-spin'></i>
                        <div class="violations-loading-text">${message}</div>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'flex';
            overlay.querySelector('.violations-loading-text').textContent = message;
        }

        function hideLoadingOverlay() {
            const overlay = document.getElementById('ViolationsLoadingOverlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }
        async function loadViolations(showLoading = true) {
            try {
                if (showLoading) showLoadingOverlay('Loading violations...');
        
                console.log('🔄 Loading violations data...');
        
                const response = await fetch(API_BASE + 'violations.php');
                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Unknown error');
                    console.error('HTTP Error Response:', errorText);
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
        
                const data = await response.json();
                console.log('API Response:', data);
        
                if (data.status === 'error') {
                    throw new Error(data.message || 'API returned error status');
                }
        
                // FIXED: Make sure we're accessing the correct property
                violations = data.violations || data.data || [];
                console.log(`✅ Loaded ${violations.length} violations`);
        
                // Process violations to fix image paths
                violations = violations.map(v => {
                    return {
                        ...v,
                        studentImage: getImageUrl(v.studentImage, v.studentName || 'Student')
                    };
                });

                // Debug: Check first violation structure
                if (violations.length > 0) {
                    console.log('First violation sample:', violations[0]);
                    console.log('Violation properties:', Object.keys(violations[0]));
                    console.log('Student image URL:', violations[0].studentImage);
                }
        
                return violations;
            } catch (error) {
                console.error('❌ Error loading violations:', error);
                console.error('Error details:', error.stack);
        
                // Check if it's a network error
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    showNotification('Violations API not available. Please check if the violations.php file exists in the api directory.', 'warning', 8000);
                } else {
                    showNotification('Failed to load violations: ' + error.message, 'error');
                }
        
                violations = [];
                return [];
            } finally {
                if (showLoading) hideLoadingOverlay();
            }
        }
        async function loadStudents(showLoading = false) {
            try {
                if (showLoading) showLoadingOverlay('Loading students...');

                console.log('🔄 Loading students data...');

                const response = await fetch(API_BASE + 'students.php');
                if (!response.ok) {
                    const errorText = await response.text().catch(() => 'Unknown error');
                    console.error('Students API Error Response:', errorText);
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Students API Response:', data);

                if (data.status === 'error') {
                    throw new Error(data.message || 'API returned error');
                }

                // Handle different response formats
                students = data.students || data.data || [];
                console.log(`✅ Loaded ${students.length} students`);

                // Process student data to fix image paths
                students = students.map(student => {
                    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
                    return {
                        ...student,
                        avatar: getImageUrl(student.avatar, fullName)
                    };
                });

                // Validate student data structure
                if (students.length > 0) {
                    const firstStudent = students[0];
                    console.log('Student data structure:', {
                        hasId: 'studentId' in firstStudent,
                        hasName: 'firstName' in firstStudent && 'lastName' in firstStudent,
                        sampleId: firstStudent.studentId,
                        sampleName: `${firstStudent.firstName} ${firstStudent.lastName}`,
                        avatar: firstStudent.avatar
                    });
                }

                return students;
            } catch (error) {
                console.error('❌ Error loading students:', error);
                console.error('Error details:', error.stack);

                // Check if it's a network error
                if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    showNotification('Students API not available. Student search may not work properly.', 'warning', 8000);
                } else {
                    showNotification('Failed to load students data: ' + error.message, 'error');
                }

                // Fallback to empty array
                students = [];
                return [];
            } finally {
                if (showLoading) hideLoadingOverlay();
            }
        }

        // Refresh data function
        async function refreshData() {
            try {
                showLoadingOverlay('Refreshing data...');

                // Load data in parallel
                await Promise.all([
                    loadViolations(false),
                    loadStudents(false)
                ]);

                // Re-render everything
                renderViolations();
                updateStats();

                showNotification('Data refreshed successfully', 'success');
            } catch (error) {
                console.error('❌ Error refreshing data:', error);
                showNotification('Failed to refresh data', 'error');
            } finally {
                hideLoadingOverlay();
            }
        }

        // Notification system
        function showNotification(message, type = 'info', duration = 3000) {
            // Remove existing notifications
            const existingNotifications = document.querySelectorAll('.violations-notification');
            existingNotifications.forEach(notification => notification.remove());

            // Create notification element
            const notification = document.createElement('div');
            notification.className = `violations-notification ${type}`;
            notification.innerHTML = `
                <i class='bx bx-${type === 'success' ? 'check' : type === 'error' ? 'x' : type === 'warning' ? 'error' : 'info'}-circle'></i>
                <span>${message}</span>
                <button class="violations-notification-close" onclick="this.parentElement.remove()">
                    <i class='bx bx-x'></i>
                </button>
            `;

            // Add to page
            document.body.appendChild(notification);

            // Auto remove after duration
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, duration);
            }

            return notification;
        }

        async function saveViolation(violationData) {
            try {
                console.log('💾 Saving violation...', violationData);

                showLoadingOverlay('Saving violation...');

                const response = await fetch(API_BASE + 'violations.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(violationData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.status === 'error') {
                    throw new Error(result.message);
                }

                console.log('✅ Violation saved successfully');

                // Reload violations data
                await loadViolations(false);
                renderViolations();

                showNotification('Violation recorded successfully!', 'success');
                return result;
            } catch (error) {
                console.error('❌ Error saving violation:', error);
                showNotification('Failed to save violation: ' + error.message, 'error');
                throw error;
            } finally {
                hideLoadingOverlay();
            }
        }

        async function updateViolation(violationId, violationData) {
            try {
                console.log('📝 Updating violation...', violationId, violationData);

                showLoadingOverlay('Updating violation...');

                const response = await fetch(API_BASE + `violations.php?id=${violationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(violationData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.status === 'error') {
                    throw new Error(result.message);
                }

                console.log('✅ Violation updated successfully');

                // Reload violations data
                await loadViolations(false);
                renderViolations();

                showNotification('Violation updated successfully!', 'success');
                return result;
            } catch (error) {
                console.error('❌ Error updating violation:', error);
                showNotification('Failed to update violation: ' + error.message, 'error');
                throw error;
            } finally {
                hideLoadingOverlay();
            }
        }

        async function deleteViolation(violationId) {
            try {
                console.log('🗑️ Deleting violation...', violationId);

                showLoadingOverlay('Deleting violation...');

                const response = await fetch(API_BASE + `violations.php?id=${violationId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                if (result.status === 'error') {
                    throw new Error(result.message);
                }

                console.log('✅ Violation deleted successfully');

                // Reload violations data
                await loadViolations(false);
                renderViolations();

                showNotification('Violation deleted successfully!', 'success');
                return true;
            } catch (error) {
                console.error('❌ Error deleting violation:', error);
                showNotification('Failed to delete violation: ' + error.message, 'error');
                throw error;
            } finally {
                hideLoadingOverlay();
            }
        }

        // ========== HELPER FUNCTIONS ==========
        
        function formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        function getViolationTypeClass(type) {
            const classes = {
                'improper_uniform': 'uniform',
                'improper_footwear': 'footwear',
                'no_id': 'id',
                'misconduct': 'behavior'
            };
            return classes[type] || 'default';
        }

        function getViolationLevelClass(level) {
            if (level.startsWith('permitted')) return 'permitted';
            if (level.startsWith('warning')) return 'warning';
            if (level === 'disciplinary') return 'disciplinary';
            return 'default';
        }

        function getDepartmentClass(dept) {
            const classes = {
                'BSIS': 'bsis',
                'WFT': 'wft',
                'BTVTED': 'btvted',
                'CHS': 'chs'
            };
            return classes[dept] || 'default';
        }

        function getStatusClass(status) {
            const classes = {
                'permitted': 'permitted',
                'warning': 'warning',
                'disciplinary': 'disciplinary',
                'resolved': 'resolved'
            };
            return classes[status] || 'default';
        }

        function generateCaseId() {
            const year = new Date().getFullYear();
            const lastId = violations.length > 0 ? Math.max(...violations.map(v => parseInt(v.caseId.split('-').pop()))) : 0;
            return `VIOL-${year}-${String(lastId + 1).padStart(3, '0')}`;
        }

        // ========== STUDENT DETAILS FUNCTIONS ==========

        // Check if search term looks like a student ID
        function isStudentIdSearch(searchTerm) {
            if (!searchTerm || searchTerm.trim() === '') return false;

            const term = searchTerm.trim().toLowerCase();

            // Check for student ID patterns (contains numbers, specific formats)
            const studentIdPatterns = [
                /^\d{4}-\d{3,4}$/,  // 2024-001 format
                /^\d{7,8}$/,        // 2024001 format
                /^20\d{2}-\d{3,4}$/, // Year-based format
                /^student.*\d/i,    // Contains "student" and numbers
                /\b\d{3,4}\b/       // 3-4 digit numbers (student IDs)
            ];

            return studentIdPatterns.some(pattern => pattern.test(term));
        }

        // Find student by search term
        function findStudentBySearchTerm(searchTerm) {
            if (!searchTerm || !students.length) return null;

            const term = searchTerm.trim().toLowerCase();

            // First try exact student ID match
            let student = students.find(s =>
                s.studentId.toLowerCase() === term ||
                s.studentId.toLowerCase().includes(term)
            );

            if (student) return student;

            // Then try name match
            student = students.find(s =>
                s.firstName.toLowerCase().includes(term) ||
                s.lastName.toLowerCase().includes(term) ||
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(term)
            );

            return student;
        }

        // Get all violations for a specific student
        function getStudentViolations(studentId) {
            return violations.filter(v => v.studentId === studentId);
        }

        // Render student details panel
        function renderStudentDetails(student, studentViolations) {
            const panel = document.getElementById('studentDetailsPanel');
            if (!panel || !student) return;

            // Calculate statistics
            const totalViolations = studentViolations.length;
            const resolvedViolations = studentViolations.filter(v => v.status === 'resolved').length;
            const pendingViolations = studentViolations.filter(v => ['warning', 'permitted'].includes(v.status)).length;
            const disciplinaryViolations = studentViolations.filter(v => v.status === 'disciplinary').length;

            // Render student profile
            const profileCard = document.getElementById('studentProfileCard');
            const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
            const studentImageUrl = getImageUrl(student.avatar, fullName);
            
            profileCard.innerHTML = `
                <div class="student-profile-image">
                    <img src="${studentImageUrl}"
                         alt="${fullName}"
                         onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ffd700&color=333&size=80'">
                </div>
                <div class="student-profile-info">
                    <h3>${fullName}</h3>
                    <div class="student-profile-meta">
                        <span class="student-id">ID: ${student.studentId}</span>
                        <span>Department: ${student.department || 'N/A'}</span>
                        <span>Section: ${student.section || 'N/A'}</span>
                        <span>Contact: ${student.contact || 'N/A'}</span>
                    </div>
                </div>
            `;

            // Render statistics
            const statsGrid = document.getElementById('studentStatsGrid');
            statsGrid.innerHTML = `
                <div class="student-stat-card">
                    <div class="student-stat-number">${totalViolations}</div>
                    <div class="student-stat-label">Total Violations</div>
                </div>
                <div class="student-stat-card">
                    <div class="student-stat-number">${resolvedViolations}</div>
                    <div class="student-stat-label">Resolved</div>
                </div>
                <div class="student-stat-card">
                    <div class="student-stat-number">${pendingViolations}</div>
                    <div class="student-stat-label">Pending</div>
                </div>
                <div class="student-stat-card">
                    <div class="student-stat-number">${disciplinaryViolations}</div>
                    <div class="student-stat-label">Disciplinary</div>
                </div>
            `;

            // Render violation timeline
            const timeline = document.getElementById('studentViolationsTimeline');

            if (studentViolations.length === 0) {
                timeline.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--dark-grey);">
                        <i class='bx bx-check-circle' style="font-size: 48px; margin-bottom: 16px;"></i>
                        <div>No violations found for this student</div>
                    </div>
                `;
            } else {
                // Sort violations by date (newest first)
                const sortedViolations = [...studentViolations].sort((a, b) =>
                    new Date(b.dateReported) - new Date(a.dateReported)
                );

                timeline.innerHTML = sortedViolations.map(violation => {
                    const statusClass = getStatusClass(violation.status);
                    const typeClass = getViolationTypeClass(violation.violationType);

                    return `
                        <div class="student-violation-item">
                            <div class="student-violation-icon ${statusClass}">
                                <i class='bx bx-${violation.status === 'resolved' ? 'check' : violation.status === 'disciplinary' ? 'x' : 'error'}-circle'></i>
                            </div>
                            <div class="student-violation-content">
                                <div class="student-violation-header">
                                    <span class="student-violation-case">${violation.caseId}</span>
                                    <span class="student-violation-date">${violation.dateTime}</span>
                                </div>
                                <div class="student-violation-type">${violation.violationTypeLabel} - ${violation.violationLevelLabel}</div>
                                <div class="student-violation-location">Location: ${violation.locationLabel}</div>
                                ${violation.notes ? `<div class="student-violation-notes">"${violation.notes}"</div>` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            // Show the panel
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Hide student details panel
        function hideStudentDetails() {
            const panel = document.getElementById('studentDetailsPanel');
            if (panel) {
                panel.style.display = 'none';
            }
        }

        // ========== RENDER FUNCTIONS ==========
        
        function renderViolations() {
            console.log('🎨 renderViolations called, tableBody exists:', !!tableBody);
            console.log('📊 Current violations data:', violations.length, 'items');

            if (!tableBody) {
                console.error('❌ tableBody element not found!');
                return;
            }

            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const deptValue = deptFilter ? deptFilter.value : 'all';
            const statusValue = statusFilter ? statusFilter.value : 'all';

            console.log('🔍 Filter values:', { searchTerm, deptValue, statusValue });

            const filteredViolations = violations.filter(v => {
                if (!v) {
                    console.warn('⚠️ Found null/undefined violation object');
                    return false;
                }

                const matchesSearch = v.studentName.toLowerCase().includes(searchTerm) ||
                                    v.caseId.toLowerCase().includes(searchTerm) ||
                                    v.studentId.toLowerCase().includes(searchTerm) ||
                                    v.violationTypeLabel.toLowerCase().includes(searchTerm);
                const matchesDept = deptValue === 'all' || v.department === deptValue;
                const matchesStatus = statusValue === 'all' || v.status === statusValue;

                console.log(`🔍 Violation ${v.caseId}: search=${matchesSearch}, dept=${matchesDept}, status=${matchesStatus}`);
                return matchesSearch && matchesDept && matchesStatus;
            });

            console.log('📋 Filtered violations:', filteredViolations.length, 'items');

            // Check for student ID search and show student details
            const trimmedSearchTerm = searchInput ? searchInput.value.trim() : '';
            if (trimmedSearchTerm && isStudentIdSearch(trimmedSearchTerm)) {
                const foundStudent = findStudentBySearchTerm(trimmedSearchTerm);
                if (foundStudent) {
                    const studentViolations = getStudentViolations(foundStudent.studentId);
                    renderStudentDetails(foundStudent, studentViolations);
                } else {
                    hideStudentDetails();
                }
            } else {
                hideStudentDetails();
            }

            // Show/hide empty state
            const emptyState = document.getElementById('ViolationsEmptyState');
            if (emptyState) {
                emptyState.style.display = filteredViolations.length === 0 ? 'flex' : 'none';
                console.log('📭 Empty state display:', filteredViolations.length === 0 ? 'shown' : 'hidden');
            }

            console.log('🛠️ Generating table rows for', filteredViolations.length, 'violations');

            const tableRows = filteredViolations.map(v => {
                console.log('📝 Processing violation:', v.caseId, v.studentName);

                const typeClass = getViolationTypeClass(v.violationType);
                const levelClass = getViolationLevelClass(v.violationLevel);
                const deptClass = getDepartmentClass(v.department);
                const statusClass = getStatusClass(v.status);

                return `
                <tr data-id="${v.id}">
                    <td class="violation-case-id">${v.caseId}</td>
                    <td class="violation-student-cell">
                        <div class="violation-student-info">
                            <div class="violation-student-image">
                                <img src="${v.studentImage}" 
                                     alt="${v.studentName}" 
                                     class="student-avatar"
                                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(v.studentName)}&background=ffd700&color=333&size=40'">
                            </div>
                            <div class="violation-student-name">
                                <strong>${v.studentName}</strong>
                            </div>
                        </div>
                    </td>
                    <td class="violation-student-id">${v.studentId}</td>
                    <td class="violation-type">
                        <span class="violation-type-badge ${typeClass}">${v.violationTypeLabel}</span>
                    </td>
                    <td class="violation-level">
                        <span class="violation-level-badge ${levelClass}">${v.violationLevelLabel}</span>
                    </td>
                    <td class="violation-dept">
                        <span class="dept-badge ${deptClass}">${v.department}</span>
                    </td>
                    <td class="violation-section">${v.section}</td>
                    <td class="violation-date">${formatDate(v.dateReported)}</td>
                    <td>
                        <span class="Violations-status-badge ${statusClass}">${v.statusLabel}</span>
                    </td>
                    <td>
                        <div class="Violations-action-buttons">
                            <button class="Violations-action-btn view" data-id="${v.id}" title="View Details">
                                <i class='bx bx-show'></i>
                            </button>
                            <button class="Violations-action-btn edit" data-id="${v.id}" title="Edit">
                                <i class='bx bx-edit'></i>
                            </button>
                            ${v.status === 'resolved' ? 
                                `<button class="Violations-action-btn reopen" data-id="${v.id}" title="Reopen">
                                    <i class='bx bx-rotate-left'></i>
                                </button>` : 
                                `<button class="Violations-action-btn resolve" data-id="${v.id}" title="Mark Resolved">
                                    <i class='bx bx-check'></i>
                                </button>`
                            }
                        </div>
                    </td>
                </tr>
            `});

            console.log('📄 Generated HTML rows:', tableRows.length, 'table rows');
            console.log('📄 First row preview:', tableRows[0] ? tableRows[0].substring(0, 100) + '...' : 'No rows');

            tableBody.innerHTML = tableRows.join('');

            console.log('✅ Table HTML set, row count in DOM:', tableBody.querySelectorAll('tr').length);

            updateStats();
            updateCounts(filteredViolations);

            updateStats();
            updateCounts(filteredViolations);
        }

        function updateStats() {
            const total = violations.length;
            const resolved = violations.filter(v => v.status === 'resolved').length;
            const pending = violations.filter(v => v.status === 'warning' || v.status === 'permitted').length;
            const disciplinary = violations.filter(v => v.status === 'disciplinary').length;
            
            const totalEl = document.getElementById('totalViolations');
            const resolvedEl = document.getElementById('resolvedViolations');
            const pendingEl = document.getElementById('pendingViolations');
            const disciplinaryEl = document.getElementById('disciplinaryViolations');
            
            if (totalEl) totalEl.textContent = total;
            if (resolvedEl) resolvedEl.textContent = resolved;
            if (pendingEl) pendingEl.textContent = pending;
            if (disciplinaryEl) disciplinaryEl.textContent = disciplinary;
        }

        function updateCounts(filteredViolations) {
            const showingEl = document.getElementById('showingViolationsCount');
            const totalCountEl = document.getElementById('totalViolationsCount');
            
            if (showingEl) showingEl.textContent = filteredViolations.length;
            if (totalCountEl) totalCountEl.textContent = violations.length;
        }

        // ========== MODAL FUNCTIONS ==========
        
        function openRecordModal(editId = null) {
            console.log('🎯 Opening record modal...');
            recordModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            const dateInput = document.getElementById('violationDate');
            if (dateInput) dateInput.value = today;
            
            // Set current time
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const timeInput = document.getElementById('violationTime');
            if (timeInput) timeInput.value = timeStr;
            
            const modalTitle = document.getElementById('violationModalTitle');
            const form = document.getElementById('ViolationRecordForm');
            
            if (editId) {
                // Edit mode
                modalTitle.textContent = 'Edit Violation';
                const violation = violations.find(v => v.id === editId);
                if (violation) {
                    // Populate student info
                    document.getElementById('modalStudentId').textContent = violation.studentId;
                    document.getElementById('modalStudentName').textContent = violation.studentName;
                    const modalStudentImage = document.getElementById('modalStudentImage');
                    if (modalStudentImage) modalStudentImage.src = violation.studentImage;
                    document.getElementById('modalStudentDept').textContent = violation.studentDept;
                    document.getElementById('modalStudentSection').textContent = violation.studentSection;
                    document.getElementById('modalStudentContact').textContent = violation.studentContact;
                    if (selectedStudentCard) selectedStudentCard.style.display = 'flex';

                    // Set violation type
                    const typeRadio = document.querySelector(`input[name="violationType"][value="${violation.violationType}"]`);
                    if (typeRadio) typeRadio.checked = true;

                    // Set violation level
                    const levelRadio = document.querySelector(`input[name="violationLevel"][value="${violation.violationLevel}"]`);
                    if (levelRadio) levelRadio.checked = true;

                    // Set other fields
                    document.getElementById('violationDate').value = violation.dateReported;
                    document.getElementById('violationTime').value = violation.violationTime || '08:15';
                    document.getElementById('violationLocation').value = violation.location;
                    document.getElementById('reportedBy').value = violation.reportedBy;
                    document.getElementById('violationNotes').value = violation.notes || '';

                    // Update notes counter
                    updateNotesCounter((violation.notes || '').length);
                }
                recordModal.dataset.editingId = editId;
            } else {
                // Add new mode
                modalTitle.textContent = 'Record New Violation';
                if (form) {
                    form.reset();
                    // Re-set default values after reset
                    setTimeout(() => {
                        const today = new Date().toISOString().split('T')[0];
                        const dateInput = document.getElementById('violationDate');
                        if (dateInput && !dateInput.value) dateInput.value = today;

                        const now = new Date();
                        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                        const timeInput = document.getElementById('violationTime');
                        if (timeInput && !timeInput.value) timeInput.value = timeStr;
                    }, 50);
                }
                if (selectedStudentCard) selectedStudentCard.style.display = 'none';
                delete recordModal.dataset.editingId;

                // Reset notes counter
                updateNotesCounter(0);
            }

            // Reset form validation state and progress
            formValidationState = {
                isValid: false,
                errors: {},
                touched: {}
            };

            // Clear all field errors
            document.querySelectorAll('.field-error').forEach(el => {
                if (el.tagName === 'DIV') el.remove();
                else el.classList.remove('field-error');
            });

            // Reset progress bar
            updateFormProgress(0, 8);

            // Initial validation after a short delay to ensure all fields are populated
            setTimeout(() => {
                console.log('Running initial form validation...');
                validateEntireForm();
            }, 150);
        }

        function openDetailsModal(violationId) {
            if (!detailsModal) return;
            
            const violation = violations.find(v => v.id === violationId);
            if (!violation) return;
            
            console.log('Opening details modal for violation:', violation);
            
            // Helper functions for safe element access
            const setElementText = (id, text) => {
                const el = document.getElementById(id);
                if (el) el.textContent = text || 'N/A';
            };
            
            const setElementSrc = (id, src) => {
                const el = document.getElementById(id);
                if (el) el.src = src;
            };
            
            const setElementClass = (id, className) => {
                const el = document.getElementById(id);
                if (el) el.className = className;
            };
            
            // Case header
            setElementText('detailCaseId', violation.caseId);
            setElementText('detailStatusBadge', violation.statusLabel);
            setElementClass('detailStatusBadge', `case-status-badge ${getStatusClass(violation.status)}`);
            
            // Student info with fixed image URL
            const studentImageUrl = getImageUrl(violation.studentImage, violation.studentName);
            console.log('📷 Detail modal student image URL:', studentImageUrl);
            setElementSrc('detailStudentImage', studentImageUrl);
            setElementText('detailStudentName', violation.studentName);
            setElementText('detailStudentId', violation.studentId);
            setElementText('detailStudentDept', violation.department);
            setElementClass('detailStudentDept', `student-dept badge ${getDepartmentClass(violation.department)}`);
            setElementText('detailStudentSection', violation.section);
            setElementText('detailStudentContact', violation.studentContact);
            
            // Violation details
            setElementText('detailViolationType', violation.violationTypeLabel);
            setElementClass('detailViolationType', `detail-value badge ${getViolationTypeClass(violation.violationType)}`);
            setElementText('detailViolationLevel', violation.violationLevelLabel);
            setElementClass('detailViolationLevel', `detail-value badge ${getViolationLevelClass(violation.violationLevel)}`);
            setElementText('detailDateTime', violation.dateTime);
            setElementText('detailLocation', violation.locationLabel);
            setElementText('detailReportedBy', violation.reportedBy);
            setElementText('detailStatus', violation.statusLabel);
            setElementClass('detailStatus', `detail-value badge ${getStatusClass(violation.status)}`);
            setElementText('detailNotes', violation.notes || 'No notes available.');
            
            // Populate timeline if it exists and violation has history
            const timelineEl = document.getElementById('detailTimeline');
            if (timelineEl && violation.history && violation.history.length > 0) {
                timelineEl.innerHTML = violation.history.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <span class="timeline-date">${item.date}</span>
                            <span class="timeline-title">${item.title}</span>
                            <span class="timeline-desc">${item.desc}</span>
                        </div>
                    </div>
                `).join('');
            }
            
            detailsModal.dataset.viewingId = violationId;
            detailsModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Update action buttons visibility based on status
            const detailResolveBtn = document.getElementById('detailResolveBtn');
            const detailEscalateBtn = document.getElementById('detailEscalateBtn');
            
            if (detailResolveBtn) {
                if (violation.status === 'resolved') {
                    detailResolveBtn.style.display = 'none';
                } else {
                    detailResolveBtn.style.display = 'inline-flex';
                }
            }

            if (detailEscalateBtn) {
                if (violation.status === 'disciplinary' || violation.status === 'resolved') {
                    detailEscalateBtn.style.display = 'none';
                } else {
                    detailEscalateBtn.style.display = 'inline-flex';
                }
            }
        }

        function closeRecordModal() {
            console.log('Closing record modal');
            recordModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form if exists
            const form = document.getElementById('ViolationRecordForm');
            if (form) form.reset();
            
            // Hide student card
            const studentCard = document.getElementById('selectedStudentCard');
            if (studentCard) studentCard.style.display = 'none';
            
            delete recordModal.dataset.editingId;
        }

        function closeDetailsModal() {
            if (!detailsModal) return;
            detailsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            delete detailsModal.dataset.viewingId;
        }

        // ========== EVENT HANDLERS ==========
        
        function handleTableClick(e) {
            const viewBtn = e.target.closest('.Violations-action-btn.view');
            const editBtn = e.target.closest('.Violations-action-btn.edit');
            const resolveBtn = e.target.closest('.Violations-action-btn.resolve');
            const reopenBtn = e.target.closest('.Violations-action-btn.reopen');

            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.id);
                openDetailsModal(id);
            }

            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                openRecordModal(id);
            }

            if (resolveBtn) {
                const id = parseInt(resolveBtn.dataset.id);
                const violation = violations.find(v => v.id === id);
                if (violation && confirm(`Mark violation ${violation.caseId} as resolved?`)) {
                    updateViolation(id, { status: 'resolved' })
                        .then(() => {
                            alert('Violation marked as resolved!');
                        })
                        .catch(error => {
                            console.error('Error resolving violation:', error);
                            alert('Failed to resolve violation. Please try again.');
                        });
                }
            }

            if (reopenBtn) {
                const id = parseInt(reopenBtn.dataset.id);
                const violation = violations.find(v => v.id === id);
                if (violation && confirm(`Reopen violation ${violation.caseId}?`)) {
                    updateViolation(id, { status: 'warning' })
                        .then(() => {
                            alert('Violation reopened!');
                        })
                        .catch(error => {
                            console.error('Error reopening violation:', error);
                            alert('Failed to reopen violation. Please try again.');
                        });
                }
            }
        }

        async function handleStudentSearch() {
            const searchTerm = studentSearchInput.value.toLowerCase().trim();
            if (!searchTerm) {
                showNotification('Please enter a student ID or name to search.', 'warning');
                return;
            }
            
            console.log('🔍 Searching for student:', searchTerm);
            console.log('📊 Current students array length:', students.length);
            console.log('📋 Students API available?', typeof fetch !== 'undefined');

            // Ensure students data is loaded
            if (students.length === 0) {
                console.log('Students array is empty, loading students...');
                await loadStudents(true);
                console.log('Students loaded, new length:', students.length);
            }

            // Debug: Log first few students to check data structure
            if (students.length > 0) {
                console.log('Sample student data:', students.slice(0, 3));
            }

            // More robust search logic
            const student = students.find(s => {
                if (!s || !s.studentId) return false;

                const studentId = s.studentId.toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().trim();

                // Exact match first
                if (studentId === searchLower) return true;

                // Student ID contains search term
                if (studentId.includes(searchLower)) return true;

                // Name contains search term
                if (fullName.includes(searchLower)) return true;

                // Search term contains student ID
                if (searchLower.includes(studentId)) return true;

                return false;
            });

            console.log('Search result:', student);
            
            if (student) {
                console.log('✅ Found student:', student);
                const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
                const imageUrl = getImageUrl(student.avatar, fullName);
                console.log('📷 Student image URL:', imageUrl);
                
                document.getElementById('modalStudentId').textContent = student.studentId;
                document.getElementById('modalStudentName').textContent = fullName;
                document.getElementById('modalStudentImage').src = imageUrl;
                document.getElementById('modalStudentDept').textContent = student.department || 'N/A';
                document.getElementById('modalStudentSection').textContent = student.section || 'N/A';
                document.getElementById('modalStudentContact').textContent = student.contact || student.email || 'N/A';

                if (selectedStudentCard) {
                    selectedStudentCard.style.display = 'flex';
                }

                showNotification(`Student found: ${student.firstName} ${student.lastName} (${student.studentId})`, 'success');
            } else {
                console.log('❌ No student found for search term:', searchTerm);
                console.log('Available students:', students.length);

                if (students.length === 0) {
                    showNotification('No student data loaded. Click the refresh button (🔄) to reload student data.', 'warning', 6000);
                } else {
                    showNotification(`Student "${searchTerm}" not found. Available students: ${students.slice(0, 5).map(s => s.studentId).join(', ')}...`, 'warning', 8000);
                }

                // Clear any previous selection
                if (selectedStudentCard) {
                    selectedStudentCard.style.display = 'none';
                }
            }
        }

        // ========== EVENT LISTENERS ==========
        
        // 1. OPEN MODAL WHEN "RECORD VIOLATION" BUTTON IS CLICKED
        if (btnAddViolation) {
            btnAddViolation.addEventListener('click', () => openRecordModal());
            console.log('✅ Added click event to btnAddViolations');
        }

        // 2. OPEN MODAL WHEN "RECORD FIRST VIOLATION" BUTTON IS CLICKED
        if (btnRecordFirst) {
            btnRecordFirst.addEventListener('click', () => openRecordModal());
            console.log('✅ Added click event to btnRecordFirstViolation');
        }

        // 3. CLOSE MODAL BUTTONS
        if (closeRecordBtn) {
            closeRecordBtn.addEventListener('click', closeRecordModal);
            console.log('✅ Added click event to closeRecordBtn');
        }

        if (cancelRecordBtn) {
            cancelRecordBtn.addEventListener('click', closeRecordModal);
            console.log('✅ Added click event to cancelRecordBtn');
        }

        if (recordOverlay) {
            recordOverlay.addEventListener('click', closeRecordModal);
            console.log('✅ Added click event to recordOverlay');
        }

        if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeDetailsModal);
        if (detailsOverlay) detailsOverlay.addEventListener('click', closeDetailsModal);

        // Detail modal action buttons
        const detailEditBtn = document.getElementById('detailEditBtn');
        const detailResolveBtn = document.getElementById('detailResolveBtn');
        const detailEscalateBtn = document.getElementById('detailEscalateBtn');
        const detailPrintBtn = document.getElementById('detailPrintBtn');

        if (detailEditBtn) {
            detailEditBtn.addEventListener('click', function() {
                const violationId = detailsModal.dataset.viewingId;
                if (violationId) {
                    closeDetailsModal();
                    openRecordModal(parseInt(violationId));
                }
            });
        }

        if (detailResolveBtn) {
            detailResolveBtn.addEventListener('click', async function() {
                const violationId = detailsModal.dataset.viewingId;
                if (!violationId) {
                    showNotification('No violation selected', 'error');
                    return;
                }

                const violation = violations.find(v => v.id === parseInt(violationId));
                if (!violation) {
                    showNotification('Violation not found', 'error');
                    return;
                }

                if (violation.status === 'resolved') {
                    showNotification('This violation is already resolved', 'warning');
                    return;
                }

                if (confirm(`Mark violation ${violation.caseId} as resolved?`)) {
                    try {
                        await updateViolation(parseInt(violationId), { status: 'resolved' });
                        showNotification('Violation marked as resolved!', 'success');
                        closeDetailsModal();
                    } catch (error) {
                        console.error('Error resolving violation:', error);
                        showNotification('Failed to resolve violation. Please try again.', 'error');
                    }
                }
            });
        }

        if (detailEscalateBtn) {
            detailEscalateBtn.addEventListener('click', async function() {
                const violationId = detailsModal.dataset.viewingId;
                if (!violationId) {
                    showNotification('No violation selected', 'error');
                    return;
                }

                const violation = violations.find(v => v.id === parseInt(violationId));
                if (!violation) {
                    showNotification('Violation not found', 'error');
                    return;
                }

                if (confirm(`Escalate violation ${violation.caseId} to disciplinary action?`)) {
                    try {
                        await updateViolation(parseInt(violationId), { status: 'disciplinary' });
                        showNotification('Violation escalated to disciplinary!', 'success');
                        closeDetailsModal();
                    } catch (error) {
                        console.error('Error escalating violation:', error);
                        showNotification('Failed to escalate violation. Please try again.', 'error');
                    }
                }
            });
        }

        if (detailPrintBtn) {
            detailPrintBtn.addEventListener('click', function() {
                const violationId = detailsModal.dataset.viewingId;
                if (!violationId) {
                    showNotification('No violation selected', 'error');
                    return;
                }

                const violation = violations.find(v => v.id === parseInt(violationId));
                if (violation) {
                    // Print violation details
                    const printContent = `
                        <html>
                            <head>
                                <title>Violation Report - ${violation.caseId}</title>
                                <style>
                                    body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                                    h1 { color: #333; margin-bottom: 20px; }
                                    .report-section { margin-bottom: 30px; }
                                    .report-label { font-weight: 600; color: #666; }
                                    .report-value { margin-left: 10px; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                    th { background-color: #f8f9fa; font-weight: 600; }
                                </style>
                            </head>
                            <body>
                                <h1>Violation Report</h1>
                                <div class="report-section">
                                    <div><span class="report-label">Case ID:</span> <span class="report-value">${violation.caseId}</span></div>
                                    <div><span class="report-label">Student ID:</span> <span class="report-value">${violation.studentId}</span></div>
                                    <div><span class="report-label">Student Name:</span> <span class="report-value">${violation.studentName}</span></div>
                                    <div><span class="report-label">Violation Type:</span> <span class="report-value">${violation.violationTypeLabel}</span></div>
                                    <div><span class="report-label">Level:</span> <span class="report-value">${violation.violationLevelLabel}</span></div>
                                    <div><span class="report-label">Date & Time:</span> <span class="report-value">${violation.dateTime}</span></div>
                                    <div><span class="report-label">Location:</span> <span class="report-value">${violation.locationLabel}</span></div>
                                    <div><span class="report-label">Reported By:</span> <span class="report-value">${violation.reportedBy}</span></div>
                                    <div><span class="report-label">Status:</span> <span class="report-value">${violation.statusLabel}</span></div>
                                    <div><span class="report-label">Notes:</span> <span class="report-value">${violation.notes || 'N/A'}</span></div>
                                </div>
                                <div style="margin-top: 40px; color: #666; font-size: 12px;">
                                    Generated on: ${new Date().toLocaleString()}
                                </div>
                            </body>
                        </html>
                    `;
                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(printContent);
                    printWindow.document.close();
                    printWindow.print();
                }
            });
        }

        // 4. ESCAPE KEY TO CLOSE MODAL
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (recordModal && recordModal.classList.contains('active')) {
                    closeRecordModal();
                }
                if (detailsModal && detailsModal.classList.contains('active')) {
                    closeDetailsModal();
                }
                // Also close student details panel
                const studentPanel = document.getElementById('studentDetailsPanel');
                if (studentPanel && studentPanel.style.display !== 'none') {
                    hideStudentDetails();
                }
            }
        });

        // 5. TABLE EVENT LISTENERS
        if (tableBody) {
            tableBody.addEventListener('click', handleTableClick);
        }

        // ========== PROFESSIONAL FORM VALIDATION & SUBMISSION ==========

        // Form validation state
        let formValidationState = {
            isValid: false,
            errors: {},
            touched: {}
        };

        // Professional form validation - REMOVED ALL VALIDATION
        function validateFormField(fieldName, value) {
            const errors = [];

            // All validations removed as requested
            // Return empty errors array for all fields

            return errors;
        }

        function showFieldError(fieldName, errors) {
            const field = document.getElementById(fieldName) ||
                         document.querySelector(`[name="${fieldName}"]`) ||
                         document.querySelector(`input[name="${fieldName}"]:checked`);

            if (!field) return;

            // Remove existing error
            const existingError = field.parentElement.querySelector('.field-error');
            if (existingError) existingError.remove();

            // Add error styling
            field.classList.add('field-error');

            if (errors.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = errors[0]; // Show first error
                field.parentElement.appendChild(errorDiv);
            } else {
                field.classList.remove('field-error');
            }
        }

        function clearFieldError(fieldName) {
            const field = document.getElementById(fieldName) ||
                         document.querySelector(`[name="${fieldName}"]`) ||
                         document.querySelector(`input[name="${fieldName}"]:checked`);

            if (field) {
                field.classList.remove('field-error');
                const existingError = field.parentElement.querySelector('.field-error');
                if (existingError) existingError.remove();
            }
        }

        function validateEntireForm() {
            // All validation removed - form is always valid
            const isValid = true;
            const errors = {};
            const totalFields = 8;
            const completedFields = totalFields; // Always 100% complete

            formValidationState.isValid = isValid;
            formValidationState.errors = errors;

            // Update submit button state - always enabled
            const submitBtn = document.querySelector('#ViolationRecordForm .Violations-btn-primary');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Record Violation';
            }

            // Update progress bar - always 100%
            updateFormProgress(completedFields, totalFields);

            // Debug logging
            console.log('Form validation result: ALL VALIDATION REMOVED - Always valid');

            return isValid;
        }

        function updateFormProgress(completed, total) {
            const progressBar = document.getElementById('violationFormProgress');
            if (progressBar) {
                const percentage = (completed / total) * 100;
                progressBar.style.width = percentage + '%';

                // Change color based on completion
                if (percentage === 100) {
                    progressBar.style.background = 'linear-gradient(90deg, var(--success) 0%, var(--success) 100%)';
                } else if (percentage >= 75) {
                    progressBar.style.background = 'linear-gradient(90deg, var(--primary) 0%, var(--primary) 100%)';
                } else if (percentage >= 50) {
                    progressBar.style.background = 'linear-gradient(90deg, #ffc107 0%, #ffc107 100%)';
                } else {
                    progressBar.style.background = 'linear-gradient(90deg, #dc3545 0%, #dc3545 100%)';
                }
            }
        }

        // Real-time validation
        function setupRealTimeValidation() {
            // Student search validation
            const studentSearch = document.getElementById('studentSearch');
            if (studentSearch) {
                studentSearch.addEventListener('blur', () => {
                    const studentId = document.getElementById('modalStudentId').textContent;
                    const errors = validateFormField('studentSearch', studentId || '');
                    showFieldError('studentSearch', errors);
                    validateEntireForm();
                });
            }

            // Radio button validation
            ['violationType', 'violationLevel'].forEach(fieldName => {
                const radios = document.querySelectorAll(`input[name="${fieldName}"]`);
                radios.forEach(radio => {
                    radio.addEventListener('change', () => {
                        clearFieldError(fieldName);
                        validateEntireForm();

                        // Auto-populate notes based on selection
                        if (fieldName === 'violationType' && radio.checked) {
                            populateSuggestedNotes(radio.value);
                        }
                    });
                });
            });

            // Text input validation
            ['violationDate', 'violationTime', 'reportedBy'].forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('blur', () => {
                        const errors = validateFormField(fieldId, field.value);
                        showFieldError(fieldId, errors);
                        validateEntireForm();
                    });

                    field.addEventListener('input', () => {
                        // Always validate on input for these critical fields
                        const errors = validateFormField(fieldId, field.value);
                        showFieldError(fieldId, errors);
                        validateEntireForm();
                    });

                    field.addEventListener('change', () => {
                        // Also validate on change events (important for date/time pickers)
                        const errors = validateFormField(fieldId, field.value);
                        showFieldError(fieldId, errors);
                        validateEntireForm();
                    });
                }
            });

            // Select validation
            const locationSelect = document.getElementById('violationLocation');
            if (locationSelect) {
                locationSelect.addEventListener('change', () => {
                    clearFieldError('location');
                    validateEntireForm();
                });
            }

            // Notes validation
            const notesField = document.getElementById('violationNotes');
            if (notesField) {
                notesField.addEventListener('input', () => {
                    const errors = validateFormField('violationNotes', notesField.value);
                    showFieldError('violationNotes', errors);
                    validateEntireForm();

                    // Character counter
                    updateNotesCounter(notesField.value.length);
                });
            }
        }

        function updateNotesCounter(length) {
            let counter = document.getElementById('notesCounter');
            if (!counter) {
                const notesField = document.getElementById('violationNotes');
                if (notesField) {
                    counter = document.createElement('div');
                    counter.id = 'notesCounter';
                    counter.className = 'notes-counter';
                    notesField.parentElement.appendChild(counter);
                }
            }

            if (counter) {
                counter.textContent = `${length}/500 characters`;
                counter.className = `notes-counter ${length > 450 ? 'warning' : ''} ${length > 500 ? 'error' : ''}`;
            }
        }

        function populateSuggestedNotes(violationType) {
            const notesField = document.getElementById('violationNotes');
            if (!notesField || notesField.value.trim() !== '') return;

            const suggestions = {
                'improper_uniform': 'Student was observed wearing improper uniform attire in violation of school dress code policy.',
                'no_id': 'Student was found without the required school identification card.',
                'improper_footwear': 'Student was wearing inappropriate footwear that does not meet school standards.',
                'misconduct': 'Student engaged in behavior that violates school conduct policies.'
            };

            if (suggestions[violationType]) {
                notesField.value = suggestions[violationType];
                updateNotesCounter(notesField.value.length);
            }
        }

        // Enhanced form submission
        if (violationForm) {
            // Setup real-time validation
            setupRealTimeValidation();

            violationForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Get form data (no validation needed)
                const studentId = document.getElementById('modalStudentId').textContent;
                const violationType = document.querySelector('input[name="violationType"]:checked');
                const violationLevel = document.querySelector('input[name="violationLevel"]:checked');
                const violationDate = document.getElementById('violationDate').value;
                const violationTime = document.getElementById('violationTime').value;
                const location = document.getElementById('violationLocation').value;
                const reportedBy = document.getElementById('reportedBy').value.trim();
                const notes = document.getElementById('violationNotes').value.trim();

                // Show loading state
                const submitBtn = document.querySelector('#ViolationRecordForm .Violations-btn-primary');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Saving...';

                try {
                const editingId = recordModal.dataset.editingId;

                if (editingId) {
                    // Edit existing violation
                        const updateData = {
                            violationType: violationType ? violationType.value : '',
                            violationLevel: violationLevel ? violationLevel.value : '',
                            violationDate: violationDate,
                            violationTime: violationTime,
                            location: location,
                            reportedBy: reportedBy,
                            notes: notes
                        };

                        await updateViolation(editingId, updateData);
                        showNotification('Violation updated successfully!', 'success');
                } else {
                    // Add new violation
                    const student = students.find(s => s.studentId === studentId);
                    if (!student) {
                            throw new Error('Selected student not found in database.');
                        }
                    
                        // Determine status based on level (if selected)
                        let status = 'warning';
                        if (violationLevel && violationLevel.value) {
                            if (violationLevel.value.startsWith('permitted')) {
                                status = 'permitted';
                            } else if (violationLevel.value === 'disciplinary') {
                                status = 'disciplinary';
                            }
                        }

                        // Ensure department is included
                        const studentDepartment = student.department || 'N/A';
                        if (!studentDepartment || studentDepartment === 'N/A') {
                            throw new Error('Student department is required. Please ensure the student has a department assigned.');
                        }

                        const violationData = {
                            studentId: student.studentId,
                            violationType: violationType ? violationType.value : '',
                            violationLevel: violationLevel ? violationLevel.value : '',
                            violationDate: violationDate,
                            violationTime: violationTime,
                            location: location,
                            reportedBy: reportedBy,
                            status: status,
                            notes: notes,
                            department: studentDepartment // Include department in the request
                        };

                        await saveViolation(violationData);
                        showNotification('Violation recorded successfully!', 'success');
                    }

                closeRecordModal();
                } catch (error) {
                    console.error('Error saving violation:', error);
                    showNotification('Failed to save violation: ' + error.message, 'error');

                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        }

        // 7. STUDENT SEARCH
        if (searchStudentBtn) {
            searchStudentBtn.addEventListener('click', async () => {
                try {
                    await handleStudentSearch();
                } catch (error) {
                    console.error('Error searching student:', error);
                    showNotification('Failed to search student. Please try again.', 'error');
                }
            });
        }

        // 7.5. REFRESH STUDENTS DATA
        const refreshStudentsBtn = document.getElementById('refreshStudentsBtn');
        if (refreshStudentsBtn) {
            refreshStudentsBtn.addEventListener('click', async () => {
                try {
                    console.log('Manual refresh of students data requested');
                    await loadStudents(true);
                    showNotification(`Student data refreshed! (${students.length} students loaded)`, 'success');

                    // Debug: Show first few student IDs
                    if (students.length > 0) {
                        console.log('Available student IDs (first 10):', students.slice(0, 10).map(s => s.studentId));
                        console.log('Sample student data:', students.slice(0, 3));
                    } else {
                        console.warn('No students loaded!');
                        showNotification('Warning: No student data loaded. Check database connection.', 'warning', 5000);
                    }
                } catch (error) {
                    console.error('Error refreshing students data:', error);
                    showNotification('Failed to refresh student data.', 'error');
                }
            });
        }

        // DEBUG: Add console command to check students
        window.debugStudents = function() {
            console.log('=== STUDENT DATA DEBUG ===');
            console.log('Students array length:', students.length);
            if (students.length > 0) {
                console.log('First 5 students:');
                students.slice(0, 5).forEach((s, i) => {
                    console.log(`${i+1}. ID: ${s.studentId}, Name: ${s.firstName} ${s.lastName}, Dept: ${s.department}`);
                });
            } else {
                console.log('No students in array!');
            }
            console.log('=== END DEBUG ===');
        };

        // 8. ENTER KEY IN STUDENT SEARCH
        if (studentSearchInput) {
            studentSearchInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    try {
                        await handleStudentSearch();
                    } catch (error) {
                        console.error('Error searching student:', error);
                        alert('Failed to search student. Please try again.');
                    }
                }
            });
        }

        // 9. VIOLATION TYPE SELECTION
        const violationTypeCards = document.querySelectorAll('.violation-type-card');
        violationTypeCards.forEach(card => {
            card.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                
                violationTypeCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // 10. VIOLATION LEVEL SELECTION
        const levelOptions = document.querySelectorAll('.violation-level-option');
        levelOptions.forEach(option => {
            option.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                
                levelOptions.forEach(o => o.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // 11. SEARCH FUNCTIONALITY
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                renderViolations();

                // Show hint for student ID searches
                const searchTerm = this.value.trim();
                const searchHint = document.getElementById('searchHint');
                if (!searchHint) {
                    const hint = document.createElement('div');
                    hint.id = 'searchHint';
                    hint.className = 'search-hint';
                    hint.style.cssText = `
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--light);
                        border: 1px solid var(--border);
                        border-top: none;
                        border-radius: 0 0 8px 8px;
                        padding: 8px 12px;
                        font-size: 12px;
                        color: var(--dark-grey);
                        display: none;
                        z-index: 10;
                    `;
                    this.parentElement.style.position = 'relative';
                    this.parentElement.appendChild(hint);
                }

                const hintElement = document.getElementById('searchHint');
                if (searchTerm && isStudentIdSearch(searchTerm)) {
                    const foundStudent = findStudentBySearchTerm(searchTerm);
                    if (foundStudent) {
                        hintElement.textContent = `💡 Searching for student: ${foundStudent.firstName} ${foundStudent.lastName} (${foundStudent.studentId})`;
                        hintElement.style.display = 'block';
                    } else {
                        hintElement.textContent = '💡 No student found with that ID. Try searching by name instead.';
                        hintElement.style.display = 'block';
                    }
                } else {
                    hintElement.style.display = 'none';
                }
            });
        }

        // 12. FILTER FUNCTIONALITY
        if (deptFilter) {
            deptFilter.addEventListener('change', renderViolations);
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', renderViolations);
        }

        // 13. PRINT FUNCTIONALITY
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                const tableTitle = document.querySelector('.Violations-table-title')?.textContent || 'Violations List';
                const tableSubtitle = document.querySelector('.Violations-table-subtitle')?.textContent || 'All student violation records';

                let printTableHTML = `
                    <table>
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Violation Type</th>
                                <th>Level</th>
                                <th>Department</th>
                                <th>Section</th>
                                <th>Date Reported</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                violations.forEach(violation => {
                    const typeClass = getViolationTypeClass(violation.violationType);
                    const levelClass = getViolationLevelClass(violation.violationLevel);
                    const deptClass = getDepartmentClass(violation.department);
                    const statusClass = getStatusClass(violation.status);
                    
                    printTableHTML += `
                        <tr>
                            <td>${violation.caseId}</td>
                            <td>${violation.studentId}</td>
                            <td>${violation.studentName}</td>
                            <td><span class="type-badge ${typeClass}">${violation.violationTypeLabel}</span></td>
                            <td><span class="level-badge ${levelClass}">${violation.violationLevelLabel}</span></td>
                            <td><span class="dept-badge ${deptClass}">${violation.department}</span></td>
                            <td>${violation.section}</td>
                            <td>${formatDate(violation.dateReported)}</td>
                            <td><span class="status-badge ${statusClass}">${violation.statusLabel}</span></td>
                        </tr>
                    `;
                });

                printTableHTML += `
                        </tbody>
                    </table>
                `;

                const printContent = `
                    <html>
                        <head>
                            <title>Violations Report - OSAS System</title>
                            <style>
                                body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                th { background-color: #f8f9fa; font-weight: 600; }
                                h1 { color: #333; margin-bottom: 10px; }
                                .report-header { margin-bottom: 30px; }
                                .report-date { color: #666; margin-bottom: 20px; }
                                .status-badge, .type-badge, .level-badge, .dept-badge { 
                                    padding: 4px 8px; 
                                    border-radius: 4px; 
                                    font-size: 11px; 
                                    font-weight: 600; 
                                    display: inline-block;
                                }
                                .permitted { background: #e8f5e9; color: #2e7d32; }
                                .warning { background: #fff3e0; color: #ef6c00; }
                                .disciplinary { background: #ffebee; color: #c62828; }
                                .resolved { background: #e3f2fd; color: #1565c0; }
                                .uniform { background: #f3e5f5; color: #7b1fa2; }
                                .footwear { background: #e8f5e9; color: #2e7d32; }
                                .id { background: #e3f2fd; color: #1565c0; }
                                .bsis { background: #e8f5e9; color: #2e7d32; }
                                .wft { background: #e3f2fd; color: #1565c0; }
                                .btvted { background: #fff3e0; color: #ef6c00; }
                                .chs { background: #f3e5f5; color: #7b1fa2; }
                            </style>
                        </head>
                        <body>
                            <div class="report-header">
                                <h1>${tableTitle}</h1>
                                <p style="color: #666;">${tableSubtitle}</p>
                                <div class="report-date">Generated on: ${new Date().toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</div>
                            </div>
                            ${printTableHTML}
                        </body>
                    </html>
                `;

                const printWindow = window.open('', '_blank');
                printWindow.document.write(printContent);
                printWindow.document.close();
                printWindow.print();
            });
        }

        // 14. SORT FUNCTIONALITY
        const sortHeaders = document.querySelectorAll('.Violations-sortable');
        sortHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const sortBy = this.dataset.sort;
                sortViolations(sortBy);
            });
        });

        // 15. STUDENT DETAILS CLOSE BUTTON
        const closeStudentDetailsBtn = document.getElementById('closeStudentDetails');
        if (closeStudentDetailsBtn) {
            closeStudentDetailsBtn.addEventListener('click', hideStudentDetails);
        }

        function sortViolations(sortBy) {
            violations.sort((a, b) => {
                switch(sortBy) {
                    case 'name':
                        return a.studentName.localeCompare(b.studentName);
                    case 'studentId':
                        return a.studentId.localeCompare(b.studentId);
                    case 'department':
                        return a.department.localeCompare(b.department);
                    case 'date':
                        return new Date(b.dateReported) - new Date(a.dateReported);
                    case 'id':
                    default:
                        return b.id - a.id;
                }
            });
            renderViolations();
        }

        // ========== INITIAL DATA LOAD ==========
        async function initializeData() {
            try {
                console.log('🚀 Initializing violations data...');

                // Check API connectivity first
                const apiStatus = await checkAPIConnectivity();
                console.log('API Status:', apiStatus);

                if (!apiStatus.violations && !apiStatus.students) {
                    console.error('Both APIs failed. API_BASE:', API_BASE);
                    console.error('Full violations URL:', window.location.origin + window.location.pathname.replace(/[^\/]*$/, '') + API_BASE + 'violations.php');
                    throw new Error('API endpoints not accessible. Please check if the PHP files exist in the api directory. API path: ' + API_BASE);
                }
                
                // Log warnings but continue if at least one API works
                if (!apiStatus.violations) {
                    console.warn('⚠️ Violations API not accessible, but continuing...');
                }
                if (!apiStatus.students) {
                    console.warn('⚠️ Students API not accessible, but continuing...');
                }

                // Show loading overlay
                showLoadingOverlay('Initializing violations system...');

                // Check if elements exist
                console.log('Checking DOM elements...');
                console.log('tableBody:', tableBody);
                console.log('btnAddViolation:', document.getElementById('btnAddViolations'));

                if (!tableBody) {
                    throw new Error('Required DOM elements not found. Please check the HTML structure.');
                }

                // Load data in parallel
                console.log('Loading data...');
                const [violationsData, studentsData] = await Promise.all([
                    loadViolations(false),
                    loadStudents(false)
                ]);

                console.log('Data loaded, violations:', violationsData.length, 'students:', studentsData.length);

                // Debug: Log available student IDs
                if (studentsData.length > 0) {
                    console.log('Available student IDs:', studentsData.map(s => s.studentId).slice(0, 10));
                } else {
                    console.warn('No students data loaded!');
                }

                console.log('Data loaded, rendering violations...');
                // Render violations
                renderViolations();

                console.log('Adding refresh button...');
                // Add refresh button to header
                addRefreshButton();

                console.log('✅ Violations module initialized successfully!');

                // Update stats after data is loaded
                updateStats();

                showNotification(`Violations system loaded successfully! (${violationsData.length} violations, ${studentsData.length} students)`, 'success');

            } catch (error) {
                console.error('❌ Error initializing data:', error);
                console.error('Error details:', error.stack);

                // Provide specific error messages based on error type
                let errorMessage = error.message;
                let helpText = '';

                if (error.message.includes('Violations table does not exist')) {
                    errorMessage = 'Violations table not found in database';
                    helpText = 'Please run the SQL setup file: database/setup_complete.sql or database/violations_table.sql';
                } else if (error.message.includes('API endpoints not accessible')) {
                    errorMessage = 'API files not found';
                    helpText = 'Please ensure api/violations.php and api/students.php exist';
                } else if (error.message.includes('Required DOM elements not found')) {
                    errorMessage = 'Page structure error';
                    helpText = 'Please check the HTML structure of the violations page';
                }

                // Show error state in table
                if (tableBody) {
                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="10" style="text-align: center; padding: 40px; color: #dc3545;">
                                <i class='bx bx-error' style="font-size: 24px; margin-bottom: 10px;"></i>
                                <div>Failed to load violations data</div>
                                <div style="font-size: 14px; margin: 10px 0; color: #666;">${errorMessage}</div>
                                ${helpText ? `<div style="font-size: 12px; margin: 10px 0; color: #888;">${helpText}</div>` : ''}
                                <div style="margin-top: 20px;">
                                    <button onclick="window.location.reload()" style="margin-right: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                        <i class='bx bx-refresh'></i> Reload Page
                                    </button>
                                    <button onclick="checkDatabaseSetup()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                        <i class='bx bx-check'></i> Check Setup
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                }

                showNotification('Failed to initialize violations system: ' + errorMessage, 'error', 8000);
            } finally {
                hideLoadingOverlay();
            }
        }

        // Function to check database setup
        window.checkDatabaseSetup = async function() {
            try {
                showLoadingOverlay('Checking database setup...');
                
                console.log('API_BASE:', API_BASE);
                const fullUrl = window.location.href.replace(/[^\/]*$/, '') + API_BASE + 'violations.php';
                console.log('Full URL being called:', fullUrl);
        
                // Test API connectivity
                console.log('Testing violations API...');
                const violationsResponse = await fetch(API_BASE + 'violations.php');
                console.log('Violations response status:', violationsResponse.status);
                
                // Get text first to see what's returned
                const violationsText = await violationsResponse.text();
                console.log('Raw violations response:', violationsText.substring(0, 500));
                
                // Check if it's HTML (error page)
                if (violationsText.trim().startsWith('<!DOCTYPE') || violationsText.trim().startsWith('<html')) {
                    alert('❌ API returned HTML instead of JSON!\n\nThis means the API path is wrong or there\'s a server error.\n\nURL tried: ' + API_BASE + 'violations.php\n\nFull URL: ' + fullUrl + '\n\nResponse preview:\n' + violationsText.substring(0, 200));
                    return;
                }
                
                let violationsData;
                try {
                    violationsData = JSON.parse(violationsText);
                } catch (e) {
                    alert('❌ Invalid JSON from violations API:\n' + violationsText.substring(0, 300));
                    return;
                }
                console.log('Violations API Response:', violationsData);
        
                if (!violationsResponse.ok) {
                    alert('❌ Violations API not accessible\nStatus: ' + violationsResponse.status);
                    return;
                }
        
                if (violationsData.status === 'error') {
                    alert('❌ Violations API Error:\n' + violationsData.message + (violationsData.help ? '\n\nHelp: ' + violationsData.help : ''));
                    return;
                }
        
                // Test students API
                console.log('Testing students API...');
                const studentsResponse = await fetch(API_BASE + 'students.php');
                const studentsText = await studentsResponse.text();
                console.log('Raw students response:', studentsText.substring(0, 500));
                
                if (studentsText.trim().startsWith('<!DOCTYPE') || studentsText.trim().startsWith('<html')) {
                    alert('❌ Students API returned HTML instead of JSON!\n\nResponse preview:\n' + studentsText.substring(0, 200));
                    return;
                }
                
                let studentsData;
                try {
                    studentsData = JSON.parse(studentsText);
                } catch (e) {
                    alert('❌ Invalid JSON from students API:\n' + studentsText.substring(0, 300));
                    return;
                }
                console.log('Students API Response:', studentsData);
        
                if (!studentsResponse.ok) {
                    alert('❌ Students API not accessible\nStatus: ' + studentsResponse.status);
                    return;
                }
        
                if (studentsData.status === 'error') {
                    alert('❌ Students API Error:\n' + studentsData.message);
                    return;
                }
        
                alert('✅ Database setup looks good!\n\nFound:\n- ' + 
                      (violationsData.violations ? violationsData.violations.length : 0) + 
                      ' violations\n- ' + 
                      (studentsData.students || studentsData.data ? (studentsData.students || studentsData.data).length : 0) + 
                      ' students\n\nTry refreshing the page.');
        
            } catch (error) {
                alert('❌ Error checking database setup: ' + error.message + '\n\nCheck browser console for details.');
                console.error('Setup check error:', error);
            } finally {
                hideLoadingOverlay();
            }
        };
        // Add refresh button to header
        function addRefreshButton() {
            try {
                const firstButtonGroup = document.querySelector('.Violations-button-group');
                console.log('Adding refresh button, firstButtonGroup:', firstButtonGroup);

                if (!firstButtonGroup) {
                    console.warn('First button group not found, skipping refresh button');
                    return;
                }

                if (document.getElementById('refreshViolationsBtn')) {
                    console.log('Refresh button already exists');
                    return;
                }

                const refreshBtn = document.createElement('button');
                refreshBtn.id = 'refreshViolationsBtn';
                refreshBtn.className = 'Violations-btn outline small';
                refreshBtn.innerHTML = '<i class="bx bx-refresh"></i><span>Refresh</span>';
                refreshBtn.onclick = function() {
                    console.log('Refresh button clicked');
                    refreshData();
                };
                refreshBtn.title = 'Refresh data';

                // Insert at the beginning of the first button group
                if (firstButtonGroup.firstChild) {
                    firstButtonGroup.insertBefore(refreshBtn, firstButtonGroup.firstChild);
                    console.log('Refresh button inserted before first child');
                } else {
                    firstButtonGroup.appendChild(refreshBtn);
                    console.log('Refresh button appended to button group');
                }
            } catch (error) {
                console.error('Error adding refresh button:', error);
            }
        }

        // Debug functions available globally
        window.debugViolations = function() {
            console.log('=== VIOLATIONS DEBUG ===');
            console.log('Violations array length:', violations.length);
            if (violations.length > 0) {
                console.log('First 5 violations:');
                violations.slice(0, 5).forEach((v, i) => {
                    console.log(`${i+1}. ID: ${v.caseId}, Student: ${v.studentName}, Status: ${v.status}`);
                });
            } else {
                console.log('No violations in array!');
            }
            console.log('=== END DEBUG ===');
        };

        window.forceReloadData = async function() {
            console.log('Forcing data reload...');
            await initializeData();
        };

        // Manual test data for debugging
        window.setTestData = function() {
            console.log('Setting test data...');
            violations = [
                {
                    id: 1,
                    caseId: 'VIOL-2024-001',
                    studentId: '2024-001',
                    studentName: 'John Doe',
                    studentImage: 'https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=40',
                    studentDept: 'BSIT',
                    studentSection: 'BSIT-1A',
                    studentContact: '+63 912 345 6789',
                    violationType: 'improper_uniform',
                    violationTypeLabel: 'Improper Uniform',
                    violationLevel: 'warning2',
                    violationLevelLabel: 'Warning 2',
                    department: 'BSIT',
                    section: 'BSIT-1A',
                    dateReported: '2024-02-15',
                    violationTime: '08:15:00',
                    dateTime: 'Feb 15, 2024 • 08:15 AM',
                    location: 'gate_1',
                    locationLabel: 'Main Gate 1',
                    reportedBy: 'Officer Maria Santos',
                    status: 'warning',
                    statusLabel: 'Warning',
                    notes: 'Test violation data',
                    attachments: [],
                    created_at: '2024-02-15 08:15:00',
                    updated_at: '2024-02-15 08:15:00'
                }
            ];
            students = [
                {
                    id: 1,
                    studentId: '2024-001',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@email.com',
                    contact: '+63 912 345 6789',
                    department: 'BSIT',
                    section: 'BSIT-1A',
                    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=80'
                }
            ];
            renderViolations();
            updateStats();
            console.log('Test data set and rendered!');
        };

        window.testAPI = async function() {
            console.log('Testing API endpoints...');
            try {
                const violationsResponse = await fetch(API_BASE + 'violations.php');
                const violationsData = await violationsResponse.json();
                console.log('Violations API Response:', violationsData);

                const studentsResponse = await fetch(API_BASE + 'students.php');
                const studentsData = await studentsResponse.json();
                console.log('Students API Response:', studentsData);
            } catch (error) {
                console.error('API test failed:', error);
            }
        };

        // Start initialization
        initializeData();
        
    } catch (error) {
        console.error('❌ Error initializing violations module:', error);
    }
}

// Make function globally available
window.initViolationsModule = initViolationsModule;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing violations module...');
        initViolationsModule();
    });
} else {
    // DOM already loaded
    console.log('DOM already loaded, initializing violations module...');
    setTimeout(initViolationsModule, 100); // Small delay to ensure all elements are ready
}