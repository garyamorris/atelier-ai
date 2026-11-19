window.AtelierCheatSheet = (() => {
  const starterPrompts = [
    {
      title: '1. Your Very First Mini-App (Zero Pressure)',
      text: 'Build a clean single-page web app in this folder for my weekend trip planner. Use a warm cream background, rounded white cards, serif headings, and a button to add new spots. Keep it simple so I can open index.html in my browser.'
    },
    {
      title: '2. Turn Messy Notes Into Something Pretty',
      text: 'Read the text files in this folder and turn them into a visual, searchable card gallery I can open locally. Give it a calm botanical sage & cream aesthetic.'
    },
    {
      title: '3. Design Polish (Creative Director Mode)',
      text: 'Make the page feel more spacious and magazine-like: increase padding between cards, add a soft hover lift, and add a toggle between a sunlit light theme and an evening dark theme.'
    },
    {
      title: '4. When Something Looks Off',
      text: 'When I click the Save button, nothing happens yet. Please check why, fix it, and summarize what you changed in 2 simple sentences.'
    }
  ];

  const glossary = [
    { icon: '🧩', term: 'Token', def: 'A word-piece tile AI reads & predicts one beat at a time.' },
    { icon: '🗂️', term: 'Context Window', def: 'AI’s Working Desk — start a fresh thread when changing topics.' },
    { icon: '📖', term: 'Grounding', def: 'Letting AI read your real files so it stops improvising.' },
    { icon: '🦾', term: 'Agent Loop', def: 'Read → Plan → Act → Check & self-fix automatically.' },
    { icon: '📁', term: 'Project Folder', def: 'Your safe sandbox — Desktop Codex only touches this folder.' },
    { icon: '🔍', term: 'Diff', def: 'Green = added, Red = removed. Always previewable & undoable.' }
  ];

  function render(container, app) {
    container.innerHTML = `
      <div style="background: var(--sage-soft); border: 1px solid rgba(73,133,110,0.28); border-radius: 16px; padding: 15px 16px;">
        <strong style="display: block; font-size: 14px; color: #1F5B44; margin-bottom: 6px;">✨ Your First 5 Minutes in Desktop Codex</strong>
        <ol style="margin: 0; padding-left: 18px; font-size: 13px; color: #264A3C; display: flex; flex-direction: column; gap: 5px;">
          <li>Create an empty folder on your computer (e.g. <code>my-first-studio</code>).</li>
          <li>Open Desktop Codex and select that folder.</li>
          <li>Paste one of the starter prompts below and hit Send!</li>
          <li>Preview the result, ask for 2–3 fun tweaks, and click Keep (or Undo anytime!).</li>
        </ol>
      </div>

      <div>
        <span class="eyebrow">Copy & Paste Prompts</span>
        <h3 style="font-family: var(--font-serif); margin: 2px 0 10px; font-size: 19px;">Ready-to-Use Codex Starters</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${starterPrompts.map((p, i) => `
            <div class="prompt-copy-card">
              <strong style="font-size: 12.5px; color: var(--plum);">${p.title}</strong>
              <code>${p.text}</code>
              <button class="copy-mini-btn" data-copy="${i}">📋 Copy Prompt</button>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <span class="eyebrow">Pocket Glossary</span>
        <h3 style="font-family: var(--font-serif); margin: 2px 0 10px; font-size: 19px;">6 Words, Zero Jargon</h3>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
          ${glossary.map((g) => `
            <div style="display: flex; gap: 10px; align-items: flex-start; background: var(--surface); border: 1px solid var(--border); border-radius: 13px; padding: 10px 12px;">
              <span style="font-size: 18px;">${g.icon}</span>
              <div>
                <strong style="font-size: 13px;">${g.term}</strong>
                <div style="font-size: 12.5px; color: var(--ink-soft);">${g.def}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.copy);
        const text = starterPrompts[idx].text;
        window.AtelierSound.pop();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(() => {});
        }
        btn.textContent = '✓ Copied!';
        app.showToast('📋 Prompt copied — ready to paste into Desktop Codex!');
        setTimeout(() => { btn.textContent = '📋 Copy Prompt'; }, 1800);
      });
    });
  }

  return { render };
})();
