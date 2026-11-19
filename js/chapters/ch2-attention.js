window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[2] = {
  id: 2,
  emoji: '🔦',
  shortTitle: 'The Spotlight & Desk',
  duration: '2 min',
  teaser: 'How AI connects clues across a sentence — and why starting a fresh chat keeps it sharp.',
  render(container, app) {
    const scenarios = [
      {
        label: 'Vase · "too big"',
        words: ['The', 'ceramic', 'vase', 'didn’t', 'fit', 'in', 'the', 'gift', 'box', 'because', 'it', 'was', 'too', 'big.'],
        focusIndex: 10,
        weights: {
          10: { 2: 0.94, 1: 0.48, 13: 0.85, 8: 0.25 },
          13: { 2: 0.82, 10: 0.88, 4: 0.45 },
          2: { 1: 0.88, 10: 0.82, 13: 0.65 },
          8: { 7: 0.9, 4: 0.52, 10: 0.22 }
        },
        insight: 'Notice the thick glowing ribbon! Because the sentence ends with <strong>"big"</strong>, the spotlight locks <strong>"it"</strong> onto <strong>"vase"</strong> (94%). Now switch to "too small"!'
      },
      {
        label: 'Vase · "too small"',
        words: ['The', 'ceramic', 'vase', 'didn’t', 'fit', 'in', 'the', 'gift', 'box', 'because', 'it', 'was', 'too', 'small.'],
        focusIndex: 10,
        weights: {
          10: { 8: 0.95, 7: 0.56, 13: 0.86, 2: 0.22 },
          13: { 8: 0.85, 10: 0.9, 4: 0.48 },
          8: { 7: 0.92, 10: 0.84, 13: 0.72 },
          2: { 1: 0.88, 4: 0.5, 10: 0.2 }
        },
        insight: 'One single word changed at the very end — and the spotlight instantly swung from <strong>"vase"</strong> over to <strong>"gift box"</strong> (95%)! That’s <strong>Attention</strong>.'
      },
      {
        label: 'Rome Text',
        words: ['Maya', 'texted', 'Sofia', 'the', 'moment', 'she', 'landed', 'in', 'Rome.'],
        focusIndex: 5,
        weights: {
          5: { 0: 0.91, 6: 0.84, 8: 0.58, 2: 0.24 },
          6: { 5: 0.88, 0: 0.74, 8: 0.85 },
          0: { 1: 0.78, 5: 0.85, 6: 0.55 },
          2: { 1: 0.75, 5: 0.28 }
        },
        insight: 'AI links <strong>"she"</strong> strongly to <strong>"Maya"</strong> (91%) and <strong>"landed"</strong> — understanding who is stepping off the plane.'
      }
    ];

    const deskCatalog = [
      { id: 'prompt', icon: '💌', label: 'Your Goal', size: 12, color: '#FFF7E8' },
      { id: 'brand', icon: '🎨', label: 'Color Palette', size: 14, color: '#FCECE9' },
      { id: 'photo', icon: '🖼️', label: 'Moodboard Pic', size: 22, color: '#F0ECF8' },
      { id: 'pdf', icon: '📚', label: '20-Page PDF', size: 36, color: '#E8F4EE' },
      { id: 'chat', icon: '💬', label: 'Long Back & Forth', size: 28, color: '#EAF2FB' }
    ];

    let activeTab = 'spotlight';
    let scenarioIdx = 0;
    let selectedWordIdx = scenarios[0].focusIndex;

    let deskItems = [
      { ...deskCatalog[0], uid: 1, rot: -1.5 },
      { ...deskCatalog[1], uid: 2, rot: 1.8 }
    ];
    let nextUid = 3;
    let lastDropped = null;

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 2 of 6 · Focus & Memory</span>
          <h1 class="chapter-title">The Spotlight & the Working Desk</h1>
          <p class="chapter-hook">
            Two visual superpowers explain almost every quirk of AI: <strong>Attention</strong> (how it connects clues) and the <strong>Context Window</strong> (how much fits on its desk at once).
          </p>
        </div>
        <span class="time-badge">⏱ 2 min studio</span>
      </div>

      <div class="toy-tabs" role="tablist">
        <button class="toy-tab active" data-tab="spotlight">🔦 Lab 1: Attention Spotlight</button>
        <button class="toy-tab" data-tab="desk">🗂️ Lab 2: The Working Desk</button>
      </div>

      <!-- TAB 1: ATTENTION -->
      <section class="studio-card" id="panel-spotlight">
        <div class="studio-card-header">
          <h2 class="studio-card-title">Watch meaning connect across words</h2>
          <span class="card-badge">Tap any word!</span>
        </div>
        <p class="micro-caption">Toggle between <strong>"too big"</strong> and <strong>"too small"</strong> — watch where the thick glowing ribbon points from <strong>"it"</strong>.</p>

        <div class="chip-row" id="attn-presets">
          ${scenarios.map((s, i) => `<button class="btn-soft ${i === 0 ? 'active' : ''}" data-scen="${i}">${s.label}</button>`).join('')}
        </div>

        <div class="attention-stage" id="attention-stage">
          <div class="attention-canvas-wrap">
            <svg class="attention-svg" id="attention-svg" aria-hidden="true"></svg>
            <div class="attention-words" id="attention-words"></div>
          </div>
          <div class="attention-insight" id="attention-insight"></div>
        </div>
      </section>

      <!-- TAB 2: WORKING DESK (CONTEXT WINDOW) -->
      <section class="studio-card" id="panel-desk" style="display: none;">
        <div class="studio-card-header">
          <h2 class="studio-card-title">Fill up the AI's Working Desk</h2>
          <span class="card-badge sage">Context Window</span>
        </div>
        <p class="micro-caption">AI doesn't remember forever — it only sees what fits on its <strong>desk right now</strong>. Toss items onto the desk until it overflows!</p>

        <div class="desk-layout">
          <div class="desk-controls">
            ${deskCatalog.map((item) => `
              <button class="desk-add-btn" data-add="${item.id}">
                <span>${item.icon} ${item.label}</span>
                <span class="desk-size-tag">+${item.size}%</span>
              </button>
            `).join('')}
            <button class="btn-dark" id="fresh-desk-btn" style="margin-top: 6px;">✨ Start Fresh Thread</button>
          </div>

          <div class="desk-surface">
            <div>
              <div class="desk-meter-row">
                <strong style="font-size: 12.5px; white-space: nowrap;">Desk Space</strong>
                <div class="desk-meter-track">
                  <div class="desk-meter-fill" id="desk-meter-fill" style="width: 26%;"></div>
                </div>
                <span id="desk-pct" style="font-family: var(--font-mono); font-size: 12px; font-weight: 700;">26%</span>
              </div>
              <div class="desk-items-area" id="desk-items-area"></div>
            </div>
            <div id="desk-footer-msg"></div>
          </div>
        </div>
      </section>

      <div id="ch2-check"></div>
    `;

    // --- Tab switching ---
    const panelSpotlight = container.querySelector('#panel-spotlight');
    const panelDesk = container.querySelector('#panel-desk');
    container.querySelectorAll('.toy-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        window.AtelierSound.click();
        activeTab = tab.dataset.tab;
        container.querySelectorAll('.toy-tab').forEach((t) => t.classList.toggle('active', t === tab));
        panelSpotlight.style.display = activeTab === 'spotlight' ? 'block' : 'none';
        panelDesk.style.display = activeTab === 'desk' ? 'block' : 'none';
        if (activeTab === 'spotlight') requestAnimationFrame(drawArcs);
      });
    });

    // --- Attention Visualizer ---
    const wordsWrap = container.querySelector('#attention-words');
    const svgEl = container.querySelector('#attention-svg');
    const insightEl = container.querySelector('#attention-insight');

    function getWeightsFor(scen, idx) {
      if (scen.weights[idx]) return scen.weights[idx];
      // Fallback: gently link neighboring words
      const fallback = {};
      if (idx > 0) fallback[idx - 1] = 0.65;
      if (idx < scen.words.length - 1) fallback[idx + 1] = 0.55;
      if (idx !== scen.focusIndex) fallback[scen.focusIndex] = 0.35;
      return fallback;
    }

    function drawArcs() {
      const scen = scenarios[scenarioIdx];
      const wordEls = Array.from(wordsWrap.querySelectorAll('.attn-word'));
      if (!wordEls.length) return;
      const svgRect = svgEl.getBoundingClientRect();
      if (svgRect.width === 0) return;

      const sourceEl = wordEls[selectedWordIdx];
      const srcRect = sourceEl.getBoundingClientRect();
      const x1 = srcRect.left + srcRect.width / 2 - svgRect.left;
      const y1 = srcRect.top - svgRect.top;
      const weights = getWeightsFor(scen, selectedWordIdx);

      let paths = `
        <defs>
          <linearGradient id="attnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#7865A8" />
            <stop offset="100%" stop-color="#D96857" />
          </linearGradient>
        </defs>
      `;

      Object.entries(weights).forEach(([targetStr, w]) => {
        const tIdx = Number(targetStr);
        const targetEl = wordEls[tIdx];
        if (!targetEl) return;
        const tRect = targetEl.getBoundingClientRect();
        const x2 = tRect.left + tRect.width / 2 - svgRect.left;
        const y2 = tRect.top - svgRect.top;
        const dist = Math.hypot(x2 - x1, y2 - y1);
        const topY = Math.min(y1, y2);
        const archHeight = Math.min(82, Math.max(30, dist * 0.24 + 18));
        const cx = (x1 + x2) / 2;
        const cy = Math.max(8, topY - archHeight);
        const strokeW = (1.6 + w * 5.8).toFixed(1);
        const opacity = (0.24 + w * 0.74).toFixed(2);

        paths += `
          <path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}"
            fill="none" stroke="url(#attnGrad)" stroke-width="${strokeW}"
            stroke-linecap="round" opacity="${opacity}" />
          <circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(2.5 + w * 3).toFixed(1)}" fill="#D96857" opacity="${opacity}" />
        `;
      });

      svgEl.innerHTML = paths;
    }

    function renderAttention() {
      const scen = scenarios[scenarioIdx];
      const weights = getWeightsFor(scen, selectedWordIdx);

      wordsWrap.innerHTML = scen.words.map((w, idx) => {
        let cls = 'attn-word';
        if (idx === selectedWordIdx) cls += ' selected';
        else if ((weights[idx] || 0) >= 0.7) cls += ' linked-high';
        else if ((weights[idx] || 0) >= 0.4) cls += ' linked-med';
        return `<button class="${cls}" data-widx="${idx}">${w}</button>`;
      }).join('');

      insightEl.innerHTML = `<span style="font-size: 20px;">💡</span><div>${scen.insight}</div>`;

      wordsWrap.querySelectorAll('[data-widx]').forEach((btn) => {
        btn.addEventListener('click', () => {
          window.AtelierSound.pop();
          selectedWordIdx = Number(btn.dataset.widx);
          renderAttention();
        });
      });

      requestAnimationFrame(drawArcs);
    }

    container.querySelectorAll('[data-scen]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        scenarioIdx = Number(btn.dataset.scen);
        selectedWordIdx = scenarios[scenarioIdx].focusIndex;
        container.querySelectorAll('[data-scen]').forEach((b) => b.classList.toggle('active', b === btn));
        renderAttention();
      });
    });

    const onResize = () => {
      if (activeTab === 'spotlight') drawArcs();
    };
    window.addEventListener('resize', onResize);
    app.registerCleanup(() => window.removeEventListener('resize', onResize));

    renderAttention();

    // --- Working Desk (Context Window) ---
    const meterFill = container.querySelector('#desk-meter-fill');
    const deskPctEl = container.querySelector('#desk-pct');
    const deskArea = container.querySelector('#desk-items-area');
    const deskFooter = container.querySelector('#desk-footer-msg');

    function renderDesk() {
      const total = deskItems.reduce((sum, i) => sum + i.size, 0);
      const clamped = Math.min(100, total);
      meterFill.style.width = `${clamped}%`;
      meterFill.className = 'desk-meter-fill' + (clamped >= 90 ? ' full' : clamped >= 65 ? ' warn' : '');
      deskPctEl.textContent = `${clamped}%`;

      if (!deskItems.length) {
        deskArea.innerHTML = `<span style="color: var(--ink-soft); font-size: 13.5px; margin: auto;">✨ Clean desk! Tap an item on the left to put it in AI's view.</span>`;
      } else {
        deskArea.innerHTML = deskItems.map((item) => `
          <div class="desk-note" style="background: ${item.color}; --rot: ${item.rot}deg; transform: rotate(${item.rot}deg);">
            <span>${item.icon}</span>
            <span>${item.label}</span>
            <span style="font-family: var(--font-mono); font-size: 10.5px; opacity: 0.6;">${item.size}%</span>
          </div>
        `).join('');
      }

      if (lastDropped) {
        deskFooter.innerHTML = `
          <div class="dropped-banner">
            <span>💨</span>
            <span>Desk full! <strong>${lastDropped.icon} ${lastDropped.label}</strong> slid off the edge — AI just forgot your earliest instruction!</span>
          </div>
        `;
      } else if (clamped >= 70) {
        deskFooter.innerHTML = `
          <div style="margin-top: 12px; font-size: 12.5px; color: #7C5310; background: var(--gold-soft); padding: 9px 12px; border-radius: 10px; font-weight: 600;">
            ⚠️ Getting crowded! Add one more heavy item to see what happens when the desk overflows.
          </div>
        `;
      } else {
        deskFooter.innerHTML = `
          <div style="margin-top: 12px; font-size: 12.5px; color: var(--ink-soft);">
            💡 <strong>Codex Tip:</strong> Starting a new thread gives Codex a clean, sharp desk for each new idea.
          </div>
        `;
      }
    }

    container.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const template = deskCatalog.find((d) => d.id === btn.dataset.add);
        if (!template) return;
        lastDropped = null;
        deskItems.push({ ...template, uid: nextUid++, rot: (Math.random() - 0.5) * 4.5 });
        let total = deskItems.reduce((s, i) => s + i.size, 0);
        if (total > 100) {
          window.AtelierSound.oops();
          while (total > 100 && deskItems.length > 1) {
            lastDropped = deskItems.shift();
            total = deskItems.reduce((s, i) => s + i.size, 0);
          }
        } else {
          window.AtelierSound.pop();
        }
        renderDesk();
      });
    });

    container.querySelector('#fresh-desk-btn').addEventListener('click', () => {
      window.AtelierSound.spark();
      deskItems = [{ ...deskCatalog[0], uid: nextUid++, rot: -1 }];
      lastDropped = null;
      renderDesk();
    });

    renderDesk();

    // --- Quick Check ---
    app.renderCheck(container.querySelector('#ch2-check'), {
      chapterId: 2,
      question: 'Quick Spark Check: You’ve been chatting in one long thread for an hour, and AI starts forgetting your original design style. Why?',
      options: [
        { label: 'It got tired and needs a 10-minute break', correct: false },
        { label: 'Its Working Desk (context window) filled up and older notes got crowded out', correct: true },
        { label: 'It deleted your files from your laptop', correct: false }
      ],
      explanation: 'Exactly! Opening a fresh thread clears the desk so AI stays laser-focused on your current task.'
    });
  }
};
