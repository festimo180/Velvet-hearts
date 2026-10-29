(() => {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Velvet Hearts app support is ready."))
      .catch(error => console.warn("Offline support is unavailable:", error));
  });
})();
