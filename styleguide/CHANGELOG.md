# Styleguide Integration Changelog

## January 2026

### CSS Regression Fixes

#### Issue 1: Task List Bullets Showing

**Problem:** Bullet points were appearing on task list items in the dashboard, and list items had incorrect `display: list-item` which broke flex layouts.

**Root Cause:** Global CSS rules in `globals.css` were applying bullet styles to ALL `<ul>` elements:

```css
/* BEFORE (broken) - affected ALL ul elements */
ul {
  display: block;
  list-style-type: disc;
  ...
}
ul li {
  display: list-item;  /* This overrode flex layouts! */
}
```

**Fix:** Scoped list styles to only content areas (prose, articles, CMS content, styleguide components):

```css
/* AFTER (fixed) - only affects content areas */
.prose ul,
[data-slot] ul,
article ul,
.cms-content ul {
  display: block;
  list-style-type: disc;
  ...
}

.prose ul li,
[data-slot] ul li,
article ul li,
.cms-content ul li {
  display: list-item;
}
```

**Files Changed:** `app/globals.css` (lines 609-632)

**Impact:** 
- TasksList, navigation menus, and other UI lists no longer have bullet points
- Flex layouts on `<li>` elements now work correctly
- Prose content and styleguide components still get proper list styling

---

#### Issue 2: Button Font Weight Regression

**Problem:** Yellow buttons in task list appeared with lighter font weight (400) compared to production (500).

**Root Cause:** Tailwind CSS v4's preflight does not set `font-weight: 500` for buttons, unlike Tailwind v3.

**Comparison:**
| Element | LOCAL (broken) | DEV (correct) |
|---------|---------------|---------------|
| Button fontWeight | 400 | 500 |

**Fix:** Added `font-weight: 500` to button and anchor elements in `@layer base`:

```css
@layer base {
  button,
  [role="button"],
  input[type="button"],
  input[type="submit"],
  input[type="reset"],
  summary {
    cursor: pointer;
    font-weight: 500;  /* Added */
  }
  
  a {
    font-weight: 500;  /* Added */
  }
}
```

**Files Changed:** `app/globals.css` (lines 523-540)

**Impact:** Buttons and links now have consistent font-weight matching production.

---

#### Issue 3: Heading Letter-Spacing Missing

**Problem:** The "39 weeks until Election Day!" heading font appeared different - letters were more spaced out than production.

**Root Cause:** Tailwind CSS v4's preflight does not set `letter-spacing` for headings, unlike v3 which had `-0.02em` (tight tracking).

**Comparison:**
| Element | LOCAL (broken) | DEV (correct) |
|---------|---------------|---------------|
| h1 letter-spacing | "normal" | "-0.72px" (-0.02em) |
| h2 letter-spacing | "normal" | "-0.32px" (-0.02em) |

**Fix:** Added letter-spacing to h1 and h2 in `@layer base`:

```css
@layer base {
  h1, h2 {
    letter-spacing: -0.02em;
  }
}
```

**Files Changed:** `app/globals.css` (lines 548-553)

**Impact:** Headings now have proper tight tracking matching production.

---

#### Issue 4: Checkbox Spacing Incorrect

**Problem:** Circular checkboxes in task list appeared to have extra spacing/height (26.2px vs 24.15px on production).

**Root Cause:** Tailwind CSS v4's default line-height (1.5) differs from v3's (1.3). The checkbox wrapper div inherited the larger line-height, causing extra height.

**Comparison:**
| Element | LOCAL (broken) | DEV (correct) |
|---------|---------------|---------------|
| wrapper height | 26.2px | 24.15px |
| wrapper line-height | 24px (1.5em) | 20.8px (1.3em) |

**Fix:** Added default line-height for div and span elements in `@layer base`:

```css
@layer base {
  div, span {
    line-height: 1.3;
  }
  
  svg {
    vertical-align: middle;
  }
}
```

**Files Changed:** `app/globals.css` (lines 555-567)

**Impact:** Inline elements like checkboxes now have proper spacing matching production.

---

### Tailwind v4 Migration Notes

These issues stem from differences between Tailwind CSS v3 and v4 preflight:

| Feature | Tailwind v3 | Tailwind v4 | Our Fix |
|---------|-------------|-------------|---------|
| Button cursor | `cursor: pointer` | Not set | Added in `@layer base` |
| Button/link font-weight | `500` | Not set | Added in `@layer base` |
| Heading letter-spacing | `-0.02em` | Not set | Added in `@layer base` |
| Default line-height | `1.3` | `1.5` (inherited) | Set `1.3` on div/span |
| List styles | Reset to none | Reset to none | N/A |

Our `@layer base` rules in `globals.css` restore v3-like behavior where needed.

---

### Investigation Method

Used Chrome DevTools MCP to compare computed styles between:
- **Local:** `http://localhost:4000/dashboard`
- **Production:** `https://dev.goodparty.org/dashboard`

Key comparison script:
```javascript
// Get computed styles for task items
const li = document.querySelector('li');
const button = li.querySelector('a[href]');
return {
  li: { listStyleType, display, flexDirection },
  button: { fontWeight, fontSize, width }
};
```

### Final Results

All fixes verified via Chrome DevTools MCP:

| Property | Before Fix | After Fix | Production |
|----------|-----------|-----------|------------|
| `li.listStyleType` | "disc" | "none" | "disc" (hidden by flex) |
| `button.fontWeight` | "400" | "500" | "500" |
| `h1.letterSpacing` | "normal" | "-0.72px" | "-0.72px" |
| `checkboxWrapper.height` | 26.2px | 24.2px | 24.15px |
| `checkboxWrapper.lineHeight` | "24px" | "20.8px" | "20.8px" |

All local styles now match production (dev.goodparty.org).

---

*Last updated: January 2026*
