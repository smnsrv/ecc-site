import { useEffect } from "react";

export function useFadeUp(deps) {
  useEffect(() => {
    const nodes = document.querySelectorAll(".fade-up");
    if (!nodes.length) return undefined;

    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      nodes.forEach((n) => n.classList.add("visible"));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("visible");
        });
      },
      { threshold: 0.08 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- пересканировать DOM при смене страницы/данных
  }, deps);
}
