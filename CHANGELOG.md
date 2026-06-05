# Changelog

## [1.0.0] – 2024-06-09

### Initial Release

- **Candidate Onboarding Portal**
  - Landing page with company branding and feature highlights
  - "Apply Now" flow with interest form (Full Name, Email, Mobile, Department)
  - Form validation (name, email, mobile, department)
  - Duplicate email prevention
  - Success/error messages on submission

- **Admin Dashboard**
  - Secure admin login (`hirehubadmin` password, sessionStorage-based)
  - Dashboard with stats: total submissions, unique departments, latest submission
  - Table view of all submissions (name, email, mobile, department, status)
  - Approve/Reject/Update status for each submission
  - Edit modal for updating candidate details (except email)
  - Delete submission with confirmation modal
  - Responsive design for desktop/mobile

- **Data Storage**
  - All submissions stored in browser localStorage
  - Admin session stored in sessionStorage (cleared on logout/tab close)
  - Handles corrupted localStorage gracefully

- **Routing & Navigation**
  - React Router v6: `/`, `/apply`, `/admin`
  - Header with navigation links and active state
  - 404/unknown routes redirect to home

- **Testing**
  - Unit tests for storage and validation utilities
  - Integration tests for main flows (apply, admin login, navigation)

- **Setup**
  - Vite + React 18
  - No backend or environment variables required
  - All data is browser-local

---

**Note:**  
This is a private project for HireHub. All rights reserved. Do not distribute or use without permission.