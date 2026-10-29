(() => {
  'use strict';

  function leaveIntro(event) {
    const button = event.target.closest('#enterExperience, #skipIntro');
    if (!button) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const intro = document.getElementById('intro');
    if (intro) {
      intro.style.setProperty('display', 'none', 'important');
      intro.style.setProperty('visibility', 'hidden', 'important');
      intro.style.setProperty('pointer-events', 'none', 'important');
      intro.setAttribute('aria-hidden', 'true');
    }

    document.body.classList.remove('intro-active');
    document.documentElement.classList.remove('intro-active');
  }

  document.addEventListener('click', leaveIntro, true);
})();
