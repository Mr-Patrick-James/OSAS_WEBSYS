// sections.js - Database-integrated version
function initSectionsModule() {
    console.log('🛠 Sections module initializing...');
    
    try {
        // Elements
        const tableBody = document.getElementById('sectionsTableBody');
        const btnAddSection = document.getElementById('btnAddSection');
        const btnAddFirstSection = document.getElementById('btnAddFirstSection');
        const modal = document.getElementById('sectionsModal');
        const modalOverlay = document.getElementById('sectionsModalOverlay');
        const closeBtn = document.getElementById('closeSectionsModal');
        const cancelBtn = document.getElementById('cancelSectionsModal');
        const sectionsForm = document.getElementById('sectionsForm');
        const searchInput = document.getElementById('searchSection');
        const filterSelect = document.getElementById('sectionFilterSelect');
        const printBtn = document.getElementById('btnPrintSection');

        // Check for essential elements
        if (!tableBody) {
            console.error('❗ #sectionsTableBody not found');
            return;
        }

        if (!modal) {
            console.warn('⚠️ #sectionsModal not found');
        }

        // Sections data from database
        let sections = [];
        let allSections = []; // Store all sections for filtering

        // API base URL
        const apiBase = '../api/sections.php';

        // Track current view mode
        let currentView = 'active'; // 'active' or 'archived'

        // --- API Functions ---
        async function fetchSections() {
            try {
                // Determine filter based on current view
                const filter = currentView === 'archived' ? 'archived' : 'active';
                const search = searchInput ? searchInput.value : '';
                
                let url = `${apiBase}?action=get&filter=${filter}`;
                if (search) {
                    url += `&search=${encodeURIComponent(search)}`;
                }

                console.log('Fetching sections from:', url); // Debug log

                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                console.log('Raw API Response:', text); // Debug log

                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseError) {
                    console.error('JSON Parse Error:', parseError);
                    console.error('Response was:', text);
                    throw new Error('Invalid JSON response from server');
                }

                console.log('Parsed API Response:', data); // Debug log

                if (data.status === 'success') {
                    sections = data.data;
                    allSections = data.data; // Store all for stats
                    renderSections();
                    updateStats();
                } else {
                    console.error('Error fetching sections:', data.message);
                    showError('Failed to load sections: ' + data.message);
                }
            } catch (error) {
                console.error('Error fetching sections:', error);
                console.error('Full error details:', error.message, error.stack);
                showError('Failed to load sections. Please check your connection and console for details.');
            }
        }

        async function fetchStats() {
            try {
                const response = await fetch(`${apiBase}?action=stats`);
                const data = await response.json();

                if (data.status === 'success') {
                    updateStatsFromData(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        }

        async function addSection(formData) {
            try {
                const response = await fetch(`${apiBase}?action=add`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(data.message || 'Section added successfully!');
                    await fetchSections();
                    await fetchStats();
                    closeModal();
                } else {
                    showError(data.message || 'Failed to add section');
                }
            } catch (error) {
                console.error('Error adding section:', error);
                showError('Failed to add section. Please try again.');
            }
        }

        async function updateSection(sectionId, formData) {
            try {
                formData.append('sectionId', sectionId);
                const response = await fetch(`${apiBase}?action=update`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(data.message || 'Section updated successfully!');
                    await fetchSections();
                    await fetchStats();
                    closeModal();
                } else {
                    showError(data.message || 'Failed to update section');
                }
            } catch (error) {
                console.error('Error updating section:', error);
                showError('Failed to update section. Please try again.');
            }
        }

        async function deleteSection(sectionId) {
            try {
                const response = await fetch(`${apiBase}?action=delete&id=${sectionId}`, {
                    method: 'GET'
                });
                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(data.message || 'Section archived successfully!');
                    await fetchSections();
                    await fetchStats();
                } else {
                    showError(data.message || 'Failed to archive section');
                }
            } catch (error) {
                console.error('Error deleting section:', error);
                showError('Failed to delete section. Please try again.');
            }
        }

        async function archiveSection(sectionId) {
            try {
                const response = await fetch(`${apiBase}?action=archive&id=${sectionId}`, {
                    method: 'GET'
                });
                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(data.message || 'Section archived successfully!');
                    await fetchSections();
                    await fetchStats();
                } else {
                    showError(data.message || 'Failed to archive section');
                }
            } catch (error) {
                console.error('Error archiving section:', error);
                showError('Failed to archive section. Please try again.');
            }
        }

        async function restoreSection(sectionId) {
            try {
                const response = await fetch(`${apiBase}?action=restore&id=${sectionId}`, {
                    method: 'GET'
                });
                const data = await response.json();

                if (data.status === 'success') {
                    showSuccess(data.message || 'Section restored successfully!');
                    await fetchSections();
                    await fetchStats();
                } else {
                    showError(data.message || 'Failed to restore section');
                }
            } catch (error) {
                console.error('Error restoring section:', error);
                showError('Failed to restore section. Please try again.');
            }
        }

        async function loadDepartments() {
            try {
                const response = await fetch('../api/departments.php');
                const data = await response.json();

                if (data.status === 'success') {
                    const select = document.getElementById('sectionDepartment');
                    if (select) {
                        // Clear existing options except the first one
                        const firstOption = select.querySelector('option[value=""]');
                        select.innerHTML = '';
                        if (firstOption) {
                            select.appendChild(firstOption);
                        }
                        
                        // Add departments
                        data.data.forEach(dept => {
                            const option = document.createElement('option');
                            option.value = dept.id;
                            option.textContent = dept.name;
                            select.appendChild(option);
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading departments:', error);
            }
        }

        // --- Render function ---
        function renderSections() {
            if (sections.length === 0) {
                tableBody.innerHTML = '';
                const emptyState = document.getElementById('sectionsEmptyState');
                if (emptyState) {
                    emptyState.style.display = 'flex';
                }
                updateCounts([]);
                return;
            }

            const emptyState = document.getElementById('sectionsEmptyState');
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            tableBody.innerHTML = sections.map(s => `
                <tr data-id="${s.id}">
                    <td class="section-id">${s.section_id || 'SEC-' + String(s.id).padStart(3, '0')}</td>
                    <td class="section-name">
                        <div class="section-name-wrapper">
                            <div class="section-icon">
                                <i class='bx bx-group'></i>
                            </div>
                            <div>
                                <strong>${escapeHtml(s.name)}</strong>
                                <small class="section-year">${escapeHtml(s.academic_year || '')}</small>
                            </div>
                        </div>
                    </td>
                    <td class="department-name">${escapeHtml(s.department || 'N/A')}</td>
                    <td class="student-count">${s.student_count || 0}</td>
                    <td class="date-created">${s.date || ''}</td>
                    <td>
                        <span class="sections-status-badge ${s.status}">${s.status === 'active' ? 'Active' : 'Archived'}</span>
                    </td>
                    <td>
                        <div class="sections-action-buttons">
                            <button class="sections-action-btn edit" data-id="${s.id}" title="Edit">
                                <i class='bx bx-edit'></i>
                            </button>
                            ${s.status === 'archived' ? 
                                `<button class="sections-action-btn restore" data-id="${s.id}" title="Restore">
                                    <i class='bx bx-reset'></i>
                                </button>` : 
                                ''
                            }
                            <button class="sections-action-btn delete" data-id="${s.id}" title="Delete">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

            updateCounts(sections);
        }

        function updateStats() {
            fetchStats();
        }

        function updateStatsFromData(stats) {
            const totalEl = document.getElementById('totalSections');
            const activeEl = document.getElementById('activeSections');
            const archivedEl = document.getElementById('archivedSections');
            
            if (totalEl) totalEl.textContent = stats.total || 0;
            if (activeEl) activeEl.textContent = stats.active || 0;
            if (archivedEl) archivedEl.textContent = stats.archived || 0;
        }

        function updateCounts(filteredSections) {
            const showingEl = document.getElementById('showingSectionsCount');
            const totalCountEl = document.getElementById('totalSectionsCount');
            
            if (showingEl) showingEl.textContent = filteredSections.length;
            if (totalCountEl) totalCountEl.textContent = allSections.length;
        }

        // --- Modal functions ---
        function openModal(editId = null) {
            if (!modal) return;
            
            const modalTitle = document.getElementById('sectionsModalTitle');
            const form = document.getElementById('sectionsForm');
            
            if (editId) {
                modalTitle.textContent = 'Edit Section';
                const section = sections.find(s => s.id == editId);
                if (section) {
                    document.getElementById('sectionName').value = section.name || '';
                    document.getElementById('sectionCode').value = section.code || '';
                    document.getElementById('sectionDepartment').value = section.department_id || '';
                    document.getElementById('academicYear').value = section.academic_year || '';
                    document.getElementById('sectionStatus').value = section.status || 'active';
                }
                modal.dataset.editingId = editId;
            } else {
                modalTitle.textContent = 'Add New Section';
                if (form) form.reset();
                delete modal.dataset.editingId;
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            if (!modal) return;
            
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            const form = document.getElementById('sectionsForm');
            if (form) form.reset();
            delete modal.dataset.editingId;
        }

        // --- Event handlers ---
        function handleTableClick(e) {
            const editBtn = e.target.closest('.sections-action-btn.edit');
            const restoreBtn = e.target.closest('.sections-action-btn.restore');
            const deleteBtn = e.target.closest('.sections-action-btn.delete');

            if (editBtn) {
                const id = editBtn.dataset.id;
                openModal(id);
            }

            if (restoreBtn) {
                const id = restoreBtn.dataset.id;
                const section = sections.find(s => s.id == id);
                if (section && confirm(`Restore section "${section.name}"?`)) {
                    restoreSection(id);
                }
            }

            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                const section = sections.find(s => s.id == id);
                if (section && confirm(`Archive section "${section.name}"? This will move it to archived.`)) {
                    deleteSection(id);
                }
            }
        }

        // --- Utility functions ---
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function showSuccess(message) {
            alert(message); // You can replace this with a better notification system
        }

        function showError(message) {
            alert(message); // You can replace this with a better notification system
        }

        // --- Initialize ---
        async function initialize() {
            // Load departments for dropdown
            await loadDepartments();

            // Set default view to active (hide archived by default)
            currentView = 'active';
            if (filterSelect) {
                filterSelect.value = 'active';
            }

            // Initial load - only active sections
            await fetchSections();

            // Event listeners for table
            tableBody.addEventListener('click', handleTableClick);

            // Add Section button
            if (btnAddSection) {
                btnAddSection.addEventListener('click', () => openModal());
            }

            // Add First Section button
            if (btnAddFirstSection) {
                btnAddFirstSection.addEventListener('click', () => openModal());
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

            // Form submission
            if (sectionsForm) {
                sectionsForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const sectionName = document.getElementById('sectionName').value.trim();
                    const sectionCode = document.getElementById('sectionCode').value.trim();
                    const sectionDepartment = document.getElementById('sectionDepartment').value;
                    const academicYear = document.getElementById('academicYear').value.trim();
                    const sectionStatus = document.getElementById('sectionStatus').value;
                    
                    if (!sectionName || !sectionCode || !sectionDepartment || !academicYear) {
                        alert('Please fill in all required fields.');
                        return;
                    }

                    const editingId = modal.dataset.editingId;
                    const formData = new FormData();
                    formData.append('sectionName', sectionName);
                    formData.append('sectionCode', sectionCode);
                    formData.append('sectionDepartment', sectionDepartment);
                    formData.append('academicYear', academicYear);
                    formData.append('sectionStatus', sectionStatus);
                    
                    if (editingId) {
                        await updateSection(editingId, formData);
                    } else {
                        await addSection(formData);
                    }
                });
            }

            // Search functionality
            if (searchInput) {
                let searchTimeout;
                searchInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        fetchSections();
                    }, 500); // Debounce search
                });
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
                    fetchSections();
                    // Update archived button state
                    const btnArchived = document.getElementById('btnArchivedSections');
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
            const btnArchived = document.getElementById('btnArchivedSections');
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
                    fetchSections();
                });
            }

            // Print functionality
            if (printBtn) {
                printBtn.addEventListener('click', function() {
                    const printArea = document.getElementById('sectionsPrintArea');
                    const tableTitle = document.querySelector('.sections-table-title')?.textContent || 'Section List';
                    const tableSubtitle = document.querySelector('.sections-table-subtitle')?.textContent || 'All academic sections and their details';

                    const printContent = `
                <html>
                  <head>
                    <title>Sections Report - OSAS System</title>
                    <style>
                      body { font-family: 'Segoe UI', sans-serif; margin: 40px; }
                      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                      th { background-color: #f8f9fa; font-weight: 600; }
                      h1 { color: #333; margin-bottom: 10px; }
                      .report-header { margin-bottom: 30px; }
                      .report-date { color: #666; margin-bottom: 20px; }
                      .sections-status-badge { 
                        padding: 4px 12px; 
                        border-radius: 20px; 
                        font-size: 12px; 
                        font-weight: 600; 
                      }
                      .active { background: #e8f5e9; color: #2e7d32; }
                      .archived { background: #ffebee; color: #c62828; }
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
                    ${printArea.innerHTML}
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
            const sortHeaders = document.querySelectorAll('.sections-sortable');
            sortHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const sortBy = this.dataset.sort;
                    sortSections(sortBy);
                });
            });

            function sortSections(sortBy) {
                sections.sort((a, b) => {
                    switch(sortBy) {
                        case 'name':
                            return a.name.localeCompare(b.name);
                        case 'date':
                            return new Date(b.date) - new Date(a.date);
                        case 'id':
                        default:
                            return (a.section_id || '').localeCompare(b.section_id || '');
                    }
                });
                renderSections();
            }

            console.log('✅ Sections module initialized successfully!');
        }

        // Start initialization
        initialize();

    } catch (error) {
        console.error('❌ Error initializing sections module:', error);
    }
}

// Make function globally available
window.initSectionsModule = initSectionsModule;

// Auto-initialize if loaded directly
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionsModule);
} else {
    setTimeout(initSectionsModule, 100);
}

