# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a vanilla HTML/CSS/JS static web app ("DOM Interview Trainer") with **zero dependencies** — no `package.json`, no build step, no bundler, no test framework. All logic lives in four files: `index.html`, `app.js`, `challenges.js`, `style.css`. It features 15 challenges across 6 categories with difficulty levels, a challenge browser sidebar, progress tracking (localStorage), and a configurable countdown timer.

### Running the app

Serve the project root with any static HTTP server. ES modules require HTTP (not `file://`).

```bash
npx --yes serve . -l 3000
# or
python3 -m http.server 8080
```

Then open `http://localhost:3000` (or `:8080`).

### Linting / Testing / Building

- **No linter configured** — no ESLint, Prettier, or similar tooling exists.
- **No automated test suite** — tests are embedded in `challenges.js` and run in-browser via the sandbox iframe. Each test gets a fresh sandbox (per-test isolation).
- **No build step** — files are served as-is.

### Known gotcha: `new Function()` scoping

User code runs via `new win.Function(userCode)` inside the sandbox iframe. Variables declared with `const`/`let`/`var` are local to that function and won't appear as `win.<name>`. Challenge tests that check `win.numbers` or `win.rating` require the code to use bare assignment (`numbers = []`) instead of `const numbers = []` to create a global property. The official solutions already account for this.
