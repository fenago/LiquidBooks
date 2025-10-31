"""
Artifact Types Configuration for LiquidBooks
Defines all supported artifact types with metadata and prompt templates
"""

from typing import List, Dict, Any
from enum import Enum


class ArtifactCategory(str, Enum):
    """Categories of artifacts that can be generated"""
    IMAGE = "image"
    VIDEO = "video"
    DIAGRAM = "diagram"
    INTERACTIVE = "interactive"
    CODE = "code"


class ArtifactType:
    """Definition of a specific artifact type"""

    def __init__(
        self,
        id: str,
        name: str,
        category: ArtifactCategory,
        description: str,
        tool: str,
        prompt_template: str,
        placement_guidelines: List[str],
        file_extension: str,
        example_use_cases: List[str]
    ):
        self.id = id
        self.name = name
        self.category = category
        self.description = description
        self.tool = tool
        self.prompt_template = prompt_template
        self.placement_guidelines = placement_guidelines
        self.file_extension = file_extension
        self.example_use_cases = example_use_cases


# ═══════════════════════════════════════════════════════════════════════
# IMAGE ARTIFACTS (nano banana)
# ═══════════════════════════════════════════════════════════════════════

IMAGE_ARTIFACTS = [
    ArtifactType(
        id="chapter_hero_image",
        name="Chapter Hero Image",
        category=ArtifactCategory.IMAGE,
        description="Visually striking opening image that captures chapter theme",
        tool="nano_banana",
        prompt_template="""Create a professional, engaging hero image for a book chapter titled "{chapter_title}".

Context:
- Book Topic: {book_title}
- Chapter Theme: {chapter_description}
- Target Audience: {target_audience}
- Tone: {tone}

Style Requirements:
- Professional and polished
- Relevant to the chapter's core concept
- Visually appealing and engaging
- Suitable for educational/professional content
- High contrast and clear composition

Image should: {specific_requirements}""",
        placement_guidelines=[
            "Place at the very top of the chapter, before any text",
            "Center-align the image",
            "Add a subtle caption if needed",
            "Ensure image width is appropriate for readability"
        ],
        file_extension=".png",
        example_use_cases=[
            "Opening visual for introduction chapters",
            "Thematic representation of chapter concepts",
            "Mood-setting imagery for storytelling chapters"
        ]
    ),

    ArtifactType(
        id="concept_illustration",
        name="Concept Illustration",
        category=ArtifactCategory.IMAGE,
        description="Visual representation of abstract concepts or ideas",
        tool="nano_banana",
        prompt_template="""Create a clear, educational illustration explaining the concept: "{concept_name}".

Context:
- Main Concept: {concept_description}
- Supporting Details: {supporting_details}
- Target Audience: {target_audience}
- Educational Level: {education_level}

Visual Requirements:
- Clear and easy to understand
- Educational style (infographic-like)
- Use labels or annotations if helpful
- Professional color scheme
- Suitable for print and digital

The illustration should help readers understand: {learning_objective}""",
        placement_guidelines=[
            "Place near the introduction of the concept",
            "Add descriptive caption explaining the illustration",
            "Reference in text: 'See Figure X'",
            "Keep text minimal on the image itself"
        ],
        file_extension=".png",
        example_use_cases=[
            "Explaining complex systems or processes",
            "Visualizing abstract theories",
            "Showing relationships between concepts"
        ]
    ),

    ArtifactType(
        id="before_after_visual",
        name="Before/After Transformation Visual",
        category=ArtifactCategory.IMAGE,
        description="Split visual showing transformation or comparison",
        tool="nano_banana",
        prompt_template="""Create a before/after comparison image showing the transformation: "{transformation_description}".

Before State:
{before_description}

After State:
{after_description}

Style Requirements:
- Clear left/right or top/bottom split
- Label "Before" and "After" sections
- Use contrasting visual elements to show difference
- Professional, educational style
- Easy to understand at a glance

Target Audience: {target_audience}
Context: {context}""",
        placement_guidelines=[
            "Place when introducing transformation concepts",
            "Use in problem-solution sections",
            "Add caption explaining the transformation",
            "Reference explicitly in surrounding text"
        ],
        file_extension=".png",
        example_use_cases=[
            "Showing skill progression",
            "Demonstrating methodology improvements",
            "Visualizing mindset shifts"
        ]
    ),

    ArtifactType(
        id="process_visual",
        name="Process Visualization",
        category=ArtifactCategory.IMAGE,
        description="Step-by-step visual representation of a process",
        tool="nano_banana",
        prompt_template="""Create a visual representation of the following process: "{process_name}".

Process Steps:
{numbered_steps}

Visual Requirements:
- Show clear progression from step to step
- Use arrows or connectors to show flow
- Number each step clearly
- Professional, clean design
- Use icons or simple illustrations for each step
- Suitable for {target_audience}

Context: {context}
Tone: {tone}""",
        placement_guidelines=[
            "Place before detailed explanation of the process",
            "Add numbered captions matching the steps",
            "Reference in text when explaining each step",
            "Consider making it a foldable/expandable element"
        ],
        file_extension=".png",
        example_use_cases=[
            "Workflow visualizations",
            "Step-by-step tutorials",
            "Methodology explanations"
        ]
    )
]


# ═══════════════════════════════════════════════════════════════════════
# VIDEO ARTIFACTS (Sora 2 / Veo 3)
# ═══════════════════════════════════════════════════════════════════════

VIDEO_ARTIFACTS = [
    ArtifactType(
        id="concept_animation",
        name="Concept Animation",
        category=ArtifactCategory.VIDEO,
        description="Short animated explanation of a concept",
        tool="sora_2",  # or veo_3
        prompt_template="""Create a 15-30 second animation explaining: "{concept_name}".

Concept Overview:
{concept_description}

Key Points to Visualize:
{key_points}

Animation Style:
- Clean, professional motion graphics
- Educational and clear
- Smooth transitions
- Subtle background music (optional)
- Text overlays for key points

Target Audience: {target_audience}
Tone: {tone}

The animation should help viewers understand: {learning_objective}""",
        placement_guidelines=[
            "Embed early in the section introducing the concept",
            "Add play/pause controls",
            "Include transcript or caption option",
            "Keep video short (under 30 seconds)"
        ],
        file_extension=".mp4",
        example_use_cases=[
            "Explaining complex algorithms",
            "Demonstrating system interactions",
            "Visualizing data flows"
        ]
    ),

    ArtifactType(
        id="tutorial_demonstration",
        name="Tutorial Demonstration",
        category=ArtifactCategory.VIDEO,
        description="Step-by-step video tutorial showing a process",
        tool="sora_2",
        prompt_template="""Create a tutorial video demonstrating: "{tutorial_topic}".

Steps to Demonstrate:
{tutorial_steps}

Video Requirements:
- Clear, focused shots of each step
- Smooth transitions between steps
- Optional: text overlays highlighting key actions
- Professional, educational style
- Duration: {estimated_duration}

Context: {context}
Target Audience: {target_audience}

The video should clearly show: {demonstration_goals}""",
        placement_guidelines=[
            "Place in hands-on or tutorial sections",
            "Add chapter markers for each step",
            "Include link to download any resources shown",
            "Provide text summary below video"
        ],
        file_extension=".mp4",
        example_use_cases=[
            "Code walkthroughs",
            "Tool demonstrations",
            "Practical implementations"
        ]
    ),

    ArtifactType(
        id="transformation_story",
        name="Transformation Story Video",
        category=ArtifactCategory.VIDEO,
        description="Narrative video showing transformation journey",
        tool="veo_3",
        prompt_template="""Create a narrative video showing the transformation story: "{story_title}".

Story Arc:
Beginning State: {beginning_description}
Challenge/Problem: {challenge_description}
Turning Point: {turning_point}
Resolution/Transformation: {resolution_description}

Video Style:
- Cinematic, emotionally engaging
- Use visual metaphors
- Subtle background music to enhance emotion
- Duration: 30-60 seconds
- Professional narration (optional)

Target Audience: {target_audience}
Emotional Tone: {emotional_tone}

The video should make viewers feel: {desired_emotional_impact}""",
        placement_guidelines=[
            "Use in storytelling or case study chapters",
            "Place at beginning or end of major sections",
            "Add emotional impact to transformation moments",
            "Include optional transcript"
        ],
        file_extension=".mp4",
        example_use_cases=[
            "Hero's journey sequences",
            "Case study introductions",
            "Motivational section openers"
        ]
    )
]


# ═══════════════════════════════════════════════════════════════════════
# DIAGRAM ARTIFACTS (Mermaid.js)
# ═══════════════════════════════════════════════════════════════════════

DIAGRAM_ARTIFACTS = [
    ArtifactType(
        id="flowchart",
        name="Flowchart Diagram",
        category=ArtifactCategory.DIAGRAM,
        description="Flowchart showing decision trees or process flows",
        tool="mermaid",
        prompt_template="""Create a Mermaid.js flowchart for: "{flowchart_title}".

Process Description:
{process_description}

Key Decision Points:
{decision_points}

Flow Requirements:
- Start with clear entry point
- Show all decision branches
- End with clear outcomes
- Use appropriate shapes (rectangles for process, diamonds for decisions)
- Keep it readable and not too complex

Generate valid Mermaid.js syntax starting with: flowchart TD""",
        placement_guidelines=[
            "Place in sections describing processes or workflows",
            "Add title above the diagram",
            "Reference decision points in surrounding text",
            "Consider making it interactive (clickable nodes)"
        ],
        file_extension=".mmd",
        example_use_cases=[
            "Decision-making processes",
            "Algorithm flowcharts",
            "Troubleshooting guides"
        ]
    ),

    ArtifactType(
        id="sequence_diagram",
        name="Sequence Diagram",
        category=ArtifactCategory.DIAGRAM,
        description="Sequence diagram showing interactions over time",
        tool="mermaid",
        prompt_template="""Create a Mermaid.js sequence diagram for: "{interaction_title}".

Participants:
{participants}

Interaction Sequence:
{interaction_steps}

Diagram Requirements:
- Show clear message flow between participants
- Include activations where appropriate
- Add notes for important details
- Keep timing/order clear
- Use appropriate arrow types

Generate valid Mermaid.js syntax starting with: sequenceDiagram""",
        placement_guidelines=[
            "Use when explaining system interactions",
            "Place near API or protocol explanations",
            "Add numbered references to key messages",
            "Include legend if needed"
        ],
        file_extension=".mmd",
        example_use_cases=[
            "API call sequences",
            "Communication protocols",
            "Event-driven interactions"
        ]
    ),

    ArtifactType(
        id="class_diagram",
        name="Class/Entity Diagram",
        category=ArtifactCategory.DIAGRAM,
        description="Class or entity relationship diagram",
        tool="mermaid",
        prompt_template="""Create a Mermaid.js class diagram for: "{system_name}".

Classes/Entities:
{classes_description}

Relationships:
{relationships_description}

Diagram Requirements:
- Show all important classes/entities
- Include key attributes and methods
- Show relationships with proper notation
- Keep it organized and readable
- Use appropriate relationship types

Generate valid Mermaid.js syntax starting with: classDiagram""",
        placement_guidelines=[
            "Use in architecture or design sections",
            "Place when introducing system structure",
            "Reference classes in code examples",
            "Add brief description of each entity"
        ],
        file_extension=".mmd",
        example_use_cases=[
            "Object-oriented design",
            "Database schema",
            "System architecture"
        ]
    ),

    ArtifactType(
        id="mind_map",
        name="Mind Map",
        category=ArtifactCategory.DIAGRAM,
        description="Mind map showing concept relationships",
        tool="mermaid",
        prompt_template="""Create a Mermaid.js mind map for: "{central_concept}".

Central Concept: {central_concept}

Main Branches:
{main_branches}

Sub-concepts:
{sub_concepts}

Mind Map Requirements:
- Central node with main concept
- Radial structure with main branches
- Sub-branches for related concepts
- Keep it balanced and readable
- Use colors/icons if possible

Generate valid Mermaid.js syntax starting with: mindmap""",
        placement_guidelines=[
            "Use for conceptual overviews",
            "Place at chapter beginnings",
            "Show relationships between ideas",
            "Great for brainstorming or planning sections"
        ],
        file_extension=".mmd",
        example_use_cases=[
            "Topic overviews",
            "Concept relationships",
            "Chapter summaries"
        ]
    ),

    ArtifactType(
        id="gantt_chart",
        name="Gantt Chart",
        category=ArtifactCategory.DIAGRAM,
        description="Timeline/project planning chart",
        tool="mermaid",
        prompt_template="""Create a Mermaid.js Gantt chart for: "{project_name}".

Project Phases:
{project_phases}

Timeline:
{timeline_description}

Chart Requirements:
- Show clear start and end dates
- Include milestones
- Show dependencies if any
- Use sections for different phases
- Keep it readable

Generate valid Mermaid.js syntax starting with: gantt""",
        placement_guidelines=[
            "Use in project planning chapters",
            "Show learning progression timelines",
            "Visualize implementation schedules",
            "Add milestone markers"
        ],
        file_extension=".mmd",
        example_use_cases=[
            "Project timelines",
            "Learning roadmaps",
            "Implementation schedules"
        ]
    )
]


# ═══════════════════════════════════════════════════════════════════════
# INTERACTIVE ARTIFACTS
# ═══════════════════════════════════════════════════════════════════════

INTERACTIVE_ARTIFACTS = [
    ArtifactType(
        id="quiz",
        name="Interactive Quiz",
        category=ArtifactCategory.INTERACTIVE,
        description="Multiple choice or true/false quiz for knowledge testing",
        tool="custom_component",
        prompt_template="""Create an interactive quiz for chapter: "{chapter_title}".

Learning Objectives Covered:
{learning_objectives}

Quiz Requirements:
- {num_questions} questions total
- Mix of difficulty levels
- Immediate feedback on answers
- Explanation for each answer
- Track score

Question Format:
{question_format}

Context: {chapter_context}""",
        placement_guidelines=[
            "Place at end of chapters or sections",
            "Add 'Test Your Knowledge' heading",
            "Show results with explanations",
            "Allow retaking the quiz"
        ],
        file_extension=".json",
        example_use_cases=[
            "End-of-chapter assessments",
            "Concept checks",
            "Practice problems"
        ]
    ),

    ArtifactType(
        id="code_playground",
        name="Interactive Code Playground",
        category=ArtifactCategory.INTERACTIVE,
        description="Embedded code editor with live execution",
        tool="jupyterbook_thebe",
        prompt_template="""Create an interactive code playground for: "{exercise_title}".

Code Exercise:
{exercise_description}

Starter Code:
```{language}
{starter_code}
```

Expected Outcome:
{expected_outcome}

Playground Configuration:
- Language: {language}
- Allow editing: {editable}
- Show output: {show_output}
- Include hints: {hints}""",
        placement_guidelines=[
            "Place in tutorial or hands-on sections",
            "Provide starter code",
            "Add 'Try it yourself' prompt",
            "Include solution toggle"
        ],
        file_extension=".ipynb",
        example_use_cases=[
            "Code tutorials",
            "Algorithm demonstrations",
            "Live coding exercises"
        ]
    ),

    ArtifactType(
        id="interactive_visualization",
        name="Interactive Data Visualization",
        category=ArtifactCategory.INTERACTIVE,
        description="Dynamic charts or graphs readers can interact with",
        tool="plotly",
        prompt_template="""Create an interactive visualization for: "{visualization_title}".

Data Description:
{data_description}

Visualization Type: {chart_type}

Interactive Features:
- Hover tooltips: {tooltips_enabled}
- Zoom/pan: {zoom_enabled}
- Filter controls: {filters}
- Animation: {animation_enabled}

Context: {context}
Learning Goal: {learning_goal}""",
        placement_guidelines=[
            "Place when introducing data concepts",
            "Add controls for user interaction",
            "Include brief usage instructions",
            "Show example interactions"
        ],
        file_extension=".html",
        example_use_cases=[
            "Data exploration",
            "Statistical concepts",
            "Dynamic dashboards"
        ]
    ),

    ArtifactType(
        id="collapsible_section",
        name="Collapsible Content Section",
        category=ArtifactCategory.INTERACTIVE,
        description="Expandable/collapsible content for optional details",
        tool="sphinx_design",
        prompt_template="""Create a collapsible section for: "{section_title}".

Summary/Preview Text:
{summary_text}

Full Content:
{full_content}

Section Style:
- Collapsed by default: {collapsed_default}
- Icon: {icon}
- Style: {style}

Use this for: {use_case}""",
        placement_guidelines=[
            "Use for optional advanced content",
            "Place supplementary information",
            "Add detailed examples",
            "Include bonus material"
        ],
        file_extension=".md",
        example_use_cases=[
            "Advanced topics",
            "Detailed proofs",
            "Supplementary examples"
        ]
    )
]


# ═══════════════════════════════════════════════════════════════════════
# ALL ARTIFACTS REGISTRY
# ═══════════════════════════════════════════════════════════════════════

ALL_ARTIFACTS = (
    IMAGE_ARTIFACTS +
    VIDEO_ARTIFACTS +
    DIAGRAM_ARTIFACTS +
    INTERACTIVE_ARTIFACTS
)


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_artifact_by_id(artifact_id: str) -> ArtifactType | None:
    """Get artifact type by ID"""
    return next((a for a in ALL_ARTIFACTS if a.id == artifact_id), None)


def get_artifacts_by_category(category: ArtifactCategory) -> List[ArtifactType]:
    """Get all artifacts of a specific category"""
    return [a for a in ALL_ARTIFACTS if a.category == category]


def get_artifact_categories() -> List[str]:
    """Get list of all artifact categories"""
    return [cat.value for cat in ArtifactCategory]


def suggest_artifacts_for_content(
    content_type: str,
    chapter_description: str,
    learning_objectives: List[str]
) -> List[str]:
    """
    Suggest appropriate artifact types based on content analysis
    Returns list of artifact IDs
    """
    suggestions = []

    content_lower = (content_type + " " + chapter_description).lower()

    # Image suggestions
    if any(word in content_lower for word in ["visual", "concept", "abstract", "explain", "illustrate"]):
        suggestions.append("concept_illustration")

    if any(word in content_lower for word in ["transformation", "before", "after", "change", "improve"]):
        suggestions.append("before_after_visual")

    if any(word in content_lower for word in ["process", "workflow", "steps", "procedure"]):
        suggestions.append("process_visual")

    # Always suggest hero image for chapters
    suggestions.append("chapter_hero_image")

    # Diagram suggestions
    if any(word in content_lower for word in ["algorithm", "decision", "flow", "process"]):
        suggestions.append("flowchart")

    if any(word in content_lower for word in ["system", "interaction", "api", "communication"]):
        suggestions.append("sequence_diagram")

    if any(word in content_lower for word in ["architecture", "structure", "design", "model"]):
        suggestions.append("class_diagram")

    if any(word in content_lower for word in ["concept", "overview", "relationship", "connection"]):
        suggestions.append("mind_map")

    # Interactive suggestions
    if "tutorial" in content_type.lower() or any(word in content_lower for word in ["code", "programming", "exercise"]):
        suggestions.append("code_playground")

    if any(word in content_lower for word in ["test", "practice", "quiz", "assessment"]):
        suggestions.append("quiz")

    if any(word in content_lower for word in ["data", "chart", "graph", "visualization"]):
        suggestions.append("interactive_visualization")

    # Video suggestions for specific cases
    if any(word in content_lower for word in ["story", "journey", "transformation", "case study"]):
        suggestions.append("transformation_story")

    if "tutorial" in content_type.lower():
        suggestions.append("tutorial_demonstration")

    return list(set(suggestions))  # Remove duplicates
