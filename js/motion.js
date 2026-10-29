(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function startMotion() {
    if (document.querySelector('.motion-atmosphere')) return;

    const bg = document.createElement('div');
    bg.className = 'motion-atmosphere';
    bg.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 6; i++) {
      const orb = document.createElement('span');
      orb.className = 'motion-orb';
      orb.style.cssText =
        `--orb-x:${i * 20}%;--orb-y:${(i % 3) * 30}%;` +
        `--orb-size:${220 + i * 65}px;--orb-speed:${10 + i * 3}s`;
      bg.appendChild(orb);
    }

    if (!reduced) {
      for (let i = 0; i < 38; i++) {
        const particle = document.createElement('span');
        particle.className = 'motion-particle';
        particle.style.cssText =
          `--px:${Math.random() * 100}%;` +
          `--ps:${2 + Math.random() * 5}px;` +
          `--pd:${10 + Math.random() * 12}s;` +
          `--delay:${-Math.random() * 22}s`;
        bg.appendChild(particle);
      }
    }

    document.body.prepend(bg);

    const targets = document.querySelectorAll(
      'section, article, .card, .gallery-item, .music-card, ' +
      '.glass-card, .feature-card, .letter, .story, .finale'
    );

    targets.forEach(el => {
      if (!el.classList.contains('motion-reveal')) {
        el.classList.add('motion-reveal');
      }
    });

    if ('IntersectionObserver' in window && !reduced) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      document.querySelectorAll('.motion-reveal').forEach(el => {
        observer.observe(el);
      });
    } else {
      document.querySelectorAll('.motion-reveal').forEach(el => {
        el.classList.add('motion-visible');
      });
    }

    document.querySelectorAll('h1').forEach(el => {
      el.classList.add('motion-heading');
    });

    if (!reduced && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      document.querySelectorAll(
        '.card, article, .gallery-item, .music-card, .glass-card'
      ).forEach(card => {
        card.classList.add('motion-card');

        card.addEventListener('pointermove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5;
          const y = (e.clientY - r.top) / r.height - .5;
          card.style.transform =
            `perspective(900px) rotateX(${-y * 9}deg) ` +
            `rotateY(${x * 9}deg) translateY(-6px)`;
        });

        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMotion, { once: true });
  } else {
    startMotion();
  }

  /* VH HERO ROTATION HOOK */
  function attachHeroRotation() {
    const img = document.querySelector(
      'main img, .hero img, .hero-visual img, .hero-art img'
    );
    if (!img) return;

    const frame = img.closest(
      '.hero-visual, .hero-art, .hero-image, .hero-card, figure'
    ) || img.parentElement;

    if (frame && !frame.classList.contains('vh-hero-rotator')) {
      frame.classList.add('vh-hero-rotator');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHeroRotation, {once:true});
  } else {
    attachHeroRotation();
  }

})();
