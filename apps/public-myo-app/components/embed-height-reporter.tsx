"use client";

import { useEffect } from "react";

const EMBED_MESSAGE_TYPE = "tfit-myo-resize";

export function EmbedHeightReporter() {
  useEffect(() => {
    if (window.parent === window) return;

    let lastHeight = 0;
    let animationFrame = 0;

    const reportHeight = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const main = document.querySelector("main");
        const height = Math.ceil(
          main
            ? main.getBoundingClientRect().bottom + window.scrollY
            : document.body.scrollHeight,
        );
        if (height === lastHeight) return;
        lastHeight = height;
        window.parent.postMessage(
          { type: EMBED_MESSAGE_TYPE, height },
          "*",
        );
      });
    };

    const resizeObserver = new ResizeObserver(reportHeight);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);
    window.addEventListener("load", reportHeight);
    reportHeight();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("load", reportHeight);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
