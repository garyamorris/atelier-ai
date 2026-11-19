window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[0] = {
  id: 0,
  shortTitle: 'Studio Map',
  title: 'Welcome',
  render(container, app) {
    const doneCount = app.getCompletedCount();
    const nextChapterId = app.getNextIncompleteChapter();

    container.innerHTML = `
      <section class="hero-card">
        <div>
          <span class="eyebrow">✦ Visual Interactive Mini-Course</span>
          <h1 class="hero-title">From ChatGPT to <em>building with Codex</em></h1>
          <p class="hero-sub">
            No walls of text. No coding required. Six playful, visual 2-minute studios that show how AI really thinks — so you can open a Desktop Codex app and create with confidence.
          </p>
          <div class="hero-cta-row">
            <button class="btn-primary" id="hero-start-btn">
              <span>${doneCount === 0 ? 'Start Chapter 1' : doneCount === 6 ? 'Revisit the Sandbox' : `Continue · Chapter ${nextChapterId}`}</span>
              <span>→</span>
            </button>
            <button class="btn-soft" id="hero-cheatsheet-btn">
              <span>📋</span>
              <span>Peek at Codex Cheat Sheet</span>
            </button>
          </div>
          <div class="hero-meta">
            <span>⏱ ~12 mins total</span>
            <span>🎨 100% visual & hands-on</span>
            <span>✦ ${doneCount}/6 sparks collected</span>
          </div>
        </div>

        <div class="hero-visual" aria-label="Your 3-stage transformation">
          <div class="journey-flow-node">
            <div class="node-orb" style="background: var(--coral-soft);">💬</div>
            <div>
              <strong>Where you are now</strong>
              <span>Typing prompts into ChatGPT</span>
            </div>
          </div>
          <div class="journey-flow-node">
            <div class="node-orb" style="background: var(--plum-soft);">✨</div>
            <div>
              <strong>Peek behind the curtain</strong>
              <span>Tokens, spotlight memory & why AI guesses</span>
            </div>
          </div>
          <div class="journey-flow-node">
            <div class="node-orb" style="background: var(--sage-soft);">🖥️</div>
            <div>
              <strong>Your new superpower</strong>
              <span>Directing a Desktop Codex app to build real projects</span>
            </div>
          </div>
        </div>
      </section>

      <div class="section-heading-row">
        <h2>Your 6-Step Studio Map</h2>
        <span style="font-size: 13px; color: var(--ink-muted); font-weight: 600;">Jump in anywhere — each takes ~2 minutes</span>
      </div>

      <div class="map-grid" id="studio-map-grid">
        ${app.chapters.slice(1).map((ch) => {
          const isDone = app.isChapterComplete(ch.id);
          return `
            <button class="chapter-card ${isDone ? 'done' : ''}" data-go="${ch.id}">
              <div class="chapter-card-top">
                <span class="chapter-emoji">${ch.emoji}</span>
                <span class="chapter-num">Chapter ${ch.id}</span>
              </div>
              <h3>${ch.shortTitle}</h3>
              <p>${ch.teaser}</p>
              <div class="chapter-card-foot">
                <span>⏱ ${ch.duration}</span>
                ${isDone ? '<span class="done-pill">✦ Spark Earned</span>' : '<span>Explore →</span>'}
              </div>
            </button>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#hero-start-btn').addEventListener('click', () => {
      window.AtelierSound.pop();
      app.goTo(doneCount === 6 ? 6 : nextChapterId);
    });

    container.querySelector('#hero-cheatsheet-btn').addEventListener('click', () => {
      window.AtelierSound.click();
      app.openCheatSheet();
    });

    container.querySelectorAll('[data-go]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        app.goTo(Number(btn.dataset.go));
      });
    });
  }
};
