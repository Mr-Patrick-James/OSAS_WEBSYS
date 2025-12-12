// student.js - Complete working version with API integration
function initStudentsModule() {
    console.log('🛠 Students module initializing...');
    
    try {
        // Elements
        const tableBody = document.getElementById('StudentsTableBody');
        const btnAddStudent = document.getElementById('btnAddStudents');
        const btnAddFirstStudent = document.getElementById('btnAddFirstStudent');
        const modal = document.getElementById('StudentsModal');
        const modalOverlay = document.getElementById('StudentsModalOverlay');
        const closeBtn = document.getElementById('closeStudentsModal');
        const cancelBtn = document.getElementById('cancelStudentsModal');
        const studentsForm = document.getElementById('StudentsForm');
        const searchInput = document.getElementById('searchStudent');
        const filterSelect = document.getElementById('StudentsFilterSelect');
        const printBtn = document.getElementById('btnPrintStudents');
        const studentDeptSelect = document.getElementById('studentDept');
        const studentSectionSelect = document.getElementById('studentSection');

        // Check for essential elements
        if (!tableBody) {
            console.error('❗ #StudentsTableBody not found');
            return;
        }

        if (!modal) {
            console.warn('⚠️ #StudentsModal not found');
        }

        // Students data (will be loaded from database)
        let students = [];
        let allStudents = []; // Store all students for stats
        let currentView = 'active'; // 'active' or 'archived'
        let editingStudentId = null;

        // API base URL - adjust path based on current location
        // If we're in pages/admin_page/, we need to go up two levels
        const apiBase = window.location.pathname.includes('admin_page') 
            ? '../../api/students.php' 
            : '../api/students.php';
        
        console.log('API Base URL:', apiBase); // Debug log

        // --- API Functions ---
        async function fetchStudents() {
            try {
                const filter = filterSelect ? filterSelect.value : 'all';
                const search = searchInput ? searchInput.value : '';
                
                let url = `${apiBase}?action=get&filter=${filter}`;
                if (search) {
                    url += `&search=${encodeURIComponent(search)}`;
                }
                
                console.log('Fetching students from:', url); // Debug log
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                console.log('Raw API Response:', text); // Debug log
                
                let result;
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Response was:', text);
                    throw new Error('Invalid JSON response from server. The students table may not exist. Please run the database setup SQL files.');
                }
                
                console.log('Parsed API Response:', result); // Debug log
                
                if (result.status === 'success') {
                    allStudents = result.data || [];
                    
                    // Filter by current view
                    if (currentView === 'archived') {
                        students = allStudents.filter(s => s.status === 'archived');
                    } else {
                        students = allStudents.filter(s => s.status !== 'archived');
                    }
                    
                    renderStudents();
                    await loadStats();
                } else {
                    console.error('Error fetching students:', result.message);
                    showError(result.message || 'Failed to load students');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
                console.error('Full error details:', error.message, error.stack);
                showError('Error loading students: ' + error.message + '. Please check if the students table exists in the database.');
            }
        }

        async function loadStats() {
            try {
                const response = await fetch(`${apiBase}?action=stats`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    console.error('JSON Parse Error in stats:', parseError);
                    return; // Silently fail for stats
                }
                
                if (result.status === 'success') {
                    const stats = result.data;
                    const totalEl = document.getElementById('totalStudents');
                    const activeEl = document.getElementById('activeStudents');
                    const inactiveEl = document.getElementById('inactiveStudents');
                    const graduatingEl = document.getElementById('graduatingStudents');
                    
                    if (totalEl) totalEl.textContent = stats.total || 0;
                    if (activeEl) activeEl.textContent = stats.active || 0;
                    if (inactiveEl) inactiveEl.textContent = stats.inactive || 0;
                    if (graduatingEl) graduatingEl.textContent = stats.graduating || 0;
                }
            } catch (error) {
                console.error('Error loading stats:', error);
                // Don't show error for stats, just log it
            }
        }

        async function addStudent(formData) {
            try {
                formData.append('action', 'add');
                const response = await fetch(`${apiBase}?action=add`, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess(result.message || 'Student added successfully!');
                    await fetchStudents();
                    closeModal();
                } else {
                    showError(result.message || 'Failed to add student');
                }
            } catch (error) {
                console.error('Error adding student:', error);
                showError('Error adding student. Please try again.');
            }
        }

        async function updateStudent(studentId, formData) {
            try {
                formData.append('action', 'update');
                formData.append('studentId', studentId);
                
                const response = await fetch(`${apiBase}?action=update`, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess(result.message || 'Student updated successfully!');
                    await fetchStudents();
                    closeModal();
                } else {
                    showError(result.message || 'Failed to update student');
                }
            } catch (error) {
                console.error('Error updating student:', error);
                showError('Error updating student. Please try again.');
            }
        }

        async function deleteStudent(studentId) {
            try {
                const response = await fetch(`${apiBase}?action=delete&id=${studentId}`, {
                    method: 'GET'
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess(result.message || 'Student archived successfully!');
                    await fetchStudents();
                } else {
                    showError(result.message || 'Failed to archive student');
                }
            } catch (error) {
                console.error('Error deleting student:', error);
                showError('Error archiving student. Please try again.');
            }
        }

        async function restoreStudent(studentId) {
            try {
                const response = await fetch(`${apiBase}?action=restore&id=${studentId}`, {
                    method: 'GET'
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess(result.message || 'Student restored successfully!');
                    await fetchStudents();
                } else {
                    showError(result.message || 'Failed to restore student');
                }
            } catch (error) {
                console.error('Error restoring student:', error);
                showError('Error restoring student. Please try again.');
            }
        }

        async function activateStudent(studentId) {
            try {
                const formData = new FormData();
                formData.append('action', 'update');
                formData.append('studentId', studentId);
                formData.append('studentStatus', 'active');
                
                // Get current student data first
                const student = allStudents.find(s => s.id === studentId);
                if (student) {
                    formData.append('studentIdCode', student.studentId);
                    formData.append('firstName', student.firstName);
                    formData.append('lastName', student.lastName);
                    formData.append('studentEmail', student.email);
                    formData.append('studentContact', student.contact || '');
                    formData.append('studentDept', student.department || '');
                    formData.append('studentSection', student.section_id || '');
                    formData.append('studentStatus', 'active');
                }
                
                const response = await fetch(`${apiBase}?action=update`, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess('Student activated successfully!');
                    await fetchStudents();
                } else {
                    showError(result.message || 'Failed to activate student');
                }
            } catch (error) {
                console.error('Error activating student:', error);
                showError('Error activating student. Please try again.');
            }
        }

        async function deactivateStudent(studentId) {
            try {
                const formData = new FormData();
                formData.append('action', 'update');
                formData.append('studentId', studentId);
                formData.append('studentStatus', 'inactive');
                
                // Get current student data first
                const student = allStudents.find(s => s.id === studentId);
                if (student) {
                    formData.append('studentIdCode', student.studentId);
                    formData.append('firstName', student.firstName);
                    formData.append('lastName', student.lastName);
                    formData.append('studentEmail', student.email);
                    formData.append('studentContact', student.contact || '');
                    formData.append('studentDept', student.department || '');
                    formData.append('studentSection', student.section_id || '');
                    formData.append('studentStatus', 'inactive');
                }
                
                const response = await fetch(`${apiBase}?action=update`, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'success') {
                    showSuccess('Student deactivated successfully!');
                    await fetchStudents();
                } else {
                    showError(result.message || 'Failed to deactivate student');
                }
            } catch (error) {
                console.error('Error deactivating student:', error);
                showError('Error deactivating student. Please try again.');
            }
        }

        async function loadSectionsByDepartment(departmentCode) {
            if (!departmentCode || !studentSectionSelect) {
                return;
            }
            
            try {
                const response = await fetch(`../api/sections.php?action=getByDepartment&department_code=${encodeURIComponent(departmentCode)}`);
                const result = await response.json();
                
                // Clear existing options
                studentSectionSelect.innerHTML = '<option value="">Select Section</option>';
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    result.data.forEach(section => {
                        const option = document.createElement('option');
                        option.value = section.id;
                        option.textContent = `${section.section_code} - ${section.section_name}`;
                        studentSectionSelect.appendChild(option);
                    });
                } else {
                    const option = document.createElement('option');
                    option.value = '';
                    option.textContent = 'No sections available';
                    studentSectionSelect.appendChild(option);
                }
            } catch (error) {
                console.error('Error loading sections:', error);
                studentSectionSelect.innerHTML = '<option value="">Error loading sections</option>';
            }
        }

        // --- Render function ---
        function renderStudents() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const filterValue = filterSelect ? filterSelect.value : 'all';
            
            const filteredStudents = students.filter(s => {
                const fullName = `${s.firstName || ''} ${s.middleName || ''} ${s.lastName || ''}`.toLowerCase();
                const matchesSearch = fullName.includes(searchTerm) || 
                                    (s.studentId || '').toLowerCase().includes(searchTerm) ||
                                    (s.email || '').toLowerCase().includes(searchTerm) ||
                                    (s.department || '').toLowerCase().includes(searchTerm) ||
                                    (s.section || '').toLowerCase().includes(searchTerm);
                
                // Filter by status, but exclude archived from normal view
                let matchesFilter = true;
                if (currentView === 'archived') {
                    matchesFilter = s.status === 'archived';
                } else {
                    matchesFilter = s.status !== 'archived' && (filterValue === 'all' || s.status === filterValue);
                }
                
                return matchesSearch && matchesFilter;
            });

            // Show/hide empty state
            const emptyState = document.getElementById('StudentsEmptyState');
            if (emptyState) {
                emptyState.style.display = filteredStudents.length === 0 ? 'flex' : 'none';
            }

            if (filteredStudents.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="9" style="text-align: center; padding: 40px; color: #999;">
                            <i class='bx bx-inbox' style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                            <p>No students found</p>
                        </td>
                    </tr>
                `;
            } else {
                tableBody.innerHTML = filteredStudents.map(s => {
                    const fullName = `${s.firstName || ''} ${s.middleName ? s.middleName + ' ' : ''}${s.lastName || ''}`;
                    const deptClass = getDepartmentClass(s.department);
                    const avatarUrl = s.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ffd700&color=333&size=40`;
                    
                    return `
                    <tr data-id="${s.id}">
                        <td class="student-row-id">${s.id}</td>
                        <td class="student-image-cell">
                            <div class="student-image-wrapper">
                                <img src="${avatarUrl}" alt="${escapeHtml(fullName)}" class="student-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ffd700&color=333&size=40'">
                            </div>
                        </td>
                        <td class="student-id">${escapeHtml(s.studentId || '')}</td>
                        <td class="student-name">
                            <div class="student-name-wrapper">
                                <strong>${escapeHtml(fullName)}</strong>
                                <small>${escapeHtml(s.email || '')}</small>
                            </div>
                        </td>
                        <td class="student-dept">
                            <span class="dept-badge ${deptClass}">${escapeHtml(s.department || 'N/A')}</span>
                        </td>
                        <td class="student-section">${escapeHtml(s.section || 'N/A')}</td>
                        <td class="student-contact">${escapeHtml(s.contact || 'N/A')}</td>
                        <td>
                            <span class="Students-status-badge ${s.status || 'active'}">${formatStatus(s.status || 'active')}</span>
                        </td>
                        <td>
                            <div class="Students-action-buttons">
                                <button class="Students-action-btn view" data-id="${s.id}" title="View Profile">
                                    <i class='bx bx-user'></i>
                                </button>
                                <button class="Students-action-btn edit" data-id="${s.id}" title="Edit">
                                    <i class='bx bx-edit'></i>
                                </button>
                                ${s.status === 'archived' ? 
                                    `<button class="Students-action-btn restore" data-id="${s.id}" title="Restore">
                                        <i class='bx bx-reset'></i>
                                    </button>` : 
                                    s.status === 'inactive' ? 
                                    `<button class="Students-action-btn activate" data-id="${s.id}" title="Activate">
                                        <i class='bx bx-user-check'></i>
                                    </button>` : 
                                    `<button class="Students-action-btn deactivate" data-id="${s.id}" title="Deactivate">
                                        <i class='bx bx-user-x'></i>
                                    </button>`
                                }
                                <button class="Students-action-btn delete" data-id="${s.id}" title="${s.status === 'archived' ? 'Delete Permanently' : 'Archive'}">
                                    <i class='bx bx-trash'></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                }).join('');
            }

            updateCounts(filteredStudents);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function getDepartmentClass(dept) {
            const classes = {
                'BSIT': 'bsit',
                'BSCS': 'bscs',
                'BSBA': 'business',
                'BSN': 'nursing',
                'BEED': 'education',
                'BSED': 'education',
                'CS': 'bsit',
                'BA': 'business',
                'NUR': 'nursing',
                'BSIS': 'bsit',
                'WFT': 'default',
                'BTVTEd': 'education'
            };
            return classes[dept] || 'default';
        }

        function formatStatus(status) {
            const statusMap = {
                'active': 'Active',
                'inactive': 'Inactive',
                'graduating': 'Graduating',
                'archived': 'Archived'
            };
            return statusMap[status] || status;
        }

        function updateCounts(filteredStudents) {
            const showingEl = document.getElementById('showingStudentsCount');
            const totalCountEl = document.getElementById('totalStudentsCount');
            
            if (showingEl) showingEl.textContent = filteredStudents.length;
            if (totalCountEl) totalCountEl.textContent = allStudents.length;
        }

        // --- Modal functions ---
        function openModal(editId = null) {
            if (!modal) return;
            
            const modalTitle = document.getElementById('StudentsModalTitle');
            const form = document.getElementById('StudentsForm');
            
            editingStudentId = editId;
            
            if (editId) {
                modalTitle.textContent = 'Edit Student';
                const student = allStudents.find(s => s.id === editId);
                if (student) {
                    document.getElementById('studentId').value = student.studentId || '';
                    document.getElementById('studentStatus').value = student.status || 'active';
                    document.getElementById('firstName').value = student.firstName || '';
                    document.getElementById('middleName').value = student.middleName || '';
                    document.getElementById('lastName').value = student.lastName || '';
                    document.getElementById('studentEmail').value = student.email || '';
                    document.getElementById('studentContact').value = student.contact || '';
                    document.getElementById('studentDept').value = student.department || '';
                    document.getElementById('studentAddress').value = student.address || '';
                    
                    // Load sections for the department
                    if (student.department) {
                        loadSectionsByDepartment(student.department).then(() => {
                            if (student.section_id) {
                                document.getElementById('studentSection').value = student.section_id;
                            }
                        });
                    }
                    
                    // Set image preview if avatar exists
                    if (student.avatar && student.avatar !== '') {
                        const previewImg = document.querySelector('.Students-preview-img');
                        const previewPlaceholder = document.querySelector('.Students-preview-placeholder');
                        if (previewImg && previewPlaceholder) {
                            previewImg.src = student.avatar;
                            previewImg.style.display = 'block';
                            previewPlaceholder.style.display = 'none';
                        }
                    }
                }
            } else {
                modalTitle.textContent = 'Add New Student';
                if (form) form.reset();
                // Reset image preview
                const previewImg = document.querySelector('.Students-preview-img');
                const previewPlaceholder = document.querySelector('.Students-preview-placeholder');
                if (previewImg && previewPlaceholder) {
                    previewImg.style.display = 'none';
                    previewPlaceholder.style.display = 'flex';
                }
                // Reset section dropdown
                if (studentSectionSelect) {
                    studentSectionSelect.innerHTML = '<option value="">Select Department First</option>';
                }
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            const form = document.getElementById('StudentsForm');
            if (form) form.reset();
            // Reset image preview
            const previewImg = document.querySelector('.Students-preview-img');
            const previewPlaceholder = document.querySelector('.Students-preview-placeholder');
            if (previewImg && previewPlaceholder) {
                previewImg.style.display = 'none';
                previewPlaceholder.style.display = 'flex';
            }
            editingStudentId = null;
        }

        // --- Event handlers ---
        function handleTableClick(e) {
            const viewBtn = e.target.closest('.Students-action-btn.view');
            const editBtn = e.target.closest('.Students-action-btn.edit');
            const activateBtn = e.target.closest('.Students-action-btn.activate');
            const deactivateBtn = e.target.closest('.Students-action-btn.deactivate');
            const restoreBtn = e.target.closest('.Students-action-btn.restore');
            const deleteBtn = e.target.closest('.Students-action-btn.delete');

            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.id);
                const student = allStudents.find(s => s.id === id);
                if (student) {
                    const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
                    alert(`Viewing ${fullName}\nStudent ID: ${student.studentId}\nEmail: ${student.email}\nDepartment: ${student.department}\nSection: ${student.section}`);
                }
            }

            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                openModal(id);
            }

            if (activateBtn) {
                const id = parseInt(activateBtn.dataset.id);
                const student = allStudents.find(s => s.id === id);
                if (student && confirm(`Activate student "${student.firstName} ${student.lastName}"?`)) {
                    activateStudent(id);
                }
            }

            if (deactivateBtn) {
                const id = parseInt(deactivateBtn.dataset.id);
                const student = allStudents.find(s => s.id === id);
                if (student && confirm(`Deactivate student "${student.firstName} ${student.lastName}"?`)) {
                    deactivateStudent(id);
                }
            }

            if (restoreBtn) {
                const id = parseInt(restoreBtn.dataset.id);
                const student = allStudents.find(s => s.id === id);
                if (student && confirm(`Restore student "${student.firstName} ${student.lastName}"?`)) {
                    restoreStudent(id);
                }
            }

            if (deleteBtn) {
                const id = parseInt(deleteBtn.dataset.id);
                const student = allStudents.find(s => s.id === id);
                const action = student && student.status === 'archived' ? 'delete permanently' : 'archive';
                if (student && confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} student "${student.firstName} ${student.lastName}"?`)) {
                    deleteStudent(id);
                }
            }
        }

        // Utility functions
        function showError(message) {
            alert(message); // You can replace this with a better notification system
        }

        function showSuccess(message) {
            alert(message); // You can replace this with a better notification system
        }

        // --- Initialize ---
        async function initialize() {
            // Set default view to active (hide archived by default)
            currentView = 'active';
            if (filterSelect) {
                filterSelect.value = 'active';
            }

            // Initial load - only active students
            await fetchStudents();

            // Event listeners for table
            tableBody.addEventListener('click', handleTableClick);

            // Add Student button
            if (btnAddStudent) {
                btnAddStudent.addEventListener('click', () => openModal());
            }

            // Add First Student button
            if (btnAddFirstStudent) {
                btnAddFirstStudent.addEventListener('click', () => openModal());
            }

            // Close modal
            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
            if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

            // Escape key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                    closeModal();
                }
            });

            // Image upload preview
            const studentImageInput = document.getElementById('studentImage');
            const uploadImageBtn = document.getElementById('uploadImageBtn');
            const previewImg = document.querySelector('.Students-preview-img');
            const previewPlaceholder = document.querySelector('.Students-preview-placeholder');

            if (uploadImageBtn) {
                uploadImageBtn.addEventListener('click', () => {
                    if (studentImageInput) studentImageInput.click();
                });
            }

            if (studentImageInput && previewImg && previewPlaceholder) {
                studentImageInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewImg.src = e.target.result;
                            previewImg.style.display = 'block';
                            previewPlaceholder.style.display = 'none';
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Department change - load sections
            if (studentDeptSelect) {
                studentDeptSelect.addEventListener('change', function() {
                    const deptCode = this.value;
                    if (deptCode) {
                        loadSectionsByDepartment(deptCode);
                    } else {
                        if (studentSectionSelect) {
                            studentSectionSelect.innerHTML = '<option value="">Select Department First</option>';
                        }
                    }
                });
            }

            // Form submission
            if (studentsForm) {
                studentsForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const studentId = document.getElementById('studentId').value.trim();
                    const firstName = document.getElementById('firstName').value.trim();
                    const lastName = document.getElementById('lastName').value.trim();
                    const middleName = document.getElementById('middleName').value.trim();
                    const studentEmail = document.getElementById('studentEmail').value.trim();
                    const studentContact = document.getElementById('studentContact').value.trim();
                    const studentAddress = document.getElementById('studentAddress').value.trim();
                    const studentDept = document.getElementById('studentDept').value;
                    const studentSection = document.getElementById('studentSection').value;
                    const studentStatus = document.getElementById('studentStatus').value;
                    
                    if (!studentId || !firstName || !lastName || !studentEmail || !studentContact || !studentDept || !studentSection) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    // Get avatar
                    const previewImg = document.querySelector('.Students-preview-img');
                    let avatar = '';
                    if (previewImg && previewImg.style.display !== 'none') {
                        avatar = previewImg.src;
                    }
                    
                    const formData = new FormData();
                    if (editingStudentId) {
                        formData.append('studentId', editingStudentId);
                    }
                    formData.append('studentIdCode', studentId);
                    formData.append('firstName', firstName);
                    formData.append('middleName', middleName);
                    formData.append('lastName', lastName);
                    formData.append('studentEmail', studentEmail);
                    formData.append('studentContact', studentContact);
                    formData.append('studentAddress', studentAddress);
                    formData.append('studentDept', studentDept);
                    formData.append('studentSection', studentSection);
                    formData.append('studentStatus', studentStatus);
                    formData.append('studentAvatar', avatar);
                    
                    if (editingStudentId) {
                        await updateStudent(editingStudentId, formData);
                    } else {
                        await addStudent(formData);
                    }
                });
            }

            // Search functionality
            if (searchInput) {
                searchInput.addEventListener('input', renderStudents);
            }

            // Filter functionality - hide archived by default
            if (filterSelect) {
                // Set default to active
                filterSelect.value = 'active';
                currentView = 'active';
                
                filterSelect.addEventListener('change', () => {
                    if (filterSelect.value === 'archived') {
                        currentView = 'archived';
                    } else {
                        currentView = 'active';
                    }
                    fetchStudents();
                    // Update archived button state
                    const btnArchived = document.getElementById('btnArchivedStudents');
                    if (btnArchived) {
                        if (currentView === 'archived') {
                            btnArchived.classList.add('active');
                        } else {
                            btnArchived.classList.remove('active');
                        }
                    }
                });
            }

            // Archived button functionality
            const btnArchived = document.getElementById('btnArchivedStudents');
            if (btnArchived) {
                btnArchived.addEventListener('click', () => {
                    if (currentView === 'archived') {
                        // Switch back to active view
                        currentView = 'active';
                        if (filterSelect) filterSelect.value = 'active';
                        btnArchived.classList.remove('active');
                    } else {
                        // Switch to archived view
                        currentView = 'archived';
                        if (filterSelect) filterSelect.value = 'archived';
                        btnArchived.classList.add('active');
                    }
                    fetchStudents();
                });
            }

            // Print functionality
            if (printBtn) {
                printBtn.addEventListener('click', function() {
                    const tableTitle = document.querySelector('.Students-table-title')?.textContent || 'Student List';
                    const tableSubtitle = document.querySelector('.Students-table-subtitle')?.textContent || 'All student records and their details';

                    // Generate HTML table for printing
                    let printTableHTML = `
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Section</th>
                                    <th>Contact No</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    students.forEach(student => {
                        const fullName = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
                        
                        printTableHTML += `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.studentId}</td>
                                <td>${fullName}<br><small>${student.email}</small></td>
                                <td>${student.department}</td>
                                <td>${student.section}</td>
                                <td>${student.contact}</td>
                                <td><span class="status-badge ${student.status}">${formatStatus(student.status)}</span></td>
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
                                <title>Students Report - OSAS System</title>
                                <style>
                                    body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                                    th { background-color: #f8f9fa; font-weight: 600; }
                                    h1 { color: #333; margin-bottom: 10px; }
                                    .report-header { margin-bottom: 30px; }
                                    .report-date { color: #666; margin-bottom: 20px; }
                                    .status-badge { 
                                        padding: 4px 12px; 
                                        border-radius: 20px; 
                                        font-size: 12px; 
                                        font-weight: 600; 
                                    }
                                    .active { background: #e8f5e9; color: #2e7d32; }
                                    .inactive { background: #ffebee; color: #c62828; }
                                    .graduating { background: #e3f2fd; color: #1565c0; }
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

            // Sort functionality
            const sortHeaders = document.querySelectorAll('.Students-sortable');
            sortHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const sortBy = this.dataset.sort;
                    sortStudents(sortBy);
                });
            });

            function sortStudents(sortBy) {
                students.sort((a, b) => {
                    switch(sortBy) {
                        case 'name':
                            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                            return nameA.localeCompare(nameB);
                        case 'studentId':
                            return (a.studentId || '').localeCompare(b.studentId || '');
                        case 'department':
                            return (a.department || '').localeCompare(b.department || '');
                        case 'section':
                            return (a.section || '').localeCompare(b.section || '');
                        case 'status':
                            return (a.status || '').localeCompare(b.status || '');
                        case 'id':
                            return (a.id || 0) - (b.id || 0);
                        default:
                            return 0;
                    }
                });
                renderStudents();
            }
        }

        // Start initialization
        initialize();
        
    } catch (error) {
        console.error('❌ Error initializing Students module:', error);
    }
}
