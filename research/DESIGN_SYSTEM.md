# LiquidBooks Design System

**Version 1.0** - Created for Phase 6 UI/UX Overhaul

## 🎨 Brand Identity

### Brand Philosophy
LiquidBooks is a **modern, AI-powered book creation platform** that transforms the writing process. Our design reflects:
- **Fluidity**: Content flows naturally from idea to publication
- **Innovation**: Cutting-edge AI technology made accessible
- **Creativity**: Empowering authors to create stunning content
- **Professionalism**: Enterprise-grade quality with consumer ease

### Tagline
**"Create. Enhance. Publish."**

---

## 🌈 Color System

### Primary Colors
**Purple Gradient** - Creativity & Innovation
```css
--primary: 262 83% 58%        /* Rich Purple */
--primary-dark: 262 80% 65%   /* Bright Purple (Dark Mode) */
```

**Accent Cyan** - Energy & Modernity
```css
--accent: 199 89% 48%         /* Vibrant Cyan */
--accent-dark: 199 95% 55%    /* Electric Cyan (Dark Mode) */
```

### Semantic Colors
```css
--success: 142 76% 36%        /* Green */
--warning: 38 92% 50%         /* Orange */
--destructive: 0 84.2% 60.2%  /* Red */
```

### Gradients
```css
--gradient-from: 262 83% 58%  /* Purple */
--gradient-via: 240 100% 68%  /* Blue-Purple */
--gradient-to: 199 89% 48%    /* Cyan */
```

**Usage:**
- Hero sections: `bg-gradient-animated`
- Cards: `bg-gradient-primary`
- Backgrounds: `bg-mesh-gradient`

---

## 📏 Typography

### Font Stack
**Primary:** Inter (Variable Weight 100-900)
- Elegant, modern, highly legible
- Optimized for screens
- Variable font features enabled

**Monospace:** JetBrains Mono
- Code blocks and technical content
- Weights: 400, 500, 600

### Type Scale
```css
h1: text-4xl (2.25rem) font-bold tracking-tight
h2: text-3xl (1.875rem) font-bold tracking-tight
h3: text-2xl (1.5rem) font-semibold tracking-tight
h4: text-xl (1.25rem) font-semibold tracking-tight
```

### Font Features
```css
font-feature-settings: 'cv11', 'ss01', 'ss02', 'ss03';
```
Enables stylistic alternates for enhanced readability.

---

## 🔲 Spacing & Layout

### Border Radius System
```css
--radius-sm: 0.375rem   /* 6px - Small elements */
--radius-md: 0.625rem   /* 10px - Default */
--radius-lg: 0.875rem   /* 14px - Cards */
--radius-xl: 1.125rem   /* 18px - Large containers */
```

### Container Widths
```css
.container: max-width: 1280px
padding: 0 1rem (mobile), 0 2rem (desktop)
```

---

## ✨ Shadow System

Inspired by 21st.dev's layered approach:

### Light Mode
```css
--shadow-sm: Subtle lift
--shadow-md: Card depth (default)
--shadow-lg: Prominent elements
--shadow-xl: Modals & overlays
--shadow-2xl: Premium emphasis
```

### Dark Mode
Enhanced with deeper shadows and slight color tints for depth perception.

### Usage Classes
```css
.shadow-card          /* Standard cards */
.shadow-card-hover    /* Hover states */
.shadow-card-premium  /* Hero elements */
```

---

## 🎭 Effects & Animations

### Background Effects

**Mesh Gradient**
```tsx
<div className="bg-mesh-gradient" />
```
Subtle radial gradients in corners creating depth.

**Animated Gradient**
```tsx
<div className="bg-gradient-animated" />
```
Smooth 15s infinite shift animation.

**Glass Effect**
```tsx
<div className="glass-effect" />
```
Frosted glass with backdrop blur.

### Micro-Interactions

**Floating Animation**
```tsx
<div className="animate-float" />
```
Gentle vertical movement (6s infinite).

**Spring Transitions**
```tsx
<div className="transition-spring" />
```
Elastic easing with overshoot.

**Smooth Transitions**
```tsx
<div className="transition-smooth" />
```
Standard cubic-bezier easing.

### Glow Effects
```tsx
<div className="glow-primary" />  /* Purple glow */
<div className="glow-accent" />   /* Cyan glow */
```

---

## 🎪 Component Patterns

### Navigation Bar
- **Height:** 64px (4rem)
- **Background:** `bg-card/80 backdrop-blur-xl`
- **Border:** `border-b border-border/40`
- **Shadow:** `shadow-card`
- **Active Indicator:** Animated underline with `layoutId`
- **Hover:** Lift animation (`y: -2`)

### Cards
- **Background:** `bg-card`
- **Border:** `border border-border`
- **Radius:** `rounded-lg` (--radius-lg)
- **Shadow:** `shadow-card` → `shadow-card-hover` on hover
- **Padding:** `p-6` default

### Buttons
- **Primary:** Gradient background with glow on hover
- **Ghost:** Transparent → subtle bg on hover
- **Variants:** default, ghost, outline, secondary
- **Sizes:** sm, md, lg, icon
- **Hover:** Scale 1.05, lift -2px

### Input Fields
- **Border:** `border-input`
- **Focus:** Ring with `ring-primary`
- **Radius:** `rounded-md`
- **Height:** 40px (sm), 44px (default), 48px (lg)

---

## 🌙 Dark Mode Strategy

### Automatic Detection
Respects `prefers-color-scheme` with manual override.

### Key Differences
1. **Background:** Near-black (`240 10% 3.9%`)
2. **Foreground:** Near-white (`0 0% 98%`)
3. **Primary:** Brighter for contrast (`262 80% 65%`)
4. **Shadows:** Deeper with subtle color tints
5. **Borders:** Subtle (`240 8% 18%`)

### Smooth Transition
```css
transition: background-color 0.3s ease, color 0.3s ease;
```

---

## 🎬 Animation Principles

### Timing
- **Micro:** 0.15-0.3s (buttons, hovers)
- **Standard:** 0.3-0.5s (page transitions)
- **Macro:** 0.5-1s (complex animations)
- **Ambient:** 2-15s (background effects)

### Easing
```css
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

### Performance
- Use `transform` and `opacity` for 60fps
- Enable `will-change` sparingly
- Prefer CSS animations for simple effects
- Use Framer Motion for complex orchestration

---

## 📐 Grid & Layout

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Common Layouts
```tsx
/* Two-column with sidebar */
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div className="lg:col-span-1">{/* Sidebar */}</div>
</div>
```

---

## 🎨 Visual Hierarchy

### Z-Index Scale
```css
-10: Background effects
0: Base content
10: Elevated cards
50: Navigation, sidebars
100: Modals, tooltips
999: Toast notifications
```

### Emphasis Levels
1. **Primary Action:** `bg-primary text-primary-foreground shadow-lg glow-primary`
2. **Secondary Action:** `bg-secondary text-secondary-foreground`
3. **Tertiary:** `ghost variant hover:bg-primary/10`

---

## 🔧 Utility Classes

### Custom Additions
```css
.scrollbar-custom      /* Styled scrollbar */
.bg-mesh-gradient      /* Mesh background */
.glass-effect          /* Frosted glass */
.animate-float         /* Floating animation */
.glow-primary          /* Purple glow */
.shadow-card-premium   /* Enhanced shadow */
.transition-spring     /* Spring easing */
```

---

## 📱 Responsive Design

### Mobile-First Approach
All components designed mobile-first, enhanced for desktop.

### Touch Targets
Minimum 44x44px for interactive elements.

### Responsive Typography
Scale down 10-15% on mobile for readability.

---

## ♿ Accessibility

### Color Contrast
All color combinations meet WCAG AA standards (4.5:1 minimum).

### Focus States
Visible `ring-2 ring-primary` on all interactive elements.

### Motion Preferences
Respect `prefers-reduced-motion`.

### Screen Readers
Semantic HTML with proper ARIA labels.

---

## 🚀 Performance

### Optimization Techniques
1. **Font Loading:** Variable fonts reduce requests
2. **CSS Variables:** Instant theme switching
3. **Backdrop Blur:** GPU-accelerated
4. **Transform Animations:** 60fps guarantee
5. **Lazy Load:** Background effects after critical content

---

## 📦 Component Library

### Existing Components
- Button (enhanced with gradients & glows)
- Card (with premium shadows)
- Input (with animated focus)
- Badge (gradient variants)
- Navigation (with micro-interactions)
- BackgroundEffects (ambient animation)

### Planned Components
- Toast notifications
- Modal dialogs
- Skeleton loaders
- Progress indicators
- Data tables
- Charts

---

## 🎯 Design Tokens

All tokens available as CSS variables, easily themeable:

```css
:root {
  --background: ...;
  --primary: ...;
  --radius: ...;
  --shadow-md: ...;
  /* etc. */
}
```

Access in Tailwind: `bg-background`, `text-primary`, `rounded-lg`

---

## 📚 Resources

### Inspiration Sources
- **21st.dev**: Shadow system, OKLCH colors, spring animations
- **shadcn/ui**: Component architecture, accessibility patterns
- **Radix UI**: Unstyled primitives for complex components

### Tools Used
- **Tailwind CSS**: Utility-first framework
- **Framer Motion**: Production-ready animations
- **Inter Font**: Modern typography
- **Lucide React**: Consistent iconography

---

## 🎨 Usage Examples

### Hero Section
```tsx
<section className="relative py-20 overflow-hidden">
  <div className="bg-gradient-animated opacity-30" />
  <div className="container mx-auto px-4 relative z-10">
    <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
      Create Amazing Books
    </h1>
  </div>
</section>
```

### Premium Card
```tsx
<div className="glass-effect rounded-xl p-8 shadow-card-premium glow-primary">
  <h3 className="text-2xl font-bold mb-4">Premium Feature</h3>
  <p className="text-muted-foreground">Beautiful content here</p>
</div>
```

### Animated Button
```tsx
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="btn-primary glow-primary"
>
  Get Started
</motion.button>
```

---

## 📝 Guidelines

### Do's
✅ Use semantic color names (`primary`, not `purple`)
✅ Leverage animation for delight, not distraction
✅ Maintain consistent spacing with Tailwind scale
✅ Test in both light and dark modes
✅ Ensure 4.5:1 contrast ratios minimum

### Don'ts
❌ Don't use arbitrary colors outside the system
❌ Don't animate everything (causes fatigue)
❌ Don't ignore mobile experience
❌ Don't skip accessibility testing
❌ Don't nest glassmorphism effects

---

**Last Updated:** Phase 6 Implementation
**Status:** Active Development
**Version:** 1.0.0
