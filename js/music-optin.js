(() => {
  'use strict';

  const init = () => {
    if (document.getElementById('vh-music-invite')) return;

    const audio = document.createElement('audio');
    audio.id = 'vh-background-audio';
    audio.src = 'audio/velvet-background.mp3';
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0.45;
    document.body.appendChild(audio);

    const popup = document.createElement('div');
    popup.id = 'vh-music-invite';
    popup.className = 'music-invite';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'vh-music-title');

    popup.innerHTML = `
      <div class="music-invite-panel">
        <div class="music-invite-symbol" aria-hidden="true">♫</div>
        <p>VELVET HEARTS SOUNDTRACK</p>
        <h2 id="vh-music-title">Would you like some music with this moment?</h2>
        <p>Let a little music play softly in the background while you explore.</p>
        <div class="music-invite-actions">
          <button class="vh-music-yes" type="button">Yes, play music ♡</button>
          <button class="vh-music-no" type="button">No, thank you</button>
        </div>
      </div>`;

    document.body.appendChild(popup);

    const toggle = document.createElement('button');
    toggle.className = 'vh-music-toggle';
    toggle.type = 'button';
    toggle.textContent = '♫ Music: Off';
    toggle.setAttribute('aria-label', 'Play or pause background music');
    document.body.appendChild(toggle);

    const yes = popup.querySelector('.vh-music-yes');
    const no = popup.querySelector('.vh-music-no');

    const closePopup = () => {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
    };

    const playMusic = async () => {
      try {
        try { localStorage.setItem('velvetMusicChoice', 'yes'); } catch (e) {}
        await audio.play();
        toggle.textContent = '♫ Music: On';
        toggle.setAttribute('aria-pressed', 'true');
        closePopup();
      } catch (error) {
        toggle.textContent = '♫ Tap to retry';
        yes.textContent = 'Try playing music again';
        console.warn('Background audio could not start:', error);
      }
    };

    yes.addEventListener('click', playMusic);

    no.addEventListener('click', () => {
      audio.pause();
      try { localStorage.setItem('velvetMusicChoice', 'no'); } catch (e) {}
      toggle.textContent = '♫ Music: Off';
      closePopup();
    });

    toggle.addEventListener('click', async () => {
      if (audio.paused) {
        await playMusic();
      } else {
        audio.pause();
        toggle.textContent = '♫ Music: Off';
        toggle.setAttribute('aria-pressed', 'false');
      }
    });

    audio.addEventListener('ended', () => {
      toggle.textContent = '♫ Music: Off';
    });

    // Main page: never ask again. Restore music only after consent.
    if (location.pathname.endsWith('/home.html')) {
      try {
        if (localStorage.getItem('velvetMusicChoice') === 'yes') {
          audio.play().then(() => {
            toggle.textContent = '♫ Music: On';
            toggle.setAttribute('aria-pressed', 'true');
          }).catch(() => {
            toggle.textContent = '♫ Tap to play music';
          });
        }
      } catch (e) {}
      return;
    }

    // Ask on each intro visit; never force sound on the visitor.
    window.setTimeout(() => {
      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
    }, 700);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
