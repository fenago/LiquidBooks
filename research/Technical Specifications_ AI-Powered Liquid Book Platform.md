# Technical Specifications: AI-Powered Liquid Book Platform

**Version**: 2.0 (Updated)
**Date**: October 25, 2025
**Author**: Manus AI

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Schema](#3-database-schema)
4. [API Specifications](#4-api-specifications)
5. [Multi-Provider AI Integration](#5-multi-provider-ai-integration)
6. [GitHub Integration](#6-github-integration)
7. [Jupyter Book Build System](#7-jupyter-book-build-system)
8. [Security & Authentication](#8-security--authentication)
9. [Performance & Scalability](#9-performance--scalability)
10. [Deployment Architecture](#10-deployment-architecture)

---

## 1. System Architecture

### 1.1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Client Layer                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         React SPA (Vercel/Netlify)                   │  │
│  │  - Dashboard & Project Management                    │  │
│  │  - AI-Powered Book Wizard                            │  │
│  │  - Monaco Editor (Markdown/Code)                     │  │
│  │  - Real-Time Preview                                 │  │
│  │  - Media Management (Images, Videos)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │ HTTPS/REST API + WebSocket
                         ▼
┌────────────────────────────────────────────────────────────┐
│                  Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         FastAPI Backend (Railway/Render)             │  │
│  │  - REST API Endpoints                                │  │
│  │  - Multi-Provider AI Service                         │  │
│  │  - GitHub API Integration                            │  │
│  │  - Content Management                                │  │
│  │  - Media Processing                                  │  │
│  │  - Jupyter Book Builder Service                      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Celery Workers (Background Tasks)            │  │
│  │  - Book Build Queue                                  │  │
│  │  - AI Generation Tasks                               │  │
│  │  - GitHub Sync Operations                            │  │
│  │  - Image/Video Processing                            │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬───────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬─────────────────┐
        ▼                ▼                ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Supabase   │  │ Multi-Provider│  │   GitHub     │  │    Redis     │
│   Backend    │  │   AI Layer    │  │     API      │  │    Cache     │
│              │  │               │  │              │  │              │
│ - PostgreSQL │  │ - OpenRouter  │  │ - OAuth      │  │ - Sessions   │
│ - Auth       │  │ - Together.AI │  │ - Repos      │  │ - Queue      │
│ - Storage    │  │ - Anthropic   │  │ - Pages      │  │ - Build Jobs │
│ - Real-time  │  │ - OpenAI      │  │ - Actions    │  │              │
└──────────────┘  │ - Stability AI│  └──────────────┘  └──────────────┘
                  │ - Runway ML   │
                  │ - Replicate   │
                  └──────────────┘
```

### 1.2. Component Responsibilities

**Frontend (React SPA)**:
- User interface and interactions
- Real-time preview rendering
- State management (Redux/Zustand)
- WebSocket connections for live updates
- Client-side validation

**Backend API (FastAPI)**:
- Request routing and validation
- Business logic orchestration
- Authentication and authorization
- Rate limiting and throttling
- Error handling and logging

**Celery Workers**:
- Asynchronous task processing
- Long-running operations (book builds)
- Scheduled tasks (GitHub sync)
- Resource-intensive operations (image processing)

**Supabase**:
- Data persistence (PostgreSQL)
- User authentication
- File storage (images, videos, assets)
- Real-time subscriptions

**Multi-Provider AI Layer**:
- Unified interface for AI providers
- Request routing and load balancing
- Automatic failover
- Cost tracking and optimization

**GitHub Integration**:
- Repository management
- Content synchronization
- Deployment automation
- Collaboration features

**Redis**:
- Session storage
- Task queue for Celery
- Caching layer
- Rate limiting counters

---

## 2. Technology Stack

### 2.1. Frontend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 18.2+ | UI framework |
| **TypeScript** | 5.0+ | Type safety |
| **Vite** | 4.0+ | Build tool |
| **Tailwind CSS** | 3.3+ | Styling |
| **Headless UI** | 1.7+ | Accessible components |
| **Monaco Editor** | 0.44+ | Code/Markdown editor |
| **React Query** | 4.0+ | Server state management |
| **Zustand** | 4.4+ | Client state management |
| **React Router** | 6.16+ | Routing |
| **Axios** | 1.5+ | HTTP client |

### 2.2. Backend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Python** | 3.11+ | Programming language |
| **FastAPI** | 0.104+ | Web framework |
| **Pydantic** | 2.4+ | Data validation |
| **SQLAlchemy** | 2.0+ | ORM |
| **Alembic** | 1.12+ | Database migrations |
| **Celery** | 5.3+ | Task queue |
| **Redis** | 7.2+ | Cache and queue |
| **Jupyter Book** | 2.0+ | Static site generator |
| **httpx** | 0.25+ | Async HTTP client |
| **python-multipart** | 0.0.6+ | File uploads |

### 2.3. Infrastructure

| Service | Purpose | Provider |
| :--- | :--- | :--- |
| **Frontend Hosting** | Static site hosting | Vercel/Netlify |
| **Backend Hosting** | API and workers | Railway/Render |
| **Database** | PostgreSQL | Supabase |
| **Storage** | File storage | Supabase Storage |
| **Cache/Queue** | Redis | Redis Cloud |
| **CDN** | Content delivery | Cloudflare |
| **Monitoring** | Error tracking | Sentry |
| **Analytics** | Usage analytics | PostHog |

### 2.4. AI Providers

| Provider | API | Purpose |
| :--- | :--- | :--- |
| **OpenRouter** | REST API | Primary aggregator (400+ models) |
| **Together.AI** | REST API | Cost-effective alternative |
| **Anthropic** | REST API | Claude models |
| **OpenAI** | REST API | GPT-4, DALL-E |
| **Stability AI** | REST API | Image generation |
| **Runway ML** | REST API | Video generation |
| **Replicate** | REST API | Open-source models |

---

## 3. Database Schema

### 3.1. Entity Relationship Diagram

```
┌─────────────────┐
│     profiles    │
├─────────────────┤
│ id (PK)         │
│ email           │
│ full_name       │
│ avatar_url      │
│ github_username │
│ github_token    │◄──────────┐
│ created_at      │           │
└────────┬────────┘           │
         │                    │
         │ 1:N                │
         ▼                    │
┌─────────────────┐           │
│      books      │           │
├─────────────────┤           │
│ id (PK)         │           │
│ user_id (FK)    │───────────┘
│ title           │
│ description     │
│ book_type       │
│ status          │
│ config          │
│ system_prompt   │
│ github_repo_url │
│ github_sync     │
│ published_url   │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    chapters     │
├─────────────────┤
│ id (PK)         │
│ book_id (FK)    │◄──────────┐
│ title           │           │
│ content         │           │
│ order_index     │           │
│ enabled         │           │
│ created_at      │           │
│ updated_at      │           │
└────────┬────────┘           │
         │                    │
         │ 1:N                │
         ▼                    │
┌─────────────────┐           │
│  assessments    │           │
├─────────────────┤           │
│ id (PK)         │           │
│ chapter_id (FK) │───────────┘
│ questions       │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│     builds      │
├─────────────────┤
│ id (PK)         │
│ book_id (FK)    │───────────┐
│ status          │           │
│ build_log       │           │
│ output_url      │           │
│ started_at      │           │
│ completed_at    │           │
└─────────────────┘           │
                              │
                              │
┌─────────────────┐           │
│   ai_usage      │           │
├─────────────────┤           │
│ id (PK)         │           │
│ user_id (FK)    │───────────┘
│ provider        │
│ model           │
│ operation       │
│ tokens_used     │
│ cost            │
│ created_at      │
└─────────────────┘
```

### 3.2. SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  github_access_token TEXT, -- Encrypted
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  book_type TEXT NOT NULL CHECK (book_type IN ('article', 'book', 'course', 'research')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'published', 'failed')),
  config JSONB DEFAULT '{}',
  system_prompt TEXT,
  github_repo_url TEXT,
  github_sync_enabled BOOLEAN DEFAULT false,
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT books_user_id_idx FOREIGN KEY (user_id) REFERENCES profiles(id)
);

CREATE INDEX idx_books_user_id ON books(user_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_created_at ON books(created_at DESC);

-- Chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content
  order_index INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique order within book
  UNIQUE(book_id, order_index)
);

CREATE INDEX idx_chapters_book_id ON chapters(book_id);
CREATE INDEX idx_chapters_order ON chapters(book_id, order_index);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- JupyterQuiz format
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assessments_chapter_id ON assessments(chapter_id);

-- Builds table
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'building', 'success', 'failed')),
  build_log TEXT,
  output_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_builds_book_id ON builds(book_id);
CREATE INDEX idx_builds_status ON builds(status);
CREATE INDEX idx_builds_started_at ON builds(started_at DESC);

-- AI Usage tracking
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  operation TEXT NOT NULL,
  tokens_used INTEGER,
  cost DECIMAL(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX idx_ai_usage_created_at ON ai_usage(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Books: Users can manage their own books
CREATE POLICY "Users can view own books" ON books
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own books" ON books
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own books" ON books
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own books" ON books
  FOR DELETE USING (auth.uid() = user_id);

-- Chapters: Users can manage chapters of their books
CREATE POLICY "Users can view own chapters" ON chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM books WHERE books.id = chapters.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own chapters" ON chapters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM books WHERE books.id = chapters.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own chapters" ON chapters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM books WHERE books.id = chapters.book_id AND books.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own chapters" ON chapters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM books WHERE books.id = chapters.book_id AND books.user_id = auth.uid()
    )
  );

-- Similar policies for assessments, builds, and ai_usage...

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 4. API Specifications

### 4.1. Authentication Endpoints

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
GET    /api/v1/auth/github/authorize
GET    /api/v1/auth/github/callback
POST   /api/v1/auth/google/login
```

### 4.2. Books Endpoints

```
GET    /api/v1/books                    # List user's books
POST   /api/v1/books                    # Create new book
GET    /api/v1/books/{id}               # Get book details
PATCH  /api/v1/books/{id}               # Update book
DELETE /api/v1/books/{id}               # Delete book
POST   /api/v1/books/{id}/build         # Trigger build
GET    /api/v1/books/{id}/preview       # Get preview URL
POST   /api/v1/books/{id}/publish       # Publish book
POST   /api/v1/books/{id}/duplicate     # Duplicate book
```

### 4.3. Chapters Endpoints

```
GET    /api/v1/books/{book_id}/chapters     # List chapters
POST   /api/v1/books/{book_id}/chapters     # Create chapter
GET    /api/v1/chapters/{id}                # Get chapter
PATCH  /api/v1/chapters/{id}                # Update chapter
DELETE /api/v1/chapters/{id}                # Delete chapter
POST   /api/v1/chapters/reorder             # Reorder chapters
```

### 4.4. AI Endpoints

```
POST   /api/v1/ai/generate-structure       # Generate book structure
POST   /api/v1/ai/generate-chapter         # Generate chapter content
POST   /api/v1/ai/generate-image           # Generate image
POST   /api/v1/ai/generate-video           # Generate video (future)
POST   /api/v1/ai/generate-questions       # Generate quiz questions
POST   /api/v1/ai/assist                   # General writing assistance
GET    /api/v1/ai/usage                    # Get AI usage stats
```

### 4.5. GitHub Endpoints

```
POST   /api/v1/github/connect              # Connect GitHub account
POST   /api/v1/github/disconnect           # Disconnect GitHub
GET    /api/v1/github/repos                # List user's repos
POST   /api/v1/github/create-repo          # Create repository for book
POST   /api/v1/github/push                 # Push content to GitHub
POST   /api/v1/github/sync                 # Sync changes from GitHub
GET    /api/v1/github/status/{book_id}     # Get sync status
```

### 4.6. Media Endpoints

```
POST   /api/v1/media/upload                # Upload image/video
DELETE /api/v1/media/{id}                  # Delete media
GET    /api/v1/media/{id}                  # Get media URL
POST   /api/v1/media/optimize              # Optimize image
```

---

## 5. Multi-Provider AI Integration

### 5.1. Provider Abstraction Layer

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from enum import Enum

class AIProvider(Enum):
    OPENROUTER = "openrouter"
    TOGETHER = "together"
    ANTHROPIC = "anthropic"
    OPENAI = "openai"
    STABILITY = "stability"
    RUNWAY = "runway"
    REPLICATE = "replicate"

class BaseAIProvider(ABC):
    """Abstract base class for AI providers"""
    
    def __init__(self, api_key: str, config: Dict[str, Any] = None):
        self.api_key = api_key
        self.config = config or {}
    
    @abstractmethod
    async def generate_text(
        self, 
        prompt: str, 
        model: str = None,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> str:
        """Generate text from prompt"""
        pass
    
    @abstractmethod
    async def generate_image(
        self, 
        prompt: str,
        model: str = None,
        size: str = "1024x1024",
        **kwargs
    ) -> bytes:
        """Generate image from prompt"""
        pass
    
    @abstractmethod
    async def generate_video(
        self,
        prompt: str,
        model: str = None,
        duration: int = 5,
        **kwargs
    ) -> bytes:
        """Generate video from prompt"""
        pass
    
    @abstractmethod
    async def analyze_image(
        self,
        image: bytes,
        prompt: str,
        model: str = None,
        **kwargs
    ) -> str:
        """Analyze image and return description"""
        pass

class OpenRouterProvider(BaseAIProvider):
    """OpenRouter implementation"""
    
    BASE_URL = "https://openrouter.ai/api/v1"
    
    async def generate_text(self, prompt: str, model: str = None, **kwargs) -> str:
        model = model or "anthropic/claude-3.5-sonnet"
        # Implementation
        pass
    
    async def generate_image(self, prompt: str, **kwargs) -> bytes:
        model = kwargs.get("model", "google/gemini-2.5-flash-image-preview")
        # Implementation
        pass
    
    # ... other methods

class AIProviderFactory:
    """Factory for creating AI provider instances"""
    
    _providers: Dict[AIProvider, BaseAIProvider] = {}
    
    @classmethod
    def register_provider(cls, provider_type: AIProvider, provider: BaseAIProvider):
        cls._providers[provider_type] = provider
    
    @classmethod
    def get_provider(cls, provider_type: AIProvider) -> BaseAIProvider:
        if provider_type not in cls._providers:
            raise ValueError(f"Provider {provider_type} not registered")
        return cls._providers[provider_type]

class AIService:
    """High-level AI service with automatic provider selection"""
    
    def __init__(self, default_provider: AIProvider = AIProvider.OPENROUTER):
        self.default_provider = default_provider
        self.fallback_providers = [
            AIProvider.TOGETHER,
            AIProvider.ANTHROPIC,
            AIProvider.OPENAI
        ]
    
    async def generate_text(
        self, 
        prompt: str,
        provider: Optional[AIProvider] = None,
        **kwargs
    ) -> str:
        """Generate text with automatic fallback"""
        provider = provider or self.default_provider
        
        try:
            ai_provider = AIProviderFactory.get_provider(provider)
            return await ai_provider.generate_text(prompt, **kwargs)
        except Exception as e:
            # Try fallback providers
            for fallback in self.fallback_providers:
                if fallback == provider:
                    continue
                try:
                    ai_provider = AIProviderFactory.get_provider(fallback)
                    return await ai_provider.generate_text(prompt, **kwargs)
                except:
                    continue
            raise e
    
    async def generate_image(
        self,
        prompt: str,
        provider: Optional[AIProvider] = None,
        **kwargs
    ) -> bytes:
        """Generate image with provider selection"""
        provider = provider or AIProvider.OPENROUTER
        ai_provider = AIProviderFactory.get_provider(provider)
        return await ai_provider.generate_image(prompt, **kwargs)
```

### 5.2. Provider Configuration

```python
# config/ai_providers.py

AI_PROVIDER_CONFIG = {
    "openrouter": {
        "api_key": os.getenv("OPENROUTER_API_KEY"),
        "base_url": "https://openrouter.ai/api/v1",
        "default_text_model": "anthropic/claude-3.5-sonnet",
        "default_image_model": "google/gemini-2.5-flash-image-preview",
        "rate_limit": 100,  # requests per minute
    },
    "together": {
        "api_key": os.getenv("TOGETHER_API_KEY"),
        "base_url": "https://api.together.xyz/v1",
        "default_text_model": "meta-llama/Llama-3-70b-chat-hf",
        "rate_limit": 60,
    },
    "anthropic": {
        "api_key": os.getenv("ANTHROPIC_API_KEY"),
        "base_url": "https://api.anthropic.com/v1",
        "default_text_model": "claude-3-5-sonnet-20241022",
        "rate_limit": 50,
    },
    "openai": {
        "api_key": os.getenv("OPENAI_API_KEY"),
        "base_url": "https://api.openai.com/v1",
        "default_text_model": "gpt-4-turbo-preview",
        "default_image_model": "dall-e-3",
        "rate_limit": 60,
    }
}
```

---

## 6. GitHub Integration

### 6.1. GitHub Service Implementation

```python
import httpx
from typing import Dict, Any, List

class GitHubService:
    """Service for GitHub API integration"""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }
    
    async def create_repository(
        self,
        name: str,
        description: str = "",
        private: bool = False
    ) -> Dict[str, Any]:
        """Create a new GitHub repository"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/user/repos",
                headers=self.headers,
                json={
                    "name": name,
                    "description": description,
                    "private": private,
                    "auto_init": True
                }
            )
            response.raise_for_status()
            return response.json()
    
    async def push_content(
        self,
        repo_full_name: str,
        files: Dict[str, str],
        commit_message: str = "Update book content"
    ) -> Dict[str, Any]:
        """Push multiple files to repository"""
        # Get current commit SHA
        ref_response = await self._get_ref(repo_full_name, "heads/main")
        commit_sha = ref_response["object"]["sha"]
        
        # Get tree
        tree_response = await self._get_tree(repo_full_name, commit_sha)
        base_tree_sha = tree_response["sha"]
        
        # Create blobs for each file
        tree_items = []
        for path, content in files.items():
            blob_sha = await self._create_blob(repo_full_name, content)
            tree_items.append({
                "path": path,
                "mode": "100644",
                "type": "blob",
                "sha": blob_sha
            })
        
        # Create new tree
        new_tree_sha = await self._create_tree(
            repo_full_name,
            tree_items,
            base_tree_sha
        )
        
        # Create commit
        new_commit_sha = await self._create_commit(
            repo_full_name,
            commit_message,
            new_tree_sha,
            commit_sha
        )
        
        # Update reference
        await self._update_ref(repo_full_name, "heads/main", new_commit_sha)
        
        return {"commit_sha": new_commit_sha}
    
    async def sync_from_github(
        self,
        repo_full_name: str,
        paths: List[str]
    ) -> Dict[str, str]:
        """Pull content from GitHub"""
        files = {}
        for path in paths:
            content = await self._get_file_content(repo_full_name, path)
            files[path] = content
        return files
    
    async def setup_github_pages(
        self,
        repo_full_name: str,
        branch: str = "gh-pages"
    ) -> Dict[str, Any]:
        """Enable GitHub Pages for repository"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/repos/{repo_full_name}/pages",
                headers=self.headers,
                json={
                    "source": {
                        "branch": branch,
                        "path": "/"
                    }
                }
            )
            response.raise_for_status()
            return response.json()
    
    # Helper methods
    async def _get_ref(self, repo: str, ref: str):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/repos/{repo}/git/refs/{ref}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
    
    async def _create_blob(self, repo: str, content: str) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/repos/{repo}/git/blobs",
                headers=self.headers,
                json={"content": content, "encoding": "utf-8"}
            )
            response.raise_for_status()
            return response.json()["sha"]
    
    # ... other helper methods
```

### 6.2. GitHub Actions Workflow Template

```yaml
# .github/workflows/deploy.yml
name: Deploy Jupyter Book

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install jupyter-book
      
      - name: Build book
        run: |
          jupyter-book build .
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_build/html
```

---

## 7. Jupyter Book Build System

### 7.1. Build Service

```python
import subprocess
import tempfile
import shutil
from pathlib import Path
from typing import Dict, Any

class JupyterBookBuilder:
    """Service for building Jupyter Books"""
    
    def __init__(self, work_dir: Path = None):
        self.work_dir = work_dir or Path(tempfile.mkdtemp())
    
    async def build_book(
        self,
        book_id: str,
        chapters: List[Dict[str, Any]],
        config: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Build a Jupyter Book from chapters"""
        
        # Create book directory
        book_dir = self.work_dir / book_id
        book_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate _config.yml
        self._generate_config(book_dir, config)
        
        # Generate _toc.yml
        self._generate_toc(book_dir, chapters)
        
        # Write chapter files
        for chapter in chapters:
            if chapter["enabled"]:
                self._write_chapter(book_dir, chapter)
        
        # Run jupyter-book build
        result = await self._run_build(book_dir)
        
        if result["success"]:
            # Copy output to storage
            output_dir = book_dir / "_build" / "html"
            # Upload to storage service
            published_url = await self._upload_output(book_id, output_dir)
            result["published_url"] = published_url
        
        return result
    
    def _generate_config(self, book_dir: Path, config: Dict[str, Any]):
        """Generate _config.yml"""
        config_content = f"""
title: {config.get('title', 'My Book')}
author: {config.get('author', 'Author')}
logo: {config.get('logo', '')}

execute:
  execute_notebooks: auto

html:
  use_repository_button: true
  use_issues_button: true
  use_edit_page_button: true
  
sphinx:
  extra_extensions:
    - sphinxcontrib.mermaid
    - sphinx_jupyterquiz
  config:
    html_theme_options:
      primary_color: {config.get('primary_color', '#4F46E5')}
"""
        (book_dir / "_config.yml").write_text(config_content)
    
    def _generate_toc(self, book_dir: Path, chapters: List[Dict[str, Any]]):
        """Generate _toc.yml"""
        toc_content = "format: jb-book\nroot: intro\nchapters:\n"
        for chapter in chapters:
            if chapter["enabled"]:
                filename = self._sanitize_filename(chapter["title"])
                toc_content += f"  - file: {filename}\n"
        
        (book_dir / "_toc.yml").write_text(toc_content)
    
    def _write_chapter(self, book_dir: Path, chapter: Dict[str, Any]):
        """Write chapter content to file"""
        filename = self._sanitize_filename(chapter["title"])
        filepath = book_dir / f"{filename}.md"
        filepath.write_text(chapter["content"])
    
    async def _run_build(self, book_dir: Path) -> Dict[str, Any]:
        """Run jupyter-book build command"""
        try:
            result = subprocess.run(
                ["jupyter-book", "build", str(book_dir)],
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes
            )
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": "Build timeout after 5 minutes"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def _sanitize_filename(title: str) -> str:
        """Convert title to safe filename"""
        return title.lower().replace(" ", "-").replace("/", "-")
```

---

## 8. Security & Authentication

### 8.1. Authentication Flow

1. **Email/Password**: Supabase Auth handles registration and login
2. **OAuth (Google/GitHub)**: Supabase Auth OAuth flow
3. **JWT Tokens**: Access tokens (short-lived) + Refresh tokens (long-lived)
4. **Token Refresh**: Automatic refresh before expiration

### 8.2. Authorization

- **Row Level Security (RLS)**: PostgreSQL RLS policies ensure users can only access their own data
- **API Rate Limiting**: Redis-based rate limiting per user/IP
- **CORS**: Configured for frontend domain only

### 8.3. Data Protection

- **Encryption at Rest**: Supabase encrypts all data
- **Encryption in Transit**: HTTPS/TLS for all connections
- **Sensitive Data**: GitHub tokens encrypted with Fernet
- **API Keys**: Stored in environment variables, never in code

---

## 9. Performance & Scalability

### 9.1. Caching Strategy

- **Redis Cache**: API responses, user sessions, build status
- **CDN**: Static assets (images, CSS, JS)
- **Browser Cache**: Aggressive caching with cache busting

### 9.2. Database Optimization

- **Indexes**: All foreign keys and frequently queried columns
- **Connection Pooling**: PgBouncer for connection management
- **Query Optimization**: Avoid N+1 queries, use joins

### 9.3. Scalability

- **Horizontal Scaling**: Multiple backend instances behind load balancer
- **Worker Scaling**: Auto-scale Celery workers based on queue length
- **Database**: Supabase handles scaling automatically
- **Storage**: Supabase Storage with CDN

---

## 10. Deployment Architecture

### 10.1. Production Environment

```
┌─────────────────────────────────────────────┐
│            Cloudflare CDN                   │
│  - DDoS protection                          │
│  - SSL/TLS termination                      │
│  - Static asset caching                     │
└──────────────┬──────────────────────────────┘
               │
     ┌─────────┴──────────┐
     ▼                    ▼
┌─────────────┐    ┌─────────────┐
│   Vercel    │    │   Railway   │
│  (Frontend) │    │  (Backend)  │
│             │    │             │
│ - React SPA │    │ - FastAPI   │
│ - Auto-scale│    │ - Celery    │
│ - Edge      │    │ - Workers   │
└─────────────┘    └──────┬──────┘
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
     ┌──────────┐  ┌──────────┐  ┌──────────┐
     │ Supabase │  │  Redis   │  │  Sentry  │
     │          │  │  Cloud   │  │          │
     │ - DB     │  │          │  │ - Errors │
     │ - Auth   │  │ - Cache  │  │ - Logs   │
     │ - Storage│  │ - Queue  │  │ - APM    │
     └──────────┘  └──────────┘  └──────────┘
```

### 10.2. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          pytest
          npm test
  
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up
```

---

## Conclusion

This technical specification provides a comprehensive blueprint for building the AI-Powered Liquid Book Platform. The architecture is designed for scalability, maintainability, and extensibility, with clear separation of concerns and modern best practices throughout.

Key technical highlights include the multi-provider AI abstraction layer for flexibility, deep GitHub integration for version control and deployment, robust Jupyter Book build system, comprehensive security with RLS and encryption, and cloud-native architecture for easy scaling.

The specification is ready for implementation by a development team and provides sufficient detail for accurate estimation and planning.

