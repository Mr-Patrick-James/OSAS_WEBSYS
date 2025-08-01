function initSectionsModule() {
  console.log('🛠 Initializing Students module...');

  const btnAddStudents = document.getElementById('btnAddSections');
  const modal = document.getElementById('SectionsModal');
  const closeBtn = document.getElementById('closeModal'); // note: same ID name as sa department, ok lang yan as long as nasa ibang fragment siya

  if (!btnAddStudents || !modal || !closeBtn) {
    console.error('❗ Students module elements not found!');
    return;
  }

  btnAddStudents.addEventListener('click', () => {
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

  console.log('✅ Students module ready!');
}
