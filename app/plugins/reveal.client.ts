export default defineNuxtPlugin(() => {
  if (typeof window === "undefined") return;

  let observer: IntersectionObserver | null = null;

  const observeAll = () => {
    document
      .querySelectorAll(".reveal-section:not(.is-visible)")
      .forEach((el) => observer?.observe(el));
  };

  const start = () => {
    document.body.classList.add("reveal-enabled");

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observeAll();
    const mutationObserver = new MutationObserver(() => observeAll());
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
});