window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[5] = {
  id: 5,
  emoji: '🖥️',
  shortTitle: 'Meet Desktop Codex',
  duration: '2 min',
  teaser: 'Tour the real Desktop Codex layout — folders, threads, diffs, and your safety controls.',
  render(container, app) {
    const hotspots = [
      {
        id: 1,
        zone: 'sidebar',
        title: '1. Project Folder (Your Sandbox)',
        badge: 'Total Boundary',
        desc: 'You pick ONE folder on your computer (like <code>my-trip-site/</code>). Codex only works inside that folder — it never wanders into your private desktop or photos.'
      },
      {
        id: 2,
        zone: 'sidebar',
        title: '2. Threads = Tidy Desks',
        badge: 'One Idea per Thread',
        desc: 'Remember the Working Desk from Chapter 2? Start a fresh thread for each new feature (e.g. “Homepage layout”, “Add dark mode”) so Codex stays razor-sharp.'
      },
      {
        id: 3,
        zone: 'center',
        title: '3. Plain-English Prompt Box',
        badge: 'No Code Needed',
        desc: 'Brief Codex like a friendly designer! You can even drag in a screenshot of a website or app you love and say “match this vibe.”'
      },
      {
        id: 4,
        zone: 'diff',
        title: '4. Live Diff (Green = Added, Red = Removed)',
        badge: 'Transparent Edits',
        desc: 'Every edit Codex makes is shown clearly. You don’t need to understand every code symbol — just glance at the summary and check your live preview!'
      },
      {
        id: 5,
        zone: 'diff',
        title: '5. You Hold the Keys (Approve & Undo)',
        badge: 'Always Reversible',
        desc: 'Nothing scary happens silently. Codex asks permission for big commands, and you can undo or ask “change that back” anytime.'
      }
    ];

    const makeovers = [
      {
        tag: 'Visual Vibe',
        before: '“Make my page look prettier.”',
        after: '“Use a warm cream background, editorial serif titles, rounded white cards, and sage green buttons — like a boutique café menu.”',
        why: 'Describing mood, colors, and a real-world reference gives Codex a crystal-clear picture!'
      },
      {
        tag: 'Small Tweaks',
        before: '“Fix the layout, it feels weird.”',
        after: '“Add more breathing room between the 3 cards, center the title, and make the Save button bigger on mobile.”',
        why: 'Pointing to 2–3 concrete details gets it right on the very first try.'
      },
      {
        tag: 'When Stuck',
        before: '“It’s broken!”',
        after: '“When I click the heart icon, nothing turns red. Can you check why and fix it?”',
        why: 'Tell Codex what you clicked and what you expected — it will trace and fix the bug for you!'
      }
    ];

    let activeSpot = 1;
    const visited = new Set([1]);
    const flipped = new Set();

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 5 of 6 · The Desktop App</span>
          <h1 class="chapter-title">Meet your Desktop Codex studio</h1>
          <p class="chapter-hook">
            Opening a coding app can look intimidating at first — until you see it’s just <strong>5 friendly zones</strong>. Tap the glowing pins below to tour the screen!
          </p>
        </div>
        <span class="time-badge">⏱ 2 min studio</span>
      </div>

      <!-- INTERACTIVE DESKTOP TOUR -->
      <section class="studio-card">
        <div class="studio-card-header">
          <h2 class="studio-card-title">Interactive Desktop Codex Tour</h2>
          <span class="card-badge sage" id="tour-progress">1 / 5 Explored</span>
        </div>

        <div class="codex-mock-window">
          <div class="mac-titlebar">
            <div class="mac-dots"><span></span><span></span><span></span></div>
            <div class="mac-title">Codex · 📁 kyoto-weekend-guide</div>
            <div style="font-size: 11px; font-weight: 700; color: var(--sage);">● Local Folder Safe</div>
          </div>

          <div class="codex-mock-body">
            <!-- Left Sidebar -->
            <div class="mock-zone" id="zone-sidebar">
              <button class="hotspot-pin" data-spot="1" style="top: 10px; right: 10px;" aria-label="Pin 1: Project Folder">1</button>
              <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 8px;">Workspace</div>
              <div style="padding: 8px 10px; border-radius: 10px; background: var(--bg-soft); font-size: 12px; font-weight: 700; margin-bottom: 14px;">
                📁 kyoto-weekend-guide
              </div>

              <div style="position: relative; padding-top: 4px;">
                <button class="hotspot-pin" data-spot="2" style="top: -4px; right: -4px;" aria-label="Pin 2: Threads">2</button>
                <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 8px;">Threads</div>
                <div style="padding: 7px 9px; border-radius: 9px; background: var(--plum-soft); color: var(--plum); font-size: 12px; font-weight: 700; margin-bottom: 6px;">
                  ✦ Cafe map cards
                </div>
                <div style="padding: 7px 9px; border-radius: 9px; font-size: 12px; color: var(--ink-soft);">
                  ○ Packing checklist
                </div>
                <div style="padding: 7px 9px; border-radius: 9px; font-size: 12px; color: var(--ink-soft);">
                  ○ Mobile polish
                </div>
              </div>
            </div>

            <!-- Center Conversation -->
            <div class="mock-zone" id="zone-center" style="display: flex; flex-direction: column; justify-content: space-between; gap: 14px;">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div class="user-bubble" style="font-size: 12.5px;">
                  Turn my Kyoto café notes into warm cream cards with a bookmark heart on each one!
                </div>
                <div class="ai-bubble grounded" style="font-size: 12.5px; padding: 11px 13px;">
                  <strong>Codex</strong>
                  <div class="sim-step-item">✓ Read cafes.md (4 spots)</div>
                  <div class="sim-step-item">✓ Styled warm cards in index.html</div>
                  <div style="margin-top: 6px; color: var(--ink);">Done! Click Preview to try the heart buttons.</div>
                </div>
              </div>

              <div style="position: relative; padding: 10px 12px; border-radius: 13px; border: 1.5px solid var(--border-strong); background: #fff; display: flex; align-items: center; justify-content: space-between;">
                <button class="hotspot-pin" data-spot="3" style="top: -14px; left: 14px;" aria-label="Pin 3: Prompt Box">3</button>
                <span style="font-size: 12px; color: var(--ink-muted);">Ask Codex anything or drop a screenshot…</span>
                <span style="padding: 5px 10px; border-radius: 99px; background: var(--ink); color: #fff; font-size: 11px; font-weight: 700;">Send ↑</span>
              </div>
            </div>

            <!-- Right Diff & Controls -->
            <div class="mock-zone" id="zone-diff" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div style="position: relative;">
                <button class="hotspot-pin" data-spot="4" style="top: -4px; right: -4px;" aria-label="Pin 4: Diffs">4</button>
                <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 8px;">Changes (Diff)</div>
                <div style="font-size: 11.5px; font-weight: 700; margin-bottom: 6px;">index.html</div>
                <div class="mock-diff-line del">- background: #FFFFFF;</div>
                <div class="mock-diff-line add">+ background: #FAF7F2;</div>
                <div class="mock-diff-line add">+ &lt;button&gt;♥ Save&lt;/button&gt;</div>
              </div>

              <div style="position: relative; padding-top: 16px; border-top: 1px dashed var(--border);">
                <button class="hotspot-pin" data-spot="5" style="top: 4px; right: -4px;" aria-label="Pin 5: Approval Controls">5</button>
                <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); margin-bottom: 8px;">Review Controls</div>
                <div style="display: flex; gap: 6px;">
                  <span style="flex: 1; text-align: center; padding: 6px; border-radius: 9px; background: var(--sage); color: #fff; font-size: 11.5px; font-weight: 700;">✓ Keep</span>
                  <span style="padding: 6px 10px; border-radius: 9px; background: var(--bg-soft); font-size: 11.5px; font-weight: 700;">↺ Undo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="hotspot-explainer" id="hotspot-explainer"></div>
      </section>

      <!-- PROMPT MAKEOVER FLIP CARDS -->
      <section class="studio-card">
        <div class="studio-card-header">
          <h2 class="studio-card-title">Speak Like a Creative Director</h2>
          <span class="card-badge coral">Tap Cards to Makeover!</span>
        </div>
        <p class="micro-caption">You don't need coding terms to get gorgeous results. Tap each vague prompt to reveal its Creative-Director glow-up:</p>

        <div class="makeover-grid" id="makeover-grid"></div>
      </section>

      <div id="ch5-check"></div>
    `;

    const explainerEl = container.querySelector('#hotspot-explainer');
    const progressEl = container.querySelector('#tour-progress');
    const pins = Array.from(container.querySelectorAll('.hotspot-pin'));
    const zones = {
      sidebar: container.querySelector('#zone-sidebar'),
      center: container.querySelector('#zone-center'),
      diff: container.querySelector('#zone-diff')
    };

    function renderHotspot() {
      const spot = hotspots.find((h) => h.id === activeSpot);
      Object.values(zones).forEach((z) => z.classList.remove('zone-highlight'));
      if (zones[spot.zone]) zones[spot.zone].classList.add('zone-highlight');

      pins.forEach((pin) => {
        const id = Number(pin.dataset.spot);
        pin.classList.toggle('active', id === activeSpot);
        pin.classList.toggle('visited', visited.has(id));
      });

      progressEl.textContent = `${visited.size} / 5 Explored`;

      explainerEl.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
            <strong style="font-family: var(--font-serif); font-size: 18px;">${spot.title}</strong>
            <span class="card-badge">${spot.badge}</span>
          </div>
          <p style="margin: 0; font-size: 14px; color: var(--ink-soft);">${spot.desc}</p>
        </div>
        <button class="btn-dark" id="next-pin-btn" style="white-space: nowrap;">
          ${activeSpot < 5 ? `Next Pin (${activeSpot + 1}/5) →` : '↺ Back to Pin 1'}
        </button>
      `;

      explainerEl.querySelector('#next-pin-btn').addEventListener('click', () => {
        window.AtelierSound.pop();
        activeSpot = activeSpot < 5 ? activeSpot + 1 : 1;
        visited.add(activeSpot);
        renderHotspot();
      });
    }

    pins.forEach((pin) => {
      pin.addEventListener('click', () => {
        window.AtelierSound.pop();
        activeSpot = Number(pin.dataset.spot);
        visited.add(activeSpot);
        renderHotspot();
      });
    });

    renderHotspot();

    // Makeover cards
    const makeoverGrid = container.querySelector('#makeover-grid');
    function renderMakeovers() {
      makeoverGrid.innerHTML = makeovers.map((m, idx) => {
        const isFlipped = flipped.has(idx);
        return `
          <button class="makeover-card ${isFlipped ? 'flipped' : ''}" data-flip="${idx}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span class="card-badge ${isFlipped ? 'sage' : 'coral'}">${isFlipped ? '✨ Creative Director' : '💭 Vague Prompt'}</span>
              <span style="font-size: 11px; color: var(--ink-muted); font-weight: 700;">${m.tag}</span>
            </div>
            <div style="font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 8px;">
              ${isFlipped ? m.after : m.before}
            </div>
            <div style="font-size: 12px; color: var(--ink-soft);">
              ${isFlipped ? '💡 ' + m.why : '👆 Tap to see the glow-up'}
            </div>
          </button>
        `;
      }).join('');

      makeoverGrid.querySelectorAll('[data-flip]').forEach((card) => {
        card.addEventListener('click', () => {
          window.AtelierSound.pop();
          const idx = Number(card.dataset.flip);
          if (flipped.has(idx)) flipped.delete(idx);
          else flipped.add(idx);
          renderMakeovers();
        });
      });
    }
    renderMakeovers();

    app.renderCheck(container.querySelector('#ch5-check'), {
      chapterId: 5,
      question: 'Quick Spark Check: When you open a project folder in Desktop Codex, what if it makes an edit you don’t love?',
      options: [
        { label: 'You’re stuck with it forever and have to start over', correct: false },
        { label: 'You can inspect the green/red diff, click Undo, or simply ask in plain English to tweak it', correct: true },
        { label: 'You have to manually rewrite the code in a dark terminal', correct: false }
      ],
      explanation: 'Exactly! You are always in control — every change is visible, previewable, and reversible.'
    });
  }
};
