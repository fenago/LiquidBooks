// Comprehensive Jupyter Book 1.0.3 Feature Definitions
// Based on official documentation and research

export interface JupyterBookFeature {
  id: string;
  name: string;
  category: 'content' | 'code' | 'math' | 'design' | 'visual' | 'interactive' | 'myst';
  description: string;
  enabled: boolean;
  sphinxExtension?: string | string[];
  mystExtension?: string;
}

export const JUPYTER_BOOK_FEATURES: JupyterBookFeature[] = [
  // ============================================
  // BASIC CONTENT FEATURES
  // ============================================
  {
    id: 'admonitions',
    name: 'Admonitions',
    category: 'content',
    description: 'Notes, warnings, tips, and other callout boxes',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'dropdowns',
    name: 'Dropdowns',
    category: 'content',
    description: 'Collapsible content sections',
    enabled: false,
    sphinxExtension: 'sphinx_togglebutton',
  },
  {
    id: 'admonition_dropdowns',
    name: 'Dropdown Admonitions',
    category: 'content',
    description: 'Admonitions with collapsible content',
    enabled: false,
    sphinxExtension: 'sphinx_togglebutton',
  },
  {
    id: 'definition_lists',
    name: 'Definition Lists',
    category: 'content',
    description: 'Term and definition pairs',
    enabled: false,
    mystExtension: 'deflist',
  },
  {
    id: 'blockquotes',
    name: 'Blockquotes',
    category: 'content',
    description: 'Standard markdown blockquotes',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'epigraphs',
    name: 'Epigraphs',
    category: 'content',
    description: 'Styled quotations with attribution',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },
  {
    id: 'glossary',
    name: 'Glossary',
    category: 'content',
    description: 'Define terms in a glossary',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },
  {
    id: 'footnotes',
    name: 'Footnotes',
    category: 'content',
    description: 'Reference-style footnotes',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'sidebar',
    name: 'Sidebar Content',
    category: 'content',
    description: 'Content in page margins',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },
  {
    id: 'margin_notes',
    name: 'Margin Notes',
    category: 'content',
    description: 'Notes displayed in page margins',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },

  // ============================================
  // CODE FEATURES
  // ============================================
  {
    id: 'code_blocks',
    name: 'Code Blocks',
    category: 'code',
    description: 'Syntax-highlighted code blocks',
    enabled: true,
    sphinxExtension: 'sphinx_copybutton',
  },
  {
    id: 'code_execution',
    name: 'Executable Code Cells',
    category: 'code',
    description: 'Execute code and display outputs',
    enabled: false,
    sphinxExtension: undefined, // Built into Jupyter Book
  },
  {
    id: 'code_cell_tags',
    name: 'Code Cell Tags',
    category: 'code',
    description: 'Tags for hiding/showing code cells (hide-input, hide-output, remove-cell, etc.)',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST-NB
  },
  {
    id: 'output_gluing',
    name: 'Output Gluing',
    category: 'code',
    description: 'Store and reuse code outputs throughout the book',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST-NB
  },
  {
    id: 'thebe',
    name: 'Thebe (Live Code)',
    category: 'code',
    description: 'Interactive code execution in the browser',
    enabled: false,
    sphinxExtension: 'sphinx_thebe',
  },
  {
    id: 'binder_buttons',
    name: 'Binder/Colab Buttons',
    category: 'code',
    description: 'Launch interactive notebooks',
    enabled: false,
    sphinxExtension: undefined, // Built into Jupyter Book config
  },
  {
    id: 'scroll_output',
    name: 'Scrollable Output',
    category: 'code',
    description: 'Make long code outputs scrollable',
    enabled: false,
    sphinxExtension: undefined, // CSS-based
  },
  {
    id: 'line_numbers',
    name: 'Code Line Numbers',
    category: 'code',
    description: 'Display line numbers in code blocks',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },

  // ============================================
  // MATH FEATURES
  // ============================================
  {
    id: 'math_equations',
    name: 'Math Equations',
    category: 'math',
    description: 'LaTeX-style mathematical equations',
    enabled: true,
    mystExtension: 'dollarmath', // Enables $$ and $ syntax
  },
  {
    id: 'amsmath',
    name: 'AMS Math',
    category: 'math',
    description: 'Advanced math environments (align, gather, etc.)',
    enabled: false,
    mystExtension: 'amsmath',
  },
  {
    id: 'math_labels',
    name: 'Equation Labels',
    category: 'math',
    description: 'Label and reference equations',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'theorems',
    name: 'Theorems',
    category: 'math',
    description: 'Theorem environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },
  {
    id: 'proofs',
    name: 'Proofs',
    category: 'math',
    description: 'Mathematical proof environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    category: 'math',
    description: 'Algorithm pseudocode environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },
  {
    id: 'lemmas',
    name: 'Lemmas',
    category: 'math',
    description: 'Lemma environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },
  {
    id: 'corollaries',
    name: 'Corollaries',
    category: 'math',
    description: 'Corollary environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },
  {
    id: 'definitions',
    name: 'Mathematical Definitions',
    category: 'math',
    description: 'Definition environments',
    enabled: false,
    sphinxExtension: 'sphinx_proof',
  },

  // ============================================
  // SPHINX DESIGN COMPONENTS
  // ============================================
  {
    id: 'grids',
    name: 'Grids',
    category: 'design',
    description: 'Grid-based layouts for content',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'cards',
    name: 'Cards',
    category: 'design',
    description: 'Card-style content blocks',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    category: 'design',
    description: 'Tabbed content sections',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'badges',
    name: 'Badges',
    category: 'design',
    description: 'Inline badges for labels',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'buttons',
    name: 'Buttons',
    category: 'design',
    description: 'Clickable button elements',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'icons',
    name: 'Icons',
    category: 'design',
    description: 'Octicon and FontAwesome icons',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'grid_cards',
    name: 'Grid Cards',
    category: 'design',
    description: 'Cards arranged in responsive grids',
    enabled: false,
    sphinxExtension: 'sphinx_design',
  },
  {
    id: 'custom_divs',
    name: 'Custom Div Blocks',
    category: 'design',
    description: 'Custom HTML div containers with classes',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST
  },

  // ============================================
  // VISUAL & DIAGRAMS
  // ============================================
  {
    id: 'figures',
    name: 'Figures',
    category: 'visual',
    description: 'Images with captions and references',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'images',
    name: 'Images',
    category: 'visual',
    description: 'Basic image insertion',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'html_images',
    name: 'HTML Images',
    category: 'visual',
    description: 'Images using HTML img tags',
    enabled: false,
    mystExtension: 'html_image',
  },
  {
    id: 'mermaid_diagrams',
    name: 'Mermaid Diagrams',
    category: 'visual',
    description: 'Flowcharts, sequence diagrams, and more',
    enabled: false,
    sphinxExtension: 'sphinxcontrib.mermaid',
  },
  {
    id: 'tables',
    name: 'Tables',
    category: 'visual',
    description: 'Markdown and list-style tables',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },

  // ============================================
  // INTERACTIVE FEATURES
  // ============================================
  {
    id: 'quizzes',
    name: 'Quizzes',
    category: 'interactive',
    description: 'Interactive quiz questions',
    enabled: false,
    sphinxExtension: 'jupyterquiz',
  },
  {
    id: 'exercise',
    name: 'Exercises',
    category: 'interactive',
    description: 'Interactive exercise blocks',
    enabled: false,
    sphinxExtension: 'sphinx_exercise',
  },
  {
    id: 'interactive_plots',
    name: 'Interactive Plots',
    category: 'interactive',
    description: 'Plotly, Bokeh, and other interactive visualizations',
    enabled: false,
    sphinxExtension: undefined, // Via code execution
  },
  {
    id: 'widgets',
    name: 'Jupyter Widgets',
    category: 'interactive',
    description: 'Interactive ipywidgets',
    enabled: false,
    sphinxExtension: undefined, // Via Jupyter
  },

  // ============================================
  // MYST EXTENSIONS
  // ============================================
  {
    id: 'colon_fence',
    name: 'Colon Fence (:::)',
    category: 'myst',
    description: 'Use ::: for directives instead of ```',
    enabled: false,
    mystExtension: 'colon_fence',
  },
  {
    id: 'substitutions',
    name: 'Substitutions',
    category: 'myst',
    description: 'Define and reuse variables in markdown',
    enabled: false,
    mystExtension: 'substitution',
  },
  {
    id: 'smartquotes',
    name: 'Smart Quotes',
    category: 'myst',
    description: 'Automatically convert quotes to smart quotes',
    enabled: false,
    mystExtension: 'smartquotes',
  },
  {
    id: 'linkify',
    name: 'Linkify',
    category: 'myst',
    description: 'Auto-detect and convert URLs to links',
    enabled: true,
    mystExtension: 'linkify',
  },
  {
    id: 'replacements',
    name: 'Text Replacements',
    category: 'myst',
    description: 'Automatic text replacements (e.g., (c) → ©)',
    enabled: false,
    mystExtension: 'replacements',
  },
  {
    id: 'tasklists',
    name: 'Task Lists',
    category: 'myst',
    description: 'GitHub-style checkboxes [ ] and [x]',
    enabled: false,
    mystExtension: 'tasklist',
  },
  {
    id: 'html_admonition',
    name: 'HTML Admonitions',
    category: 'myst',
    description: 'Define admonitions using HTML div tags',
    enabled: false,
    mystExtension: 'html_admonition',
  },
  {
    id: 'attrs_inline',
    name: 'Inline Attributes',
    category: 'myst',
    description: 'Add attributes to inline elements',
    enabled: false,
    mystExtension: 'attrs_inline',
  },
  {
    id: 'attrs_block',
    name: 'Block Attributes',
    category: 'myst',
    description: 'Add attributes to block elements',
    enabled: false,
    mystExtension: 'attrs_block',
  },

  // ============================================
  // REFERENCES & CITATIONS
  // ============================================
  {
    id: 'cross_references',
    name: 'Cross-References',
    category: 'content',
    description: 'Reference sections, figures, and tables',
    enabled: true,
    sphinxExtension: undefined, // Built into Sphinx
  },
  {
    id: 'target_headers',
    name: 'Target Headers',
    category: 'content',
    description: 'Create custom reference targets',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'citations',
    name: 'Citations & Bibliography',
    category: 'content',
    description: 'BibTeX-style citations',
    enabled: false,
    sphinxExtension: 'sphinxcontrib.bibtex',
  },
  {
    id: 'numbered_references',
    name: 'Numbered References',
    category: 'content',
    description: 'Numbered cross-references to figures and tables',
    enabled: false,
    sphinxExtension: undefined, // Built into Sphinx
  },

  // ============================================
  // ADVANCED FEATURES
  // ============================================
  {
    id: 'line_comments',
    name: 'Line Comments',
    category: 'content',
    description: 'Comments with % that don\'t render',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'block_breaks',
    name: 'Block Breaks',
    category: 'content',
    description: 'Break blocks with +++ syntax',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'html_blocks',
    name: 'HTML Blocks',
    category: 'content',
    description: 'Raw HTML in markdown',
    enabled: false,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'reference_style_links',
    name: 'Reference-Style Links',
    category: 'content',
    description: 'Define links separately from text',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
  {
    id: 'thematic_breaks',
    name: 'Thematic Breaks',
    category: 'content',
    description: 'Horizontal rules with ---',
    enabled: true,
    sphinxExtension: undefined, // Built into MyST
  },
];

// Feature categories for UI grouping
export const FEATURE_CATEGORIES = [
  { id: 'content', name: 'Content & Structure', icon: '📝' },
  { id: 'code', name: 'Code & Execution', icon: '💻' },
  { id: 'math', name: 'Mathematics', icon: '📐' },
  { id: 'design', name: 'Design Components', icon: '🎨' },
  { id: 'visual', name: 'Visual Elements', icon: '🖼️' },
  { id: 'interactive', name: 'Interactive', icon: '🎮' },
  { id: 'myst', name: 'MyST Extensions', icon: '⚙️' },
] as const;

// Preset feature collections
export const FEATURE_PRESETS = {
  minimal: {
    name: 'Minimal',
    description: 'Basic markdown features only',
    features: ['admonitions', 'blockquotes', 'code_blocks', 'figures', 'images', 'tables', 'math_equations', 'cross_references', 'target_headers', 'footnotes'],
  },
  standard: {
    name: 'Standard',
    description: 'Common features for most books',
    features: ['admonitions', 'blockquotes', 'code_blocks', 'figures', 'images', 'tables', 'math_equations', 'cross_references', 'target_headers', 'footnotes', 'dropdowns', 'cards', 'grids', 'tabs', 'code_cell_tags', 'linkify'],
  },
  technical: {
    name: 'Technical Book',
    description: 'Features for technical documentation',
    features: ['admonitions', 'code_blocks', 'code_execution', 'code_cell_tags', 'output_gluing', 'figures', 'tables', 'math_equations', 'theorems', 'proofs', 'algorithms', 'cross_references', 'citations', 'grids', 'tabs', 'mermaid_diagrams'],
  },
  course: {
    name: 'Course/Tutorial',
    description: 'Interactive learning features',
    features: ['admonitions', 'dropdowns', 'code_blocks', 'code_execution', 'quizzes', 'exercise', 'tabs', 'cards', 'grids', 'figures', 'thebe', 'binder_buttons', 'interactive_plots'],
  },
  research: {
    name: 'Research Paper',
    description: 'Academic and research features',
    features: ['admonitions', 'figures', 'tables', 'math_equations', 'amsmath', 'theorems', 'proofs', 'lemmas', 'corollaries', 'definitions', 'citations', 'numbered_references', 'cross_references', 'footnotes', 'code_blocks'],
  },
  complete: {
    name: 'All Features',
    description: 'Enable everything',
    features: JUPYTER_BOOK_FEATURES.map(f => f.id),
  },
} as const;
