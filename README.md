# Bibek Bhandari · Spinal Cord Injury (SCI) Recovery & Neuro-Rehabilitation Fund

A production-grade, mobile-optimized fundraising and medical transparency portal for **Bibek Bhandari** (Chandrapur, Rautahat, Nepal) covering his 3.5-year intensive neuro-rehabilitation protocol at **Neurigo360** under lead neuro-physiotherapist **Dr. Pratap**.

---

## 🌟 Why Deploy to GitHub / Vercel / Netlify?

Deploying to **Vercel**, **Netlify**, or **GitHub Pages** gives you:
1. **Permanent Custom Link**: A fast, clean URL like `https://bibek-bhandari-sci.vercel.app` (or your own custom domain like `https://bibekrecovery.com`).
2. **Zero Cookie Checks**: Bypasses the Google Cloud Run security cookie prompt (`Action required`) so the link opens **instantly and smoothly on iPhone, Android, Facebook Messenger, WhatsApp, Instagram, and Viber**.
3. **Permanent Photos & QR Codes**: All photos, therapist clinical notes, MRI diagnostic scans, eSewa numbers, and SBI Bank credentials are baked directly into the repository files. They **never reset, never expire, and never change**.

---

## 📁 Source Code Structure & Where Your Data Lives

| File / Folder Path | What It Contains | How to Customize |
| :--- | :--- | :--- |
| **`src/data/defaultCampaign.ts`** | **Master Campaign Data**: Bank account, eSewa ID, story, goals, doctor name, clinic name. | Edit this file to change your goal amount, bank details, or story. |
| **`public/images/`** | **All Permanent Images**: Profile picture, cover banner, doctor avatar, exercise therapy photos. | Drop your real photos here to replace the defaults permanently. |
| **`public/og_photo.jpg`** | **Social Share Avatar**: The picture displayed when you share your link on Messenger/WhatsApp. | Replace with your square portrait photo (e.g. 600x600 px). |
| **`public/og_cover.jpg`** | **Social Share Cover**: The big banner card shown in Messenger/WhatsApp link previews. | Replace with your horizontal photo (1200x630 px). |
| **`src/components/RealScannableQr.tsx`** | **Live Scannable QR Component**: Mathematically generates the verified scannable QR code for eSewa & SBI Bank. | Automatically generates the QR using credentials from `defaultCampaign.ts`. |
| **`src/components/CampaignProgressGauge.tsx`** | **D3-based Fundraising Gauge**: Visualizes total donations against the 75 Lakh goal. | Renders live dynamic arc gauge with milestone ticks. |
| **`src/components/PublicCampaignView.tsx`** | **Public Campaign Page**: The main public view seen by all supporters and donors. | The clean, responsive mobile & desktop donation page. |
| **`src/components/CreatorDashboard.tsx`** | **Creator Studio & Ledger**: Where you manage donors, record offline cash, and verify payments. | Private creator control center. |

---

## 🚀 How to Publish to GitHub in 3 Easy Steps

### Step 1: Initialize Git and Commit Your Code
Run these commands in your project terminal:
```bash
# 1. Initialize git repository
git init

# 2. Add all files to git
git add .

# 3. Create your first commit
git commit -m "Bibek Bhandari SCI Recovery Fund Portal"
```

### Step 2: Create a Repository on GitHub
1. Go to [github.com](https://github.com) and sign in.
2. Click the **+** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `bibek-bhandari-sci-fund`).
4. Keep it **Public** so friends and platforms can access it.
5. Click **Create repository**.
6. Copy the commands shown under *"push an existing repository from the command line"*:
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/bibek-bhandari-sci-fund.git
git branch -M main
git push -u origin main
```

---

## ⚡ How to Deploy Online for FREE (No Vercel Needed - Using Only GitHub!)

### Option A: GitHub Pages (Recommended - 100% Free, Uses ONLY Your GitHub Account)
Because `.github/workflows/deploy.yml` is already included in this repository, GitHub builds and hosts your website for free with zero external accounts:

1. **Push or upload this code to your GitHub repository** (e.g. `bibek-bhandari-sci-fund`).
2. On your repository page on GitHub, click **Settings** (gear icon near top right).
3. In the left menu, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Source**, click the dropdown and select **GitHub Actions**.
5. That's it! GitHub will automatically trigger the deployment workflow.
6. In 1 to 2 minutes, your live permanent URL will appear right at the top of that page:
   `https://YOUR_GITHUB_USERNAME.github.io/bibek-bhandari-sci-fund/`

---

### Option B: Deploy with Vercel (If you ever want an extra link)

---

## 🔒 Permanent Credentials Verified in Code

- **eSewa / Khalti Mobile ID:** `9861452923`
- **Account Names:** `BIBEK BHANDARI / SASHITA RAJ BHANDARI`
- **Bank:** `Nepal SBI Bank Limited`
- **Account Number:** `20015243402269`
- **Account Holder:** `SASHITA RAJ BHANDARI`
- **Branch:** `Hetauda Branch, Nepal`
- **SWIFT:** `NSBINPKX`
- **Rehabilitation Center:** `Neurigo360, Nepal`
- **Lead Neuro-Physiotherapist:** `Dr. Pratap`
- **Surgical Hospital:** `Vaishnavi Neuro Hospital, Allahabad (Dr. Prakash Khetan)`
- **Diagnosis:** `D1-D5 Laminectomy, Incomplete SCI with severe cord compression`
