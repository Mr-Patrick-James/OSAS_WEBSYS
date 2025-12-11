// students.js - Complete working version
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

        // API base URL (update when API is created)
        const apiBase = '../api/students.php';

        // --- Demo data (temporary - will be replaced with API) ---
        let demoStudents = [
            { 
                id: 1,
                studentId: '2023-001',
                firstName: 'John',
                middleName: 'Michael',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                contact: '+63 912 345 6789',
                department: 'BSIT',
                section: 'BSIT-3A',
                status: 'active',
                address: '123 Main St, City',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=40'
            },
            { 
                id: 2,
                studentId: '2023-002',
                firstName: 'Maria',
                middleName: 'Clara',
                lastName: 'Santos',
                email: 'maria.santos@example.com',
                contact: '+63 923 456 7890',
                department: 'BSN',
                section: 'NUR-2B',
                status: 'active',
                address: '456 Oak Ave, City',
                avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=4361ee&color=fff&size=40'
            },
            { 
                id: 3,
                studentId: '2023-003',
                firstName: 'Robert',
                middleName: 'James',
                lastName: 'Chen',
                email: 'robert.chen@example.com',
                contact: '+63 934 567 8901',
                department: 'BSBA',
                section: 'BA-4A',
                status: 'graduating',
                address: '789 Pine Rd, City',
                avatar: 'https://ui-avatars.com/api/?name=Robert+Chen&background=10b981&color=fff&size=40'
            },
            { 
                id: 4,
                studentId: '2023-004',
                firstName: 'Anna',
                middleName: 'Marie',
                lastName: 'Rodriguez',
                email: 'anna.rodriguez@example.com',
                contact: '+63 945 678 9012',
                department: 'BEED',
                section: 'BEED-3C',
                status: 'inactive',
                address: '321 Elm St, City',
                avatar: 'https://ui-avatars.com/api/?name=Anna+Rodriguez&background=f59e0b&color=fff&size=40'
            }
        ];

        // --- Load students from database (placeholder for API) ---
        async function fetchStudents() {
            // TODO: Implement API call when students API is created
            // For now, use demo data
            allStudents = demoStudents;
            
            // Filter by current view
            if (currentView === 'archived') {
                students = demoStudents.filter(s => s.status === 'archived');
            } else {
                students = demoStudents.filter(s => s.status !== 'archived');
            }
            
            renderStudents();
            updateStats();
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error updating student:', error);
                alert('Error updating student. Please try again.');
            }
        }

        // --- Render function ---
        function renderStudents() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const filterValue = filterSelect ? filterSelect.value : 'all';
            
            const filteredStudents = students.filter(s => {
                const fullName = `${s.firstName} ${s.middleName || ''} ${s.lastName}`.toLowerCase();
                const matchesSearch = fullName.includes(searchTerm) || 
                                    s.studentId.toLowerCase().includes(searchTerm) ||
                                    s.email.toLowerCase().includes(searchTerm) ||
                                    s.department.toLowerCase().includes(searchTerm);
                
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
                            <i classy='bx bx-inbox' style="font-size: 48px; display: block; margin-bottom: 10px;"></i>
                            <p>No students found</p>
                        </td>
                    </tr>
                `;
            } else {
                tableBody.innerHTML = filteredStudents.map(s => {
                    const fullName = `${s.firstName} ${s.middleName ? s.middleName + ' ' : ''}${s.lastName}`;
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
                        <td class="student-id">${escapeHtml(s.studentId)}</td>
                        <td class="student-name">
                            <div class="student-name-wrapper">
                                <strong>${escapeHtml(fullName)}</strong>
                                <small>${escapeHtml(s.email)}</small>
                            </div>
                        </td>
                        <td class="student-dept">
                            <span class="dept-badge ${deptClass}">${escapeHtml(s.department)}</span>
                        </td>
                        <td class="student-section">${escapeHtml(s.section)}</td>
                        <td class="student-contact">${escapeHtml(s.contact)}</td>
                        <td>
                            <span class="Students-status-badge ${s.status}">${formatStatus(s.status)}</span>
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

            updateStats();
            updateCounts(filteredStudents);
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            // Use allStudents for stats, not filtered students
            const total = allStudents.length;
            const active = allStudents.filter(s => s.status === 'active').length;
            const inactive = allStudents.filter(s => s.status === 'inactive').length;
            const graduating = allStudents.filter(s => s.status === 'graduating').length;
            const archived = allStudents.filter(s => s.status === 'archived').length;
            
            const totalEl = document.getElementById('totalStudents');
            const activeEl = document.getElementById('activeStudents');
            const inactiveEl = document.getElementById('inactiveStudents');
            const graduatingEl = document.getElementById('graduatingStudents');
            
            if (totalEl) totalEl.textContent = total;
            if (activeEl) activeEl.textContent = active;
            if (inactiveEl) inactiveEl.textContent = inactive;
            if (graduatingEl) graduatingEl.textContent = graduating;
        function getDepartmentClass(dept) {
            const classes = {
                'BSIT': 'bsit',
                'BSCS': 'bscs',
                'BSBA': 'business',
                'BSN': 'nursing',
                'BEED': 'education',
            if (totalCountEl) totalCountEl.textContent = students.length;
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

        function updateStats() {
            // Stats are loaded from database via loadStats()
            // This function is kept for compatibility but stats are updated via API
            loadStats();
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
            
            if (editId) {
                modalTitle.textContent = 'Edit Student';
                const student = students.find(s => s.id === editId);
                if (student) {
                    document.getElementById('studentId').value = student.studentId;
                    document.getElementById('studentStatus').value = student.status;
                    document.getElementById('firstName').value = student.firstName;
                    document.getElementById('middleName').value = student.middleName || '';
                    document.getElementById('lastName').value = student.lastName;
                    document.getElementById('studentEmail').value = student.email;
                    document.getElementById('studentContact').value = student.contact;
                    document.getElementById('studentDept').value = student.department;
                    document.getElementById('studentSection').value = student.section;
                    document.getElementById('studentAddress').value = student.address || '';
                    
                    // Set image preview if avatar exists
                    if (student.avatar && student.avatar !== '') {
                        const previewImg = document.querySelector('.Students-preview-img');
                        const previewPlaceholder = document.querySelector('.Students-preview-placeholder');
                        previewImg.src = student.avatar;
                        previewImg.style.display = 'block';
                        previewPlaceholder.style.display = 'none';
                    }
                }
                modal.dataset.editingId = editId;
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
                delete modal.dataset.editingId;
            }
                const id = parseInt(viewBtn.dataset.id);
                const student = students.find(s => s.id === id);
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            
                const id = parseInt(editBtn.dataset.id);
            document.body.style.overflow = 'auto';
            const form = document.getElementById('StudentsForm');
            if (form) form.reset();
            // Reset image preview
                const id = parseInt(activateBtn.dataset.id);
                const student = students.find(s => s.id === id);
            if (previewImg && previewPlaceholder) {
                previewPlaceholder.style.display = 'flex';
                    renderStudents();
            delete modal.dataset.editingId;
        }

        // --- Event handlers ---
                const id = parseInt(deactivateBtn.dataset.id);
                const student = students.find(s => s.id === id);
            const editBtn = e.target.closest('.Students-action-btn.edit');
            const deactivateBtn = e.target.closest('.Students-action-btn.deactivate');
                    renderStudents();
            const deleteBtn = e.target.closest('.Students-action-btn.delete');

            if (viewBtn) {
                const id = viewBtn.dataset.id;
                const id = parseInt(restoreBtn.dataset.id);
                const student = students.find(s => s.id === id);
                    alert(`Viewing ${student.firstName} ${student.lastName}\nStudent ID: ${student.studentId}\nEmail: ${student.email}\nDepartment: ${student.department}\nSection: ${student.section}`);
                    // TODO: Call restore API
                    student.status = 'active';
                    fetchStudents();
            }

            if (editBtn) {
                const id = editBtn.dataset.id;
                const id = parseInt(deleteBtn.dataset.id);
                const student = students.find(s => s.id === id);

                    // TODO: Call delete/archive API
                    student.status = 'archived';
                    fetchStudents();
                const id = activateBtn.dataset.id;

                const student = students.find(s => s.id == id);
                const student = students.find(s => s.id == id);
                if (student && confirm(`Deactivate student "${student.firstName} ${student.lastName}"?`)) {
                    // TODO: Call deactivate API
                    student.status = 'inactive';
                    fetchStudents();
                }
            }

            if (restoreBtn) {
                const id = restoreBtn.dataset.id;
                const student = students.find(s => s.id == id);
                if (student && confirm(`Restore student "${student.firstName} ${student.lastName}"?`)) {
                    restoreStudent(student.id);
                }
            }

            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                const student = students.find(s => s.id == id);
                if (student && confirm(`Archive student "${student.firstName} ${student.lastName}"? This will move it to archived.`)) {
                    deleteStudent(student.id);
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
                    studentImageInput.click();
                });
            }

            if (studentImageInput && previewImg && previewPlaceholder) {
                studentImageInput.addEventListener('change', function() {
                    const file = this.files[0];
                    if (file) {
                    const editingId = modal.dataset.editingId;
                    
                    if (editingId) {
                        const student = students.find(s => s.id === parseInt(editingId));
                        if (student) {
                            student.studentId = studentId;
                            student.status = studentStatus;
                            student.firstName = firstName;
                            student.middleName = middleName || null;
                            student.lastName = lastName;
                            student.email = studentEmail;
                            student.contact = studentContact;
                            student.department = studentDept;
                            student.section = studentSection;
                            student.address = studentAddress;
                            
                            // Update avatar if new image uploaded
                            const previewImg = document.querySelector('.Students-preview-img');
                            if (previewImg && previewImg.style.display !== 'none') {
                                student.avatar = previewImg.src;
                            }
                        }
                    } else {
                        const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
                        
                        // Generate avatar based on name
                        const nameForAvatar = `${firstName} ${lastName}`;
                        const avatarColor = getRandomColor();
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=${avatarColor}&color=fff&size=40`;
                        
                        students.push({
                            id: newId,
                            studentId: studentId,
                            status: studentStatus,
                            firstName: firstName,
                            middleName: middleName || null,
                            lastName: lastName,
                            email: studentEmail,
                            contact: studentContact,
                            department: studentDept,
                            section: studentSection,
                            address: studentAddress,
                            avatar: avatarUrl
                        });
                    

                    renderStudents();
                    closeModal();
                    if (!studentId || !firstName || !lastName || !studentEmail || !studentContact || !studentDept || !studentSection) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    const editingDbId = modal.dataset.editingDbId;
                    
                    // Get avatar
                    const previewImg = document.querySelector('.Students-preview-img');
                    let avatar = '';
                    if (previewImg && previewImg.style.display !== 'none') {
                        avatar = previewImg.src;
                    }
                    
                    const formData = new FormData();
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
                    
                    if (editingDbId) {
                        await updateStudent(editingDbId, formData);
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
                    const tableTitle = document.querySelector('.Students-table-title').textContent;
                    const tableSubtitle = document.querySelector('.Students-table-subtitle').textContent;

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
                        const deptClass = getDepartmentClass(student.department);
                        
                        printTableHTML += `
                            <tr>
                                <td>${student.id}</td>
                                <td>${student.studentId}</td>
                                <td>${fullName}<br><small>${student.email}</small></td>
                                <td><span class="dept-badge ${deptClass}">${student.department}</span></td>
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
                                    .dept-badge { 
                                        padding: 4px 8px; 
                                        border-radius: 4px; 
                                        font-size: 11px; 
                                        font-weight: 600; 
                                    }
                                    .bsit { background: #e8f5e9; color: #2e7d32; }
                                    .bscs { background: #e8eaf6; color: #3949ab; }
                                    .business { background: #fff3e0; color: #ef6c00; }
                                    .nursing { background: #f3e5f5; color: #7b1fa2; }
                                    .education { background: #e1f5fe; color: #0277bd; }
                                    .default { background: #f5f5f5; color: #666; }
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
                            return a.studentId.localeCompare(b.studentId);
                        case 'department':
                            return a.department.localeCompare(b.department);
                        case 'section':
                            return a.section.localeCompare(b.section);
                        case 'status':
                            return a.status.localeCompare(b.status);
