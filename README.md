# Industrial-project
This project is for Learning Hub
📁 Project Structure
Bash
National-Digital-Identity-System/
│
├── index.html              # Landing / Home Page
├── login.html              # Login Page
├── signup.html             # Signup / Registration Page
├── dashboard.html          # User Dashboard
├── verify.html             # Identity Verification Page
├── services.html           # Services Page
│
├── assets/
│   ├── images/             # All images (hero, icons, backgrounds)
│   ├── icons/              # SVG / icon files
│   └── fonts/              # Custom fonts (if any)
│
├── css/
│   ├── style.css           # Main global styles
│   ├── theme.css           # Dark/light theme styles
│   ├── responsive.css      # Media queries
│
├── js/
│   ├── main.js             # Global scripts
│   ├── auth.js             # Login & signup logic
│   ├── verify.js           # Verification logic
│   ├── ui.js               # UI interactions (modals, sidebar, etc.)
│
└── README.md               # Project documentation
📄 HTML File Structure (Standard Template)
Use this base structure for all pages:
HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Name - National Digital Identity System</title>

    <!-- CSS -->
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/theme.css">
    <link rel="stylesheet" href="css/responsive.css">
</head>

<body>

    <!-- 🔹 Navbar -->
    <header>
        <!-- Navigation bar -->
    </header>

    <!-- 🔹 Main Content -->
    <main>
        <!-- Page-specific content -->
    </main>

    <!-- 🔹 Footer (Exclude in login/signup pages) -->
    <footer>
        <!-- Global footer -->
    </footer>

    <!-- 🔹 Scripts -->
    <script src="js/main.js"></script>
    <script src="js/ui.js"></script>
</body>
</html>
📄 Special Page Notes
🔐 Login & Signup Pages
HTML
<!-- No footer -->
<!-- Minimal layout -->
🧾 Verification Page
HTML
<!-- Include verify.js -->
<script src="js/verify.js"></script>
👤 Dashboard Page
HTML
<!-- User-specific UI -->
<!-- Profile + activity -->
⚙️ Key Conventions
All images → /assets/images
All styles centralized in /css
All logic separated in /js
Reusable components (navbar/footer) shared across pages
