function initDepartmentModule() {
  console.log('🛠 Initializing Department module...');

  // Elements
  const tableBody = document.getElementById('departmentTableBody');
  const btnAddDepartment = document.getElementById('btnAddDepartment'); // optional
  const modal = document.getElementById('departmentModal');             // optional
  const closeBtn = document.getElementById('closeModal');               // optional

  if (!tableBody) {
    console.error('❗ #departmentTableBody not found. Table won’t render.');
    return;
  }

  // --- Demo data (replace with real data) ---
  let departments = [
    { id: 1, name: "Bachelor of Science in Information System", date: "2023-06-12", status: "active" },
    { id: 2, name: "Weilding and Fabrication Technology", date: "2023-06-18", status: "active" },
    { id: 3, name: "Bachelor of Technical-Vocational Education and Training", date: "2023-07-02", status: "active" },
    { id: 4, name: "Computer Hardware Servicing", date: "2023-07-15", status: "active" }
  ];

  // --- Render helper ---
  function renderDepartments(rows) {
    tableBody.innerHTML = rows.map(d => `
      <tr data-id="${d.id}">
        <td>${d.id}</td>
        <td>${d.name}</td>
        <td>${d.date}</td>
        <td><span class="status ${d.status}">${d.status}</span></td>
        <td class="action-buttons">
          <button class="action-btn edit" data-id="${d.id}" title="Edit">✏️</button>
          <button class="action-btn delete" data-id="${d.id}" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Initial render
  renderDepartments(departments);

  // --- Actions (event delegation) ---
  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.action-btn.edit');
    const delBtn  = e.target.closest('.action-btn.delete');

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const item = departments.find(d => d.id === id);
      if (!item) return;

      if (modal) {
        // Open modal + prefill if inputs exist
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        const nameInput   = modal.querySelector('input[name="department_name"]');
        const dateInput   = modal.querySelector('input[name="department_date"]');
        const statusSelect= modal.querySelector('select[name="department_status"]');

        if (nameInput)    nameInput.value = item.name;
        if (dateInput)    dateInput.value = item.date;
        if (statusSelect) statusSelect.value = item.status;

        modal.dataset.editingId = String(id);
      } else {
        alert(`Edit: ${item.name} (ID: ${id}) — hook up your modal fields here.`);
      }
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      const item = departments.find(d => d.id === id);
      if (!item) return;

      if (confirm(`Delete department "${item.name}"? This cannot be undone.`)) {
        departments = departments.filter(d => d.id !== id);
        renderDepartments(departments);
      }
    }
  });

  // --- Modal open/close + Save (optional) ---
  if (btnAddDepartment && modal && closeBtn) {
    btnAddDepartment.addEventListener('click', () => {
      // Clear for "Add"
      const nameInput    = modal.querySelector('input[name="department_name"]');
      const dateInput    = modal.querySelector('input[name="department_date"]');
      const statusSelect = modal.querySelector('select[name="department_status"]');

      if (nameInput)    nameInput.value = '';
      if (dateInput)    dateInput.value = '';
      if (statusSelect) statusSelect.value = 'active';
      delete modal.dataset.editingId;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });

    // Hook up a Save button if present
    const saveBtn = modal.querySelector('#saveDepartment');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const nameInput    = modal.querySelector('input[name="department_name"]');
        const dateInput    = modal.querySelector('input[name="department_date"]');
        const statusSelect = modal.querySelector('select[name="department_status"]');

        const nameVal   = nameInput?.value?.trim();
        const dateVal   = dateInput?.value?.trim();
        const statusVal = statusSelect?.value || 'active';

        if (!nameVal || !dateVal) {
          alert('Please fill in Department Name and Date.');
          return;
        }

        const editingId = modal.dataset.editingId ? Number(modal.dataset.editingId) : null;

        if (editingId) {
          // Update existing
          const idx = departments.findIndex(d => d.id === editingId);
          if (idx !== -1) {
            departments[idx] = { ...departments[idx], name: nameVal, date: dateVal, status: statusVal };
          }
        } else {
          // Add new
          const newId = departments.length ? Math.max(...departments.map(d => d.id)) + 1 : 1;
          departments.push({ id: newId, name: nameVal, date: dateVal, status: statusVal });
        }

        renderDepartments(departments);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }
  } else {
    console.warn('ℹ️ Department modal elements not found or not mounted (skipping modal wiring).');
  }

  console.log('✅ Department module ready!');
}

// Boot it
document.addEventListener('DOMContentLoaded', () => {
  initDepartmentModule();
});
