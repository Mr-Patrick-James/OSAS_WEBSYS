// violations.js - COMPLETE WORKING VERSION
function initViolationsModule() {
    console.log('🛠 Violations module initializing...');
    
    try {
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
        
        // Demo data
        let violations = [
            { 
                id: 1,
                caseId: 'VIOL-2024-001',
                studentId: '2023-001',
                studentName: 'John Michael Doe',
                studentImage: 'https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=40',
                studentDept: 'BSIS',
                studentSection: 'BSIS-3A',
                studentContact: '+63 912 345 6789',
                violationType: 'improper_uniform',
                violationTypeLabel: 'Improper Uniform',
                violationLevel: 'warning2',
                violationLevelLabel: 'Warning 2',
                department: 'BSIS',
                section: 'BSIS-3A',
                dateReported: '2024-02-15',
                dateTime: 'Feb 15, 2024 • 08:15 AM',
                location: 'gate_1',
                locationLabel: 'Main Gate 1',
                reportedBy: 'Officer Maria Santos',
                status: 'warning',
                statusLabel: 'Warning',
                notes: 'Student was found wearing improper uniform - wearing colored undershirt instead of the required white undershirt. This is the second offense for improper uniform violation.',
                attachments: [],
                history: [
                    { date: '2024-02-15 08:15', title: 'Warning 2 - Improper Uniform', desc: 'Reported at Main Gate 1 by Officer Maria Santos' },
                    { date: '2024-01-30 07:45', title: 'Warning 1 - Improper Uniform', desc: 'First offense - Parent was notified' },
                    { date: '2023-12-12 08:30', title: 'Permitted 2 - No ID', desc: 'Second offense for not wearing ID' }
                ]
            },
            { 
                id: 2,
                caseId: 'VIOL-2024-002',
                studentId: '2023-002',
                studentName: 'Maria Santos',
                studentImage: 'https://ui-avatars.com/api/?name=Maria+Santos&background=4361ee&color=fff&size=40',
                studentDept: 'WFT',
                studentSection: 'WFT-2B',
                studentContact: '+63 923 456 7890',
                violationType: 'no_id',
                violationTypeLabel: 'No ID',
                violationLevel: 'permitted1',
                violationLevelLabel: 'Permitted 1',
                department: 'WFT',
                section: 'WFT-2B',
                dateReported: '2024-02-14',
                dateTime: 'Feb 14, 2024 • 07:30 AM',
                location: 'gate_2',
                locationLabel: 'Gate 2',
                reportedBy: 'Officer Juan Dela Cruz',
                status: 'permitted',
                statusLabel: 'Permitted',
                notes: 'Student forgot to bring ID. First offense.',
                attachments: [],
                history: [
                    { date: '2024-02-14 07:30', title: 'Permitted 1 - No ID', desc: 'First offense - Verbal reminder given' }
                ]
            }
        ];

        // Student data for search
        const students = [
            { 
                id: 1,
                studentId: '2023-001',
                firstName: 'John',
                middleName: 'Michael',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                contact: '+63 912 345 6789',
                department: 'BSIS',
                section: 'BSIS-3A',
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ffd700&color=333&size=80'
            },
            { 
                id: 2,
                studentId: '2023-002',
                firstName: 'Maria',
                middleName: 'Clara',
                lastName: 'Santos',
                email: 'maria.santos@example.com',
                contact: '+63 923 456 7890',
                department: 'WFT',
                section: 'WFT-2B',
                status: 'active',
                avatar: 'https://ui-avatars.com/api/?name=Maria+Santos&background=4361ee&color=fff&size=80'
            }
        ];

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

        // ========== RENDER FUNCTIONS ==========
        
        function renderViolations() {
            if (!tableBody) return;
            
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const deptValue = deptFilter ? deptFilter.value : 'all';
            const statusValue = statusFilter ? statusFilter.value : 'all';
            
            const filteredViolations = violations.filter(v => {
                const matchesSearch = v.studentName.toLowerCase().includes(searchTerm) || 
                                    v.caseId.toLowerCase().includes(searchTerm) ||
                                    v.studentId.toLowerCase().includes(searchTerm) ||
                                    v.violationTypeLabel.toLowerCase().includes(searchTerm);
                const matchesDept = deptValue === 'all' || v.department === deptValue;
                const matchesStatus = statusValue === 'all' || v.status === statusValue;
                return matchesSearch && matchesDept && matchesStatus;
            });

            // Show/hide empty state
            const emptyState = document.getElementById('ViolationsEmptyState');
            if (emptyState) {
                emptyState.style.display = filteredViolations.length === 0 ? 'flex' : 'none';
            }

            tableBody.innerHTML = filteredViolations.map(v => {
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
                                <img src="${v.studentImage}" alt="${v.studentName}" class="student-avatar">
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
            `}).join('');

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
                    document.getElementById('violationTime').value = '08:15';
                    document.getElementById('violationLocation').value = violation.location;
                    document.getElementById('reportedBy').value = violation.reportedBy;
                    document.getElementById('violationNotes').value = violation.notes;
                }
                recordModal.dataset.editingId = editId;
            } else {
                // Add new mode
                modalTitle.textContent = 'Record New Violation';
                if (form) form.reset();
                if (selectedStudentCard) selectedStudentCard.style.display = 'none';
                delete recordModal.dataset.editingId;
            }
        }

        function openDetailsModal(violationId) {
            if (!detailsModal) return;
            
            const violation = violations.find(v => v.id === violationId);
            if (!violation) return;
            
            // Populate details
            document.getElementById('detailCaseId').textContent = violation.caseId;
            document.getElementById('detailStatusBadge').textContent = violation.statusLabel;
            const statusBadge = document.getElementById('detailStatusBadge');
            if (statusBadge) statusBadge.className = `case-status-badge ${getStatusClass(violation.status)}`;
            
            document.getElementById('detailStudentImage').src = violation.studentImage;
            document.getElementById('detailStudentName').textContent = violation.studentName;
            document.getElementById('detailStudentId').textContent = violation.studentId;
            document.getElementById('detailStudentDept').textContent = violation.department;
            const studentDeptBadge = document.getElementById('detailStudentDept');
            if (studentDeptBadge) studentDeptBadge.className = `student-dept badge ${getDepartmentClass(violation.department)}`;
            document.getElementById('detailStudentSection').textContent = violation.section;
            document.getElementById('detailStudentContact').textContent = violation.studentContact;
            
            document.getElementById('detailViolationType').textContent = violation.violationTypeLabel;
            const violationTypeBadge = document.getElementById('detailViolationType');
            if (violationTypeBadge) violationTypeBadge.className = `detail-value badge ${getViolationTypeClass(violation.violationType)}`;
            document.getElementById('detailViolationLevel').textContent = violation.violationLevelLabel;
            const violationLevelBadge = document.getElementById('detailViolationLevel');
            if (violationLevelBadge) violationLevelBadge.className = `detail-value badge ${getViolationLevelClass(violation.violationLevel)}`;
            document.getElementById('detailViolationDateTime').textContent = violation.dateTime;
            document.getElementById('detailViolationLocation').textContent = violation.locationLabel;
            document.getElementById('detailReportedBy').textContent = violation.reportedBy;
            document.getElementById('detailStatus').textContent = violation.statusLabel;
            const detailStatusBadge = document.getElementById('detailStatus');
            if (detailStatusBadge) detailStatusBadge.className = `detail-value badge ${getStatusClass(violation.status)}`;
            document.getElementById('detailViolationNotes').textContent = violation.notes;
            
            // Populate timeline
            const timelineEl = document.getElementById('detailTimeline');
            if (timelineEl) {
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
                    violation.status = 'resolved';
                    violation.statusLabel = 'Resolved';
                    violation.history.push({
                        date: new Date().toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        title: 'Case Resolved',
                        desc: 'Violation marked as resolved'
                    });
                    renderViolations();
                }
            }

            if (reopenBtn) {
                const id = parseInt(reopenBtn.dataset.id);
                const violation = violations.find(v => v.id === id);
                if (violation && confirm(`Reopen violation ${violation.caseId}?`)) {
                    violation.status = 'warning';
                    violation.statusLabel = 'Warning';
                    violation.history.push({
                        date: new Date().toLocaleString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        title: 'Case Reopened',
                        desc: 'Violation reopened for further action'
                    });
                    renderViolations();
                }
            }
        }

        function handleStudentSearch() {
            const searchTerm = studentSearchInput.value.toLowerCase().trim();
            if (!searchTerm) {
                alert('Please enter a student ID or name to search.');
                return;
            }
            
            const student = students.find(s => 
                s.studentId.toLowerCase().includes(searchTerm) || 
                `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm)
            );
            
            if (student) {
                document.getElementById('modalStudentId').textContent = student.studentId;
                document.getElementById('modalStudentName').textContent = `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`;
                document.getElementById('modalStudentImage').src = student.avatar;
                document.getElementById('modalStudentDept').textContent = student.department;
                document.getElementById('modalStudentSection').textContent = student.section;
                document.getElementById('modalStudentContact').textContent = student.contact;
                if (selectedStudentCard) selectedStudentCard.style.display = 'flex';
            } else {
                alert('Student not found. Please check the Student ID or name.');
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

        // 4. ESCAPE KEY TO CLOSE MODAL
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (recordModal && recordModal.classList.contains('active')) {
                    closeRecordModal();
                }
                if (detailsModal && detailsModal.classList.contains('active')) {
                    closeDetailsModal();
                }
            }
        });

        // 5. TABLE EVENT LISTENERS
        if (tableBody) {
            tableBody.addEventListener('click', handleTableClick);
        }

        // 6. FORM SUBMISSION
        if (violationForm) {
            violationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Check if student is selected
                const studentId = document.getElementById('modalStudentId').textContent;
                if (!studentId || studentId === '') {
                    alert('Please search and select a student first.');
                    return;
                }
                
                const violationType = document.querySelector('input[name="violationType"]:checked');
                const violationLevel = document.querySelector('input[name="violationLevel"]:checked');
                const violationDate = document.getElementById('violationDate').value;
                const violationTime = document.getElementById('violationTime').value;
                const location = document.getElementById('violationLocation').value;
                const reportedBy = document.getElementById('reportedBy').value.trim();
                const notes = document.getElementById('violationNotes').value.trim();
                
                if (!violationType || !violationLevel || !violationDate || !violationTime || !location || !reportedBy) {
                    alert('Please fill in all required fields.');
                    return;
                }

                const editingId = recordModal.dataset.editingId;
                
                if (editingId) {
                    // Edit existing violation
                    const violation = violations.find(v => v.id === parseInt(editingId));
                    if (violation) {
                        violation.violationType = violationType.value;
                        violation.violationTypeLabel = violationType.parentElement.querySelector('span').textContent;
                        violation.violationLevel = violationLevel.value;
                        violation.violationLevelLabel = violationLevel.parentElement.querySelector('.level-title').textContent;
                        violation.dateReported = violationDate;
                        violation.location = location;
                        const locationOption = document.querySelector(`#violationLocation option[value="${location}"]`);
                        violation.locationLabel = locationOption ? locationOption.textContent : location;
                        violation.reportedBy = reportedBy;
                        violation.notes = notes;
                        
                        // Update dateTime
                        const date = new Date(violationDate);
                        const timeParts = violationTime.split(':');
                        date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                        violation.dateTime = date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                        }) + ' • ' + date.toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                    }
                } else {
                    // Add new violation
                    const student = students.find(s => s.studentId === studentId);
                    if (!student) {
                        alert('Selected student not found in database.');
                        return;
                    }
                    
                    const newId = violations.length > 0 ? Math.max(...violations.map(v => v.id)) + 1 : 1;
                    const caseId = generateCaseId();
                    
                    const date = new Date(violationDate);
                    const timeParts = violationTime.split(':');
                    date.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]));
                    const dateTimeStr = date.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    }) + ' • ' + date.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    // Determine status based on level
                    let status = 'warning';
                    let statusLabel = 'Warning';
                    if (violationLevel.value.startsWith('permitted')) {
                        status = 'permitted';
                        statusLabel = 'Permitted';
                    } else if (violationLevel.value === 'disciplinary') {
                        status = 'disciplinary';
                        statusLabel = 'Disciplinary';
                    }
                    
                    violations.push({
                        id: newId,
                        caseId: caseId,
                        studentId: student.studentId,
                        studentName: `${student.firstName} ${student.middleName ? student.middleName + ' ' : ''}${student.lastName}`,
                        studentImage: student.avatar,
                        studentDept: student.department,
                        studentSection: student.section,
                        studentContact: student.contact,
                        violationType: violationType.value,
                        violationTypeLabel: violationType.parentElement.querySelector('span').textContent,
                        violationLevel: violationLevel.value,
                        violationLevelLabel: violationLevel.parentElement.querySelector('.level-title').textContent,
                        department: student.department,
                        section: student.section,
                        dateReported: violationDate,
                        dateTime: dateTimeStr,
                        location: location,
                        locationLabel: document.querySelector(`#violationLocation option[value="${location}"]`)?.textContent || location,
                        reportedBy: reportedBy,
                        status: status,
                        statusLabel: statusLabel,
                        notes: notes,
                        attachments: [],
                        history: [
                            { 
                                date: dateTimeStr, 
                                title: `${violationLevel.parentElement.querySelector('.level-title').textContent} - ${violationType.parentElement.querySelector('span').textContent}`, 
                                desc: `Reported at ${document.querySelector(`#violationLocation option[value="${location}"]`)?.textContent || location} by ${reportedBy}` 
                            }
                        ]
                    });
                }

                renderViolations();
                closeRecordModal();
                alert('Violation saved successfully!');
            });
        }

        // 7. STUDENT SEARCH
        if (searchStudentBtn) {
            searchStudentBtn.addEventListener('click', handleStudentSearch);
        }

        // 8. ENTER KEY IN STUDENT SEARCH
        if (studentSearchInput) {
            studentSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleStudentSearch();
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
            searchInput.addEventListener('input', renderViolations);
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

        // ========== INITIAL RENDER ==========
        renderViolations();
        console.log('✅ Violations module initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing violations module:', error);
    }
}

// Make function globally available
window.initViolationsModule = initViolationsModule;

// Auto-initialize if loaded directly (for testing)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViolationsModule);
} else {
    // Give a small delay for dynamic loading
    setTimeout(initViolationsModule, 500);
}