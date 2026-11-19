window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[4] = {
  id: 4,
  emoji: '🦾',
  shortTitle: 'Chatbox vs. Agent',
  duration: '2 min',
  teaser: 'Watch what happens when you give the AI brain Eyes, Hands, and a Self-Check Loop.',
  render(container, app) {
    const timeline = [
      {
        station: 0,
        status: 'active',
        log: '👀 Reading folder /sunday-recipes/ → found pasta.txt, matcha.txt, tiramisu.txt, photo_01.jpg',
        tone: ''
      },
      {
        station: 1,
        status: 'active',
        log: '🗺️ Planning: Create a warm 3-card recipe gallery in menu.html + attach photo_01.jpg',
        tone: ''
      },
      {
        station: 2,
        status: 'active',
        log: '✋ Writing menu.html & styling cream cards with Fraunces headings...',
        tone: ''
      },
      {
        station: 3,
        status: 'error',
        log: '⚠️ Self-Check caught a hiccup! Image tag pointed to "photo.jpg" instead of "photo_01.jpg".',
        tone: 'warn'
      },
      {
        station: 2,
        status: 'active',
        log: '🔄 Loop 2 (Auto-Fix!): Updating image filename to "photo_01.jpg"...',
        tone: ''
      },
      {
        station: 3,
        status: 'done',
        log: '✅ Verified! All 3 recipe cards & photos load cleanly. Ready for your review!',
        tone: 'ok'
      }
    ];

    let currentStep = -1;
    let timer = null;

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 4 of 6 · The Big Leap</span>
          <h1 class="chapter-title">Giving the AI brain hands</h1>
          <p class="chapter-hook">
            ChatGPT is a brilliant brain inside a glass bubble — it can only <em>talk</em>. Connect that same brain to <strong>Eyes</strong>, <strong>Hands</strong>, and a <strong>Loop</strong>, and it becomes an <strong>AI Agent</strong>.
          </p>
        </div>
        <span class="time-badge">⏱ 2 min studio</span>
      </div>

      <div class="compare-split">
        <div class="compare-box">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 26px;">💬</span>
            <strong style="font-family: var(--font-serif); font-size: 19px;">Regular ChatGPT</strong>
          </div>
          <p style="margin: 0; font-size: 13.5px; color: var(--ink-soft);">
            “Here are 8 steps <em>you</em> can follow to copy-paste code and build a recipe page…”
          </p>
          <div class="compare-pill-list">
            <span class="mini-tag">🧠 Brain only</span>
            <span class="mini-tag">✂️ You copy & paste</span>
            <span class="mini-tag">1️⃣ One reply & stops</span>
          </div>
        </div>

        <div class="compare-box agent-side">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <span style="font-size: 26px;">✨</span>
            <strong style="font-family: var(--font-serif); font-size: 19px;">AI Agent (Like Desktop Codex)</strong>
          </div>
          <p style="margin: 0; font-size: 13.5px; color: var(--ink-soft);">
            “I read your recipe notes, built <code>menu.html</code>, spotted a broken photo link, fixed it, and opened the preview!”
          </p>
          <div class="compare-pill-list">
            <span class="mini-tag good">👀 Reads your folder</span>
            <span class="mini-tag good">✋ Creates & edits files</span>
            <span class="mini-tag good">🔄 Tests & fixes mistakes</span>
          </div>
        </div>
      </div>

      <section class="studio-card">
        <div class="studio-card-header">
          <div>
            <h2 class="studio-card-title">Watch an Agent Loop in Action</h2>
            <p class="micro-caption" style="margin: 4px 0 0;">Goal: <em>“Turn my messy <code>/sunday-recipes</code> folder into a clean visual menu.”</em></p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-primary" id="run-loop-btn">▶ Run Agent Loop</button>
            <button class="btn-soft" id="step-loop-btn">Step 1-by-1</button>
            <button class="btn-soft" id="reset-loop-btn">↺</button>
          </div>
        </div>

        <div class="loop-stations" id="loop-stations">
          <div class="station-card" data-st="0">
            <div class="station-emoji">👀</div>
            <div class="station-title">1. Read</div>
            <div class="station-sub">Inspects your real files</div>
          </div>
          <div class="station-card" data-st="1">
            <div class="station-emoji">🗺️</div>
            <div class="station-title">2. Plan</div>
            <div class="station-sub">Maps out clean steps</div>
          </div>
          <div class="station-card" data-st="2">
            <div class="station-emoji">✋</div>
            <div class="station-title">3. Act</div>
            <div class="station-sub">Writes & edits files</div>
          </div>
          <div class="station-card" data-st="3">
            <div class="station-emoji">🔍</div>
            <div class="station-title">4. Check & Fix</div>
            <div class="station-sub">Catches its own bugs!</div>
          </div>
        </div>

        <div class="agent-log-box" id="agent-log-box">
          <div class="log-line" style="opacity: 0.7;">
            <span>●</span>
            <span>Press <strong>Run Agent Loop</strong> to watch how Codex works & catches its own typo automatically!</span>
          </div>
        </div>
      </section>

      <div id="ch4-check"></div>
    `;

    const stationEls = Array.from(container.querySelectorAll('.station-card'));
    const logBox = container.querySelector('#agent-log-box');
    const runBtn = container.querySelector('#run-loop-btn');

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
    app.registerCleanup(stopTimer);

    function renderLoop() {
      stationEls.forEach((el) => {
        el.className = 'station-card';
      });

      if (currentStep < 0) {
        logBox.innerHTML = `
          <div class="log-line" style="opacity: 0.72;">
            <span>●</span>
            <span>Press <strong>Run Agent Loop</strong> to watch how Codex works & catches its own typo automatically!</span>
          </div>
        `;
        return;
      }

      const activeItem = timeline[currentStep];
      if (currentStep === timeline.length - 1) {
        stationEls.forEach((el) => el.classList.add('done'));
      } else {
        stationEls[activeItem.station].classList.add(activeItem.status);
      }

      logBox.innerHTML = timeline.slice(0, currentStep + 1).map((item) => `
        <div class="log-line ${item.tone}">
          <span>›</span>
          <span>${item.log}</span>
        </div>
      `).join('');
    }

    function advanceStep() {
      if (currentStep >= timeline.length - 1) {
        stopTimer();
        runBtn.textContent = '▶ Replay Loop';
        return;
      }
      currentStep++;
      const item = timeline[currentStep];
      if (item.tone === 'warn') window.AtelierSound.oops();
      else if (item.tone === 'ok') window.AtelierSound.spark();
      else window.AtelierSound.step();
      renderLoop();
      if (currentStep >= timeline.length - 1) {
        stopTimer();
        runBtn.textContent = '▶ Replay Loop';
      }
    }

    runBtn.addEventListener('click', () => {
      stopTimer();
      currentStep = -1;
      renderLoop();
      runBtn.textContent = '⏳ Running...';
      advanceStep();
      timer = setInterval(advanceStep, 1100);
    });

    container.querySelector('#step-loop-btn').addEventListener('click', () => {
      stopTimer();
      runBtn.textContent = '▶ Run Agent Loop';
      if (currentStep >= timeline.length - 1) currentStep = -1;
      advanceStep();
    });

    container.querySelector('#reset-loop-btn').addEventListener('click', () => {
      stopTimer();
      window.AtelierSound.click();
      currentStep = -1;
      runBtn.textContent = '▶ Run Agent Loop';
      renderLoop();
    });

    app.renderCheck(container.querySelector('#ch4-check'), {
      chapterId: 4,
      question: 'Quick Spark Check: What makes an AI Agent (like Desktop Codex) different from a regular ChatGPT chat?',
      options: [
        { label: 'It uses fancier words in its chat replies', correct: false },
        { label: 'It can read your files, make edits, test its work, and fix its own mistakes in a loop', correct: true },
        { label: 'You have to write all the code yourself first', correct: false }
      ],
      explanation: 'Yes! Think of yourself as the Creative Director — you set the vision while the agent handles the hands-on building loop.'
    });
  }
};
