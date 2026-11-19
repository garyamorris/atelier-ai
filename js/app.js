(() => {
  const STORAGE_KEY = 'atelier_ai_progress_v1';

  const chapters = [
    window.AtelierChapters[0],
    window.AtelierChapters[1],
    window.AtelierChapters[2],
    window.AtelierChapters[3],
    window.AtelierChapters[4],
    window.AtelierChapters[5],
    window.AtelierChapters[6]
  ];

  // Persistent state
  let state = {
    current: 0,
    completed: []
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Array.isArray(saved.completed)) {
      state.completed = saved.completed.filter((id) => id >= 1 && id <= 6);
    }
  } catch (_) {}

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: state.completed }));
    } catch (_) {}
  }

  let cleanups = [];
  function runCleanups() {
    cleanups.forEach((fn) => {
      try { fn(); } catch (_) {}
    });
    cleanups = [];
  }

  // DOM refs
  const stageEl = document.getElementById('stage');
  const stepperEl = document.getElementById('chapter-stepper');
  const sparkCountEl = document.getElementById('spark-count');
  const sparkPillEl = document.getElementById('spark-pill');
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIconEl = document.getElementById('sound-icon');
  const bottomNavEl = document.getElementById('bottom-nav');
  const prevBtn = document.getElementById('nav-prev-btn');
  const nextBtn = document.getElementById('nav-next-btn');
  const prevLabel = document.getElementById('nav-prev-label');
  const nextLabel = document.getElementById('nav-next-label');
  const centerHint = document.getElementById('nav-center-hint');
  const drawerEl = document.getElementById('cheatsheet-drawer');
  const backdropEl = document.getElementById('drawer-backdrop');
  const drawerBody = document.getElementById('cheatsheet-content');
  const toastEl = document.getElementById('toast');

  let toastTimer = null;

  const app = {
    chapters,
    registerCleanup(fn) {
      cleanups.push(fn);
    },
    isChapterComplete(id) {
      return state.completed.includes(id);
    },
    getCompletedCount() {
      return state.completed.length;
    },
    getNextIncompleteChapter() {
      for (let i = 1; i <= 6; i++) {
        if (!state.completed.includes(i)) return i;
      }
      return 6;
    },
    completeChapter(id) {
      if (!state.completed.includes(id)) {
        state.completed.push(id);
        saveState();
        updateHeader();
        updateBottomNav();
        sparkPillEl.classList.add('bump');
        setTimeout(() => sparkPillEl.classList.remove('bump'), 360);
      }
    },
    showToast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
    },
    openCheatSheet() {
      window.AtelierCheatSheet.render(drawerBody, app);
      drawerEl.classList.add('open');
      backdropEl.classList.add('open');
      drawerEl.setAttribute('aria-hidden', 'false');
    },
    closeCheatSheet() {
      drawerEl.classList.remove('open');
      backdropEl.classList.remove('open');
      drawerEl.setAttribute('aria-hidden', 'true');
    },
    goTo(chapterId) {
      const clamped = Math.max(0, Math.min(6, chapterId));
      runCleanups();
      state.current = clamped;

      // Re-trigger smooth enter animation
      stageEl.style.animation = 'none';
      void stageEl.offsetWidth;
      stageEl.style.animation = '';

      chapters[clamped].render(stageEl, app);
      updateHeader();
      updateBottomNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    renderCheck(targetEl, config) {
      const alreadyDone = app.isChapterComplete(config.chapterId);
      let solved = alreadyDone;

      function draw() {
        targetEl.innerHTML = `
          <section class="check-card ${solved ? 'solved' : ''}">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px;">
              <span class="eyebrow" style="margin: 0; color: ${solved ? 'var(--sage)' : 'var(--gold)'};">
                ${solved ? '✦ Spark Earned!' : '✦ 1-Tap Spark Check'}
              </span>
              <span style="font-size: 12px; color: var(--ink-muted); font-weight: 600;">Chapter ${config.chapterId}</span>
            </div>
            <strong style="font-size: 15.5px; display: block;">${config.question}</strong>
            <div class="check-options">
              ${config.options.map((opt, idx) => `
                <button class="check-opt ${solved && opt.correct ? 'correct' : ''}" data-opt="${idx}">
                  ${solved && opt.correct ? '✓ ' : ''}${opt.label}
                </button>
              `).join('')}
            </div>
            ${solved ? `<div class="check-feedback">✨ ${config.explanation}</div>` : ''}
          </section>
        `;

        targetEl.querySelectorAll('[data-opt]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.opt);
            const opt = config.options[idx];
            if (opt.correct) {
              if (!solved) {
                solved = true;
                app.completeChapter(config.chapterId);
                window.AtelierSound.spark();
                window.AtelierConfetti.burst(38, 0.55);
                app.showToast(`✦ Spark earned for Chapter ${config.chapterId}!`);
                draw();
              } else {
                window.AtelierSound.pop();
              }
            } else {
              window.AtelierSound.oops();
              btn.classList.remove('wrong');
              void btn.offsetWidth;
              btn.classList.add('wrong');
            }
          });
        });
      }

      draw();
    }
  };

  function updateHeader() {
    sparkCountEl.textContent = String(state.completed.length);

    stepperEl.innerHTML = chapters.slice(1).map((ch) => {
      const isActive = state.current === ch.id;
      const isDone = app.isChapterComplete(ch.id);
      return `
        <button class="step-dot ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}" data-step="${ch.id}" title="Chapter ${ch.id}: ${ch.shortTitle}">
          <span class="dot-circle">${isDone && !isActive ? '✓' : ch.id}</span>
          <span class="dot-label">${ch.shortTitle}</span>
        </button>
      `;
    }).join('');

    stepperEl.querySelectorAll('[data-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        app.goTo(Number(btn.dataset.step));
      });
    });
  }

  function updateBottomNav() {
    if (state.current === 0) {
      bottomNavEl.classList.add('hidden');
      return;
    }
    bottomNavEl.classList.remove('hidden');

    if (state.current === 1) {
      prevLabel.textContent = 'Studio Map';
    } else {
      prevLabel.textContent = `Ch ${state.current - 1}: ${chapters[state.current - 1].shortTitle}`;
    }

    if (state.current === 6) {
      nextLabel.textContent = 'Back to Studio Map';
    } else {
      nextLabel.textContent = `Next · ${chapters[state.current + 1].shortTitle}`;
    }

    centerHint.textContent = `Chapter ${state.current} of 6 · ${state.completed.length}/6 Sparks earned`;
  }

  // Global Listeners
  document.getElementById('brand-home-btn').addEventListener('click', () => {
    window.AtelierSound.click();
    app.goTo(0);
  });

  prevBtn.addEventListener('click', () => {
    window.AtelierSound.click();
    app.goTo(state.current - 1);
  });

  nextBtn.addEventListener('click', () => {
    window.AtelierSound.pop();
    app.goTo(state.current === 6 ? 0 : state.current + 1);
  });

  soundToggleBtn.addEventListener('click', () => {
    const on = window.AtelierSound.toggle();
    soundIconEl.textContent = on ? '🔊' : '🔇';
    soundToggleBtn.classList.toggle('muted', !on);
  });

  document.getElementById('open-cheatsheet-btn').addEventListener('click', () => {
    window.AtelierSound.click();
    app.openCheatSheet();
  });

  document.getElementById('close-cheatsheet-btn').addEventListener('click', () => {
    window.AtelierSound.click();
    app.closeCheatSheet();
  });

  backdropEl.addEventListener('click', () => app.closeCheatSheet());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') app.closeCheatSheet();
  });

  // Boot!
  app.goTo(0);
})();
