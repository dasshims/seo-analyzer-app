# Website Analyzer UI

## Project Overview

This Vite + React + TypeScript application provides an interactive dashboard that consumes the existing FastAPI backend for the Website Analyzer MVP. The UI lets you submit URLs for analysis, review SEO metrics, visualize performance, inspect AI-generated feedback, run traceroute diagnostics, and revisit recently analyzed sites.

## Prerequisites

- Node.js (LTS recommended)
- npm (bundled with Node.js)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure the backend URL (optional). Create a `.env` file in the project root to override the default:

   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   VITE_BASE_PATH=/
   ```

   `VITE_BASE_PATH` is optional; leave it as `/` for local dev or set to a repo path (e.g. `/website-analyzer-ui`) when hosting on GitHub Pages. If the environment variables are omitted, the app defaults to `http://localhost:8000` and `/`.

## Running the App

Ensure the backend is running before starting the frontend:

```bash
# Backend (from backend project)
uvicorn app.main:app --reload

# Frontend (this project)
npm run dev
```

The frontend dev server runs at `http://localhost:5173`.

## Build for Production

```bash
npm run build
npm run preview
```

`npm run preview` serves the production build locally for verification.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds the Vite app and publishes the `dist` folder to GitHub Pages.

1. Commit and push all changes to the `main` branch.
2. In your GitHub repository:
   - Go to **Settings → Pages** and choose **GitHub Actions** as the source.
   - Under **Settings → Secrets and variables → Actions**, add the following:
     - Secret `VITE_API_BASE_URL` pointing at your backend (e.g. `https://your-backend.example.com`).
     - Optional variable `VITE_BASE_PATH` if the site is hosted at a sub-path (e.g. `/website-analyzer-ui`). Leave unset for user/organization pages.
3. The workflow runs on every push to `main` (or via manual dispatch) and publishes the latest build.
4. After the workflow succeeds, visit the URL reported in the deployment summary (typically `https://<username>.github.io/<repo>/`).

> If you deploy to a project page (`https://<username>.github.io/<repo>/`), set `VITE_BASE_PATH` to `/repo-name` so Vite builds assets with the correct base path. For user/org pages (`https://<username>.github.io/`), leave it empty.

## Notes

- The UI only communicates with the FastAPI backend and never calls OpenAI directly.
- CORS must allow requests from `http://localhost:5173`; the provided backend already includes that configuration.
- Traceroute relies on the backend exposing system `traceroute` / `tracert`; ensure the command is available where the API runs.
