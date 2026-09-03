# Style Guide — Dusty Pink & Brown

A small, dependency-free design system: dusty pink grounds, warm brown for
structure and action, a serif/sans pairing, and a set of components that work
as plain HTML. No framework, no build step.

**Live guide:** open `index.html`, or publish this folder with GitHub Pages.

## Files

| File | What it is |
|---|---|
| `tokens.css` | Every colour, type, space, radius and shadow value as CSS custom properties. The single source of truth. |
| `base.css` | Element defaults and components — buttons, cards, stat rows, timeline rail, definition rows, sticky bar, hero, bands. Requires `tokens.css`. |
| `index.html` | The living style guide: swatches, type scale, every component rendered, and the house rules. |

## Use it in a project

Copy `tokens.css` and `base.css` into the project, then in your `<head>`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="base.css">
```

If this is a public repo, you can link the files directly instead of copying:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AndiGossA/style-guide@main/tokens.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/AndiGossA/style-guide@main/base.css">
```

Then write plain markup:

```html
<section class="band">
  <div class="wrap">
    <div class="section-head">
      <span class="tag">Section label</span>
      <h2>Section heading</h2>
      <p>A sentence of supporting copy.</p>
    </div>
    <div class="card-grid">
      <article class="card card-ruled">
        <span class="num">01</span>
        <h3>Card title</h3>
        <p>Card body copy.</p>
      </article>
    </div>
  </div>
</section>
```

## Palette

### Grounds

| Token | Hex | Use |
|---|---|---|
| `--surface` | `#FFFAF8` | Cards, raised panels |
| `--paper` | `#F4E8E4` | Page background |
| `--paper-deep` | `#ECDAD5` | Alternating section bands |
| `--line-soft` | `#EBD8D2` | Hairlines inside components |
| `--line` | `#E0C9C2` | Borders, dividers |

### Brown

| Token | Hex | Use |
|---|---|---|
| `--brown-900` | `#2E211A` | Body text, inverted bands |
| `--brown-700` | `#5A3D2E` | Primary buttons, links |
| `--brown-500` | `#8A5A42` | Emphasis, accent rules |
| `--brown-300` | `#B98C71` | Decorative only |

### Dusty pink

| Token | Hex | Use |
|---|---|---|
| `--rose-600` | `#8A524F` | Labels, small caps — **the only pink cleared for text** |
| `--rose-500` | `#A9706C` | Decorative marks, accent rules |
| `--rose-400` | `#C99A95` | Decorative, buttons on dark bands |
| `--rose-200` | `#E8D2CD` | Hover borders |
| `--rose-050` | `#F6EBE8` | Tint washes, hover fills |

## Typography

Anthropic/Claude use Styrene (sans) and Tiempos/Copernicus (serif), both
licensed. This system uses the closest freely available stand-ins:

- **Source Serif 4** — headings, figures, keys
- **Inter** — navigation, body copy, buttons, labels

If you hold licences for the real faces, swap the `--serif` and `--sans`
values in `tokens.css` and nothing else needs to change.

## House rules

1. **Never hard-code a colour.** Everything lives in `tokens.css`; override on
   `:root` if a project needs to differ.
2. **Serif carries meaning, sans carries function.** Headings, figures and keys
   are serif; navigation, body, buttons and labels are sans.
3. **Alternate the grounds.** Sections run `--paper`, then `.band`, then back —
   closing on a `.band-dark` call to action.
4. **One accent per element.** Pink for labels and detail, brown for action and
   structure.
5. **Only `--rose-600` carries text.** Lighter pinks fail contrast at label
   sizes; keep them on rules, dots and fills.
6. **Keep the measure.** Body copy at 62ch, ledes at 54ch, headlines ~15ch.

## Accessibility

Contrast ratios measured against `--paper` (`#F4E8E4`):

| Pairing | Ratio | WCAG |
|---|---|---|
| `--ink` body text | 13.0:1 | AAA |
| `--ink-muted` secondary text | 5.4:1 | AA |
| `--rose-600` labels | 5.2:1 | AA |
| `--brown-700` links | 8.2:1 | AAA |
| `--ink-invert` on `--brown-700` (primary button) | 9.4:1 | AAA |
| `--brown-900` on `--rose-400` (dark-band button) | 6.3:1 | AA |

On `--paper-deep`, `--rose-600` measures 4.6:1 and `--ink-muted` 4.8:1 — both
still AA. Re-check any pairing you introduce.

The components ship with `:focus-visible` outlines and honour
`prefers-reduced-motion`.

## Browser support

Modern evergreen browsers. `color-mix()` is used once, for the sticky bar's
translucent background, with a solid fallback declared immediately before it.

## Used by

- [Lifestyle Plan](https://github.com/AndiGossA/test) — the landing page at the
  repo root is built on these tokens.
