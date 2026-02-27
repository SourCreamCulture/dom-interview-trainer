# DOM Interview Trainer

A tiny local practice app for DOM manipulation interviews: type real JavaScript, run it against a sandboxed page, and get tests.

## Run it

From the clawd workspace:

```bash
cd /home/dallin/clawd/dom-trainer
# any simple static server works; pick one
npx --yes serve .
# or
python3 -m http.server 8080
```

Then open the printed URL (e.g. http://localhost:3000 or :8080).

## What to practice

- querySelector / getElementById
- addEventListener (click, keydown Enter)
- input.value → Number(...) → Number.isFinite
- textContent updates
- createElement + appendChild
- innerHTML clear-and-rebuild
- array ops: push, pop, includes, reduce

## Add your own challenges

Edit `challenges.js` and add another object to the `challenges` array.
Each test is a function that can click buttons, set input values, and assert DOM state.
