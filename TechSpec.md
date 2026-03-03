# Ashkan Studios Website - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Google Fonts (Anton, Inter) |

## 2. Tailwind Configuration

### Extended Theme Colors
```javascript
colors: {
  background: {
    primary: '#F5F5F0',
    secondary: '#1A1A1A',
    card: '#FFFFFF',
  },
  foreground: {
    primary: '#1A1A1A',
    secondary: '#FFFFFF',
    muted: '#666666',
  },
  accent: {
    purple: '#9B7ED9',
    'purple-light': '#C5B3F0',
    blue: '#0066FF',
    orange: '#FF6B35',
  },
  border: '#E0E0E0',
}
```

### Extended Font Family
```javascript
fontFamily: {
  display: ['Anton', 'sans-serif'],
  sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
}
```

### Custom Spacing
```javascript
spacing: {
  '18': '4.5rem',
  '22': '5.5rem',
  '30': '7.5rem',
  '128': '32rem',
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button (customized: remove radius, add variants)
- Sheet (for mobile menu)
- Separator

### Custom Components

#### Layout Components
| Component | Props | Description |
|-----------|-------|-------------|
| `Header` | - | Fixed navigation with scroll behavior |
| `Footer` | - | Dark footer with contact info |
| `Container` | `className?: string` | Max-width wrapper |
| `Section` | `className?: string, id?: string` | Section wrapper with padding |

#### Section Components
| Component | Props | Description |
|-----------|-------|-------------|
| `HeroSection` | - | Hero with typography + images |
| `PortfolioSection` | - | Portfolio grid with cards |
| `ClientsSection` | - | Client logos with gradient bg |
| `ServicesSection` | - | Full-width CTA section |
| `AboutSection` | - | Split layout about section |

#### UI Components
| Component | Props | Description |
|-----------|-------|-------------|
| `PortfolioCard` | `title, category, image, href` | Portfolio item card |
| `MenuOverlay` | `isOpen, onClose` | Full-screen navigation menu |
| `ScrollIndicator` | - | Animated scroll prompt |
| `Logo` | `variant?: 'dark' \| 'light'` | Brand logo |
| `SocialLinks` | `variant?: 'dark' \| 'light'` | Social media links |

#### Animation Components
| Component | Props | Description |
|-----------|-------|-------------|
| `FadeIn` | `delay?, duration?, direction?` | Scroll-triggered fade animation |
| `StaggerChildren` | `staggerDelay?` | Stagger animation wrapper |
| `TextReveal` | `text, delay?` | Character/word reveal animation |
| `ParallaxImage` | `src, alt, speed?` | Parallax scrolling image |

## 4. Animation Implementation Plan

| Interaction | Tech Choice | Implementation |
|-------------|-------------|----------------|
| Page Load | Framer Motion | `AnimatePresence` + staggered children |
| Hero Text Reveal | Framer Motion | `variants` with stagger, translateY + opacity |
| Hero Images Pop-in | Framer Motion | Scale + rotate animation, staggered |
| Scroll Reveal | Framer Motion | `whileInView` with viewport threshold |
| Parallax Images | Framer Motion | `useScroll` + `useTransform` hooks |
| Menu Open/Close | Framer Motion | `AnimatePresence`, slide + fade |
| Card Hover | Tailwind + FM | `whileHover` scale, group-hover for image |
| Button Hover | Tailwind | `hover:` utilities, transition-all |
| Link Underline | CSS | `after:` pseudo-element width animation |
| Header Scroll | React State | `useScroll` hook, conditional classes |

### Animation Timing Reference
```javascript
const transitions = {
  fast: { duration: 0.2, ease: 'easeOut' },
  normal: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  slow: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  spring: { type: 'spring', stiffness: 100, damping: 15 },
}

const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
}
```

## 5. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   └── images/
│       ├── hero/
│       ├── portfolio/
│       └── sections/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/          # Header, Footer, Container
│   │   ├── sections/        # Page sections
│   │   └── animations/      # Animation wrappers
│   ├── hooks/
│   │   ├── useScrollPosition.ts
│   │   └── useMediaQuery.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   └── portfolio.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 6. Package Installation List

```bash
# Initialize project
bash /app/.kimi/skills/webapp-building/scripts/init-webapp.sh "Ashkan Studios"

# Install animation library
npm install framer-motion

# Install fonts (via Google Fonts in HTML)
# Anton + Inter

# All other dependencies included with shadcn init
```

## 7. Key Implementation Notes

### Performance Optimizations
- Use `will-change: transform, opacity` on animated elements
- Lazy load images below fold with `loading="lazy"`
- Use `transform` instead of `top/left` for animations
- Implement `prefers-reduced-motion` support

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast compliance (WCAG AA)

### SEO
- Proper heading hierarchy (single H1)
- Meta tags in HTML head
- Alt text on all images
- Semantic landmarks (header, main, footer, section)

### Responsive Strategy
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Fluid typography using `clamp()`
- Grid columns adjust: 1 → 2 → 3

## 8. Data Structure

### Portfolio Item
```typescript
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
}
```

### Navigation Item
```typescript
interface NavItem {
  label: string;
  href: string;
}
```

### Client Logo
```typescript
interface Client {
  name: string;
  logo?: string; // optional, can use text
}
```

---

*This technical specification provides the implementation roadmap for building the Ashkan Studios website with React, Tailwind CSS, and Framer Motion.*
