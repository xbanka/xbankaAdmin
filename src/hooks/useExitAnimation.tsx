"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentType,
} from "react";

// Matches --animate-drawer-out in globals.css.
const EXIT_MS = 300;

const ClosingContext = createContext(false);

/** True while the surrounding drawer is playing its exit animation. */
export const useDrawerClosing = () => useContext(ClosingContext);

/**
 * Keeps a drawer mounted for its exit animation after it closes.
 *
 * Drawers in this app unmount the moment they close (`if (!isOpen) return
 * null`), which leaves no time to animate out. This wrapper holds on to the
 * last props the drawer was open with, so its content (transaction, staff
 * member, log entry…) stays on screen while it slides away, and exposes
 * `useDrawerClosing()` so the drawer can swap its enter animation for the
 * exit one. Under reduced motion it unmounts straight away.
 */
export function withExitAnimation<P extends object>(
  Drawer: ComponentType<P>,
  isOpen: (props: P) => boolean,
) {
  function WithExitAnimation(props: P) {
    const open = isOpen(props);
    const [present, setPresent] = useState(open);
    const [openProps, setOpenProps] = useState(props);

    // Derived during render (React's "adjust state on prop change" pattern)
    // so opening never waits an extra frame.
    if (open && !present) setPresent(true);
    if (open && openProps !== props) setOpenProps(props);

    useEffect(() => {
      if (open || !present) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = setTimeout(() => setPresent(false), reduce ? 0 : EXIT_MS);
      return () => clearTimeout(t);
    }, [open, present]);

    if (!present) return null;

    return (
      <ClosingContext.Provider value={!open}>
        <Drawer {...(open ? props : openProps)} />
      </ClosingContext.Provider>
    );
  }

  WithExitAnimation.displayName = `withExitAnimation(${
    Drawer.displayName || Drawer.name || "Drawer"
  })`;
  return WithExitAnimation;
}
