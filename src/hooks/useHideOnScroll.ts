import { useEffect, useRef, useState } from "react";

/**
 * Returns true when the element should be visible.
 * Hides when scrolling down, shows when scrolling up (or near the top).
 */
export default function useHideOnScroll(threshold = 10) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY.current) > threshold) {
        setVisible(y < lastY.current || y < 50);
        lastY.current = y;
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
}
