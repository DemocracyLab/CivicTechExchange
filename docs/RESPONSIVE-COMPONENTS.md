# Reusable Responsive React Components

Guidelines for building React components that work across devices and compose well into larger UIs. Each rule includes a **why** so the intent is clear when edge cases arise.

---

## Units: Never Use `px` in Styles

Use `rem`, `em`, `vw`, or `vh` as appropriate. Never use `px` for sizing, spacing, or typography.

| Unit | Use for |
|------|---------|
| `rem` | Most sizing and spacing — relative to the root font size |
| `em` | Sizing relative to the current element's font size (e.g., icon inside a button) |
| `vw` / `vh` | Viewport-relative sizing (e.g., full-screen overlays, hero sections) |

**Why:** Different devices, browsers, and user accessibility settings use different base font sizes. A gap of `16px` is a fixed physical size that ignores this — `1rem` scales with the user's chosen font size, so the layout stays proportional and readable everywhere. This is especially important for users who increase their browser font size for accessibility reasons.

```scss
// ❌ Wrong
.card { padding: 16px; font-size: 14px; }

// ✅ Correct
.card { padding: 1rem; font-size: 0.875rem; }
```

---

## Width: Fill the Parent, Don't Declare Your Own

Components should not set their own width. Use `width: 100%` (or no width declaration) so the component fills whatever space the parent gives it.

**Why:** A component that hardcodes `width: 400px` can only be used in contexts where 400px makes sense. A component that fills its parent can be placed in a sidebar, a modal, a full-width page column, or a card — and look correct in all of them. Top-level layout containers (pages, sections) are the right place to constrain widths.

```scss
// ❌ Wrong
.var-form { width: 600px; }

// ✅ Correct
.var-form { width: 100%; }  // or just omit width entirely
```

---

## Height: Take It from the Content

Components should not set their height. Let content determine height naturally.

**Exception:** Input fields and buttons should have a defined height, informed by design (Figma). These are interactive controls where a consistent tap/click target size matters across the UI.

**Why:** Hardcoded heights either clip content or leave awkward empty space when content changes (different text lengths, translations, dynamic data). Letting height grow with content makes components resilient.

```scss
// ❌ Wrong
.notification-banner { height: 60px; }

// ✅ Correct — let content set height
.notification-banner { padding: 0.75rem 1rem; }

// ✅ OK for interactive controls (from design spec)
.var-submit-button { height: 2.75rem; }
```

---

## Props: Accept All, Spread the Rest

Components should destructure the props they use and spread all remaining props onto the outermost rendered element.

**Why:** A parent passing `data-testid`, `aria-label`, `id`, or any other standard HTML attribute shouldn't be blocked by the component only forwarding named props. Spreading unknown props makes components transparent wrappers that work naturally with testing libraries, accessibility tools, and parent orchestration.

```jsx
// ❌ Wrong — silently swallows props the parent intended to pass
function VARSubmitButton({ isSubmitted, onClick }) {
  return <button onClick={onClick}>Submit</button>;
}

// ✅ Correct
function VARSubmitButton({ isSubmitted, onClick, ...rest }) {
  return <button onClick={onClick} disabled={isSubmitted} {...rest}>Submit</button>;
}
```

---

## Shared Props: Merge, Don't Overwrite

When a prop like `className` or `style` is used by the component itself *and* may be passed in by a parent, combine both values — don't choose one or the other.

Use `cx()` (classnames library) to merge class names.

**Why:** If a component applies its own `className` and a parent also passes `className`, silently dropping one breaks either the component's styles or the parent's customization. Merging both lets parents add context-specific overrides (spacing, visibility) without fighting the component's base styles.

```jsx
import cx from 'classnames';

// ❌ Wrong — parent's className is ignored
function VARCard({ className, ...rest }) {
  return <div className="var-card" {...rest} />;
}

// ✅ Correct — both classes are applied
function VARCard({ className, ...rest }) {
  return <div className={cx('var-card', className)} {...rest} />;
}
```

---

## Outer Spacing: None — Let the Parent Decide

Components should have no outer margin or padding. The parent is responsible for applying spacing between its children.

**Why:** A component that adds its own outer margin becomes hard to place. The first instance in a list needs no top margin; the last needs no bottom margin; the margin might conflict with a parent's padding. When the component owns zero outer spacing, any parent can position it exactly as needed using margin, gap, or padding on the parent — without fighting the component's defaults.

```scss
// ❌ Wrong
.var-form-divider { margin: 1.5rem 0; }

// ✅ Correct — component has no outer margin; parent applies spacing
.var-form-divider { border: none; border-top: 0.0625rem solid $color-border-weakest; }

// In the parent form:
.var-form-section + .var-form-divider { margin-top: 1.5rem; }
// — or — use gap on a flex/grid parent
```

---

## Breakpoints: One — Mobile vs Desktop

Use a single device-width breakpoint to distinguish mobile from desktop. Do not add intermediate breakpoints unless there is a specific, design-approved reason.

**Breakpoint:** `48rem` (equivalent to 768px at default font size, tablet/desktop boundary)

```scss
// $breakpoint-mobile is defined in _vars.scss as 48rem

.my-component {
  // Desktop styles (default)
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: $breakpoint-mobile) {
    // Mobile: single column
    grid-template-columns: 1fr;
  }
}
```

**Why:** Multiple breakpoints create exponential complexity — each component must be tested and maintained at every breakpoint. A single mobile/desktop split covers the vast majority of use cases, keeps styles predictable, and makes responsive behavior easy to reason about. "Mobile" means single-column; "desktop" means multi-column or side-by-side.

---

## Lists and Grids: Use Flexbox or Grid with the Breakpoint

Components that render lists of items should use CSS flexbox or grid for layout, and use the single breakpoint to adapt column count for mobile.

**Why:** Flexbox and grid handle item sizing and wrapping automatically, eliminating manual column math and making layouts naturally fluid.

```scss
// Multi-column list — desktop 3 cols, mobile 1 col
.project-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

// Horizontal row that wraps — each item fills evenly
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
```

Prefer `gap` over margins between items — `gap` only applies between items, not on the outside edges.

---

## Storybook Tests

Every component needs Storybook stories. Stories serve as living documentation, catch visual regressions before they reach production, and make regression testing much faster as the project evolves.

**Why:** A component with no stories is untestable in isolation. Stories also let designers and other developers see and interact with a component without needing to wire it into a page — which makes review and iteration much faster. As the codebase grows, stories provide a quick way to verify that existing components still render correctly after changes elsewhere in the project. 

### Cover Every Meaningful Prop Combination

Write a story for each distinct visual state or behavior the component supports. If a prop changes what the component renders, there should be a story for it.

```javascript
// ✅ Each prop state gets its own story
export const Default = { args: { isSubmitted: false } };
export const Submitted = { args: { isSubmitted: true } };
export const WithError = { args: { showError: true } };
export const WithoutError = { args: { showError: false } };
```

### Viewport Stories for Responsive Components

Any component that uses `$breakpoint-mobile` in its SCSS **must** have both a `DesktopView` and a `MobileView` story using Storybook viewport parameters. Do not use wrapper divs with `maxWidth` to simulate this.

**Why:** Viewport parameters actually resize the Storybook canvas, triggering real CSS media queries. A `maxWidth` wrapper div only constrains the element's box — it does not trigger `@media (max-width: ...)` rules, so the mobile layout never actually renders.

```javascript
export const DesktopView = {
  args: { /* ... */ },
  parameters: {
    viewport: { defaultViewport: 'desktop1' },  // 1024px canvas
  },
};

export const MobileView = {
  args: { /* ... */ },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },  // 375px canvas — triggers $breakpoint-mobile
  },
};
```

Available viewports (defined in `.storybook/preview.js`):
- `mobile1` — 375px
- `tablet1` — 768px (at the breakpoint boundary)
- `desktop1` — 1024px

### Interaction Tests for Interactive Components

Buttons, inputs, toggles, and modals should use the `play` function to verify behavior, not just appearance.

```javascript
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export const Clicked = {
  args: { isSubmitted: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    expect(button).toBeDisabled();
  },
};
```

### Story Organization

Follow this order within a story file:

1. `Default` — component with baseline props, no wrappers
2. `[StateName]` — one story per meaningful prop variation (e.g., `Submitted`, `WithError`)
3. `DesktopView` / `MobileView` — required for any component with responsive styles
4. `InContext` — component inside a realistic parent form or layout (optional but helpful for complex components)

---

## Summary Checklist

Before committing a new component, verify:

- [ ] No `px` units in SCSS — using `rem`, `em`, `vw`, or `vh`
- [ ] No hardcoded `width` (except layout containers)
- [ ] No hardcoded `height` (except buttons/inputs per design spec)
- [ ] Unknown props spread onto the outermost element (`...rest`)
- [ ] `className` (and `style` if applicable) merged with `cx()`, not overwritten
- [ ] No outer `margin` or `padding` on the component root
- [ ] Responsive behavior uses only the `$breakpoint-mobile` variable (`48rem`)
- [ ] Lists/grids use flexbox or grid with `gap`, not margins between items
- [ ] Storybook story for each meaningful prop state
- [ ] `DesktopView` and `MobileView` stories for any component with responsive styles
- [ ] `play` function interaction tests for buttons, inputs, and interactive controls
