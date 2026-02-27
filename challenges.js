// DOM Interview Trainer — Challenges
// Each challenge provides:
// - id, title, tags
// - prompt: user-facing
// - html: sandbox HTML stub
// - starter: starter JS
// - solution: reference
// - hints: array
// - tests: array of functions run with ({doc, win})

export const challenges = [
  {
    id: "array-add-and-status",
    title: "Input → array push → status text",
    tags: ["querySelector", "addEventListener", "Number", "textContent"],
    prompt:
`Wire up the input and button so that:

- When the user clicks the button (or presses Enter in the input), read the input value.
- Convert it to a number.
- If it's not a valid number, show: "Please enter a valid number." in #status and do NOT modify the array.
- Otherwise push the number into an array named numbers.
- Update #status to: "Added <n>. Count: <count>".
- Clear the input and focus it.

Rules:
- Use textContent (not innerHTML).
- Use ONLY the provided DOM elements.
`,
    html: `
<div class="wrap">
  <label>Number: <input id="numInput" /></label>
  <button id="addBtn">Add</button>
  <p id="status">Ready.</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:460px}
  input{padding:8px}
  button{padding:8px}
</style>
`,
    starter:
`// Your state
const numbers = [];

// TODO: wire up input/button handlers
`,
    solution:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const status = document.querySelector('#status');

function add() {
  const n = Number(input.value.trim());
  if (!Number.isFinite(n)) {
    status.textContent = 'Please enter a valid number.';
    input.focus();
    return;
  }
  numbers.push(n);
  status.textContent = `Added \${n}. Count: \${numbers.length}`;
  input.value = '';
  input.focus();
}

btn.addEventListener('click', add);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') add();
});
`,
    hints: [
      "Grab elements with document.querySelector('#id').",
      "input.value is ALWAYS a string; convert with Number(...) and validate with Number.isFinite.",
      "Add two listeners: button click and input keydown (Enter).",
    ],
    tests: [
      ({ win }) => {
        if (!('numbers' in win)) return fail("Expected a global variable named 'numbers'.");
        if (!Array.isArray(win.numbers)) return fail("'numbers' should be an array.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const status = doc.querySelector('#status');

        input.value = 'abc';
        btn.click();
        if (win.numbers.length !== 0) return fail("Invalid input should not push into numbers.");
        if (status.textContent.trim() !== 'Please enter a valid number.') return fail("Status message for invalid input is wrong.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const status = doc.querySelector('#status');

        input.value = ' 42 ';
        btn.click();
        if (win.numbers.length !== 1 || win.numbers[0] !== 42) return fail("Expected numbers to contain [42] after adding 42.");
        if (status.textContent.trim() !== 'Added 42. Count: 1') return fail("Status after adding is wrong.");
        if (input.value !== '') return fail("Input should be cleared after successful add.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const status = doc.querySelector('#status');

        input.value = '7';
        input.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        if (win.numbers.length !== 2 || win.numbers[1] !== 7) return fail("Enter key should add number too.");
        if (status.textContent.trim() !== 'Added 7. Count: 2') return fail("Status after Enter add is wrong.");
        return pass();
      },
    ],
  },

  {
    id: "join-into-existing-text",
    title: "Add numbers and join into existing text",
    tags: ["textContent", "join", "push"],
    prompt:
`The page already contains a line of text: "Numbers: " inside #line.

Make it so that clicking Add:
- parses the input as a number
- pushes into a global array numbers
- updates #line to: "Numbers: <n1>, <n2>, <n3>" (comma+space)

Invalid numbers should set #error to "Invalid" and not modify the array.
Clear and focus the input after valid adds.
`,
    html: `
<div class="wrap">
  <input id="numInput" placeholder="e.g. 10" />
  <button id="addBtn">Add</button>
  <p id="line">Numbers: </p>
  <p id="error"></p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:460px}
  input{padding:8px}
  button{padding:8px}
  #error{color:#b00020}
</style>
`,
    starter:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const line = document.querySelector('#line');
const error = document.querySelector('#error');

btn.addEventListener('click', () => {
  // TODO
});
`,
    solution:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const line = document.querySelector('#line');
const error = document.querySelector('#error');

btn.addEventListener('click', () => {
  const n = Number(input.value.trim());
  if (!Number.isFinite(n)) {
    error.textContent = 'Invalid';
    input.focus();
    return;
  }

  error.textContent = '';
  numbers.push(n);
  line.textContent = `Numbers: \${numbers.join(', ')}`;
  input.value = '';
  input.focus();
});
`,
    hints: [
      "line.textContent = `Numbers: \${numbers.join(', ')}`",
      "Keep 'Numbers: ' exactly as written (including colon and space).",
    ],
    tests: [
      ({ win }) => {
        if (!Array.isArray(win.numbers)) return fail("Expected global array 'numbers'.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const line = doc.querySelector('#line');
        const error = doc.querySelector('#error');

        input.value = '1'; btn.click();
        input.value = '2'; btn.click();
        input.value = '3'; btn.click();

        if (win.numbers.join(',') !== '1,2,3') return fail('numbers should be [1,2,3].');
        if (line.textContent !== 'Numbers: 1, 2, 3') return fail("#line should be 'Numbers: 1, 2, 3'.");
        if (error.textContent.trim() !== '') return fail('Error should be cleared after valid input.');
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const error = doc.querySelector('#error');

        input.value = 'nope'; btn.click();
        if (error.textContent.trim() !== 'Invalid') return fail("Invalid input should set #error to 'Invalid'.");
        if (win.numbers.length !== 0) return fail('Invalid input should not modify numbers.');
        return pass();
      },
    ],
  },

  {
    id: "append-log-text",
    title: "Append to existing text (log style)",
    tags: ["textContent", "append", "push"],
    prompt:
`The page has #log starting with: "Log: ".

On each valid Add:
- push number into global array numbers
- append to #log so it becomes: "Log: 5 | 8 | 2" (with " | " separators)

Invalid input should set #log to: "Log: (invalid)" but NOT clear existing numbers.
`,
    html: `
<div class="wrap">
  <input id="numInput" />
  <button id="addBtn">Add</button>
  <p id="log">Log: </p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:460px}
  input{padding:8px}
  button{padding:8px}
</style>
`,
    starter:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const log = document.querySelector('#log');

btn.addEventListener('click', add);

function add() {
  // TODO
}
`,
    solution:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const log = document.querySelector('#log');

btn.addEventListener('click', add);

function add() {
  const n = Number(input.value.trim());
  if (!Number.isFinite(n)) {
    log.textContent = 'Log: (invalid)';
    input.focus();
    return;
  }
  numbers.push(n);
  log.textContent = `Log: \${numbers.join(' | ')}`;
  input.value = '';
  input.focus();
}
`,
    hints: [
      "Use numbers.join(' | ') to get the separators right.",
      "Invalid input should NOT wipe the array; just change the log text.",
    ],
    tests: [
      ({ win }) => {
        if (!Array.isArray(win.numbers)) return fail("Expected global array 'numbers'.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const log = doc.querySelector('#log');

        input.value = '5'; btn.click();
        input.value = '8'; btn.click();
        if (log.textContent !== 'Log: 5 | 8') return fail("Log text should be 'Log: 5 | 8'.");
        if (win.numbers.join(',') !== '5,8') return fail('numbers should be [5,8].');
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const log = doc.querySelector('#log');

        input.value = '5'; btn.click();
        input.value = 'no'; btn.click();
        if (log.textContent !== 'Log: (invalid)') return fail("Invalid input should set log to 'Log: (invalid)'.");
        if (win.numbers.join(',') !== '5') return fail('numbers should remain [5] after invalid input.');
        return pass();
      },
    ],
  },

  {
    id: "replace-placeholder",
    title: "Replace placeholder with array display",
    tags: ["textContent", "JSON.stringify"],
    prompt:
`The page has text: "You entered: (none)".

On each valid add:
- push to global array numbers
- replace the text with: "You entered: [1,2,3]" (no spaces)

Invalid should show: "You entered: (invalid)" and not modify the array.
`,
    html: `
<div class="wrap">
  <input id="numInput" />
  <button id="addBtn">Add</button>
  <p id="out">You entered: (none)</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:460px}
  input{padding:8px}
  button{padding:8px}
</style>
`,
    starter:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const out = document.querySelector('#out');

btn.addEventListener('click', () => {
  // TODO
});
`,
    solution:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const out = document.querySelector('#out');

btn.addEventListener('click', () => {
  const n = Number(input.value.trim());
  if (!Number.isFinite(n)) {
    out.textContent = 'You entered: (invalid)';
    input.focus();
    return;
  }
  numbers.push(n);
  out.textContent = `You entered: \${JSON.stringify(numbers)}`;
  input.value = '';
  input.focus();
});
`,
    hints: [
      "JSON.stringify([1,2,3]) becomes '[1,2,3]' (no spaces).",
      "Make sure the prefix 'You entered: ' stays exactly.",
    ],
    tests: [
      ({ win }) => {
        if (!Array.isArray(win.numbers)) return fail("Expected global array 'numbers'.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const out = doc.querySelector('#out');

        input.value = '1'; btn.click();
        input.value = '2'; btn.click();
        input.value = '3'; btn.click();

        if (out.textContent !== 'You entered: [1,2,3]') return fail("Output should be 'You entered: [1,2,3]'.");
        if (win.numbers.join(',') !== '1,2,3') return fail('numbers should be [1,2,3].');
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const out = doc.querySelector('#out');

        input.value = 'x'; btn.click();
        if (out.textContent !== 'You entered: (invalid)') return fail("Invalid input should set '(invalid)'.");
        if (win.numbers.length !== 0) return fail('Invalid input should not modify numbers.');
        return pass();
      },
    ],
  },

  {
    id: "render-list",
    title: "Render array into <ul> + sum",
    tags: ["createElement", "append", "innerHTML", "reduce"],
    prompt:
`Implement add + render so that:

- numbers starts empty.
- When Add is clicked, parse the number; ignore invalid numbers (show error in #status).
- Valid adds push into numbers.
- #status should show: "Count: <count> | Sum: <sum>".
- #list should contain one <li> per number, in order.

Bonus: keep rendering logic in a function render().
`,
    html: `
<div class="wrap">
  <label>Number: <input id="numInput" /></label>
  <button id="addBtn">Add</button>
  <p id="status">Count: 0 | Sum: 0</p>
  <ul id="list"></ul>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:460px}
  input{padding:8px}
  button{padding:8px}
</style>
`,
    starter:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const status = document.querySelector('#status');
const list = document.querySelector('#list');

function render() {
  // TODO
}

function add() {
  // TODO
}

btn.addEventListener('click', add);
`,
    solution:
`const numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const status = document.querySelector('#status');
const list = document.querySelector('#list');

function render() {
  const sum = numbers.reduce((a, b) => a + b, 0);
  status.textContent = `Count: \${numbers.length} | Sum: \${sum}`;

  list.innerHTML = '';
  for (const n of numbers) {
    const li = document.createElement('li');
    li.textContent = String(n);
    list.appendChild(li);
  }
}

function add() {
  const n = Number(input.value.trim());
  if (!Number.isFinite(n)) {
    status.textContent = 'Invalid number';
    input.focus();
    return;
  }
  numbers.push(n);
  render();
  input.value = '';
  input.focus();
}

btn.addEventListener('click', add);
`,
    hints: [
      "Use list.innerHTML = '' to clear before rebuilding (fine for interviews).",
      "sum = numbers.reduce((a,b)=>a+b,0)",
      "Always stringify for textContent: String(n)",
    ],
    tests: [
      ({ win }) => {
        if (!Array.isArray(win.numbers)) return fail("Expected global array 'numbers'.");
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const status = doc.querySelector('#status');
        const list = doc.querySelector('#list');

        input.value = '3'; btn.click();
        input.value = '4'; btn.click();
        input.value = '5'; btn.click();

        if (win.numbers.join(',') !== '3,4,5') return fail('numbers should be [3,4,5].');
        if (status.textContent.trim() !== 'Count: 3 | Sum: 12') return fail('Status should show correct count and sum.');
        const lis = [...list.querySelectorAll('li')].map(li => li.textContent.trim());
        if (lis.join(',') !== '3,4,5') return fail('List items should render in order.');
        return pass();
      },
    ],
  },
];

function pass() { return { ok: true }; }
function fail(message) { return { ok: false, message }; }
