# HireHub Onboarding Portal

A modern onboarding portal for HireHub, built with React 18 and Vite. Candidates can apply for onboarding, and admins can manage submissions through a secure dashboard.

---

## Overview

**HireHub Onboarding Portal** streamlines the process of collecting and managing onboarding applications. Candidates fill out a simple form, and admins can view, edit, approve, reject, or delete submissions—all stored securely in the browser.

---

## Tech Stack

- **React 18** (with JSX)
- **Vite** (for fast dev/build)
- **react-router-dom** (routing)
- **PropTypes** (runtime prop validation)
- **LocalStorage** (for submissions)
- **SessionStorage** (for admin auth)
- **CSS** (custom, responsive)

---

## Folder Structure

```
.
├── public/
│   └── favicon.ico
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── LandingPage.jsx
│   │   ├── InterestForm.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── EditModal.jsx
│   │   ├── SubmissionTable.jsx
│   │   └── ProtectedRoute.jsx
│   └── utils/
│       ├── storage.js
│       ├── storage.test.js
│       ├── validators.js
│       └── validators.test.js
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
└── README.md
```

---

## Setup & Installation

1. **Clone the repository**

   ```
   git clone <repo-url>
   cd hirehub-onboarding-portal
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Start the development server**

   ```
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (or as shown in your terminal).

4. **Run tests**

   ```
   npm test
   ```

---

## Usage

- **Candidate Application**
  - Go to `/apply` or click "Apply Now" on the home page.
  - Fill in your details and submit.
  - Duplicate emails are prevented.

- **Admin Dashboard**
  - Go to `/admin` or click "Admin" in the header.
  - Login with password: `hirehubadmin`
  - View, edit, approve/reject, or delete submissions.
  - Admin session is stored in sessionStorage and cleared on logout or tab close.

- **Navigation**
  - Use the header links to switch between Home, Apply, and Admin.
  - Responsive design for desktop and mobile.

---

## Environment

No environment variables are required for local development. All data is stored in the browser (localStorage/sessionStorage).

---

## License

**Private Project**  
All rights reserved.  
Do not distribute, copy, or use without explicit permission from HireHub.