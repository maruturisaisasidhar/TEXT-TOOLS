# 🚀 Deployment Guide for Texttools

## Prerequisites

- GitHub account
- Accounts on deployment platforms (free tier works!)

---

## 📦 Step 1: Push to GitHub

1. Initialize git (if not already done):

```bash
cd C:\Users\marut\Desktop\Texttools
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub (https://github.com/new)

3. Push your code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/texttools.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend (Render - FREE)

### Option A: Render (Recommended - Easy)

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `texttools-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Add Environment Variable:
   - Key: `OPENROUTER_API_KEY`
   - Value: `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`

6. Click "Create Web Service"

7. Wait for deployment (5-10 mins)

8. **Copy your backend URL** (e.g., `https://texttools-backend.onrender.com`)

### Option B: Railway

1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repo
4. Add service → Select `backend` folder
5. Add environment variable `OPENROUTER_API_KEY`
6. Deploy!

---

## 🌐 Step 3: Deploy Frontend (Vercel - FREE)

1. Go to https://vercel.com and sign up/login

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `YOUR_BACKEND_URL` (from Step 2, without trailing slash)
   - Example: `https://texttools-backend.onrender.com`

6. Click "Deploy"

7. Wait for deployment (2-3 mins)

8. **Your app is live!** 🎉

---

## ✅ Step 4: Test Your Deployed App

1. Visit your Vercel URL (e.g., `https://texttools.vercel.app`)
2. Try the text operations (Rephrase, Summarize, etc.)
3. Check that everything works!

---

## 🔄 Future Updates

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Both Vercel and Render will automatically redeploy! ✨

---

## 🐛 Troubleshooting

### Backend Issues

- Check Render logs for errors
- Verify `OPENROUTER_API_KEY` is set correctly
- Ensure `npm start` works locally

### Frontend Issues

- Check Vercel logs
- Verify `VITE_API_URL` points to backend (no trailing slash!)
- Test backend URL directly in browser: `YOUR_BACKEND_URL/api/gemini`

### CORS Errors

- Backend already has `cors()` enabled
- If issues persist, check Render/Railway logs

---

## 📝 Notes

- **Free Tier Limits**:
  - Render: Backend sleeps after 15 mins of inactivity (wakes on request)
  - Vercel: Unlimited bandwidth for personal projects
  - OpenRouter: Check your API usage/limits

- **Custom Domain**: Both platforms support custom domains in free tier!

---

## 🎯 Quick Links After Deployment

- **Frontend**: Your Vercel URL
- **Backend**: Your Render URL
- **GitHub**: Your repository
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Need help?** Check the logs on Render/Vercel dashboards!
