"use client";

import { useEffect, useState } from "react";

export function useScreen() {
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    function update() { setWidth(window.innerWidth); }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return { width, isMobile: width <= 560, isTablet: width <= 860, isNotebook: width <= 1180 };
}
