(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    #vrm-widget.vrm-collapsed #vrm-panel {
      display: none !important;
    }
    #vrm-widget.vrm-collapsed {
      bottom: 18px !important;
    }
    #vrm-collapse-button {
      position: absolute;
      top: 7px;
      right: 8px;
      z-index: 10;
      width: 32px;
      height: 32px;
      border: 1px solid rgba(255,255,255,.55);
      border-radius: 50%;
      background: #581d36;
      color: #fff;
      font-size: 23px;
      cursor: pointer;
    }
    #vrm-widget #vrm-toggle {
      display: block;
      position: relative;
      z-index: 2;
    }
  `;
  document.head.appendChild(style);

  function setup() {
    const widget = document.getElementById('vrm-widget');
    const panel = document.getElementById('vrm-panel');
    const toggle = document.getElementById('vrm-toggle');

    if (!widget || !panel || !toggle) return;

    // Remove the extra floating restore button from older versions.
    document.querySelectorAll('#vrm-restore-button, .vrm-restore-button')
      .forEach(button => button.remove());

    // Keep the player button's label neutral: it opens the player,
    // while the Play button controls the actual music.
    toggle.textContent = '♫ Music';
    toggle.setAttribute('aria-label', 'Open or close music player');

    if (!panel.querySelector('#vrm-collapse-button')) {
      panel.style.position = 'relative';

      const collapse = document.createElement('button');
      collapse.id = 'vrm-collapse-button';
      collapse.type = 'button';
      collapse.textContent = '−';
      collapse.title = 'Collapse player (music keeps playing)';
      collapse.setAttribute('aria-label', 'Collapse music player');

      collapse.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        widget.classList.add('vrm-collapsed');
        panel.classList.remove('open');
        toggle.textContent = '♫ Music';
        toggle.setAttribute('aria-expanded', 'false');
      });

      panel.appendChild(collapse);
    }

    if (!toggle.dataset.singleMusicControl) {
      toggle.dataset.singleMusicControl = 'yes';

      // Replace the old conflicting open/close handler.
      toggle.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const wasCollapsed = widget.classList.contains('vrm-collapsed');
        const isOpen = panel.classList.contains('open');

        widget.classList.remove('vrm-collapsed');

        if (wasCollapsed || !isOpen) {
          panel.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        } else {
          panel.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.textContent = '♫ Music';
      }, true);
    }
  }

  function start() {
    setup();
    new MutationObserver(setup).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
