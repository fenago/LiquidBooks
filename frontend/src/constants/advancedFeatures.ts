/**
 * Advanced Features Configuration for LiquidBooks
 *
 * Toggleable enhancements inspired by proven book writing methodologies
 */

export interface AdvancedFeature {
  id: string;
  name: string;
  category: 'outline' | 'chapter' | 'content' | 'visual';
  description: string;
  longDescription: string;
  benefits: string[];
  enabled: boolean;
  requiresInput?: boolean;
  inputPrompt?: string;
  icon?: string;
  tags?: string[];
}

export const ADVANCED_FEATURES: AdvancedFeature[] = [
  // OUTLINE GENERATION ENHANCEMENTS
  {
    id: 'transformation_blueprint',
    name: 'Transformation Blueprint',
    category: 'outline',
    description: 'Map reader journey from current to desired state with explicit before/after analysis',
    longDescription: 'Creates a comprehensive transformation map showing exactly where readers start (beliefs, frustrations, knowledge gaps) and where they\'ll end up (new capabilities, mindset shifts, achievements). Includes emotional journey arc and key belief shifts.',
    benefits: [
      'Creates clear reader transformation goals',
      'Designs intentional emotional progression',
      'Identifies specific belief shifts to achieve',
      'Makes book purpose crystal clear'
    ],
    enabled: true,
    icon: '🎯',
    tags: ['transformation', 'psychology', 'engagement']
  },
  {
    id: 'narrative_cohesion',
    name: 'Narrative Arc Design',
    category: 'outline',
    description: 'Design book as unified story journey instead of disconnected topics',
    longDescription: 'Creates an overarching narrative that connects all chapters into a cohesive story. Each chapter becomes part of a larger journey with momentum, curiosity hooks, and dramatic progression.',
    benefits: [
      'Creates page-turner momentum',
      'Prevents reader dropout',
      'Makes complex topics engaging',
      'Builds emotional investment'
    ],
    enabled: true,
    icon: '📖',
    tags: ['storytelling', 'engagement', 'retention']
  },
  {
    id: 'emotional_tracking',
    name: 'Emotional State Tracking',
    category: 'outline',
    description: 'Track reader emotional progression through each chapter',
    longDescription: 'Explicitly maps emotional state at the start and end of each chapter. Designs intentional emotional shifts (confusion → clarity, fear → confidence) that create transformation.',
    benefits: [
      'Designs intentional emotional shifts',
      'Creates confidence-building progression',
      'Prevents reader overwhelm',
      'Maintains engagement momentum'
    ],
    enabled: true,
    icon: '💫',
    tags: ['psychology', 'engagement', 'transformation']
  },
  {
    id: 'chapter_continuity',
    name: 'Enhanced Chapter Continuity',
    category: 'outline',
    description: 'Explicit connections showing how each chapter builds on previous and sets up next',
    longDescription: 'Creates clear knowledge flow between chapters with prerequisite tracking, narrative threads, and logical progression. Ensures no concept feels isolated or random.',
    benefits: [
      'Creates logical knowledge progression',
      'Builds cumulative understanding',
      'Prevents chapter isolation',
      'Maintains narrative momentum'
    ],
    enabled: true,
    icon: '🔗',
    tags: ['structure', 'learning', 'flow']
  },

  // AVATAR & AUDIENCE ENHANCEMENTS
  {
    id: 'avatar_research',
    name: 'Avatar Research Phase',
    category: 'outline',
    description: 'Generate detailed reader personas based on market awareness stages',
    longDescription: 'Creates 3-5 detailed customer avatars based on Eugene Schwartz\'s awareness stages (Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware). Each avatar includes demographics, psychographics, pain points, emotional drivers, and buying behavior.',
    benefits: [
      'Deeply understand target readers',
      'Tailor content to awareness level',
      'Address specific pain points',
      'Create resonant language and examples'
    ],
    enabled: false,
    requiresInput: true,
    inputPrompt: 'Describe your ideal reader: who they are, what they struggle with, what they want to achieve',
    icon: '👥',
    tags: ['audience', 'targeting', 'marketing']
  },
  {
    id: 'avatar_diary',
    name: 'Avatar Diary Entries',
    category: 'content',
    description: 'Generate emotional diary entries from your avatar\'s perspective',
    longDescription: 'Creates three visceral diary entries: (1) Before reading - raw frustration and struggle, (2) During reading - skepticism giving way to hope, (3) After reading - transformation and gratitude. Uses visual, emotional language to validate design.',
    benefits: [
      'Validates content resonates emotionally',
      'Reveals language readers actually use',
      'Tests transformation authenticity',
      'Creates empathy-driven content'
    ],
    enabled: false,
    icon: '📔',
    tags: ['empathy', 'validation', 'psychology']
  },

  // CHAPTER TEMPLATE ENHANCEMENTS
  {
    id: 'persuasive_learning',
    name: 'Persuasive Learning Template',
    category: 'chapter',
    description: '5-phase psychological framework: Pre-suasion → Engagement → Teaching → Application → Momentum',
    longDescription: 'Advanced chapter template integrating proven persuasion principles from Cialdini, Halbert, Hopkins, and Brunson. Each chapter follows: (1) Pre-Suasion Setup with authority and value, (2) Emotional Engagement with story, (3) Logical Teaching with proof, (4) Application Bridge with examples, (5) Momentum Maintenance with curiosity hooks.',
    benefits: [
      'Creates psychological readiness to learn',
      'Builds trust through story and emotion',
      'Teaches with proof and logic',
      'Drives action through application',
      'Maintains reading momentum'
    ],
    enabled: false,
    icon: '🧠',
    tags: ['psychology', 'persuasion', 'engagement']
  },
  {
    id: 'belief_bridge',
    name: 'Belief Bridge Storytelling',
    category: 'chapter',
    description: 'Lead readers from false belief → story → new concept using epiphany bridge',
    longDescription: 'Russell Brunson\'s epiphany bridge technique: identify false belief, destroy it with compelling story, introduce correct understanding. Creates "aha moments" that stick.',
    benefits: [
      'Overcomes reader resistance',
      'Creates memorable insights',
      'Challenges assumptions effectively',
      'Builds new mental models'
    ],
    enabled: false,
    icon: '🌉',
    tags: ['storytelling', 'persuasion', 'transformation']
  },
  {
    id: 'slippery_slope',
    name: 'Slippery Slope Sequences',
    category: 'chapter',
    description: 'Joseph Sugarman\'s technique where each sentence compels reading the next',
    longDescription: 'Creates irresistible flow where readers can\'t stop. Each idea leads naturally to the next with curiosity gaps, emotional hooks, and strategic information revelation.',
    benefits: [
      'Creates page-turner quality',
      'Prevents reader dropout',
      'Maintains engagement',
      'Feels effortless to read'
    ],
    enabled: false,
    icon: '⛷️',
    tags: ['engagement', 'flow', 'copywriting']
  },

  // HERO'S JOURNEY & PERSONAL STORY
  {
    id: 'hero_journey',
    name: 'Hero\'s Journey Integration',
    category: 'content',
    description: 'Add your personal "aha moment" story to create authentic connection',
    longDescription: 'Share your breakthrough moment: the setup, the obstacle, the turning point, the new solution, the emotional impact. Creates authority through vulnerability and transformation.',
    benefits: [
      'Establishes authentic authority',
      'Creates emotional connection',
      'Shows transformation is possible',
      'Makes content relatable and human'
    ],
    enabled: false,
    requiresInput: true,
    inputPrompt: 'Share your "aha moment" story: what problem you faced, what breakthrough you had, how it changed everything',
    icon: '🦸',
    tags: ['storytelling', 'authority', 'connection']
  },
  {
    id: 'origin_story',
    name: 'Origin Story Setup',
    category: 'content',
    description: 'First-person narrative explaining why you created this methodology',
    longDescription: 'Compelling opening that shows why this book exists. Shares your frustration with existing solutions, your discovery process, and why this approach is different.',
    benefits: [
      'Establishes credibility and motivation',
      'Creates narrative investment',
      'Differentiates from competitors',
      'Builds trust through transparency'
    ],
    enabled: false,
    requiresInput: true,
    inputPrompt: 'Why did you create this methodology? What was broken with existing approaches?',
    icon: '⭐',
    tags: ['storytelling', 'authority', 'differentiation']
  },

  // REVIEW & REFINEMENT
  {
    id: 'chapter_audit',
    name: 'Chapter Quality Audit',
    category: 'chapter',
    description: 'AI audits completed chapters and rates each section 1-10 with improvement suggestions',
    longDescription: 'After generating a chapter, AI analyzes it against the framework and rates: Avatar Alignment, Emotional Engagement, Logical Flow, Practical Value, Persuasion Integration, and Transformation Focus. Provides specific revision recommendations.',
    benefits: [
      'Ensures consistent quality',
      'Identifies weak sections',
      'Provides actionable improvements',
      'Maintains framework adherence'
    ],
    enabled: false,
    icon: '✅',
    tags: ['quality', 'refinement', 'validation']
  },
  {
    id: 'iterative_refinement',
    name: 'Iterative Refinement Loop',
    category: 'chapter',
    description: 'Multiple revision passes with progressive improvements',
    longDescription: 'Allows regenerating specific chapter sections based on audit feedback. Creates refinement loop: generate → audit → refine → audit again until quality standards met.',
    benefits: [
      'Achieves professional quality',
      'Addresses specific weaknesses',
      'Progressive improvement',
      'Learning from feedback'
    ],
    enabled: false,
    icon: '🔄',
    tags: ['quality', 'refinement', 'iteration']
  },

  // ADVANCED CONTEXT ENGINEERING
  {
    id: 'proof_stacking',
    name: 'Proof & Evidence Stacking',
    category: 'chapter',
    description: 'Claude Hopkins approach: back every claim with proof, results, numbers',
    longDescription: 'Ensures every teaching point includes supporting evidence: case studies, research data, testimonials, or real examples. Creates credible, convincing content.',
    benefits: [
      'Builds credibility and trust',
      'Makes claims believable',
      'Provides social proof',
      'Overcomes skepticism'
    ],
    enabled: false,
    icon: '📊',
    tags: ['credibility', 'proof', 'persuasion']
  },
  {
    id: 'authority_positioning',
    name: 'Authority Positioning',
    category: 'chapter',
    description: 'Strategic use of quotes, citations, and expert references',
    longDescription: 'Integrates relevant authority quotes, research citations, and expert validation throughout content. Uses Cialdini\'s authority principle to build trust.',
    benefits: [
      'Leverages borrowed credibility',
      'Builds trust through association',
      'Validates your approach',
      'Creates psychological safety'
    ],
    enabled: false,
    icon: '🎓',
    tags: ['authority', 'credibility', 'psychology']
  },
  {
    id: 'social_proof',
    name: 'Social Proof Integration',
    category: 'content',
    description: 'Weave in testimonials, success stories, and community validation',
    longDescription: 'Strategically places social proof throughout content: success stories, student testimonials, community outcomes. Shows transformation is common and achievable.',
    benefits: [
      'Reduces perceived risk',
      'Shows others succeeded',
      'Creates aspiration',
      'Validates methodology works'
    ],
    enabled: false,
    icon: '👥',
    tags: ['social-proof', 'credibility', 'psychology']
  },

  // ENGAGEMENT & MOTIVATION
  {
    id: 'curiosity_hooks',
    name: 'Strategic Curiosity Gaps',
    category: 'chapter',
    description: 'Create intentional questions and curiosity gaps that pull readers forward',
    longDescription: 'John Caples technique: open loops, pose intriguing questions, hint at upcoming revelations. Creates psychological need to keep reading.',
    benefits: [
      'Maintains reading momentum',
      'Prevents dropout',
      'Creates anticipation',
      'Makes content addictive'
    ],
    enabled: false,
    icon: '🎣',
    tags: ['engagement', 'psychology', 'retention']
  },
  {
    id: 'quick_wins',
    name: 'Quick Wins & Early Success',
    category: 'chapter',
    description: 'Design for immediate value and early confidence building',
    longDescription: 'Frank Kern\'s "results in advance" - deliver transformation before asking anything. Each chapter provides immediate wins that build confidence and commitment.',
    benefits: [
      'Builds reader confidence early',
      'Creates positive momentum',
      'Validates book\'s value immediately',
      'Increases completion rates'
    ],
    enabled: false,
    icon: '⚡',
    tags: ['motivation', 'engagement', 'value']
  },
  {
    id: 'habit_loops',
    name: 'Habit-Forming Design',
    category: 'chapter',
    description: 'Nir Eyal\'s Hook Model: trigger → action → reward → investment',
    longDescription: 'Designs content with habit-forming patterns. Each chapter creates trigger (curiosity), action (reading), reward (insight), investment (application) that makes readers want more.',
    benefits: [
      'Creates reading habit',
      'Increases engagement',
      'Drives completion',
      'Builds long-term connection'
    ],
    enabled: false,
    icon: '🔁',
    tags: ['psychology', 'engagement', 'retention']
  }
];

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'outline',
    name: 'Outline & Structure',
    description: 'Enhancements to book outline generation and structural design',
    icon: '📋'
  },
  {
    id: 'chapter',
    name: 'Chapter Templates',
    description: 'Advanced chapter structures and writing frameworks',
    icon: '📄'
  },
  {
    id: 'content',
    name: 'Content Enhancement',
    description: 'Storytelling, authority building, and content quality features',
    icon: '✨'
  },
  {
    id: 'visual',
    name: 'Visual Generation',
    description: 'AI-generated visuals for covers, diagrams, and illustrations',
    icon: '🎨'
  }
];

// Helper functions
export function getFeaturesByCategory(category: string): AdvancedFeature[] {
  return ADVANCED_FEATURES.filter(f => f.category === category);
}

export function getEnabledFeatures(): AdvancedFeature[] {
  return ADVANCED_FEATURES.filter(f => f.enabled);
}

export function getFeatureById(id: string): AdvancedFeature | undefined {
  return ADVANCED_FEATURES.find(f => f.id === id);
}

export function getFeaturesByTag(tag: string): AdvancedFeature[] {
  return ADVANCED_FEATURES.filter(f => f.tags?.includes(tag));
}

// Default feature configurations for different user types
export const FEATURE_PRESETS = {
  beginner: {
    name: 'Beginner Friendly',
    description: 'Essential features for first-time authors',
    features: ['transformation_blueprint', 'narrative_cohesion', 'chapter_continuity']
  },
  professional: {
    name: 'Professional Author',
    description: 'Balanced feature set for experienced writers',
    features: [
      'transformation_blueprint',
      'narrative_cohesion',
      'emotional_tracking',
      'chapter_continuity',
      'persuasive_learning',
      'hero_journey'
    ]
  },
  advanced: {
    name: 'Advanced/Marketing Focus',
    description: 'All psychological and persuasion features enabled',
    features: [
      'transformation_blueprint',
      'narrative_cohesion',
      'emotional_tracking',
      'chapter_continuity',
      'avatar_research',
      'avatar_diary',
      'persuasive_learning',
      'belief_bridge',
      'slippery_slope',
      'hero_journey',
      'origin_story',
      'proof_stacking',
      'authority_positioning',
      'social_proof',
      'curiosity_hooks',
      'quick_wins'
    ]
  },
  quality_focused: {
    name: 'Quality & Refinement',
    description: 'Focus on content quality and iterative improvement',
    features: [
      'transformation_blueprint',
      'chapter_continuity',
      'chapter_audit',
      'iterative_refinement',
      'proof_stacking',
      'authority_positioning'
    ]
  }
};
