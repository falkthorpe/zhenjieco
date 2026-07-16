/* ============================================================
   zhenjieco.com — Effects Module
   Tabs, accordions, modals, glitch effects, misc.
   ============================================================ */
(function () {
  'use strict';

  /* -------------------------------------------------
   * 1. Glitch text cycle
   * ---------------------------------------------- */
  const glitchEls = document.querySelectorAll('[data-glitch]');
  const CHARS = '!<>-_\\/[]{}—=+*^?#________01';
  glitchEls.forEach((el) => {
    const original = el.getAttribute('data-text') || el.textContent;
    let frame = 0;
    const scramble = () => {
      let out = '';
      for (let i = 0; i < original.length; i++) {
        if (Math.random() < 0.07 && frame < 12) {
          out += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          out += original[i];
        }
      }
      el.textContent = out;
      frame++;
      if (frame < 14) requestAnimationFrame(scramble);
      else el.textContent = original;
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          scramble();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  /* -------------------------------------------------
   * 2. Animated terminal typewriter
   * ---------------------------------------------- */
  const typeEls = document.querySelectorAll('[data-typer]');
  typeEls.forEach((el) => {
    const text = el.getAttribute('data-typer');
    const speed = parseInt(el.getAttribute('data-speed')) || 18;
    let i = 0;
    el.textContent = '';
    const run = () => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(run, speed);
      }
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          run();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* -------------------------------------------------
   * 3. Accordion
   * ---------------------------------------------- */
  document.querySelectorAll('[data-accordion]').forEach((acc) => {
    acc.querySelectorAll('[data-accordion-trigger]').forEach((trig) => {
      trig.addEventListener('click', () => {
        const item = trig.closest('[data-accordion-item]');
        const body = item.querySelector('[data-accordion-body]');
        const isOpen = item.classList.contains('is-open');
        acc.querySelectorAll('[data-accordion-item]').forEach(i => {
          i.classList.remove('is-open');
          i.querySelector('[data-accordion-body]').style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  });

  /* -------------------------------------------------
   * 4. Tabs
   * ---------------------------------------------- */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const triggers = group.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll(`[data-tab-panel-group="${group.getAttribute('data-tabs')}"] > [data-tab-panel]`);
    triggers.forEach((trig) => {
      trig.addEventListener('click', () => {
        const target = trig.getAttribute('data-tab');
        triggers.forEach(t => t.classList.remove('is-active'));
        trig.classList.add('is-active');
        panels.forEach((p) => {
          p.classList.toggle('is-active', p.getAttribute('data-tab-panel') === target);
        });
      });
    });
  });

  /* -------------------------------------------------
   * 5. Number tickers (radial meters)
   * ---------------------------------------------- */
  document.querySelectorAll('[data-radial]').forEach((gauge) => {
    const target = parseFloat(gauge.getAttribute('data-radial')) || 0;
    const fill = gauge.querySelector('[data-radial-fill]');
    const num = gauge.querySelector('[data-radial-num]');
    if (!fill) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fill.style.strokeDashoffset = 314 - (314 * target / 100);
          if (num) num.textContent = Math.round(target);
          obs.unobserve(gauge);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(gauge);
  });

  /* -------------------------------------------------
   * 6. Subtle 3D tilt on hero title
   * ---------------------------------------------- */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle) {
    document.addEventListener('pointermove', (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      heroTitle.style.transform = `perspective(900px) rotateX(${dy * -2}deg) rotateY(${dx * 2.4}deg)`;
    });
  }
})();
