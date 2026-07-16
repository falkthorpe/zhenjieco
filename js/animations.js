/* ============================================================
   zhenjieco.com — Animations Module
   Particle / network canvas, hero background, watchers.
   ============================================================ */
(function () {
  'use strict';

  /* -------------------------------------------------
   * 1. Hero particle / network field
   * ---------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = window.innerWidth < 720 ? 36 : 96;
    const LINK_DIST = 130;
    const COLOR = { line: 'rgba(0,212,255,', dot: 'rgba(0,255,163,' };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth = canvas.offsetWidth = canvas.parentElement.clientWidth;
      h = canvas.clientHeight = canvas.offsetHeight = canvas.parentElement.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      buildParticles();
    };

    const random = (min, max) => Math.random() * (max - min) + min;

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = random(-0.25, 0.25);
        this.vy = random(-0.25, 0.25);
        this.r = random(1.2, 2.2);
      }
      step() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = COLOR.dot + '0.85)';
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const buildParticles = () => {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    };

    const linkParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const a = (1 - dist / LINK_DIST) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = COLOR.line + a + ')';
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.step(); p.draw(); });
      linkParticles();
      requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    tick();

    // Mouse interaction: particles gravitate toward cursor
    let mouse = { x: w / 2, y: h / 2, active: false };
    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    canvas.addEventListener('pointerleave', () => { mouse.active = false; });
    setInterval(() => {
      if (mouse.active) {
        particles.forEach(p => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 220) {
            p.vx += dx * 0.00005;
            p.vy += dy * 0.00005;
          }
        });
      }
    }, 60);
  }

  /* -------------------------------------------------
   * 2. Parallax background orbs
   * ---------------------------------------------- */
  const orbs = document.querySelectorAll('[data-parallax]');
  if (orbs.length) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      orbs.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* -------------------------------------------------
   * 3. Scroll progress bar (optional via .scroll-progress)
   * ---------------------------------------------- */
  const sp = document.querySelector('.scroll-progress');
  if (sp) {
    const update = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      sp.style.transform = `scaleX(${pct / 100})`;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  /* -------------------------------------------------
   * 4. Tech grid drift (background pattern)
   * ---------------------------------------------- */
  const drifters = document.querySelectorAll('[data-drift]');
  drifters.forEach((el) => {
    const s = parseFloat(el.getAttribute('data-drift')) || 1;
    el.style.animation = `drift ${20 / s}s ease-in-out infinite`;
  });

  /* -------------------------------------------------
   * 5. Section number animator on scroll
   * ---------------------------------------------- */
  const sectionWatchers = document.querySelectorAll('.section-watch');
  if (sectionWatchers.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    sectionWatchers.forEach(el => obs.observe(el));
  }
})();
