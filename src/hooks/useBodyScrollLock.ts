import { useEffect } from "react";

/**
 * Locks scrolling on the page while a sidebar/overlay is open.
 *
 * The app sets `overflow-x: hidden` on both <html> and <body> in globals.css,
 * which promotes <html> to a y-scroll container. Locking only <body> leaves the
 * background scrollable, so we lock both <html> and <body> and compensate for the
 * removed scrollbar width to avoid a layout shift.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const html = document.documentElement;
    const { body } = document;

    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };

    // Compensate for the removed scrollbar so the page behind doesn't jump.
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.paddingRight = previous.bodyPaddingRight;
    };
  }, [isLocked]);
}
