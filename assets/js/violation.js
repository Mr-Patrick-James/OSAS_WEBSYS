function initViolationsModule() {
  console.log('🛠 Initializing Violations module...');

  const btnAddViolations = document.getElementById('btnAddViolations');
  const modal = document.getElementById('ViolationDetailsModal'); // NEW ID
  const closeBtn = document.getElementById('closeDetailsModal'); // NEW ID

  if (!btnAddViolations || !modal || !closeBtn) {
    console.error('❗ Violations module elements not found!');
    return;
  }

  btnAddViolations.addEventListener('click', () => {
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

  console.log('✅ Violations module ready!');
}
