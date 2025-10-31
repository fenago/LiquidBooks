# LiquidBooks - Development TODO

## ✅ COMPLETED - Audience Research Feature (Token-Based Approach)

### Frontend Refactoring
- [x] Updated `avatarResearch.ts` - Replaced 60+ question questionnaire with 6 simple token-based questions about the OFFER
- [x] Added `OFFER_QUESTIONS` array (6 questions: offer, audience, problem, price_point, target_market, benefit)
- [x] Added `buildAvatarPrompt()` function for token replacement
- [x] Created `AVATAR_GENERATION_PROMPT_TEMPLATE` that generates all 5 awareness stage avatars
- [x] Added `DIARY_PROMPTS` (before/during/after)
- [x] Added `BRAND_IDENTITY_PROMPT` (8-section brand system)
- [x] Added `LANDING_PAGE_SPEC_PROMPT` (17-section PRD for landing page) ⭐ NEW
- [x] Added `MARKETING_ASSETS_PROMPT` (100+ marketing assets)
- [x] Updated `DEFAULT_SYSTEM_PROMPTS` array with all 6 categories
- [x] Fixed TypeScript interfaces to support 'landing_page' category

### UI Updates
- [x] Completely refactored `AudienceResearch.tsx`
- [x] Changed from multi-section questionnaire to single-page 6-question form
- [x] Added 5-tab interface: Questionnaire / Avatars / Diary / Brand / Landing Page / Marketing
- [x] Added "WOW Factor" messaging: "Get out of your own head"
- [x] Emphasized Problem Aware as PRIMARY audience
- [x] Added cascade generation flow: Avatars → Diary → Brand → Landing Page Spec → Marketing
- [x] Added individual export functions for each deliverable
- [x] Added "Export All" for complete package

### Navigation
- [x] Added `/audience` route in App.tsx
- [x] Added "Audience" navigation item with Users icon in Navigation.tsx

### Philosophy Changes
- [x] FROM: "Tell us about your audience" (requires self-knowledge)
- [x] TO: "Tell us about your OFFER" (AI discovers the audience)
- [x] Result: Removes bias, discovery-based approach, "wow factor"

## 🔄 IN PROGRESS - Backend API Endpoints

### Needed Backend Work
- [ ] Update `/api/ai/generate-avatar` endpoint to accept token-based prompt
- [ ] Ensure endpoint handles `awareness_stage: 'all'` to generate all 5 avatars
- [ ] Add `/api/ai/generate-landing-page-spec` endpoint
- [ ] Add `/api/ai/generate-marketing-assets` endpoint
- [ ] Update existing endpoints to work with new data structure

## 📋 NEXT STEPS - End-to-End Testing

### Test Plan: Complete Book Creation with Advanced Artifacts

**Goal**: Create one complete book from start to finish with all audience research artifacts.

### Test Flow:

#### 1. Audience Research (http://localhost:5173/audience)
- [ ] Fill out 6 offer questions
- [ ] Generate complete package
- [ ] Verify all 5 avatars generated
- [ ] Verify diary entries (before/during/after)
- [ ] Verify brand identity system
- [ ] Verify landing page specification ⭐ NEW
- [ ] Verify marketing assets kit
- [ ] Export complete package as markdown
- [ ] Review quality of generated content

#### 2. Book Planning (http://localhost:5173/create/plan)
- [ ] Create new book using insights from audience research
- [ ] Input book title, description, target audience (Problem Aware)
- [ ] Generate book outline with AI

#### 3. Outline Review (http://localhost:5173/create/outline)
- [ ] Review generated outline
- [ ] Edit book metadata (title, description, author)
- [ ] Verify "Features & Templates" tab is visible (2nd position)
- [ ] Select chapter templates
- [ ] Customize components per chapter
- [ ] Verify all changes persist

#### 4. Chapter Building (http://localhost:5173/create/chapters)
- [ ] Generate content for each chapter
- [ ] Verify per-chapter templates are applied
- [ ] Verify components (code blocks, math, etc.) work correctly
- [ ] Edit chapter content as needed

#### 5. Artifact Management (http://localhost:5173/create/artifacts)
- [ ] Create custom artifacts (diagrams, examples, etc.)
- [ ] Link artifacts to specific chapters
- [ ] Test artifact editing and preview

#### 6. Book Assembly (http://localhost:5173/create/assemble)
- [ ] Assemble all chapters in correct order
- [ ] Verify MyST markdown formatting
- [ ] Check cross-references and links
- [ ] Generate table of contents

#### 7. Publishing (http://localhost:5173/create/publish)
- [ ] Export to MyST markdown
- [ ] Export to Jupyter Book format
- [ ] Verify all components render correctly
- [ ] Check final book structure

## 🎯 Success Criteria for E2E Test

### Audience Research Module:
- ✅ 6 questions generate comprehensive research
- ✅ All 5 avatars are detailed and realistic
- ✅ Diary entries are emotional and authentic
- ✅ Brand identity is actionable and complete
- ✅ Landing page spec is PRD-quality ⭐ NEW
- ✅ Marketing assets are ready-to-use (100+ items)
- ✅ Exports work correctly
- ✅ Content quality is high enough to use in production

### Book Creation Flow:
- ✅ Book metadata is editable
- ✅ Templates are visible and customizable
- ✅ Per-chapter customization works
- ✅ Chapter content generation uses templates correctly
- ✅ Artifacts integrate smoothly
- ✅ Final export produces valid MyST markdown
- ✅ Published book renders correctly in Jupyter Book

## 📊 Deliverables from 6 Questions

### Complete Output:
1. **Customer Avatars** (All 5 Awareness Stages)
   - Unaware, Problem Aware ⭐, Solution Aware, Product Aware, Most Aware
   - Each with demographics, psychographics, buyer psychology, key insights

2. **Customer Journey Diary** (3 entries, 400-600 words each)
   - Before: Struggling with problem
   - During: First experience with solution
   - After: Life after transformation

3. **Brand Identity System** (8 sections)
   - Brand Positioning
   - Visual Identity (colors, typography, design system)
   - Messaging Framework
   - Voice & Tone Guidelines
   - Emotional Triggers
   - Content Strategy
   - Marketing Language
   - Brand Story Framework

4. **Landing Page Specification** (17 sections) ⭐ NEW
   - Core Structure Overview
   - Above the Fold (nav + hero)
   - Problem/Pain Point Section
   - Solution Positioning
   - Features & Benefits
   - How It Works
   - Social Proof/Case Studies
   - ROI Calculator
   - Pricing
   - Integrations & Security
   - Demo/Video Section
   - Final CTA Section
   - Footer
   - Design System Specifications
   - Conversion Optimization Notes
   - Copywriting Notes
   - Technical Requirements

5. **Marketing Assets Kit** (100+ items)
   - 20 Headlines (4 types)
   - 15 Emails (3 sequences of 5 each)
   - 30 Social Posts (Instagram, Twitter, LinkedIn)
   - 10 Ad Copy Variations (Facebook + Google)
   - Complete Landing Page Copy Framework
   - 5 Video Script Outlines
   - 45 Content Ideas (3 pillars × 15)
   - 5 Lead Magnets
   - 3 Tripwire Offers
   - Webinar Outline
   - Launch Campaign (Pre/Launch/Post)

## 🐛 Known Issues

- [ ] Backend endpoints need updating for new data structure
- [ ] Frontend calls to `/api/ai/generate-marketing-assets` will fail until endpoint is created
- [ ] Landing Page Spec endpoint doesn't exist yet
- [ ] Need to test full generation flow with real OpenAI API

## 🔧 Technical Debt

- [ ] Add error handling for failed API calls
- [ ] Add loading states for each generation step
- [ ] Add ability to regenerate individual sections
- [ ] Add ability to edit generated content inline
- [ ] Add ability to save/load questionnaire responses
- [ ] Add progress persistence (resume if page refreshes)

## 💡 Future Enhancements

- [ ] Add more avatar types (B2C, B2B, eCommerce, SaaS, etc.)
- [ ] Add industry-specific templates
- [ ] Add A/B testing recommendations
- [ ] Add conversion funnel visualization
- [ ] Add competitor analysis section
- [ ] Add pricing psychology recommendations
- [ ] Add SEO content strategy
- [ ] Add social media calendar
- [ ] Add email automation sequences
- [ ] Add sales script templates

## 📝 Notes

**Key Philosophy**:
- Users don't need to know their audience in advance
- 6 simple questions about THEIR OFFER
- AI discovers the perfect customer avatar FROM offer info
- "Get out of your own head" - removes bias
- Discovery-based, not self-reporting
- Creates "wow factor" when they see their avatar revealed

**Generation Order**:
1. Avatars (all 5, emphasize Problem Aware)
2. Diary (using Problem Aware avatar)
3. Brand (using Problem Aware + diary)
4. Landing Page Spec (using Problem Aware + brand + diary) ⭐
5. Marketing (using everything above)

**Export Options**:
- Individual: Each deliverable separately
- Complete Package: All in one markdown file with table of contents

---

## 🚀 NEXT IMMEDIATE ACTION

**Run End-to-End Test** to verify:
1. Audience research generation works from start to finish
2. Book creation flow works with all customization options
3. All artifacts export correctly
4. Content quality is production-ready

**Test URL**: http://localhost:5173/audience

**Backend Status**: Need to verify/update endpoints for new structure
