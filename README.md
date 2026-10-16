# savant-ds — Savant Design System

Shared design vocabulary for the Savant-* apps:

- **ST** — SavantTrader (`C:\aa\projects\rel-str`, Angular 21 + Material 20)
- **SA** — SavantAPI (`C:\aa\projects\av-proxy-api`, Angular 19 + Material 19)

The package is **SCSS/CSS-only** — no Angular code, no build step — so both
Angular versions consume it identically.

> **Status: skeleton only** (task #1034). The two layers below land in
> #1035–#1038 — today `styles/` contains only the `_index.scss` entry
> point. The consumption steps in this README describe the target
> contract, not current files.

1. **Tokens** (`styles/_tokens.scss`, lands in #1035) — `--ds-*` CSS
   custom properties: color (incl. `--ds-up` / `--ds-down` P&L accents),
   spacing, typography, density, elevation. Dark theme via
   `[data-theme="dark"]`. Tokens that mirror Material values alias
   `var(--mat-sys-*)` so DS-styled and Material-styled elements stay in
   sync during the Material exit.
2. **Pattern mixins** (`styles/_page.scss`, `_dialog.scss`,
   `_feedback.scss` — land in #1036–#1037) — the `ds.*` namespace: page
   shells, header bars, dialog chrome/status, error banners. Graduated
   from `_pd-visual-language.scss`.

## Consuming in an app

1. Add the dependency (both apps sit under `C:\aa\projects\`, so the same
   relative path works for both):

   ```json
   "savant-ds": "file:../savant-ds"
   ```

   then `npm install`. npm links the package into `node_modules` (a junction
   on Windows) — **edit this repo, not `node_modules/savant-ds`**.

2. Register the Sass load path in `angular.json` (build target):

   ```json
   "stylePreprocessorOptions": { "includePaths": ["node_modules/savant-ds/styles"] }
   ```

3. Emit tokens **once**, in `src/styles.scss` — custom properties are
   runtime values, not deduplicated by Sass, so never emit them per
   component:

   ```scss
   @use 'tokens';
   ```

   In ST this goes *after* the Material theme block so `--mat-sys-*` aliases
   resolve.

4. Use mixins in component SCSS:

   ```scss
   @use 'index' as ds;

   :host { @include ds.page-host; }
   .shell { @include ds.page-shell; }
   ```

## Conventions

- Token names: `--ds-*`. Mixin names: `ds.*` via `@use 'index' as ds`.
- `@use`/`@forward` only — never `@import` (dual-sass-version contract).
- Mockups in planning docs are screenshots of the ST `/dev/ds` gallery or
  inline SVGs built on these tokens — cite the element name.

## Verify

```bash
npm install
npm run verify
```

`verify` is currently a **stub**: it checks the Sass entry point exists
and the `@use`-only contract holds. The full check — sass-compiling a
fixture exercising every public mixin and asserting each documented
token name appears — lands in #1038. No credentials, no network.
