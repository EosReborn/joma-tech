/**
 * JoMa-Tech Laser Clean — main.js
 * Animációk: Laser spark, magnetic buttons, stagger reveal,
 * text typewriter, particle canvas, glitch, cursor trail
 */

'use strict';

/* ================================================
   1. STICKY HEADER + BACK TO TOP
   ================================================ */
const header  = document.getElementById('site-header');
const backTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  header  && header.classList.toggle('scrolled', scrolled);
  backTop && backTop.classList.toggle('visible', scrolled);
}, { passive: true });

backTop && backTop.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ================================================
   2. HAMBURGER MENÜ
   ================================================ */
const toggle    = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

toggle && toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileNav && mobileNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    toggle    && toggle.classList.remove('open');
    mobileNav && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ================================================
   3. AKTÍV NAV LINK
   ================================================ */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ================================================
   4. SCROLL REVEAL — egyedi stagger animációk
   ================================================ */
(function addAOSStyles() {
  const s = document.createElement('style');
  s.textContent = `
    [data-aos] { transition: opacity 0.75s cubic-bezier(.16,1,.3,1), transform 0.75s cubic-bezier(.16,1,.3,1); }
    [data-aos="fade-up"]    { opacity:0; transform:translateY(40px); }
    [data-aos="fade-up"].aos-animate    { opacity:1; transform:translateY(0); }
    [data-aos="fade-in"]    { opacity:0; }
    [data-aos="fade-in"].aos-animate    { opacity:1; }
    [data-aos="slide-right"]{ opacity:0; transform:translateX(-40px); }
    [data-aos="slide-right"].aos-animate{ opacity:1; transform:translateX(0); }
    [data-aos="slide-left"] { opacity:0; transform:translateX(40px); }
    [data-aos="slide-left"].aos-animate { opacity:1; transform:translateX(0); }
    [data-aos="zoom-in"]    { opacity:0; transform:scale(0.88); }
    [data-aos="zoom-in"].aos-animate    { opacity:1; transform:scale(1); }
    [data-aos="flip-up"]    { opacity:0; transform:rotateX(-20deg) translateY(30px); }
    [data-aos="flip-up"].aos-animate    { opacity:1; transform:rotateX(0) translateY(0); }
  `;
  document.head.appendChild(s);
})();

function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = +(el.dataset.aosDelay || 0);
      setTimeout(() => el.classList.add('aos-animate'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => { el.classList.add('aos-init'); obs.observe(el); });
}

/* ================================================
   5. COUNTER ANIMÁCIÓ
   ================================================ */
function animateCounters() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = +el.dataset.target;
      const duration = 2200;
      const start    = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        // Ease out quart
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(e * target).toLocaleString('hu-HU');
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
}

/* ================================================
   6. FAQ ACCORDION
   ================================================ */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item    = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ================================================
   7. LIGHTBOX
   ================================================ */
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('#lb-img');
  const items = document.querySelectorAll('.gallery-item');
  let current = 0;

  const open  = (idx) => {
    current = idx;
    const img = items[idx].querySelector('img');
    if (img && lbImg) { lbImg.style.opacity = 0; lbImg.src = img.src; lbImg.onload = () => { lbImg.style.transition='opacity .3s'; lbImg.style.opacity=1; }; }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  const prev  = () => open((current - 1 + items.length) % items.length);
  const next  = () => open((current + 1) % items.length);

  items.forEach((item, idx) => item.addEventListener('click', () => open(idx)));
  lb.querySelector('.lb-close')?.addEventListener('click', close);
  lb.querySelector('.lb-prev') ?.addEventListener('click', prev);
  lb.querySelector('.lb-next') ?.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ================================================
   8. COOKIE BANNER
   ================================================ */
function initCookies() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  if (!localStorage.getItem('jt_cookie_consent')) banner.classList.add('show');
  document.getElementById('cookie-accept')?.addEventListener('click', () => {
    localStorage.setItem('jt_cookie_consent', 'accepted'); banner.classList.remove('show');
  });
  document.getElementById('cookie-reject')?.addEventListener('click', () => {
    localStorage.setItem('jt_cookie_consent', 'rejected'); banner.classList.remove('show');
  });
  document.getElementById('cookie-settings')?.addEventListener('click', () => {
    window.location.href = 'cookie-tajekoztato.html';
  });
}

/* ================================================
   9. LASER PARTICLE CANVAS — Hero háttér
   ================================================ */
function initLaserCanvas() {
  const canvas = document.getElementById('laser-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Spark {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.life   = Math.random() * 200 + 100;
      this.maxLife= this.life;
      this.size   = Math.random() * 1.8 + 0.4;
      this.color  = Math.random() > 0.6 ? '#ED9925' : '#fff';
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life--;
      if (this.life <= 0) this.reset();
    }
    draw() {
      const alpha = (this.life / this.maxLife) * 0.55;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur  = this.color === '#ED9925' ? 10 : 4;
      ctx.shadowColor = this.color;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Laser beam lines
  class LaserBeam {
    constructor() { this.reset(); }
    reset() {
      this.x1    = Math.random() * W;
      this.y1    = Math.random() * H;
      const angle= Math.random() * Math.PI * 2;
      const len  = Math.random() * 120 + 40;
      this.x2    = this.x1 + Math.cos(angle) * len;
      this.y2    = this.y1 + Math.sin(angle) * len;
      this.life  = Math.random() * 40 + 10;
      this.maxLife = this.life;
      this.width = Math.random() * 0.8 + 0.2;
    }
    update() { this.life--; if (this.life <= 0) this.reset(); }
    draw() {
      const alpha = (this.life / this.maxLife) * 0.18;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#ED9925';
      ctx.lineWidth   = this.width;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#ED9925';
      ctx.beginPath();
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++)  particles.push(new Spark());
  for (let i = 0; i < 12; i++)  particles.push(new LaserBeam());

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  };
  loop();
}

/* ================================================
   10. TYPEWRITER — Hero h1 szöveg
   ================================================ */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;
  const texts = ['rozsdaeltávolítás', 'festékeltávolítás', 'fémtisztítás', 'lézeres megoldás'];
  let ti = 0, ci = 0, deleting = false;
  const type = () => {
    const current = texts[ti];
    if (deleting) {
      el.textContent = current.substring(0, --ci);
    } else {
      el.textContent = current.substring(0, ++ci);
    }
    if (!deleting && ci === current.length) {
      setTimeout(() => { deleting = true; }, 1800);
    } else if (deleting && ci === 0) {
      deleting = false;
      ti = (ti + 1) % texts.length;
    }
    setTimeout(type, deleting ? 55 : 90);
  };
  setTimeout(type, 800);
}

/* ================================================
   11. MAGNETIC BUTTON EFFEKT
   ================================================ */
function initMagneticButtons() {
  // Csak desktop-on
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r   = btn.getBoundingClientRect();
      const dx  = e.clientX - (r.left + r.width  / 2);
      const dy  = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s linear';
    });
  });
}

/* ================================================
   12. LASER CURSOR TRAIL
   ================================================ */
function initCursorTrail() {
  if (window.matchMedia('(hover: none)').matches) return;
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const sparks = [];
  hero.addEventListener('mousemove', e => {
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'cursor-spark';
      dot.style.cssText = `
        position:fixed;
        left:${e.clientX}px;
        top:${e.clientY}px;
        width:${Math.random()*4+2}px;
        height:${Math.random()*4+2}px;
        border-radius:50%;
        background:${Math.random()>.5?'#ED9925':'#fff'};
        pointer-events:none;
        z-index:9999;
        transform:translate(-50%,-50%);
        box-shadow:0 0 6px #ED9925;
      `;
      document.body.appendChild(dot);
      sparks.push(dot);

      const vx = (Math.random() - 0.5) * 60;
      const vy = (Math.random() - 0.5) * 60;
      let op = 1;
      const fade = () => {
        op -= 0.06;
        dot.style.opacity = op;
        dot.style.transform = `translate(calc(-50% + ${vx*(1-op)}px), calc(-50% + ${vy*(1-op)}px))`;
        if (op > 0) requestAnimationFrame(fade);
        else dot.remove();
      };
      requestAnimationFrame(fade);
    }
  });
}

/* ================================================
   13. GLITCH EFFECT — Section titles
   ================================================ */
function initGlitch() {
  document.querySelectorAll('.glitch').forEach(el => {
    el.dataset.text = el.textContent;
  });
}

/* ================================================
   14. STAGGER CARDS — Grid kártyák egymás utáni animációja
   ================================================ */
function initStaggerCards() {
  const grids = document.querySelectorAll('.grid-3, .grid-4, .grid-2');
  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.card, .service-card, .value-card, .faq-item');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(.16,1,.3,1)';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 100);
        });
        obs.unobserve(grid);
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(28px)';
    });
    obs.observe(grid);
  });
}

/* ================================================
   15. HERO SZÖVEG — belépő animáció soronként
   ================================================ */
function initHeroEntrance() {
  const hero = document.querySelector('.hero-content');
  if (!hero) return;
  const els = hero.querySelectorAll('.hero-badge, h1, .hero-desc, .hero-actions');
  els.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition= `opacity 0.8s ease ${i * 0.15 + 0.2}s, transform 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.15 + 0.2}s`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ================================================
   16. SZÁMLÁLÓ VONALAK — Service kártyák hover
   ================================================ */
function initCardBorderAnim() {
  document.querySelectorAll('.card, .service-card, .contact-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.setProperty('--border-progress', '1');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--border-progress', '0');
    });
  });
}

/* ================================================
   17. SMOOTH PAGE TRANSITION
   ================================================ */
function initPageTransitions() {
  // Fade-out kilépéskor
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (href.includes('://') && !href.includes(window.location.host)) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.25s ease';
      document.body.style.opacity    = '0';
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
  // Fade-in érkezéskor
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
}

/* ================================================
   18. SECTION DIVIDER ANIMÁCIÓ — narancssárga vonal
   ================================================ */
function initDividerAnim() {
  document.querySelectorAll('.divider').forEach(d => {
    d.style.width      = '0';
    d.style.transition = 'width 0.8s cubic-bezier(.16,1,.3,1)';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          d.style.width = '56px';
          obs.unobserve(d);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(d);
  });
}

/* ================================================
   19. LÉZER GÖRGETÉSI VONAL
   ================================================ */
function initLaserScrollLine() {
  const line = document.createElement('div');
  line.id = 'laser-scroll-line';
  document.body.appendChild(line);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      line.style.height = pct + '%';
      // Fény intenzitása görgetési sebességtől függ
      const glow = Math.min(pct * 0.5 + 10, 30);
      line.style.boxShadow = `0 0 ${glow}px var(--orange), 0 0 ${glow * 2}px rgba(237,153,37,0.3)`;
      ticking = false;
    });
  }, { passive: true });
}

/* ================================================
   20. INTERAKTÍV ELŐTTE–UTÁNA CSÚSZKA
   ================================================ */
function initBASliders() {
  document.querySelectorAll('.ba-slider-wrap').forEach(wrap => {
    const before = wrap.querySelector('.ba-slider-before');
    const handle = wrap.querySelector('.ba-slider-handle');
    if (!before || !handle) return;

    let dragging = false;
    let pct = 50;

    const setPos = (x) => {
      const rect = wrap.getBoundingClientRect();
      pct = Math.max(2, Math.min(98, ((x - rect.left) / rect.width) * 100));
      before.style.width = pct + '%';
      handle.style.left  = pct + '%';
    };

    // Kezdeti pozíció
    before.style.width = '50%';
    handle.style.left  = '50%';

    // Egér
    handle.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    wrap.addEventListener('mousedown',   e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mouseup',   () => { dragging = false; });
    window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });

    // Érintés
    handle.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
    wrap.addEventListener('touchstart',   e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',   () => { dragging = false; });
    window.addEventListener('touchmove',  e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });

    // Automatikus bemutató animáció (egyszer, ha a felhasználó még nem húzta)
    let userTouched = false;
    wrap.addEventListener('mousedown', () => { userTouched = true; });
    wrap.addEventListener('touchstart', () => { userTouched = true; }, { passive: true });

    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || userTouched) return;
      // Animáció: 50% → 25% → 75% → 50%
      const steps = [50, 25, 75, 50];
      let si = 0;
      const next = () => {
        if (userTouched || si >= steps.length) return;
        const target = steps[si++];
        const start  = pct;
        const dur    = 800;
        const t0     = performance.now();
        const anim   = (now) => {
          if (userTouched) return;
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          pct = start + (target - start) * e;
          before.style.width = pct + '%';
          handle.style.left  = pct + '%';
          if (p < 1) requestAnimationFrame(anim);
          else setTimeout(next, 500);
        };
        requestAnimationFrame(anim);
      };
      setTimeout(next, 600);
      obs.unobserve(wrap);
    }, { threshold: 0.5 });
    obs.observe(wrap);
  });
}

/* ================================================
   21. MUNKAFOLYAMAT IDŐVONAL ANIMÁCIÓ
   ================================================ */
function initFolyamatTimeline() {
  const section = document.querySelector('.folyamat-section');
  if (!section) return;

  const laser   = section.querySelector('.folyamat-laser');
  const lepesek = section.querySelectorAll('.folyamat-lepes');

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;

    // Lézer vonal animálása
    if (laser) setTimeout(() => laser.classList.add('aktiv'), 200);

    // Lépések egymás után aktívvá válnak
    lepesek.forEach((lepes, i) => {
      setTimeout(() => {
        lepes.classList.add('aktiv');
        // Szám villanás
        const szam = lepes.querySelector('.folyamat-szam');
        if (szam) {
          szam.style.transform = 'scale(1.2)';
          setTimeout(() => { szam.style.transform = ''; }, 300);
        }
      }, 300 + i * 350);
    });

    obs.unobserve(section);
  }, { threshold: 0.3 });

  obs.observe(section);
}

/* ================================================
   INIT
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPageTransitions();
  initAOS();
  animateCounters();
  initFAQ();
  initLightbox();
  initCookies();
  initLaserCanvas();
  initTypewriter();
  initMagneticButtons();
  initCursorTrail();
  initGlitch();
  initStaggerCards();
  initHeroEntrance();
  initCardBorderAnim();
  initDividerAnim();
  initLaserScrollLine();
  initBASliders();
  initFolyamatTimeline();
});
