# Product Requirements Document: AI-Powered Liquid Book Platform

**Author**: Manus AI
**Version**: 2.0 (Updated)
**Date**: October 25, 2025

## 1. Executive Summary

This document outlines the product requirements for an innovative, AI-powered platform designed for the creation of "liquid books"—dynamic, interactive, and adaptable digital documents that can range from simple articles to multi-chapter technical textbooks. The platform leverages **Jupyter Book** as its core rendering engine while providing **complete end-to-end content creation** capabilities, including text, executable code, diagrams, images, videos, and interactive assessments.

The platform's defining characteristic is its **dual-path approach**: users can choose to let AI drive the entire process, work entirely manually, or blend both approaches seamlessly. The architecture is **provider-agnostic**, supporting multiple AI providers (OpenRouter, Together.AI, Anthropic, OpenAI, etc.) to ensure flexibility, cost optimization, and future-proofing.

## 2. Vision and Goals

### 2.1. Product Vision

To become the leading platform for creating and consuming next-generation digital books, where content is interactive, intelligent, and perpetually evolving. We aim to empower creators of all technical skill levels to build rich, engaging, and effective learning and reading experiences with **complete creative freedom** and **AI assistance at every step**.

### 2.2. Business Goals

- **Democratize Interactive Content Creation**: Make it possible for anyone, from elementary teachers to PhD researchers, to create professional, interactive books
- **Establish Market Leadership**: Position as the definitive tool for AI-assisted interactive content creation
- **Build a Sustainable Business**: Implement a freemium model with clear value differentiation
- **Foster an Ecosystem**: Create a marketplace for templates, themes, and extensions
- **Ensure Long-Term Viability**: Avoid vendor lock-in through provider-agnostic architecture

### 2.3. User Goals

- **Simplify Creation**: Enable users to create complex, interactive books with minimal technical expertise
- **Provide Choice**: Support both AI-driven and manual workflows, allowing users to choose their level of AI involvement
- **Enable Complete Expression**: Support all content types (text, code, diagrams, images, videos) in a single platform
- **Ensure Quality**: Deliver professional, publication-ready output
- **Promote Reproducibility**: Allow technical authors to create fully reproducible research and documentation

## 3. Core Principles

### 3.1. AI-First, But Always Optional

Every feature offers both AI-assisted and manual modes. Users are never forced to use AI, but it's always available when needed.

### 3.2. Provider Agnostic

The platform supports multiple AI providers and can easily add new ones. Users can switch providers based on cost, quality, or feature availability.

### 3.3. Complete Media Support

The platform natively supports text, code, diagrams, images, videos, and interactive elements—everything needed for modern digital books.

### 3.4. Built on Open Standards

Leveraging Jupyter Book, MyST Markdown, and Sphinx ensures compatibility with the broader ecosystem and avoids proprietary lock-in.

## 4. User Personas

| Persona | Role | Technical Proficiency | Primary Goal | Preferred Workflow |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah** | Elementary Educator | Basic | Create simple, interactive storybooks with pictures and quizzes | Full AI |
| **Dr. Martinez** | PhD Physics Researcher | Advanced | Author reproducible research papers with executable code and equations | Manual with optional AI |
| **Alex** | Online Course Creator | Intermediate | Develop interactive course materials with video and assessments | AI-Assisted |
| **Jamie** | Fiction Author | Basic | Write and publish novels with clean formatting | AI-Assisted |
| **Taylor** | Technical Writer | Intermediate | Create software documentation with code examples | AI-Assisted |

## 5. Product Features & Requirements

### 5.1. Core Platform Features

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-1.1** | AI-Powered Book Wizard | ✅ Suggests structure | ✅ User defines | Must-Have |
| **F-1.2** | Project Dashboard | N/A | ✅ Manage projects | Must-Have |
| **F-1.3** | Template Gallery | ✅ AI recommends | ✅ Browse/select | Must-Have |
| **F-1.4** | Multi-Provider AI | ✅ Switch providers | ✅ Configure | Must-Have |
| **F-1.5** | User Authentication | N/A | ✅ Sign up/login | Must-Have |

### 5.2. Content Creation & Editing

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-2.1** | AI First Draft Generation | ✅ Full chapter | N/A | Must-Have |
| **F-2.2** | AI Writing Assistant | ✅ Inline help | ✅ On-demand | Must-Have |
| **F-2.3** | Multi-Mode Editor | N/A | ✅ Visual/Markdown/Notebook | Must-Have |
| **F-2.4** | System & Chapter Prompts | ✅ AI suggests | ✅ User writes | High |
| **F-2.5** | Chapter Management | ✅ AI reorders | ✅ Drag-and-drop | Must-Have |
| **F-2.6** | Real-Time Preview | N/A | ✅ Live preview | Must-Have |
| **F-2.7** | Version History | N/A | ✅ Track changes | High |

### 5.3. Code & Technical Content

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-3.1** | Multi-Language Code Support | N/A | ✅ 100+ languages | Must-Have |
| **F-3.2** | AI Code Generation | ✅ Generate code | N/A | Must-Have |
| **F-3.3** | Live Code Execution (Thebe) | N/A | ✅ Enable/disable | High |
| **F-3.4** | Code Explanation | ✅ AI explains | N/A | High |
| **F-3.5** | Syntax Highlighting | N/A | ✅ Automatic | Must-Have |

### 5.4. Diagrams & Visualizations

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-4.1** | AI Diagram Generation | ✅ Text-to-diagram | N/A | High |
| **F-4.2** | Mermaid Support | ✅ AI generates | ✅ Manual coding | Must-Have |
| **F-4.3** | Graphviz Support | ✅ AI generates | ✅ Manual coding | High |
| **F-4.4** | Interactive Plots | ✅ AI generates | ✅ Manual coding | High |
| **F-4.5** | Data Visualization | ✅ AI suggests | ✅ Manual creation | High |

### 5.5. Image Generation & Management

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-5.1** | AI Image Generation | ✅ Text-to-image | N/A | Must-Have |
| **F-5.2** | Image Upload | N/A | ✅ Upload files | Must-Have |
| **F-5.3** | Image Editing | ✅ AI-powered | ✅ Manual tools | High |
| **F-5.4** | Image Optimization | ✅ Auto-optimize | N/A | Must-Have |
| **F-5.5** | Alt Text Generation | ✅ AI generates | ✅ Manual entry | Must-Have |
| **F-5.6** | Image Style Consistency | ✅ AI maintains | N/A | Should-Have |

### 5.6. Video Generation & Integration

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-6.1** | AI Video Generation | ✅ Text-to-video | N/A | Should-Have |
| **F-6.2** | Video Upload | N/A | ✅ Upload files | Must-Have |
| **F-6.3** | Video Embedding | N/A | ✅ YouTube/Vimeo | Must-Have |
| **F-6.4** | Video Transcription | ✅ AI transcribes | N/A | High |
| **F-6.5** | Video Captions | ✅ AI generates | ✅ Manual entry | High |
| **F-6.6** | Image-to-Video | ✅ AI animates | N/A | Could-Have |

### 5.7. Mathematical & Scientific Content

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-7.1** | LaTeX Equation Support | ✅ AI generates | ✅ Manual entry | Must-Have |
| **F-7.2** | Equation Editor | N/A | ✅ Visual editor | High |
| **F-7.3** | Citation Management | ✅ AI suggests | ✅ Manual entry | High |
| **F-7.4** | Reference Formatting | ✅ AI formats | ✅ Manual selection | High |

### 5.8. Interactive Assessments

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-8.1** | AI Question Generation | ✅ Generate from content | N/A | Must-Have |
| **F-8.2** | Self-Assessment Quizzes | ✅ AI creates | ✅ Manual creation | Must-Have |
| **F-8.3** | Code Challenges | ✅ AI generates | ✅ Manual creation | Should-Have |
| **F-8.4** | Auto-Grading | ✅ AI grades | N/A | Should-Have |
| **F-8.5** | Feedback Generation | ✅ AI provides | ✅ Manual entry | High |
| **F-8.6** | Analytics Dashboard | N/A | ✅ View results | High |

### 5.9. Publishing & Distribution

| ID | Feature | AI-Driven | Manual | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **F-9.1** | One-Click Publishing | N/A | ✅ Deploy | Must-Have |
| **F-9.2** | Multiple Export Formats | ✅ AI optimizes | ✅ Manual settings | Must-Have |
| **F-9.3** | Custom Domains | N/A | ✅ Configure | High |
| **F-9.4** | SEO Optimization | ✅ AI generates | ✅ Manual entry | High |
| **F-9.5** | Version Control | N/A | ✅ Git integration | Should-Have |

## 6. Multi-Provider AI Architecture

### 6.1. Supported AI Providers

The platform integrates with multiple AI providers to ensure flexibility and avoid vendor lock-in:

| Provider | Capabilities | Primary Use Cases |
| :--- | :--- | :--- |
| **OpenRouter** | Text, code, images (400+ models) | Primary aggregator, multi-model access |
| **Together.AI** | Text, code, open-source models | Cost-effective alternative |
| **Anthropic Claude** | Text, advanced reasoning | Complex content, long context |
| **OpenAI** | Text (GPT-4), images (DALL-E), audio | High-quality generation |
| **Stability AI** | Images (Stable Diffusion), video | Custom image generation |
| **Runway ML** | Video generation, image-to-video | Professional video content |
| **Replicate** | Open-source models, custom deployments | Specialized models |

### 6.2. Provider Selection Strategy

- **User Preference**: Users set default providers for different tasks
- **Task-Based Routing**: Automatic routing to optimal providers
- **Fallback System**: Automatic failover if primary provider unavailable
- **Cost Optimization**: Route to most cost-effective provider
- **Quality Settings**: Users choose speed vs. quality tradeoffs

### 6.3. Provider Abstraction

The backend implements a unified interface that abstracts provider-specific APIs, making it easy to add new providers without changing application code.

## 7. Technical Architecture

### 7.1. Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18+ with TypeScript | User interface |
| **Backend** | Python 3.11+ with FastAPI | API and business logic |
| **Database** | Supabase (PostgreSQL) | Data storage |
| **Authentication** | Supabase Auth | User management |
| **Storage** | Supabase Storage | Media files |
| **Book Engine** | Jupyter Book 2.0 | Static site generation |
| **AI Integration** | OpenRouter (primary) | Multi-provider AI access |
| **Task Queue** | Celery + Redis | Background jobs |
| **Deployment** | Vercel/Netlify (frontend), Railway/Render (backend) | Hosting |

### 7.2. System Architecture

```
┌─────────────────────────────────────────────────┐
│           React Frontend (SPA)                  │
│  - Dashboard & Project Management              │
│  - AI-Powered Book Wizard                      │
│  - Multi-Mode Content Editor                   │
│  - Media Management                            │
│  - Preview System                              │
└────────────────────┬────────────────────────────┘
                     │ REST API / WebSocket
                     ▼
┌─────────────────────────────────────────────────┐
│         Python Backend (FastAPI)                │
│  - API Endpoints                                │
│  - Multi-Provider AI Service                    │
│  - Jupyter Book Builder                         │
│  - Content Management                           │
│  - Media Processing                             │
│  - Background Task Queue                        │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              Supabase Backend                   │
│  - PostgreSQL Database                          │
│  - Authentication Service                       │
│  - Storage (Images, Videos, Assets)             │
│  - Real-time Subscriptions                      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Multi-Provider AI Layer                 │
│  - OpenRouter (primary)                         │
│  - Together.AI, Anthropic, OpenAI               │
│  - Stability AI, Runway ML, Replicate           │
│  - Unified abstraction layer                    │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         Jupyter Book Build System               │
│  - MyST Parser                                  │
│  - Sphinx Build Engine                          │
│  - Extensions (Thebe, JupyterQuiz, etc.)        │
│  - Static HTML/CSS/JS Output                    │
└─────────────────────────────────────────────────┘
```

## 8. Non-Functional Requirements

| Category | Requirement |
| :--- | :--- |
| **Performance** | - Page load < 2 seconds
- AI response < 3 seconds for text
- AI response < 30 seconds for images
- AI response < 2 minutes for videos
- Book build < 30 seconds (quick preview)
- Book build < 5 minutes (full build) |
| **Scalability** | - Support 10,000 concurrent users
- Handle 1,000 simultaneous book builds
- Auto-scaling for AI requests
- CDN for static content delivery |
| **Usability** | - Non-technical users can publish in < 30 minutes
- Contextual help throughout
- Keyboard shortcuts for power users
- Mobile-responsive interface |
| **Accessibility** | - WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode
- Generated books also accessible |
| **Security** | - Data encrypted at rest and in transit
- Row-level security in database
- API rate limiting
- Code execution in sandboxed environments
- Regular security audits |
| **Reliability** | - 99.9% uptime SLA
- Automatic failover for AI providers
- Data backup and recovery
- Error logging and monitoring |
| **Extensibility** | - Plugin system for custom extensions
- API for third-party integrations
- Support for custom Sphinx extensions |

## 9. User Workflows

### 9.1. Full AI Workflow (20 minutes)

1. Describe book idea
2. AI generates structure
3. AI generates all content
4. AI generates media (images, diagrams)
5. AI generates assessments
6. Review and approve
7. Publish

### 9.2. AI-Assisted Workflow (2-4 hours)

1. Define structure manually
2. AI generates first drafts
3. User edits and refines
4. Mix of AI-generated and manual media
5. AI-assisted assessments
6. Review and polish
7. Publish

### 9.3. Manual Workflow (Days/Weeks)

1. Create project from scratch
2. Write all content manually
3. Create/upload all media
4. Build assessments manually
5. Optional AI assistance for specific tasks
6. Extensive review
7. Publish

## 10. Success Metrics

### 10.1. User Acquisition
- 10,000 registered users in Year 1
- 50,000 registered users in Year 2
- 20% month-over-month growth

### 10.2. Engagement
- 60% monthly active user rate
- Average 3 books per active user
- 40% of users publish at least one book

### 10.3. Conversion
- 5% free-to-paid conversion rate
- $25 average revenue per paying user
- 80% annual retention rate

### 10.4. Content Creation
- 1,000 published books in Year 1
- 10,000 published books in Year 2
- Average book completion time: 4 hours

### 10.5. Quality
- NPS score > 50
- 4.5+ star average rating
- < 5% churn rate

## 11. Development Roadmap

### Phase 1: MVP (3-4 months)
- Core editor with AI writing assistance
- Basic Jupyter Book integration
- JupyterQuiz for assessments
- OpenRouter integration (text + images)
- User authentication and project management
- Simple publishing workflow
- **Target**: 100 beta users, 50 published books

### Phase 2: Enhanced Features (3-4 months)
- Multi-language code execution
- Thebe integration for live code
- Diagram generation (Mermaid, Graphviz)
- Video upload and embedding
- Tracked assessments with analytics
- Template marketplace
- Advanced export options (PDF, EPUB)
- **Target**: 1,000 users, 500 published books

### Phase 3: Advanced Capabilities (4-6 months)
- Video generation integration (Runway ML)
- Auto-graded code challenges
- Real-time collaboration
- Advanced analytics dashboard
- Multiple AI provider support
- Monetization tools
- Custom domain support
- **Target**: 10,000 users, 5,000 published books

### Phase 4: Enterprise & Scale (6+ months)
- nbgrader integration for institutions
- SSO and team management
- White-label solutions
- Advanced customization
- API for third-party integrations
- Mobile app (iOS/Android)
- **Target**: 50,000 users, enterprise customers

## 12. Business Model

### 12.1. Pricing Tiers

| Tier | Price | Features |
| :--- | :--- | :--- |
| **Free** | $0 | - 3 books
- Public books only
- Community templates
- Basic AI (limited tokens)
- Standard export formats |
| **Pro** | $20/month | - Unlimited books
- Private books
- Custom domains
- Advanced AI (higher limits)
- Priority support
- Advanced analytics
- All export formats |
| **Team** | $75/month | - Everything in Pro
- 5 team members
- Collaboration features
- Team management
- Shared templates
- SSO (optional) |
| **Enterprise** | Custom | - Everything in Team
- Unlimited team members
- nbgrader integration
- White-label option
- Dedicated support
- Custom SLA
- On-premise option |

### 12.2. Revenue Streams

1. **Subscription fees** (primary revenue)
2. **Marketplace commission** (15% on template/theme sales)
3. **Premium AI credits** (pay-as-you-go for heavy users)
4. **Enterprise licenses** (annual contracts)
5. **Professional services** (custom development, training)

## 13. Risk Mitigation

| Risk | Impact | Likelihood | Mitigation |
| :--- | :--- | :--- | :--- |
| **AI costs exceed projections** | High | Medium | - Tiered usage limits
- Optimize prompts
- Multi-provider strategy
- Consider open-source models |
| **Jupyter Book complexity** | Medium | Medium | - Extensive templates
- Hide technical details
- Managed build service
- Comprehensive documentation |
| **Competition** | High | High | - Focus on AI integration
- Superior UX
- Open-source foundation
- Community building |
| **Scaling challenges** | High | Low | - Cloud-native architecture
- Auto-scaling
- Efficient caching
- Optimized build pipeline |
| **Provider lock-in** | Medium | Low | - Multi-provider architecture
- Abstraction layer
- Regular provider evaluation |

## 14. Conclusion

The AI-Powered Liquid Book Platform represents a significant opportunity to transform digital publishing and educational content creation. By combining the proven capabilities of Jupyter Book with multi-provider AI assistance, complete media support, and an intuitive user interface, we can democratize the creation of interactive, engaging, and computationally rich content.

The platform's architecture is designed for flexibility, avoiding vendor lock-in while providing users with choice in how they create content. Whether using full AI automation, manual creation, or a blend of both, users have the tools they need to bring their ideas to life.

With a clear development roadmap, sustainable business model, and focus on user needs, this platform is positioned to become the definitive tool for next-generation digital book creation.

