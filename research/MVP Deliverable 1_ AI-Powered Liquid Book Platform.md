# MVP Deliverable 1: AI-Powered Liquid Book Platform

**Version**: 1.0
**Date**: October 25, 2025
**Timeline**: 3-4 months
**Target Launch**: Q2 2026

---

## Executive Summary

This document defines the Minimum Viable Product (MVP) for the AI-Powered Liquid Book Platform. The MVP focuses on delivering core value: enabling users to create interactive, AI-powered books quickly and easily, with optional GitHub integration for version control and deployment.

**MVP Goal**: Enable 100 beta users to publish 50+ books within the first 3 months of launch.

---

## 1. MVP Scope

### 1.1. In-Scope Features

The MVP includes the essential features needed to validate the core value proposition:

| Feature Category | Included Features | Priority |
| :--- | :--- | :--- |
| **User Management** | - Email/password authentication
- Google OAuth
- GitHub OAuth
- Basic user profile | Must-Have |
| **Project Management** | - Create new book projects
- Dashboard with book list
- Basic project settings
- Delete projects | Must-Have |
| **AI Integration** | - OpenRouter integration (primary)
- Text generation (GPT-4, Claude via OpenRouter)
- Image generation (Gemini 2.5 Flash)
- AI writing assistant (continue, rewrite, expand)
- System prompts (book-level) | Must-Have |
| **Content Creation** | - AI-powered book wizard
- AI generates book structure
- AI generates chapter content
- Markdown editor with live preview
- Manual writing mode
- Chapter management (add, delete, reorder, enable/disable)
- Image upload and management | Must-Have |
| **Code Support** | - Python code cells (primary language)
- Syntax highlighting
- Basic code execution preview | Must-Have |
| **Assessments** | - JupyterQuiz integration
- Multiple choice questions
- AI-generated questions from content
- Manual question creation | Must-Have |
| **Publishing** | - One-click build and deploy
- Public URL hosting
- HTML export
- Basic SEO metadata | Must-Have |
| **GitHub Integration** | - Connect GitHub account
- Create repository for book
- Push content to GitHub
- Deploy to GitHub Pages
- Sync changes bidirectionally | High Priority |
| **Templates** | - 3-5 starter templates
- Article template
- Book template
- Course template | High Priority |

### 1.2. Out-of-Scope (Post-MVP)

Features explicitly excluded from MVP but planned for future releases:

| Feature | Reason for Exclusion | Planned Release |
| :--- | :--- | :--- |
| Multi-language code support (R, Julia, etc.) | Focus on Python first | Phase 2 |
| Thebe live code execution | Complex integration | Phase 2 |
| Video generation | High cost, complex | Phase 3 |
| Video upload/embedding | Not critical for MVP | Phase 2 |
| Tracked assessments with analytics | Requires backend complexity | Phase 2 |
| Auto-graded code challenges | Requires sandboxing infrastructure | Phase 3 |
| Custom domains | Requires DNS management | Phase 2 |
| PDF/EPUB export | Focus on HTML first | Phase 2 |
| Real-time collaboration | Complex feature | Phase 4 |
| Advanced diagrams (Graphviz, PlantUML) | Mermaid sufficient for MVP | Phase 2 |
| Template marketplace | Need user base first | Phase 3 |
| Team features | Focus on individual users | Phase 3 |
| Mobile app | Web-first approach | Phase 4+ |

---

## 2. User Workflows (MVP)

### 2.1. Primary User Journey: AI-Driven Book Creation

**Target Time**: 20-30 minutes from signup to published book

**Steps**:

1. **Sign Up** (2 minutes)
   - User visits landing page
   - Signs up with email or Google/GitHub OAuth
   - Brief onboarding (skippable)

2. **Create Book Project** (3 minutes)
   - Click "New Book"
   - Enter book title: "Introduction to Python"
   - Enter description: "A beginner-friendly guide to Python programming"
   - Select book type: "Course"
   - Enable AI assistance toggle

3. **AI Generates Structure** (1 minute)
   - AI analyzes description
   - Proposes 8 chapters with titles and descriptions
   - User reviews and approves (or regenerates)

4. **AI Generates Content** (10 minutes)
   - User clicks "Generate All Chapters"
   - AI generates content for all chapters
   - Includes text, code examples, and suggested images
   - User reviews each chapter quickly

5. **Add Assessments** (5 minutes)
   - User clicks "Add Quiz" for Chapter 1
   - AI generates 5 multiple-choice questions
   - User reviews and approves
   - Repeats for key chapters

6. **Customize & Polish** (5 minutes)
   - User makes minor edits to content
   - Uploads custom logo (optional)
   - Selects theme color

7. **Publish** (2 minutes)
   - User clicks "Publish"
   - System builds Jupyter Book
   - Deploys to platform hosting
   - User receives public URL: `liquidbooks.io/username/intro-to-python`

8. **Optional: GitHub Integration** (3 minutes)
   - User clicks "Connect GitHub"
   - Authorizes GitHub access
   - Selects "Push to GitHub"
   - System creates repo and pushes content
   - Optionally deploys to GitHub Pages

**Success Criteria**: User can complete this workflow in under 30 minutes with no technical knowledge.

### 2.2. Secondary User Journey: Manual Book Creation

**Target Time**: 2-4 hours for a 5-chapter book

**Steps**:

1. **Sign Up** (2 minutes)
2. **Create Book Project** (5 minutes)
   - Enter title and description
   - Select book type
   - Disable AI assistance toggle
   - Manually define chapter structure

3. **Write Content** (2-3 hours)
   - Write each chapter in Markdown editor
   - Add code cells manually
   - Upload images
   - Optional: Use AI assistant for specific sections

4. **Add Assessments** (20 minutes)
   - Create quizzes manually
   - Or use AI to generate, then edit

5. **Publish** (5 minutes)
   - Build and deploy
   - Optional: Push to GitHub

**Success Criteria**: User has full control over content while still having AI available on-demand.

---

## 3. Technical Architecture (MVP)

### 3.1. Technology Stack

| Component | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend** | React 18 + TypeScript + Vite | Modern, fast, type-safe |
| **UI Library** | Tailwind CSS + Headless UI | Rapid development, customizable |
| **Editor** | Monaco Editor | VS Code engine, excellent UX |
| **Backend** | Python 3.11 + FastAPI | Fast, async, easy AI integration |
| **Database** | Supabase (PostgreSQL) | Managed, auth included, real-time |
| **Storage** | Supabase Storage | Integrated with database |
| **AI Provider** | OpenRouter | Multi-model access, cost-effective |
| **Book Engine** | Jupyter Book 2.0 | Proven, extensible |
| **Task Queue** | Celery + Redis | Background book building |
| **Deployment** | Vercel (frontend) + Railway (backend) | Easy, scalable, affordable |
| **Version Control** | GitHub API | Industry standard, free hosting |

### 3.2. System Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│         React Frontend (Vercel)                      │
│  - Landing Page                                      │
│  - Dashboard                                         │
│  - Book Wizard                                       │
│  - Markdown Editor (Monaco)                          │
│  - Preview                                           │
└─────────────────┬────────────────────────────────────┘
                  │ HTTPS/REST API
                  ▼
┌──────────────────────────────────────────────────────┐
│         FastAPI Backend (Railway)                    │
│  - API Endpoints                                     │
│  - OpenRouter Integration                            │
│  - Jupyter Book Builder                              │
│  - GitHub API Integration                            │
│  - Celery Workers (background tasks)                 │
└─────────────────┬────────────────────────────────────┘
                  │
        ┌─────────┴──────────┬──────────────┐
        ▼                    ▼              ▼
┌──────────────┐    ┌──────────────┐   ┌──────────────┐
│   Supabase   │    │  OpenRouter  │   │   GitHub     │
│  - Database  │    │  - GPT-4     │   │  - Repos     │
│  - Auth      │    │  - Claude    │   │  - Pages     │
│  - Storage   │    │  - Gemini    │   │  - API       │
└──────────────┘    └──────────────┘   └──────────────┘
```

### 3.3. Database Schema (MVP)

**Core Tables**:

```sql
-- Users (managed by Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  github_access_token TEXT, -- Encrypted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  book_type TEXT NOT NULL, -- 'article', 'book', 'course'
  status TEXT DEFAULT 'draft', -- 'draft', 'building', 'published'
  config JSONB DEFAULT '{}',
  system_prompt TEXT,
  github_repo_url TEXT,
  github_sync_enabled BOOLEAN DEFAULT false,
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content
  order_index INTEGER NOT NULL,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  questions JSONB NOT NULL, -- JupyterQuiz format
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Build History
CREATE TABLE builds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  status TEXT NOT NULL, -- 'pending', 'building', 'success', 'failed'
  build_log TEXT,
  output_url TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### 3.4. API Endpoints (MVP)

**Authentication**:
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/github/authorize` - Start GitHub OAuth
- `GET /api/v1/auth/github/callback` - GitHub OAuth callback

**Books**:
- `GET /api/v1/books` - List user's books
- `POST /api/v1/books` - Create new book
- `GET /api/v1/books/{id}` - Get book details
- `PATCH /api/v1/books/{id}` - Update book
- `DELETE /api/v1/books/{id}` - Delete book
- `POST /api/v1/books/{id}/build` - Trigger build

**Chapters**:
- `GET /api/v1/books/{book_id}/chapters` - List chapters
- `POST /api/v1/books/{book_id}/chapters` - Create chapter
- `PATCH /api/v1/chapters/{id}` - Update chapter
- `DELETE /api/v1/chapters/{id}` - Delete chapter
- `POST /api/v1/chapters/reorder` - Reorder chapters

**AI**:
- `POST /api/v1/ai/generate-structure` - Generate book structure
- `POST /api/v1/ai/generate-chapter` - Generate chapter content
- `POST /api/v1/ai/generate-image` - Generate image
- `POST /api/v1/ai/generate-questions` - Generate quiz questions
- `POST /api/v1/ai/assist` - General writing assistance

**GitHub**:
- `POST /api/v1/github/connect` - Connect GitHub account
- `POST /api/v1/github/create-repo` - Create repository for book
- `POST /api/v1/github/push` - Push content to GitHub
- `POST /api/v1/github/sync` - Sync changes from GitHub
- `GET /api/v1/github/repos` - List user's repos

**Publishing**:
- `GET /api/v1/books/{id}/preview` - Get preview URL
- `POST /api/v1/books/{id}/publish` - Publish book

---

## 4. GitHub Integration Details

### 4.1. Features

| Feature | Description | MVP Status |
| :--- | :--- | :--- |
| **OAuth Connection** | Connect GitHub account via OAuth | ✅ Included |
| **Repository Creation** | Create new repo for book | ✅ Included |
| **Content Push** | Push book content (Markdown, config) to repo | ✅ Included |
| **GitHub Pages Deploy** | Automatically deploy to GitHub Pages | ✅ Included |
| **Bidirectional Sync** | Pull changes from GitHub back to platform | ✅ Included |
| **Commit History** | View commit history in platform | ❌ Post-MVP |
| **Branch Management** | Create/switch branches | ❌ Post-MVP |
| **Pull Requests** | Create PRs for collaboration | ❌ Post-MVP |

### 4.2. User Workflow

**Initial Setup**:
1. User clicks "Connect GitHub" in book settings
2. OAuth flow redirects to GitHub
3. User authorizes app
4. Access token stored securely in database

**Push to GitHub**:
1. User clicks "Push to GitHub"
2. Platform creates repo (if doesn't exist): `username/book-title`
3. Generates Jupyter Book structure:
   ```
   book-title/
   ├── _config.yml
   ├── _toc.yml
   ├── intro.md
   ├── chapter1.md
   ├── chapter2.md
   ├── images/
   └── .github/
       └── workflows/
           └── deploy.yml  # GitHub Actions for auto-deploy
   ```
4. Commits and pushes to main branch
5. GitHub Actions automatically builds and deploys to GitHub Pages

**Sync from GitHub**:
1. User edits content directly on GitHub
2. User clicks "Sync from GitHub" in platform
3. Platform pulls latest changes
4. Updates database with new content
5. User sees changes reflected in editor

### 4.3. Benefits

- **Version Control**: Full Git history of all changes
- **Collaboration**: Others can contribute via GitHub
- **Backup**: Content safely stored on GitHub
- **Portability**: Not locked into platform
- **Free Hosting**: GitHub Pages provides free hosting
- **Professional Workflow**: Familiar to developers

---

## 5. Development Phases

### Phase 1: Foundation (Weeks 1-4)

**Goals**: Set up infrastructure and core architecture

**Tasks**:
- [ ] Set up development environment
- [ ] Initialize React + TypeScript project
- [ ] Initialize FastAPI project
- [ ] Set up Supabase project
- [ ] Configure Supabase Auth
- [ ] Implement database schema
- [ ] Set up Vercel deployment (frontend)
- [ ] Set up Railway deployment (backend)
- [ ] Configure Celery + Redis
- [ ] Basic CI/CD pipeline

**Deliverables**:
- Working development environment
- Deployed staging environment
- Authentication working (email + Google OAuth)

### Phase 2: Core Features (Weeks 5-8)

**Goals**: Implement book creation and AI integration

**Tasks**:
- [ ] Build dashboard UI
- [ ] Implement book creation wizard
- [ ] Integrate OpenRouter API
- [ ] Build AI service layer
- [ ] Implement AI structure generation
- [ ] Implement AI content generation
- [ ] Build Markdown editor with Monaco
- [ ] Implement chapter management
- [ ] Add image upload functionality
- [ ] Build preview system

**Deliverables**:
- Users can create books
- AI generates structure and content
- Basic editor working
- Preview functional

### Phase 3: Publishing & GitHub (Weeks 9-10)

**Goals**: Enable publishing and GitHub integration

**Tasks**:
- [ ] Implement Jupyter Book builder
- [ ] Set up build queue with Celery
- [ ] Configure hosting for published books
- [ ] Implement GitHub OAuth
- [ ] Build GitHub API integration
- [ ] Implement repo creation
- [ ] Implement content push to GitHub
- [ ] Set up GitHub Actions template
- [ ] Implement bidirectional sync
- [ ] Build publishing UI

**Deliverables**:
- Books can be built and published
- GitHub integration working
- Auto-deploy to GitHub Pages

### Phase 4: Assessments & Polish (Weeks 11-12)

**Goals**: Add assessments and polish UX

**Tasks**:
- [ ] Integrate JupyterQuiz
- [ ] Build quiz creation UI
- [ ] Implement AI question generation
- [ ] Add code syntax highlighting
- [ ] Create starter templates
- [ ] Polish UI/UX
- [ ] Add loading states and error handling
- [ ] Write user documentation
- [ ] Create tutorial videos
- [ ] Performance optimization

**Deliverables**:
- Assessments working
- Templates available
- Polished, production-ready MVP

### Phase 5: Testing & Launch (Weeks 13-16)

**Goals**: Test thoroughly and launch to beta users

**Tasks**:
- [ ] Internal testing
- [ ] Bug fixes
- [ ] Security audit
- [ ] Performance testing
- [ ] Beta user recruitment
- [ ] Beta testing
- [ ] Collect feedback
- [ ] Iterate based on feedback
- [ ] Prepare marketing materials
- [ ] Soft launch

**Deliverables**:
- Stable, tested MVP
- 100 beta users onboarded
- Feedback collected
- Roadmap for Phase 2

---

## 6. Success Metrics

### 6.1. User Acquisition (First 3 Months)

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| Beta signups | 100 users | Supabase analytics |
| Activation rate | 60% (create at least 1 book) | Database query |
| Retention (30-day) | 40% | Cohort analysis |

### 6.2. Engagement

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| Books created | 150+ | Database count |
| Books published | 50+ | Database count |
| Avg. time to first publish | < 45 minutes | Timestamp analysis |
| AI usage rate | 70% of users | Feature flags |
| GitHub integration usage | 20% of users | Feature flags |

### 6.3. Quality

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| User satisfaction (NPS) | > 40 | Survey |
| Build success rate | > 95% | Build logs |
| API uptime | > 99% | Monitoring |
| Page load time | < 2 seconds | Performance monitoring |

### 6.4. Technical

| Metric | Target | Measurement |
| :--- | :--- | :--- |
| API response time (p95) | < 500ms | APM |
| Build time (avg) | < 2 minutes | Build logs |
| Error rate | < 1% | Error tracking |

---

## 7. Budget & Resources

### 7.1. Development Team

| Role | Time Commitment | Duration |
| :--- | :--- | :--- |
| Full-Stack Developer | Full-time | 4 months |
| UI/UX Designer | Part-time (20 hrs/week) | 2 months |
| DevOps Engineer | Part-time (10 hrs/week) | 4 months |

**Alternative**: Single full-stack developer with design skills (4 months full-time)

### 7.2. Infrastructure Costs (Monthly, Beta Phase)

| Service | Plan | Cost |
| :--- | :--- | :--- |
| Vercel | Pro | $20 |
| Railway | Hobby | $5 |
| Supabase | Pro | $25 |
| OpenRouter | Pay-as-you-go | $200 (estimated) |
| Redis Cloud | Free tier | $0 |
| **Total** | | **$250/month** |

### 7.3. Total MVP Budget

| Category | Cost |
| :--- | :--- |
| Development (4 months @ $10k/month) | $40,000 |
| Design (2 months @ $5k/month) | $10,000 |
| DevOps (4 months @ $2.5k/month) | $10,000 |
| Infrastructure (4 months @ $250/month) | $1,000 |
| Contingency (10%) | $6,100 |
| **Total** | **$67,100** |

---

## 8. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
| :--- | :--- | :--- | :--- |
| **AI costs exceed budget** | High | Medium | - Set usage limits per user
- Implement caching
- Monitor costs daily
- Have fallback to cheaper models |
| **Jupyter Book build complexity** | Medium | Medium | - Extensive testing
- Clear error messages
- Fallback to simpler builds
- Provide templates |
| **GitHub API rate limits** | Medium | Low | - Implement rate limiting
- Queue GitHub operations
- Cache GitHub data
- Provide alternative hosting |
| **Low user adoption** | High | Medium | - Strong onboarding
- Clear value proposition
- Excellent documentation
- Responsive support |
| **Technical debt** | Medium | High | - Code reviews
- Automated testing
- Refactor as needed
- Document decisions |

---

## 9. Post-MVP Roadmap

### Phase 2 (Months 5-7)
- Multi-language code support (R, Julia, JavaScript)
- Thebe live code execution
- Video upload and embedding
- PDF/EPUB export
- Custom domains
- Advanced diagrams (Graphviz, PlantUML)
- Tracked assessments with analytics

### Phase 3 (Months 8-12)
- Video generation (Runway ML integration)
- Auto-graded code challenges
- Template marketplace
- Team features
- Advanced analytics
- Monetization (paid plans)

### Phase 4 (Year 2+)
- Real-time collaboration
- Mobile app
- nbgrader integration for institutions
- White-label solutions
- API for third-party integrations

---

## 10. Launch Checklist

### Pre-Launch
- [ ] All MVP features implemented and tested
- [ ] Security audit completed
- [ ] Performance optimization done
- [ ] Documentation written
- [ ] Tutorial videos created
- [ ] Landing page live
- [ ] Beta user list prepared
- [ ] Support system set up (email, Discord)
- [ ] Analytics configured
- [ ] Monitoring and alerting set up

### Launch Day
- [ ] Deploy to production
- [ ] Send invites to beta users
- [ ] Announce on social media
- [ ] Post on Product Hunt (optional)
- [ ] Monitor for issues
- [ ] Respond to user feedback

### Post-Launch (First Week)
- [ ] Daily check-ins with beta users
- [ ] Fix critical bugs immediately
- [ ] Collect feedback systematically
- [ ] Monitor metrics closely
- [ ] Iterate quickly

---

## 11. Conclusion

This MVP is designed to validate the core value proposition: **making it easy for anyone to create interactive, AI-powered books**. By focusing on essential features and excluding complexity, we can launch quickly, gather real user feedback, and iterate rapidly.

The inclusion of **GitHub integration** provides a powerful differentiator, appealing to technical users while maintaining simplicity for non-technical users. It also ensures users are never locked into the platform, building trust and encouraging adoption.

**Success Criteria**: If we achieve 100 beta users with 50+ published books and an NPS > 40 within 3 months of launch, we will have validated the MVP and can confidently move to Phase 2.

**Next Steps**:
1. Approve this MVP scope
2. Assemble development team
3. Set up infrastructure
4. Begin Phase 1 development
5. Launch beta in 4 months

