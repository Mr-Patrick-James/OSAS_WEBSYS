function initDepartmentModule() {
  console.log('🛠 Initializing Department module...');

  const btnAddDepartment = document.getElementById('btnAddDepartment');
  const modal = document.getElementById('departmentModal');
  const closeBtn = document.getElementById('closeModal');

  if (!btnAddDepartment || !modal || !closeBtn) {
    console.error('❗ Department module elements not found!');
    return;
  }

  btnAddDepartment.addEventListener('click', () => {
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

  console.log('✅ Department module ready!');
}
