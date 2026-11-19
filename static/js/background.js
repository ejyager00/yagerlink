// Background animations. Pick one with params.background in hugo.toml:
//   bubbles | lava | murmuration | birds | fireflies | none | random (any but none, per load)
// or a list of those, e.g. ["lava", "birds"], to pick one of them at random per load.
// With prefers-reduced-motion, canvas modes draw one still frame and DOM modes render nothing.
(() => {
  const root = document.getElementById('bgAnimation');
  if (!root) return;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const small = () => innerWidth < 600;

  // Full-viewport canvas. `scale` is canvas px per CSS px (default: devicePixelRatio).
  // frame(t, dt) runs every animation frame, or after `warmup` simulated steps when still.
  function run(scale, setup, frame, warmup = 1) {
    const c = document.createElement('canvas');
    root.appendChild(c);
    const v = { ctx: c.getContext('2d'), c, w: 0, h: 0 };
    const fit = () => {
      const r = scale ?? Math.min(devicePixelRatio || 1, 2);
      v.w = innerWidth;
      v.h = innerHeight;
      c.width = Math.ceil(v.w * r);
      c.height = Math.ceil(v.h * r);
      v.ctx.setTransform(r, 0, 0, r, 0, 0);
      v.resized?.();
    };
    fit();
    setup(v);
    const drawStill = () => { for (let i = 0; i < warmup; i++) frame(i / 60, 1 / 60); };
    addEventListener('resize', () => { fit(); if (still) drawStill(); });
    if (still) return drawStill();
    let last = performance.now();
    const tick = now => {
      frame(now / 1000, Math.min((now - last) / 1000, 0.05));
      last = now;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const modes = {
    // The theme's original floating circles (styled by .circle in the theme CSS).
    bubbles() {
      if (still) return;
      for (let i = 0; i < 15; i++) {
        const el = document.createElement('div');
        const size = rand(50, 200);
        el.className = 'circle';
        Object.assign(el.style, {
          width: `${size}px`, height: `${size}px`,
          left: `${rand(0, 100)}%`, top: `${rand(0, 100)}%`,
          animationDuration: `${rand(10, 30)}s`, animationDelay: `${rand(0, 5)}s`,
        });
        root.appendChild(el);
      }
    },

    // Metaballs on a low-res canvas; CSS upscaling softens the edges.
    lava() {
      const CELL = 6;
      let blobs, img, view;
      run(1 / CELL, v => {
        view = v;
        v.resized = () => { img = v.ctx.createImageData(v.c.width, v.c.height); };
        v.resized();
        blobs = Array.from({ length: small() ? 5 : 7 }, () => ({
          x: rand(0.1, 0.9), r: rand(0.07, 0.14),
          period: rand(45, 90), phase: rand(0, Math.PI * 2),
        }));
      }, t => {
        const { width: W, height: H } = img;
        const unit = Math.min(W, H) * 1.6;
        const pos = blobs.map(b => {
          const a = (t / b.period) * Math.PI * 2 + b.phase;
          return [
            (b.x + 0.05 * Math.sin(a * 2.3)) * W,
            (0.5 + 0.6 * Math.sin(a)) * H, // rise and sink, partly off-screen
            (b.r * unit) ** 2,
          ];
        });
        const d = img.data;
        for (let y = 0, i = 0; y < H; y++) {
          const k = y / H; // warm orange at the bottom, magenta at the top
          const R = 200 + 55 * k, G = 70 + 25 * k, B = 160 - 100 * k;
          for (let x = 0; x < W; x++, i += 4) {
            let f = 0;
            for (const [bx, by, r2] of pos) f += r2 / ((x - bx) ** 2 + (y - by) ** 2 + 1);
            const a = Math.min(Math.max((f - 0.85) / 0.35, 0), 1);
            d[i] = R; d[i + 1] = G; d[i + 2] = B;
            d[i + 3] = a * (65 + 30 * Math.min(f - 1, 1));
          }
        }
        view.ctx.putImageData(img, 0, 0);
      });
    },

    // Boids flock steered by a wandering target, drawn as short strokes.
    murmuration() {
      let birds, view;
      run(undefined, v => {
        view = v;
        birds = Array.from({ length: small() ? 70 : 140 }, () => ({
          x: v.w / 2 + rand(-80, 80), y: v.h / 2 + rand(-80, 80),
          vx: rand(-1, 1), vy: rand(-1, 1),
        }));
      }, (t, dt) => {
        const { ctx, w, h } = view, s = dt * 60;
        const tx = w / 2 + w * 0.32 * Math.sin(t * 0.11);
        const ty = h / 2 + h * 0.28 * Math.sin(t * 0.17 + 1);
        for (const b of birds) {
          let n = 0, cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0;
          for (const o of birds) {
            if (o === b) continue;
            const dx = o.x - b.x, dy = o.y - b.y, d2 = dx * dx + dy * dy;
            if (d2 > 2500) continue;
            n++; cx += o.x; cy += o.y; ax += o.vx; ay += o.vy;
            if (d2 < 200) { sx -= dx / (d2 + 1); sy -= dy / (d2 + 1); }
          }
          let fx = sx * 1.5 + (tx - b.x) * 0.0004, fy = sy * 1.5 + (ty - b.y) * 0.0004;
          if (n) {
            fx += (cx / n - b.x) * 0.004 + (ax / n - b.vx) * 0.05;
            fy += (cy / n - b.y) * 0.004 + (ay / n - b.vy) * 0.05;
          }
          const m = 40; // keep inside the viewport
          if (b.x < m) fx += 0.15; else if (b.x > w - m) fx -= 0.15;
          if (b.y < m) fy += 0.15; else if (b.y > h - m) fy -= 0.15;
          b.vx += fx * s; b.vy += fy * s;
          const sp = Math.hypot(b.vx, b.vy), c = Math.min(Math.max(sp, 1.2), 2.2) / (sp || 1);
          b.vx *= c; b.vy *= c;
          b.x += b.vx * s; b.y += b.vy * s;
        }
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (const b of birds) { ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2); }
        ctx.stroke();
      }, 300);
    },

    // Occasional gulls gliding across; smaller ones are fainter and slower (parallax).
    birds() {
      if (still) return;
      const fly = () => {
        const size = rand(18, 54), depth = (size - 18) / 36;
        const el = document.createElement('div');
        el.className = 'bird';
        el.innerHTML = '<svg viewBox="0 0 40 14"><path d="M2 10Q11 1 20 10Q29 1 38 10"/></svg>';
        el.style.width = `${size}px`;
        el.style.opacity = 0.25 + 0.4 * depth;
        el.style.setProperty('--flap', `${rand(1.8, 2.8)}s`);
        el.style.setProperty('--flap-delay', `${-rand(0, 3)}s`);
        root.appendChild(el);
        const y0 = rand(0.05, 0.75) * innerHeight, y1 = y0 + rand(-0.15, 0.15) * innerHeight;
        const xs = [-size - 20, innerWidth + 20];
        if (Math.random() < 0.5) xs.reverse();
        const speed = 50 + 70 * depth; // px/s
        el.animate(
          [{ transform: `translate(${xs[0]}px, ${y0}px)` }, { transform: `translate(${xs[1]}px, ${y1}px)` }],
          { duration: ((innerWidth + size + 40) / speed) * 1000 },
        ).onfinish = () => el.remove();
      };
      const spawn = () => {
        if (root.childElementCount < (small() ? 4 : 8)) fly();
        setTimeout(spawn, rand(1500, 4500));
      };
      fly();
      setTimeout(fly, rand(500, 2000));
      setTimeout(spawn, rand(1500, 4000));
    },

    // Wandering points that glow and fade.
    fireflies() {
      let flies, view;
      const wrap = (x, max) => ((((x + 20) % (max + 40)) + max + 40) % (max + 40)) - 20;
      run(undefined, v => {
        view = v;
        flies = Array.from({ length: small() ? 16 : 30 }, () => ({
          x: rand(0, v.w), y: rand(0, v.h), a: rand(0, Math.PI * 2),
          speed: rand(8, 22), f: rand(0.4, 1.1), p: rand(0, Math.PI * 2), r: rand(1.5, 3),
        }));
      }, (t, dt) => {
        const { ctx, w, h } = view;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        for (const q of flies) {
          q.a += rand(-1, 1) * dt * 2;
          q.x = wrap(q.x + Math.cos(q.a) * q.speed * dt, w);
          q.y = wrap(q.y + Math.sin(q.a) * q.speed * dt, h);
          const glow = 0.08 + 0.75 * Math.max(0, Math.sin(t * q.f + q.p)) ** 3;
          const R = q.r * 7, g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, R);
          g.addColorStop(0, `rgba(235, 255, 170, ${glow})`);
          g.addColorStop(0.25, `rgba(200, 255, 120, ${glow * 0.35})`);
          g.addColorStop(1, 'rgba(200, 255, 120, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(q.x - R, q.y - R, R * 2, R * 2);
        }
        ctx.globalCompositeOperation = 'source-over';
      }, 90);
    },

    none() {},
  };

  // A comma-separated list picks one at random per load; "random" means every mode but none.
  let pool = (root.dataset.bg || '').split(',').map(m => m.trim()).filter(m => m in modes || m === 'random');
  if (pool.includes('random')) pool = Object.keys(modes).filter(m => m !== 'none');
  (modes[pool[Math.floor(Math.random() * pool.length)]] || modes.bubbles)();
})();
