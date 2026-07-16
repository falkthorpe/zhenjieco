/* ============================================================
   zhenjieco.com — Main JavaScript
   Navigation, loaders, scroll behavior, forms.
   ============================================================ */
(function () {
  'use strict';

  /* -------------------------------------------------
   * 1.  Loading screen
   * ---------------------------------------------- */
  const loader = document.querySelector('.loader');
  if (loader) {
    const hide = () => loader.classList.add('is-done');
    window.addEventListener('load', () => {
      setTimeout(hide, 700);
    });
    // Fallback: hide after 2.5s no matter what
    setTimeout(hide, 2500);
  }

  /* -------------------------------------------------
   * 2.  Sticky navigation with scroll state
   * ---------------------------------------------- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* -------------------------------------------------
   * 3.  Mobile menu toggle
   * ---------------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('.nav__menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* -------------------------------------------------
   * 4.  Reveal on scroll (IntersectionObserver)
   * ---------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* -------------------------------------------------
   * 5.  Animated counters
   * ---------------------------------------------- */
  const counters = document.querySelectorAll('[data-counter]');
  if ('IntersectionObserver' in window && counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-counter')) || 0;
      const duration = parseInt(el.getAttribute('data-duration')) || 1800;
      const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const startTime = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const t = Math.min(1, (now - startTime) / duration);
        const v = target * ease(t);
        el.textContent = prefix + v.toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => co.observe(c));
  } else {
    counters.forEach(c => {
      const target = c.getAttribute('data-counter');
      c.textContent = target;
    });
  }

  /* -------------------------------------------------
   * 6.  Magnetic / glow-follow buttons
   * ---------------------------------------------- */
  const magnetEls = document.querySelectorAll('[data-magnet], .btn');
  magnetEls.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });

  /* -------------------------------------------------
   * 7.  Tilt card effect
   * ---------------------------------------------- */
  const tiltEls = document.querySelectorAll('[data-tilt]');
  tiltEls.forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateZ(0)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  /* -------------------------------------------------
   * 8.  Cursor-follow (pointer halo)
   * ---------------------------------------------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    let cx = -100, cy = -100, tx = -100, ty = -100;
    window.addEventListener('pointermove', (e) => {
      tx = e.clientX; ty = e.clientY;
    });
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.querySelectorAll('a, button, .card, .app, .post, .chip, .btn').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });
    window.addEventListener('pointerdown', () => cursor.classList.add('is-press'));
    window.addEventListener('pointerup', () => cursor.classList.remove('is-press'));
  }

  /* -------------------------------------------------
   * 9.  Form submission (demo)
   * ---------------------------------------------- */
  const forms = document.querySelectorAll('.form [data-form]');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Transmitting...';
      }
      setTimeout(() => {
        if (btn) {
          btn.textContent = '✓ Message received';
        }
        form.reset();
        setTimeout(() => {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        }, 2200);
      }, 900);
    });
  });

  /* -------------------------------------------------
   * 10. Newsletter inline form
   * ---------------------------------------------- */
  document.querySelectorAll('[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      if (!input || !input.value) return;
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Subscribed';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2400);
      }
      input.value = '';
    });
  });

  /* -------------------------------------------------
   * 11. Active nav state for current page
   * ---------------------------------------------- */
  const path = location.pathname.replace(/\/$/, '').split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === path || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  /* -------------------------------------------------
   * 12. Filter chips (news page)
   * ---------------------------------------------- */
  const chips = document.querySelectorAll('[data-filter]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const group = chip.getAttribute('data-group');
      const target = chip.getAttribute('data-filter');
      document.querySelectorAll(`[data-filter][data-group="${group}"]`).forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      document.querySelectorAll('[data-cat]').forEach((post) => {
        const cat = post.getAttribute('data-cat');
        if (target === '*' || cat === target) {
          post.style.display = '';
        } else {
          post.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------
   * 13. Year auto-fill
   * ---------------------------------------------- */
  const yearEls = document.querySelectorAll('[data-year]');
  if (yearEls.length) {
    const y = new Date().getFullYear();
    yearEls.forEach(el => el.textContent = y);
  }

  /* -------------------------------------------------
   * 14. Smooth scroll for anchor links
   * ---------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -------------------------------------------------
   * 15. Console signature
   * ---------------------------------------------- */
  console.log('%c zhenjieco.com ', 'background: linear-gradient(135deg,#00d4ff,#00ffa3); color:#000; padding:6px 14px; border-radius:4px; font-weight:700;');
  console.log('%c Engineering the future of digital experience — from Virginia Innovation Center, USA.', 'color:#00d4ff; font-size:13px;');
})();
