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

        // --- Demo data ---
        let students = [
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
                const matchesFilter = filterValue === 'all' || s.status === filterValue;
                return matchesSearch && matchesFilter;
            });

            // Show/hide empty state
            const emptyState = document.getElementById('StudentsEmptyState');
            if (emptyState) {
                emptyState.style.display = filteredStudents.length === 0 ? 'flex' : 'none';
            }

            tableBody.innerHTML = filteredStudents.map(s => {
                const fullName = `${s.firstName} ${s.middleName ? s.middleName + ' ' : ''}${s.lastName}`;
                const deptClass = getDepartmentClass(s.department);
                
                return `
                <tr data-id="${s.id}">
                    <td class="student-row-id">${s.id}</td>
                    <td class="student-image-cell">
                        <div class="student-image-wrapper">
                            <img src="${s.avatar}" alt="${fullName}" class="student-avatar">
                        </div>
                    </td>
                    <td class="student-id">${s.studentId}</td>
                    <td class="student-name">
                        <div class="student-name-wrapper">
                            <strong>${fullName}</strong>
                            <small>${s.email}</small>
                        </div>
                    </td>
                    <td class="student-dept">
                        <span class="dept-badge ${deptClass}">${s.department}</span>
                    </td>
                    <td class="student-section">${s.section}</td>
                    <td class="student-contact">${s.contact}</td>
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
                            ${s.status === 'inactive' ? 
                                `<button class="Students-action-btn activate" data-id="${s.id}" title="Activate">
                                    <i class='bx bx-user-check'></i>
                                </button>` : 
                                `<button class="Students-action-btn deactivate" data-id="${s.id}" title="Deactivate">
                                    <i class='bx bx-user-x'></i>
                                </button>`
                            }
                        </div>
                    </td>
                </tr>
            `}).join('');

            updateStats();
            updateCounts(filteredStudents);
        }

        function getDepartmentClass(dept) {
            const classes = {
                'BSIT': 'bsit',
                'BSCS': 'bscs',
                'BSBA': 'business',
                'BSN': 'nursing',
                'BEED': 'education',
                'BSED': 'education'
            };
            return classes[dept] || 'default';
        }

        function formatStatus(status) {
            const statusMap = {
                'active': 'Active',
                'inactive': 'Inactive',
                'graduating': 'Graduating'
            };
            return statusMap[status] || status;
        }

        function updateStats() {
            const total = students.length;
            const active = students.filter(s => s.status === 'active').length;
            const inactive = students.filter(s => s.status === 'inactive').length;
            const graduating = students.filter(s => s.status === 'graduating').length;
            
            const totalEl = document.getElementById('totalStudents');
            const activeEl = document.getElementById('activeStudents');
            const inactiveEl = document.getElementById('inactiveStudents');
            const graduatingEl = document.getElementById('graduatingStudents');
            
            if (totalEl) totalEl.textContent = total;
            if (activeEl) activeEl.textContent = active;
            if (inactiveEl) inactiveEl.textContent = inactive;
            if (graduatingEl) graduatingEl.textContent = graduating;
        }

        function updateCounts(filteredStudents) {
            const showingEl = document.getElementById('showingStudentsCount');
            const totalCountEl = document.getElementById('totalStudentsCount');
            
            if (showingEl) showingEl.textContent = filteredStudents.length;
            if (totalCountEl) totalCountEl.textContent = students.length;
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
            delete modal.dataset.editingId;
        }

        // --- Event handlers ---
        function handleTableClick(e) {
            const viewBtn = e.target.closest('.Students-action-btn.view');
            const editBtn = e.target.closest('.Students-action-btn.edit');
            const activateBtn = e.target.closest('.Students-action-btn.activate');
            const deactivateBtn = e.target.closest('.Students-action-btn.deactivate');

            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.id);
                const student = students.find(s => s.id === id);
                if (student) {
                    alert(`Viewing ${student.firstName} ${student.lastName}\nStudent ID: ${student.studentId}\nEmail: ${student.email}\nDepartment: ${student.department}\nSection: ${student.section}`);
                }
            }

            if (editBtn) {
                const id = parseInt(editBtn.dataset.id);
                openModal(id);
            }

            if (activateBtn) {
                const id = parseInt(activateBtn.dataset.id);
                const student = students.find(s => s.id === id);
                if (student && confirm(`Activate student "${student.firstName} ${student.lastName}"?`)) {
                    student.status = 'active';
                    renderStudents();
                }
            }

            if (deactivateBtn) {
                const id = parseInt(deactivateBtn.dataset.id);
                const student = students.find(s => s.id === id);
                if (student && confirm(`Deactivate student "${student.firstName} ${student.lastName}"?`)) {
                    student.status = 'inactive';
                    renderStudents();
                }
            }
        }

        // --- Initialize ---
        function initialize() {
            // Initial render
            renderStudents();

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
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            previewImg.src = e.target.result;
                            previewImg.style.display = 'block';
                            previewPlaceholder.style.display = 'none';
                        }
                        reader.readAsDataURL(file);
                    }
                });
            }

            // Form submission
            if (studentsForm) {
                studentsForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const studentId = document.getElementById('studentId').value.trim();
                    const studentStatus = document.getElementById('studentStatus').value;
                    const firstName = document.getElementById('firstName').value.trim();
                    const middleName = document.getElementById('middleName').value.trim();
                    const lastName = document.getElementById('lastName').value.trim();
                    const studentEmail = document.getElementById('studentEmail').value.trim();
                    const studentContact = document.getElementById('studentContact').value.trim();
                    const studentDept = document.getElementById('studentDept').value;
                    const studentSection = document.getElementById('studentSection').value;
                    const studentAddress = document.getElementById('studentAddress').value.trim();
                    
                    if (!studentId || !firstName || !lastName || !studentEmail || !studentContact || !studentDept || !studentSection) {
                        alert('Please fill in all required fields.');
                        return;
                    }

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
                    }

                    renderStudents();
                    closeModal();
                });
            }

            // Search functionality
            if (searchInput) {
                searchInput.addEventListener('input', renderStudents);
            }

            // Filter functionality
            if (filterSelect) {
                filterSelect.addEventListener('change', renderStudents);
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
                        case 'id':
                        default:
                            return a.id - b.id;
                    }
                });
                renderStudents();
            }

            function getRandomColor() {
                const colors = ['ffd700', '4361ee', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            console.log('✅ Students module initialized successfully!');
        }

        // Start initialization
        initialize();

    } catch (error) {
        console.error('❌ Error initializing students module:', error);
    }
}

// Make function globally available
window.initStudentsModule = initStudentsModule;

// Auto-initialize if loaded directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudentsModule);
} else {
    setTimeout(initStudentsModule, 100);
}