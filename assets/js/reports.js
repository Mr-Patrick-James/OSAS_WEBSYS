// reports.js - Complete working version
function initReportsModule() {
    console.log('🛠 Reports module initializing...');
    
    try {
        // Elements
        const tableBody = document.getElementById('ReportsTableBody');
        const btnGenerateReport = document.getElementById('btnGenerateReports');
        const btnGenerateFirst = document.getElementById('btnGenerateFirstReport');
        const btnExportReports = document.getElementById('btnExportReports');
        const btnPrintReports = document.getElementById('btnPrintReports');
        const btnRefreshReports = document.getElementById('btnRefreshReports');
        const generateModal = document.getElementById('ReportsGenerateModal');
        const detailsModal = document.getElementById('ReportDetailsModal');
        const closeGenerateBtn = document.getElementById('closeReportsModal');
        const closeDetailsBtn = document.getElementById('closeDetailsModal');
        const cancelGenerateBtn = document.getElementById('cancelReportsModal');
        const generateOverlay = document.getElementById('ReportsModalOverlay');
        const detailsOverlay = document.getElementById('DetailsModalOverlay');
        const generateForm = document.getElementById('ReportsGenerateForm');
        const searchInput = document.getElementById('searchReport');
        const deptFilter = document.getElementById('ReportsDepartmentFilter');
        const sectionFilter = document.getElementById('ReportsSectionFilter');
        const statusFilter = document.getElementById('ReportsStatusFilter');
        const timeFilter = document.getElementById('ReportsTimeFilter');
        const sortByFilter = document.getElementById('ReportsSortBy');
        const applyFiltersBtn = document.getElementById('applyFilters');
        const clearFiltersBtn = document.getElementById('clearFilters');
        const resetFiltersBtn = document.getElementById('resetFilters');
        const dateRangeGroup = document.getElementById('dateRangeGroup');
        const viewButtons = document.querySelectorAll('.Reports-view-btn');

        // Debug logging
        console.log('🔍 Generate button found:', btnGenerateReport);
        console.log('🔍 Generate modal found:', generateModal);

        if (!btnGenerateReport) {
            console.error('❌ #btnGenerateReports NOT FOUND!');
            return;
        }

        if (!generateModal) {
            console.error('❌ #ReportsGenerateModal NOT FOUND!');
            return;
        }

        // ========== DATA & CONFIG ==========
        
        // Demo data for reports (aggregated from violations)
        let reports = [
            { 
                id: 1,
                reportId: 'R001',
                studentId: '2024-001',
                studentName: 'John Doe',
                studentImage: 'https://ui-avatars.com/api/?name=John+Doe&background=ff6b6b&color=fff&size=80',
                studentContact: '09171234567',
                department: 'BS Information System',
                deptCode: 'BSIS',
                section: 'BSIS-1',
                uniformCount: 3,
                footwearCount: 2,
                noIdCount: 1,
                totalViolations: 6,
                status: 'disciplinary',
                statusLabel: 'Disciplinary Action',
                lastUpdated: '2024-03-15',
                history: [
                    { date: 'Mar 15, 2024', title: 'Improper Uniform - Warning 3', desc: 'Third offense for improper uniform' },
                    { date: 'Mar 1, 2024', title: 'Improper Footwear - Warning 2', desc: 'Second offense for improper footwear' },
                    { date: 'Feb 15, 2024', title: 'No ID - Warning 1', desc: 'First offense for not wearing ID' }
                ],
                recommendations: [
                    'Schedule counseling session with student',
                    'Notify parents about disciplinary status',
                    'Monitor student for next 30 days'
                ]
            },
            { 
                id: 2,
                reportId: 'R002',
                studentId: '2024-002',
                studentName: 'Maria Santos',
                studentImage: 'https://ui-avatars.com/api/?name=Maria+Santos&background=1dd1a1&color=fff&size=80',
                studentContact: '09179876543',
                department: 'Welding & Fabrication Tech',
                deptCode: 'WFT',
                section: 'WFT-2',
                uniformCount: 2,
                footwearCount: 1,
                noIdCount: 1,
                totalViolations: 4,
                status: 'permitted',
                statusLabel: 'Permitted',
                lastUpdated: '2024-03-10',
                history: [
                    { date: 'Mar 10, 2024', title: 'Improper Uniform - Warning 1', desc: 'First offense for improper uniform' },
                    { date: 'Feb 28, 2024', title: 'Improper Footwear - Permitted 2', desc: 'Second offense for improper footwear' }
                ],
                recommendations: [
                    'Issue written warning',
                    'Monitor uniform compliance'
                ]
            },
            { 
                id: 3,
                reportId: 'R003',
                studentId: '2024-003',
                studentName: 'Pedro Reyes',
                studentImage: 'https://ui-avatars.com/api/?name=Pedro+Reyes&background=54a0ff&color=fff&size=80',
                studentContact: '09171239876',
                department: 'BTVTED',
                deptCode: 'BTVTED',
                section: 'BTVTED-3',
                uniformCount: 1,
                footwearCount: 0,
                noIdCount: 2,
                totalViolations: 3,
                status: 'permitted',
                statusLabel: 'Permitted',
                lastUpdated: '2024-03-05',
                history: [
                    { date: 'Mar 5, 2024', title: 'No ID - Warning 2', desc: 'Second offense for not wearing ID' },
                    { date: 'Feb 20, 2024', title: 'Improper Uniform - Permitted 1', desc: 'First offense for improper uniform' }
                ],
                recommendations: [
                    'Remind student to always wear ID',
                    'Monitor ID compliance for 2 weeks'
                ]
            }
        ];

        // ========== HELPER FUNCTIONS ==========
        
        function getDepartmentClass(deptCode) {
            const classes = {
                'BSIS': 'bsis',
                'WFT': 'wft',
                'BTVTED': 'btvted',
                'CHS': 'chs'
            };
            return classes[deptCode] || 'default';
        }

        function getStatusClass(status) {
            const classes = {
                'permitted': 'permitted',
                'warning': 'warning',
                'disciplinary': 'disciplinary'
            };
            return classes[status] || 'default';
        }

        function getCountBadgeClass(count) {
            if (count >= 3) return 'high';
            if (count >= 2) return 'medium';
            if (count >= 1) return 'low';
            return 'none';
        }

        function calculateStats() {
            const totalViolations = reports.reduce((sum, report) => sum + report.totalViolations, 0);
            const uniformViolations = reports.reduce((sum, report) => sum + report.uniformCount, 0);
            const footwearViolations = reports.reduce((sum, report) => sum + report.footwearCount, 0);
            const noIdViolations = reports.reduce((sum, report) => sum + report.noIdCount, 0);
            
            // Update stats cards
            document.getElementById('totalViolationsCount').textContent = totalViolations;
            document.getElementById('uniformViolations').textContent = uniformViolations;
            document.getElementById('footwearViolations').textContent = footwearViolations;
            document.getElementById('noIdViolations').textContent = noIdViolations;
            
            // Update footer stats
            document.getElementById('totalStudentsCount').textContent = reports.length;
            document.getElementById('totalViolationsFooter').textContent = totalViolations;
            document.getElementById('avgViolations').textContent = reports.length > 0 ? (totalViolations / reports.length).toFixed(1) : '0';
            document.getElementById('totalReportsCount').textContent = reports.length;
        }

        // ========== RENDER FUNCTIONS ==========
        
        function renderReports() {
            if (!tableBody) return;
            
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const deptValue = deptFilter ? deptFilter.value : 'all';
            const sectionValue = sectionFilter ? sectionFilter.value : 'all';
            const statusValue = statusFilter ? statusFilter.value : 'all';
            const sortValue = sortByFilter ? sortByFilter.value : 'total_desc';
            
            let filteredReports = reports.filter(report => {
                const matchesSearch = report.studentName.toLowerCase().includes(searchTerm) || 
                                    report.reportId.toLowerCase().includes(searchTerm) ||
                                    report.studentId.toLowerCase().includes(searchTerm);
                const matchesDept = deptValue === 'all' || report.deptCode === deptValue;
                const matchesSection = sectionValue === 'all' || report.section === sectionValue;
                const matchesStatus = statusValue === 'all' || report.status === statusValue;
                return matchesSearch && matchesDept && matchesSection && matchesStatus;
            });

            // Sort reports
            filteredReports.sort((a, b) => {
                switch(sortValue) {
                    case 'total_desc':
                        return b.totalViolations - a.totalViolations;
                    case 'total_asc':
                        return a.totalViolations - b.totalViolations;
                    case 'name_asc':
                        return a.studentName.localeCompare(b.studentName);
                    case 'name_desc':
                        return b.studentName.localeCompare(a.studentName);
                    case 'dept_asc':
                        return a.department.localeCompare(b.department);
                    case 'section_asc':
                        return a.section.localeCompare(b.section);
                    default:
                        return b.id - a.id;
                }
            });

            // Show/hide empty state
            const emptyState = document.getElementById('ReportsEmptyState');
            if (emptyState) {
                emptyState.style.display = filteredReports.length === 0 ? 'flex' : 'none';
            }

            tableBody.innerHTML = filteredReports.map(report => {
                const deptClass = getDepartmentClass(report.deptCode);
                const statusClass = getStatusClass(report.status);
                const uniformClass = getCountBadgeClass(report.uniformCount);
                const footwearClass = getCountBadgeClass(report.footwearCount);
                const noIdClass = getCountBadgeClass(report.noIdCount);
                const totalClass = getCountBadgeClass(report.totalViolations);
                
                return `
                <tr data-id="${report.id}">
                    <td class="report-id">${report.reportId}</td>
                    <td class="report-student-info">
                        <div class="student-info-wrapper">
                            <div class="student-avatar">
                                <img src="${report.studentImage}" alt="${report.studentName}">
                            </div>
                            <div class="student-details">
                                <strong>${report.studentName}</strong>
                                <small>${report.studentId} • ${report.studentContact}</small>
                            </div>
                        </div>
                    </td>
                    <td class="report-dept">
                        <span class="dept-badge ${deptClass}">${report.department}</span>
                    </td>
                    <td class="report-section">${report.section}</td>
                    <td class="violation-count uniform">
                        <div class="count-badge ${uniformClass}">${report.uniformCount}</div>
                    </td>
                    <td class="violation-count footwear">
                        <div class="count-badge ${footwearClass}">${report.footwearCount}</div>
                    </td>
                    <td class="violation-count no-id">
                        <div class="count-badge ${noIdClass}">${report.noIdCount}</div>
                    </td>
                    <td class="total-violations">
                        <div class="total-badge ${totalClass}">${report.totalViolations}</div>
                    </td>
                    <td>
                        <span class="Reports-status-badge ${statusClass}">${report.statusLabel}</span>
                    </td>
                    <td>
                        <div class="Reports-action-buttons">
                            <button class="Reports-action-btn view" data-id="${report.id}" title="View Details">
                                <i class='bx bx-show'></i>
                            </button>
                            <button class="Reports-action-btn export" data-id="${report.id}" title="Export Report">
                                <i class='bx bx-download'></i>
                            </button>
                            <button class="Reports-action-btn print" data-id="${report.id}" title="Print Report">
                                <i class='bx bx-printer'></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join('');

            // Update showing count
            document.getElementById('showingReportsCount').textContent = filteredReports.length;
            calculateStats();
        }

        // ========== MODAL FUNCTIONS ==========
        
        function openGenerateModal() {
            console.log('🎯 Opening generate report modal...');
            generateModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set default dates
            const today = new Date();
            const startDate = document.getElementById('startDate');
            const endDate = document.getElementById('endDate');
            
            if (startDate) {
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate.value = firstDay.toISOString().split('T')[0];
            }
            
            if (endDate) {
                endDate.value = today.toISOString().split('T')[0];
            }
        }

        function openDetailsModal(reportId) {
            if (!detailsModal) return;
            
            const report = reports.find(r => r.id === reportId);
            if (!report) return;
            
            // Populate details
            document.getElementById('detailReportTitle').textContent = `Violation Report - ${report.studentName}`;
            document.getElementById('detailReportId').textContent = report.reportId;
            document.getElementById('detailReportDate').textContent = new Date().toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            document.getElementById('detailStudentName').textContent = report.studentName;
            document.getElementById('detailStudentId').textContent = report.studentId;
            document.getElementById('detailStudentDept').textContent = report.department;
            document.getElementById('detailStudentSection').textContent = report.section;
            document.getElementById('detailStudentContact').textContent = report.studentContact;
            document.getElementById('detailReportPeriod').textContent = `Jan 1, 2024 - ${new Date(report.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            
            document.getElementById('detailUniformCount').textContent = report.uniformCount;
            document.getElementById('detailFootwearCount').textContent = report.footwearCount;
            document.getElementById('detailNoIdCount').textContent = report.noIdCount;
            document.getElementById('detailTotalCount').textContent = report.totalViolations;
            
            // Populate timeline
            const timelineEl = document.getElementById('detailTimeline');
            if (timelineEl) {
                timelineEl.innerHTML = report.history.map(item => `
                    <div class="timeline-item">
                        <div class="timeline-date">${item.date}</div>
                        <div class="timeline-content">
                            <span class="timeline-title">${item.title}</span>
                            <span class="timeline-desc">${item.desc}</span>
                        </div>
                    </div>
                `).join('');
            }
            
            // Populate recommendations
            const recommendationsEl = document.getElementById('detailRecommendations');
            if (recommendationsEl) {
                recommendationsEl.innerHTML = report.recommendations.map(rec => `
                    <div class="recommendation-item">
                        <i class='bx bx-check-circle'></i>
                        <span>${rec}</span>
                    </div>
                `).join('');
            }
            
            detailsModal.dataset.viewingId = reportId;
            detailsModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeGenerateModal() {
            console.log('Closing generate modal');
            generateModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Reset form if exists
            const form = document.getElementById('ReportsGenerateForm');
            if (form) form.reset();
        }

        function closeDetailsModal() {
            if (!detailsModal) return;
            detailsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            delete detailsModal.dataset.viewingId;
        }

        // ========== EVENT HANDLERS ==========
        
        function handleTableClick(e) {
            const viewBtn = e.target.closest('.Reports-action-btn.view');
            const exportBtn = e.target.closest('.Reports-action-btn.export');
            const printBtn = e.target.closest('.Reports-action-btn.print');

            if (viewBtn) {
                const id = parseInt(viewBtn.dataset.id);
                openDetailsModal(id);
            }

            if (exportBtn) {
                const id = parseInt(exportBtn.dataset.id);
                const report = reports.find(r => r.id === id);
                if (report) {
                    alert(`Exporting report ${report.reportId} for ${report.studentName}`);
                    // In a real app, this would trigger a download
                }
            }

            if (printBtn) {
                const id = parseInt(printBtn.dataset.id);
                const report = reports.find(r => r.id === id);
                if (report) {
                    printReport(report);
                }
            }
        }

        function handleStudentSearch() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            renderReports();
        }

        // ========== EVENT LISTENERS ==========
        
        // 1. OPEN GENERATE MODAL
        if (btnGenerateReport) {
            btnGenerateReport.addEventListener('click', openGenerateModal);
            console.log('✅ Added click event to btnGenerateReports');
        }

        // 2. OPEN GENERATE MODAL (FIRST REPORT)
        if (btnGenerateFirst) {
            btnGenerateFirst.addEventListener('click', openGenerateModal);
            console.log('✅ Added click event to btnGenerateFirstReport');
        }

        // 3. EXPORT REPORTS
        if (btnExportReports) {
            btnExportReports.addEventListener('click', function() {
                alert('Exporting all reports...');
                // In a real app, this would trigger a bulk export
            });
        }

        // 4. PRINT REPORTS
        if (btnPrintReports) {
            btnPrintReports.addEventListener('click', function() {
                printAllReports();
            });
        }

        // 5. REFRESH REPORTS
        if (btnRefreshReports) {
            btnRefreshReports.addEventListener('click', function() {
                renderReports();
                alert('Reports refreshed!');
            });
        }

        // 6. CLOSE MODAL BUTTONS
        if (closeGenerateBtn) {
            closeGenerateBtn.addEventListener('click', closeGenerateModal);
            console.log('✅ Added click event to closeReportsModal');
        }

        if (cancelGenerateBtn) {
            cancelGenerateBtn.addEventListener('click', closeGenerateModal);
            console.log('✅ Added click event to cancelReportsModal');
        }

        if (generateOverlay) {
            generateOverlay.addEventListener('click', closeGenerateModal);
            console.log('✅ Added click event to ReportsModalOverlay');
        }

        if (closeDetailsBtn) closeDetailsBtn.addEventListener('click', closeDetailsModal);
        if (detailsOverlay) detailsOverlay.addEventListener('click', closeDetailsModal);

        // 7. ESCAPE KEY TO CLOSE MODAL
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (generateModal && generateModal.classList.contains('active')) {
                    closeGenerateModal();
                }
                if (detailsModal && detailsModal.classList.contains('active')) {
                    closeDetailsModal();
                }
            }
        });

        // 8. TABLE EVENT LISTENERS
        if (tableBody) {
            tableBody.addEventListener('click', handleTableClick);
        }

        // 9. SEARCH FUNCTIONALITY
        if (searchInput) {
            searchInput.addEventListener('input', handleStudentSearch);
        }

        // 10. FILTER FUNCTIONALITY
        if (deptFilter) {
            deptFilter.addEventListener('change', renderReports);
        }

        if (sectionFilter) {
            sectionFilter.addEventListener('change', renderReports);
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', renderReports);
        }

        if (timeFilter) {
            timeFilter.addEventListener('change', function() {
                if (this.value === 'custom') {
                    dateRangeGroup.style.display = 'block';
                } else {
                    dateRangeGroup.style.display = 'none';
                    renderReports();
                }
            });
        }

        if (sortByFilter) {
            sortByFilter.addEventListener('change', renderReports);
        }

        // 11. APPLY FILTERS BUTTON
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', renderReports);
        }

        // 12. CLEAR FILTERS BUTTON
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                if (deptFilter) deptFilter.value = 'all';
                if (sectionFilter) sectionFilter.value = 'all';
                if (statusFilter) statusFilter.value = 'all';
                if (timeFilter) timeFilter.value = 'today';
                if (sortByFilter) sortByFilter.value = 'total_desc';
                if (dateRangeGroup) dateRangeGroup.style.display = 'none';
                if (searchInput) searchInput.value = '';
                renderReports();
            });
        }

        // 13. RESET FILTERS BUTTON
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', function() {
                if (deptFilter) deptFilter.value = 'all';
                if (sectionFilter) sectionFilter.value = 'all';
                if (statusFilter) statusFilter.value = 'all';
                renderReports();
            });
        }

        // 14. FORM SUBMISSION
        if (generateForm) {
            generateForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const reportName = document.getElementById('reportName').value.trim();
                const reportType = document.getElementById('reportType').value;
                const reportFormat = document.getElementById('reportFormat').value;
                const startDate = document.getElementById('startDate').value;
                const endDate = document.getElementById('endDate').value;
                
                if (!reportName || !reportType || !reportFormat || !startDate || !endDate) {
                    alert('Please fill in all required fields.');
                    return;
                }

                alert(`Report generation started: ${reportName}\nType: ${reportType}\nFormat: ${reportFormat}\nPeriod: ${startDate} to ${endDate}`);
                closeGenerateModal();
                
                // Simulate report generation
                setTimeout(() => {
                    alert('Report generation completed! The report has been added to the list.');
                    // In a real app, this would add a new report to the list
                }, 2000);
            });
        }

        // 15. VIEW OPTIONS (Table/Grid/Card view)
        if (viewButtons.length > 0) {
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const view = this.dataset.view;
                    
                    // Remove active class from all buttons
                    viewButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // For now, just log the view change
                    console.log(`Switched to ${view} view`);
                    alert(`Switched to ${view} view (Note: Grid/Card view implementation would go here)`);
                });
            });
        }

        // 16. DETAILS MODAL ACTION BUTTONS
        const detailExportBtn = document.getElementById('detailExportBtn');
        const detailPrintBtn = document.getElementById('detailPrintBtn');
        const detailEditBtn = document.getElementById('detailEditBtn');
        const detailShareBtn = document.getElementById('detailShareBtn');
        const detailDownloadBtn = document.getElementById('detailDownloadBtn');

        if (detailExportBtn) {
            detailExportBtn.addEventListener('click', function() {
                const reportId = detailsModal.dataset.viewingId;
                const report = reports.find(r => r.id === parseInt(reportId));
                if (report) {
                    alert(`Exporting report ${report.reportId}`);
                }
            });
        }

        if (detailPrintBtn) {
            detailPrintBtn.addEventListener('click', function() {
                const reportId = detailsModal.dataset.viewingId;
                const report = reports.find(r => r.id === parseInt(reportId));
                if (report) {
                    printReport(report);
                }
            });
        }

        if (detailEditBtn) {
            detailEditBtn.addEventListener('click', function() {
                alert('Edit report feature would open here');
            });
        }

        if (detailShareBtn) {
            detailShareBtn.addEventListener('click', function() {
                alert('Share report feature would open here');
            });
        }

        if (detailDownloadBtn) {
            detailDownloadBtn.addEventListener('click', function() {
                alert('Download PDF feature would trigger here');
            });
        }

        // ========== UTILITY FUNCTIONS ==========
        
        function printReport(report) {
            const printContent = `
                <html>
                    <head>
                        <title>Violation Report - ${report.studentName}</title>
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                            h1 { color: #333; margin-bottom: 10px; }
                            h2 { color: #555; margin-bottom: 20px; }
                            .report-header { margin-bottom: 30px; }
                            .report-info { margin-bottom: 20px; }
                            .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
                            .info-item { margin-bottom: 8px; }
                            .info-label { font-weight: 600; color: #666; }
                            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
                            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
                            .stat-title { font-size: 14px; color: #666; margin-bottom: 5px; }
                            .stat-value { font-size: 24px; font-weight: 700; color: #333; }
                            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                            th { background-color: #f8f9fa; font-weight: 600; }
                        </style>
                    </head>
                    <body>
                        <div class="report-header">
                            <h1>Student Violation Report</h1>
                            <p>Report ID: ${report.reportId}</p>
                            <p>Generated: ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric'
                            })}</p>
                        </div>
                        
                        <div class="report-info">
                            <h2>Student Information</h2>
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Name:</span> ${report.studentName}
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Student ID:</span> ${report.studentId}
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Department:</span> ${report.department}
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Section:</span> ${report.section}
                                </div>
                            </div>
                        </div>
                        
                        <h2>Violation Statistics</h2>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-title">Uniform Violations</div>
                                <div class="stat-value">${report.uniformCount}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-title">Footwear Violations</div>
                                <div class="stat-value">${report.footwearCount}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-title">No ID Violations</div>
                                <div class="stat-value">${report.noIdCount}</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-title">Total Violations</div>
                                <div class="stat-value">${report.totalViolations}</div>
                            </div>
                        </div>
                        
                        <h2>Violation History</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Violation</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${report.history.map(item => `
                                    <tr>
                                        <td>${item.date}</td>
                                        <td>${item.title}</td>
                                        <td>${item.desc}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }

        function printAllReports() {
            const printContent = `
                <html>
                    <head>
                        <title>All Violation Reports - OSAS System</title>
                        <style>
                            body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                            th { background-color: #f8f9fa; font-weight: 600; }
                            h1 { color: #333; margin-bottom: 10px; }
                            .report-header { margin-bottom: 30px; }
                            .report-date { color: #666; margin-bottom: 20px; }
                            .summary { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; }
                        </style>
                    </head>
                    <body>
                        <div class="report-header">
                            <h1>All Student Violation Reports</h1>
                            <p style="color: #666;">Comprehensive violation analysis report</p>
                            <div class="report-date">Generated on: ${new Date().toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</div>
                        </div>
                        
                        <div class="summary">
                            <strong>Summary:</strong> ${reports.length} students, ${reports.reduce((sum, r) => sum + r.totalViolations, 0)} total violations
                        </div>
                        
                        <table>
                            <thead>
                                <tr>
                                    <th>Report ID</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>Section</th>
                                    <th>Uniform</th>
                                    <th>Footwear</th>
                                    <th>No ID</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${reports.map(report => `
                                    <tr>
                                        <td>${report.reportId}</td>
                                        <td>${report.studentName}</td>
                                        <td>${report.department}</td>
                                        <td>${report.section}</td>
                                        <td>${report.uniformCount}</td>
                                        <td>${report.footwearCount}</td>
                                        <td>${report.noIdCount}</td>
                                        <td>${report.totalViolations}</td>
                                        <td>${report.statusLabel}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            const printWindow = window.open('', '_blank');
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }

        // ========== INITIAL RENDER ==========
        renderReports();
        console.log('✅ Reports module initialized successfully!');
        
    } catch (error) {
        console.error('❌ Error initializing reports module:', error);
    }
}

// Make function globally available
window.initReportsModule = initReportsModule;

// Auto-initialize if loaded directly (for testing)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReportsModule);
} else {
    // Give a small delay for dynamic loading
    setTimeout(initReportsModule, 500);
}