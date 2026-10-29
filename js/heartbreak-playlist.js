(() => {
  if (document.getElementById('vh-heartbreak-playlist')) return;

  const songs = [
    {
      title: 'Someone You Loved',
      artist: 'Lewis Capaldi',
      id: 'zABLecsR5UE'
    },
    {
      title: 'Dandelions',
      artist: 'Ruth B.',
      id: 'W8a4sUabCUo'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    #vh-heartbreak-playlist {
      margin: 32px auto;
      padding: 24px 16px;
      width: min(900px, 100%);
      box-sizing: border-box;
      color: #fff0f5;
      background: linear-gradient(145deg, #260b19, #50132f);
      border: 1px solid #a75b7d;
      border-radius: 22px;
      font-family: inherit;
    }
    #vh-heartbreak-playlist h2 {
      text-align: center;
      margin: 0 0 8px;
    }
    #vh-heartbreak-playlist .vh-playlist-subtitle {
      text-align: center;
      opacity: .8;
      margin-bottom: 20px;
    }
    #vh-heartbreak-playlist .vh-track-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 18px;
    }
    #vh-heartbreak-playlist button {
      border: 1px solid #e6a4c0;
      background: #351022;
      color: white;
      border-radius: 30px;
      padding: 11px 16px;
      font: inherit;
      cursor: pointer;
    }
    #vh-heartbreak-playlist button.active {
      background: #a51f59;
    }
    #vh-heartbreak-playlist iframe {
      display: block;
      width: 100%;
      aspect-ratio: 16 / 9;
      border: 0;
      border-radius: 14px;
    }
    #vh-heartbreak-playlist .vh-track-name {
      text-align: center;
      margin: 14px 0;
      font-weight: 600;
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'vh-heartbreak-playlist';
  section.innerHTML = `
    <h2>♡ Love, Longing & Heartbreak ♡</h2>
    <p class="vh-playlist-subtitle">
      For the feelings words cannot explain.
    </p>
    <div class="vh-track-buttons"></div>
    <div class="vh-track-name" aria-live="polite"></div>
    <iframe
      title="Velvet Hearts music player"
      src="https://www.youtube-nocookie.com/embed/zABLecsR5UE"
      allow="encrypted-media; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  `;

  const buttons = section.querySelector('.vh-track-buttons');
  const name = section.querySelector('.vh-track-name');
  const player = section.querySelector('iframe');

  function selectSong(song, button) {
    player.src = `https://www.youtube-nocookie.com/embed/${song.id}`;
    name.textContent = `${song.title} — ${song.artist}`;
    buttons.querySelectorAll('button').forEach(b =>
      b.classList.toggle('active', b === button)
    );
  }

  songs.forEach((song, index) => {
    const button = document.createElement('button');
    button.textContent = song.title;
    button.type = 'button';
    button.addEventListener('click', () => selectSong(song, button));
    buttons.appendChild(button);
    if (index === 0) selectSong(song, button);
  });

  const target =
    document.querySelector('#finale') ||
    document.querySelector('main') ||
    document.body;

  target.parentNode.insertBefore(section, target);
})();
