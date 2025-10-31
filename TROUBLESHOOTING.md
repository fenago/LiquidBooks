# 🔧 LiquidBooks Troubleshooting Guide

## ✅ Current Status

**Frontend**: http://localhost:5174 ✅ Running
**Backend**: http://localhost:8000 ✅ Running
**CORS**: ✅ Fixed for port 5174

---

## Common Issues & Solutions

### 1. CORS Error (Fixed!)

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: ✅ Already fixed! Backend now allows requests from port 5174.

If you see this again:
- Check backend is running on port 8000
- Verify `allow_origins` in `backend/main.py` includes your frontend port

---

### 2. Module Import Errors

**Error**: `The requested module does not provide an export named 'X'`

**Solution**:
```bash
cd frontend
rm -rf node_modules/.vite dist
npm run dev
```

All imports now use `.js` extensions for ESM compatibility.

---

### 3. Build Failing

**Symptoms**:
- Build button doesn't work
- Error in console
- No build output

**Solutions**:

1. **Check Backend is Running**:
   ```bash
   curl http://localhost:8000/
   # Should return: {"status":"LiquidBooks API is running"}
   ```

2. **Check Jupyter Book is Installed**:
   ```bash
   cd backend
   source venv/bin/activate
   jupyter-book --version
   ```

3. **View API Docs**:
   - Open http://localhost:8000/docs
   - Test the `/api/build` endpoint directly

4. **Check Build Logs**:
   - Look at backend console output
   - Check for errors in the build status message

---

### 4. Frontend Not Loading

**Solutions**:

1. **Clear Cache**:
   ```bash
   cd frontend
   rm -rf node_modules/.vite dist
   npm run dev
   ```

2. **Check Port**:
   - Default is 5174 (or 5173)
   - Make sure nothing else is using the port

3. **Reinstall Dependencies**:
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

### 5. Backend Not Starting

**Solutions**:

1. **Check Python Version**:
   ```bash
   python --version
   # Should be 3.11+
   ```

2. **Activate Virtual Environment**:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Reinstall Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Check Port 8000**:
   ```bash
   lsof -i :8000  # See what's using port 8000
   ```

---

### 6. Book Not Building Properly

**Symptoms**:
- Build succeeds but book looks wrong
- Missing chapters
- Broken formatting

**Solutions**:

1. **Check Markdown Syntax**:
   - Make sure all code blocks are properly closed with \`\`\`
   - Check admonitions use correct syntax: `:::{note}` ... `:::`
   - Verify math equations use proper LaTeX

2. **Validate Chapter Order**:
   - Chapters should have sequential order values (0, 1, 2...)

3. **Check Build Output**:
   - The build status shows the build directory
   - Navigate to `_build/html` to see generated files
   - Open `index.html` to see the book

---

### 7. Can't View Built Book

**Solution**:

After building, you get a URL like:
```
file:///tmp/liquidbook_abc123/_build/html/index.html
```

**To view**:
1. Copy the entire `file://` URL
2. Paste into your browser address bar
3. Press Enter

**Alternative**:
```bash
# Open from terminal (macOS)
open /tmp/liquidbook_abc123/_build/html/index.html

# Open from terminal (Linux)
xdg-open /tmp/liquidbook_abc123/_build/html/index.html

# Windows
start /tmp/liquidbook_abc123/_build/html/index.html
```

---

### 8. GitHub Deployment Not Working

**Requirements**:
1. GitHub Personal Access Token with `repo` permissions
2. Token added to `backend/.env`:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_USERNAME=your_username
   ```

**Steps**:
1. Generate token: https://github.com/settings/tokens
2. Update `.env` file
3. Restart backend
4. Build with deployment enabled

---

## Quick Restart Commands

### Restart Everything
```bash
# Kill all processes
# Press Ctrl+C in each terminal running the servers

# Frontend
cd frontend
npm run dev

# Backend (in new terminal)
cd backend
source venv/bin/activate
python main.py
```

### Clean Restart
```bash
# Frontend
cd frontend
rm -rf node_modules/.vite dist
npm run dev

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

---

## Testing the Full Flow

1. **Open Frontend**: http://localhost:5174
2. **Create Book**:
   - Click "+ New Book"
   - Title: "Test Book"
   - Author: "Your Name"
   - Click "Create Book"

3. **Edit Chapter**:
   - Click "Introduction" in sidebar
   - Edit the markdown
   - Changes save automatically

4. **Build**:
   - Click "🚀 Build & Deploy"
   - Wait for success message
   - Copy the `file://` URL

5. **View**:
   - Paste URL in browser
   - Verify book displays correctly

---

## Getting Help

If you're still having issues:

1. **Check Browser Console**: Press F12 → Console tab
2. **Check Backend Logs**: Look at terminal running `python main.py`
3. **Check Frontend Logs**: Look at terminal running `npm run dev`
4. **Verify File Structure**:
   ```
   LiquidBooks/
   ├── frontend/
   │   ├── src/
   │   ├── package.json
   │   └── node_modules/
   └── backend/
       ├── main.py
       ├── requirements.txt
       └── venv/
   ```

---

## Current Known Issues

✅ **All resolved!**

- ~~CORS errors~~ - Fixed
- ~~Module import errors~~ - Fixed
- ~~TypeScript compilation issues~~ - Fixed

---

**Everything should be working now!** 🎉

Open http://localhost:5174 and start creating!
