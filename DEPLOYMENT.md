# LiquidBooks Deployment Guide

## Manual Deployment to GitHub Pages

### Prerequisites
- GitHub account
- Git installed locally
- Node.js and Python installed

### Frontend Deployment (Netlify)

#### Option 1: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Follow prompts**:
   - Authorize with your Netlify account
   - Create new site or link existing
   - Set publish directory: `dist`
   - Note the URL provided

#### Option 2: Deploy via Netlify Web UI

1. **Build locally**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Build frontend"
   git push origin main
   ```

3. **In Netlify Dashboard**:
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Base directory: `frontend`
   - Add environment variable (optional):
     - `VITE_BACKEND_URL`: Your backend URL from Railway/Render

### Backend Deployment (Railway)

#### Step 1: Prepare Backend

1. **Create `requirements.txt`**:
   ```bash
   cd backend
   pip freeze > requirements.txt
   ```

2. **Create `railway.json`** (optional):
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

3. **Create `Procfile`** (for Railway):
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

#### Step 2: Deploy to Railway

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your repo
   - Select your LiquidBooks repository

3. **Configure Service**:
   - Root directory: `/backend`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GITHUB_TOKEN`: Your GitHub token (optional, for deployment)
   - `PORT`: 8000 (Railway will override this)

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

6. **Update Frontend**:
   - In frontend, update API calls to use your Railway URL
   - Or add `VITE_BACKEND_URL` environment variable in Netlify

#### Alternative: Deploy to Render

1. **Sign up at [render.com](https://render.com)**

2. **Create Web Service**:
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `liquidbooks-backend`
     - Root Directory: `backend`
     - Runtime: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**:
   - Add `OPENAI_API_KEY`
   - Add `GITHUB_TOKEN` (optional)

4. **Deploy**:
   - Click "Create Web Service"
   - Copy the generated URL

### Manual GitHub Pages Deployment (Static HTML)

If you want to deploy the built Jupyter Book HTML:

1. **Build a book locally** using the app

2. **Copy built files**:
   ```bash
   # The backend creates temp directories with builds
   # Copy from: /tmp/liquidbook_XXXXX/_build/html/*
   # To your GitHub Pages repo
   ```

3. **Push to GitHub Pages**:
   ```bash
   git add .
   git commit -m "Deploy book"
   git push origin gh-pages
   ```

### Environment Variables

#### Frontend (Netlify)
- `VITE_BACKEND_URL`: Backend API URL (default: `http://localhost:8000`)

#### Backend (Railway/Render)
- `OPENAI_API_KEY`: Required for AI generation
- `GITHUB_TOKEN`: Optional for GitHub Pages deployment
- `PORT`: Automatically set by platform

### CORS Configuration

If deploying frontend and backend to different domains, update CORS in `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://your-netlify-app.netlify.app",  # Add your Netlify URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Testing Deployment

1. **Test Frontend**:
   - Visit your Netlify URL
   - Go to Settings
   - Configure API keys
   - Try creating a book

2. **Test Backend**:
   - Visit `https://your-backend-url.railway.app/`
   - Should see: `{"status": "LiquidBooks API is running"}`

3. **Test End-to-End**:
   - Create book with AI
   - Generate chapters
   - Build book
   - Verify output

### Troubleshooting

#### Frontend won't connect to backend
- Check `backendUrl` in Settings page
- Verify CORS configuration
- Check browser console for errors

#### Backend build fails
- Ensure `requirements.txt` is up to date
- Check Python version (3.11+)
- Verify all dependencies are listed

#### Jupyter Book build fails
- Check backend logs
- Verify temp directory permissions
- Ensure Jupyter Book is installed

### Costs

- **Netlify**: Free tier supports this project
- **Railway**: ~$5/month (after free tier credits)
- **Render**: Free tier available (with limitations)

### Custom Domain (Optional)

#### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Follow DNS configuration instructions

#### Railway
1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS CNAME

## Continuous Deployment

Both Netlify and Railway support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-deploy**:
   - Netlify watches `main` branch (frontend)
   - Railway watches `main` branch (backend)
   - Both rebuild and redeploy automatically

## Security Notes

- API keys are stored in browser localStorage (frontend only)
- Backend `.env` file should NEVER be committed
- Use environment variables in production platforms
- Consider adding authentication for production use
- Rate limit API endpoints for production

## Next Steps

1. Add user authentication
2. Add database for book persistence
3. Add real-time collaboration
4. Add PDF export
5. Add custom themes
6. Add version control for books
