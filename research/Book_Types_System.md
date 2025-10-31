# LiquidBooks: Universal Book Type System

## Philosophy
LiquidBooks can generate ANY type of book. While optimized for technical/educational content (leveraging Jupyter Book's interactive features), it supports all genres and formats.

---

## Book Type Categories

### 📚 Technical & Educational (Primary Focus)

#### 1. **Programming Tutorial**
**Description**: Step-by-step coding guides with executable examples
**Structure**:
- Introduction & Setup
- Concept chapters with code examples
- Hands-on projects
- Exercises with solutions
- Reference/Cheat sheet

**Jupyter Features**: Code blocks (executable), interactive plots, quizzes, tabs (for multiple languages), dropdowns (solutions)

**Tone Options**: Conversational, Professional, Academic

**Example Prompts**:
- "Learn Python in 10 Days"
- "Complete Guide to React Hooks"
- "Rust Programming Fundamentals"

---

#### 2. **Data Science & Analytics**
**Description**: Statistical analysis, ML, data visualization guides
**Structure**:
- Problem definition
- Data exploration
- Analysis methodology
- Implementation with code
- Results & visualization
- Interpretation

**Jupyter Features**: Code blocks, math equations, interactive plots (Plotly/Altair), tables, theorem blocks, output gluing

**Tone Options**: Academic, Professional

**Example Prompts**:
- "Machine Learning A-Z"
- "Data Visualization with Python"
- "Statistical Analysis for Beginners"

---

#### 3. **Academic Course**
**Description**: Structured course material with modules and assessments
**Structure**:
- Course overview & objectives
- Module-based chapters
- Lecture content
- Labs/exercises per module
- Quizzes & assessments
- Final project

**Jupyter Features**: All features, especially quizzes, admonitions, cross-references, Binder/Colab buttons

**Tone Options**: Academic, Professional

**Example Prompts**:
- "Introduction to Computer Science (CS101)"
- "Advanced Calculus Course"
- "Digital Marketing Masterclass"

---

#### 4. **Research Paper**
**Description**: Academic research with methodology and findings
**Structure**:
- Abstract
- Introduction (background, motivation, contributions)
- Related Work
- Methodology
- Experiments/Results
- Discussion
- Conclusion & Future Work
- References

**Jupyter Features**: Math equations, theorem/proof blocks, citations, figures with captions, tables, cross-references

**Tone Options**: Academic

**Example Prompts**:
- "Novel Approach to Image Segmentation"
- "Survey of Deep Learning Architectures"
- "Impact of Social Media on Mental Health"

---

#### 5. **Technical Documentation**
**Description**: Software documentation, API guides, user manuals
**Structure**:
- Getting Started
- Installation
- Architecture Overview
- API Reference
- Examples & Tutorials
- Troubleshooting
- FAQ

**Jupyter Features**: Code blocks, admonitions (warnings/tips), dropdowns, tabs, definition lists, cross-references

**Tone Options**: Professional, Conversational

**Example Prompts**:
- "FastAPI Framework Documentation"
- "User Guide for XYZ Software"
- "API Integration Manual"

---

#### 6. **Algorithm & Data Structures**
**Description**: Computer science fundamentals with proofs
**Structure**:
- Concept introduction
- Mathematical foundation
- Algorithm pseudocode
- Implementation
- Complexity analysis
- Applications

**Jupyter Features**: Math equations, algorithm blocks, theorem/proof blocks, code blocks, interactive visualizations

**Tone Options**: Academic, Professional

**Example Prompts**:
- "Comprehensive Guide to Sorting Algorithms"
- "Dynamic Programming Mastery"
- "Graph Theory & Applications"

---

### 📖 General Non-Fiction

#### 7. **Business & Self-Help**
**Description**: Professional development, entrepreneurship, personal growth
**Structure**:
- Problem identification
- Framework/methodology
- Chapter per principle/strategy
- Real-world examples
- Action steps
- Summary/worksheets

**Jupyter Features**: Cards (for highlights), admonitions (tips/warnings), blockquotes (key insights), dropdowns (exercises), tables (comparisons)

**Tone Options**: Conversational, Professional, Inspirational

**Example Prompts**:
- "The Entrepreneur's Playbook"
- "Effective Leadership in Tech"
- "Time Management for Developers"

---

#### 8. **History & Biography**
**Description**: Historical accounts, life stories, timelines
**Structure**:
- Chronological or thematic
- Context setting
- Event/period chapters
- Analysis & impact
- Timeline/reference

**Jupyter Features**: Images, figures, blockquotes, definition lists (key terms), timelines (with custom directives), cross-references

**Tone Options**: Academic, Conversational, Narrative

**Example Prompts**:
- "History of Computer Science"
- "Biography of Ada Lovelace"
- "Evolution of Programming Languages"

---

#### 9. **Science & Medicine**
**Description**: Scientific concepts, medical guides, health topics
**Structure**:
- Introduction to topic
- Scientific foundation
- Current research
- Practical applications
- Case studies
- References

**Jupyter Features**: Math equations, figures, tables, citations, admonitions, interactive plots (for data), theorem/proof blocks

**Tone Options**: Academic, Professional, Conversational

**Example Prompts**:
- "Understanding Quantum Mechanics"
- "Guide to Human Anatomy"
- "Neuroscience Simplified"

---

#### 10. **How-To & Practical Guides**
**Description**: Step-by-step instructions for skills/tasks
**Structure**:
- Introduction & prerequisites
- Step-by-step instructions
- Troubleshooting
- Tips & tricks
- Examples/templates

**Jupyter Features**: Admonitions (warnings/tips), dropdowns (advanced topics), images, task lists, numbered steps

**Tone Options**: Conversational, Professional

**Example Prompts**:
- "Complete Guide to Home Networking"
- "DIY Electronics Projects"
- "Beginner's Guide to Photography"

---

### ✍️ Creative Writing

#### 11. **Fiction - Novel**
**Description**: Narrative fiction with plot and characters
**Structure**:
- Chapters (narrative arc)
- Character development
- Plot progression
- Resolution

**Jupyter Features**: Epigraphs (chapter quotes), dropdowns (author's notes), margin notes (commentary), cross-references (character/location tracking)

**Tone Options**: Narrative (can specify: dramatic, humorous, dark, lighthearted)

**Example Prompts**:
- "Sci-Fi Novel: AI Uprising"
- "Mystery: The Code Killer"
- "Fantasy Adventure in Silicon Valley"

**Note**: While Jupyter Book is less ideal for pure fiction, it can work for:
- Interactive fiction
- Technical fiction (Black Mirror-style)
- Fiction with educational elements

---

#### 12. **Short Story Collection**
**Description**: Anthology of short stories
**Structure**:
- Introduction/foreword
- Story per chapter
- Theme/genre grouping
- Author notes

**Jupyter Features**: Epigraphs, dropdowns, cross-references

**Tone Options**: Narrative (various)

---

#### 13. **Poetry Collection**
**Description**: Collection of poems with optional analysis
**Structure**:
- Sections/themes
- Poem per page
- Optional commentary

**Jupyter Features**: Blockquotes, epigraphs, margin notes

**Tone Options**: Poetic, Lyrical, Contemporary

---

### 📰 Journalism & Essay

#### 14. **Article/Essay Collection**
**Description**: Compilation of essays on a theme
**Structure**:
- Introduction/thesis
- Essay chapters
- Conclusion/synthesis

**Jupyter Features**: Citations, blockquotes, footnotes, cross-references

**Tone Options**: Academic, Conversational, Opinion

**Example Prompts**:
- "Essays on Tech Ethics"
- "Perspectives on Remote Work"

---

#### 15. **White Paper**
**Description**: In-depth report on a specific topic/solution
**Structure**:
- Executive summary
- Problem statement
- Background
- Proposed solution
- Implementation
- Conclusion

**Jupyter Features**: Figures, tables, citations, cross-references, admonitions

**Tone Options**: Professional, Academic

---

### 🎓 Children's & Educational

#### 16. **Children's Educational Book**
**Description**: Age-appropriate educational content
**Structure**:
- Simple concepts per chapter
- Visual explanations
- Interactive elements
- Activities/quizzes

**Jupyter Features**: Images, cards (for visual appeal), admonitions (fun facts), quizzes, interactive widgets

**Tone Options**: Simple, Fun, Engaging

**Example Prompts**:
- "Math Adventures for Kids"
- "Learn to Code: Ages 8-12"

---

### 📋 Reference & Handbook

#### 17. **Reference Guide/Encyclopedia**
**Description**: Comprehensive reference material
**Structure**:
- Alphabetical or topical organization
- Entry per concept
- Cross-references
- Index

**Jupyter Features**: Definition lists, cross-references, glossary, target headers, tables

**Tone Options**: Professional, Academic

**Example Prompts**:
- "Python Standard Library Reference"
- "Encyclopedia of Algorithms"

---

#### 18. **Cookbook/Recipe Collection**
**Description**: Collection of recipes or code patterns
**Structure**:
- Category sections
- Recipe/pattern per page
- Ingredients/requirements
- Steps/implementation
- Variations

**Jupyter Features**: Code blocks, admonitions (tips), tables (ingredient lists), tabs (variations)

**Tone Options**: Conversational, Professional

**Example Prompts**:
- "React Design Patterns Cookbook"
- "SQL Query Recipes"

---

## Book Type Configuration System

### Frontend: Book Type Selector

```typescript
export interface BookType {
  id: string;
  name: string;
  category: 'technical' | 'nonfiction' | 'creative' | 'reference';
  description: string;
  defaultTone: string;
  availableTones: string[];
  recommendedFeatures: string[];
  typicalChapterCount: { min: number; max: number };
  structureTemplate: string[];
  icon: string;
}

export const BOOK_TYPES: BookType[] = [
  {
    id: 'programming_tutorial',
    name: 'Programming Tutorial',
    category: 'technical',
    description: 'Step-by-step coding guide with executable examples',
    defaultTone: 'conversational',
    availableTones: ['conversational', 'professional', 'academic'],
    recommendedFeatures: [
      'code_blocks',
      'interactive_plots',
      'quizzes',
      'tabs',
      'dropdowns',
      'admonitions'
    ],
    typicalChapterCount: { min: 8, max: 15 },
    structureTemplate: [
      'Introduction & Setup',
      'Core Concepts',
      'Practical Examples',
      'Advanced Topics',
      'Projects',
      'Reference'
    ],
    icon: '💻'
  },
  {
    id: 'data_science',
    name: 'Data Science & Analytics',
    category: 'technical',
    description: 'Statistical analysis and ML guides with visualizations',
    defaultTone: 'professional',
    availableTones: ['academic', 'professional'],
    recommendedFeatures: [
      'code_blocks',
      'math_equations',
      'interactive_plots',
      'tables',
      'theorems',
      'output_gluing'
    ],
    typicalChapterCount: { min: 10, max: 20 },
    structureTemplate: [
      'Introduction',
      'Data Exploration',
      'Methodology',
      'Analysis',
      'Results',
      'Interpretation'
    ],
    icon: '📊'
  },
  {
    id: 'academic_course',
    name: 'Academic Course',
    category: 'technical',
    description: 'Structured course with modules and assessments',
    defaultTone: 'academic',
    availableTones: ['academic', 'professional'],
    recommendedFeatures: [
      'code_blocks',
      'math_equations',
      'quizzes',
      'admonitions',
      'cross_references',
      'binder',
      'colab'
    ],
    typicalChapterCount: { min: 12, max: 24 },
    structureTemplate: [
      'Course Overview',
      'Module 1-N (lectures + labs)',
      'Assessments',
      'Final Project'
    ],
    icon: '🎓'
  },
  {
    id: 'research_paper',
    name: 'Research Paper',
    category: 'technical',
    description: 'Academic research with methodology and findings',
    defaultTone: 'academic',
    availableTones: ['academic'],
    recommendedFeatures: [
      'math_equations',
      'theorems',
      'proofs',
      'citations',
      'figures',
      'tables',
      'cross_references'
    ],
    typicalChapterCount: { min: 6, max: 10 },
    structureTemplate: [
      'Abstract',
      'Introduction',
      'Related Work',
      'Methodology',
      'Results',
      'Discussion',
      'Conclusion',
      'References'
    ],
    icon: '📄'
  },
  {
    id: 'business_book',
    name: 'Business & Self-Help',
    category: 'nonfiction',
    description: 'Professional development and business strategies',
    defaultTone: 'conversational',
    availableTones: ['conversational', 'professional', 'inspirational'],
    recommendedFeatures: [
      'cards',
      'admonitions',
      'blockquotes',
      'dropdowns',
      'tables'
    ],
    typicalChapterCount: { min: 10, max: 15 },
    structureTemplate: [
      'Introduction',
      'Problem/Challenge',
      'Framework/Principles (one per chapter)',
      'Real Examples',
      'Action Steps',
      'Summary'
    ],
    icon: '💼'
  },
  {
    id: 'fiction_novel',
    name: 'Fiction Novel',
    category: 'creative',
    description: 'Narrative fiction with plot and characters',
    defaultTone: 'narrative',
    availableTones: ['dramatic', 'humorous', 'dark', 'lighthearted'],
    recommendedFeatures: [
      'epigraphs',
      'dropdowns',
      'margin_notes',
      'cross_references'
    ],
    typicalChapterCount: { min: 15, max: 40 },
    structureTemplate: [
      'Chapters following narrative arc',
      'Character development',
      'Plot progression'
    ],
    icon: '📖'
  },
  {
    id: 'reference_guide',
    name: 'Reference Guide',
    category: 'reference',
    description: 'Comprehensive reference material',
    defaultTone: 'professional',
    availableTones: ['professional', 'academic'],
    recommendedFeatures: [
      'definition_lists',
      'cross_references',
      'glossary',
      'target_headers',
      'tables',
      'code_blocks'
    ],
    typicalChapterCount: { min: 20, max: 50 },
    structureTemplate: [
      'Organized topically or alphabetically',
      'Entry per concept',
      'Index'
    ],
    icon: '📚'
  },
  // Add more book types...
];
```

### Backend: Dynamic System Prompt Builder

```python
BOOK_TYPE_PROMPTS = {
    'programming_tutorial': """You are writing a programming tutorial book.

STRUCTURE:
- Start with prerequisites and setup
- Build concepts progressively
- Include practical, runnable code examples
- Add exercises with solutions (in dropdowns)
- End chapters with quizzes
- Use conversational, encouraging tone
- Explain WHY, not just HOW

REQUIREMENTS:
- All code must be complete and executable
- Use real-world examples, not foo/bar
- Include common pitfalls as admonitions
- Add "Try it yourself" sections
""",

    'data_science': """You are writing a data science book.

STRUCTURE:
- Start with problem/question
- Show data exploration with visualizations
- Explain mathematical foundation
- Implement solution with code
- Interpret results
- Discuss limitations

REQUIREMENTS:
- Balance theory and practice
- Include mathematical equations where relevant
- Create meaningful visualizations (describe Plotly/Altair code)
- Show full data pipeline
- Discuss statistical significance
""",

    'academic_course': """You are creating structured course material.

STRUCTURE:
- Module overview with learning objectives
- Lecture content
- Worked examples
- Lab/practice exercises
- Quiz at module end
- Connect to next module

REQUIREMENTS:
- Clear learning objectives per module
- Progressive difficulty
- Formative assessments (quizzes)
- Interactive elements (Binder/Colab)
- Reference previous modules
""",

    'research_paper': """You are writing an academic research paper.

STRUCTURE:
- Abstract (150-250 words): problem, method, results, conclusion
- Introduction: background, motivation, contributions
- Related Work: survey of existing approaches
- Methodology: detailed approach description
- Results: experiments and findings
- Discussion: interpretation and implications
- Conclusion: summary and future work
- References: academic citations

REQUIREMENTS:
- Formal academic tone
- Cite relevant work frequently
- Use mathematical notation correctly
- Present data in tables/figures
- Number equations, theorems, proofs
- Be objective and rigorous
""",

    'business_book': """You are writing a business/self-help book.

STRUCTURE:
- Hook reader with relatable problem
- Present framework/principles
- Support with real-world examples
- Include actionable steps
- End with summary and call-to-action

REQUIREMENTS:
- Engaging, conversational tone
- Use storytelling
- Include case studies
- Add reflection questions (in cards)
- Highlight key insights (blockquotes)
- Practical, not just theoretical
""",

    'fiction_novel': """You are writing a fiction novel.

STRUCTURE:
- Chapter-based narrative
- Character development
- Plot progression
- Dialogue and description balance
- Chapter cliffhangers

REQUIREMENTS:
- Show, don't tell
- Consistent character voice
- Vivid scene descriptions
- Proper pacing
- Emotional engagement
- Can add chapter epigraphs for atmosphere
""",

    'reference_guide': """You are writing a reference guide.

STRUCTURE:
- Organize logically (alphabetically or topically)
- Clear entry structure
- Cross-reference related concepts
- Include examples
- Use consistent formatting

REQUIREMENTS:
- Concise, precise definitions
- Complete coverage of topic
- Easy to scan/find information
- Use definition lists
- Label all sections for cross-referencing
""",
}
```

---

## Implementation Priority

### Phase 1: Core Technical Types (MVP)
1. Programming Tutorial
2. Data Science
3. Academic Course
4. Research Paper
5. Technical Documentation

### Phase 2: Business & Reference
6. Business & Self-Help
7. Reference Guide
8. How-To Guides

### Phase 3: Creative & Specialized
9. Fiction Novel
10. Essay Collection
11. Children's Educational

---

## Universal Book Support Strategy

Since we want to support **ANY** book type, we need:

1. **Flexible Type System**: User can select from predefined types OR custom
2. **Custom Book Type Option**: User describes their book type in text, AI adapts
3. **Tone Customization**: Any tone can be specified
4. **Feature Flexibility**: All Jupyter features available regardless of type

### "Custom Book Type" Flow:
```
User selects: "Custom/Other"
↓
Prompt: "Describe your book type and style"
User types: "A visual guide to architecture with historical context and technical drawings"
↓
AI analyzes and suggests:
- Recommended features (images, figures, tables, citations)
- Structure template
- Tone
↓
Proceeds with normal flow
```

This makes LiquidBooks truly universal while providing smart defaults for common types!
