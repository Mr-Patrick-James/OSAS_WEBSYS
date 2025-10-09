function initStudentsModule() {
  console.log('🛠 Initializing Students module...');

  // Elements
  const tableBody       = document.getElementById('StudentsTableBody'); // exact ID from your HTML
  const btnAddStudents  = document.getElementById('btnAddStudents');
  const modal           = document.getElementById('StudentsModal');
  const closeBtn        = document.getElementById('closeModal');
  const titleEl         = modal ? modal.querySelector('#studentsModalTitle') : null;

  if (!tableBody) {
    console.error('❗ #StudentsTableBody not found. Table won’t render.');
    return;
  }

  // --- Demo data (replace with real data) ---
  let students = [
    { id: 1, photo: '', studentId: '2023-001', name: 'Juan Dela Cruz', dept: 'Computer Science', section: 'CS-101', contact: '09171234567' },
    { id: 2, photo: '', studentId: '2023-002', name: 'Maria Santos',    dept: 'Business Administration', section: 'BA-201', contact: '09179876543' },
    { id: 3, photo: '', studentId: '2023-003', name: 'Pedro Reyes',     dept: 'Education', section: 'ED-301', contact: '09171239876' },
    { id: 4, photo: '', studentId: '2023-004', name: 'Anna Lopez',      dept: 'Engineering', section: 'ENG-401', contact: '09174563218' },
    { id: 5, photo: '', studentId: '2023-005', name: 'Chris Lim',       dept: 'Nursing', section: 'NUR-501', contact: '09175678901' }
  ];

  // --- Render helper ---
  function renderStudents(rows) {
    tableBody.innerHTML = rows.map(s => `
      <tr data-id="${s.id}">
        <td>${s.id}</td>
        <td>
          ${s.photo
            ? `<img src="${s.photo}" alt="${s.name}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">`
            : `<div style="width:36px;height:36px;border-radius:50%;background:rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;font-size:14px;">👤</div>`
          }
        </td>
        <td>${s.studentId}</td>
        <td>${s.name}</td>
        <td>${s.dept}</td>
        <td>${s.section}</td>
        <td>${s.contact}</td>
        <td class="action-buttons">
          <button class="action-btn edit" data-id="${s.id}" title="Edit">✏️</button>
          <button class="action-btn delete" data-id="${s.id}" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Initial render
  renderStudents(students);

  // --- Event delegation for Edit/Delete ---
  tableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.action-btn.edit');
    const delBtn  = e.target.closest('.action-btn.delete');

    if (editBtn) {
      const id = Number(editBtn.dataset.id);
      const item = students.find(s => s.id === id);
      if (!item) return;

      if (modal) {
        openStudentsModalForEdit(item);
      } else {
        alert(`Edit: ${item.name} (ID: ${id}) — add a modal to edit.`);
      }
    }

    if (delBtn) {
      const id = Number(delBtn.dataset.id);
      const item = students.find(s => s.id === id);
      if (!item) return;

      if (confirm(`Delete student "${item.name}"? This cannot be undone.`)) {
        students = students.filter(s => s.id !== id);
        renderStudents(students);
      }
    }
  });

  // --- Modal wiring (if present) ---
  if (btnAddStudents && modal && closeBtn) {
    btnAddStudents.addEventListener('click', () => openStudentsModalForAdd());
    closeBtn.addEventListener('click', closeStudentsModal);
    modal.addEventListener('click', (ev) => { if (ev.target === modal) closeStudentsModal(); });

    // Save handler
    const saveBtn = modal.querySelector('#saveStudent');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const fields = getStudentFieldsFromModal();
        if (!fields.studentId || !fields.name || !fields.dept || !fields.section || !fields.contact) {
          alert('Please complete Student ID, Name, Department, Section, and Contact No.');
          return;
        }

        const editingId = modal.dataset.editingId ? Number(modal.dataset.editingId) : null;

        if (editingId) {
          // Update
          const idx = students.findIndex(s => s.id === editingId);
          if (idx !== -1) students[idx] = { id: editingId, ...fields };
        } else {
          // Add
          const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
          students.push({ id: newId, ...fields });
        }

        renderStudents(students);
        closeStudentsModal();
      });
    }

    // Image preview
    const imageInput = modal.querySelector('#studentImage');
    const previewContainer = modal.querySelector('#imagePreview');
    if (imageInput && previewContainer) {
      const imagePreview = previewContainer.querySelector('.image-preview__image');
      const defaultText  = previewContainer.querySelector('.image-preview__default-text');
      imageInput.addEventListener('change', function(e) {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.addEventListener('load', function() {
            if (imagePreview) {
              imagePreview.style.display = 'block';
              imagePreview.src = String(this.result);
            }
            if (defaultText) defaultText.style.display = 'none';
          });
          reader.readAsDataURL(file);
        } else {
          if (imagePreview) {
            imagePreview.style.display = 'none';
            imagePreview.src = '';
          }
          if (defaultText) defaultText.style.display = 'block';
        }
      });
    }
  } else {
    console.warn('ℹ️ Students modal elements not found or not mounted (skipping modal wiring).');
  }

  console.log('✅ Students module ready!');

  // ------- Helpers -------
  function openStudentsModalForAdd() {
    if (titleEl) titleEl.textContent = 'Add Student';
    setStudentModalFields({ studentId: '', name: '', dept: '', section: '', contact: '', photo: '' });
    delete modal.dataset.editingId;
    showStudentsModal();
  }

  function openStudentsModalForEdit(item) {
    if (titleEl) titleEl.textContent = 'Edit Student';
    setStudentModalFields(item);
    modal.dataset.editingId = String(item.id);
    showStudentsModal();
  }

  function showStudentsModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeStudentsModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function setStudentModalFields({ studentId, name, dept, section, contact, photo }) {
    const idInput      = modal.querySelector('input[name="student_id"]');
    const nameInput    = modal.querySelector('input[name="student_name"]');
    const deptInput    = modal.querySelector('input[name="student_department"]');
    const sectionInput = modal.querySelector('input[name="student_section"]');
    const contactInput = modal.querySelector('input[name="student_contact"]');

    if (idInput)      idInput.value = studentId || '';
    if (nameInput)    nameInput.value = name || '';
    if (deptInput)    deptInput.value = dept || '';
    if (sectionInput) sectionInput.value = section || '';
    if (contactInput) contactInput.value = contact || '';

    // Preview
    const previewContainer = modal.querySelector('#imagePreview');
    if (previewContainer) {
      const imagePreview = previewContainer.querySelector('.image-preview__image');
      const defaultText  = previewContainer.querySelector('.image-preview__default-text');

      if (imagePreview && photo) {
        imagePreview.style.display = 'block';
        imagePreview.src = photo;
        if (defaultText) defaultText.style.display = 'none';
      } else {
        if (imagePreview) {
          imagePreview.style.display = 'none';
          imagePreview.src = '';
        }
        if (defaultText) defaultText.style.display = 'block';
      }

      // Clear file input so choosing same file again still triggers change
      const imageInput = modal.querySelector('#studentImage');
      if (imageInput) imageInput.value = '';
    }
  }

  function getStudentFieldsFromModal() {
    const idInput      = modal.querySelector('input[name="student_id"]');
    const nameInput    = modal.querySelector('input[name="student_name"]');
    const deptInput    = modal.querySelector('input[name="student_department"]');
    const sectionInput = modal.querySelector('input[name="student_section"]');
    const contactInput = modal.querySelector('input[name="student_contact"]');

    // Pull current preview as photo
    const previewImg = modal.querySelector('.image-preview__image');
    const photoSrc = (previewImg && previewImg.style.display !== 'none' && previewImg.getAttribute('src')) ? previewImg.getAttribute('src') : '';

    return {
      studentId: idInput?.value?.trim() || '',
      name:      nameInput?.value?.trim() || '',
      dept:      deptInput?.value?.trim() || '',
      section:   sectionInput?.value?.trim() || '',
      contact:   contactInput?.value?.trim() || '',
      photo:     photoSrc
    };
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  initStudentsModule();
});
