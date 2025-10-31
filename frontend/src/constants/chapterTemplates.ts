export interface ChapterTemplate {
  id: string;
  name: string;
  description: string;
  structure: string[];
  example: string;
}

export const CHAPTER_TEMPLATES: ChapterTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Chapter',
    description: 'Traditional chapter structure with introduction, body, and conclusion',
    structure: [
      'Introduction (hook and overview)',
      'Main Content (3-5 sections)',
      'Examples and Demonstrations',
      'Summary and Key Takeaways',
      'Exercises/Questions'
    ],
    example: `# Chapter Title

## Introduction
Brief overview and learning objectives...

## Section 1: Main Concept
Content here...

## Section 2: Deep Dive
Content here...

## Section 3: Application
Content here...

## Summary
Key takeaways...

## Practice Exercises
Questions and exercises...`
  },
  {
    id: 'tutorial',
    name: 'Tutorial/Hands-On',
    description: 'Step-by-step tutorial with practical examples',
    structure: [
      'Learning Objectives',
      'Prerequisites',
      'Step-by-Step Instructions',
      'Code Examples',
      'Common Issues and Solutions',
      'Practice Projects'
    ],
    example: `# Chapter Title

## What You'll Learn
- Objective 1
- Objective 2

## Prerequisites
What you need to know...

## Step 1: Setup
Instructions...

## Step 2: Implementation
Code and explanation...

## Troubleshooting
Common issues...

## Practice
Build it yourself...`
  },
  {
    id: 'theory',
    name: 'Theory/Conceptual',
    description: 'Focus on concepts, theory, and understanding',
    structure: [
      'Core Concepts Introduction',
      'Theoretical Foundation',
      'Mathematical/Logical Framework',
      'Real-World Applications',
      'Discussion Questions'
    ],
    example: `# Chapter Title

## Core Concepts
Introduction to main ideas...

## Theoretical Foundation
Deep dive into theory...

## Mathematical Framework
Equations and proofs...

## Applications
How theory applies...

## Discussion
Thought-provoking questions...`
  },
  {
    id: 'case_study',
    name: 'Case Study',
    description: 'Real-world example with analysis and lessons',
    structure: [
      'Background and Context',
      'Problem Statement',
      'Approach and Methodology',
      'Implementation Details',
      'Results and Analysis',
      'Lessons Learned'
    ],
    example: `# Chapter Title

## Background
Context setting...

## The Problem
What needed to be solved...

## Our Approach
How we tackled it...

## Implementation
What we built...

## Results
What we achieved...

## Key Lessons
What we learned...`
  },
  {
    id: 'comparison',
    name: 'Comparison/Analysis',
    description: 'Compare and contrast different approaches or tools',
    structure: [
      'Introduction to Options',
      'Option A: Overview and Analysis',
      'Option B: Overview and Analysis',
      'Side-by-Side Comparison',
      'Decision Framework',
      'Recommendations'
    ],
    example: `# Chapter Title

## Introduction
What we're comparing...

## Option A
Detailed analysis...

## Option B
Detailed analysis...

## Comparison
Side-by-side analysis...

## When to Use What
Decision framework...

## Recommendations
Our suggestions...`
  },
  {
    id: 'reference',
    name: 'Reference/Documentation',
    description: 'Comprehensive reference material',
    structure: [
      'Overview',
      'Complete API/Feature List',
      'Detailed Specifications',
      'Usage Examples',
      'Best Practices',
      'Troubleshooting Guide'
    ],
    example: `# Chapter Title

## Overview
What this covers...

## API Reference
Complete listing...

## Parameters
Detailed specs...

## Examples
Usage examples...

## Best Practices
Guidelines...

## Troubleshooting
Common issues...`
  },
  {
    id: 'storytelling',
    name: 'Storytelling/Narrative',
    description: 'Narrative-driven chapter with story arc',
    structure: [
      'Hook/Opening Scene',
      'Rising Action',
      'Key Moments',
      'Resolution',
      'Reflection/Takeaway'
    ],
    example: `# Chapter Title

## Opening
Engaging hook...

## The Journey
Story development...

## Key Moment
Pivotal scene...

## Resolution
How it ended...

## Reflection
What it means...`
  },
  {
    id: 'problem_solution',
    name: 'Problem-Solution',
    description: 'Present a problem and walk through the solution',
    structure: [
      'The Problem',
      'Why It Matters',
      'Potential Approaches',
      'The Solution',
      'Step-by-Step Implementation',
      'Verification and Testing'
    ],
    example: `# Chapter Title

## The Problem
What needs solving...

## Why This Matters
Impact and importance...

## Approaches Considered
Different options...

## Our Solution
The chosen approach...

## Implementation
How to build it...

## Testing
Verify it works...`
  },
  {
    id: 'persuasive_learning',
    name: 'Persuasive Learning (5-Phase)',
    description: 'Advanced psychological framework for transformation-focused content',
    structure: [
      'Phase 1: Pre-Suasion Setup (State Check-In, Value Statement, Authority Quote)',
      'Phase 2: Emotional Engagement (Opening Story, Belief Validation, Problem Agitation)',
      'Phase 3: Logical Teaching (Core Framework, Evidence Stack, Truth + Benefit + Story)',
      'Phase 4: Application Bridge (Real-World Example, Immediate Actions, Future State Vision)',
      'Phase 5: Momentum Maintenance (Chapter Summary, Next Chapter Tease, Belief Bridge)'
    ],
    example: `# Chapter Title

## Phase 1: Pre-Suasion Setup

### 📍 Where You Are Now → Where You're Going
Before this chapter: [Current state, beliefs, frustrations]
After this chapter: [Desired state, new understanding]

### 💎 Why This Chapter Matters
[Clear ROI and value of this knowledge]

### ✒️ Authority Perspective
> "[Powerful quote that sets psychological tone]"
> — [Authority Figure Relevant to Audience]

---

## Phase 2: Emotional Engagement

### 🧶 The Story That Changes Everything
[Compelling narrative with relatable character, emotional impact, sets up the lesson]

### 🤝 You're Not Alone
[Making reader feel seen and understood - belief validation]

### 🔥 The Real Cost of Not Knowing This
[Problem agitation - what's at stake]

---

## Phase 3: Logical Teaching

### 💡 The Core Framework
[Central concept with logical structure]

### 📊 Why This Works: The Evidence
[Proof-driven content: results, case studies, research]

### 🎯 Truth + Benefit + Story
[The logical case: What it is + Why it matters + How it's been used]

---

## Phase 4: Application Bridge

### 🌍 Real-World Application
[Practical example or detailed case study]

### 🛠️ What You Can Do Right Now
**Immediate Actions:**
1. [Specific actionable step 1]
2. [Specific actionable step 2]
3. [Specific actionable step 3]

### 🚀 Your Future State
[What success looks like when you apply this]

---

## Phase 5: Momentum Maintenance

### 📌 Key Takeaways
- [Main insight 1]
- [Main insight 2]
- [Main insight 3]

### 🔮 What's Coming Next
[Curiosity hook for next chapter - what question will be answered, what skill will be unlocked]

### 🌉 The Belief Bridge
[Connecting this chapter's learning to the next logical step in their journey]`
  }
];

export function getTemplate(id: string): ChapterTemplate | undefined {
  return CHAPTER_TEMPLATES.find(t => t.id === id);
}

export function getTemplatesByCategory() {
  return {
    learning: CHAPTER_TEMPLATES.filter(t => ['standard', 'tutorial', 'theory'].includes(t.id)),
    content: CHAPTER_TEMPLATES.filter(t => ['case_study', 'comparison', 'reference'].includes(t.id)),
    creative: CHAPTER_TEMPLATES.filter(t => ['storytelling', 'problem_solution'].includes(t.id))
  };
}
