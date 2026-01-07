# Motion Design Guidelines
## EpochOS Enterprise Product Site

---

## Philosophy

Our motion design follows the principle of **"quiet wow"** — animations that feel premium and polished without being distracting or overwhelming. Every motion serves a purpose: guiding attention, providing feedback, or creating atmosphere.

### Core Principles

1. **Subtle over Showy** — Animations should enhance, never distract
2. **Purposeful** — Every animation must serve a functional or emotional purpose
3. **Consistent** — Unified timing, easing, and behavior across all elements
4. **Performant** — 60fps minimum, GPU-accelerated where possible

---

## Timing Standards

### Duration Scale

| Category | Duration | Use Case |
|----------|----------|----------|
| Micro | 100-200ms | Hover states, button feedback |
| Standard | 300-400ms | Component transitions, reveals |
| Emphasis | 500-600ms | Hero animations, shimmer effects |
| Ambient | 800ms-2s | Background animations, charts |
| Slow | 8-20s | Continuous ambient motion (ribbons) |

### Easing Functions

```css
/* Standard easing - most interactions */
--ease-gentle: cubic-bezier(0.4, 0, 0.2, 1);

/* Spring easing - entrances with subtle overshoot */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Smooth easing - exits and fades */
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

---

## Component Motion Specs

### 1. Liquid Ribbon (Hero Background)

**Purpose:** Create atmospheric depth without distraction

```typescript
// Configuration
const ribbonConfig = {
  duration: 12000,        // 12s full cycle
  opacity: [0.08, 0.2],   // Very subtle range
  paths: 3,               // Multiple overlapping ribbons
  stagger: 3000,          // 3s offset between ribbons
};

// Animation
animate={{
  d: [path1, path2, path3, path4, path1],  // Morphing paths
  opacity: [0.12, 0.18, 0.15, 0.2, 0.12],
}}
transition={{
  duration: 12,
  repeat: Infinity,
  ease: "easeInOut",
}}
```

**Guidelines:**
- Maximum opacity: 0.2 (20%)
- Never block or compete with content
- Smooth, organic path morphing
- No sudden jumps or jarring transitions

---

### 2. Shimmer Card (Metrics)

**Purpose:** Single moment of delight on first view, then static

```typescript
// Configuration
const shimmerConfig = {
  duration: 600,          // 600ms exactly
  delay: index * 100,     // Stagger between cards
  triggerOnce: true,      // Never repeat
};

// Animation
initial={{ x: '-100%' }}
animate={{ x: '200%' }}
transition={{
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1],
}}

// Gradient
background: `linear-gradient(
  90deg,
  transparent 0%,
  rgba(63, 182, 139, 0.04) 20%,
  rgba(63, 182, 139, 0.1) 50%,
  rgba(63, 182, 139, 0.04) 80%,
  transparent 100%
)`;
```

**Guidelines:**
- Play exactly once per page load
- Subtle highlight intensity (max 10% opacity at peak)
- Stagger cards by 100ms for cascade effect
- No repeat animations

---

### 3. Spring Charts

**Purpose:** Bring data to life with gentle physics

```typescript
// Spring configuration - GENTLE, never bouncy
const springConfig = {
  stiffness: 100,   // Lower = slower settling
  damping: 20,      // Higher = less overshoot
  mass: 1,
};

// Bar animation
animate={{ scaleY: targetHeight }}
transition={{
  type: "spring",
  stiffness: 100,
  damping: 20,
}}

// Line animation
animate={{ pathLength: 1 }}
transition={{
  duration: 1.2,
  ease: [0.4, 0, 0.2, 1],
}}
```

**Guidelines:**
- Spring overshoot: maximum 2-3%
- Bar stagger: 50ms between bars
- Line draw: 1-1.5s duration
- Data points fade in after line completes

---

### 4. Browser Mockup (Hover Glow)

**Purpose:** Draw attention to dashboard preview, indicate interactivity

```typescript
// Configuration
const glowConfig = {
  duration: 500,
  scale: [0.95, 1],
  shadow: {
    rest: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    hover: '0 25px 60px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(63, 182, 139, 0.1)',
  },
};

// Glow layer
animate={{
  opacity: isHovered ? 1 : 0,
  scale: isHovered ? 1 : 0.95,
}}
transition={{
  duration: 0.5,
  ease: [0.4, 0, 0.2, 1],
}}

// Glow gradient
background: `radial-gradient(
  ellipse at center,
  rgba(63, 182, 139, 0.15) 0%,
  transparent 60%
)`;
```

**Guidelines:**
- Glow appears/disappears smoothly (500ms)
- Subtle scale change on glow layer (0.95 → 1)
- Border color transition to accent
- Shadow depth increases on hover

---

### 5. Section Dividers (Scroll-Linked)

**Purpose:** Create visual rhythm, respond to scroll position

```typescript
// Configuration
const dividerConfig = {
  scrollRange: ["start end", "end start"],
  gradientPosition: ['0%', '100%'],
  opacity: [0.2, 0.5, 0.2],
};

// Scroll transform
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
});

const gradientPosition = useTransform(
  scrollYProgress,
  [0, 1],
  ['0%', '100%']
);
```

**Guidelines:**
- Gradient travels full width during scroll through
- Peak opacity at center of viewport
- Continuous, smooth position update
- Optional: center glow dot appears at peak

---

## Page Transition Standards

### Initial Page Load

```typescript
// Stagger sequence
const loadSequence = {
  navbar: { delay: 0, duration: 500 },
  heroText: { delay: 100, duration: 600 },
  heroBadge: { delay: 200, duration: 500 },
  heroButtons: { delay: 300, duration: 500 },
  browserMockup: { delay: 400, duration: 800 },
  trustIndicators: { delay: 600, duration: 500 },
};
```

### Scroll Reveals

```typescript
// Viewport trigger
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-100px" }}
transition={{ duration: 0.6 }}

// Initial state
initial={{ opacity: 0, y: 20 }}
```

---

## Framer Motion Configurations

### Standard Fade Up

```typescript
const fadeUpVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
};
```

### Stagger Container

```typescript
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
```

### Scale Spring

```typescript
const scaleSpring = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};
```

---

## Color in Motion

### Accent Color Usage

```css
/* Primary accent */
--accent-primary: rgb(63, 182, 139);

/* Glow effects - always low opacity */
--glow-subtle: rgba(63, 182, 139, 0.1);
--glow-medium: rgba(63, 182, 139, 0.2);
--glow-strong: rgba(63, 182, 139, 0.3);

/* Background tints */
--accent-muted: rgba(63, 182, 139, 0.1);
```

### Gradient Motion

- Gradients should shift slowly (8-20s cycles)
- Position changes should be smooth, not stepped
- Opacity variations add depth without distraction

---

## Performance Checklist

- [ ] Use `transform` and `opacity` for animations (GPU-accelerated)
- [ ] Avoid animating `width`, `height`, `top`, `left`
- [ ] Use `will-change` sparingly and only when needed
- [ ] Lazy load animation-heavy components
- [ ] Use `viewport={{ once: true }}` for scroll reveals
- [ ] Test on low-end devices
- [ ] Profile with Chrome DevTools Performance tab

---

## Accessibility

- Respect `prefers-reduced-motion` media query
- Provide static alternatives for decorative motion
- Ensure animations don't cause seizures (no rapid flashing)
- Don't rely on animation alone to convey information

```typescript
// Reduced motion support
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Disable non-essential animations
animate={prefersReducedMotion ? {} : { ... }}
```

---

## Component Library

All motion components are exported from:

```typescript
import {
  LiquidRibbon,
  GradientDivider,
  AnimatedSectionDivider,
  ShimmerCard,
  MetricCard,
  SpringChart,
  MiniSparkline,
  BrowserMockup,
  DashboardPreviewContent,
} from '@/components/animations';
```

---

## Summary: The "Quiet Wow" Checklist

✅ Animation serves a clear purpose  
✅ Duration matches the interaction importance  
✅ Easing feels natural, never mechanical  
✅ Opacity stays subtle (rarely above 20% for decorative elements)  
✅ Springs settle gently, never bounce  
✅ One-time effects don't repeat  
✅ Scroll-linked motion is smooth and continuous  
✅ Performance is rock-solid (60fps)  
✅ Accessibility is respected  

---

*Last updated: January 2024*

