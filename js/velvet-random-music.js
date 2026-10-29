(() => {
  'use strict';
  if (window.__velvetRandomMusicLoaded) return;
  window.__velvetRandomMusicLoaded = true;

  const tracks = [
    { title: 'Ordinary', artist: 'Alex Warren', file: 'audio/velvet-background.mp3' },
    { title: 'Someone You Loved', artist: 'Lewis Capaldi', file: 'audio/someone-you-loved.mp3' },
    { title: 'Dandelions', artist: 'Ruth B.', file: 'audio/dandelions.mp3' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    #vrm-widget{position:fixed;right:14px;bottom:92px;z-index:99990;
      width:min(310px,calc(100vw - 28px));color:#fff1f6;
      font:14px/1.4 system-ui,sans-serif}
    #vrm-toggle{display:block;margin-left:auto;border:1px solid #e8b5ca;
      border-radius:28px;padding:12px 17px;background:#54152f;color:#fff;
      box-shadow:0 5px 24px #0005;font:inherit;cursor:pointer}
    #vrm-panel{display:none;margin-top:8px;padding:16px;border-radius:18px;
      background:linear-gradient(145deg,#260b19,#54152f);
      border:1px solid #b76a8b;box-shadow:0 10px 30px #0005}
    #vrm-panel.open{display:block}
    #vrm-title{font-weight:700;font-size:16px}
    #vrm-artist,#vrm-status{font-size:12px;opacity:.8;margin-top:4px}
    #vrm-controls{display:flex;align-items:center;justify-content:center;
      gap:12px;margin:14px 0}
    #vrm-widget button,#vrm-select{font:inherit;cursor:pointer}
    #vrm-controls button{border:1px solid #d69ab4;border-radius:30px;
      padding:9px 12px;color:white;background:#692044}
    #vrm-play{min-width:48px;background:#b42c68!important}
    #vrm-select{width:100%;padding:10px;border-radius:12px;
      color:#fff;background:#411329;border:1px solid #b76a8b}
    #vrm-widget input[type=range]{width:100%;accent-color:#ed9bc0}
    #vrm-times{display:flex;justify-content:space-between;font-size:11px}
  `;
  document.head.appendChild(style);

  const widget = document.createElement('div');
  widget.id = 'vrm-widget';
  widget.innerHTML = `
    <button id="vrm-toggle" type="button" aria-expanded="false">♫ Music off</button>
    <div id="vrm-panel">
      <div id="vrm-title">Velvet Hearts soundtrack</div>
      <div id="vrm-artist">Choose your mood ♡</div>
      <div id="vrm-controls">
        <button id="vrm-prev" type="button" aria-label="Previous track">⏮</button>
        <button id="vrm-play" type="button" aria-label="Play or pause">▶</button>
        <button id="vrm-next" type="button" aria-label="Next track">⏭</button>
      </div>
      <select id="vrm-select" aria-label="Choose song"></select>
      <div style="margin-top:12px">
        <input id="vrm-seek" type="range" min="0" max="100" value="0" aria-label="Song progress">
        <div id="vrm-times"><span id="vrm-now">0:00</span><span id="vrm-end">0:00</span></div>
      </div>
      <div id="vrm-status" role="status">Checking available audio…</div>
    </div>
    <audio id="vrm-audio" preload="none" playsinline></audio>
  `;
  document.body.appendChild(widget);

  const $ = id => document.getElementById(id);
  const audio = $('vrm-audio');
  const panel = $('vrm-panel');
  const toggle = $('vrm-toggle');
  const playButton = $('vrm-play');
  const select = $('vrm-select');
  const status = $('vrm-status');
  let available = [];
  let current = 0;
  let enabled = false;
  let busy = false;

  const say = message => { status.textContent = message; };
  const fmt = n => Number.isFinite(n)
    ? `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2,'0')}`
    : '0:00';

  async function checkFile(file) {
    try {
      const response = await fetch(file, { method: 'HEAD', cache: 'no-store' });
      return response.ok && Number(response.headers.get('content-length') || 1) > 0;
    } catch (_) {
      return false;
    }
  }

  function renderTracks() {
    select.replaceChildren();
    available.forEach((track, i) => {
      const option = document.createElement('option');
      option.value = String(i);
      option.textContent = `${track.title} — ${track.artist}`;
      select.appendChild(option);
    });
  }

  function updateTrackInfo() {
    const track = available[current];
    if (!track) return;
    $('vrm-title').textContent = track.title;
    $('vrm-artist').textContent = track.artist;
    select.value = String(current);
  }

  async function playCurrent() {
    if (!enabled || !available.length || busy) return;
    busy = true;
    try {
      const track = available[current];
      if (audio.getAttribute('src') !== track.file) {
        audio.src = track.file;
        audio.load();
      }
      await audio.play();
      playButton.textContent = 'Ⅱ';
      say('Now playing ♡');
    } catch (_) {
      playButton.textContent = '▶';
      say('Playback was blocked. Tap play to try again.');
    } finally {
      busy = false;
    }
  }

  async function chooseTrack(index, autoplay) {
    if (!available.length) return;
    current = (index + available.length) % available.length;
    updateTrackInfo();
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    $('vrm-seek').value = '0';
    $('vrm-now').textContent = '0:00';
    $('vrm-end').textContent = '0:00';
    playButton.textContent = '▶';
    if (autoplay && enabled) await playCurrent();
  }

  async function switchOn() {
    if (!available.length) {
      say('No audio files found. Add authorised MP3 files to the audio folder.');
      return;
    }
    enabled = true;
    toggle.textContent = '♫ Music on';
    const random = Math.floor(Math.random() * available.length);
    await chooseTrack(random, false);
    await playCurrent();
  }

  toggle.addEventListener('click', async () => {
    panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(panel.classList.contains('open')));
    if (!enabled) {
      await switchOn();
    } else {
      enabled = false;
      audio.pause();
      playButton.textContent = '▶';
      toggle.textContent = '♫ Music off';
      say('Music paused');
    }
  });

  playButton.addEventListener('click', async () => {
    if (!enabled) {
      await switchOn();
    } else if (audio.paused) {
      await playCurrent();
    } else {
      audio.pause();
      playButton.textContent = '▶';
      say('Music paused');
    }
  });

  $('vrm-next').addEventListener('click', () => chooseTrack(current + 1, true));
  $('vrm-prev').addEventListener('click', () => chooseTrack(current - 1, true));
  select.addEventListener('change', () => chooseTrack(Number(select.value), true));

  audio.addEventListener('loadedmetadata', () => {
    $('vrm-end').textContent = fmt(audio.duration);
  });
  audio.addEventListener('timeupdate', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      $('vrm-seek').value = String(audio.currentTime / audio.duration * 100);
      $('vrm-now').textContent = fmt(audio.currentTime);
    }
  });
  $('vrm-seek').addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Number($('vrm-seek').value) / 100 * audio.duration;
    }
  });
  audio.addEventListener('ended', () => {
    if (available.length > 1) chooseTrack(current + 1, true);
    else if (available.length === 1) playCurrent();
  });
  audio.addEventListener('error', () => {
    playButton.textContent = '▶';
    say('This track could not be played. Choose another available track.');
  });

  (async () => {
    const checks = await Promise.all(tracks.map(async track => ({
      ...track, exists: await checkFile(track.file)
    })));
    available = checks.filter(track => track.exists);
    renderTracks();

    if (!available.length) {
      say('No audio files found in audio/. Add authorised MP3 files.');
      toggle.textContent = '♫ Music unavailable';
      return;
    }

    current = 0;
    updateTrackInfo();
    say(available.length === 1
      ? '1 track ready. Add the other two audio files to complete your playlist.'
      : `${available.length} tracks ready. Music starts when you switch it on.`);
  })();
})();
