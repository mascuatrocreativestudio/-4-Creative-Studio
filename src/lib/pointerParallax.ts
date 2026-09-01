import gsap from "gsap";

/**
 * Parallax de cursor compartido por las escenas.
 * Techo real de desplazamiento: 11px en X, 9px en Y, modulado por data-depth.
 * Devuelve la función de limpieza.
 */
export function attachPointerParallax(root: HTMLElement): () => void {
  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
  const setters = layers.map((el) => ({
    depth: Number(el.dataset.depth ?? "1"),
    x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
    y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
  }));

  let frame = 0;
  let nx = 0;
  let ny = 0;

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    nx = (event.clientX / window.innerWidth - 0.5) * 2;
    ny = (event.clientY / window.innerHeight - 0.5) * 2;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      setters.forEach((s) => {
        s.x(nx * 11 * s.depth);
        s.y(ny * 9 * s.depth);
      });
    });
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });

  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    if (frame) window.cancelAnimationFrame(frame);
  };
}
