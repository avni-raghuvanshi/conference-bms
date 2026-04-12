# CLAUDE.md — Engineering & Styling Standards

This file defines the strict engineering and styling standards for this project. All generated code must adhere to these rules without exception.

---

## Core Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Plain CSS only — `global.css` and `theme.css`
- **No UI libraries** — no Tailwind, Chakra UI, MUI, shadcn/ui, or any component library
- **No CSS-in-JS** — no styled-components, Emotion, or inline style objects for layout/design

---

## Architecture Rules

### Component Design
- Build **highly reusable, composable components** with clear, single responsibilities
- Keep components **small** — if a component grows beyond ~150 lines, consider splitting it
- **Extract repeated patterns** into shared abstractions; never copy-paste structure
- Separate concerns: data fetching, business logic, and presentation belong in distinct layers
- Co-locate component-specific types and helpers within the component's file or folder

### Server vs. Client Components
- **Prefer server components** by default — move to client only when strictly necessary
- Use `"use client"` only for: interactivity, browser APIs, event handlers, or client-side state
- Never mark a component client-side just for convenience — justify it
- Avoid prop-drilling state into server components; restructure the tree instead

### Folder Structure
- Group by **feature**, not by type (e.g., `components/EventCard/` not `components/cards/`)
- Use consistent naming: `PascalCase` for components, `camelCase` for utilities and hooks
- Index files (`index.ts`) for public API of a folder — keep internals private
- Hooks live in `hooks/`, shared utilities in `lib/` or `utils/`

### TypeScript
- Use strict TypeScript — no `any`, no `@ts-ignore` without explicit justification
- Define explicit interfaces/types for all props, API responses, and data models
- Prefer `interface` for object shapes, `type` for unions and computed types
- Export types alongside their components when they may be reused

---

## Performance Standards

- **Default to server rendering** — minimize client-side JavaScript
- Avoid unnecessary re-renders: memoize with `useMemo`/`useCallback` only when there is a measurable benefit, not preemptively
- Use **dynamic imports** (`next/dynamic`) for heavy client components or below-the-fold content
- Prevent **hydration mismatches** — never access `window`/`document` outside `useEffect` or client guards
- Use `next/image` for all images — never raw `<img>` tags
- Use `next/link` for all internal navigation
- Use `next/font` for fonts — never load via `<link>` tags
- Prefer **semantic HTML** (`<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`) over generic `<div>` soup
- Write **accessible markup** by default: ARIA labels where needed, keyboard navigability, correct heading hierarchy

---

## CSS Standards

### Files
- All global resets, base styles, and layout primitives go in `global.css`
- All design tokens (variables) are defined in `theme.css`
- Component-scoped styles use **CSS Modules** (`ComponentName.module.css`) when isolation is needed

### Design Tokens — `theme.css`
Define and consume CSS custom properties for every design decision:

```css
/* Spacing scale */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-4: 1rem;
--space-8: 2rem;

/* Typography scale */
--text-sm: clamp(0.75rem, 1.5vw, 0.875rem);
--text-base: clamp(0.875rem, 2vw, 1rem);
--text-lg: clamp(1rem, 2.5vw, 1.25rem);
--text-xl: clamp(1.25rem, 3vw, 1.75rem);
--text-2xl: clamp(1.5rem, 4vw, 2.25rem);

/* Colors */
--color-primary: ...;
--color-surface: ...;
--color-text: ...;

/* Radii */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 16px;

/* Shadows */
--shadow-sm: 0 1px 3px hsl(0 0% 0% / 0.1);
--shadow-md: 0 4px 12px hsl(0 0% 0% / 0.15);

/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
```

### Modern CSS Functions — Use Aggressively
- `clamp()` for fluid typography and spacing
- `min()` / `max()` for adaptive sizing constraints
- `minmax()` inside `grid-template-columns` / `grid-template-rows`
- `calc()` for dynamic computations
- `fit-content()`, `repeat()` for grid layouts

### Writing CSS
- **Shorthands always** — use `margin`, `padding`, `border`, `font`, `background`, `transition` shorthands
- **Logical properties** where applicable: `padding-inline`, `margin-block`, `inset-inline`, `border-block`
- **Flat selectors** — avoid deep nesting; prefer `.card-title` over `.card .content .title`
- **No specificity wars** — avoid `!important`; restructure selectors instead
- **No duplicate declarations** — extract shared values into variables
- **No magic numbers** — every non-obvious value should reference a token or have a comment
- CSS declarations ordered: positioning → box model → typography → visual → animation

### Minimizing Bloat
- Write only the CSS you need — no speculative or unused rules
- Reuse token-based values instead of hardcoding the same value in multiple places
- Consolidate repeated patterns into a single rule with broader selectors when semantically correct

---

## Code Quality Rules

- **Self-documenting code** — names should reveal intent; avoid abbreviations
- **Comments only for non-obvious logic** — never comment what the code clearly says
- **No premature abstraction** — abstract when a pattern repeats 3+ times with clear shared shape
- **No dead code** — remove unused variables, imports, types, and components
- **No prototype-level shortcuts** — all generated code is production-grade
- **Imports ordered:** external packages → internal aliases → relative paths → types
- Files stay **concise and focused** — a file that does one thing well beats a monolithic file

---

## Output Expectations

When generating code:

- Follow all rules in this file **strictly and without exception**
- Briefly explain architectural decisions when the choice is non-obvious
- Prefer **long-term maintainability** over expedient solutions
- Never introduce a new dependency without explicit justification
- Never use inline styles for layout or design — use CSS classes and tokens
- Always produce **clean, senior-level, production-ready code**
