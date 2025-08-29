function initSectionsModule() {
  console.log('🛠 Initializing Sections module...');

  // Elements
  const tableBody = document.getElementById('sectionTableBody');
  const btnAddSections = document.getElementById('btnAddSections');
  const modal = document.getElementById('SectionsModal');   // optional
  const closeBtn = document.getElementById('closeModal');   // optional

  if (!tableBody) {
    console.error('❗ #sectionTableBody not found. Table won’t render.');
    return;
  }

  // --- Static demo data (replace with your real data) ---
  let sections = [
    { id: 1, name: "CS-101", date: "2023-06-10", status: "active" },
    { id: 2, name: "BA-201", date: "2023-06-15", status: "archived" },
    { id: 3, name: "ED-301", date: "2023-07-01", status: "active" },
    { id: 4, name: "ENG-401", date: "2023-07-20", status: "archived" },
    { id: 5, name: "NUR-501", date: "2023-08-05", status: "active" }
  ];

  // --- Render helper ---
  function renderSections(rows) {
    tableBody.innerHTML = rows.map(s => `
      <tr data-id="${s.id}">
        <td>${s.id}</td>
        <td>${s.name}</td>
        <td>${s.date}</td>
        <td><span class="status ${s.status}">${s.status}</span></td>
        <td class="action-buttons">
          <button class="action-btn edit" data-id="${s.id}" title="Edit">✏️</button>
          <button class="action-btn delete" data-id="${s.id}" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Initial render
  renderSections(sections);

  // --- Actions: Edit / Delete (event delegation) ---
  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.action-btn.edit');
    const delBtn = e.target.closest('.action-btn.delete');

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const item = sections.find(s => s.id === id);
      if (!item) return;

      // If you have a modal, open & prefill; otherwise fallback
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Example: prefill fields if present
        const nameInput = modal.querySelector('input[name="section_name"]');
        const dateInput = modal.querySelector('input[name="section_date"]');
        const statusSelect = modal.querySelector('select[name="section_status"]');
        if (nameInput) nameInput.value = item.name;
        if (dateInput) dateInput.value = item.date;
        if (statusSelect) statusSelect.value = item.status;
        // You can store the current editing ID on the modal for save:
        modal.dataset.editingId = String(id);
      } else {
        alert(`Edit: ${item.name} (ID: ${id}) — hook up your modal fields here.`);
      }
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      const item = sections.find(s => s.id === id);
      if (!item) return;

      if (confirm(`Delete section "${item.name}"? This cannot be undone.`)) {
        sections = sections.filter(s => s.id !== id);
        renderSections(sections);
      }
    }
  });

  // --- Modal open/close (optional) ---
  if (btnAddSections && modal && closeBtn) {
    btnAddSections.addEventListener('click', () => {
      // Clear modal fields for "Add"
      const nameInput = modal.querySelector('input[name="section_name"]');
      const dateInput = modal.querySelector('input[name="section_date"]');
      const statusSelect = modal.querySelector('select[name="section_status"]');
      if (nameInput) nameInput.value = '';
      if (dateInput) dateInput.value = '';
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

    // Example: Save handler (optional)
    const saveBtn = modal.querySelector('#saveSection');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const nameInput = modal.querySelector('input[name="section_name"]');
        const dateInput = modal.querySelector('input[name="section_date"]');
        const statusSelect = modal.querySelector('select[name="section_status"]');

        const nameVal = nameInput?.value?.trim();
        const dateVal = dateInput?.value?.trim();
        const statusVal = statusSelect?.value || 'active';

        if (!nameVal || !dateVal) {
          alert('Please fill in Section Name and Date.');
          return;
        }

        const editingId = modal.dataset.editingId ? Number(modal.dataset.editingId) : null;

        if (editingId) {
          // Update existing
          const idx = sections.findIndex(s => s.id === editingId);
          if (idx !== -1) {
            sections[idx] = { ...sections[idx], name: nameVal, date: dateVal, status: statusVal };
          }
        } else {
          // Add new (auto ID)
          const newId = sections.length ? Math.max(...sections.map(s => s.id)) + 1 : 1;
          sections.push({ id: newId, name: nameVal, date: dateVal, status: statusVal });
        }

        renderSections(sections);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }
  } else {
    console.warn('ℹ️ Sections modal elements not found or not mounted (skipping modal wiring).');
  }

  console.log('✅ Sections module ready!');
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  initSectionsModule();
});
