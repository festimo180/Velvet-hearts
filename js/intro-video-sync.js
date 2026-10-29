(() => {
  'use strict';

  const init = () => {
    const video = document.querySelector('.vh3d-video');
    const copy = document.querySelector('.vh3d-copy');

    if (!video || !copy) return;

    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      copy.style.visibility = 'visible';
      copy.style.opacity = '1';
    };

    copy.style.visibility = 'hidden';
    copy.style.opacity = '0';
    copy.style.transition = 'opacity 450ms ease';

    video.addEventListener('playing', reveal, { once: true });
    video.addEventListener('error', reveal, { once: true });

    if (!video.paused && video.readyState >= 3) reveal();
    video.play().catch(() => reveal());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
