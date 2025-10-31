# UI Mockup Descriptions

**Version**: 1.0
**Date**: October 25, 2025

This document provides detailed descriptions of each UI mockup for the AI-Powered Liquid Book Platform.

---

## Mockup 1: Landing Page

**File**: `01_landing_page.png`

**Purpose**: First impression and value proposition communication

**Key Elements**:

1. **Hero Section**
   - Bold headline: "Create Interactive Books with AI"
   - Subheadline explaining the dual-path approach (AI or manual)
   - Two prominent CTAs: "Start Creating" (primary) and "View Examples" (secondary)

2. **Feature Cards** (4 cards)
   - 🤖 AI-Powered: Generate complete books with AI assistance
   - 📝 Full Control: Write manually with optional AI help
   - 💻 Live Code: Executable code in 100+ languages
   - 📊 Assessments: Interactive quizzes and challenges

3. **Footer**
   - Trust indicators: "Built on Jupyter Book • Open Source • Provider Agnostic"

**User Actions**:
- Click "Start Creating" → Sign up page
- Click "View Examples" → Gallery of sample books
- Scroll to learn more

**Design Notes**:
- Clean, modern design with plenty of white space
- Purple accent color (#4F46E5) for primary actions
- Clear visual hierarchy

---

## Mockup 2: Dashboard

**File**: `02_dashboard.png`

**Purpose**: Central hub for managing all books

**Key Elements**:

1. **Header**
   - Logo and app name
   - Navigation: Dashboard, Templates, Help
   - User avatar (top right)

2. **Page Title & Actions**
   - "My Books" heading
   - "+ New Book" button (prominent, top right)

3. **Book Cards** (Grid layout)
   - Each card shows:
     - Book cover placeholder
     - Title
     - Status badge (Published/In Progress/Draft)
     - Metadata (chapter count)
     - Progress indicator
   - Example books shown:
     - "Introduction to Python" (In Progress, 65%)
     - "Forest Animals Story" (Published, 100%)
     - "Physics Research" (Draft, 20%)

4. **Quick Stats Section**
   - Total Books: 12
   - Published: 5
   - Total Views: 1,234
   - Avg. Completion: 78%

**User Actions**:
- Click "+ New Book" → Book creation wizard
- Click book card → Open editor
- View stats at a glance

**Design Notes**:
- Card-based layout for easy scanning
- Color-coded status badges
- Visual progress indicators

---

## Mockup 3: Book Creation Wizard

**File**: `03_wizard.png`

**Purpose**: Guide users through initial book setup

**Key Elements**:

1. **Progress Steps** (Top)
   - 4 steps shown: Basic Info (active), Structure, Features, Theme
   - Visual indicator of current step
   - Connected with lines showing flow

2. **Form Content** (Step 1: Basic Info)
   - Book Title input field (required)
   - Description text area
   - Book Type selection (4 options):
     - 📄 Article
     - 📚 Book (selected)
     - 🎓 Course
     - 🔬 Research
   - AI Assistance toggle switch (enabled)
     - Label: "Let AI generate book structure and content"

3. **Navigation Buttons**
   - "Back" button (secondary)
   - "Next: Structure →" button (primary)

**User Actions**:
- Fill in book details
- Select book type
- Toggle AI assistance on/off
- Click "Next" to proceed

**Design Notes**:
- Step-by-step approach reduces cognitive load
- Clear indication of progress
- AI toggle prominently displayed
- Form validation before proceeding

---

## Mockup 4: Content Editor

**File**: `04_editor.png`

**Purpose**: Main workspace for writing and editing content

**Key Elements**:

1. **Left Sidebar** (Chapter List)
   - "Chapters" heading
   - List of chapters with:
     - Chapter number and title
     - Active state indicator
     - Status icon (✓ complete, ✏️ editing)
     - Enable/disable toggle
   - "+ Add Chapter" button at bottom
   - Example chapters:
     - 1. Introduction (complete)
     - 2. Getting Started (active, editing)
     - 3-5. Other chapters

2. **Toolbar** (Top)
   - Quick actions: Save, Bold, Italic, Image, Code, Chart
   - 🤖 AI button (access AI assistant)
   - Editor mode tabs: Visual, Markdown (active), Preview

3. **Main Editor Area**
   - Monaco editor (VS Code engine)
   - Markdown content displayed
   - Syntax highlighting for code blocks
   - Example content shown:
     - Heading: `# Getting Started`
     - Text paragraph
     - Python code block with syntax highlighting

4. **AI Assistant Panel** (Collapsed)
   - Can be opened from toolbar
   - Slides in from right side

**User Actions**:
- Select chapter from sidebar
- Write/edit content in editor
- Switch between Visual/Markdown/Preview modes
- Insert code, images, charts
- Open AI assistant for help
- Save changes

**Design Notes**:
- Three-column layout (sidebar, editor, optional AI panel)
- Professional code editor experience
- Real-time syntax highlighting
- Clear visual separation of sections

---

## Mockup 5: AI Assistant Panel

**File**: `05_ai_assistant.png`

**Purpose**: Provide AI-powered writing assistance

**Key Elements**:

1. **Modal/Panel Design**
   - Overlays main content (dimmed background)
   - Centered panel with border
   - Header: "🤖 AI Writing Assistant"

2. **Quick Actions** (6 buttons)
   - ✍️ Continue Writing: "AI continues from cursor"
   - 🔄 Rewrite: "Improve selected text"
   - 📝 Expand: "Add more detail"
   - 📉 Summarize: "Make it concise"
   - 🎨 Change Tone: "Adjust formality"
   - 💻 Generate Code: "Create code example"

3. **Custom Request Section**
   - Text input: "Ask AI anything..."
   - "Generate" button

**User Actions**:
- Click quick action → AI performs task immediately
- Type custom request → Click "Generate"
- Review AI output
- Accept, reject, or regenerate

**Design Notes**:
- Modal design focuses attention
- Quick actions for common tasks
- Custom input for flexibility
- Clear action descriptions

---

## Mockup 6: Publishing Screen

**File**: `06_publishing.png`

**Purpose**: Configure and publish book

**Key Elements**:

1. **Left Side: Preview**
   - "Preview" heading
   - Mock book preview showing:
     - Book title: "Introduction to Python"
     - Author: "by John Doe"
     - Chapter list (5 chapters)
   - Represents final output

2. **Right Side: Settings**
   - **Visibility Options**
     - 🌍 Public (selected)
     - 🔗 Unlisted
     - 🔒 Private
   
   - **Custom Domain** (Pro feature, grayed out)
     - Input field: "yourdomain.com"
   
   - **Export Formats** (Checkboxes)
     - ✓ 📄 HTML
     - ✓ 📕 PDF
     - ✓ 📱 EPUB
   
   - **Build Status**
     - Green success box: "✓ Build successful"
     - "View" link
   
   - **Action Buttons**
     - "Save Draft" (secondary)
     - "🚀 Publish" (primary, prominent)

**User Actions**:
- Preview final book
- Select visibility settings
- Choose export formats
- Configure custom domain (Pro)
- Click "Publish" to go live

**Design Notes**:
- Split view: preview + settings
- Clear status indicators
- Pro features clearly marked
- Prominent publish button

---

## User Flow Summary

1. **Landing Page** → Sign up
2. **Dashboard** → View all books, click "+ New Book"
3. **Book Creation Wizard** → Set up book details, enable AI
4. **Content Editor** → Write/edit content, use AI assistant
5. **AI Assistant Panel** → Get AI help with writing
6. **Publishing Screen** → Configure and publish book

---

## Design System

### Colors

- **Primary**: #4F46E5 (Indigo) - Buttons, links, active states
- **Success**: #10B981 (Green) - Success messages, published status
- **Warning**: #F59E0B (Amber) - In-progress status, warnings
- **Gray**: #6B7280 (Medium Gray) - Secondary text
- **Light Gray**: #F9FAFB - Backgrounds, cards
- **Dark**: #1F2937 - Headers, text

### Typography

- **Headings**: Bold, clear hierarchy
- **Body**: Regular weight, readable size
- **Code**: Monospace font (Monaco/Consolas)

### Components

- **Buttons**: Rounded corners, clear hover states
- **Cards**: Subtle shadows, rounded corners
- **Inputs**: Clear borders, focus states
- **Modals**: Centered, dimmed background

### Spacing

- Consistent padding and margins
- Generous white space
- Clear visual grouping

---

## Responsive Considerations

While mockups show desktop view, the platform will be responsive:

- **Mobile**: Sidebar collapses to hamburger menu
- **Tablet**: Optimized two-column layouts
- **Desktop**: Full three-column layouts where appropriate

---

## Accessibility

- High contrast ratios for text
- Clear focus indicators
- Keyboard navigation support
- Screen reader compatible
- Alt text for all images
- ARIA labels where needed

---

## Next Steps

1. **User Testing**: Show mockups to potential users for feedback
2. **Iteration**: Refine based on feedback
3. **High-Fidelity Designs**: Create detailed designs in Figma
4. **Component Library**: Build reusable React components
5. **Implementation**: Develop frontend based on approved designs

