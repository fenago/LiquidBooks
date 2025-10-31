"""
Prompt Builder for LiquidBooks

Dynamically constructs AI prompts based on book type, features, and user preferences.
"""

from typing import List, Optional, Dict
from book_types import get_book_type, BookType


def build_outline_system_prompt(
    book_type_id: str,
    tone: str,
    target_audience: str,
    custom_prompt: Optional[str] = None
) -> str:
    """
    Build comprehensive system prompt for outline generation with strategic guidance

    Args:
        book_type_id: ID of the book type
        tone: Writing tone (conversational, academic, etc.)
        target_audience: Target audience level
        custom_prompt: Optional custom system prompt override

    Returns:
        Complete system prompt string with enhanced context
    """
    if custom_prompt:
        return custom_prompt

    book_type = get_book_type(book_type_id)
    if not book_type:
        return get_default_outline_prompt(tone, target_audience)

    # Build enhanced system prompt with strategic guidance
    enhanced_prompt = f"""{book_type.system_prompt}

═══════════════════════════════════════════════════════════════════════
🎯 STRATEGIC OUTLINE DESIGN PRINCIPLES
═══════════════════════════════════════════════════════════════════════

As a master book architect, you are creating an outline that serves multiple purposes:

1. **TRANSFORMATION ARCHITECTURE**
   - Map the reader's journey from current state to desired state
   - Identify key belief shifts required for transformation
   - Design emotional progression that maintains engagement
   - Create clear milestones showing progress and success

2. **PEDAGOGICAL EXCELLENCE**
   - Build knowledge progressively (prerequisite → foundation → advanced)
   - Balance theory with practical application
   - Include appropriate scaffolding for {target_audience}
   - Design for retention and long-term understanding

3. **NARRATIVE COHESION**
   - Create compelling story arc across chapters
   - Use curiosity hooks to maintain momentum
   - Build anticipation for upcoming concepts
   - Ensure each chapter earns its place in the journey

4. **ENGAGEMENT DESIGN**
   - Craft chapter titles that promise value and create curiosity
   - Plan strategic placement of examples, stories, and exercises
   - Design natural stopping points and chapter bridges
   - Create "aha moment" opportunities throughout

5. **PRACTICAL VALUE DELIVERY**
   - Every chapter must deliver immediate, actionable value
   - Include real-world applications and use cases
   - Provide concrete examples relevant to {target_audience}
   - Build toward a comprehensive framework or methodology

═══════════════════════════════════════════════════════════════════════
📚 CHAPTER CONTINUITY FRAMEWORK
═══════════════════════════════════════════════════════════════════════

For each chapter, explicitly think through:

**KNOWLEDGE FLOW:**
- What does the reader already know from previous chapters?
- What new mental models or frameworks are introduced?
- What questions from previous chapters are answered?
- What new questions are raised for future chapters?

**EMOTIONAL PROGRESSION:**
- Starting emotional state (confusion, curiosity, frustration, etc.)
- Emotional journey within the chapter
- Ending emotional state (confidence, clarity, excitement, etc.)
- Emotional setup for next chapter

**SKILL BUILDING:**
- What can the reader DO before this chapter?
- What new capabilities does this chapter unlock?
- How does this skill build toward the book's ultimate outcome?
- What practice or application opportunities are provided?

═══════════════════════════════════════════════════════════════════════
✨ BOOK TYPE ALIGNMENT: {book_type.name}
═══════════════════════════════════════════════════════════════════════

Ensure the outline aligns with these book type characteristics:
- Follows the structural conventions of {book_type.name}
- Uses appropriate depth and complexity for this format
- Incorporates recommended components: {', '.join(book_type.recommended_features[:5])}
- Maintains the expected {tone} tone throughout

Create an outline that is not just a table of contents, but a strategic blueprint for reader transformation."""

    return enhanced_prompt


def build_outline_user_prompt(
    topic: str,
    book_type_id: str,
    tone: str,
    target_audience: str,
    num_chapters: Optional[int],
    requirements: Optional[str],
    custom_prompt: Optional[str] = None
) -> str:
    """
    Build user prompt for outline generation with comprehensive context engineering

    Args:
        topic: Book topic/subject
        book_type_id: ID of the book type
        tone: Writing tone
        target_audience: Target audience
        num_chapters: Number of chapters (None = AI decides)
        requirements: Special requirements
        custom_prompt: Optional custom user prompt override

    Returns:
        Complete user prompt string with enhanced context
    """
    if custom_prompt:
        return custom_prompt

    book_type = get_book_type(book_type_id)
    chapter_guidance = ""
    if num_chapters:
        chapter_guidance = f"Include exactly {num_chapters} chapters."
    else:
        if book_type:
            min_ch, max_ch = book_type.typical_chapter_range
            chapter_guidance = f"Include {min_ch}-{max_ch} chapters (you decide the optimal number based on topic complexity and natural learning progression)."
        else:
            chapter_guidance = "Include an appropriate number of chapters for this topic."

    requirements_section = f"\n\nSPECIAL REQUIREMENTS:\n{requirements}" if requirements else ""

    # Get recommended features for this book type
    recommended_features_list = []
    if book_type:
        recommended_features_list = book_type.recommended_features

    # Get book type specific guidance
    book_type_name = book_type.name if book_type else book_type_id
    book_type_description = book_type.description if book_type else "general book"

    prompt = f"""Create a comprehensive, transformation-focused book outline about: "{topic}"

═══════════════════════════════════════════════════════════════════════
📚 BOOK SPECIFICATIONS
═══════════════════════════════════════════════════════════════════════

Book Type: {book_type_name} ({book_type_description})
Tone: {tone}
Target Audience: {target_audience}
Chapter Structure: {chapter_guidance}{requirements_section}

═══════════════════════════════════════════════════════════════════════
🎯 TRANSFORMATION BLUEPRINT APPROACH
═══════════════════════════════════════════════════════════════════════

Design this book to create a clear transformation journey:

**READER'S STARTING STATE (Before Reading):**
- What beliefs, knowledge gaps, or frustrations does the target audience have?
- What problems are they currently facing related to this topic?
- What is their current skill/awareness level?

**READER'S END STATE (After Reading):**
- What new capabilities, knowledge, or understanding will they gain?
- What transformation (skill, mindset, or behavioral) will they achieve?
- How will their approach to this topic fundamentally change?

**EMOTIONAL JOURNEY:**
Map the emotional progression: Curiosity → Understanding → Confidence → Mastery

═══════════════════════════════════════════════════════════════════════
📋 CHAPTER ARCHITECTURE PRINCIPLES
═══════════════════════════════════════════════════════════════════════

Each chapter should follow these strategic principles:

1. **Progressive Knowledge Building**: Each chapter builds on previous concepts
2. **Clear Learning Outcomes**: Readers know exactly what they'll gain
3. **Practical Application**: Every concept connects to real-world use
4. **Engagement Hooks**: Compelling chapter titles that create curiosity
5. **Narrative Continuity**: Explicit connections between chapters
6. **Cognitive Load Management**: Appropriate complexity for target audience

═══════════════════════════════════════════════════════════════════════
🔗 CHAPTER CONTINUITY REQUIREMENTS
═══════════════════════════════════════════════════════════════════════

For EACH chapter, explicitly define:

**Connection to Previous Chapter:**
- How does this chapter build on what came before?
- What prerequisite knowledge is assumed?
- What narrative thread continues from the previous chapter?

**Connection to Next Chapter:**
- How does this chapter set up the next topic?
- What questions or curiosity gaps does it create?
- What's the logical next step in the learning journey?

**Emotional State Progression:**
- Where is the reader emotionally at the START of this chapter?
- Where will they be emotionally at the END of this chapter?
- What mindset shift or confidence boost should occur?

═══════════════════════════════════════════════════════════════════════
📊 JSON OUTPUT STRUCTURE
═══════════════════════════════════════════════════════════════════════

Generate a complete JSON response with this exact structure:

{{
  "book": {{
    "title": "Compelling, curiosity-driven book title that promises transformation",
    "description": "2-3 sentences that capture the core promise, target audience pain points, and transformation delivered",
    "author": "LiquidBooks AI",
    "target_audience": "Detailed description: who they are, what they know, what they struggle with, what they want to achieve",
    "theme": "Visual and stylistic theme description appropriate for the book type and audience",
    "book_type": "{book_type_id}",
    "tone": "{tone}"
  }},
  "transformation": {{
    "before_state": "Detailed description of reader's starting state: beliefs, frustrations, knowledge level, challenges",
    "after_state": "Detailed description of reader's end state: new capabilities, mindset shifts, confidence level, achievements",
    "core_promise": "Single clear statement of what this book guarantees the reader will achieve",
    "emotional_journey": "Brief description of the emotional arc: starting emotion → transition emotions → end emotion",
    "key_belief_shifts": [
      "Old limiting belief → New empowering belief",
      "Common misconception → Accurate understanding",
      "Initial fear/concern → Confident capability"
    ]
  }},
  "chapters": [
    {{
      "chapter_number": 1,
      "title": "Compelling Chapter Title (Curiosity Hook + Clear Benefit)",
      "description": "2-3 sentences: what this chapter covers, why it matters to the reader, what transformation it enables",
      "learning_objectives": [
        "Specific, measurable, actionable objective 1",
        "Specific, measurable, actionable objective 2",
        "Specific, measurable, actionable objective 3"
      ],
      "suggested_components": [
        "code_blocks",
        "admonitions",
        "quizzes"
      ],
      "connection_to_previous": null,
      "connection_to_next": "Explicit explanation of how this chapter sets up the next chapter's content",
      "emotional_state_start": "Reader's emotional/knowledge state at chapter start",
      "emotional_state_end": "Reader's emotional/knowledge state at chapter end",
      "estimated_words": 1500,
      "key_concepts": ["Concept 1", "Concept 2", "Concept 3"],
      "real_world_relevance": "Why this chapter matters in practice"
    }}
  ],
  "recommended_features": {recommended_features_list},
  "structure_explanation": "2-3 paragraphs explaining: (1) Overall book structure and flow logic, (2) Pedagogical approach and teaching philosophy, (3) How chapters work together to create transformation",
  "narrative_arc": "Description of the overarching story/journey the book takes readers on",
  "total_estimated_words": 8000,
  "estimated_pages": 35
}}

═══════════════════════════════════════════════════════════════════════
✅ QUALITY STANDARDS
═══════════════════════════════════════════════════════════════════════

Ensure your outline demonstrates:

1. **Strategic Progression**: Clear path from beginner to proficient
2. **Compelling Hooks**: Chapter titles that make readers want to continue
3. **Practical Value**: Every chapter delivers immediate, applicable knowledge
4. **Narrative Cohesion**: Book reads as unified journey, not disconnected topics
5. **Audience Awareness**: Language and complexity appropriate for {target_audience}
6. **Transformation Focus**: Clear before/after states for the book and each chapter
7. **Engagement Design**: Structure creates momentum and maintains interest
8. **Feature Integration**: Jupyter Book components enhance learning (not decoration)

═══════════════════════════════════════════════════════════════════════
🎯 FINAL INSTRUCTION
═══════════════════════════════════════════════════════════════════════

Create an outline that doesn't just inform—it transforms. Design a learning journey that builds confidence, delivers practical value, and leaves readers fundamentally changed in their understanding of {topic}.

Return ONLY the JSON response, no other text before or after."""

    return prompt


def build_chapter_system_prompt(
    book_context: Dict,
    chapter_context: Dict,
    features: List[str],
    custom_prompt: Optional[str] = None
) -> str:
    """
    Build system prompt for chapter content generation

    Args:
        book_context: Book metadata (title, type, tone, audience)
        chapter_context: Chapter metadata (title, description, objectives, etc.)
        features: List of enabled Jupyter Book feature IDs
        custom_prompt: Optional custom system prompt override

    Returns:
        Complete system prompt string
    """
    if custom_prompt:
        return custom_prompt

    book_type = get_book_type(book_context.get('book_type', ''))
    base_prompt = book_type.system_prompt if book_type else get_default_chapter_prompt()

    # Add chapter-specific context
    chapter_prompt = f"""{base_prompt}

BOOK CONTEXT:
- Title: {book_context.get('title', 'Untitled')}
- Book Type: {book_context.get('book_type', 'general')}
- Tone: {book_context.get('tone', 'professional')}
- Target Audience: {book_context.get('target_audience', 'general readers')}

CHAPTER REQUIREMENTS:
- Chapter Number: {chapter_context.get('chapter_number', 1)}
- Chapter Title: {chapter_context.get('title', 'Untitled Chapter')}
- Description: {chapter_context.get('description', '')}
- Learning Objectives: {', '.join(chapter_context.get('learning_objectives', []))}
- Estimated Length: {chapter_context.get('estimated_words', 1500)} words

CONNECTION TO BOOK FLOW:
{f"Previous Chapter: {chapter_context.get('connection_to_previous', 'This is the first chapter')}" if chapter_context.get('connection_to_previous') else "This is the first chapter."}
{f"Next Chapter: {chapter_context.get('connection_to_next', 'This is the final chapter')}" if chapter_context.get('connection_to_next') else "This is the final chapter."}

"""

    # Add feature-specific instructions
    if features:
        chapter_prompt += "\nJUPYTER BOOK FEATURES TO INCLUDE:\n"
        chapter_prompt += get_feature_instructions(features)

    chapter_prompt += """

FORMATTING REQUIREMENTS:
- Use MyST Markdown syntax
- Start with # Chapter Title
- Use proper heading hierarchy (##, ###)
- Format code blocks with language tags
- Add proper labels for cross-references
- Include complete, working examples
- Write in the specified tone
- Target the specified audience level

Make the content engaging, educational, and well-structured!"""

    return chapter_prompt


def build_chapter_user_prompt(
    chapter_title: str,
    chapter_description: str,
    learning_objectives: List[str],
    additional_instructions: Optional[str] = None,
    custom_prompt: Optional[str] = None
) -> str:
    """
    Build user prompt for chapter content generation

    Args:
        chapter_title: Title of the chapter
        chapter_description: Description of what the chapter covers
        learning_objectives: List of learning objectives
        additional_instructions: Optional additional user instructions
        custom_prompt: Optional custom user prompt override

    Returns:
        Complete user prompt string
    """
    if custom_prompt:
        return custom_prompt

    objectives_text = "\n".join([f"- {obj}" for obj in learning_objectives])
    additional_text = f"\n\nADDITIONAL REQUIREMENTS:\n{additional_instructions}" if additional_instructions else ""

    prompt = f"""Write the complete content for this chapter:

CHAPTER: {chapter_title}

DESCRIPTION:
{chapter_description}

LEARNING OBJECTIVES:
{objectives_text}{additional_text}

Write 1500-2000 words of high-quality content using MyST Markdown syntax.
Include all requested Jupyter Book components.
Make it engaging, clear, and valuable for the target audience.

Return ONLY the chapter content in MyST Markdown format, nothing else."""

    return prompt


def get_feature_instructions(features: List[str]) -> str:
    """
    Get MyST syntax instructions for enabled features

    Args:
        features: List of feature IDs

    Returns:
        Formatted string with syntax examples
    """
    feature_syntax = {
        'code_blocks': """
- Code Blocks: Use triple backticks with language
  ```python
  def example():
      return "Hello"
  ```""",

        'code_cell_tags': """
- Code Cell with Tags: Use {code-cell} directive
  {code-cell} python
  :tags: [hide-input]
  :name: my-cell

  print("Code here")
  """,

        'math_equations': """
- Math Equations: Use $ for inline: $x^2 + y^2 = z^2$
- Display equations: $$\\int_0^1 x^2 dx$$ or with label:
  $$
  e = mc^2
  $$ (eq-label)""",

        'admonitions': """
- Admonitions: Use triple colon or backtick syntax
  ```{note}
  This is a note
  ```

  ```{warning}
  This is a warning
  ```""",

        'quizzes': """
- Quizzes: Use JSON format
  {
    "question": "What is 2 + 2?",
    "type": "multiple_choice",
    "answers": [
      {"answer": "3", "correct": false},
      {"answer": "4", "correct": true}
    ]
  }""",

        'figures': """
- Figures: Use {figure} directive
  {figure} path/to/image.png
  :name: fig-label
  :width: 80%

  Figure caption here
  """,

        'tables': """
- Tables: Use markdown table syntax
  | Header 1 | Header 2 |
  |----------|----------|
  | Cell 1   | Cell 2   |""",

        'tabs': """
- Tabs: Use {tab-set} directive
  ````{tab-set}
  ```{tab-item} Python
  Python code here
  ```
  ```{tab-item} JavaScript
  JS code here
  ```
  ````""",

        'cards': """
- Cards: Use {card} directive
  ```{card} Card Title
  Card content here
  ```""",

        'grids': """
- Grids: Use {grid} directive
  ````{grid}
  ```{grid-item}
  Content 1
  ```
  ```{grid-item}
  Content 2
  ```
  ````""",

        'dropdowns': """
- Dropdowns: Use {dropdown} directive
  ```{dropdown} Click to expand
  Hidden content here
  ```""",

        'theorems': """
- Theorems: Use {prf:theorem} directive
  ```{prf:theorem} Theorem Name
  :label: thm-label

  Theorem statement
  ```

  ```{prf:proof}
  Proof content
  ```""",

        'cross_references': """
- Cross-references: Label sections with (label)=
  (my-section)=
  ## Section Title

  Reference with {ref}`my-section`""",

        'citations': """
- Citations: Use {cite}`key` and bibliography
  Text with citation {cite}`author2023`

  ```{bibliography}
  ```""",
    }

    instructions = []
    for feature in features:
        if feature in feature_syntax:
            instructions.append(feature_syntax[feature])

    return "\n".join(instructions)


def get_default_outline_prompt(tone: str, audience: str) -> str:
    """Default system prompt for outline generation"""
    return f"""You are an expert writer creating a book outline.

WRITING APPROACH:
- Tone: {tone}
- Audience: {audience}
- Create a logical, progressive structure
- Include clear learning objectives
- Suggest appropriate interactive elements

Make it engaging and well-organized."""


def get_default_chapter_prompt() -> str:
    """Default system prompt for chapter generation"""
    return """You are an expert writer creating book content.

Write clear, engaging content that educates and inspires readers.
Use proper Markdown formatting and include relevant examples.
Make it valuable and actionable."""


def estimate_tokens(text: str) -> int:
    """
    Rough token estimation (1 token ≈ 4 characters)

    Args:
        text: Text to estimate

    Returns:
        Estimated token count
    """
    return len(text) // 4


def calculate_cost(tokens: int, model: str = "gpt-4o") -> float:
    """
    Calculate estimated cost based on token count

    Args:
        tokens: Number of tokens
        model: Model name

    Returns:
        Estimated cost in USD
    """
    # Rough pricing (as of 2025, adjust as needed)
    pricing = {
        "gpt-4o": {
            "input": 0.005 / 1000,  # $0.005 per 1K input tokens
            "output": 0.015 / 1000,  # $0.015 per 1K output tokens
        },
        "gpt-3.5-turbo": {
            "input": 0.0005 / 1000,
            "output": 0.0015 / 1000,
        }
    }

    rates = pricing.get(model, pricing["gpt-4o"])
    # Assume input:output ratio of 1:2
    input_cost = tokens * rates["input"]
    output_cost = (tokens * 2) * rates["output"]

    return round(input_cost + output_cost, 4)
