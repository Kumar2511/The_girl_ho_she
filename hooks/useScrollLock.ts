"use client";

import { useEffect } from "react";

/**
 * Reusable hook to lock document body scrolling when a drawer or modal is open.
 * Preserves exact scroll position, prevents touch/wheel background scrolling,
 * and restores body styles on close/unmount.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // 1. Capture current scroll position
    const scrollY = window.scrollY;

    // 2. Preserve original body inline styles
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      touchAction: document.body.style.touchAction,
    };

    // 3. Apply scroll locking styles to body
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.touchAction = "none";

    // 4. Prevent background touchmove scrolling except for scrollable containers
    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("[data-scrollable='true']") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest(".overflow-y-auto") ||
          target.closest(".overflow-auto"))
      ) {
        return; // Allow touch scrolling inside scrollable elements & inputs
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    // 5. Cleanup function when drawer closes or unmounts
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;
      document.body.style.touchAction = originalStyle.touchAction;

      document.removeEventListener("touchmove", handleTouchMove);

      // Restore exact scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}

export default useScrollLock;
