/**
 * JoMa-Tech Laser Clean — main.js
 */

/* ---- Sticky Header ---- */
const header = document.getElementById('site-header');
const backTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header && header.classList.add('scrolled');
    backTop && backTop.classList.add('visible');
  } else {
    header && header.classList.remove('scrolled');
    backTop && backTop.classList.remove('visible');
  }
}, { passive: true });

backTop && backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- Hamburger ---- */
const toggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.nav-mobile');

toggle && toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  mobileNav && mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav && mobileNav.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
  link.addEventListener('click', () => {
    toggle && toggle.classList.remove('open');
    mobileNav && mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Active nav link ---- */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ---- AOS (Animate on Scroll) — lightweight inline version ---- */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.aosDelay || 0;
        setTimeout(() => {
          el.classList.add('aos-animate');
        }, +delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => {
    el.classList.add('aos-init');
    observer.observe(el);
  });
}

/* Add inline AOS styles */
(function addAOSStyles() {
  const style = document.createElement('style');
  style.textContent = `
    [data-aos] { transition: opacity 0.7s ease, transform 0.7s ease; }
    [data-aos="fade-up"] { opacity: 0; transform: translateY(30px); }
    [data-aos="fade-up"].aos-animate { opacity: 1; transform: translateY(0); }
    [data-aos="fade-in"] { opacity: 0; }
    [data-aos="fade-in"].aos-animate { opacity: 1; }
    [data-aos="slide-right"] { opacity: 0; transform: translateX(-30px); }
    [data-aos="slide-right"].aos-animate { opacity: 1; transform: translateX(0); }
    [data-aos="slide-left"] { opacity: 0; transform: translateX(30px); }
    [data-aos="slide-left"].aos-animate { opacity: 1; transform: translateX(0); }
    [data-aos="zoom-in"] { opacity: 0; transform: scale(0.9); }
    [data-aos="zoom-in"].aos-animate { opacity: 1; transform: scale(1); }
  `;
  document.head.appendChild(style);
})();

/* ---- Counter animation ---- */
function animateCounters() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('hu-HU');
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ---- FAQ accordion ---- */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ---- Lightbox ---- */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;

  const lbImg = lb.querySelector('#lb-img');
  const items = document.querySelectorAll('.gallery-item');
  let current = 0;

  function open(idx) {
    current = idx;
    const img = items[idx].querySelector('img');
    if (img && lbImg) lbImg.src = img.src;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, idx) => {
    item.addEventListener('click', () => open(idx));
  });

  lb.querySelector('.lb-close') && lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev') && lb.querySelector('.lb-prev').addEventListener('click', prev);
  lb.querySelector('.lb-next') && lb.querySelector('.lb-next').addEventListener('click', next);

  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ---- Cookie Banner ---- */
function initCookies() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  if (!localStorage.getItem('jt_cookie_consent')) {
    banner.classList.add('show');
  }

  document.getElementById('cookie-accept') && document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('jt_cookie_consent', 'accepted');
    banner.classList.remove('show');
  });
  document.getElementById('cookie-reject') && document.getElementById('cookie-reject').addEventListener('click', () => {
    localStorage.setItem('jt_cookie_consent', 'rejected');
    banner.classList.remove('show');
  });
  document.getElementById('cookie-settings') && document.getElementById('cookie-settings').addEventListener('click', () => {
    window.location.href = 'cookie-tajekoztato.html';
  });
}

/* ---- Before/After slider (simple) ---- */
function initBASlider() {
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const afterEl = slider.querySelector('.ba-after');
    if (!handle || !afterEl) return;

    let dragging = false;
    const updatePos = (x) => {
      const rect = slider.getBoundingClientRect();
      let pct = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      afterEl.style.clipPath = `inset(0 ${(1 - pct) * 100}% 0 0)`;
      handle.style.left = `${pct * 100}%`;
    };

    handle.addEventListener('mousedown', () => { dragging = true; });
    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('mousemove', e => { if (dragging) updatePos(e.clientX); });
    handle.addEventListener('touchstart', () => { dragging = true; }, { passive: true });
    window.addEventListener('touchend', () => { dragging = false; });
    window.addEventListener('touchmove', e => {
      if (dragging) updatePos(e.touches[0].clientX);
    }, { passive: true });
    updatePos(slider.getBoundingClientRect().left + slider.offsetWidth * 0.5);
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  animateCounters();
  initFAQ();
  initLightbox();
  initCookies();
  initBASlider();
});
