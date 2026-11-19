window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[3] = {
  id: 3,
  emoji: '🎭',
  shortTitle: 'Improv vs. Open-Book',
  duration: '2 min',
  teaser: 'Why AI sounds 100% sure even when guessing — and how giving it real files fixes it.',
  render(container, app) {
    const cases = [
      {
        label: '✈️ Lisbon Packing List',
        question: 'What shoes did I put on my Lisbon packing list?',
        filename: 'lisbon-packing.md',
        fileLines: [
          '# Lisbon Trip — May 14–19',
          '- Linen jumpsuit (cream)',
          '- White leather sneakers (for hilly cobblestones!)',
          '- Woven tote bag + film camera',
          '- Espresso rain jacket'
        ],
        highlightLine: 2,
        improvAnswer: `You packed your <span class="guess-mark">tan espadrilles</span> and <span class="guess-mark">black ankle boots</span> for evening dinners in Alfama!`,
        groundedAnswer: `According to <code>lisbon-packing.md</code>, you listed <span class="verified-mark">white leather sneakers</span> (specifically noted for the hilly cobblestones!).`,
        improvNote: 'Sounded totally natural — and 100% invented! ChatGPT had no file to check, so it improvised plausible travel words.',
        groundedNote: 'When AI can read your real file first, it stops improvising and quotes the exact truth.'
      },
      {
        label: '🎨 Portfolio Button Color',
        question: 'What color is the main button on my portfolio website?',
        filename: 'styles.css',
        fileLines: [
          '/* Portfolio Theme */',
          'body { background: #FAF7F2; }',
          '.hero-title { font-family: Fraunces; }',
          '.primary-btn { background: #49856E; /* Sage Green */ }',
          '.card { border-radius: 18px; }'
        ],
        highlightLine: 3,
        improvAnswer: `Your main portfolio button is a <span class="guess-mark">vibrant royal blue (#2563EB)</span> with white bold text!`,
        groundedAnswer: `Looking directly at <code>styles.css</code> line 4, your <code>.primary-btn</code> is <span class="verified-mark">Sage Green (#49856E)</span>!`,
        improvNote: 'Blue is the most common button color on the web — so next-word prediction smoothly guessed blue.',
        groundedNote: 'This is why Desktop Codex is a game-changer: it reads your real folder before changing a single pixel!'
      },
      {
        label: '🏺 Ceramics Studio Hours',
        question: 'Can I drop by Clay & Kiln Studio on Tuesday evening?',
        filename: 'studio-hours.txt',
        fileLines: [
          'Clay & Kiln Neighborhood Studio',
          'Mon: Closed (Kiln firing)',
          'Tue–Thu: 10:00 AM – 8:30 PM (Open wheel!)',
          'Fri–Sat: 10:00 AM – 6:00 PM',
          'Address: 418 Maple Lane'
        ],
        highlightLine: 2,
        improvAnswer: `Most neighborhood studios close early on weekdays, so they likely close around <span class="guess-mark">5:00 PM on Tuesdays</span>.`,
        groundedAnswer: `Yes! <code>studio-hours.txt</code> shows Tuesday is open until <span class="verified-mark">8:30 PM (Open wheel!)</span>.`,
        improvNote: 'Without a source, AI defaults to generic "average" guesses instead of your real local details.',
        groundedNote: 'Open-Book Mode (also called Grounding) turns an improviser into a reliable studio assistant.'
      }
    ];

    let caseIdx = 0;
    let mode = 'improv'; // 'improv' | 'grounded'

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 3 of 6 · Hallucinations & Grounding</span>
          <h1 class="chapter-title">Why AI confidently makes things up</h1>
          <p class="chapter-hook">
            Remember Chapter 1? AI predicts <em>plausible-sounding</em> words. If it doesn't have your real files in front of it, it would rather smoothly improvise than admit "I can't see that."
          </p>
        </div>
        <span class="time-badge">⏱ 2 min studio</span>
      </div>

      <section class="studio-card">
        <div class="mode-switch-bar">
          <div class="chip-row" style="margin-bottom: 0;" id="case-chips">
            ${cases.map((c, i) => `<button class="btn-soft ${i === 0 ? 'active' : ''}" data-case="${i}">${c.label}</button>`).join('')}
          </div>

          <div class="toggle-pills" role="group" aria-label="AI Mode">
            <button class="mode-pill active-improv" id="btn-improv">🎭 Chat-Only (Improv)</button>
            <button class="mode-pill" id="btn-grounded">📖 Open-Book (Reads File)</button>
          </div>
        </div>

        <div class="grounding-stage" id="grounding-stage"></div>
      </section>

      <div id="ch3-check"></div>
    `;

    const stageEl = container.querySelector('#grounding-stage');
    const btnImprov = container.querySelector('#btn-improv');
    const btnGrounded = container.querySelector('#btn-grounded');

    function renderTheater() {
      const c = cases[caseIdx];
      const isGrounded = mode === 'grounded';

      btnImprov.className = 'mode-pill' + (!isGrounded ? ' active-improv' : '');
      btnGrounded.className = 'mode-pill' + (isGrounded ? ' active-grounded' : '');

      stageEl.innerHTML = `
        <div class="file-source-card ${isGrounded ? 'scanning' : 'dimmed'}">
          <div class="file-header">
            <span>📄 ${c.filename}</span>
            <span style="font-weight: 700; color: ${isGrounded ? 'var(--sage)' : 'var(--ink-muted)'};">
              ${isGrounded ? '👀 AI IS READING THIS' : '🙈 HIDDEN FROM AI'}
            </span>
          </div>
          <div>
            ${c.fileLines.map((line, i) => `
              <div class="file-line ${isGrounded && i === c.highlightLine ? 'highlight' : ''}">
                ${line}
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 12px; font-size: 12px; color: var(--ink-muted);">
            ${isGrounded
              ? '✨ Grounded! AI checked line ' + (c.highlightLine + 1) + ' before answering.'
              : 'Flip to <strong>Open-Book</strong> above to let AI peek at this file!'}
          </div>
        </div>

        <div class="ai-answer-card">
          <div class="user-bubble">${c.question}</div>
          <div class="ai-bubble ${isGrounded ? 'grounded' : ''}">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; color: ${isGrounded ? 'var(--sage)' : 'var(--coral)'};">
              ${isGrounded ? '📖 Open-Book Reply' : '🎭 Confident Improv (Hallucination)'}
            </div>
            <div>${isGrounded ? c.groundedAnswer : c.improvAnswer}</div>
          </div>
          <div class="verdict-strip ${isGrounded ? 'grounded' : 'improv'}">
            <span>${isGrounded ? '✅' : '⚠️'}</span>
            <span>${isGrounded ? c.groundedNote : c.improvNote}</span>
          </div>
        </div>
      `;
    }

    btnImprov.addEventListener('click', () => {
      window.AtelierSound.click();
      mode = 'improv';
      renderTheater();
    });

    btnGrounded.addEventListener('click', () => {
      window.AtelierSound.pop();
      mode = 'grounded';
      renderTheater();
    });

    container.querySelectorAll('[data-case]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        caseIdx = Number(btn.dataset.case);
        container.querySelectorAll('[data-case]').forEach((b) => b.classList.toggle('active', b === btn));
        renderTheater();
      });
    });

    renderTheater();

    app.renderCheck(container.querySelector('#ch3-check'), {
      chapterId: 3,
      question: 'Quick Spark Check: What is the #1 way to stop AI from making up wrong details about your project?',
      options: [
        { label: 'Ask it more politely in ALL CAPS', correct: false },
        { label: 'Give it access to your real files (Open-Book / Grounding) like Desktop Codex does', correct: true },
        { label: 'Turn the Creativity Dial all the way up to maximum', correct: false }
      ],
      explanation: 'Nailed it! When an app like Desktop Codex reads your real folder, AI stops guessing and works from real facts.'
    });
  }
};
