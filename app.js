import { challenges } from './challenges.js';

const els = {
  newChallengeBtn: document.querySelector('#newChallengeBtn'),
  resetBtn: document.querySelector('#resetBtn'),
  revealBtn: document.querySelector('#revealBtn'),
  runBtn: document.querySelector('#runBtn'),
  formatBtn: document.querySelector('#formatBtn'),
  rerunTestsBtn: document.querySelector('#rerunTestsBtn'),
  openSandboxBtn: document.querySelector('#openSandboxBtn'),
  editor: document.querySelector('#editor'),
  results: document.querySelector('#results'),
  sandbox: document.querySelector('#sandbox'),
  prompt: document.querySelector('#prompt'),
  hints: document.querySelector('#hints'),
  htmlStub: document.querySelector('#htmlStub'),
  starter: document.querySelector('#starter'),
  solution: document.querySelector('#solution'),
  solutionWrap: document.querySelector('#solutionWrap'),
  challengeMeta: document.querySelector('#challengeMeta'),
};

let current = null;
let lastRun = null;

boot();

function boot() {
  bind();
  pickChallenge();
  els.editor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
    }
    // Better tab behavior
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = els.editor;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      ta.setRangeText('  ', start, end, 'end');
    }
  });
}

function bind() {
  els.newChallengeBtn.addEventListener('click', () => pickChallenge());
  els.resetBtn.addEventListener('click', () => resetToStarter());
  els.revealBtn.addEventListener('click', () => toggleSolution());
  els.runBtn.addEventListener('click', () => run());
  els.rerunTestsBtn.addEventListener('click', () => rerunTests());
  els.formatBtn.addEventListener('click', () => basicFormat());
  els.openSandboxBtn.addEventListener('click', () => popoutSandbox());
}

function pickChallenge() {
  const idx = Math.floor(Math.random() * challenges.length);
  loadChallenge(challenges[idx]);
}

function loadChallenge(ch) {
  current = ch;
  lastRun = null;

  els.challengeMeta.textContent = `Challenge: ${ch.title}  •  Tags: ${ch.tags.join(', ')}`;
  els.prompt.textContent = ch.prompt.trim();
  els.hints.innerHTML = ch.hints.map(h => `<div>• ${escapeHtml(h)}</div>`).join('');
  els.htmlStub.textContent = ch.html.trim();
  els.starter.textContent = ch.starter.trim();
  els.solution.textContent = ch.solution.trim();
  els.solutionWrap.hidden = true;

  els.editor.value = ch.starter;
  setResults('Ready. Write code, then Run.', { kind: 'neutral' });
  resetSandbox();
}

function resetToStarter() {
  if (!current) return;
  els.editor.value = current.starter;
  els.solutionWrap.hidden = true;
  setResults('Reset to starter. Run when ready.', { kind: 'neutral' });
  resetSandbox();
}

function toggleSolution() {
  if (!current) return;
  els.solutionWrap.hidden = !els.solutionWrap.hidden;
}

function resetSandbox() {
  if (!current) return;

  const srcdoc = `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Sandbox</title></head>
<body>
${current.html}
<script>
  // Marker that the iframe is ready
  window.__SANDBOX_READY__ = true;
</script>
</body>
</html>`;

  els.sandbox.srcdoc = srcdoc;
}

async function run() {
  if (!current) return;
  resetSandbox();

  await waitForIframeReady(els.sandbox);

  const win = els.sandbox.contentWindow;
  const doc = els.sandbox.contentDocument;

  const userCode = els.editor.value;
  lastRun = userCode;

  try {
    // Execute in iframe context.
    // eslint-disable-next-line no-new-func
    const fn = new win.Function(userCode);
    fn();
  } catch (err) {
    setResults(`JS runtime error:\n${formatErr(err)}`, { kind: 'bad' });
    return;
  }

  const report = runTests({ doc, win });
  renderReport(report);
}

function rerunTests() {
  if (!current) return;
  if (!lastRun) {
    setResults('Nothing to re-test yet. Click Run first.', { kind: 'neutral' });
    return;
  }
  // Re-run means: reset iframe, run last code, run tests.
  run();
}

function runTests({ doc, win }) {
  const failures = [];
  let passed = 0;

  for (let i = 0; i < current.tests.length; i++) {
    let res;
    try {
      res = current.tests[i]({ doc, win });
    } catch (err) {
      res = { ok: false, message: `Test ${i + 1} threw: ${formatErr(err)}` };
    }
    if (res && res.ok) passed++;
    else failures.push({ i: i + 1, message: res?.message ?? 'Failed' });
  }

  return {
    title: current.title,
    passed,
    total: current.tests.length,
    failures,
  };
}

function renderReport(r) {
  if (r.failures.length === 0) {
    setResults(`✅ All tests passed (${r.passed}/${r.total}).\n\nNext: click “New challenge” and keep looping until it’s boring.`, { kind: 'ok' });
    return;
  }

  const lines = [];
  lines.push(`❌ Tests failed (${r.passed}/${r.total} passed)`);
  for (const f of r.failures) {
    lines.push(`- Test ${f.i}: ${f.message}`);
  }
  lines.push('');
  lines.push('Pro move: fix ONE failure at a time, then Run again.');

  setResults(lines.join('\n'), { kind: 'bad' });
}

function setResults(text, { kind }) {
  els.results.textContent = text;
  els.results.classList.remove('ok', 'bad');
  if (kind === 'ok') els.results.classList.add('ok');
  if (kind === 'bad') els.results.classList.add('bad');
}

function basicFormat() {
  // Minimal formatting: trim trailing spaces and normalize blank lines.
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

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatErr(err) {
  if (!err) return String(err);
  const msg = err?.stack || err?.message || String(err);
  return String(msg);
}

function waitForIframeReady(iframe) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timeoutMs = 1500;

    function tick() {
      try {
        const win = iframe.contentWindow;
        if (win && win.__SANDBOX_READY__) return resolve();
      } catch (e) {
        // ignore
      }
      if (Date.now() - start > timeoutMs) return reject(new Error('Sandbox did not become ready in time'));
      requestAnimationFrame(tick);
    }
    tick();
  });
}
