# 🌐 OSAS WEB SYSTEM

A modern, full-stack web-based system designed for the **Office of Student Affairs and Services (OSAS)** to manage departments, sections, students, violations, and reports — all in one centralized platform.

---

## 📁 Project Structure

```text
OSAS_WEBSYS/
├── api/                      # API endpoints
│   ├── departments.php       # Department CRUD operations
│   ├── sections.php          # Section CRUD operations
│   ├── students.php          # Student CRUD operations
│   └── upload_student_image.php  # Student image upload handler
├── assets/                   # Static assets
│   ├── img/                  # Images and icons
│   │   └── students/         # Uploaded student images
│   ├── js/                   # JavaScript files
│   │   ├── modules/          # Modular JavaScript components
│   │   └── utils/            # Utility functions
│   └── styles/               # CSS stylesheets
├── auth/                     # Authentication handlers
│   ├── check_session.php     # Session validation
│   ├── login.php             # Login handler
│   ├── logout.php            # Logout handler
│   └── register.php          # Registration handler
├── config/                   # Configuration files
│   └── db_connect.php        # Database connection
├── database/                 # Database setup scripts
│   ├── departments_table.sql
│   ├── sections_table.sql
│   ├── students_table.sql
│   ├── setup_complete.sql    # Complete database setup
│   └── SETUP_INSTRUCTIONS.md # Database setup guide
├── includes/                 # Reusable PHP components
│   ├── dashboard.php         # Admin dashboard layout
│   ├── signup.php            # Signup page
│   └── user_dashboard.php    # User dashboard layout
├── pages/                    # Main application pages
│   ├── admin_page/           # Admin interface pages
│   │   ├── dashcontent.php  # Admin dashboard content
│   │   ├── Department.php   # Department management
│   │   ├── Sections.php     # Section management
│   │   ├── Students.php     # Student management
│   │   ├── Violations.php   # Violation tracking
│   │   ├── Reports.php      # Reports and analytics
│   │   └── settings.php     # Admin settings
│   └── user-page/            # User interface pages
│       ├── user_dashcontent.php  # User dashboard
│       ├── my_violations.php     # User's violation history
│       ├── my_profile.php        # User profile
│       └── announcements.php     # Announcements
├── index.php                 # Main entry point (Login page)
├── manifest.json             # PWA manifest
└── service-worker.js         # PWA service worker
```

---

## ✨ Features

### 🔐 Authentication & Authorization
* **User Authentication:** Secure login and registration system
* **Session Management:** PHP-based session handling
* **Role-Based Access:** Separate admin and user dashboards
* **Password Security:** Secure password handling

### 📊 Admin Dashboard
* **Dashboard Overview:** System statistics and quick navigation
* **Department Management:** Create, update, and manage departments
* **Section Management:** Organize sections under departments
* **Student Records:** Complete student information management with image uploads
* **Violation Tracking:** Record and track student violations (dress code, ID, footwear, etc.)
* **Reports & Analytics:** Generate summaries and reports for analysis
* **Settings:** System configuration and preferences

### 👤 User Dashboard
* **Personal Dashboard:** User-specific overview
* **My Violations:** View personal violation history
* **My Profile:** Manage personal information
* **Announcements:** View system announcements

### 📱 Progressive Web App (PWA)
* **Installable:** Can be installed as a mobile/desktop app
* **Offline Support:** Service worker for offline functionality
* **Responsive Design:** Works on all device sizes

---

## ⚙️ Technologies Used

* **Frontend:**
  * HTML5 & CSS3
  * JavaScript (ES6+)
  * Chart.js (for analytics and reports)
  * Font Awesome (icons)
  * Boxicons (icons)

* **Backend:**
  * PHP 7.4+
  * MySQL/MariaDB

* **Additional:**
  * Progressive Web App (PWA) support
  * RESTful API architecture

---

## 🚀 Getting Started

### Prerequisites

* **Web Server:** WAMP/XAMPP/LAMP or any PHP-enabled server
* **PHP:** Version 7.4 or higher
* **MySQL:** Version 5.7 or higher (or MariaDB 10.2+)
* **Web Browser:** Modern browser with JavaScript enabled

### Installation Steps

1. **Clone or download the repository**

```bash
git clone https://github.com/yourusername/osas-web-system.git
cd osas-web-system
```

2. **Set up the database**

   * Create a new MySQL database named `osas_sys_db` (or update `config/db_connect.php` with your preferred name)
   * Import the database schema using one of these methods:

   **Option A: Complete Setup (Recommended)**
   ```sql
   -- Import: database/setup_complete.sql
   ```
   This creates all tables (departments, sections, students) with sample data.

   **Option B: Step-by-Step Setup**
   ```sql
   -- Import in order:
   1. database/departments_table.sql
   2. database/sections_table.sql
   3. database/students_table.sql
   ```

   **Using phpMyAdmin:**
   1. Open phpMyAdmin
   2. Select your database
   3. Click "Import" tab
   4. Choose the SQL file
   5. Click "Go"

   **Using MySQL Command Line:**
   ```bash
   mysql -u root -p osas_sys_db < database/setup_complete.sql
   ```

3. **Configure database connection**

   Edit `config/db_connect.php` and update with your database credentials:
   ```php
   $host = "localhost";
   $user = "root";          // Your MySQL username
   $pass = "";              // Your MySQL password
   $dbname = "osas_sys_db"; // Your database name
   ```

4. **Set up file permissions**

   Ensure the `assets/img/students/` directory is writable for image uploads:
   ```bash
   chmod 755 assets/img/students/
   ```

5. **Start your web server**

   * **WAMP:** Start WAMP server and navigate to `http://localhost/OSAS_WEBSYS/`
   * **XAMPP:** Start Apache and MySQL, navigate to `http://localhost/OSAS_WEBSYS/`
   * **LAMP:** Configure your virtual host or use `http://localhost/OSAS_WEBSYS/`

6. **Access the application**

   Open your browser and navigate to:
   ```
   http://localhost/OSAS_WEBSYS/
   ```

   You should see the login page. Register a new account or use existing credentials to log in.

---

## 📝 Database Setup

For detailed database setup instructions, see: [`database/SETUP_INSTRUCTIONS.md`](database/SETUP_INSTRUCTIONS.md)

### Database Tables

* **departments:** Stores department information
* **sections:** Stores section information (linked to departments)
* **students:** Stores student records (linked to sections)
* **users:** User accounts for authentication (if implemented)
* **violations:** Violation records (if implemented)

---

## 🔧 Configuration

### Database Configuration
Edit `config/db_connect.php` to match your database settings.

### PWA Configuration
Edit `manifest.json` to customize the Progressive Web App settings.

---

## 📌 Features Status

✅ **Implemented:**
* Full authentication system
* Admin and user dashboards
* Department management
* Section management
* Student management with image uploads
* Violation tracking
* Reports and analytics
* PWA support
* Responsive design

🔄 **Future Enhancements:**
* Advanced analytics and charts
* Print-friendly and exportable reports (PDF, Excel)
* Email notifications
* Advanced search and filtering
* Bulk operations
* Data export/import

---

## 🛡️ License

This project is created for **Colegio De Naujan**.
Customization is required to adapt it for other schools or organizations.

---

## 👨‍💻 Maintained By

Developed by: **Mr-Patrick-James / OSAS Teams**

**Contributors:**
* Romasanta Patrick James Vital (s) Cdenians

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository or contact the development team.

---

## 🙏 Acknowledgments

* Colegio De Naujan - OSAS Department
* All contributors and testers

---

**Version:** 1.0.0  
**Last Updated:** 2024
