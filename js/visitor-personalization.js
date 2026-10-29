(() => {
  'use strict';

  let name = '';
  try {
    name = (localStorage.getItem('velvetVisitorName') || '').trim();
  } catch (e) {}

  // The name is requested only on the opening screen.
  const form = document.getElementById('nameForm');
  if (form) form.remove();

  // Keep the final chapter working even if storage is unavailable.
  const displayName = name || 'darling';
  const area = document.getElementById('questionArea');
  const title = document.getElementById('personalTitle');

  if (area) area.hidden = false;
  if (title) title.textContent = `Alright, ${displayName}...`;

  if (area) {
    const question = area.querySelector('p:not(.eyebrow)');
    if (question) {
      question.textContent = name
        ? `${name}, will you be my girlfriend?`
        : 'Will you be my girlfriend?';
    }
  }

  document.querySelectorAll('[data-visitor-name]').forEach(el => {
    el.textContent = displayName;
  });
})();
