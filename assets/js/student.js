function initStudentsModule() {
  console.log('🛠 Initializing Students module...');

  const btnAddStudents = document.getElementById('btnAddStudents');
  const modal = document.getElementById('StudentsModal');
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

// Image preview functionality
document.getElementById('studentImage').addEventListener('change', function(e) {
  const container = document.getElementById('imagePreview');
  const imagePreview = container.querySelector('.image-preview__image');
  const defaultText = container.querySelector('.image-preview__default-text');
  
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    
    reader.addEventListener('load', function() {
      imagePreview.style.display = 'block';
      defaultText.style.display = 'none';
      imagePreview.setAttribute('src', this.result);
    });
    
    reader.readAsDataURL(file);
  } else {
    imagePreview.style.display = 'none';
    defaultText.style.display = 'block';
    imagePreview.setAttribute('src', '');
  }
});