import { challenges, categories } from './challenges.js';

// ── DOM refs ────────────────────────────────────────────────
const els = {
  // Header
  statText:       document.querySelector('#statText'),
  progressFill:   document.querySelector('#progressFill'),
  timerSelect:    document.querySelector('#timerSelect'),
  timerDisplay:   document.querySelector('#timerDisplay'),
  timerToggleBtn: document.querySelector('#timerToggleBtn'),
  timerResetBtn:  document.querySelector('#timerResetBtn'),
  // Sidebar
  sidebar:          document.querySelector('#sidebar'),
  sidebarToggle:    document.querySelector('#sidebarToggle'),
  searchChallenges: document.querySelector('#searchChallenges'),
  difficultyFilter: document.querySelector('#difficultyFilter'),
  categoryFilter:   document.querySelector('#categoryFilter'),
  challengeList:    document.querySelector('#challengeList'),
  // Challenge
  challengeTitle: document.querySelector('#challengeTitle'),
  diffBadge:      document.querySelector('#diffBadge'),
  catBadge:       document.querySelector('#catBadge'),
  challengeMeta:  document.querySelector('#challengeMeta'),
  prompt:         document.querySelector('#prompt'),
  hints:          document.querySelector('#hints'),
  htmlStub:       document.querySelector('#htmlStub'),
  starter:        document.querySelector('#starter'),
  solution:       document.querySelector('#solution'),
  solutionWrap:   document.querySelector('#solutionWrap'),
  // Editor
  editor:       document.querySelector('#editor'),
  runBtn:       document.querySelector('#runBtn'),
  formatBtn:    document.querySelector('#formatBtn'),
  resetBtn:     document.querySelector('#resetBtn'),
  revealBtn:    document.querySelector('#revealBtn'),
  results:      document.querySelector('#results'),
  testProgress: document.querySelector('#testProgress'),
  nextWrap:     document.querySelector('#nextWrap'),
  nextBtn:      document.querySelector('#nextBtn'),
  // Sandbox
  sandbox:       document.querySelector('#sandbox'),
  rerunTestsBtn: document.querySelector('#rerunTestsBtn'),
  openSandboxBtn:document.querySelector('#openSandboxBtn'),
};

// ── State ───────────────────────────────────────────────────
let current = null;
let lastRun = null;
let running = false;

const STORAGE_KEY = 'dom-trainer-progress';
let progress = loadProgress();

let timer = { seconds: 0, remaining: 0, intervalId: null, active: false };

// ── Boot ────────────────────────────────────────────────────
boot();

function boot() {
  populateCategoryFilter();
  renderChallengeList();
  bind();

  const saved = progress.lastChallenge;
  const ch = saved ? challenges.find(c => c.id === saved) : challenges[0];
  loadChallenge(ch || challenges[0]);

  updateStatsUI();
}

// ── Bindings ────────────────────────────────────────────────
function bind() {
  els.runBtn.addEventListener('click', () => run());
  els.resetBtn.addEventListener('click', () => resetToStarter());
  els.revealBtn.addEventListener('click', () => toggleSolution());
  els.formatBtn.addEventListener('click', () => basicFormat());
  els.rerunTestsBtn.addEventListener('click', () => run());
  els.openSandboxBtn.addEventListener('click', () => popoutSandbox());
  els.nextBtn.addEventListener('click', () => goNextUnsolved());

  els.sidebarToggle.addEventListener('click', () => {
    els.sidebar.classList.toggle('collapsed');
    els.sidebarToggle.textContent = els.sidebar.classList.contains('collapsed') ? '\u00bb' : '\u00ab';
  });

  els.searchChallenges.addEventListener('input', () => renderChallengeList());
  els.difficultyFilter.addEventListener('change', () => renderChallengeList());
  els.categoryFilter.addEventListener('change', () => renderChallengeList());

  els.timerToggleBtn.addEventListener('click', () => toggleTimer());
  els.timerResetBtn.addEventListener('click', () => resetTimerUI());
  els.timerSelect.addEventListener('change', () => resetTimerUI());

  els.editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = els.editor;
      ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
    }
  });
}

// ── Challenge list ──────────────────────────────────────────
function populateCategoryFilter() {
  for (const cat of categories) {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    els.categoryFilter.appendChild(opt);
  }
}

function getFilteredChallenges() {
  const q = els.searchChallenges.value.toLowerCase().trim();
  const diff = els.difficultyFilter.value;
  const cat = els.categoryFilter.value;

  return challenges.filter(ch => {
    if (diff !== 'all' && ch.difficulty !== diff) return false;
    if (cat !== 'all' && ch.category !== cat) return false;
    if (q && !ch.title.toLowerCase().includes(q) && !ch.tags.some(t => t.toLowerCase().includes(q))) return false;
    return true;
  });
}

function renderChallengeList() {
  const filtered = getFilteredChallenges();
  const grouped = {};

  for (const cat of categories) grouped[cat.id] = [];
  for (const ch of filtered) {
    if (!grouped[ch.category]) grouped[ch.category] = [];
    grouped[ch.category].push(ch);
  }

  els.challengeList.innerHTML = '';

  for (const cat of categories) {
    const items = grouped[cat.id];
    if (!items || items.length === 0) continue;

    const header = document.createElement('div');
    header.className = 'ch-group-header';
    header.style.cssText = 'padding:6px 14px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-top:4px';
    header.textContent = cat.name;
    els.challengeList.appendChild(header);

    for (const ch of items) {
      const div = document.createElement('div');
      div.className = 'ch-item' + (current && current.id === ch.id ? ' active' : '');
      div.dataset.id = ch.id;

      const solved = progress.solved && progress.solved[ch.id];
      const check = document.createElement('div');
      check.className = 'ch-check' + (solved ? ' solved' : '');
      check.textContent = solved ? '\u2713' : '';

      const info = document.createElement('div');
      info.className = 'ch-info';

      const title = document.createElement('div');
      title.className = 'ch-title';
      title.textContent = ch.title;

      const tags = document.createElement('div');
      tags.className = 'ch-tags';
      tags.textContent = ch.difficulty + ' \u00b7 ' + ch.tags.slice(0, 3).join(', ');

      info.appendChild(title);
      info.appendChild(tags);
      div.appendChild(check);
      div.appendChild(info);

      div.addEventListener('click', () => {
        loadChallenge(ch);
        renderChallengeList();
      });

      els.challengeList.appendChild(div);
    }
  }
}

// ── Challenge loading ───────────────────────────────────────
function loadChallenge(ch) {
  current = ch;
  lastRun = null;
  running = false;

  els.challengeTitle.textContent = ch.title;
  els.diffBadge.textContent = ch.difficulty;
  els.diffBadge.className = 'badge diff-' + ch.difficulty;

  const catObj = categories.find(c => c.id === ch.category);
  els.catBadge.textContent = catObj ? catObj.name : ch.category;

  els.challengeMeta.textContent = 'Tags: ' + ch.tags.join(', ');
  els.prompt.textContent = ch.prompt.trim();
  els.hints.innerHTML = ch.hints.map(h => '<div>\u2022 ' + escapeHtml(h) + '</div>').join('');
  els.htmlStub.textContent = ch.html.trim();
  els.starter.textContent = ch.starter.trim();
  els.solution.textContent = ch.solution.trim();
  els.solutionWrap.hidden = true;

  els.editor.value = ch.starter;
  els.testProgress.textContent = '';
  els.nextWrap.hidden = true;
  setResults('Ready. Write code, then Run.', { kind: 'neutral' });
  resetSandbox();

  progress.lastChallenge = ch.id;
  saveProgress();
}

function resetToStarter() {
  if (!current) return;
  els.editor.value = current.starter;
  els.solutionWrap.hidden = true;
  els.nextWrap.hidden = true;
  els.testProgress.textContent = '';
  setResults('Reset to starter. Run when ready.', { kind: 'neutral' });
  resetSandbox();
}

function toggleSolution() {
  if (!current) return;
  els.solutionWrap.hidden = !els.solutionWrap.hidden;
}

// ── Sandbox ─────────────────────────────────────────────────
function resetSandbox() {
  if (!current) return;
  try { if (els.sandbox.contentWindow) els.sandbox.contentWindow.__SANDBOX_READY__ = false; } catch (e) { /* cross-origin */ }
  const srcdoc = `<!doctype html>
<html><head><meta charset="utf-8" /><title>Sandbox</title></head>
<body>
${current.html}
<script>window.__SANDBOX_READY__ = true;<\/script>
</body></html>`;
  els.sandbox.srcdoc = srcdoc;
}

function waitForIframeReady(iframe) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function tick() {
      try {
        if (iframe.contentWindow && iframe.contentWindow.__SANDBOX_READY__) return resolve();
      } catch (e) { /* ignore */ }
      if (Date.now() - start > 2000) return reject(new Error('Sandbox did not become ready'));
      requestAnimationFrame(tick);
    }
    tick();
  });
}

// ── Run & Test ──────────────────────────────────────────────
async function run() {
  if (!current || running) return;
  running = true;
  els.runBtn.disabled = true;
  els.nextWrap.hidden = true;

  const userCode = els.editor.value;
  lastRun = userCode;
  setResults('Running tests...', { kind: 'neutral' });

  const report = await runTestsIsolated(userCode);
  renderReport(report);

  running = false;
  els.runBtn.disabled = false;
}

async function runTestsIsolated(userCode) {
  const failures = [];
  let passed = 0;

  for (let i = 0; i < current.tests.length; i++) {
    els.testProgress.textContent = `Running test ${i + 1} / ${current.tests.length}...`;

    resetSandbox();
    await new Promise(r => setTimeout(r, 50));
    try {
      await waitForIframeReady(els.sandbox);
    } catch (err) {
      failures.push({ i: i + 1, message: 'Sandbox failed to load' });
      continue;
    }

    const win = els.sandbox.contentWindow;
    const doc = els.sandbox.contentDocument;

    try {
      const fn = new win.Function(userCode);
      fn();
    } catch (err) {
      failures.push({ i: i + 1, message: 'JS error: ' + formatErr(err) });
      continue;
    }

    let res;
    try {
      res = await Promise.resolve(current.tests[i]({ doc, win }));
    } catch (err) {
      res = { ok: false, message: 'Test ' + (i + 1) + ' threw: ' + formatErr(err) };
    }

    if (res && res.ok) passed++;
    else failures.push({ i: i + 1, message: res?.message ?? 'Failed' });
  }

  els.testProgress.textContent = passed + ' / ' + current.tests.length + ' passed';
  return { title: current.title, passed, total: current.tests.length, failures };
}

function renderReport(r) {
  if (r.failures.length === 0) {
    setResults('All tests passed (' + r.passed + '/' + r.total + ').\n\nGreat job! Try the next challenge.', { kind: 'ok' });
    markSolved(current.id);
    els.nextWrap.hidden = false;
    return;
  }

  const lines = [];
  lines.push('Tests failed (' + r.passed + '/' + r.total + ' passed)');
  for (const f of r.failures) {
    lines.push('  Test ' + f.i + ': ' + f.message);
  }
  lines.push('');
  lines.push('Fix one failure at a time, then Run again.');
  setResults(lines.join('\n'), { kind: 'bad' });
}

function setResults(text, { kind }) {
  els.results.textContent = text;
  els.results.classList.remove('ok', 'bad');
  if (kind === 'ok') els.results.classList.add('ok');
  if (kind === 'bad') els.results.classList.add('bad');
}

// ── Progress ────────────────────────────────────────────────
function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { solved: {}, lastChallenge: null };
  } catch { return { solved: {}, lastChallenge: null }; }
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* ignore */ }
}

function markSolved(id) {
  if (!progress.solved) progress.solved = {};
  if (!progress.solved[id]) {
    progress.solved[id] = Date.now();
    saveProgress();
    updateStatsUI();
    renderChallengeList();
  }
}

function updateStatsUI() {
  const solved = progress.solved ? Object.keys(progress.solved).length : 0;
  const total = challenges.length;
  els.statText.textContent = solved + ' / ' + total + ' solved';
  els.progressFill.style.width = (total > 0 ? (solved / total) * 100 : 0) + '%';
}

function goNextUnsolved() {
  const idx = current ? challenges.indexOf(current) : -1;
  for (let i = 1; i <= challenges.length; i++) {
    const ch = challenges[(idx + i) % challenges.length];
    if (!progress.solved || !progress.solved[ch.id]) {
      loadChallenge(ch);
      renderChallengeList();
      return;
    }
  }
  setResults('You solved all challenges! Amazing work.', { kind: 'ok' });
}

// ── Timer ───────────────────────────────────────────────────
function toggleTimer() {
  if (timer.active) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  const seconds = parseInt(els.timerSelect.value);
  if (seconds === 0) return;

  if (timer.remaining <= 0) {
    timer.remaining = seconds;
  }
  timer.seconds = seconds;
  timer.active = true;
  els.timerToggleBtn.textContent = 'Pause';
  updateTimerDisplay();

  timer.intervalId = setInterval(() => {
    timer.remaining--;
    updateTimerDisplay();
    if (timer.remaining <= 0) {
      pauseTimer();
      els.timerDisplay.style.color = 'var(--bad)';
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer.intervalId);
  timer.intervalId = null;
  timer.active = false;
  els.timerToggleBtn.textContent = 'Start';
}

function resetTimerUI() {
  pauseTimer();
  const seconds = parseInt(els.timerSelect.value);
  timer.remaining = seconds;
  timer.seconds = seconds;
  els.timerDisplay.style.color = '';
  updateTimerDisplay();
}

function updateTimerDisplay() {
  if (timer.remaining <= 0 && timer.seconds === 0) {
    els.timerDisplay.textContent = '--:--';
    return;
  }
  const m = Math.floor(Math.max(0, timer.remaining) / 60);
  const s = Math.max(0, timer.remaining) % 60;
  els.timerDisplay.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

  if (timer.remaining > 0 && timer.remaining <= 60) {
    els.timerDisplay.style.color = 'var(--bad)';
  } else if (timer.remaining > 60) {
    els.timerDisplay.style.color = '';
  }
}

// ── Editor utils ────────────────────────────────────────────
function basicFormat() {
  const s = els.editor.value
    .split('\n')
    .map(l => l.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');
  els.editor.value = s;
}

function popoutSandbox() {
  if (!current) return;
  const w = window.open('', '_blank', 'noopener,noreferrer,width=520,height=520');
  if (!w) {
    setResults('Pop-out blocked by browser. Allow popups for this page.', { kind: 'bad' });
    return;
  }
  w.document.open();
  w.document.write(els.sandbox.srcdoc);
  w.document.close();
}

// ── Helpers ─────────────────────────────────────────────────
function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function formatErr(err) {
  if (!err) return String(err);
  return String(err?.stack || err?.message || err);
}
