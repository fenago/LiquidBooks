import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PromptTemplate } from '../types.js';

interface PromptStore {
  // State
  templates: PromptTemplate[];
  activeTemplate: PromptTemplate | null;

  // Actions
  loadTemplates: () => void;
  saveTemplate: (template: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>) => void;
  updateTemplate: (id: string, updates: Partial<PromptTemplate>) => void;
  deleteTemplate: (id: string) => void;
  setActiveTemplate: (template: PromptTemplate | null) => void;
  getTemplateById: (id: string) => PromptTemplate | undefined;
  duplicateTemplate: (id: string) => void;
}

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      // Initial State
      templates: [],
      activeTemplate: null,

      // Load templates from localStorage
      loadTemplates: () => {
        const stored = localStorage.getItem('liquidbooks-prompt-templates');
        if (stored) {
          try {
            const templates = JSON.parse(stored);
            set({ templates });
          } catch (error) {
            console.error('Failed to load templates:', error);
          }
        }
      },

      // Save new template
      saveTemplate: (templateData) => {
        const newTemplate: PromptTemplate = {
          ...templateData,
          id: `template-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));

        return newTemplate;
      },

      // Update existing template
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updated_at: new Date().toISOString() }
              : template
          ),
          activeTemplate:
            state.activeTemplate?.id === id
              ? { ...state.activeTemplate, ...updates, updated_at: new Date().toISOString() }
              : state.activeTemplate,
        })),

      // Delete template
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
          activeTemplate: state.activeTemplate?.id === id ? null : state.activeTemplate,
        })),

      // Set active template
      setActiveTemplate: (template) => set({ activeTemplate: template }),

      // Get template by ID
      getTemplateById: (id) => {
        return get().templates.find((template) => template.id === id);
      },

      // Duplicate template
      duplicateTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (!template) return;

        const duplicated: PromptTemplate = {
          ...template,
          id: `template-${Date.now()}`,
          name: `${template.name} (Copy)`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((state) => ({
          templates: [...state.templates, duplicated],
        }));
      },
    }),
    {
      name: 'liquidbooks-prompts',
      partialize: (state) => ({
        templates: state.templates,
      }),
    }
  )
);

// Default templates
export const DEFAULT_TEMPLATES: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Programming Tutorial',
    description: 'Template for creating programming tutorials with code examples',
    system_prompt: `You are an expert programming instructor creating comprehensive tutorial content.
Your writing should be:
- Clear and beginner-friendly with step-by-step explanations
- Rich with practical code examples and real-world applications
- Focused on teaching core concepts with hands-on exercises
- Using MyST Markdown with code cells, admonitions, and interactive elements`,
    user_prompt_template: `Create a tutorial chapter about: {{topic}}

Target Audience: {{audience}}
Chapter Focus: {{chapter_title}}
Learning Objectives: {{learning_objectives}}

Include:
- Clear explanations with examples
- Code snippets with syntax highlighting
- Practice exercises
- Common pitfalls and best practices`,
  },
  {
    name: 'Research Paper',
    description: 'Academic writing template with citations and formal structure',
    system_prompt: `You are an academic researcher creating scholarly content.
Your writing should be:
- Formal and precise with proper academic tone
- Evidence-based with citations and references
- Structured with clear methodology and findings
- Using MyST Markdown with footnotes, citations, and figures`,
    user_prompt_template: `Write an academic chapter about: {{topic}}

Research Focus: {{chapter_title}}
Key Arguments: {{learning_objectives}}

Include:
- Literature review context
- Methodology and approach
- Analysis and findings
- Conclusions and implications
- Proper citations and references`,
  },
  {
    name: 'Business Strategy',
    description: 'Professional business content with frameworks and case studies',
    system_prompt: `You are a business strategy consultant creating professional content.
Your writing should be:
- Professional and actionable with clear frameworks
- Data-driven with examples and case studies
- Focused on practical implementation
- Using MyST Markdown with diagrams, tables, and callouts`,
    user_prompt_template: `Develop a business strategy chapter about: {{topic}}

Strategic Focus: {{chapter_title}}
Key Outcomes: {{learning_objectives}}

Include:
- Strategic frameworks and models
- Real-world case studies
- Implementation roadmaps
- KPIs and success metrics
- Risk assessment and mitigation`,
  },
  {
    name: 'Creative Storytelling',
    description: 'Narrative writing template for fiction and creative works',
    system_prompt: `You are a creative writer crafting engaging narrative content.
Your writing should be:
- Engaging and immersive with vivid descriptions
- Character-driven with emotional depth
- Structured with clear narrative arcs
- Using MyST Markdown with creative formatting and styling`,
    user_prompt_template: `Write a narrative chapter about: {{topic}}

Story Focus: {{chapter_title}}
Themes: {{learning_objectives}}

Include:
- Engaging character development
- Vivid scene descriptions
- Compelling dialogue
- Emotional resonance
- Plot progression and pacing`,
  },
];
