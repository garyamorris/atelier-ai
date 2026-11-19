// Lightweight warm studio confetti / sparkles burst
window.AtelierConfetti = (() => {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const colors = ['#D96857', '#49856E', '#7865A8', '#E5AA46', '#F0A294', '#A2D5BF'];
  let particles = [];
  let rafId = null;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter((p) => p.alpha > 0.02);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.985;
      p.rot += p.vrot;
      p.alpha *= 0.978;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
      }
      ctx.restore();
    }

    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }

  return {
    burst(count = 46, originY = 0.38) {
      if (!canvas || !ctx) return;
      resize();
      const ox = canvas.width * 0.5;
      const oy = canvas.height * originY;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 4 + Math.random() * 7;
        particles.push({
          x: ox + (Math.random() - 0.5) * 90,
          y: oy + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          size: 6 + Math.random() * 6,
          rot: Math.random() * Math.PI,
          vrot: (Math.random() - 0.5) * 0.25,
          color: colors[i % colors.length],
          shape: i % 3 === 0 ? 'circle' : 'rect',
          alpha: 1
        });
      }
      if (!rafId) tick();
    }
  };
})();
