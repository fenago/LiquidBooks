/**
 * Avatar Research Configuration
 * Based on Eugene Schwartz's 5 Stages of Market Awareness
 *
 * Token-based approach: Ask about the OFFER, discover the AVATAR
 */

export type AwarenessStage =
  | 'unaware'
  | 'problem_aware'
  | 'solution_aware'
  | 'product_aware'
  | 'most_aware';

export interface AwarenessStageInfo {
  id: AwarenessStage;
  name: string;
  description: string;
  icon: string;
  characteristics: string[];
}

export const AWARENESS_STAGES: AwarenessStageInfo[] = [
  {
    id: 'unaware',
    name: 'Unaware',
    description: 'Doesn\'t know they have a problem',
    icon: '😴',
    characteristics: [
      'Completely unaware of the problem',
      'Needs education before they can be sold',
      'Focus on symptoms and pain points',
      'Requires story-based, indirect approach'
    ]
  },
  {
    id: 'problem_aware',
    name: 'Problem Aware',
    description: 'Knows they have a problem but not the solution',
    icon: '😟',
    characteristics: [
      'Feels the pain but doesn\'t know solutions exist',
      'Actively experiencing frustration',
      'Searching for answers',
      'Most receptive to education',
      'PRIMARY AUDIENCE - Your main target market'
    ]
  },
  {
    id: 'solution_aware',
    name: 'Solution Aware',
    description: 'Knows solutions exist but not your specific product',
    icon: '🤔',
    characteristics: [
      'Researching different approaches',
      'Comparing options',
      'Skeptical but hopeful',
      'Needs proof and differentiation'
    ]
  },
  {
    id: 'product_aware',
    name: 'Product Aware',
    description: 'Knows your product exists but hasn\'t purchased',
    icon: '🧐',
    characteristics: [
      'Aware of your solution',
      'Considering purchase',
      'Evaluating value vs. price',
      'Needs push to convert'
    ]
  },
  {
    id: 'most_aware',
    name: 'Most Aware',
    description: 'Knows your product and ready to buy',
    icon: '💡',
    characteristics: [
      'Ready to purchase',
      'Just needs the right offer',
      'Price-sensitive',
      'Urgency-driven'
    ]
  }
];

// NEW: Token-based Offer Questionnaire
// Ask about THEIR OFFER, not their audience!
export interface OfferQuestion {
  id: string;
  token: string; // The [TOKEN] that appears in the AI prompt
  question: string;
  placeholder: string;
  type: 'text' | 'textarea';
  helpText?: string;
  required: boolean;
}

export const OFFER_QUESTIONS: OfferQuestion[] = [
  {
    id: 'offer',
    token: '[OFFER]',
    question: 'What is your book/product about?',
    placeholder: 'e.g., "A comprehensive guide to mastering Python for data science"',
    type: 'textarea',
    helpText: 'Describe what you\'re creating. Be specific about the topic and approach.',
    required: true
  },
  {
    id: 'audience',
    token: '[audience]',
    question: 'Who is the general audience?',
    placeholder: 'e.g., "working professionals" or "aspiring entrepreneurs" or "busy parents"',
    type: 'text',
    helpText: 'Broad category - don\'t worry about being too specific yet. We\'ll discover the details!',
    required: true
  },
  {
    id: 'problem',
    token: '[problem]',
    question: 'What problem do they have?',
    placeholder: 'e.g., "struggling to transition into a data science career without a CS degree"',
    type: 'textarea',
    helpText: 'What pain point or challenge does your offer solve? What keeps them up at night?',
    required: true
  },
  {
    id: 'price_point',
    token: '[price point]',
    question: 'What\'s the price point?',
    placeholder: 'e.g., "free" or "$19" or "$99" or "$500" or "$2,500"',
    type: 'text',
    helpText: 'Rough price range or tier. This helps understand buyer psychology and commitment level.',
    required: true
  },
  {
    id: 'target_market',
    token: '[target market]',
    question: 'Who specifically is the target market?',
    placeholder: 'e.g., "mid-career professionals (30-45) looking to switch to tech with $75k+ income"',
    type: 'textarea',
    helpText: 'Get more specific about WHO will buy this. Age range, job type, income level, life stage, etc.',
    required: true
  },
  {
    id: 'benefit',
    token: '[benefit]',
    question: 'What benefit does it provide?',
    placeholder: 'e.g., "land a $120k+ data science job within 6 months without a CS degree"',
    type: 'textarea',
    helpText: 'What transformation or outcome will they achieve? Be specific and measurable.',
    required: true
  }
];

// Base prompt template with tokens that will be replaced
export const AVATAR_GENERATION_PROMPT_TEMPLATE = `Research five customer avatars for an offer about [OFFER].

The avatars will be based off of the Stages of Market Awareness as taught by Eugene Schwartz in his legendary book, Breakthrough Advertising.

## Context
- General Audience: [audience]
- Problem They Face: [problem]
- Price Point: [price point]
- Target Market: [target market]
- Benefit/Outcome: [benefit]

## Your Task
Create FIVE detailed customer avatars, one for each awareness stage:

### 1. UNAWARE Stage
They don't know they have a problem. Create an avatar who is experiencing the symptoms of [problem] but hasn't connected the dots yet. They're living their life unaware that [benefit] is even possible.

**Avatar Profile:**
- Name & demographic snapshot
- Daily life & current situation
- Hidden pain points they don't recognize
- What would make them suddenly aware
- Language/phrases they use
- Dominant emotions (hidden)
- 2-3 key psychological insights

### 2. PROBLEM AWARE Stage ⭐ PRIMARY AUDIENCE ⭐
They know they have [problem] and are actively searching for solutions. This is your MAIN target market!

**Avatar Profile:**
- Name & demographic snapshot
- How they discovered they have this problem
- Current frustration level & pain intensity
- What they've tried so far (and why it failed)
- Language/phrases they use to describe the problem
- Dominant negative emotions driving them
- What keeps them awake at night
- Secret fears and desires
- 5-7 key psychological insights

### 3. SOLUTION AWARE Stage
They know solutions exist for [problem] but don't know about your specific [OFFER] yet. They're comparing different approaches.

**Avatar Profile:**
- Name & demographic snapshot
- Solutions they're researching
- Why they haven't chosen one yet (skepticism, confusion, overwhelm)
- Decision criteria they're using
- Language/phrases they use
- Dominant emotions (hope mixed with doubt)
- 3-4 key psychological insights

### 4. PRODUCT AWARE Stage
They know your [OFFER] exists and are considering it, but haven't purchased yet at [price point].

**Avatar Profile:**
- Name & demographic snapshot
- How they discovered your offer
- What's holding them back from buying
- Objections they have about [price point]
- What would push them over the edge
- Language/phrases they use
- Dominant emotions (interest mixed with hesitation)
- 2-3 key psychological insights

### 5. MOST AWARE Stage
They know your [OFFER] intimately, understand [benefit], and are ready to buy at [price point]. They just need the right trigger.

**Avatar Profile:**
- Name & demographic snapshot
- Why they're so informed about your offer
- What final trigger will make them buy NOW
- Price sensitivity
- Urgency drivers
- Language/phrases they use
- Dominant emotions (urgency, FOMO, excitement)
- 2-3 key psychological insights

## Output Format
Return a JSON object with this structure:
{
  "unaware": { /* avatar object */ },
  "problem_aware": { /* avatar object */ },
  "solution_aware": { /* avatar object */ },
  "product_aware": { /* avatar object */ },
  "most_aware": { /* avatar object */ }
}

Each avatar object should have:
{
  "stage": "stage_name",
  "name": "Avatar Name",
  "tagline": "One-line description",
  "demographics": {
    "age_range": "",
    "occupation": "",
    "income": "",
    "life_stage": ""
  },
  "psychographics": {
    "situation": "Current life situation paragraph",
    "pain_points": ["list", "of", "pains"],
    "desires": ["list", "of", "desires"],
    "language": ["phrases", "they", "use"],
    "emotions": ["dominant", "emotions"]
  },
  "buyer_psychology": {
    "awareness_level": "What they know and don't know",
    "decision_triggers": ["what", "would", "make", "them", "act"],
    "objections": ["barriers", "to", "purchase"],
    "key_insights": ["deep", "psychological", "insights"]
  }
}

Remember:
- Make avatars feel REAL with specific details
- Use emotional, visceral language
- Focus extra detail on the PROBLEM AWARE avatar (your primary audience)
- Connect everything back to [problem], [benefit], and [target market]
- Write like a master copywriter who deeply understands human psychology`;

// Function to build the actual prompt by replacing tokens
export function buildAvatarPrompt(responses: Record<string, string>): string {
  let prompt = AVATAR_GENERATION_PROMPT_TEMPLATE;

  // Replace each token with the user's response
  OFFER_QUESTIONS.forEach(question => {
    const value = responses[question.id] || '';
    // Escape special regex characters in the token
    const tokenRegex = new RegExp(
      question.token.replace(/[[\]]/g, '\\$&'),
      'g'
    );
    prompt = prompt.replace(tokenRegex, value);
  });

  return prompt;
}

// Diary generation prompts (using avatar data)
export const DIARY_PROMPTS = {
  before: `You are a creative writer with deep insight into human psychology and emotion.

Write a DIARY ENTRY from the perspective of the Problem Aware customer avatar described below.

This is BEFORE they discovered the solution. They know they have the problem and are actively suffering from it.

**Requirements:**
- Write in first person ("I", "me", "my")
- Length: 400-600 words
- Focus on their DOMINANT NEGATIVE EMOTIONS
- Use visual, visceral, sensory language
- Make it raw, authentic, vulnerable
- Include specific details about their daily struggles
- Show their inner conflict and frustration
- Use the language and phrases they would actually use
- Make it feel like a REAL journal entry from a real person

**Tone:** Introspective, honest, emotionally vulnerable, frustrated, searching

Avatar Profile:
{AVATAR_PROFILE}

Product/Solution Context:
{PRODUCT_CONTEXT}

Write the diary entry now:`,

  during: `You are a creative writer with deep insight into human psychology and emotion.

Write a DIARY ENTRY from the perspective of the Problem Aware customer avatar described below.

This is DURING their first experience with the solution. They're in the early stages of transformation.

**Requirements:**
- Write in first person ("I", "me", "my")
- Length: 400-600 words
- Capture mixed emotions: hope, skepticism, curiosity, nervousness, cautious optimism
- Use visual, visceral, sensory language
- Make it raw, authentic, vulnerable
- Show their initial reactions and observations
- Include moments of doubt AND moments of possibility
- Use the language and phrases they would actually use
- Make it feel like a REAL journal entry from a real person

**Tone:** Cautiously optimistic, observant, emotionally honest, vulnerable, hopeful

Avatar Profile:
{AVATAR_PROFILE}

Product/Solution Context:
{PRODUCT_CONTEXT}

Write the diary entry now:`,

  after: `You are a creative writer with deep insight into human psychology and emotion.

Write a DIARY ENTRY from the perspective of the Problem Aware customer avatar described below.

This is AFTER experiencing the transformation from the solution. They've achieved the benefit.

**Requirements:**
- Write in first person ("I", "me", "my")
- Length: 400-600 words
- Focus on their DOMINANT POSITIVE EMOTIONS and transformation
- Use visual, visceral, sensory language
- Make it raw, authentic, vulnerable
- Show specific ways their life has changed
- Include reflection on their "before" state
- Express amazement at the transformation
- Show gratitude and newfound confidence
- Use the language and phrases they would actually use
- Make it feel like a REAL journal entry from a real person

**Tone:** Grateful, amazed, relieved, empowered, celebratory, reflective

Avatar Profile:
{AVATAR_PROFILE}

Product/Solution Context:
{PRODUCT_CONTEXT}

Write the diary entry now:`
};

// Landing Page Specification (using Problem Aware avatar + brand + diary)
export const LANDING_PAGE_SPEC_PROMPT = `You are a Senior Product Manager & UX Architect with expertise in high-converting landing pages and conversion rate optimization.

Your mission: Create a COMPREHENSIVE landing page specification document for a product/service targeting the Problem Aware audience.

This should be a complete PRD (Product Requirements Document) that a designer and developer could use to build a high-converting landing page.

## Context Provided:
- **Problem Aware Avatar**: Your PRIMARY audience (detailed profile)
- **Brand Identity**: Visual system, voice, tone, messaging
- **Journey Diary**: Emotional before/during/after states
- **Offer Details**: What you're selling and to whom

## Your Deliverable: Complete Landing Page Specification

### 1. CORE STRUCTURE OVERVIEW

**Page Purpose:** [One sentence]
**Target Audience:** [Problem Aware avatar name & key characteristics]
**Primary Goal:** [Conversion goal - demo request, purchase, signup, etc.]
**Secondary Goals:** [Newsletter signup, resource download, etc.]

### 2. ABOVE THE FOLD

**Navigation Bar:**
- Logo placement & description
- Primary navigation links (4-6 items)
- CTA button (text & style)
- Mobile hamburger menu behavior

**Hero Section:**
- **Layout:** Two-column (60/40 split) or centered
- **Headline:** Power headline (H1) addressing primary pain/desire
- **Subheadline:** 2-3 sentences explaining the promise
- **Primary CTA:** Button text, color (from brand palette), size
- **Secondary CTA:** Optional secondary action
- **Hero Visual:** Description of image/video (product screenshot, hero image, explainer video)
- **Trust Indicators:**
  - Social proof snippet ("Join 10,000+ [target audience]")
  - Logo bar (5-7 recognizable brands if applicable)
  - Key metric callout
- **Design Notes:** Color scheme, spacing, animation on scroll

### 3. PROBLEM / PAIN POINT SECTION

**Section Headline:** [Headline that resonates with problem awareness]
**Section Description:** [2-3 sentences agitating the pain]

**Pain Point Grid (3 columns):**

Pain Point 1:
- Icon suggestion
- Headline
- Description (2-3 sentences)
- Statistic (if applicable)

Pain Point 2:
- [Same structure]

Pain Point 3:
- [Same structure]

**Design Notes:** Card-based layout, hover effects, color accents

### 4. SOLUTION POSITIONING

**Section Headline:** [How your offer solves the problem]
**Narrative Copy:** [3-4 paragraphs explaining the unique mechanism]

**Before/After Visual:**
- Before state description (what life looks like now)
- Arrow/transition element
- After state description (transformed state)

**Key Differentiator Callout:** [What makes this unique - 1-2 sentences]

**Design Notes:** Split-screen or comparison visual

### 5. FEATURES & BENEFITS

**Section Headline:** [What you get]

**Feature Blocks (4-6 features, alternating left/right layout):**

Feature 1:
- Feature name
- Icon/image description
- Benefit-focused headline
- 2-3 sentence description (focus on outcome, not specs)
- Outcome metric (if applicable)
- Visual suggestion (screenshot, diagram, illustration)
- Layout: Image left, text right

Feature 2:
- [Same structure]
- Layout: Text left, image right

[Continue alternating...]

**Design Notes:** Generous whitespace, smooth scroll animations

### 6. HOW IT WORKS

**Section Headline:** [Simple process headline]

**Step-by-step Process (3-5 steps):**

Step 1:
- Step number/icon
- Step headline
- Description (1-2 sentences)
- Time estimate (if applicable)
- Visual suggestion

Step 2-5:
- [Same structure]

**Process Visual:** Timeline, flowchart, or numbered sequence
**CTA Below Process:** [Button text]

**Design Notes:** Clear visual progression, connected steps

### 7. SOCIAL PROOF / CASE STUDIES

**Section Headline:** [Results-focused headline]

**Featured Case Study (if applicable):**
- Company/person name & photo
- Industry/role
- Problem statement
- Solution implementation
- Results (3-5 key metrics)
- Quote (2-3 sentences)

**Testimonial Grid (6-9 testimonials):**
Each testimonial card:
- Customer photo
- Name & title
- Company (if B2B)
- Testimonial text (2-3 sentences)
- Result/metric (optional)

**Aggregate Metrics Bar:**
- Metric 1: [Number + description]
- Metric 2: [Number + description]
- Metric 3: [Number + description]

**Logo Wall:** [If applicable - customer/partner logos]

**Design Notes:** Cards with subtle shadows, ratings/stars if applicable

### 8. ROI CALCULATOR / INTERACTIVE TOOL (Optional)

**Section Headline:** [Calculate your potential ROI]

**Input Fields:**
- Field 1: [Label & default value]
- Field 2: [Label & default value]
- Field 3: [Label & default value]

**Calculation Display:**
- Potential savings/revenue
- Time saved
- ROI percentage
- Payback period

**Design Notes:** Real-time calculation, visual progress indicators

### 9. PRICING (if applicable)

**Section Headline:** [Pricing headline]

**Pricing Tiers (typically 3):**

Tier 1 (Basic):
- Tier name
- Price (monthly/annual)
- Target user description
- Key features list (5-7 items)
- CTA button text
- Best for tag (optional)

Tier 2 (Most Popular):
- [Same structure]
- "Most Popular" badge
- Highlighted/elevated design

Tier 3 (Premium):
- [Same structure]
- "Best Value" or similar badge

**Pricing FAQ (5-7 questions):**
- Q: [Common objection]
- A: [Response]

**Feature Comparison Table:**
[Optional detailed feature matrix]

**Design Notes:** Card-based, "Most Popular" tier emphasized

### 10. INTEGRATIONS & SECURITY (if applicable)

**Integrations Section:**
- Section headline
- Logo grid (12-20 integration logos)
- "See all integrations" link

**Security & Compliance:**
- Section headline
- Compliance badges (SOC 2, GDPR, HIPAA, etc.)
- Security feature callouts
- Trust seals

**Design Notes:** Clean grid layout, grayscale logos with color on hover

### 11. DEMO / VIDEO SECTION

**Section Headline:** [See it in action]

**Video Embed:**
- Video thumbnail description
- Play button overlay
- Video duration
- Optional: Chapter markers

**Supporting Context:**
- Pre-video text (what they'll see)
- Post-video CTA

**Alternative:** [If no video, describe alternative visual]

**Design Notes:** 16:9 aspect ratio, autoplay preferences

### 12. FINAL CTA SECTION

**High-Impact Closing:**
- Attention-grabbing headline (addresses final hesitation)
- Reinforcement copy (2-3 sentences)
- Risk reversal statement (guarantee, free trial, no credit card, etc.)
- Urgency element (limited spots, expires soon, etc.)

**Dual CTA Buttons:**
- Primary: [Button text] (large, primary brand color)
- Secondary: [Button text] (outlined or secondary color)

**Trust Reinforcement:**
- Money-back guarantee badge
- "No credit card required" if applicable
- Final social proof snippet

**Design Notes:** Full-width section, contrasting background color

### 13. FOOTER

**Multi-Column Layout:**

Column 1 - Company:
- Logo
- Tagline
- Social media icons
- Copyright

Column 2 - Product:
- Link 1
- Link 2
- Link 3
- Link 4

Column 3 - Resources:
- Link 1
- Link 2
- Link 3
- Link 4

Column 4 - Company:
- Link 1
- Link 2
- Link 3
- Link 4

Column 5 - Legal:
- Privacy Policy
- Terms of Service
- Cookie Policy

**Design Notes:** Dark background, subtle text, adequate spacing

### 14. DESIGN SYSTEM SPECIFICATIONS

**Color Palette:**
- Primary: [Hex from brand identity]
- Secondary: [Hex from brand identity]
- Accent: [Hex from brand identity]
- Background: [Hex]
- Text: [Hex]
- Border: [Hex]

**Typography:**
- H1: [Font, size, weight, line height]
- H2: [Font, size, weight, line height]
- H3: [Font, size, weight, line height]
- Body: [Font, size, weight, line height]
- CTA Button: [Font, size, weight]

**Spacing System:**
- Base unit: 8px
- Section padding: [value]
- Element margins: [values]
- Grid gutters: [value]

**Component Styles:**

Button Primary:
- Background color
- Text color
- Padding
- Border radius
- Hover state
- Active state

Button Secondary:
- [Same structure]

Card:
- Background
- Border
- Border radius
- Shadow
- Padding

Input Field:
- Height
- Border
- Border radius
- Focus state

**Animation/Interaction:**
- Scroll animations: [Fade in, slide up, etc.]
- Hover effects: [Scale, color shift, etc.]
- Transition timing: [150ms, 300ms, 500ms]
- Easing functions: [ease-in-out, etc.]

**Responsive Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px
- Wide: > 1440px

**Mobile Considerations:**
- Stack all columns vertically
- Full-width CTAs
- Simplified navigation (hamburger menu)
- Touch-friendly tap targets (44px minimum)
- Reduced animation complexity

### 15. CONVERSION OPTIMIZATION NOTES

**Key Conversion Points:**
1. Above-the-fold CTA
2. After problem section CTA
3. After features CTA
4. After social proof CTA
5. Pricing CTAs
6. Final CTA section

**A/B Testing Recommendations:**
- Test: [Headline variation 1 vs 2]
- Test: [CTA button text variation 1 vs 2]
- Test: [Pricing display variation]

**Tracking Requirements:**
- Scroll depth tracking
- CTA click tracking
- Form field interactions
- Video engagement
- Exit intent triggers

### 16. COPYWRITING NOTES

**Voice & Tone:** [From brand identity]
**Key Phrases to Use:** [From brand identity - 5-7 power phrases]
**Phrases to Avoid:** [From brand identity]
**Language Patterns:** [Use avatar's actual language from diary]

**Emotional Arc:**
- Above fold: [Emotion]
- Problem section: [Emotion]
- Solution section: [Emotion]
- Features: [Emotion]
- Social proof: [Emotion]
- Final CTA: [Emotion]

### 17. TECHNICAL REQUIREMENTS

**Performance:**
- Page load time: < 3 seconds
- Mobile load time: < 4 seconds
- Lighthouse score targets: 90+ across all categories

**SEO:**
- Meta title: [60 characters max]
- Meta description: [155 characters max]
- H1 tag: [Headline]
- Schema markup: [Product, Review, FAQ schemas]
- Image alt tags: [Descriptive alts]

**Accessibility:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader optimization
- Color contrast ratios: 4.5:1 minimum
- Focus indicators
- Aria labels

**Analytics Integration:**
- Google Analytics 4
- Heatmaps (Hotjar, etc.)
- Session recording
- Conversion tracking pixels

## Input Context:

**Problem Aware Avatar:**
{PROBLEM_AWARE_AVATAR}

**Brand Identity:**
{BRAND_IDENTITY}

**Journey Diary:**
{DIARY_ENTRIES}

**Offer Context:**
{OFFER_CONTEXT}

Create a complete, actionable landing page specification that a design and development team could use to build a high-converting page optimized for the Problem Aware audience.`;

// Brand Identity generation (using Problem Aware avatar + diary)
export const BRAND_IDENTITY_PROMPT = `You are a Brand & Design Syndicate - a collective of expert strategists:

**Brand Strategist**: Understands positioning, messaging, and market psychology
**UI/UX Designer**: Creates user-centered visual systems
**Content Architect**: Develops voice, tone, and narrative frameworks
**Copywriting Legend**: Masters emotional triggers and persuasion

Your mission: Create a COMPREHENSIVE brand identity system optimized for the Problem Aware avatar.

## Context Provided:
- **Problem Aware Avatar**: Your PRIMARY audience (detailed profile below)
- **Journey Diary Entries**: Before/During/After transformation
- **Offer Details**: What you're selling and to whom

## Your Deliverable:

### 1. BRAND POSITIONING
**Core Brand Promise:** One sentence that captures your unique value
**Positioning Statement:** 2-3 sentences explaining how you're different
**Brand Personality:** 5 specific traits (e.g., "Bold but approachable")
**Brand Archetype:** Primary archetype (Hero, Sage, Rebel, etc.) and why

### 2. VISUAL IDENTITY SYSTEM
**Primary Color Palette:**
- Color 1: [Hex code] - [Emotional meaning] - [Usage]
- Color 2: [Hex code] - [Emotional meaning] - [Usage]
- Color 3: [Hex code] - [Emotional meaning] - [Usage]
- Accent: [Hex code] - [Emotional meaning] - [Usage]

**Typography:**
- Headline Font: [Font name] - [Why it works]
- Body Font: [Font name] - [Why it works]
- Accent Font: [Font name] - [Why it works]

**Design System Principles:** 3-5 core principles
**Visual Style Keywords:** 5-7 words that define the look

### 3. MESSAGING FRAMEWORK
**Tagline Options:** 3 variations (7-12 words each)
**Elevator Pitch:** 2-3 sentences
**Key Messages:** 5 core messages you repeat everywhere
**Value Propositions by Stage:**
- Problem Aware (PRIMARY): Specific messaging
- Solution Aware: Specific messaging
- Product Aware: Specific messaging

### 4. VOICE & TONE GUIDELINES
**Voice Characteristics:** 5 traits (e.g., "Confident but not arrogant")
**Tone Variations:**
- When educating: [tone]
- When selling: [tone]
- When celebrating: [tone]
- When handling objections: [tone]

**Do's and Don'ts:**
- DO: [3-5 specific examples]
- DON'T: [3-5 specific examples]

**Example Phrases:** 10-15 phrases that sound like your brand

### 5. EMOTIONAL TRIGGERS
Based on the Problem Aware avatar's psychology:
- **Primary Pain Points to Address:** [3-5 specific pains]
- **Dominant Emotions to Tap Into:** [3-5 emotions]
- **Aspirational Identity:** [who they want to become]
- **Transformation Narrative:** [before → after story arc]

### 6. CONTENT STRATEGY
**Content Themes:** 5-7 themes to write about
**Content Formats:** Best formats for this audience
**Customer Journey Content Map:**
- Awareness Stage: [content types]
- Consideration Stage: [content types]
- Decision Stage: [content types]
- Post-Purchase: [content types]

### 7. MARKETING LANGUAGE
**Power Words:** 20-30 words that resonate with your avatar
**Phrases to Use:** 10-15 phrases pulled from diary entries
**Phrases to AVOID:** 5-10 phrases that would repel them

### 8. BRAND STORY FRAMEWORK
**Origin Story:** Why this exists (connect to avatar's pain)
**Mission Statement:** What you're trying to accomplish
**Hero's Journey Integration:** How customer is the hero
**Transformation Narrative Template:** [Before] → [Solution] → [After]

## Input Context:

**Problem Aware Avatar:**
{PROBLEM_AWARE_AVATAR}

**Journey Diary Entries:**
{DIARY_ENTRIES}

**Offer Context:**
{OFFER_CONTEXT}

Create a cohesive, emotionally resonant brand system that makes the Problem Aware avatar say "This is FOR ME!"`;

// Marketing Assets generation (using everything above)
export const MARKETING_ASSETS_PROMPT = `You are a Marketing Asset Creation Team with deep expertise in direct response copywriting, content marketing, and conversion optimization.

Your mission: Create a comprehensive marketing asset kit based on the Problem Aware avatar and brand identity.

## Context Provided:
- **Problem Aware Avatar**: Detailed customer profile
- **Brand Identity System**: Voice, tone, messaging, visuals
- **Journey Diary**: Emotional before/during/after states
- **Offer Details**: What you're selling and for how much

## Your Deliverable: Marketing Asset Kit

### 1. HEADLINE FORMULAS (20 options)
Create 20 headline variations using proven formulas:
- 5 "How to" headlines
- 5 Question headlines
- 5 Transformation headlines ("From X to Y")
- 5 Curiosity/Intrigue headlines

Each headline should:
- Speak directly to the Problem Aware avatar
- Use their language
- Address their primary pain or desire
- Be 10-15 words max

### 2. EMAIL SEQUENCES (3 sequences)

**Sequence A: Welcome/Indoctrination (5 emails)**
Email 1: [Subject line] - [Purpose] - [Key message]
Email 2: [Subject line] - [Purpose] - [Key message]
Email 3: [Subject line] - [Purpose] - [Key message]
Email 4: [Subject line] - [Purpose] - [Key message]
Email 5: [Subject line] - [Purpose] - [Key message]

**Sequence B: Educational/Nurture (5 emails)**
[Same format]

**Sequence C: Launch/Sales (5 emails)**
[Same format]

For EACH email, provide:
- Subject line (with preview text)
- Opening hook (first 2 sentences)
- Core message/value
- Call-to-action
- P.S. line

### 3. SOCIAL MEDIA CONTENT (30 posts)

**10 Problem-Focused Posts** (calling out the pain)
Format: Hook → Pain → Agitate → Tease solution
Platform-specific variations for: Instagram, Twitter/X, LinkedIn

**10 Solution-Focused Posts** (educating on possibilities)
Format: Myth-bust → Truth → Value → CTA
Platform-specific variations

**10 Transformation Posts** (social proof/results)
Format: Before → Journey → After → CTA
Platform-specific variations

### 4. AD COPY (10 variations)

**5 Facebook/Instagram Ads:**
- Headline (40 chars)
- Primary text (125 chars)
- Description (30 chars)
- CTA button text

**5 Google Search Ads:**
- Headline 1 (30 chars)
- Headline 2 (30 chars)
- Headline 3 (30 chars)
- Description 1 (90 chars)
- Description 2 (90 chars)

### 5. LANDING PAGE COPY FRAMEWORK

**Above the Fold:**
- Power headline
- Sub-headline
- Hero image description
- Primary CTA

**Problem Section:**
- Section headline
- 3-5 bullet points of pain
- Agitation paragraph

**Solution Section:**
- Section headline
- Unique mechanism explanation
- 3-5 benefit bullets

**How It Works:**
- 3-5 step process
- Each step with icon, headline, description

**Social Proof:**
- Testimonial framework (5 variations)
- Case study structure

**Offer Stack:**
- Main offer description
- Bonus 1-3 descriptions
- Total value breakdown
- Guarantee statement

**FAQ Section:**
- 10-15 common objections as Q&A

**Final CTA:**
- Urgency/scarcity element
- Risk reversal
- Clear next step

### 6. VIDEO SCRIPT OUTLINES (5 scripts)

**Script 1: Problem-Agitate (60 sec)**
**Script 2: Solution Explainer (90 sec)**
**Script 3: Origin Story (2 min)**
**Script 4: Testimonial Interview Framework (3 min)**
**Script 5: Launch/Sales Video (5 min)**

Each script includes:
- Hook (first 5 seconds)
- Key points with timing
- B-roll suggestions
- CTA placement

### 7. CONTENT PILLARS & TOPICS

**Content Pillar 1:** [Theme]
- 10 blog post titles
- 5 lead magnet ideas

**Content Pillar 2:** [Theme]
- 10 blog post titles
- 5 lead magnet ideas

**Content Pillar 3:** [Theme]
- 10 blog post titles
- 5 lead magnet ideas

### 8. CONVERSION ASSETS

**Lead Magnets (5 ideas):**
1. [Title] - [Format] - [Why avatar wants it]
2. [Title] - [Format] - [Why avatar wants it]
3. [Title] - [Format] - [Why avatar wants it]
4. [Title] - [Format] - [Why avatar wants it]
5. [Title] - [Format] - [Why avatar wants it]

**Tripwire Offer Ideas (3 concepts):**
Low-ticket offers to convert leads to buyers

**Webinar Outline:**
- Title & promise
- 3-part teaching framework
- Transition to offer
- Pitch structure
- Handling objections

### 9. LAUNCH CAMPAIGN STRUCTURE

**Pre-Launch (7 days):**
Daily content themes & assets

**Launch (5 days):**
Open cart strategy & content

**Post-Launch (3 days):**
Urgency/scarcity messaging

## Input Context:

**Problem Aware Avatar:**
{PROBLEM_AWARE_AVATAR}

**Brand Identity:**
{BRAND_IDENTITY}

**Journey Diary:**
{DIARY_ENTRIES}

**Offer Context:**
{OFFER_CONTEXT}

Create comprehensive, ready-to-use marketing assets that convert the Problem Aware avatar into customers.`;

// Helper function to get section info
export function getSectionInfo(sectionKey: string) {
  return {
    demographics: {
      title: 'Discover Your Audience',
      description: 'Answer these simple questions about your offer',
      icon: '🎯'
    }
  }[sectionKey] || {
    title: 'Questions',
    description: '',
    icon: '📝'
  };
}

// Helper to get all questions (now just offer questions)
export function getAllQuestions(): OfferQuestion[] {
  return OFFER_QUESTIONS;
}

// Helper to get prompts by category
export interface SystemPrompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: 'avatar' | 'diary' | 'brand' | 'landing_page' | 'marketing';
}

export const DEFAULT_SYSTEM_PROMPTS: SystemPrompt[] = [
  {
    id: 'avatar_generation',
    name: 'Generate 5 Customer Avatars',
    description: 'Creates all 5 awareness stage avatars from your offer information',
    category: 'avatar',
    prompt: AVATAR_GENERATION_PROMPT_TEMPLATE
  },
  {
    id: 'diary_before',
    name: 'Journey Diary - Before',
    description: 'First-person diary entry before discovering your solution',
    category: 'diary',
    prompt: DIARY_PROMPTS.before
  },
  {
    id: 'diary_during',
    name: 'Journey Diary - During',
    description: 'First-person diary entry during first experience',
    category: 'diary',
    prompt: DIARY_PROMPTS.during
  },
  {
    id: 'diary_after',
    name: 'Journey Diary - After',
    description: 'First-person diary entry after transformation',
    category: 'diary',
    prompt: DIARY_PROMPTS.after
  },
  {
    id: 'brand_identity',
    name: 'Brand Identity System',
    description: 'Complete brand system optimized for Problem Aware audience',
    category: 'brand',
    prompt: BRAND_IDENTITY_PROMPT
  },
  {
    id: 'landing_page_spec',
    name: 'Landing Page Specification',
    description: 'Complete PRD for a high-converting landing page',
    category: 'landing_page',
    prompt: LANDING_PAGE_SPEC_PROMPT
  },
  {
    id: 'marketing_assets',
    name: 'Marketing Asset Kit',
    description: 'Headlines, emails, social posts, ad copy, landing pages, and more',
    category: 'marketing',
    prompt: MARKETING_ASSETS_PROMPT
  }
];

export function getPromptsByCategory(category: 'avatar' | 'diary' | 'brand' | 'landing_page' | 'marketing'): SystemPrompt[] {
  return DEFAULT_SYSTEM_PROMPTS.filter(p => p.category === category);
}
