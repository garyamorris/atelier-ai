window.AtelierChapters = window.AtelierChapters || {};

window.AtelierChapters[1] = {
  id: 1,
  emoji: '🧩',
  shortTitle: 'Puzzle Pieces & Guesses',
  duration: '2 min',
  teaser: 'See how AI chops words into tokens and plays the ultimate next-word guessing game.',
  render(container, app) {
    const tokenColors = [
      '#FCECE9', '#F0ECF8', '#E8F4EE', '#FDF3DF', '#EAF2FB', '#F9EBF4'
    ];

    const presets = [
      'Plan a cozy Lisbon weekend ✨',
      'Make my recipe site sage green',
      'Unhappy? Try sourdough baking!',
      'Codex builds real apps locally'
    ];

    const stems = [
      {
        label: 'Sunday mood',
        prefix: 'My favorite way to unwind on Sunday is',
        steps: [
          [
            { word: 'reading', score: 3.1 },
            { word: 'baking', score: 2.65 },
            { word: 'walking', score: 2.4 },
            { word: 'painting', score: 1.9 },
            { word: 'skydiving', score: 0.7 }
          ],
          [
            { word: 'with', score: 3.0 },
            { word: 'near', score: 2.2 },
            { word: 'while', score: 2.0 },
            { word: 'under', score: 1.3 },
            { word: 'aboard', score: 0.5 }
          ],
          [
            { word: 'matcha', score: 2.9 },
            { word: 'tea', score: 2.8 },
            { word: 'music', score: 2.4 },
            { word: 'candles', score: 2.1 },
            { word: 'rainbows', score: 0.6 }
          ]
        ]
      },
      {
        label: 'Apartment style',
        prefix: 'To make a small living room feel warm, add',
        steps: [
          [
            { word: 'soft', score: 3.0 },
            { word: 'woven', score: 2.6 },
            { word: 'warm', score: 2.5 },
            { word: 'vintage', score: 2.0 },
            { word: 'neon', score: 0.8 }
          ],
          [
            { word: 'linen', score: 2.9 },
            { word: 'lamps', score: 2.75 },
            { word: 'rugs', score: 2.45 },
            { word: 'plants', score: 2.35 },
            { word: 'disco', score: 0.65 }
          ],
          [
            { word: 'curtains', score: 2.9 },
            { word: 'pillows', score: 2.7 },
            { word: 'tones', score: 2.2 },
            { word: 'corners', score: 1.9 },
            { word: 'flamingos', score: 0.45 }
          ]
        ]
      },
      {
        label: 'Designing an app',
        prefix: 'Build a clean morning journal page with rounded',
        steps: [
          [
            { word: 'cards', score: 3.2 },
            { word: 'buttons', score: 2.7 },
            { word: 'corners', score: 2.5 },
            { word: 'badges', score: 1.9 },
            { word: 'clouds', score: 0.7 }
          ],
          [
            { word: 'and', score: 3.1 },
            { word: 'in', score: 2.6 },
            { word: 'using', score: 2.1 },
            { word: 'plus', score: 1.7 },
            { word: 'floating', score: 0.8 }
          ],
          [
            { word: 'sage', score: 2.8 },
            { word: 'cream', score: 2.75 },
            { word: 'soft', score: 2.4 },
            { word: 'warm', score: 2.3 },
            { word: 'sparkling', score: 0.9 }
          ]
        ]
      }
    ];

    // Visual-friendly tokenizer approximation (splits prefixes/suffixes/punctuation/emojis)
    function tokenize(text) {
      if (!text.trim()) return [];
      const raw = text.match(/(\p{Extended_Pictographic}|[A-Za-z]+|\d+|[^\sA-Za-z0-9]|\s+)/gu) || [];
      const out = [];
      for (const piece of raw) {
        if (/^\s+$/.test(piece)) continue;
        if (/^[A-Za-z]{8,}$/.test(piece)) {
          // Split long words into playful subword chunks like BPE
          const suffixMatch = piece.match(/^(.*?)(ing|tion|ment|ness|able|ful|less|ly|ed|er|es|s)$/i);
          if (suffixMatch && suffixMatch[1].length >= 3) {
            out.push(suffixMatch[1], suffixMatch[2]);
          } else {
            const mid = Math.ceil(piece.length * 0.55);
            out.push(piece.slice(0, mid), piece.slice(mid));
          }
        } else {
          out.push(piece);
        }
      }
      return out.map((t) => {
        let hash = 1042;
        for (let i = 0; i < t.length; i++) hash = (hash * 31 + t.charCodeAt(i)) % 49999;
        return { text: t, id: hash };
      });
    }

    function softmax(items, temp) {
      const t = Math.max(0.12, temp);
      const exps = items.map((i) => Math.exp(i.score / t));
      const sum = exps.reduce((a, b) => a + b, 0);
      return items.map((item, idx) => ({
        word: item.word,
        pct: Math.round((exps[idx] / sum) * 100)
      }));
    }

    let activeTab = 'tokens';
    let stemIdx = 0;
    let temperature = 0.7;
    let generated = [];

    container.innerHTML = `
      <div class="chapter-header">
        <div class="chapter-header-left">
          <span class="eyebrow">Chapter 1 of 6 · The Secret Engine</span>
          <h1 class="chapter-title">AI doesn't "think" — it predicts puzzle pieces</h1>
          <p class="chapter-hook">
            Under the hood, ChatGPT chops your message into tiny chunks called <strong>tokens</strong>, then guesses the single best next piece, one beat at a time.
          </p>
        </div>
        <span class="time-badge">⏱ 2 min studio</span>
      </div>

      <div class="metaphor-strip">
        <div class="metaphor-pill">
          <div class="metaphor-icon">🧩</div>
          <div>
            <strong>1. Tokens = Word Pieces</strong>
            <span>Short words stay whole; longer words or emojis split into numbered tiles.</span>
          </div>
        </div>
        <div class="metaphor-pill">
          <div class="metaphor-icon">🎲</div>
          <div>
            <strong>2. Next-Word Odds</strong>
            <span>Every reply is built one predicted piece at a time — super fast autocomplete!</span>
          </div>
        </div>
        <div class="metaphor-pill">
          <div class="metaphor-icon">🎛️</div>
          <div>
            <strong>3. Creativity Dial</strong>
            <span>"Temperature" controls whether AI plays it safe or picks surprising words.</span>
          </div>
        </div>
      </div>

      <div class="toy-tabs" role="tablist">
        <button class="toy-tab active" data-tab="tokens">🧩 Lab 1: Token Splitter</button>
        <button class="toy-tab" data-tab="predict">🎲 Lab 2: Next-Word & Creativity Dial</button>
      </div>

      <!-- TAB 1: TOKEN SPLITTER -->
      <section class="studio-card" id="panel-tokens">
        <div class="studio-card-header">
          <h2 class="studio-card-title">See how AI slices your sentence</h2>
          <span class="card-badge">Live Interactive</span>
        </div>
        <p class="micro-caption">Type anything below (or tap a preset) to see the numbered tiles AI actually reads.</p>

        <div class="chip-row" id="token-presets">
          ${presets.map((p, i) => `<button class="btn-soft ${i === 0 ? 'active' : ''}" data-preset="${p}">${p}</button>`).join('')}
        </div>

        <div class="token-input-wrap">
          <input class="studio-input" id="token-input" type="text" value="${presets[0]}" maxlength="90" aria-label="Type text to tokenize" />
        </div>

        <div class="token-tray" id="token-tray"></div>

        <div class="token-stats" id="token-stats"></div>
      </section>

      <!-- TAB 2: NEXT WORD PREDICTOR -->
      <section class="studio-card" id="panel-predict" style="display: none;">
        <div class="studio-card-header">
          <h2 class="studio-card-title">Watch AI pick the next word</h2>
          <span class="card-badge coral">Try the Dial!</span>
        </div>
        <p class="micro-caption">Drag the <strong>Creativity Dial</strong> to reshape the odds, then tap <strong>Predict Next Word</strong> (or click any bar yourself).</p>

        <div class="chip-row" id="stem-chips">
          ${stems.map((s, i) => `<button class="btn-soft ${i === 0 ? 'active' : ''}" data-stem="${i}">${s.label}</button>`).join('')}
        </div>

        <div class="sentence-stage" id="sentence-stage"></div>

        <div class="predictor-grid">
          <div>
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); margin-bottom: 10px;">
              AI's Top Guesses Right Now
            </div>
            <div class="prob-list" id="prob-list"></div>
          </div>

          <div class="dial-panel">
            <div class="dial-header">
              <strong style="font-size: 14px;">🎛️ Creativity Dial</strong>
              <span class="dial-value-pill" id="temp-val">0.7 · Balanced</span>
            </div>
            <input type="range" class="studio-range" id="temp-slider" min="0.15" max="1.6" step="0.05" value="0.7" />
            <div class="dial-labels">
              <span>Safe & Focused</span>
              <span>Wild & Artsy</span>
            </div>
            <div class="dial-mood" id="temp-mood"></div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn-primary" id="spin-word-btn" style="flex: 1;">✨ Predict Next Word</button>
              <button class="btn-soft" id="reset-stem-btn">↺ Reset</button>
            </div>
          </div>
        </div>
      </section>

      <!-- AHA CHECK -->
      <div id="ch1-check"></div>
    `;

    // --- Tab switching ---
    const panelTokens = container.querySelector('#panel-tokens');
    const panelPredict = container.querySelector('#panel-predict');
    container.querySelectorAll('.toy-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        window.AtelierSound.click();
        activeTab = tab.dataset.tab;
        container.querySelectorAll('.toy-tab').forEach((t) => t.classList.toggle('active', t === tab));
        panelTokens.style.display = activeTab === 'tokens' ? 'block' : 'none';
        panelPredict.style.display = activeTab === 'predict' ? 'block' : 'none';
      });
    });

    // --- Token Splitter logic ---
    const tokenInput = container.querySelector('#token-input');
    const tokenTray = container.querySelector('#token-tray');
    const tokenStats = container.querySelector('#token-stats');

    function renderTokens() {
      const text = tokenInput.value;
      const tokens = tokenize(text);
      if (!tokens.length) {
        tokenTray.innerHTML = `<span style="color: var(--ink-muted); font-size: 14px;">Type a few words above to watch them split into puzzle pieces...</span>`;
        tokenStats.innerHTML = '';
        return;
      }
      tokenTray.innerHTML = tokens.map((tok, i) => `
        <span class="token-tile" style="background: ${tokenColors[i % tokenColors.length]}; animation-delay: ${Math.min(i * 22, 220)}ms;">
          <span class="token-text">${tok.text.replace(/</g, '&lt;')}</span>
          <span class="token-id">#${tok.id}</span>
        </span>
      `).join('');

      tokenStats.innerHTML = `
        <span><strong>${tokens.length}</strong> tokens</span>
        <span>·</span>
        <span><strong>${text.length}</strong> characters</span>
        <span>·</span>
        <span>💡 Notice how long words split into sub-pieces & every piece gets a secret ID number!</span>
      `;
    }

    tokenInput.addEventListener('input', renderTokens);
    container.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.pop();
        tokenInput.value = btn.dataset.preset;
        container.querySelectorAll('[data-preset]').forEach((b) => b.classList.toggle('active', b === btn));
        renderTokens();
      });
    });
    renderTokens();

    // --- Next-Word Predictor logic ---
    const sentenceStage = container.querySelector('#sentence-stage');
    const probList = container.querySelector('#prob-list');
    const tempSlider = container.querySelector('#temp-slider');
    const tempVal = container.querySelector('#temp-val');
    const tempMood = container.querySelector('#temp-mood');
    const spinBtn = container.querySelector('#spin-word-btn');

    function renderPredictor() {
      const stem = stems[stemIdx];
      const stepIndex = generated.length;
      const isDone = stepIndex >= stem.steps.length;

      sentenceStage.innerHTML = `
        <span>${stem.prefix}</span>
        ${generated.map((w) => `<span class="generated-word">${w}</span>`).join('')}
        ${isDone ? '<span style="color: var(--sage); font-weight: 700;">. ✨</span>' : '<span class="cursor-slot">next word?</span>'}
      `;

      // Update dial label
      let moodLabel = 'Balanced';
      let moodTip = 'Great for everyday writing and building web pages with personality.';
      if (temperature <= 0.4) {
        moodLabel = 'Focused';
        moodTip = 'Almost always picks the #1 safest guess — super useful when Codex writes code!';
      } else if (temperature >= 1.15) {
        moodLabel = 'Wild';
        moodTip = 'Even quirky, low-probability words get a real shot — fun for brainstorming!';
      }
      tempVal.textContent = `${temperature.toFixed(2)} · ${moodLabel}`;
      tempMood.textContent = moodTip;

      if (isDone) {
        probList.innerHTML = `
          <div style="padding: 18px; border-radius: 14px; background: var(--sage-soft); color: #1F5B44; font-weight: 600;">
            ✨ Complete! AI built that phrase one probability roll at a time. Tap <strong>Reset</strong> or pick another starter to try a different creativity setting!
          </div>
        `;
        spinBtn.disabled = true;
        spinBtn.style.opacity = '0.55';
        return;
      }

      spinBtn.disabled = false;
      spinBtn.style.opacity = '1';

      const dist = softmax(stem.steps[stepIndex], temperature);
      probList.innerHTML = dist.map((item) => `
        <button class="prob-row" data-pick="${item.word}">
          <span class="prob-word">${item.word}</span>
          <span class="prob-track"><span class="prob-fill" style="width: ${Math.max(4, item.pct)}%"></span></span>
          <span class="prob-pct">${item.pct}%</span>
        </button>
      `).join('');

      probList.querySelectorAll('[data-pick]').forEach((row) => {
        row.addEventListener('click', () => {
          window.AtelierSound.pop();
          generated.push(row.dataset.pick);
          renderPredictor();
        });
      });
    }

    tempSlider.addEventListener('input', () => {
      temperature = parseFloat(tempSlider.value);
      renderPredictor();
    });

    spinBtn.addEventListener('click', () => {
      const stem = stems[stemIdx];
      if (generated.length >= stem.steps.length) return;
      const dist = softmax(stem.steps[generated.length], temperature);
      // Weighted random pick based on temperature-adjusted probabilities
      const total = dist.reduce((acc, d) => acc + d.pct, 0);
      let r = Math.random() * total;
      let chosen = dist[0].word;
      for (const d of dist) {
        r -= d.pct;
        if (r <= 0) {
          chosen = d.word;
          break;
        }
      }
      window.AtelierSound.pop();
      generated.push(chosen);
      renderPredictor();
    });

    container.querySelector('#reset-stem-btn').addEventListener('click', () => {
      window.AtelierSound.click();
      generated = [];
      renderPredictor();
    });

    container.querySelectorAll('[data-stem]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.AtelierSound.click();
        stemIdx = Number(btn.dataset.stem);
        generated = [];
        container.querySelectorAll('[data-stem]').forEach((b) => b.classList.toggle('active', b === btn));
        renderPredictor();
      });
    });

    renderPredictor();

    // --- Quick Check ---
    app.renderCheck(container.querySelector('#ch1-check'), {
      chapterId: 1,
      question: 'Quick Spark Check: When you ask ChatGPT a question, what is it literally doing behind the scenes?',
      options: [
        { label: 'Searching a giant filing cabinet of pre-written human answers', correct: false },
        { label: 'Predicting the most likely next word-piece (token), one beat at a time', correct: true },
        { label: 'Secretly Googling every single word before typing', correct: false }
      ],
      explanation: 'Spot on! Because it predicts piece by piece, giving it a clear, vivid start shapes every word that follows.'
    });
  }
};
