# AI Web Weaver

AI Web Weaver is a powerful application that uses the Gemini API to generate complete, production-ready web applications from a single text prompt. It then creates a new GitHub repository and pushes the generated code, ready for you to clone and deploy.

## ⚠️ Important Security Notice

This application is designed as a powerful developer utility and demonstration. It operates entirely on the client-side (in your browser).

-   **API Keys are Handled in the Browser:** Your Gemini API Key and GitHub Personal Access Token are sent directly from your browser to the respective APIs. They are **not** stored or logged by this application.
-   **Not for Public Production Use:** Because the keys are handled client-side, it's not recommended to deploy this application for public, untrusted users. It is intended for your personal use.

---

## 🚀 Deployment to Vercel

You can deploy this application for your own use for free on Vercel.

### Step 1: Push to GitHub

Push all the project files (`index.html`, `App.tsx`, etc.) to a new repository on your GitHub account.

### Step 2: Deploy on Vercel

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New... Project"**.
2.  **Import** the GitHub repository you just created.
3.  Vercel will inspect the project. It should not detect a specific framework, which is correct.
4.  You **do not need to configure anything**. The default settings for a static site are perfect.
    -   Framework Preset: `Other`
    -   Build Command: *Leave empty*
    -   Output Directory: *Leave empty*
    -   Install Command: *Leave empty*
5.  Click **"Deploy"**.

That's it! Vercel will build and deploy your site, giving you a live URL.

---

## 🔑 Required Keys & Tokens

To use the deployed application, you will need to provide two things in the UI:

1.  **Gemini API Key:**
    -   Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to create your API key.
2.  **GitHub Personal Access Token (Classic):**
    -   Go to your [GitHub Developer Settings](https://github.com/settings/tokens/new).
    -   Select **"Tokens (classic)"**.
    -   Give your token a name (e.g., "AI-Web-Weaver").
    -   Set an expiration date.
    -   Select the **`repo`** scope. This is required to create repositories.
    -   Click **"Generate token"** and copy the key.
