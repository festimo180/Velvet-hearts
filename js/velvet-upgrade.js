(() => {
  'use strict';

  const start = document.getElementById('vh-start');
  const input = document.getElementById('vh-visitor-name');
  const error = document.getElementById('vh-name-error');

  if (!start || start.dataset.navigationFixed === 'true') return;
  start.dataset.navigationFixed = 'true';

  start.addEventListener('click', () => {
    const name = input ? input.value.trim().slice(0, 40) : '';

    if (!name) {
      if (error) error.style.display = 'block';
      if (input) input.focus();
      return;
    }

    try {
      localStorage.setItem('velvetVisitorName', name);
      sessionStorage.setItem('velvetVisitorName', name);
    } catch (_) {}

    start.disabled = true;
    window.location.assign('home.html');
  });
})();
