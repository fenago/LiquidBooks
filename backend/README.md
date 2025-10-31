# LiquidBooks Backend

FastAPI backend for building and deploying Jupyter Books.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. (Optional) Set up GitHub deployment:
   - Create a GitHub personal access token with repo permissions
   - Copy `.env.example` to `.env`
   - Add your GitHub token and username

## Running

```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /` - Health check
- `POST /api/build` - Build a Jupyter Book

## Building a Book

Send a POST request to `/api/build` with:

```json
{
  "book": {
    "id": "book-123",
    "title": "My Book",
    "author": "John Doe",
    "description": "An amazing book",
    "chapters": [
      {
        "id": "ch1",
        "title": "Introduction",
        "content": "# Introduction\n\nContent here...",
        "order": 0
      }
    ]
  },
  "github_username": "optional",
  "github_token": "optional",
  "repo_name": "optional"
}
```

The response will include a URL to view the built book.
