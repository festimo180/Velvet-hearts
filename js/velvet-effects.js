(() => {
  if (window.__velvetEffectsStarted) return;
  window.__velvetEffectsStarted = true;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Keep the background video silent, looping, and playing automatically.
  const video = document.getElementById("anime-bg-video");
  if (video) {
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.play().catch(() => {
      // Some mobile browsers require a user gesture before autoplay.
    });
  }

  // Floating petals and tiny stars across the whole website.
  const particleLayer = document.getElementById("velvet-particles");
  if (particleLayer && !reducedMotion) {
    const symbols = ["✧", "♡", "·", "✦", "✧"];
    const createParticle = () => {
      if (!document.hidden && particleLayer.childElementCount < 18) {
        const particle = document.createElement("span");
        particle.className = "velvet-particle";
        particle.textContent =
          symbols[Math.floor(Math.random() * symbols.length)];

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.fontSize = `${10 + Math.random() * 14}px`;
        particle.style.animationDuration = `${9 + Math.random() * 10}s`;
        particleLayer.appendChild(particle);

        window.setTimeout(() => particle.remove(), 20000);
      }
    };

    for (let i = 0; i < 9; i++) {
      window.setTimeout(createParticle, i * 500);
    }
    window.setInterval(createParticle, 1100);
  }

  // Reveal sections as they enter the screen.
  const sections = document.querySelectorAll(
    "main > section, body > section, #memory-room, .memory-room, .memory-gallery"
  );

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("velvet-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    sections.forEach((section) => {
      if (
        section.id !== "anime-corner" &&
        !section.classList.contains("velvet-reveal")
      ) {
        section.classList.add("velvet-reveal");
      }
      observer.observe(section);
    });
  }

  // Make existing gallery images expandable without changing their sources.
  const galleryImages = document.querySelectorAll(
    "#memory-room img, .memory-room img, .memory-gallery img, .gallery img"
  );

  function closeLightbox(lightbox) {
    lightbox?.remove();
    document.removeEventListener("keydown", onEscape);
  }

  let activeLightbox = null;

  function onEscape(event) {
    if (event.key === "Escape" && activeLightbox) {
      closeLightbox(activeLightbox);
      activeLightbox = null;
    }
  }

  galleryImages.forEach((img) => {
    img.addEventListener("click", (event) => {
      if (!img.src) return;
      event.preventDefault();

      activeLightbox?.remove();

      const lightbox = document.createElement("div");
      lightbox.className = "velvet-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-label", "Expanded memory photo");

      const enlarged = document.createElement("img");
      enlarged.src = img.currentSrc || img.src;
      enlarged.alt = img.alt || "A special memory";

      const close = document.createElement("button");
      close.className = "velvet-lightbox-close";
      close.type = "button";
      close.textContent = "×";
      close.setAttribute("aria-label", "Close photo");

      close.addEventListener("click", () => {
        closeLightbox(lightbox);
        activeLightbox = null;
      });

      lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
          closeLightbox(lightbox);
          activeLightbox = null;
        }
      });

      lightbox.append(enlarged, close);
      document.body.appendChild(lightbox);
      activeLightbox = lightbox;
      document.addEventListener("keydown", onEscape);
      close.focus();
    });
  });

  // Keep the existing letter-opening behaviour and add a small sparkle burst.
  const letterTriggers = document.querySelectorAll(
    'a[href*="letter"], button[id*="letter"], ' +
    '#secret-letter button, .secret-letter button, ' +
    'button[aria-controls*="letter"]'
  );

  letterTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      if (reducedMotion) return;

      const burst = document.createElement("div");
      Object.assign(burst.style, {
        position: "fixed",
        inset: "0",
        zIndex: "9998",
        pointerEvents: "none",
        overflow: "hidden"
      });

      ["✧", "♡", "✦", "·", "♡", "✧"].forEach((symbol, index) => {
        const item = document.createElement("span");
        item.textContent = symbol;
        Object.assign(item.style, {
          position: "absolute",
          left: `${18 + index * 12}%`,
          top: `${55 + (index % 3) * 8}%`,
          color: "#f7cbdc",
          fontSize: `${16 + index * 2}px`,
          textShadow: "0 0 16px rgba(255,190,220,.8)",
          transition: "transform 1.5s ease, opacity 1.5s ease"
        });
        burst.appendChild(item);
        requestAnimationFrame(() => {
          item.style.transform =
            `translateY(-${100 + index * 24}px) rotate(${index * 25}deg)`;
          item.style.opacity = "0";
        });
      });

      document.body.appendChild(burst);
      window.setTimeout(() => burst.remove(), 1800);
    });
  });

  console.log("Velvet Hearts cinematic effects loaded.");
})();
