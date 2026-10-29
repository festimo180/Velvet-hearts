(() => {
  const section = document.getElementById("secret-letter-2");
  if (!section || section.dataset.ready === "yes") return;
  section.dataset.ready = "yes";

  const openButton = section.querySelector("#sl-open");
  const letter = section.querySelector("#sl-letter");
  const hint = section.querySelector("#sl-hint");
  const replay = section.querySelector("#sl-replay");
  const copy = section.querySelector("#sl-copy");

  function openLetter() {
    section.classList.add("sl-open");
    openButton.setAttribute("aria-expanded", "true");
    letter.setAttribute("aria-hidden", "false");
    hint.textContent = "A little message, just for you. ♡";
    replay.hidden = false;

    window.setTimeout(() => {
      letter.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  }

  function resetLetter() {
    section.classList.remove("sl-open");
    openButton.setAttribute("aria-expanded", "false");
    letter.setAttribute("aria-hidden", "true");
    replay.hidden = true;
    hint.textContent = "A little surprise is waiting inside.";
    openButton.focus({ preventScroll: true });
  }

  openButton.addEventListener("click", openLetter);
  replay.addEventListener("click", resetLetter);

  copy.addEventListener("click", async () => {
    const message = section.querySelector("#sl-message").innerText +
      "\n\n" + section.querySelector(".sl-signature").innerText;

    try {
      await navigator.clipboard.writeText(message);
      copy.textContent = "Copied with love ✓";
    } catch {
      const area = document.createElement("textarea");
      area.value = message;
      area.setAttribute("readonly", "");
      Object.assign(area.style, {
        position: "fixed",
        opacity: "0",
        pointerEvents: "none"
      });
      document.body.append(area);
      area.select();

      let success = false;
      try {
        success = document.execCommand("copy");
      } catch {}

      area.remove();
      copy.textContent = success ? "Copied with love ✓" : "Select the letter text to copy";
    }

    window.setTimeout(() => {
      copy.textContent = "Copy this message ♡";
    }, 2200);
  });
})();
