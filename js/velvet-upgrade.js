(() => {
  'use strict';

  let entering = false;

  async function enterMain() {
    if (entering) return;
    entering = true;

    const start = document.getElementById('vh-start');
    if (start) start.textContent = 'Opening your little world… ♡';

    try {
      const response = await fetch('home.html', { cache: 'no-store' });
      if (!response.ok) throw new Error('Could not load the main page.');

      const html = await response.text();
      const parsed = new DOMParser().parseFromString(html, 'text/html');

      // Load the main page's styles without navigating away.
      for (const link of parsed.querySelectorAll('link[rel="stylesheet"]')) {
        if (![...document.querySelectorAll('link[rel="stylesheet"]')]
          .some(existing => existing.href === new URL(link.href, location.href).href)) {
          const copy = document.createElement('link');
          copy.rel = 'stylesheet';
          copy.href = link.href;
          document.head.appendChild(copy);
        }
      }

      // Preserve the original audio, prompt, and music controls.
      const persistent = [
        document.getElementById('vh-background-audio'),
        document.getElementById('vh-music-invite'),
        document.querySelector('.vh-music-toggle')
      ].filter(Boolean);

      // Use the original main-page body, but do not replace the music player.
      document.body.replaceChildren(...[...parsed.body.childNodes]
        .filter(node => !(node.nodeType === 1 && node.tagName === 'SCRIPT'))
        .map(node => document.importNode(node, true)));

      persistent.forEach(node => document.body.appendChild(node));

      // Execute main-page scripts in their original order.
      const scripts = [...parsed.body.querySelectorAll('script')];
      for (const oldScript of scripts) {
        const src = oldScript.getAttribute('src');
        if (src && src.includes('music-optin.js')) continue;
        if (src && document.querySelector(`script[data-loaded-src="${src}"]`)) continue;

        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          if (src) {
            script.src = src;
            script.dataset.loadedSrc = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Could not load ' + src));
          } else {
            script.textContent = oldScript.textContent;
            resolve();
          }
          document.body.appendChild(script);
        });
      }

      // Load personalization and the new extras if the main page did not include them.
      for (const src of ['js/visitor-personalization.js', 'js/velvet-extras.js']) {
        if (!document.querySelector(`script[data-loaded-src="${src}"]`)) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.dataset.loadedSrc = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Could not load ' + src));
            document.body.appendChild(script);
          });
        }
      }

      document.title = parsed.title || 'Velvet Hearts';
      history.pushState({ velvetMain: true }, '', 'home.html');
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      alert('The main page could not load. Please check that the local website server is running.');
      if (start) start.textContent = 'Enter Velvet Hearts ♡';
      entering = false;
    }
  }

  document.addEventListener('click', event => {
    const start = event.target.closest('#vh-start');
    const skip = event.target.closest('.vh3d-exit');

    if (start) {
      event.preventDefault();
      const field = document.getElementById('vh-visitor-name');
      const name = field ? field.value.trim() : '';

      if (!name) {
        const error = document.getElementById('vh-name-error');
        if (error) error.style.display = 'block';
        if (field) field.focus();
        return;
      }

      try { localStorage.setItem('velvetVisitorName', name); } catch (e) {}
      enterMain();
    }

    if (skip) {
      event.preventDefault();
      enterMain();
    }
  });
})();
