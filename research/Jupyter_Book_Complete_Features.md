# Complete Jupyter Book Feature Implementation Guide

## Overview
This document ensures LiquidBooks leverages 100% of Jupyter Book's capabilities for AI-generated content.

---

## ✅ Features We Already Have

### Basic Content
- ✅ Code blocks with syntax highlighting
- ✅ Math equations (inline `$...$` and display `$$...$$`)
- ✅ Tables (markdown and list-tables)
- ✅ Lists (ordered, unordered, nested)
- ✅ Blockquotes
- ✅ Images & Figures
- ✅ Footnotes

### Advanced Content
- ✅ Admonitions (note, warning, tip, etc.)
- ✅ Margin notes
- ✅ Sidebars
- ✅ Dropdowns (collapsible sections)
- ✅ Epigraphs
- ✅ Glossary terms
- ✅ Definition lists
- ✅ Cross-references
- ✅ Citations & Bibliography

### Sphinx Design Components
- ✅ Grids
- ✅ Cards
- ✅ Tabs
- ✅ Badges & Buttons
- ✅ Icons

### Mathematical (sphinx-proof)
- ✅ Theorems
- ✅ Proofs
- ✅ Lemmas
- ✅ Corollaries
- ✅ Definitions
- ✅ Axioms
- ✅ Propositions
- ✅ Examples
- ✅ Remarks
- ✅ Algorithms

### Interactive
- ✅ Quizzes (jupyterquiz)
- ✅ Interactive plots (Plotly, Altair, Bokeh)
- ✅ Widgets (ipywidgets)
- ✅ Thebe (live code)
- ✅ Binder launch buttons
- ✅ Colab launch buttons

---

## 🆕 Missing Features to Add

### 1. Code Cell Tags & Metadata
**What it does**: Control how code cells are displayed/executed

**MyST Syntax**:
```python
{code-cell} python
:tags: [hide-input, full-width]
:name: my-code-cell

print("Hello World")
```

**Available Tags**:
- `hide-input` - Hide source code, show output
- `hide-output` - Hide output, show source
- `hide-cell` - Hide everything
- `remove-input` - Completely remove input from build
- `remove-output` - Completely remove output
- `remove-cell` - Completely remove cell
- `full-width` - Expand cell horizontally
- `margin` - Position in right margin
- `scroll-output` - Make output scrollable
- `raises-exception` - Mark expected errors

**Feature ID**: `code_cell_tags`

---

### 2. Output Gluing
**What it does**: Embed computed values/figures directly in prose

**MyST Syntax**:
```python
# In code cell:
from myst_nb import glue
x = 42
glue("answer", x)
```

Then in text:
```markdown
The answer is {glue:}`answer`.
```

For figures:
```python
glue("my_plot", fig, display=False)
```

Reference with: `{glue:figure} my_plot`

**Feature ID**: `output_gluing`

---

### 3. Executable Notebooks (.md files with kernel)
**What it does**: Make markdown files executable like notebooks

**Front Matter Required**:
```yaml
---
jupytext:
  formats: md:myst
  text_representation:
    extension: .md
    format_name: myst
kernelspec:
  display_name: Python 3
  language: python
  name: python3
---
```

**Feature ID**: `executable_markdown`

---

### 4. Target Headers for Cross-References
**What it does**: Create linkable section IDs

**MyST Syntax**:
```markdown
(my-label)=
## Section Title

Reference it: {ref}`my-label` or [text](my-label)
```

**Feature ID**: `target_headers`

---

### 5. Numbered References
**What it does**: Auto-number figures/tables/sections

**MyST Syntax**:
```markdown
{figure} path/to/image.png
:name: fig-label

Caption text
```

Reference: `{numref}`Figure %s <fig-label>`` or `{numref}`fig-label``

**Feature ID**: `numbered_references`

---

### 6. Line Comments
**What it does**: Hide content from output

**MyST Syntax**:
```markdown
% This is a comment that won't appear in the built book
% Useful for internal notes
```

**Feature ID**: `line_comments`

---

### 7. Block Breaks
**What it does**: Separate content blocks with metadata

**MyST Syntax**:
```markdown
+++ {"class": "special"}

Content in special block

+++
```

**Feature ID**: `block_breaks`

---

### 8. HTML Blocks
**What it does**: Embed raw HTML

**MyST Syntax**:
```html
<div class="custom-class">
  <p>Custom HTML content</p>
</div>
```

**Feature ID**: `html_blocks`

---

### 9. Reference-Style Links
**What it does**: Cleaner link management

**MyST Syntax**:
```markdown
[link text][ref-key]

[ref-key]: https://example.com "Optional title"
```

**Feature ID**: `reference_links`

---

### 10. Math Equation Labels
**What it does**: Number and reference equations

**MyST Syntax**:
```markdown
$$
e = mc^2
$$ (eq-einstein)

Reference it: {eq}`eq-einstein`
```

Or with directive:
```markdown
{math}
:label: my-equation

\int_0^1 x^2 dx
```

**Feature ID**: `equation_labels`

---

### 11. Thematic Breaks
**What it does**: Horizontal rule separators

**MyST Syntax**:
```markdown
---
```

**Feature ID**: `thematic_breaks`

---

### 12. MyST Document Roles
**What it does**: Link to other pages in the book

**MyST Syntax**:
```markdown
{doc}`path/to/other-page`
{doc}`Custom text <path/to/page>`
```

**Feature ID**: `doc_references`

---

## 🔧 Backend _config.yml Enhancements

### Current Config
```yaml
title: "Book Title"
author: "Author Name"

execute:
  execute_notebooks: auto
  timeout: 100

sphinx:
  extra_extensions:
    - jupyterquiz
```

### Enhanced Config (All Features)
```yaml
title: "Book Title"
author: "Author Name"
logo: "path/to/logo.png"  # Optional book logo

# Execution settings
execute:
  execute_notebooks: auto  # or 'force', 'cache', 'off'
  timeout: 180
  allow_errors: false  # Set true to allow error cells
  run_in_temp: false
  exclude_patterns:
    - "_build"
    - "Thumbs.db"
    - ".DS_Store"

# Parse settings for MyST
parse:
  myst_enable_extensions:
    - amsmath        # LaTeX math environments
    - colon_fence    # ::: fence syntax
    - deflist        # Definition lists
    - dollarmath     # $$ math syntax
    - html_admonition # HTML admonitions
    - html_image     # HTML image syntax
    - linkify        # Auto-link URLs
    - replacements   # Text replacements
    - smartquotes    # Smart quotes
    - substitution   # Variable substitution
    - tasklist       # GitHub-style task lists
  myst_url_schemes:
    - http
    - https
    - mailto

# LaTeX/PDF output settings
latex:
  latex_documents:
    targetname: book.tex
  latex_engine: pdflatex

# Bibliography
bibtex_bibfiles:
  - references.bib
bibtex_reference_style: author_year  # or 'label'

# Repository settings
repository:
  url: https://github.com/user/repo
  path_to_book: ""
  branch: main

# HTML theme settings
html:
  favicon: ""
  use_edit_page_button: true
  use_repository_button: true
  use_issues_button: true
  use_multitoc_numbering: true
  baseurl: ""
  analytics:
    google_analytics_id: ""
  comments:
    hypothesis: false
    utterances:
      repo: ""
  announcement: ""
  extra_footer: |
    <div>
      Generated by <a href="https://liquidbooks.app">LiquidBooks</a>
    </div>
  home_page_in_navbar: true

# Sphinx configuration
sphinx:
  extra_extensions:
    - sphinx_design        # Cards, grids, tabs
    - sphinx_proof         # Theorems, proofs
    - sphinxcontrib.mermaid  # Mermaid diagrams
    - sphinx_togglebutton  # Toggle buttons
    - sphinx_copybutton    # Copy button for code
    - jupyterquiz          # Interactive quizzes
    - sphinx.ext.autodoc   # Python docstring docs
    - sphinx.ext.napoleon  # Google/NumPy style docstrings
    - sphinx.ext.viewcode  # Source code links
  config:
    html_theme: sphinx_book_theme
    html_theme_options:
      repository_url: https://github.com/user/repo
      use_repository_button: true
      use_issues_button: true
      use_edit_page_button: true
      use_download_button: true
      launch_buttons:
        binderhub_url: https://mybinder.org
        colab_url: https://colab.research.google.com
        notebook_interface: jupyterlab
        thebe: true
      home_page_in_navbar: false
      search_bar_text: "Search..."
    nb_custom_formats:
      .md:
        - jupytext.reads
        - fmt: mystnb
    myst_heading_anchors: 3
    copybutton_prompt_text: "$"

# Launch buttons configuration
launch_buttons:
  binderhub_url: https://mybinder.org
  colab_url: https://colab.research.google.com
  notebook_interface: jupyterlab
  thebe: true
  thebe_config:
    repository_url: https://github.com/user/repo
    repository_branch: main
    selector: ".thebe"
```

---

## 📝 Updated Feature List for Frontend

Add these to `jupyterFeatures.ts`:

```typescript
// Add to existing features
{
  id: 'code_cell_tags',
  name: 'Code Cell Tags',
  description: 'Control code cell visibility (hide-input, remove-output, etc.)',
  category: 'advanced',
  enabled: false,
},
{
  id: 'output_gluing',
  name: 'Output Gluing',
  description: 'Embed computed values and figures inline in text',
  category: 'interactive',
  enabled: false,
},
{
  id: 'executable_markdown',
  name: 'Executable Markdown',
  description: 'Markdown files that execute like notebooks',
  category: 'interactive',
  enabled: false,
},
{
  id: 'target_headers',
  name: 'Labeled Headers',
  description: 'Create referenceable section labels with (label)= syntax',
  category: 'advanced',
  enabled: false,
},
{
  id: 'numbered_references',
  name: 'Numbered References',
  description: 'Auto-number figures, tables, and equations with {numref}',
  category: 'advanced',
  enabled: false,
},
{
  id: 'equation_labels',
  name: 'Equation Labels',
  description: 'Label and reference mathematical equations',
  category: 'mathematical',
  enabled: false,
},
{
  id: 'mermaid_diagrams',
  name: 'Mermaid Diagrams',
  description: 'Flowcharts, sequence diagrams, and more using Mermaid',
  category: 'layout',
  enabled: false,
},
{
  id: 'task_lists',
  name: 'Task Lists',
  description: 'GitHub-style checkable task lists',
  category: 'basic',
  enabled: false,
},
```

---

## 🤖 AI Prompt Enhancements

### System Prompt Template by Feature Category

When generating content, the system prompt should be dynamically built:

```python
def build_system_prompt(features: List[str], book_type: str) -> str:
    base = """You are an expert technical writer creating educational content for Jupyter Books.

Your content MUST use MyST Markdown syntax and showcase Jupyter Book's capabilities."""

    # Add feature-specific instructions
    feature_prompts = {
        'code_blocks': """
- Use triple backtick code blocks with language tags
- Include realistic, well-commented examples
- Show both input and output""",

        'code_cell_tags': """
- Use {code-cell} directive instead of triple backticks
- Add :tags: [hide-input] for solutions
- Use :tags: [remove-output] for large outputs
- Add :name: labels for referencing""",

        'math_equations': """
- Use $ for inline math: $x^2 + y^2 = z^2$
- Use $$ for display equations
- Label important equations: $$ ... $$ (eq-label)
- Reference with {eq}`eq-label`""",

        'admonitions': """
- Use diverse admonitions: note, warning, tip, important, caution
- Format: ```{note} or ```{warning}
- Add custom titles with ::: {note} Title""",

        'figures': """
- Use {figure} directive with :name: labels
- Add captions below images
- Reference with {numref}`fig-label`""",

        'cross_references': """
- Label sections with (label)= before headers
- Reference with {ref}`label` or [text](label)
- Use {doc}`path/to/page` for document links""",

        'dropdowns': """
- Create expandable sections:
  ```{dropdown} Title
  Hidden content here
  ```""",

        'tabs': """
- Use tabs for alternative content:
  ````{tab-set}
  ```{tab-item} Python
  Python code
  ```
  ```{tab-item} JavaScript
  JS code
  ```
  ````""",

        'cards': """
- Use cards for visual highlights:
  ```{card} Card Title
  Card content
  ```""",

        'grids': """
- Layout content in grids:
  ````{grid}
  ```{grid-item}
  Content 1
  ```
  ```{grid-item}
  Content 2
  ```
  ````""",

        'theorems': """
- Use proof directives:
  ```{prf:theorem} Theorem Name
  Theorem statement
  ```
  ```{prf:proof}
  Proof content
  ```""",

        'quizzes': """
- Add interactive quizzes at section ends
- Use jupyterquiz JSON format
- Include 3-5 questions per quiz""",

        'glossary': """
- Define terms: {term}`definition`
- Create glossary section with definitions""",

        'citations': """
- Cite sources: {cite}`author2023`
- Add bibliography section""",
    }

    # Build final prompt
    enabled_instructions = [feature_prompts[f] for f in features if f in feature_prompts]

    return base + "\n\nUSE THESE FEATURES:\n" + "\n".join(enabled_instructions)
```

---

## 🎯 Book Type System Prompts

### Article (2000-3000 words, single chapter)
```
Write a focused academic article with:
- Abstract (150-200 words)
- Clear thesis statement
- Evidence-based arguments
- Academic citations
- Conclusion with implications
```

### Book (5-15 chapters, comprehensive)
```
Write a comprehensive educational book with:
- Progressive chapter difficulty
- Each chapter 1500-2000 words
- Exercises/quizzes per chapter
- Clear learning objectives
- Recap sections
```

### Course (Module-based, highly structured)
```
Design an online course with:
- Learning objectives per lesson
- Hands-on exercises
- Checkpoints/quizzes after each module
- Project-based final assessment
- Downloadable resources
```

### Research (Academic paper format)
```
Write an academic research paper with:
- Abstract
- Introduction (background, motivation, contributions)
- Related Work
- Methodology
- Results & Analysis
- Discussion
- Conclusion & Future Work
- References section
```

---

## ✅ Action Items

1. **Update Backend**:
   - Add `build_system_prompt()` function
   - Enhance `_config.yml` generation with all extensions
   - Add book_type parameter to API

2. **Update Frontend**:
   - Add missing features to `jupyterFeatures.ts`
   - Add book_type selector to wizard
   - Send features array to backend

3. **Update AI Prompts**:
   - Include MyST syntax examples for each feature
   - Specify directive formats
   - Add feature-specific instructions

4. **Testing**:
   - Generate sample books with each book_type
   - Verify all features render correctly
   - Test all MyST syntax variations
