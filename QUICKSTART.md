# 🚀 LiquidBooks Quick Start Guide

## ✅ Setup Complete!

Your LiquidBooks platform is now running:

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:8000

## How to Use

### 1. Create Your First Book

1. Open http://localhost:5174 in your browser
2. Click "Create Your First Book" or "+ New Book"
3. Fill in:
   - **Title**: e.g., "Introduction to Python"
   - **Author**: Your name
   - **Description**: Brief description (optional)
4. Click "Create Book"

### 2. Edit Your Book

You'll see a default book with 2 chapters:
- Introduction
- Getting Started

**To edit a chapter:**
1. Click on a chapter in the left sidebar
2. Edit the markdown content in the Monaco editor
3. Your changes are saved automatically in state

**To add a new chapter:**
1. Click the "+" button in the sidebar
2. Enter chapter title
3. Click "Add" or press Enter

### 3. Use Jupyter Book Features

The editor supports full Jupyter Book / MyST Markdown syntax:

#### Code Blocks
\`\`\`python
def hello():
    print("Hello, World!")

hello()
\`\`\`

#### Math Equations
```
Inline math: $E = mc^2$

Block math:
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
```

#### Admonitions
```
:::{note}
This is a note admonition!
:::

:::{warning}
Be careful with this!
:::

:::{tip}
Here's a helpful tip!
:::

:::{important}
This is important information!
:::
```

#### Images
```
![Alt text](https://example.com/image.png)
```

#### Tables
```
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
```

### 4. Build Your Book

1. Click the "🚀 Build & Deploy" button in the sidebar
2. The backend will:
   - Generate `_config.yml` configuration
   - Generate `_toc.yml` table of contents
   - Write all chapter markdown files
   - Run `jupyter-book build`
   - Generate static HTML site

3. You'll see a success message with a file path
4. Open the path in your browser to see your built book!

Example output:
```
Book built successfully!
URL: file:///tmp/liquidbook_abc123/_build/html/index.html
```

### 5. View Your Built Book

Copy the `file://` URL from the build status and paste it into your browser.

You'll see your interactive Jupyter Book with:
- ✅ Table of contents
- ✅ Formatted markdown
- ✅ Code syntax highlighting
- ✅ Math equations
- ✅ Styled admonitions
- ✅ Responsive design
- ✅ Search functionality
- ✅ Dark mode toggle

## Next Steps

### Deploy to GitHub Pages (Optional)

To deploy your book to GitHub Pages:

1. Create a GitHub Personal Access Token:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Copy the token

2. Update `backend/.env`:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_USERNAME=your_username
   ```

3. In the frontend, the build request would include:
   ```json
   {
     "github_username": "your_username",
     "github_token": "your_token",
     "repo_name": "my-book"
   }
   ```

4. Your book will be deployed to: `https://your_username.github.io/my-book/`

### Example Book Content

Here's a complete example of a chapter using all features:

\`\`\`markdown
# Data Science Tutorial

## Introduction

Welcome to this **data science** tutorial! We'll cover:
- Python basics
- Data manipulation with pandas
- Visualization

:::{note}
Make sure you have Python 3.8+ installed!
:::

## Python Code Example

Let's start with a simple example:

\`\`\`python
import pandas as pd
import numpy as np

# Create a sample dataset
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'score': [95, 87, 92]
}

df = pd.DataFrame(data)
print(df)
\`\`\`

## Mathematical Formulas

The mean is calculated as:

$$
\\mu = \\frac{1}{n} \\sum_{i=1}^{n} x_i
$$

Standard deviation:

$$
\\sigma = \\sqrt{\\frac{1}{n} \\sum_{i=1}^{n} (x_i - \\mu)^2}
$$

## Important Tips

:::{tip}
Use descriptive variable names for better code readability!
:::

:::{warning}
Always validate your data before analysis!
:::

## Summary Table

| Concept | Description | Example |
|---------|-------------|---------|
| Mean | Average value | `df['score'].mean()` |
| Median | Middle value | `df['score'].median()` |
| Mode | Most frequent | `df['score'].mode()` |

## Conclusion

You've learned the basics of data science with Python!
\`\`\`

## Troubleshooting

### Frontend not loading?
- Check that port 5174 is available
- Try `npm run dev` in the frontend directory

### Backend not responding?
- Ensure port 8000 is free
- Check that all dependencies are installed
- Try `python main.py` in the backend directory with venv activated

### Build failing?
- Check that Jupyter Book is installed: `jupyter-book --version`
- Review the build logs in the status message
- Ensure your markdown syntax is valid

## Features Checklist

✅ **Implemented:**
- Interactive book creation wizard
- Monaco editor for markdown
- Chapter management
- Jupyter Book generation (_config.yml, _toc.yml)
- Full MyST Markdown support
- Code blocks with syntax highlighting
- Math equations (LaTeX)
- Admonitions (notes, warnings, tips)
- Local book building
- GitHub Pages deployment (optional)

🔜 **Future Features:**
- AI-powered content generation
- Real-time preview
- Collaborative editing
- Image uploads
- Interactive quizzes
- Analytics dashboard
- Custom themes
- EPUB/PDF export

## Support

Need help? The platform includes:
- Full Jupyter Book documentation support
- MyST Markdown syntax
- Professional code editor (Monaco)
- Automatic book building

Enjoy creating beautiful interactive books! 📚✨
