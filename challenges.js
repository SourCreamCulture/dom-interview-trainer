export const categories = [
  { id: 'data', name: 'Data & Arrays' },
  { id: 'events', name: 'Event Handling' },
  { id: 'forms', name: 'Form Handling' },
  { id: 'dom', name: 'DOM Manipulation' },
  { id: 'ui', name: 'UI Patterns' },
  { id: 'advanced', name: 'Advanced' },
];

export const challenges = [

  // ── Data & Arrays ─────────────────────────────────────────

  {
    id: 'array-add-and-status',
    title: 'Input \u2192 array push \u2192 status text',
    tags: ['querySelector', 'addEventListener', 'Number', 'textContent'],
    difficulty: 'easy',
    category: 'data',
    prompt:
`Wire up the input and button so that:

- When the user clicks the button (or presses Enter in the input), read the input value.
- Convert it to a number.
- If it\u2019s not a valid number, show: "Please enter a valid number." in #status and do NOT modify the array.
- Otherwise push the number into an array named numbers (must be global).
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
`// numbers must be a global (no const/let/var) so tests can access it
numbers = [];

// TODO: wire up input/button handlers
`,
    solution:
`numbers = [];

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
  status.textContent = 'Added ' + n + '. Count: ' + numbers.length;
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
      "input.value is ALWAYS a string; convert with Number(\u2026) and validate with Number.isFinite.",
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
        if (win.numbers.length !== 0) return fail('Invalid input should not push into numbers.');
        if (status.textContent.trim() !== 'Please enter a valid number.') return fail('Status message for invalid input is wrong.');
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        const status = doc.querySelector('#status');
        input.value = ' 42 ';
        btn.click();
        if (win.numbers.length !== 1 || win.numbers[0] !== 42) return fail('Expected numbers to contain [42] after adding 42.');
        if (status.textContent.trim() !== 'Added 42. Count: 1') return fail('Status after adding is wrong.');
        if (input.value !== '') return fail('Input should be cleared after successful add.');
        return pass();
      },
      ({ doc, win }) => {
        const input = doc.querySelector('#numInput');
        const btn = doc.querySelector('#addBtn');
        input.value = '42';
        btn.click();
        input.value = '7';
        input.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        if (win.numbers.length !== 2 || win.numbers[1] !== 7) return fail('Enter key should add number too.');
        return pass();
      },
    ],
  },

  {
    id: 'join-into-existing-text',
    title: 'Add numbers and join into existing text',
    tags: ['textContent', 'join', 'push'],
    difficulty: 'easy',
    category: 'data',
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
`numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const line = document.querySelector('#line');
const error = document.querySelector('#error');

btn.addEventListener('click', () => {
  // TODO
});
`,
    solution:
`numbers = [];

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
  line.textContent = 'Numbers: ' + numbers.join(', ');
  input.value = '';
  input.focus();
});
`,
    hints: [
      "line.textContent = \`Numbers: \${numbers.join(', ')}\`",
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
    id: 'append-log-text',
    title: 'Append to existing text (log style)',
    tags: ['textContent', 'join', 'push'],
    difficulty: 'easy',
    category: 'data',
    prompt:
`The page has #log starting with: "Log: ".

On each valid Add:
- push number into global array numbers
- update #log so it becomes: "Log: 5 | 8 | 2" (with " | " separators)

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
`numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const log = document.querySelector('#log');

btn.addEventListener('click', add);

function add() {
  // TODO
}
`,
    solution:
`numbers = [];

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
  log.textContent = 'Log: ' + numbers.join(' | ');
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
    id: 'replace-placeholder',
    title: 'Replace placeholder with array display',
    tags: ['textContent', 'JSON.stringify'],
    difficulty: 'easy',
    category: 'data',
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
`numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const out = document.querySelector('#out');

btn.addEventListener('click', () => {
  // TODO
});
`,
    solution:
`numbers = [];

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
  out.textContent = 'You entered: ' + JSON.stringify(numbers);
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
    id: 'render-list',
    title: 'Render array into <ul> + sum',
    tags: ['createElement', 'appendChild', 'innerHTML', 'reduce'],
    difficulty: 'medium',
    category: 'data',
    prompt:
`Implement add + render so that:

- numbers starts empty (global).
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
`numbers = [];

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
`numbers = [];

const input = document.querySelector('#numInput');
const btn = document.querySelector('#addBtn');
const status = document.querySelector('#status');
const list = document.querySelector('#list');

function render() {
  const sum = numbers.reduce((a, b) => a + b, 0);
  status.textContent = 'Count: ' + numbers.length + ' | Sum: ' + sum;

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

  // ── Event Handling ────────────────────────────────────────

  {
    id: 'toggle-button',
    title: 'Toggle button ON / OFF',
    tags: ['addEventListener', 'classList', 'textContent'],
    difficulty: 'easy',
    category: 'events',
    prompt:
`The page has a button showing "ON" with the class "active", and a status paragraph.

Wire the button so that each click:
- Toggles the text between "ON" and "OFF".
- Toggles the "active" class on the button.
- Updates #statusText to "Status: Active" or "Status: Inactive".
`,
    html: `
<div class="wrap">
  <button id="toggleBtn" class="active">ON</button>
  <p id="statusText">Status: Active</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:10px;max-width:300px}
  button{padding:12px 24px;font-size:18px;border:2px solid #333;border-radius:8px;cursor:pointer}
  .active{background:#4caf50;color:#fff;border-color:#388e3c}
</style>
`,
    starter:
`const btn = document.querySelector('#toggleBtn');
const statusText = document.querySelector('#statusText');

btn.addEventListener('click', () => {
  // TODO: toggle text, class, and status
});
`,
    solution:
`const btn = document.querySelector('#toggleBtn');
const statusText = document.querySelector('#statusText');

btn.addEventListener('click', () => {
  const isActive = btn.classList.contains('active');

  if (isActive) {
    btn.textContent = 'OFF';
    btn.classList.remove('active');
    statusText.textContent = 'Status: Inactive';
  } else {
    btn.textContent = 'ON';
    btn.classList.add('active');
    statusText.textContent = 'Status: Active';
  }
});
`,
    hints: [
      "Use classList.contains('active') to check the current state.",
      "classList.toggle('active') can simplify toggling.",
    ],
    tests: [
      ({ doc }) => {
        const btn = doc.querySelector('#toggleBtn');
        btn.click();
        if (btn.textContent !== 'OFF') return fail('Button text should be "OFF" after first click.');
        if (btn.classList.contains('active')) return fail('Button should NOT have "active" class when OFF.');
        return pass();
      },
      ({ doc }) => {
        const btn = doc.querySelector('#toggleBtn');
        btn.click();
        btn.click();
        if (btn.textContent !== 'ON') return fail('Button text should be "ON" after toggling back.');
        if (!btn.classList.contains('active')) return fail('Button should have "active" class when ON.');
        return pass();
      },
      ({ doc }) => {
        const btn = doc.querySelector('#toggleBtn');
        const statusText = doc.querySelector('#statusText');
        btn.click();
        if (statusText.textContent !== 'Status: Inactive') return fail('Status should be "Status: Inactive" when OFF.');
        btn.click();
        if (statusText.textContent !== 'Status: Active') return fail('Status should be "Status: Active" when ON.');
        return pass();
      },
    ],
  },

  // ── Form Handling ─────────────────────────────────────────

  {
    id: 'character-counter',
    title: 'Live character counter',
    tags: ['input event', 'textContent', 'classList'],
    difficulty: 'easy',
    category: 'forms',
    prompt:
`The page has a textarea and a character counter display (#charCount).

Wire it so that on every input:
- #charCount shows the current character count (e.g. "42").
- When the count exceeds 160, add class "warning" to #charCount.
- When the count drops to 160 or below, remove "warning".
`,
    html: `
<div class="wrap">
  <label for="message">Message</label>
  <textarea id="message" rows="4" placeholder="Type your message..."></textarea>
  <div class="counter-info">
    <span id="charCount">0</span> / 200 characters
  </div>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{display:grid;gap:8px;max-width:460px}
  textarea{padding:8px;font-family:inherit;resize:vertical}
  .warning{color:#b00020;font-weight:bold}
</style>
`,
    starter:
`const textarea = document.querySelector('#message');
const charCount = document.querySelector('#charCount');

// TODO: listen for input events and update the counter
`,
    solution:
`const textarea = document.querySelector('#message');
const charCount = document.querySelector('#charCount');

textarea.addEventListener('input', () => {
  const len = textarea.value.length;
  charCount.textContent = len;

  if (len > 160) {
    charCount.classList.add('warning');
  } else {
    charCount.classList.remove('warning');
  }
});
`,
    hints: [
      "Listen for the 'input' event, not 'change' or 'keydown'.",
      "textarea.value.length gives the current character count.",
    ],
    tests: [
      ({ doc, win }) => {
        const ta = doc.querySelector('#message');
        const cc = doc.querySelector('#charCount');
        ta.value = 'Hello';
        ta.dispatchEvent(new win.Event('input', { bubbles: true }));
        if (cc.textContent !== '5') return fail('Count should be 5 after typing "Hello".');
        return pass();
      },
      ({ doc, win }) => {
        const ta = doc.querySelector('#message');
        const cc = doc.querySelector('#charCount');
        ta.value = 'A'.repeat(161);
        ta.dispatchEvent(new win.Event('input', { bubbles: true }));
        if (!cc.classList.contains('warning')) return fail('Should add "warning" class when over 160 chars.');
        return pass();
      },
      ({ doc, win }) => {
        const ta = doc.querySelector('#message');
        const cc = doc.querySelector('#charCount');
        ta.value = 'Short';
        ta.dispatchEvent(new win.Event('input', { bubbles: true }));
        if (cc.classList.contains('warning')) return fail('Should NOT have "warning" class for short text.');
        if (cc.textContent !== '5') return fail('Count should be 5.');
        return pass();
      },
    ],
  },

  {
    id: 'form-validator',
    title: 'Signup form validation',
    tags: ['submit event', 'preventDefault', 'textContent', 'classList'],
    difficulty: 'medium',
    category: 'forms',
    prompt:
`Validate a signup form on submit:

- Name: required (non-empty after trim). Error: "Name is required".
- Email: must contain "@". Error: "Invalid email address".
- Password: must be >= 6 characters. Error: "Password must be at least 6 characters".

Show errors in the corresponding #nameError, #emailError, #passError spans.
Clear error text for valid fields.
If ALL fields are valid, show #successMsg (set hidden = false).
Always call e.preventDefault().
`,
    html: `
<form id="signupForm">
  <div class="field">
    <label>Name</label>
    <input id="nameInput" type="text" placeholder="Your name" />
    <span id="nameError" class="error"></span>
  </div>
  <div class="field">
    <label>Email</label>
    <input id="emailInput" type="text" placeholder="you@example.com" />
    <span id="emailError" class="error"></span>
  </div>
  <div class="field">
    <label>Password</label>
    <input id="passInput" type="password" placeholder="Min 6 characters" />
    <span id="passError" class="error"></span>
  </div>
  <button type="submit" id="submitBtn">Sign Up</button>
  <p id="successMsg" class="success" hidden>Account created successfully!</p>
</form>
<style>
  body{font-family:system-ui;margin:16px}
  form{display:grid;gap:12px;max-width:400px}
  .field{display:grid;gap:4px}
  input{padding:8px}
  .error{color:#b00020;font-size:13px}
  .success{color:#2e7d32;font-weight:bold}
  button{padding:10px;cursor:pointer}
</style>
`,
    starter:
`const form = document.querySelector('#signupForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  // TODO: validate fields and show errors or success
});
`,
    solution:
`const form = document.querySelector('#signupForm');
const nameInput = document.querySelector('#nameInput');
const emailInput = document.querySelector('#emailInput');
const passInput = document.querySelector('#passInput');
const nameError = document.querySelector('#nameError');
const emailError = document.querySelector('#emailError');
const passError = document.querySelector('#passError');
const successMsg = document.querySelector('#successMsg');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  if (nameInput.value.trim() === '') {
    nameError.textContent = 'Name is required';
    valid = false;
  } else {
    nameError.textContent = '';
  }

  if (!emailInput.value.includes('@')) {
    emailError.textContent = 'Invalid email address';
    valid = false;
  } else {
    emailError.textContent = '';
  }

  if (passInput.value.length < 6) {
    passError.textContent = 'Password must be at least 6 characters';
    valid = false;
  } else {
    passError.textContent = '';
  }

  successMsg.hidden = !valid;
});
`,
    hints: [
      "Always call e.preventDefault() to stop the form from actually submitting.",
      "Use .includes('@') for a basic email check.",
      "Set element.hidden = false to reveal the success message.",
    ],
    tests: [
      ({ doc }) => {
        doc.querySelector('#submitBtn').click();
        const ne = doc.querySelector('#nameError');
        if (ne.textContent === '') return fail('Should show name error when name is empty.');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('#nameInput').value = 'John';
        doc.querySelector('#emailInput').value = 'bad-email';
        doc.querySelector('#passInput').value = '123';
        doc.querySelector('#submitBtn').click();
        if (doc.querySelector('#emailError').textContent === '') return fail('Should show email error for invalid email.');
        if (doc.querySelector('#passError').textContent === '') return fail('Should show password error for short password.');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('#nameInput').value = 'John';
        doc.querySelector('#emailInput').value = 'john@example.com';
        doc.querySelector('#passInput').value = 'password123';
        doc.querySelector('#submitBtn').click();
        if (doc.querySelector('#successMsg').hidden) return fail('Should show success message with valid inputs.');
        return pass();
      },
    ],
  },

  // ── DOM Manipulation ──────────────────────────────────────

  {
    id: 'todo-list',
    title: 'Todo list with add & delete',
    tags: ['createElement', 'appendChild', 'remove', 'addEventListener'],
    difficulty: 'medium',
    category: 'dom',
    prompt:
`Build a working todo list:

- Clicking Add (or pressing Enter in the input) should add a new <li> to #todoList.
- Ignore empty input (trim first).
- Each <li> should contain the todo text and a delete button (text: "\u00d7").
- Clicking the delete button should remove that <li>.
- Clear and focus the input after adding.
- Update #count to show "<n> items" (or "<n> item" for 1).
`,
    html: `
<div class="wrap">
  <div class="input-row">
    <input id="todoInput" placeholder="What needs to be done?" />
    <button id="addBtn">Add</button>
  </div>
  <ul id="todoList"></ul>
  <p id="count">0 items</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{max-width:460px}
  .input-row{display:flex;gap:8px;margin-bottom:12px}
  input{flex:1;padding:8px}
  button{padding:8px 14px;cursor:pointer}
  ul{list-style:none;padding:0}
  li{display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #eee}
  li button{background:none;border:none;color:#b00020;font-size:18px;cursor:pointer}
</style>
`,
    starter:
`const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const list = document.querySelector('#todoList');
const count = document.querySelector('#count');

// TODO: implement addTodo, updateCount, delete functionality
`,
    solution:
`const input = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const list = document.querySelector('#todoList');
const count = document.querySelector('#count');

function updateCount() {
  const n = list.querySelectorAll('li').length;
  count.textContent = n + ' item' + (n !== 1 ? 's' : '');
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = text;
  li.appendChild(span);

  const delBtn = document.createElement('button');
  delBtn.textContent = '\\u00d7';
  delBtn.addEventListener('click', () => {
    li.remove();
    updateCount();
  });
  li.appendChild(delBtn);

  list.appendChild(li);
  input.value = '';
  input.focus();
  updateCount();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});
`,
    hints: [
      "Use document.createElement('li') and appendChild to build each item.",
      "Attach a click listener to each delete button that calls li.remove().",
      "Don't forget to update the count after adding or deleting.",
    ],
    tests: [
      ({ doc }) => {
        const input = doc.querySelector('#todoInput');
        const addBtn = doc.querySelector('#addBtn');
        const list = doc.querySelector('#todoList');
        input.value = 'Buy groceries';
        addBtn.click();
        const items = list.querySelectorAll('li');
        if (items.length !== 1) return fail('Should have 1 todo item after adding.');
        if (!items[0].textContent.includes('Buy groceries')) return fail('Item should contain "Buy groceries".');
        return pass();
      },
      ({ doc }) => {
        const input = doc.querySelector('#todoInput');
        const addBtn = doc.querySelector('#addBtn');
        const list = doc.querySelector('#todoList');
        input.value = 'A'; addBtn.click();
        input.value = 'B'; addBtn.click();
        input.value = 'C'; addBtn.click();
        if (list.querySelectorAll('li').length !== 3) return fail('Should have 3 items after 3 adds.');
        const count = doc.querySelector('#count');
        if (count.textContent !== '3 items') return fail('Count should show "3 items".');
        return pass();
      },
      ({ doc }) => {
        const input = doc.querySelector('#todoInput');
        const addBtn = doc.querySelector('#addBtn');
        const list = doc.querySelector('#todoList');
        input.value = 'Delete me'; addBtn.click();
        input.value = 'Keep me'; addBtn.click();
        const delBtn = list.querySelector('li button');
        if (!delBtn) return fail('Each todo should have a delete button.');
        delBtn.click();
        if (list.querySelectorAll('li').length !== 1) return fail('Should have 1 item after deleting.');
        if (!list.textContent.includes('Keep me')) return fail('Remaining item should be "Keep me".');
        return pass();
      },
    ],
  },

  // ── UI Patterns ───────────────────────────────────────────

  {
    id: 'tab-navigation',
    title: 'Tab navigation component',
    tags: ['classList', 'dataset', 'querySelectorAll', 'addEventListener'],
    difficulty: 'medium',
    category: 'ui',
    prompt:
`Wire up tab navigation:

- Clicking a tab button should show its corresponding panel and hide the others.
- The active tab button should have class "active".
- Only one panel should be visible at a time.
- Use data-tab attribute to match buttons to panels.
`,
    html: `
<div class="tabs-container">
  <div class="tab-buttons">
    <button class="tab-btn active" data-tab="tab1">Overview</button>
    <button class="tab-btn" data-tab="tab2">Features</button>
    <button class="tab-btn" data-tab="tab3">Pricing</button>
  </div>
  <div class="tab-panels">
    <div id="tab1" class="tab-panel active">Welcome to the overview. This tab shows general information.</div>
    <div id="tab2" class="tab-panel">Feature list: fast, reliable, scalable, secure.</div>
    <div id="tab3" class="tab-panel">Pricing starts at $9/month. Enterprise plans available.</div>
  </div>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .tab-buttons{display:flex;gap:4px;border-bottom:2px solid #ddd;padding-bottom:0}
  .tab-btn{padding:10px 20px;border:none;background:#f0f0f0;cursor:pointer;border-radius:6px 6px 0 0}
  .tab-btn.active{background:#fff;border-bottom:2px solid #333;font-weight:bold}
  .tab-panel{display:none;padding:16px}
  .tab-panel.active{display:block}
</style>
`,
    starter:
`const buttons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

// TODO: add click handlers to switch tabs
`,
    solution:
`const buttons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.tab-panel');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.querySelector('#' + btn.dataset.tab).classList.add('active');
  });
});
`,
    hints: [
      "Use data-tab attribute to find the matching panel by ID.",
      "Remove 'active' from all buttons and panels first, then add to clicked.",
    ],
    tests: [
      ({ doc }) => {
        doc.querySelector('[data-tab="tab2"]').click();
        if (!doc.querySelector('#tab2').classList.contains('active')) return fail('Tab 2 panel should be active.');
        if (doc.querySelector('#tab1').classList.contains('active')) return fail('Tab 1 panel should NOT be active.');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('[data-tab="tab3"]').click();
        const visible = [...doc.querySelectorAll('.tab-panel')].filter(p => p.classList.contains('active'));
        if (visible.length !== 1) return fail('Exactly one panel should be visible at a time.');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('[data-tab="tab3"]').click();
        if (!doc.querySelector('[data-tab="tab3"]').classList.contains('active')) return fail('Clicked tab button should have "active" class.');
        if (doc.querySelector('[data-tab="tab1"]').classList.contains('active')) return fail('Other tab buttons should NOT have "active".');
        return pass();
      },
    ],
  },

  {
    id: 'accordion',
    title: 'Accordion (expand / collapse)',
    tags: ['classList', 'nextElementSibling', 'querySelectorAll'],
    difficulty: 'medium',
    category: 'ui',
    prompt:
`Build an accordion component:

- Clicking a header toggles its content panel (add/remove class "open").
- When opening a section, close all other sections first (exclusive accordion).
- Add class "active" to the open section's header.
- Clicking an already-open header should close it.
`,
    html: `
<div class="accordion">
  <div class="accordion-item">
    <button class="accordion-header">What is DOM manipulation?</button>
    <div class="accordion-content">DOM manipulation is the process of using JavaScript to change HTML elements, attributes, and styles on a web page.</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header">Why practice DOM challenges?</button>
    <div class="accordion-content">Many frontend interviews test your ability to work with the DOM directly, without frameworks like React or Vue.</div>
  </div>
  <div class="accordion-item">
    <button class="accordion-header">How should I approach these?</button>
    <div class="accordion-content">Start by reading the prompt carefully. Identify which DOM APIs you need. Write code incrementally and test often.</div>
  </div>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .accordion{max-width:500px}
  .accordion-header{display:block;width:100%;padding:12px;text-align:left;border:1px solid #ddd;background:#f9f9f9;cursor:pointer;font-size:15px}
  .accordion-header.active{background:#e0e0e0;font-weight:bold}
  .accordion-content{display:none;padding:12px;border:1px solid #ddd;border-top:none}
  .accordion-content.open{display:block}
</style>
`,
    starter:
`const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    // TODO: toggle this section, close others
  });
});
`,
    solution:
`const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const content = header.nextElementSibling;
    const isOpen = content.classList.contains('open');

    document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('open'));
    document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));

    if (!isOpen) {
      content.classList.add('open');
      header.classList.add('active');
    }
  });
});
`,
    hints: [
      "header.nextElementSibling gives you the content div below the header.",
      "Close all sections first, then open the clicked one (if it wasn't already open).",
    ],
    tests: [
      ({ doc }) => {
        doc.querySelectorAll('.accordion-header')[0].click();
        const c = doc.querySelectorAll('.accordion-content')[0];
        if (!c.classList.contains('open')) return fail('Clicking a header should open its content.');
        return pass();
      },
      ({ doc }) => {
        const headers = doc.querySelectorAll('.accordion-header');
        headers[0].click();
        headers[1].click();
        const contents = doc.querySelectorAll('.accordion-content');
        if (contents[0].classList.contains('open')) return fail('Previous section should close when new one opens.');
        if (!contents[1].classList.contains('open')) return fail('Clicked section should be open.');
        return pass();
      },
      ({ doc }) => {
        const h = doc.querySelectorAll('.accordion-header')[0];
        h.click();
        h.click();
        const c = doc.querySelectorAll('.accordion-content')[0];
        if (c.classList.contains('open')) return fail('Clicking an open header should close it.');
        return pass();
      },
    ],
  },

  {
    id: 'star-rating',
    title: 'Star rating component',
    tags: ['dataset', 'classList', 'event delegation'],
    difficulty: 'medium',
    category: 'ui',
    prompt:
`Build a clickable star rating:

- Clicking a star sets the rating to that star's value (1\u20135).
- All stars up to and including the clicked one should have class "selected".
- Stars beyond the clicked one should NOT have "selected".
- Update #ratingText to "Rating: <n>/5".
- Store the value in a global variable named rating.
`,
    html: `
<div class="rating-container">
  <div id="stars" class="stars">
    <span class="star" data-value="1">\u2605</span>
    <span class="star" data-value="2">\u2605</span>
    <span class="star" data-value="3">\u2605</span>
    <span class="star" data-value="4">\u2605</span>
    <span class="star" data-value="5">\u2605</span>
  </div>
  <p id="ratingText">Rating: 0/5</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .stars{font-size:32px;cursor:pointer;user-select:none}
  .star{color:#ccc;transition:color .15s}
  .star.selected{color:#f5a623}
  #ratingText{font-size:14px;color:#555}
</style>
`,
    starter:
`rating = 0;
const stars = document.querySelectorAll('.star');
const ratingText = document.querySelector('#ratingText');

// TODO: add click handlers to stars
`,
    solution:
`rating = 0;
const stars = document.querySelectorAll('.star');
const ratingText = document.querySelector('#ratingText');

stars.forEach(star => {
  star.addEventListener('click', () => {
    rating = parseInt(star.dataset.value);
    ratingText.textContent = 'Rating: ' + rating + '/5';

    stars.forEach(s => {
      if (parseInt(s.dataset.value) <= rating) {
        s.classList.add('selected');
      } else {
        s.classList.remove('selected');
      }
    });
  });
});
`,
    hints: [
      "Each star has a data-value attribute (1\u20135). Use parseInt(star.dataset.value).",
      "After clicking, loop all stars and compare their value to the rating.",
    ],
    tests: [
      ({ doc, win }) => {
        doc.querySelectorAll('.star')[2].click();
        if (win.rating !== 3) return fail('Rating should be 3 after clicking 3rd star.');
        if (doc.querySelector('#ratingText').textContent !== 'Rating: 3/5') return fail('Text should show "Rating: 3/5".');
        return pass();
      },
      ({ doc }) => {
        doc.querySelectorAll('.star')[4].click();
        const selected = doc.querySelectorAll('.star.selected');
        if (selected.length !== 5) return fail('All 5 stars should be highlighted when rating is 5.');
        return pass();
      },
      ({ doc }) => {
        const stars = doc.querySelectorAll('.star');
        stars[4].click();
        stars[1].click();
        const selected = doc.querySelectorAll('.star.selected');
        if (selected.length !== 2) return fail('Only 2 stars should be highlighted when rating changes to 2.');
        return pass();
      },
    ],
  },

  // ── Advanced ──────────────────────────────────────────────

  {
    id: 'search-filter',
    title: 'Live search filter',
    tags: ['input event', 'filter', 'style.display', 'toLowerCase'],
    difficulty: 'medium',
    category: 'advanced',
    prompt:
`The page has a search input and a list of fruit names.

Wire the input so that on every keystroke:
- Filter the list items, hiding those that don't match (case-insensitive).
- Set non-matching items to display:none, matching to display:''.
- Update #resultCount to "<n> items" (or "<n> item" for 1).
`,
    html: `
<div class="wrap">
  <input id="searchBox" placeholder="Search fruits..." />
  <ul id="itemList">
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
    <li>Date</li>
    <li>Elderberry</li>
    <li>Fig</li>
    <li>Grape</li>
    <li>Honeydew</li>
  </ul>
  <p id="resultCount">8 items</p>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .wrap{max-width:400px}
  input{width:100%;padding:8px;margin-bottom:8px;box-sizing:border-box}
  ul{list-style:none;padding:0}
  li{padding:6px 0;border-bottom:1px solid #eee}
</style>
`,
    starter:
`const searchBox = document.querySelector('#searchBox');
const items = document.querySelectorAll('#itemList li');
const resultCount = document.querySelector('#resultCount');

searchBox.addEventListener('input', () => {
  // TODO: filter items and update count
});
`,
    solution:
`const searchBox = document.querySelector('#searchBox');
const items = document.querySelectorAll('#itemList li');
const resultCount = document.querySelector('#resultCount');

searchBox.addEventListener('input', () => {
  const query = searchBox.value.toLowerCase().trim();
  let visible = 0;

  items.forEach(item => {
    const match = item.textContent.toLowerCase().includes(query);
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });

  resultCount.textContent = visible + ' item' + (visible !== 1 ? 's' : '');
});
`,
    hints: [
      "Use toLowerCase() on both the query and the item text for case-insensitive matching.",
      "Set style.display = 'none' to hide, style.display = '' to show.",
    ],
    tests: [
      ({ doc, win }) => {
        const sb = doc.querySelector('#searchBox');
        sb.value = 'app';
        sb.dispatchEvent(new win.Event('input', { bubbles: true }));
        const vis = [...doc.querySelectorAll('#itemList li')].filter(li => li.style.display !== 'none');
        if (vis.length !== 1) return fail('Searching "app" should show 1 item.');
        if (!vis[0].textContent.includes('Apple')) return fail('Visible item should be "Apple".');
        return pass();
      },
      ({ doc, win }) => {
        const sb = doc.querySelector('#searchBox');
        sb.value = 'xyz';
        sb.dispatchEvent(new win.Event('input', { bubbles: true }));
        const vis = [...doc.querySelectorAll('#itemList li')].filter(li => li.style.display !== 'none');
        if (vis.length !== 0) return fail('Searching "xyz" should show 0 items.');
        if (doc.querySelector('#resultCount').textContent !== '0 items') return fail('Count should show "0 items".');
        return pass();
      },
      ({ doc, win }) => {
        const sb = doc.querySelector('#searchBox');
        sb.value = 'E';
        sb.dispatchEvent(new win.Event('input', { bubbles: true }));
        const vis = [...doc.querySelectorAll('#itemList li')].filter(li => li.style.display !== 'none');
        if (vis.length < 2) return fail('Searching "E" (case-insensitive) should match multiple items.');
        return pass();
      },
    ],
  },

  {
    id: 'shopping-cart',
    title: 'Shopping cart with totals',
    tags: ['event delegation', 'dataset', 'createElement', 'toFixed'],
    difficulty: 'hard',
    category: 'advanced',
    prompt:
`Build a shopping cart:

- Each product has an "Add" button. Clicking it adds the product to the cart.
- If the product is already in the cart, increment its quantity.
- Display each cart item as: "<name> \u00d7 <qty> \u2014 $<subtotal>" in #cartItems.
- Display the total price in #cartTotal as "Total: $<total>".
- Use .toFixed(2) for all dollar amounts.

Products have data-name and data-price attributes.
`,
    html: `
<div class="shop">
  <div class="products">
    <div class="product" data-name="Widget" data-price="9.99">
      <span>Widget \u2014 $9.99</span>
      <button class="add-to-cart">Add</button>
    </div>
    <div class="product" data-name="Gadget" data-price="24.99">
      <span>Gadget \u2014 $24.99</span>
      <button class="add-to-cart">Add</button>
    </div>
    <div class="product" data-name="Doohickey" data-price="14.99">
      <span>Doohickey \u2014 $14.99</span>
      <button class="add-to-cart">Add</button>
    </div>
  </div>
  <div class="cart-section">
    <h3>Cart</h3>
    <ul id="cartItems"></ul>
    <p id="cartTotal">Total: $0.00</p>
  </div>
</div>
<style>
  body{font-family:system-ui;margin:16px}
  .shop{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:600px}
  .product{display:flex;justify-content:space-between;align-items:center;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px}
  button{padding:6px 14px;cursor:pointer}
  ul{list-style:none;padding:0}
  li{padding:4px 0}
  #cartTotal{font-weight:bold;margin-top:8px}
</style>
`,
    starter:
`const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');

// TODO: handle clicks on Add buttons, manage cart state, render cart
`,
    solution:
`const cart = {};
const cartItems = document.querySelector('#cartItems');
const cartTotal = document.querySelector('#cartTotal');

document.querySelector('.products').addEventListener('click', (e) => {
  if (!e.target.classList.contains('add-to-cart')) return;

  const product = e.target.closest('.product');
  const name = product.dataset.name;
  const price = parseFloat(product.dataset.price);

  if (cart[name]) {
    cart[name].qty++;
  } else {
    cart[name] = { price, qty: 1 };
  }

  renderCart();
});

function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;

  for (const [name, item] of Object.entries(cart)) {
    const li = document.createElement('li');
    const subtotal = item.price * item.qty;
    li.textContent = name + ' \\u00d7 ' + item.qty + ' \\u2014 $' + subtotal.toFixed(2);
    cartItems.appendChild(li);
    total += subtotal;
  }

  cartTotal.textContent = 'Total: $' + total.toFixed(2);
}
`,
    hints: [
      "Use event delegation: listen on .products container, check e.target.classList.",
      "e.target.closest('.product') finds the parent product div.",
      "Store cart as an object: { 'Widget': { price: 9.99, qty: 2 } }.",
    ],
    tests: [
      ({ doc }) => {
        doc.querySelector('[data-name="Widget"] .add-to-cart').click();
        const items = doc.querySelectorAll('#cartItems li');
        if (items.length !== 1) return fail('Cart should have 1 item after adding Widget.');
        if (!items[0].textContent.includes('Widget')) return fail('Cart item should show "Widget".');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('[data-name="Widget"] .add-to-cart').click();
        doc.querySelector('[data-name="Widget"] .add-to-cart').click();
        const items = doc.querySelectorAll('#cartItems li');
        if (items.length !== 1) return fail('Adding same product twice should not create a second line.');
        if (!items[0].textContent.includes('2')) return fail('Quantity should be 2.');
        return pass();
      },
      ({ doc }) => {
        doc.querySelector('[data-name="Widget"] .add-to-cart').click();
        doc.querySelector('[data-name="Gadget"] .add-to-cart').click();
        const total = doc.querySelector('#cartTotal').textContent;
        if (total !== 'Total: $34.98') return fail('Total should be $34.98 (9.99 + 24.99).');
        return pass();
      },
    ],
  },

  {
    id: 'countdown-timer',
    title: 'Countdown timer',
    tags: ['setInterval', 'clearInterval', 'padStart', 'textContent'],
    difficulty: 'hard',
    category: 'advanced',
    prompt:
`Build a countdown timer starting at 05:00.

- Start: begins counting down by 1 second. If already running, do nothing.
- Pause: stops the countdown. Time should freeze where it is.
- Reset: stops the countdown and resets to 05:00.
- Display format: "MM:SS" with zero-padding (e.g. "04:59").
- When the timer reaches 00:00, it should stop automatically.
`,
    html: `
<div class="timer-app">
  <div id="display" class="display">05:00</div>
  <div class="controls">
    <button id="startBtn">Start</button>
    <button id="pauseBtn">Pause</button>
    <button id="timerResetBtn">Reset</button>
  </div>
</div>
<style>
  body{font-family:system-ui;margin:16px;text-align:center}
  .display{font-size:48px;font-family:monospace;margin:20px 0}
  .controls{display:flex;gap:8px;justify-content:center}
  button{padding:10px 20px;cursor:pointer;font-size:14px}
</style>
`,
    starter:
`let totalSeconds = 300;
let intervalId = null;

const display = document.querySelector('#display');
const startBtn = document.querySelector('#startBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const resetBtn = document.querySelector('#timerResetBtn');

function updateDisplay() {
  // TODO: format and display MM:SS
}

// TODO: wire up start, pause, reset
`,
    solution:
`let totalSeconds = 300;
let intervalId = null;

const display = document.querySelector('#display');
const startBtn = document.querySelector('#startBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const resetBtn = document.querySelector('#timerResetBtn');

function updateDisplay() {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  display.textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
}

startBtn.addEventListener('click', () => {
  if (intervalId) return;
  intervalId = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(intervalId);
      intervalId = null;
      return;
    }
    totalSeconds--;
    updateDisplay();
  }, 1000);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
});

resetBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = null;
  totalSeconds = 300;
  updateDisplay();
});
`,
    hints: [
      "Use setInterval with 1000ms interval. Store the interval ID to clear it later.",
      "String(n).padStart(2, '0') gives zero-padded numbers.",
      "Check if intervalId is already set before starting, to prevent multiple intervals.",
    ],
    tests: [
      ({ doc }) => {
        const d = doc.querySelector('#display');
        if (d.textContent.trim() !== '05:00') return fail('Initial display should be "05:00".');
        return pass();
      },
      async ({ doc }) => {
        doc.querySelector('#startBtn').click();
        await delay(1150);
        const d = doc.querySelector('#display');
        if (d.textContent.trim() === '05:00') return fail('Timer should decrement after starting.');
        if (d.textContent.trim() !== '04:59') return fail('Expected "04:59" after ~1 second.');
        return pass();
      },
      async ({ doc }) => {
        doc.querySelector('#startBtn').click();
        await delay(1150);
        doc.querySelector('#pauseBtn').click();
        const val = doc.querySelector('#display').textContent.trim();
        await delay(1150);
        if (doc.querySelector('#display').textContent.trim() !== val) return fail('Timer should freeze when paused.');
        return pass();
      },
      async ({ doc }) => {
        doc.querySelector('#startBtn').click();
        await delay(1150);
        doc.querySelector('#timerResetBtn').click();
        if (doc.querySelector('#display').textContent.trim() !== '05:00') return fail('Reset should return to "05:00".');
        return pass();
      },
    ],
  },

];

function pass() { return { ok: true }; }
function fail(message) { return { ok: false, message }; }
function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
