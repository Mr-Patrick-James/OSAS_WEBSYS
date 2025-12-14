# Database Setup Instructions for Sections Feature

## Important: You need to create the departments table first!

The sections feature requires the `departments` table to exist in your database. Follow these steps:

## Option 1: Quick Setup (Recommended)

Run the **complete setup file** that creates both tables:

```sql
-- Import this file: database/setup_all.sql
```

This will:
1. Create the `departments` table
2. Insert sample departments
3. Create the `sections` table with foreign key relationship

## Option 2: Step-by-Step Setup

If you prefer to set up tables separately:

### Step 1: Create Departments Table

```sql
-- Import this file: database/departments_table.sql
```

This creates the `departments` table and inserts sample data.

### Step 2: Create Sections Table

```sql
-- Import this file: database/sections_table.sql
```

This creates the `sections` table that references the `departments` table.

## How to Run SQL Files

### Using phpMyAdmin:
1. Open phpMyAdmin
2. Select your database: `osas_sys_db`
3. Click on "Import" tab
4. Choose the SQL file
5. Click "Go"

### Using MySQL Command Line:
```bash
mysql -u root -p osas_sys_db < database/setup_all.sql
```

### Using MySQL Workbench:
1. Open MySQL Workbench
2. Connect to your database
3. File → Open SQL Script
4. Select the SQL file
5. Execute the script

## Verify Setup

After running the SQL, verify the tables exist:

```sql
SHOW TABLES LIKE 'departments';
SHOW TABLES LIKE 'sections';
```

You should see both tables listed.

## Troubleshooting

### Error: "Table 'departments' doesn't exist"
- Make sure you ran `departments_table.sql` or `setup_all.sql` first
- Check that you're using the correct database (`osas_sys_db`)

### Error: "Foreign key constraint fails"
- The `departments` table must exist before creating `sections` table
- Run `departments_table.sql` first, then `sections_table.sql`

### No departments showing in dropdown
- Check that departments were inserted: `SELECT * FROM departments;`
- Make sure at least one department has `status = 'active'`

## Sample Data

After setup, you'll have these departments:
- Computer Science (CS)
- Business Administration (BA)
- Nursing (NUR)
- Bachelor of Science in Information System (BSIS)
- Welding and Fabrication Technology (WFT)
- Bachelor of Technical-Vocational Education and Training (BTVTEd)

You can add more departments through the Departments page in your admin panel.

