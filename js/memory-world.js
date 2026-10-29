(() => {
  const section = document.getElementById("memory-world");
  if (!section || section.dataset.ready === "yes") return;
  section.dataset.ready = "yes";

  const status = section.querySelector(".mw-status");
  const prefix = "velvet-hearts-memory-";

  function say(message) {
    if (status) status.textContent = message;
  }

  function loadMemory(card) {
    const id = card.dataset.memory;
    const art = card.querySelector(".mw-art");
    const caption = card.querySelector(".mw-caption");
    const date = card.querySelector(".mw-date");

    try {
      const saved = localStorage.getItem(prefix + id);
      if (!saved) return;

      const data = JSON.parse(saved);
      caption.value = data.caption || "";
      date.value = data.date || "";

      if (data.image) {
        const img = document.createElement("img");
        img.alt = data.caption || "Saved memory";
        img.src = data.image;
        art.replaceChildren(img);
        img.addEventListener("click", () => openImage(img.src, img.alt));
      }
    } catch {
      say("This memory could not be loaded. You can replace it with a new one.");
    }
  }

  function saveMemory(card, imageData) {
    const id = card.dataset.memory;
    const caption = card.querySelector(".mw-caption").value.trim();
    const date = card.querySelector(".mw-date").value;
    let old = {};

    try {
      old = JSON.parse(localStorage.getItem(prefix + id) || "{}");
    } catch {}

    const data = {
      caption,
      date,
      image: imageData === undefined ? (old.image || "") : imageData
    };

    try {
      localStorage.setItem(prefix + id, JSON.stringify(data));
      say("Memory saved on this device ♡");
    } catch {
      say("Storage is full. Try a smaller photo.");
    }
  }

  function openImage(src, alt) {
    const lightbox = document.createElement("div");
    Object.assign(lightbox.style, {
      position: "fixed",
      inset: "0",
      zIndex: "10020",
      display: "grid",
      placeItems: "center",
      padding: "20px",
      background: "rgba(15,5,15,.94)"
    });

    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    Object.assign(img.style, {
      maxWidth: "95%",
      maxHeight: "85%",
      objectFit: "contain",
      borderRadius: "14px"
    });

    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close photo");
    Object.assign(close.style, {
      position: "absolute",
      top: "18px",
      right: "18px",
      width: "46px",
      height: "46px",
      borderRadius: "50%",
      border: "1px solid #e8c2d2",
      background: "#32142c",
      color: "#fff",
      fontSize: "28px"
    });

    close.addEventListener("click", () => lightbox.remove());
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) lightbox.remove();
    });
    lightbox.append(img, close);
    document.body.append(lightbox);
  }

  section.querySelectorAll(".mw-card").forEach(card => {
    const caption = card.querySelector(".mw-caption");
    const date = card.querySelector(".mw-date");
    const art = card.querySelector(".mw-art");
    const add = card.querySelector(".mw-add");
    const clear = card.querySelector(".mw-remove");

    loadMemory(card);

    caption.addEventListener("change", () => saveMemory(card));
    date.addEventListener("change", () => saveMemory(card));

    add.addEventListener("click", () => {
      const picker = document.createElement("input");
      picker.type = "file";
      picker.accept = "image/jpeg,image/png,image/webp";
      picker.setAttribute("aria-label", "Choose a memory photo");

      picker.addEventListener("change", () => {
        const file = picker.files && picker.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          say("Please choose an image.");
          return;
        }

        if (file.size > 12 * 1024 * 1024) {
          say("That photo is over 12 MB. Choose a smaller image.");
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          const source = new Image();
          source.onload = () => {
            const maxDimension = 1000;
            const scale = Math.min(
              1, maxDimension / Math.max(source.width, source.height)
            );
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(source.width * scale);
            canvas.height = Math.round(source.height * scale);

            const ctx = canvas.getContext("2d");
            ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
            const compressed = canvas.toDataURL("image/jpeg", .78);

            const img = document.createElement("img");
            img.src = compressed;
            img.alt = caption.value.trim() || "Saved memory";
            art.replaceChildren(img);
            img.addEventListener("click", () => openImage(img.src, img.alt));

            saveMemory(card, compressed);
          };

          source.onerror = () => say("This image could not be opened.");
          source.src = reader.result;
        };

        reader.onerror = () => say("Couldn't read that photo. Please try again.");
        reader.readAsDataURL(file);
      });

      picker.click();
    });

    clear.addEventListener("click", () => {
      try {
        localStorage.removeItem(prefix + card.dataset.memory);
      } catch {}

      caption.value = "";
      date.value = "";
      const placeholder = document.createElement("div");
      placeholder.className = "mw-placeholder";

      const symbol = document.createElement("span");
      symbol.textContent = "♡";

      const hint = document.createElement("small");
      hint.textContent = "Your next special moment";

      placeholder.append(symbol, hint);
      art.replaceChildren(placeholder);
      say("Memory cleared from this device.");
    });
  });
})();
