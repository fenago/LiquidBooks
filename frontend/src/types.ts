export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  description?: string;
  chapter_number?: number;
  learning_objectives?: string[];
  suggested_components?: string[];
  template?: string;
  word_count_target?: number;
  status?: 'not_started' | 'generating' | 'draft' | 'complete';
}

export interface LegalClauses {
  allRightsReserved?: boolean;
  fiction?: boolean;
  moralRights?: boolean;
  externalContent?: boolean;
  designations?: boolean;
  additionalClauses?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  chapters: Chapter[];
  legalClauses?: LegalClauses;
  book_type?: string;
  tone?: string;
  target_audience?: string;
  special_requirements?: string;
  enabled_features?: string[];
}

export interface BookConfig {
  title: string;
  author: string;
  logo?: string;
  repository?: string;
  theme?: string;
}

// Artifact Types
export interface Artifact {
  id: string;
  type: 'image' | 'video' | 'diagram' | 'interactive';
  category: string;
  chapter_number: number;
  title: string;
  description: string;
  prompt?: string;
  content?: string;
  tool_info?: {
    name: string;
    url?: string;
  };
  placement_guideline?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Enhancement Types
export interface Enhancement {
  chapter_number: number;
  chapter_title: string;
  enhancements: {
    cross_references: Array<{
      reference_to: string;
      location: string;
      reason: string;
    }>;
    chapter_transition: string;
    forward_hook: string;
    glossary_terms: Array<{
      term: string;
      definition: string;
    }>;
    callouts: Array<{
      type: string;
      location: string;
      content: string;
    }>;
    code_enhancements: Array<{
      location: string;
      suggestion: string;
    }>;
  };
}

// Prompt Template Types
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  system_prompt: string;
  user_prompt_template: string;
  created_at: string;
  updated_at: string;
}

// Build Result Types
export interface BuildResult {
  success: boolean;
  output_path?: string;
  html_url?: string;
  errors?: string[];
  warnings?: string[];
  timestamp: string;
}
