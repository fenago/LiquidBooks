# 📚 LiquidBooks - AI-Powered Interactive Book Platform

Create beautiful, interactive books with Jupyter Book features - powered by AI.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- pip

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

## Features

✅ **Interactive Book Creation** - Create books with chapters through an intuitive UI
✅ **Monaco Editor** - Professional markdown editing experience
✅ **Jupyter Book Integration** - Full support for Jupyter Book features:
  - Executable code blocks (Python and more)
  - Mathematical equations (LaTeX)
  - Admonitions (notes, warnings, tips)
  - MyST Markdown syntax
  - Interactive visualizations
✅ **One-Click Build** - Build your book to static HTML
✅ **GitHub Pages Deployment** - Deploy directly to GitHub Pages (optional)

## Usage

1. **Create a Book**
   - Click "New Book" on the dashboard
   - Fill in title, author, and description
   - Click "Create Book"

2. **Edit Content**
   - Select a chapter from the sidebar
   - Write content in markdown
   - Use Jupyter Book features:
     ```markdown
     # Code blocks
     \`\`\`python
     print("Hello, World!")
     \`\`\`

     # Math
     $$E = mc^2$$

     # Admonitions
     :::{note}
     This is a note!
     :::
     ```

3. **Build & Deploy**
   - Click "Build & Deploy" button
   - Your book will be built with Jupyter Book
   - View the generated book in your browser

## GitHub Pages Deployment

To deploy to GitHub Pages:

1. Create a GitHub personal access token with `repo` permissions
2. In the backend `.env` file, add:
   ```
   GITHUB_TOKEN=your_token_here
   GITHUB_USERNAME=your_username
   ```
3. In the frontend, provide repo name when building
4. Your book will be deployed to `https://username.github.io/repo-name/`

## Project Structure

```
LiquidBooks/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── store.ts     # State management
│   │   └── types.ts     # TypeScript types
│   └── package.json
├── backend/           # FastAPI backend
│   ├── main.py        # API server & Jupyter Book builder
│   ├── requirements.txt
│   └── .env           # Environment variables
└── research/          # Documentation
```

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Monaco Editor (VSCode editor)
- Zustand (state management)
- Axios (HTTP client)

**Backend:**
- FastAPI (Python web framework)
- Jupyter Book (book builder)
- PyGithub (GitHub integration)

## Development

### Frontend Development

```bash
cd frontend
npm run dev     # Start dev server
npm run build   # Build for production
```

### Backend Development

```bash
cd backend
python main.py  # Start API server
```

The backend includes automatic reload during development.

## Jupyter Book Features Supported

- ✅ Markdown content
- ✅ Executable code blocks (Python, JavaScript, etc.)
- ✅ LaTeX math equations
- ✅ Admonitions (notes, warnings, tips, etc.)
- ✅ MyST Markdown syntax
- ✅ Table of contents generation
- ✅ Theming and customization
- ✅ GitHub repository integration
- ✅ PDF export (via Jupyter Book)
- ✅ EPUB export (via Jupyter Book)

## Future Features (Roadmap)

- 🔄 AI-powered content generation
- 🔄 Real-time collaboration
- 🔄 Interactive quizzes and assessments
- 🔄 Image and video generation
- 🔄 Multi-language code execution
- 🔄 Analytics dashboard
- 🔄 Custom theming
- 🔄 Version control integration

## License

MIT License - see LICENSE file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Jupyter Book
