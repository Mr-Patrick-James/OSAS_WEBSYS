# Fix for Sections Dropdown Not Loading

## Problem
The sections dropdown is empty because:
1. The API path is hardcoded incorrectly (uses `../api/sections.php` instead of the correct path)
2. Missing API base URL constants for departments and sections
3. Missing `loadDepartments()` function

## Required Changes to `assets/js/student.js`

### 1. Add API Base URLs (After line 43)

**Find this:**
```javascript
        console.log('API Base URL:', apiBase); // Debug log

        // --- API Functions ---
```

**Replace with:**
```javascript
        const departmentsApiBase = window.location.pathname.includes('admin_page')
            ? '../../api/departments.php'
            : '../api/departments.php';
            
        const sectionsApiBase = window.location.pathname.includes('admin_page')
            ? '../../api/sections.php'
            : '../api/sections.php';
        
        console.log('API Base URL:', apiBase); // Debug log

        // --- API Functions ---
```

### 2. Add loadDepartments Function (Before line 302, before `loadSectionsByDepartment`)

**Find this:**
```javascript
        }

        async function loadSectionsByDepartment(departmentCode) {
```

**Replace with:**
```javascript
        }

        async function loadDepartments() {
            if (!studentDeptSelect) {
                console.warn('studentDeptSelect element not found');
                return;
            }
            
            try {
                const response = await fetch(departmentsApiBase);
                const result = await response.json();
                console.log('Departments API response:', result);
                
                studentDeptSelect.innerHTML = '<option value="">Select Department</option>';
                
                if (result.status === 'success' && result.data && result.data.length > 0) {
                    result.data.forEach(dept => {
                        const option = document.createElement('option');
                        option.value = dept.code;
                        option.textContent = dept.name;
                        studentDeptSelect.appendChild(option);
                    });
                    console.log(`Loaded ${result.data.length} departments`);
                } else {
                    studentDeptSelect.innerHTML = '<option value="">No departments available</option>';
                    console.warn('No departments found:', result);
                }
            } catch (error) {
                console.error('Error loading departments:', error);
                studentDeptSelect.innerHTML = '<option value="">Error loading departments</option>';
            }
        }

        async function loadSectionsByDepartment(departmentCode) {
```

### 3. Fix loadSectionsByDepartment API Path (Around line 308)

**Find this:**
```javascript
            try {
                const response = await fetch(`../api/sections.php?action=getByDepartment&department_code=${encodeURIComponent(departmentCode)}`);
                const result = await response.json();
```

**Replace with:**
```javascript
            try {
                const url = `${sectionsApiBase}?action=getByDepartment&department_code=${encodeURIComponent(departmentCode)}`;
                console.log('Loading sections from:', url);
                const response = await fetch(url);
                const result = await response.json();
                console.log('Sections API response:', result);
```

### 4. Update openModal to Load Departments (Around line 478)

**Find this:**
```javascript
        // --- Modal functions ---
        function openModal(editId = null) {
            if (!modal) return;
            
            const modalTitle = document.getElementById('StudentsModalTitle');
            const form = document.getElementById('StudentsForm');
            
            editingStudentId = editId;
            
            if (editId) {
```

**Replace with:**
```javascript
        // --- Modal functions ---
        async function openModal(editId = null) {
            if (!modal) return;
            
            const modalTitle = document.getElementById('StudentsModalTitle');
            const form = document.getElementById('StudentsForm');
            
            editingStudentId = editId;
            
            // Load departments every time modal opens
            await loadDepartments();
            
            if (editId) {
```

### 5. Fix Section Loading in Edit Mode (Around line 502)

**Find this:**
```javascript
                    // Load sections for the department
                    if (student.department) {
                        loadSectionsByDepartment(student.department).then(() => {
                            if (student.section_id) {
                                document.getElementById('studentSection').value = student.section_id;
                            }
                        });
                    }
```

**Replace with:**
```javascript
                    // Load sections for the department
                    if (student.department) {
                        await loadSectionsByDepartment(student.department);
                        if (student.section_id) {
                            document.getElementById('studentSection').value = student.section_id;
                        }
                    }
```

## Testing After Changes

1. Save the file
2. Clear browser cache (Ctrl+F5)
3. Open browser console (F12)
4. Click "Add Student" button
5. Check console for:
   - "Departments API response:" log
   - "Loaded X departments" log
6. Select a department from dropdown
7. Check console for:
   - "Loading sections from: ..." log
   - "Sections API response:" log
   - "Loaded X sections for department ..." log

## Expected API Response Format

**Departments API (`/api/departments.php`):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Computer Science",
      "code": "CS"
    }
  ]
}
```

**Sections API (`/api/sections.php?action=getByDepartment&department_code=CS`):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "section_code": "CS-1A",
      "section_name": "Section 1A",
      "department_id": 1
    }
  ]
}
```

## Troubleshooting

If sections still don't load:
1. Check browser console for errors
2. Check Network tab to see if API request is made
3. Verify API endpoint works: Open `http://your-domain/api/sections.php?action=getByDepartment&department_code=YOUR_DEPT_CODE` in browser
4. Verify database has sections with `status = 'active'` for the selected department
5. Verify sections have correct `department_id` that matches the department's `id` (not `department_code`)

