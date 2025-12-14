# Deployment Guide for Online Hosting

## Issues Fixed

The following issues have been fixed to make your application work on online hosting:

1. ✅ **Database Connection**: Both `api/students.php` and `api/violations.php` now use the centralized `config/db_connect.php` file
2. ✅ **Error Display**: Error display is now configurable (disabled in production mode)
3. ✅ **Database Name**: Consistent database name usage

## Required Configuration for Online Hosting

### Step 1: Update Database Credentials

Edit `config/db_connect.php` and update with your online hosting database credentials:

```php
<?php
// Database configuration
// Update these values for your online hosting environment
$host = "localhost";  // Usually 'localhost' on most hosts, or your host's DB server
$user = "your_db_username";  // Your database username from hosting panel
$pass = "your_db_password";  // Your database password from hosting panel
$dbname = "your_database_name";  // Your database name from hosting panel

// ... rest of the file
?>
```

**Common hosting database configurations:**
- **cPanel**: Usually `localhost`, username and database name are often the same
- **Shared Hosting**: Check your hosting control panel for database details
- **Cloud Hosting**: May use a different host (e.g., `db.example.com`)

### Step 2: Enable Production Mode

Edit both `api/students.php` and `api/violations.php` and change:

```php
$isProduction = false; // Set to true when deploying to online host
```

To:

```php
$isProduction = true; // Set to true when deploying to online host
```

This will:
- Hide PHP errors from users (security best practice)
- Still log errors to server logs for debugging

### Step 3: Upload Database

1. Export your local database (using phpMyAdmin or command line)
2. Import it to your online hosting database (using phpMyAdmin or hosting control panel)
3. Make sure all tables are created:
   - `students`
   - `violations`
   - `departments`
   - `sections`
   - `users` (if applicable)

### Step 4: Verify File Permissions

Ensure the following directories are writable (usually 755 or 775):
- `assets/img/students/` - For student image uploads

### Step 5: Test the Application

1. Test the Students page - should load student data
2. Test the Violations page - should load violation data
3. Check browser console (F12) for any JavaScript errors
4. Check API responses by visiting:
   - `yourdomain.com/api/students.php?action=get`
   - `yourdomain.com/api/violations.php`

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
1. Verify database credentials in `config/db_connect.php`
2. Check if database exists on hosting
3. Verify database user has proper permissions
4. Some hosts require `127.0.0.1` instead of `localhost` - try both

### Issue: "Students/Violations not loading"

**Possible causes:**
1. Database connection issue (see above)
2. Tables don't exist - import your database
3. API path issues - check browser console for 404 errors
4. CORS issues - check if hosting allows API access

### Issue: "404 Not Found" for API endpoints

**Solution:**
1. Verify API files are uploaded to `api/` directory
2. Check file permissions (should be 644)
3. Verify `.htaccess` rules if using Apache
4. Check if hosting requires specific file extensions or paths

### Issue: Images not loading

**Solution:**
1. Verify `assets/img/students/` directory exists and is writable
2. Check file paths in database - should be relative paths like `assets/img/students/filename.jpg`
3. Verify image files are uploaded to hosting

## Testing Checklist

- [ ] Database credentials updated in `config/db_connect.php`
- [ ] Production mode enabled in API files
- [ ] Database imported to hosting
- [ ] File permissions set correctly
- [ ] Students page loads data
- [ ] Violations page loads data
- [ ] Can add new students
- [ ] Can add new violations
- [ ] Images upload correctly
- [ ] No console errors in browser

## Additional Notes

- The API files now use centralized configuration, making it easier to update credentials
- Error logging is enabled even in production mode for debugging
- All database connections use UTF-8 encoding for proper character support
- The application should work on most PHP 7.4+ hosting environments

