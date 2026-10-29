(() => {
  if (window.__velvetMobileReady) return;
  window.__velvetMobileReady = true;

  const findTarget = (selectors) => {
    for (const selector of selectors) {
      const found = document.querySelector(selector);
      if (found) return found;
    }
    return null;
  };

  const items = [
    {
      label: "Home",
      icon: "⌂",
      target: () => document.querySelector("#top, #hero, .hero") || document.body
    },
    {
      label: "Memories",
      icon: "▧",
      target: () => findTarget([
        "#memory-world", "#memory-room", ".memory-room",
        ".memory-gallery", "#gallery", ".gallery"
      ])
    },
    {
      label: "Letter",
      icon: "♡",
      target: () => findTarget([
        "#secret-letter", ".secret-letter", "#letter", ".letter"
      ])
    },
    {
      label: "Music",
      icon: "♫",
      target: () => findTarget([
        "#soundtrack", "#music", ".music", ".soundtrack"
      ])
    }
  ];

  const nav = document.createElement("nav");
  nav.id = "velvet-app-nav";
  nav.setAttribute("aria-label", "Main navigation");

  const navLinks = [];

  items.forEach((item) => {
    const target = item.target();
    if (!target) return;

    if (!target.id) {
      target.id = "vh-section-" + item.label.toLowerCase();
    }

    const link = document.createElement("a");
    link.href = "#" + target.id;
    link.innerHTML =
      `<span class="vh-nav-icon" aria-hidden="true">${item.icon}</span>` +
      `<span>${item.label}</span>`;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", "#" + target.id);
      setActive(link);
    });

    nav.appendChild(link);
    navLinks.push({ link, target });
  });

  const noteButton = document.createElement("button");
  noteButton.type = "button";
  noteButton.innerHTML =
    '<span class="vh-nav-icon" aria-hidden="true">✧</span><span>Note</span>';
  noteButton.setAttribute("aria-label", "Open today's love note");
  nav.appendChild(noteButton);

  document.body.appendChild(nav);

  function setActive(activeLink) {
    navLinks.forEach(({ link }) => {
      if (link === activeLink) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const match = navLinks.find(({ target }) => target === visible.target);
        if (match) setActive(match.link);
      }
    }, { rootMargin: "-15% 0px -55% 0px", threshold: [0, .1, .3] });

    navLinks.forEach(({ target }) => observer.observe(target));
  }

  // A rotating set of messages. It does not send anything to a server.
  const notes = [
    "You deserve a love that feels peaceful, honest, and safe.",
    "May someone always notice the little things that make you special.",
    "You do not have to be perfect to be deeply appreciated.",
    "I hope today's ordinary moments become tomorrow's favourite memories.",
    "You deserve flowers, reassurance, effort, laughter, and genuine care.",
    "Never forget that your heart deserves the same kindness you give others.",
    "Some people make life feel softer just by being themselves.",
    "May you always have a reason to smile when you look at your phone.",
    "A little reminder: you are worthy of patience, respect, and affection.",
    "The right kind of love should feel like comfort, not confusion.",
    "May life surprise you with the kind of happiness you once only imagined.",
    "You deserve conversations that last, laughter that hurts, and memories that stay.",
    "Even on a difficult day, there is still room for a beautiful little moment.",
    "Let yourself be loved without feeling you must earn every bit of it.",
    "May the people around you celebrate your growth, not just your success.",
    "A soft heart is not a weakness. Keep your kindness, and protect your peace.",
    "Here's your permission to slow down and enjoy the moment you're in.",
    "The smallest acts of care can become the biggest memories.",
    "I hope somebody makes you feel chosen, considered, and appreciated.",
    "Today, give yourself some of the love you so freely give to others.",
    "You are allowed to grow, change, start again, and still be wonderful.",
    "May your future hold genuine affection and reasons to laugh every day.",
    "Some moments do not need a perfect picture. They just need to be felt.",
    "A little love note for you: your presence can make a difference.",
    "Keep making room for joy, beautiful surprises, and new beginnings.",
    "You deserve consistency, not just sweet words on special occasions.",
    "May you find beauty in the quiet moments nobody else notices.",
    "Let this be a reminder to choose yourself with kindness, too.",
    "There is something special about being understood without pretending.",
    "Take a breath. You have made it through so much already.",
    "May your next chapter be full of peace, progress, and real love."
  ];

  const today = new Date();
  const dayIndex = Math.floor(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) /
    86400000
  ) % notes.length;

  function closeSheet(backdrop) {
    backdrop?.remove();
    noteButton.focus();
  }

  function openNote() {
    if (document.getElementById("vh-note-backdrop")) return;

    const backdrop = document.createElement("div");
    backdrop.id = "vh-note-backdrop";

    const sheet = document.createElement("section");
    sheet.id = "vh-note-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-modal", "true");
    sheet.setAttribute("aria-labelledby", "vh-note-title");

    const eyebrow = document.createElement("p");
    eyebrow.textContent = "A LITTLE REMINDER ♡";
    eyebrow.style.letterSpacing = ".17em";
    eyebrow.style.fontSize = ".7rem";

    const title = document.createElement("h2");
    title.id = "vh-note-title";
    title.textContent = "A note for your heart";

    const message = document.createElement("p");
    message.id = "vh-note-message";
    message.textContent = notes[dayIndex];

    const actions = document.createElement("div");
    actions.className = "vh-note-actions";

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";

    const share = document.createElement("button");
    share.type = "button";
    share.className = "vh-note-primary";
    share.textContent = "Share this note";

    close.addEventListener("click", () => closeSheet(backdrop));

    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeSheet(backdrop);
    });

    share.addEventListener("click", async () => {
      const text = `${notes[dayIndex]} — Velvet Hearts`;

      try {
        if (navigator.share) {
          await navigator.share({ title: "A note for your heart", text });
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          share.textContent = "Copied ♡";
        } else {
          const area = document.createElement("textarea");
          area.value = text;
          area.readOnly = true;
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          const copied = document.execCommand("copy");
          area.remove();
          share.textContent = copied ? "Copied ♡" : "Select the note to copy";
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          share.textContent = "Try sharing again";
        }
      }
    });

    actions.append(close, share);
    sheet.append(eyebrow, title, message, actions);
    backdrop.appendChild(sheet);
    document.body.appendChild(backdrop);
    close.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        closeSheet(backdrop);
        document.removeEventListener("keydown", onKey);
      }
    };
    document.addEventListener("keydown", onKey, { once: true });
  }

  noteButton.addEventListener("click", openNote);

  console.log("Velvet Hearts mobile navigation ready.");
})();
