(() => {
  const video = document.getElementById("anime-bg-video");
  const playBtn = document.getElementById("anime-play");
  const soundBtn = document.getElementById("anime-sound");
  const heartBtn = document.getElementById("anime-heart");
  const status = document.getElementById("anime-status");

  if (!video) return;

  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  const say = (message) => {
    if (status) status.textContent = message;
  };

  video.play().then(() => {
    if (playBtn) playBtn.textContent = "Ⅱ Pause scene";
  }).catch(() => {
    if (playBtn) playBtn.textContent = "▶ Play scene";
    say("Tap Play scene to start the moving background.");
  });

  playBtn?.addEventListener("click", async () => {
    if (video.paused) {
      try {
        await video.play();
        playBtn.textContent = "Ⅱ Pause scene";
        say("The background is moving again ♡");
      } catch {
        say("Couldn't start the video. Check the MP4 file.");
      }
    } else {
      video.pause();
      playBtn.textContent = "▶ Play scene";
      say("Paused for a little moment.");
    }
  });

  soundBtn?.addEventListener("click", async () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted
      ? "♫ Video sound: Off"
      : "♫ Video sound: On";
    soundBtn.setAttribute("aria-pressed", String(!video.muted));

    if (!video.muted) {
      try {
        await video.play();
        say("Video sound is on. It may overlap with your website music.");
      } catch {
        say("Tap Play scene to start the video.");
      }
    } else {
      say("The background is back in quiet mode ♡");
    }
  });

  heartBtn?.addEventListener("click", () => {
    const symbols = ["♡", "♥", "✧", "💗", "✦"];
    const layer = document.createElement("div");
    Object.assign(layer.style, {
      position: "fixed",
      inset: "0",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: "9999"
    });
    document.body.appendChild(layer);

    for (let i = 0; i < 12; i++) {
      const item = document.createElement("span");
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      Object.assign(item.style, {
        position: "absolute",
        left: `${5 + Math.random() * 90}%`,
        bottom: `${5 + Math.random() * 15}%`,
        color: "#ffd4e5",
        fontSize: `${18 + Math.random() * 22}px`,
        textShadow: "0 0 15px rgba(255,190,220,.8)",
        transition: "transform 2.6s ease, opacity 2.6s ease",
        opacity: "1"
      });
      layer.appendChild(item);
      requestAnimationFrame(() => {
        item.style.transform = `translateY(-${180 + Math.random() * 420}px) rotate(${Math.random() * 70 - 35}deg)`;
        item.style.opacity = "0";
      });
    }

    say("A little love, sent your way ♡");
    window.setTimeout(() => layer.remove(), 3000);
  });
})();
