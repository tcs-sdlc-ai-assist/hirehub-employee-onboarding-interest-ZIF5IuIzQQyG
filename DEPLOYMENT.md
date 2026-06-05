# HireHub Onboarding Portal – Deployment Guide

This document describes how to deploy the HireHub Onboarding Portal (React + Vite SPA) to [Vercel](https://vercel.com/) or any static hosting provider.

---

## 1. Environment & Build

- **No backend required**: All data is stored in the browser (localStorage/sessionStorage).
- **No environment variables**: The app does not require any `.env` or runtime secrets.
- **SPA Routing**: Uses React Router v6. All unknown routes must serve `index.html`.

---

## 2. Build Steps

1. **Install dependencies**

   ```
   npm install
   ```

2. **Build for production**

   ```
   npm run build
   ```

   This generates a static site in the `dist/` directory.

---

## 3. Vercel Deployment

### A. Quick Deploy

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Go to [vercel.com/import](https://vercel.com/import) and import your repo.
3. Vercel auto-detects Vite and uses the following settings:

   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Click **Deploy**.

### B. SPA Routing on Vercel

To ensure client-side routing works (all routes serve `index.html`), the project includes a `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This is already present in the root of the repo.

---

## 4. Custom Domains

- Add your custom domain in the Vercel dashboard.
- Set up DNS as instructed by Vercel.

---

## 5. CI/CD Notes

- Every push to your main branch triggers a new deployment.
- Preview deployments are created for pull requests.
- No secrets or environment variables are needed.

---

## 6. Other Static Hosts

You can also deploy to Netlify, GitHub Pages, or any static host that supports SPA rewrites:

- **Netlify:** Add a `_redirects` file with `/* /index.html 200`
- **GitHub Pages:** Use a custom 404.html that redirects to `/index.html`

---

## 7. Troubleshooting

- **Blank page on refresh or deep link:** Ensure SPA rewrites are configured (see above).
- **localStorage/sessionStorage not working:** The app must be served over HTTPS for storage to work reliably in all browsers.

---

## 8. Production Checklist

- [x] No backend/API dependencies
- [x] No secrets or env vars
- [x] SPA rewrites configured (`vercel.json`)
- [x] Responsive/mobile tested
- [x] All data is browser-local

---

**Questions?**  
Contact the HireHub engineering team.