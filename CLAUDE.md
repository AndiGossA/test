# Lifestyle App

A personal planning project: a markdown plan document and a static landing
page published with GitHub Pages from `main`.

## Style

Follow my standing style preferences: https://github.com/AndiGossA/style

Palette, typography and component conventions are in that repo's
`PREFERENCES.md`, `tokens.css` and `base.css`. Don't invent a new palette, and
don't hard-code a colour — every value comes from a token.

`index.html` loads `tokens.css` and `base.css` from that repo's GitHub Pages
site (`andigossa.github.io/style/`), so a token change there reaches this page
as soon as its Pages build finishes — no edit needed here.
Keep the inline `<style>` block for page-specific rules only — anything
reusable belongs in the style repo, and the markup should use the system's
class names (`card-grid`, `card-ruled`, `rail-steps`, `rows`, `band-dark`)
rather than page-local ones.
