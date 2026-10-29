(() => {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzEtz1wO9rfrVCImB2Gl_x0o2TsYuBObCyAop64KCdx7UFP2_ySuPbglfnitKAfkbm1/exec';
  const KEY = 'velvetVisitorName';

  function saveName(value) {
    const name = (value || '').trim().slice(0, 40);
    if (!name) return '';
    try {
      localStorage.setItem(KEY, name);
    } catch (_) {}
    return name;
  }

  // Save the name entered on the cinematic opening screen.
  const nameInput = document.getElementById('vh-visitor-name');
  const startButton = document.getElementById('vh-start');

  if (nameInput) {
    nameInput.addEventListener('input', () => saveName(nameInput.value));
  }

  if (startButton && nameInput) {
    startButton.addEventListener('click', () => saveName(nameInput.value), true);
  }

  // Connect the final YES/NO answers to the existing email service.
  document.addEventListener('click', event => {
    const button = event.target.closest('#yesButton, #noButton');
    if (!button) return;

    let name = '';
    try {
      name = (localStorage.getItem(KEY) || '').trim();
    } catch (_) {}

    if (!name) {
      const field = document.getElementById('visitorName');
      if (field) name = field.value.trim();
    }

    const answer = button.id === 'yesButton' ? 'YES' : 'NO';

    let frame = document.getElementById('vhResponseFrame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.name = 'vhResponseFrame';
      frame.id = 'vhResponseFrame';
      frame.hidden = true;
      frame.title = 'Response submission';
      document.body.appendChild(frame);
    }

    let form = document.getElementById('vhResponseForm');
    if (!form) {
      form = document.createElement('form');
      form.id = 'vhResponseForm';
      form.method = 'POST';
      form.target = 'vhResponseFrame';
      form.hidden = true;

      for (const fieldName of ['visitorName', 'answer', 'page']) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = fieldName;
        input.id = 'vhResponse_' + fieldName;
        form.appendChild(input);
      }
      document.body.appendChild(form);
    }

    document.getElementById('vhResponse_visitorName').value = name || 'Anonymous';
    document.getElementById('vhResponse_answer').value = answer;
    document.getElementById('vhResponse_page').value = 'Velvet Hearts';

    form.action = ENDPOINT;

    const notice = document.getElementById('formNotice');
    if (notice) notice.textContent = 'Sending your response…';

    try {
      form.submit();
      if (notice) {
        notice.textContent = 'Your response is being submitted. Thank you ♡';
      }
    } catch (_) {
      if (notice) {
        notice.textContent = 'We could not submit your response. Please try again.';
      }
    }
  }, true);
})();
