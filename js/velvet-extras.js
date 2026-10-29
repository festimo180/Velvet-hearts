(() => {
  'use strict';

  if (document.getElementById('velvet-extras')) return;

  const extras = document.createElement('section');
  extras.id = 'velvet-extras';
  extras.className = 'section-shell section-space';
  extras.innerHTML = `
    <div class="vx-card">
      <p class="vx-eyebrow">A LITTLE LOVE NOTE</p>
      <h2>A letter, <em>just for you.</em></h2>
      <p class="vx-intro">Some feelings deserve a little envelope.</p>
      <button class="vx-button" id="vx-open-letter" type="button">Open your letter 💌</button>
      <div id="vx-letter" class="vx-letter" hidden>
        <div class="vx-letter-paper">
          <span class="vx-letter-heart">♡</span>
          <p>Dear you,</p>
          <p>May you always find little reasons to smile, gentle moments to rest, and people who make you feel appreciated just as you are.</p>
          <p>And may this tiny corner of the internet leave a little warmth in your day.</p>
          <p class="vx-signature">With love, Velvet Hearts ♡</p>
        </div>
      </div>
    </div>

    <div class="vx-card vx-stars-card">
      <p class="vx-eyebrow">MAKE A LITTLE WISH</p>
      <h2>Tell a star <em>your dream.</em></h2>
      <p class="vx-intro">Write a wish, then send it into the night sky.</p>
      <form id="vx-wish-form">
        <input id="vx-wish" maxlength="160" placeholder="My little wish is…" aria-label="Your wish" required>
        <button class="vx-button" type="submit">Send my wish ✦</button>
      </form>
      <p id="vx-wish-result" class="vx-wish-result" aria-live="polite"></p>
      <div id="vx-sky" class="vx-sky" aria-hidden="true"></div>
    </div>
  `;
  const anchor = document.querySelector('.countdown');
  if (anchor) anchor.before(extras);
  else document.body.appendChild(extras);

  extras.querySelector('#vx-open-letter').addEventListener('click', event => {
    const letter = extras.querySelector('#vx-letter');
    letter.hidden = !letter.hidden;
    event.currentTarget.textContent = letter.hidden
      ? 'Open your letter 💌'
      : 'Keep this letter close ♡';
  });

  extras.querySelector('#vx-wish-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = extras.querySelector('#vx-wish');
    const result = extras.querySelector('#vx-wish-result');
    const sky = extras.querySelector('#vx-sky');
    const wish = input.value.trim();
    if (!wish) return;

    const star = document.createElement('span');
    star.className = 'vx-launched-star';
    star.textContent = '✦';
    sky.appendChild(star);

    result.textContent = 'Your wish has been sent into the stars. Keep believing in beautiful possibilities. ♡';
    input.value = '';
  });
})();
