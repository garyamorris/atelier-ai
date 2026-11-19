window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[6] = {
  id: 6,
  emoji: '✨',
  shortTitle: 'Your First Codex App',
  duration: '3 min',
  teaser: 'Practice directing a simulated Desktop Codex app — build, iterate, inspect diffs, and approve!',
  render(container, app) {
    const projects = {
      matcha: {
        folder: 'matcha-cafe-journal/',
        label: '☕ Matcha & Café Journal',
        title: 'My Cozy Café List',
        subtitle: 'Favorite sunlit spots for matcha & reading',
        firstPrompt: 'Build a warm visual café journal from my notes with 4 cards and cozy cream styling.',
        categories: ['All', 'Matcha', 'Bakery'],
        items: [
          { id: 'm1', cat: 'Matcha', emoji: '🍵', name: 'Kissa Sunroom', note: 'Velvety ceremonial oat latte · sunny patio' },
          { id: 'm2', cat: 'Bakery', emoji: '🥐', name: 'Tartine Corner', note: 'Cardamom morning buns · window seats' },
          { id: 'm3', cat: 'Matcha', emoji: '🌿', name: 'Mori Tea Bar', note: 'Hand-whisked iced matcha · quiet vibes' },
          { id: 'm4', cat: 'Bakery', emoji: '🍓', name: 'Atelier Crumb', note: 'Strawberry pistachio tart · vinyl records' }
        ]
      },
      kyoto: {
        folder: 'kyoto-weekend/',
        label: '✈️ Weekend Kyoto Planner',
        title: 'Kyoto · 3-Day Sketch',
        subtitle: 'Walkable gardens, ceramic shops & dinner stops',
        firstPrompt: 'Turn my Kyoto weekend notes into a clean itinerary board with 4 highlight cards.',
        categories: ['All', 'Morning', 'Evening'],
        items: [
          { id: 'k1', cat: 'Morning', emoji: '🎋', name: 'Philosopher’s Path', note: 'Early stroll · stop for pour-over coffee' },
          { id: 'k2', cat: 'Morning', emoji: '🏺', name: 'Gojo Ceramics Row', note: 'Handmade stoneware mugs & tea bowls' },
          { id: 'k3', cat: 'Evening', emoji: '🏮', name: 'Pontocho Alley', note: 'Lantern-lit izakaya along the river' },
          { id: 'k4', cat: 'Evening', emoji: '🌸', name: 'Gion Twilight Walk', note: 'Quiet wooden teahouses after dusk' }
        ]
      },
      rituals: {
        folder: 'daily-rituals/',
        label: '🌿 Daily Ritual Studio',
        title: 'Gentle Daily Rituals',
        subtitle: 'Small habits that make weekdays feel calm',
        firstPrompt: 'Create a calm daily ritual board with soft cards I can check off anytime.',
        categories: ['All', 'Morning', 'Unwind'],
        items: [
          { id: 'r1', cat: 'Morning', emoji: '☀️', name: '10-Min Sunlight Walk', note: 'No phone, fresh air before coffee' },
          { id: 'r2', cat: 'Morning', emoji: '📓', name: '3-Line Journal', note: 'One intention for today’s mood' },
          { id: 'r3', cat: 'Unwind', emoji: '🫖', name: 'Herbal Tea Reset', note: 'Chamomile & stretch at 4pm' },
          { id: 'r4', cat: 'Unwind', emoji: '📖', name: '20 Pages Before Bed', note: 'Paper book only, warm lamp on' }
        ]
      }
    };

    let projKey = 'matcha';
    let built = false;
    let isRunning = false;
    let viewMode = 'preview'; // 'preview' | 'diff'
    let features = { hearts: false, plum: false, filter: false };
    let activeFilter = 'All';
    let savedIds = new Set();
    let approved = false;
    let messages = [];
    let diffLines = [];
    let timers = [];

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    app.registerCleanup(clearTimers);

    function resetProject(newKey) {
      clearTimers();
      projKey = newKey;
      built = false;
      isRunning = false;
      viewMode = 'preview';
      features = { hearts: false, plum: false, filter: false };
      activeFilter = 'All';
      savedIds = new Set();
      approved = false;
      messages = [
        {
          role: 'codex',
          text: `📁 Folder opened: <strong>${projects[projKey].folder}</strong>. Tell me what you’d like to build first!`
        }
      ];
      diffLines = [];
      renderAll();
    }

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 6 of 6 · Hands-On Practice</span>
          <h1 class="chapter-title">Direct your first Desktop Codex project</h1>
          <p class="chapter-hook">
            Try the real rhythm before opening the app: <strong>1. Pick a folder → 2. Ask in plain English → 3. Iterate & preview → 4. Approve!</strong>
          </p>
        </div>
        <span class="time-badge">✨ Interactive Sandbox</span>
      </div>

      <div class="chip-row" id="proj-picker">
        ${Object.entries(projects).map(([k, p]) => `
          <button class="btn-soft ${k === projKey ? 'active' : ''}" data-proj="${k}">${p.label}</button>
        `).join('')}
      </div>

      <div class="sim-shell">
        <div class="mac-titlebar">
          <div class="mac-dots"><span></span><span></span><span></span></div>
          <div class="mac-title" id="sim-win-title">Codex Studio · 📁 matcha-cafe-journal/</div>
          <div style="font-size: 11.5px; font-weight: 700; color: var(--sage);" id="sim-status-pill">● Ready</div>
        </div>

        <div class="sim-grid">
          <!-- Left: Chat + Prompting -->
          <div class="sim-chat-pane">
            <div class="sim-messages" id="sim-messages"></div>

            <div id="sim-suggestions"></div>

            <form id="sim-form" style="display: flex; gap: 6px;">
              <input class="studio-input" id="sim-input" type="text" placeholder="Or type a tweak (e.g. 'add hearts' or 'dark theme')..." style="padding: 9px 12px; font-size: 13px;" />
              <button class="btn-dark" type="submit" style="padding: 9px 14px; font-size: 13px;">↑</button>
            </form>
          </div>

          <!-- Right: Live Preview / Diff -->
          <div class="sim-preview-pane">
            <div class="sim-preview-toolbar">
              <div class="toy-tabs" style="margin: 0;">
                <button class="toy-tab active" data-view="preview">✨ Live Preview</button>
                <button class="toy-tab" data-view="diff">🔍 Friendly Diff</button>
              </div>
              <div id="sim-approve-wrap"></div>
            </div>
            <div class="sim-canvas" id="sim-canvas"></div>
          </div>
        </div>
      </div>

      <div id="sim-graduation"></div>
    `;

    const winTitle = container.querySelector('#sim-win-title');
    const statusPill = container.querySelector('#sim-status-pill');
    const msgList = container.querySelector('#sim-messages');
    const suggWrap = container.querySelector('#sim-suggestions');
    const approveWrap = container.querySelector('#sim-approve-wrap');
    const canvasEl = container.querySelector('#sim-canvas');
    const gradEl = container.querySelector('#sim-graduation');
    const simInput = container.querySelector('#sim-input');

    function runAgentTask(userPrompt, steps, onComplete) {
      if (isRunning) return;
      isRunning = true;
      window.AtelierSound.pop();
      messages.push({ role: 'user', text: userPrompt });
      const codexMsg = { role: 'codex', text: 'Working on it…', steps: [] };
      messages.push(codexMsg);
      statusPill.textContent = '✦ Codex working…';
      statusPill.style.color = 'var(--plum)';
      renderMessages();
      renderSuggestions();

      steps.forEach((stepText, i) => {
        const t = setTimeout(() => {
          window.AtelierSound.step();
          codexMsg.steps.push(stepText);
          renderMessages();
        }, 480 * (i + 1));
        timers.push(t);
      });

      const doneTimer = setTimeout(() => {
        isRunning = false;
        statusPill.textContent = '● Changes Ready';
        statusPill.style.color = 'var(--sage)';
        onComplete(codexMsg);
        window.AtelierSound.pop();
        renderAll();
      }, 480 * (steps.length + 1) + 120);
      timers.push(doneTimer);
    }

    function handleBuildFirst() {
      const p = projects[projKey];
      runAgentTask(
        p.firstPrompt,
        [
          `Read ${p.folder}notes.md`,
          'Designed cream card layout in index.html',
          'Verified spacing & typography'
        ],
        (msg) => {
          built = true;
          msg.text = 'Your first draft is live on the right! Try a Round 2 polish prompt below to watch me iterate.';
          diffLines = [
            { code: '+ <section class="studio-grid">', note: 'Creates your responsive card grid' },
            { code: '+   background: #FAF7F2; border-radius: 18px;', note: 'Applies warm editorial cream styling' },
            { code: `+   // Rendered 4 cards from ${p.folder}notes.md`, note: 'Grounded in your real local notes' }
          ];
        }
      );
    }

    function handleUpgrade(type, customLabel) {
      if (!built) {
        handleBuildFirst();
        return;
      }
      if (type === 'hearts') {
        runAgentTask(
          customLabel || 'Add a heart icon on each card so I can bookmark my favorites!',
          ['Located card component in index.html', 'Added clickable ♥ favorite toggle', 'Checked hover animation'],
          (msg) => {
            features.hearts = true;
            msg.text = 'Done! Click the ♥ buttons right inside the Live Preview to test them.';
            diffLines.push({ code: '+ <button class="heart-btn" onclick="toggleSave()">♥</button>', note: 'Adds interactive favorite button to every card' });
          }
        );
      } else if (type === 'plum') {
        const turningOn = !features.plum;
        runAgentTask(
          customLabel || (turningOn ? 'Switch the vibe to a cozy evening plum dark mode.' : 'Bring back the sunlit cream theme!'),
          ['Updated theme colors in styles.css', 'Adjusted card contrast for readability'],
          (msg) => {
            features.plum = turningOn;
            msg.text = turningOn ? 'Switched to cozy evening plum! Looking sleek.' : 'Back to sunlit cream!';
            diffLines.push({
              code: turningOn ? '+ background: #272031; color: #F7F2FA;' : '+ background: #FFFFFF; color: #231E29;',
              note: turningOn ? 'Cozy evening plum theme palette' : 'Restored warm sunlit palette'
            });
          }
        );
      } else if (type === 'filter') {
        runAgentTask(
          customLabel || 'Add a quick category filter bar at the top so I can sort cards.',
          ['Read categories from notes.md', 'Added filter pills above the card grid'],
          (msg) => {
            features.filter = true;
            activeFilter = 'All';
            msg.text = 'Filter bar added! Try tapping the category pills inside the preview.';
            diffLines.push({ code: '+ <div class="filter-pills">All · Filtered Views</div>', note: 'Lets you filter cards with one tap' });
          }
        );
      }
    }

    function renderMessages() {
      msgList.innerHTML = messages.map((m) => `
        <div class="sim-msg ${m.role}">
          <div>${m.text}</div>
          ${m.steps ? m.steps.map((s) => `<div class="sim-step-item">✓ ${s}</div>`).join('') : ''}
        </div>
      `).join('');
      msgList.scrollTop = msgList.scrollHeight;
    }

    function renderSuggestions() {
      const p = projects[projKey];
      if (!built) {
        suggWrap.innerHTML = `
          <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 6px;">Step 1 · Send your first direction</div>
          <button class="btn-primary" id="sim-build-first" style="width: 100%; font-size: 13px;" ${isRunning ? 'disabled' : ''}>
            ✨ Build "${p.title}" Draft
          </button>
        `;
        const b = suggWrap.querySelector('#sim-build-first');
        if (b) b.addEventListener('click', handleBuildFirst);
        return;
      }

      suggWrap.innerHTML = `
        <div style="font-size: 11px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; margin-bottom: 6px;">Step 2 · Try iterating in plain English</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${!features.hearts ? `<button class="btn-soft" data-up="hearts" style="font-size: 12px; padding: 6px 10px;" ${isRunning ? 'disabled' : ''}>♥ Add heart buttons</button>` : ''}
          <button class="btn-soft" data-up="plum" style="font-size: 12px; padding: 6px 10px;" ${isRunning ? 'disabled' : ''}>${features.plum ? '☀️ Sunlit theme' : '🌙 Evening plum theme'}</button>
          ${!features.filter ? `<button class="btn-soft" data-up="filter" style="font-size: 12px; padding: 6px 10px;" ${isRunning ? 'disabled' : ''}>🏷️ Add filter pills</button>` : ''}
        </div>
      `;

      suggWrap.querySelectorAll('[data-up]').forEach((btn) => {
        btn.addEventListener('click', () => handleUpgrade(btn.dataset.up));
      });
    }

    function renderCanvas() {
      const p = projects[projKey];
      winTitle.textContent = `Codex Studio · 📁 ${p.folder}`;

      container.querySelectorAll('[data-view]').forEach((t) => {
        t.classList.toggle('active', t.dataset.view === viewMode);
      });

      approveWrap.innerHTML = built ? `
        <button class="${approved ? 'btn-soft' : 'btn-primary'}" id="sim-approve-btn" style="padding: 7px 14px; font-size: 12.5px;">
          ${approved ? '✦ Approved & Saved!' : '✓ Approve & Keep Changes'}
        </button>
      ` : `<span style="font-size: 12px; color: var(--ink-muted); font-weight: 600;">Waiting for Step 1…</span>`;

      const appBtn = approveWrap.querySelector('#sim-approve-btn');
      if (appBtn) {
        appBtn.addEventListener('click', () => {
          approved = true;
          app.completeChapter(6);
          window.AtelierSound.spark();
          window.AtelierConfetti.burst(72, 0.35);
          app.showToast('✦ You just completed your first Desktop Codex workflow!');
          renderAll();
        });
      }

      if (!built) {
        canvasEl.innerHTML = `
          <div style="height: 100%; min-height: 320px; display: grid; place-items: center; text-align: center; padding: 24px;">
            <div>
              <div style="font-size: 42px; margin-bottom: 10px;">📁</div>
              <strong style="font-family: var(--font-serif); font-size: 20px; display: block; margin-bottom: 6px;">${p.folder}</strong>
              <p style="margin: 0; font-size: 13.5px; color: var(--ink-soft); max-width: 34ch;">
                Contains <code>notes.md</code>. Click <strong>Build Draft</strong> on the left to watch Codex bring your folder to life!
              </p>
            </div>
          </div>
        `;
        return;
      }

      if (viewMode === 'diff') {
        canvasEl.innerHTML = `
          <div style="margin-bottom: 10px; font-size: 13px; color: var(--ink-soft);">
            <strong>Friendly Diff View:</strong> Every green <code>+</code> line is something Codex added inside <code>${p.folder}index.html</code>.
          </div>
          <div class="diff-viewer">
            <div style="color: #9A90A8; margin-bottom: 8px;">--- ${p.folder}index.html (latest edits)</div>
            ${diffLines.map((l) => `
              <span class="diff-add">${l.code.replace(/</g, '&lt;')}</span>
              <div class="diff-note" style="margin-bottom: 8px; padding-left: 10px;">↳ ${l.note}</div>
            `).join('')}
          </div>
        `;
        return;
      }

      // Live Interactive Mini-App Preview
      const visibleItems = activeFilter === 'All'
        ? p.items
        : p.items.filter((item) => item.cat === activeFilter);

      canvasEl.innerHTML = `
        <div class="mini-app-frame ${features.plum ? 'theme-plum' : ''}">
          <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 8px;">
            <div>
              <h3 style="font-family: var(--font-serif); margin: 0 0 3px; font-size: 22px;">${p.title}</h3>
              <div class="mini-item-sub" style="font-size: 13px;">${p.subtitle}</div>
            </div>
            ${features.hearts ? `<span class="card-badge coral">♥ ${savedIds.size} saved</span>` : ''}
          </div>

          ${features.filter ? `
            <div class="chip-row" style="margin: 14px 0 0;">
              ${p.categories.map((cat) => `
                <button class="btn-soft ${activeFilter === cat ? 'active' : ''}" data-cat="${cat}" style="padding: 5px 12px; font-size: 12px;">${cat}</button>
              `).join('')}
            </div>
          ` : ''}

          <div class="mini-item-grid">
            ${visibleItems.map((item) => {
              const isSaved = savedIds.has(item.id);
              return `
                <div class="mini-item-card">
                  ${features.hearts ? `<button class="mini-heart-btn ${isSaved ? 'saved' : ''}" data-heart="${item.id}" aria-label="Favorite">${isSaved ? '❤️' : '🤍'}</button>` : ''}
                  <div style="font-size: 24px; margin-bottom: 6px;">${item.emoji}</div>
                  <strong style="display: block; font-size: 14px; margin-bottom: 3px;">${item.name}</strong>
                  <div class="mini-item-sub" style="font-size: 12px; line-height: 1.4;">${item.note}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      canvasEl.querySelectorAll('[data-heart]').forEach((btn) => {
        btn.addEventListener('click', () => {
          window.AtelierSound.pop();
          const id = btn.dataset.heart;
          if (savedIds.has(id)) savedIds.delete(id);
          else savedIds.add(id);
          renderCanvas();
        });
      });

      canvasEl.querySelectorAll('[data-cat]').forEach((btn) => {
        btn.addEventListener('click', () => {
          window.AtelierSound.click();
          activeFilter = btn.dataset.cat;
          renderCanvas();
        });
      });
    }

    function renderGraduation() {
      if (!approved) {
        gradEl.innerHTML = '';
        return;
      }
      gradEl.innerHTML = `
        <div class="graduation-banner">
          <div>
            <span class="eyebrow" style="color: #F2B866;">✦ Studio Complete · Ready for Real Desktop Codex</span>
            <h2 style="font-family: var(--font-serif); margin: 4px 0 6px; font-size: 24px;">You’re ready to open the real Desktop Codex app!</h2>
            <p style="margin: 0; font-size: 14px; color: rgba(255,253,249,0.82); max-width: 52ch;">
              Grab your copy-ready starter prompts & 5-minute checklist — create an empty folder on your laptop, open it in Codex, and paste prompt #1.
            </p>
          </div>
          <button class="btn-primary" id="open-grad-sheet">📋 Open My Copy-Ready Cheat Sheet</button>
        </div>
      `;
      gradEl.querySelector('#open-grad-sheet').addEventListener('click', () => {
        window.AtelierSound.pop();
        app.openCheatSheet();
      });
    }

    function renderAll() {
      renderMessages();
      renderSuggestions();
      renderCanvas();
      renderGraduation();
    }

    // Event wiring
    container.querySelectorAll('[data-proj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        container.querySelectorAll('[data-proj]').forEach((b) => b.classList.toggle('active', b === btn));
        resetProject(btn.dataset.proj);
      });
    });

    container.querySelectorAll('[data-view]').forEach((tab) => {
      tab.addEventListener('click', () => {
        window.AtelierSound.click();
        viewMode = tab.dataset.view;
        renderCanvas();
      });
    });

    container.querySelector('#sim-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const val = simInput.value.trim();
      if (!val || isRunning) return;
      simInput.value = '';
      const lower = val.toLowerCase();
      if (!built) {
        handleBuildFirst();
      } else if (lower.includes('heart') || lower.includes('fav') || lower.includes('like') || lower.includes('save')) {
        handleUpgrade('hearts', val);
      } else if (lower.includes('dark') || lower.includes('plum') || lower.includes('night') || lower.includes('theme') || lower.includes('light') || lower.includes('cream')) {
        handleUpgrade('plum', val);
      } else if (lower.includes('filter') || lower.includes('sort') || lower.includes('tab') || lower.includes('cat')) {
        handleUpgrade('filter', val);
      } else {
        // Pick whichever feature isn't enabled yet, or toggle theme so free-typing always feels responsive!
        if (!features.hearts) handleUpgrade('hearts', val);
        else if (!features.filter) handleUpgrade('filter', val);
        else handleUpgrade('plum', val);
      }
    });

    resetProject(projKey);
  }
};
