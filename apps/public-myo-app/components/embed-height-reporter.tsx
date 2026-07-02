"use client";

import { useEffect } from "react";

const EMBED_MESSAGE_TYPE = "myo-iframe-height";
const MEASURE_MESSAGE_TYPE = "myo-iframe-measure";

export function EmbedHeightReporter() {
  useEffect(() => {
    if (window.parent === window) return;

    let lastHeight = 0;
    let animationFrame = 0;
    let delayedReport = 0;

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
        window.parent.postMessage({ type: EMBED_MESSAGE_TYPE, height }, "*");
      });
    };

    const reportNowAndAfterLayout = () => {
      reportHeight();
      window.clearTimeout(delayedReport);
      delayedReport = window.setTimeout(reportHeight, 350);
    };

    const resizeObserver = new ResizeObserver(reportNowAndAfterLayout);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(reportNowAndAfterLayout);
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    window.addEventListener("load", reportNowAndAfterLayout);
    window.addEventListener("resize", reportNowAndAfterLayout);
    window.addEventListener("orientationchange", reportNowAndAfterLayout);
    document.addEventListener("load", reportNowAndAfterLayout, true);
    document.addEventListener("click", reportNowAndAfterLayout, true);
    document.addEventListener("change", reportNowAndAfterLayout, true);
    document.fonts?.ready.then(reportNowAndAfterLayout).catch(() => undefined);

    const handleMessage = (event: MessageEvent) => {
      if (event.source === window.parent && event.data?.type === MEASURE_MESSAGE_TYPE) {
        reportNowAndAfterLayout();
      }
    };
    window.addEventListener("message", handleMessage);
    reportNowAndAfterLayout();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("load", reportNowAndAfterLayout);
      window.removeEventListener("resize", reportNowAndAfterLayout);
      window.removeEventListener("orientationchange", reportNowAndAfterLayout);
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("load", reportNowAndAfterLayout, true);
      document.removeEventListener("click", reportNowAndAfterLayout, true);
      document.removeEventListener("change", reportNowAndAfterLayout, true);
      window.clearTimeout(delayedReport);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
