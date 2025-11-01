# LiquidBooks Deployment Guide

Complete guide for deploying LiquidBooks to production using Netlify (frontend) and Render (backend).

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
4. [Custom Domain Setup](#custom-domain-setup)
5. [Environment Variables](#environment-variables)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with LiquidBooks repository
- Render account (https://render.com)
- Netlify account (https://netlify.com)
- API keys for AI providers (OpenAI, Anthropic, or OpenRouter)
- Custom domain (optional)

---

## Backend Deployment (Render)

### Step 1: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (fenago/LiquidBooks)
4. Configure the service:
   - **Name**: `liquidbooks-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for better performance)

### Step 2: Configure Environment Variables

In the Render dashboard, add these environment variables:

| Variable | Value | Required |
|----------|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Optional* |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Optional* |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Optional* |
| `FRONTEND_URL` | See below | **Yes** |

**At least one AI provider API key is required.*

#### FRONTEND_URL Configuration

Set `FRONTEND_URL` to include all your frontend URLs (comma-separated):

```
FRONTEND_URL=https://liquidbooks.netlify.app,http://liquidbooks.co,https://liquidbooks.co
```

**Important:** Include both HTTP and HTTPS versions of your custom domain if applicable.

### Step 3: Deploy

1. Click **"Create Web Service"**
2. Wait for the initial deployment (5-10 minutes)
3. Note your backend URL: `https://liquidbooks-backend.onrender.com`

### Step 4: Verify Backend

Visit your backend URL in a browser. You should see:
```json
{"status":"LiquidBooks API is running"}
```

---

## Frontend Deployment (Netlify)

### Step 1: Create Netlify Site

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
   - **Branch**: `main`

### Step 2: Configure Environment Variables

In Netlify dashboard, go to **Site settings → Environment variables** and add:

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Your Render backend URL | `https://liquidbooks-backend.onrender.com` |

**Important:** Do NOT include a trailing slash in the URL.

### Step 3: Deploy

1. Click **"Deploy site"**
2. Wait for build to complete (2-5 minutes)
3. Note your Netlify URL: `https://liquidbooks.netlify.app`

### Step 4: Trigger Redeploy (if needed)

If you set up environment variables after the first deploy:

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## Custom Domain Setup

### For Netlify (Frontend)

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `liquidbooks.co`)
4. Follow DNS configuration instructions:
   - **Option A (Netlify DNS)**: Point nameservers to Netlify
   - **Option B (External DNS)**: Add CNAME record pointing to your Netlify subdomain

5. Enable HTTPS:
   - Netlify automatically provisions SSL certificate via Let's Encrypt
   - Wait 24-48 hours for DNS propagation

### For Render (Backend - Optional)

If you want a custom domain for your backend:

1. In Render dashboard, go to your service settings
2. Click **"Custom Domain"**
3. Enter your backend domain (e.g., `api.liquidbooks.app`)
4. Add the provided CNAME record to your DNS settings

### Update Environment Variables After Custom Domain

#### Update Netlify

No changes needed - `VITE_API_URL` should still point to your Render backend URL.

#### Update Render

Add your custom domain(s) to `FRONTEND_URL`:

```
FRONTEND_URL=https://liquidbooks.netlify.app,http://liquidbooks.co,https://liquidbooks.co
```

---

## Environment Variables Reference

### Backend (Render)

```bash
# Required
FRONTEND_URL=https://liquidbooks.netlify.app,http://liquidbooks.co,https://liquidbooks.co

# AI Provider Keys (at least one required)
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
OPENROUTER_API_KEY=sk-or-your-openrouter-key-here
```

### Frontend (Netlify)

```bash
# Required
VITE_API_URL=https://liquidbooks-backend.onrender.com
```

---

## Deployment Workflow

### Making Code Changes

1. **Make changes locally**
   ```bash
   cd /path/to/LiquidBooks
   # Make your code changes
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Automatic deployment**
   - Render watches the `backend/` directory
   - Netlify watches the `frontend/` directory
   - Both will auto-deploy when you push to `main` branch

3. **Monitor deployments**
   - Render: Check deployment logs in dashboard
   - Netlify: Check deploy status in dashboard

### Forcing a Redeploy

**Render:**
1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Netlify:**
1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## Troubleshooting

### CORS Errors

**Error:** `Access to fetch has been blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL` in Render includes your frontend domain
2. Include both HTTP and HTTPS versions if using custom domain
3. Ensure no trailing slashes in URLs
4. Redeploy Render backend after changing environment variables

### Backend Not Connecting

**Error:** Frontend shows connection errors or `Failed to fetch`

**Solution:**
1. Check `VITE_API_URL` in Netlify environment variables
2. Verify Render backend is running (visit backend URL directly)
3. Check Render logs for errors
4. Ensure at least one AI provider API key is set

### Build Failures

**Netlify build fails:**
1. Check build logs in Netlify dashboard
2. Verify `frontend/package.json` dependencies
3. Try "Clear cache and deploy site"
4. Check Node version compatibility (should use Node 18+)

**Render build fails:**
1. Check deployment logs in Render dashboard
2. Verify `backend/requirements.txt` is correct
3. Check Python version (should use Python 3.11+)
4. Verify all imports in `main.py` are available

### Environment Variables Not Working

**Solution:**
1. Verify variable names are exact (case-sensitive)
2. No spaces around `=` sign
3. No quotes around values in Netlify/Render UI
4. Redeploy after adding/changing variables
5. For Netlify: Clear cache and redeploy
6. For Render: May need to restart service

### Custom Domain Issues

**HTTPS not working:**
- Wait 24-48 hours for SSL provisioning
- Check DNS records are correct
- Verify domain ownership in Netlify

**Domain not resolving:**
- Verify DNS propagation: https://dnschecker.org
- Check CNAME/A records are correct
- Wait up to 48 hours for DNS propagation

---

## Performance Optimization

### Render Free Tier

**Note:** Render free tier services spin down after 15 minutes of inactivity.

**Impact:**
- First request after inactivity may take 30-60 seconds
- Subsequent requests are fast

**Solutions:**
1. Upgrade to paid tier ($7/month) for always-on service
2. Use a service like UptimeRobot to ping your backend every 14 minutes
3. Accept the cold start delay for free tier

### Netlify Optimization

1. **Enable branch deploys** for testing before production
2. **Use Netlify Functions** for serverless functions if needed
3. **Enable Asset Optimization** in Netlify settings:
   - Pretty URLs
   - Bundle CSS
   - Minify CSS, JS, and HTML

---

## Security Best Practices

1. **Always use HTTPS** for production
2. **Never commit API keys** to git
3. **Use environment variables** for all secrets
4. **Regularly rotate API keys**
5. **Monitor API usage** to detect abuse
6. **Set up rate limiting** if using paid AI APIs
7. **Review CORS settings** regularly

---

## Monitoring and Logs

### Render Logs

1. Go to your service dashboard
2. Click **"Logs"** tab
3. Filter by log level (Info, Error, etc.)
4. Download logs for debugging

### Netlify Logs

1. Go to **Deploys** tab
2. Click on a deploy
3. View **"Deploy log"** for build details
4. Check **"Function log"** if using Netlify Functions

---

## Costs

### Free Tier Limits

**Render Free Tier:**
- 750 hours/month (enough for one service)
- Spins down after 15 min inactivity
- 512 MB RAM
- Shared CPU

**Netlify Free Tier:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Automatic HTTPS

### Paid Upgrades

**Render Starter ($7/month):**
- Always on (no spin down)
- 512 MB RAM
- Better for production use

**Netlify Pro ($19/month):**
- 400 GB bandwidth
- Advanced analytics
- Role-based access control

---

## Quick Reference

### Backend URL Format
```
https://[your-service-name].onrender.com
```

### Frontend URL Format
```
https://[your-site-name].netlify.app
```

### Important Files
- Backend: `/backend/main.py` (CORS configuration)
- Frontend: `/frontend/src/stores/settingsStore.ts` (API URL)
- Frontend: `/frontend/.env` (local development only, not committed)

---

## Support and Resources

- **Render Documentation**: https://render.com/docs
- **Netlify Documentation**: https://docs.netlify.com
- **LiquidBooks Issues**: https://github.com/fenago/LiquidBooks/issues
- **FastAPI CORS**: https://fastapi.tiangolo.com/tutorial/cors/

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2025-01-XX | Initial deployment guide | Claude Code |
| 2025-01-XX | Added custom domain support | Claude Code |
| 2025-01-XX | Updated CORS configuration for multiple domains | Claude Code |

---

## Summary Checklist

### Initial Deployment

- [ ] Create Render web service
- [ ] Add AI provider API keys to Render
- [ ] Add FRONTEND_URL to Render
- [ ] Wait for Render backend to deploy
- [ ] Note backend URL
- [ ] Create Netlify site
- [ ] Add VITE_API_URL to Netlify
- [ ] Wait for Netlify frontend to deploy
- [ ] Test the application
- [ ] Update FRONTEND_URL in Render with Netlify URL
- [ ] Redeploy Render if needed

### Custom Domain Setup (Optional)

- [ ] Add custom domain in Netlify
- [ ] Configure DNS records
- [ ] Wait for SSL certificate provisioning
- [ ] Update FRONTEND_URL in Render with custom domain
- [ ] Test with custom domain
- [ ] Enable HTTPS redirect in Netlify

### Ongoing Maintenance

- [ ] Monitor Render logs for errors
- [ ] Monitor Netlify deploy status
- [ ] Check API key usage
- [ ] Update dependencies monthly
- [ ] Review and rotate API keys quarterly
- [ ] Monitor CORS issues
- [ ] Check for security updates

---

**Last Updated:** January 2025
**Version:** 1.0
