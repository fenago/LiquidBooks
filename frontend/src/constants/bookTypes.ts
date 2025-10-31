/**
 * Book Types Configuration
 * Matches backend book_types.py
 */

export interface BookType {
  id: string;
  name: string;
  category: 'technical' | 'nonfiction' | 'creative' | 'reference';
  description: string;
  icon: string; // Emoji or icon name
  availableTones: string[];
  typicalChapterRange: [number, number];
  recommendedFeatures: string[];
}

export const BOOK_TYPES: BookType[] = [
  // TECHNICAL BOOKS
  {
    id: 'programming_tutorial',
    name: 'Programming Tutorial',
    category: 'technical',
    description: 'Step-by-step coding guide with executable examples',
    icon: '💻',
    availableTones: ['conversational', 'professional', 'academic'],
    typicalChapterRange: [8, 15],
    recommendedFeatures: [
      'code_blocks',
      'interactive_plots',
      'quizzes',
      'tabs',
      'dropdowns',
      'admonitions',
      'cross_references'
    ]
  },
  {
    id: 'data_science',
    name: 'Data Science & Analytics',
    category: 'technical',
    description: 'Statistical analysis and ML guides with visualizations',
    icon: '📊',
    availableTones: ['academic', 'professional'],
    typicalChapterRange: [10, 20],
    recommendedFeatures: [
      'code_blocks',
      'math_equations',
      'interactive_plots',
      'tables',
      'theorems',
      'admonitions',
      'figures'
    ]
  },
  {
    id: 'academic_course',
    name: 'Academic Course',
    category: 'technical',
    description: 'Comprehensive educational course material',
    icon: '🎓',
    availableTones: ['academic', 'professional'],
    typicalChapterRange: [12, 25],
    recommendedFeatures: [
      'code_blocks',
      'math_equations',
      'theorems',
      'quizzes',
      'citations',
      'cross_references',
      'admonitions'
    ]
  },
  {
    id: 'research_paper',
    name: 'Research Paper',
    category: 'technical',
    description: 'Academic research with citations and proofs',
    icon: '🔬',
    availableTones: ['academic'],
    typicalChapterRange: [5, 10],
    recommendedFeatures: [
      'math_equations',
      'theorems',
      'citations',
      'figures',
      'tables',
      'cross_references'
    ]
  },
  {
    id: 'technical_documentation',
    name: 'Technical Documentation',
    category: 'technical',
    description: 'API docs, developer guides, and technical references',
    icon: '📖',
    availableTones: ['professional', 'technical'],
    typicalChapterRange: [5, 15],
    recommendedFeatures: [
      'code_blocks',
      'tabs',
      'admonitions',
      'tables',
      'cross_references',
      'dropdowns'
    ]
  },

  // NON-FICTION BOOKS
  {
    id: 'business_book',
    name: 'Business Book',
    category: 'nonfiction',
    description: 'Business strategies, leadership, and management',
    icon: '💼',
    availableTones: ['professional', 'conversational', 'inspirational'],
    typicalChapterRange: [10, 20],
    recommendedFeatures: [
      'admonitions',
      'cards',
      'dropdowns',
      'figures',
      'quizzes'
    ]
  },
  {
    id: 'how_to_guide',
    name: 'How-To Guide',
    category: 'nonfiction',
    description: 'Practical guides and skill-building handbooks',
    icon: '🛠️',
    availableTones: ['conversational', 'professional'],
    typicalChapterRange: [8, 15],
    recommendedFeatures: [
      'admonitions',
      'dropdowns',
      'figures',
      'quizzes',
      'task_lists'
    ]
  },
  {
    id: 'history_biography',
    name: 'History & Biography',
    category: 'nonfiction',
    description: 'Historical accounts and biographical narratives',
    icon: '📜',
    availableTones: ['narrative', 'academic', 'journalistic'],
    typicalChapterRange: [10, 25],
    recommendedFeatures: [
      'figures',
      'citations',
      'cross_references',
      'dropdowns'
    ]
  },
  {
    id: 'science_medicine',
    name: 'Science & Medicine',
    category: 'nonfiction',
    description: 'Scientific concepts and medical topics',
    icon: '⚕️',
    availableTones: ['academic', 'professional', 'accessible'],
    typicalChapterRange: [8, 20],
    recommendedFeatures: [
      'figures',
      'math_equations',
      'citations',
      'admonitions',
      'tables'
    ]
  },
  {
    id: 'reference_guide',
    name: 'Reference Guide',
    category: 'reference',
    description: 'Comprehensive reference material and lookup guides',
    icon: '📚',
    availableTones: ['professional', 'technical'],
    typicalChapterRange: [5, 30],
    recommendedFeatures: [
      'tables',
      'cross_references',
      'dropdowns',
      'tabs',
      'admonitions'
    ]
  },

  // CREATIVE
  {
    id: 'fiction_novel',
    name: 'Fiction Novel',
    category: 'creative',
    description: 'Creative fiction and storytelling',
    icon: '📕',
    availableTones: ['narrative', 'literary', 'conversational'],
    typicalChapterRange: [10, 30],
    recommendedFeatures: [
      'dropdowns',
      'admonitions'
    ]
  },
  {
    id: 'essay_collection',
    name: 'Essay Collection',
    category: 'creative',
    description: 'Collections of essays and thought pieces',
    icon: '✍️',
    availableTones: ['literary', 'conversational', 'academic'],
    typicalChapterRange: [5, 20],
    recommendedFeatures: [
      'citations',
      'cross_references',
      'admonitions'
    ]
  },

  // REFERENCE/SPECIALIZED
  {
    id: 'childrens_educational',
    name: "Children's Educational",
    category: 'reference',
    description: 'Educational content for children',
    icon: '🎨',
    availableTones: ['playful', 'simple', 'encouraging'],
    typicalChapterRange: [5, 15],
    recommendedFeatures: [
      'figures',
      'admonitions',
      'quizzes',
      'cards',
      'task_lists'
    ]
  },
  {
    id: 'white_paper',
    name: 'White Paper',
    category: 'reference',
    description: 'Authoritative reports and technical briefs',
    icon: '📄',
    availableTones: ['professional', 'technical', 'academic'],
    typicalChapterRange: [3, 8],
    recommendedFeatures: [
      'figures',
      'tables',
      'citations',
      'math_equations'
    ]
  },
  {
    id: 'cookbook_patterns',
    name: 'Cookbook/Patterns',
    category: 'reference',
    description: 'Recipe-style solutions and design patterns',
    icon: '🍳',
    availableTones: ['professional', 'conversational'],
    typicalChapterRange: [10, 30],
    recommendedFeatures: [
      'code_blocks',
      'tabs',
      'admonitions',
      'cross_references',
      'dropdowns'
    ]
  }
];

export const TONE_OPTIONS = [
  { value: 'conversational', label: 'Conversational', description: 'Friendly and approachable' },
  { value: 'professional', label: 'Professional', description: 'Clear and business-like' },
  { value: 'academic', label: 'Academic', description: 'Scholarly and formal' },
  { value: 'technical', label: 'Technical', description: 'Precise and detailed' },
  { value: 'narrative', label: 'Narrative', description: 'Story-driven' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
  { value: 'playful', label: 'Playful', description: 'Fun and engaging' },
  { value: 'simple', label: 'Simple', description: 'Easy to understand' },
  { value: 'literary', label: 'Literary', description: 'Artistic and expressive' },
  { value: 'journalistic', label: 'Journalistic', description: 'Factual and objective' },
  { value: 'accessible', label: 'Accessible', description: 'Easy for general audiences' },
  { value: 'encouraging', label: 'Encouraging', description: 'Supportive and positive' }
];

export const AUDIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner', description: 'New to the topic' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced', description: 'Expert level' },
  { value: 'general', label: 'General Public', description: 'No prior knowledge assumed' },
  { value: 'professional', label: 'Professionals', description: 'Working in the field' },
  { value: 'academic', label: 'Academics/Students', description: 'Educational setting' },
  { value: 'children', label: 'Children', description: 'Age 8-12' },
  { value: 'teens', label: 'Teens', description: 'Age 13-17' }
];

export function getBookType(id: string): BookType | undefined {
  return BOOK_TYPES.find(type => type.id === id);
}

export function getBookTypesByCategory(category: string): BookType[] {
  return BOOK_TYPES.filter(type => type.category === category);
}

export function getToneOptionsForBookType(bookTypeId: string): Array<{value: string, label: string, description: string, recommended?: boolean}> {
  const bookType = getBookType(bookTypeId);
  if (!bookType) return TONE_OPTIONS;

  // Return ALL tones, but mark the recommended ones
  return TONE_OPTIONS.map(tone => ({
    ...tone,
    recommended: bookType.availableTones.includes(tone.value)
  }));
}
