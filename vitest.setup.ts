import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// RTL's built-in auto-cleanup hooks into global `afterEach`, which isn't
// registered since `test.globals` is off — without this, renders from one
// test stay mounted and leak into the next test's queries.
afterEach(() => {
  cleanup();
});

// jsdom doesn't implement these, but Radix primitives (Dialog, Select, etc.)
// call them as part of focus/pointer management — without stubs, rendering
// them in tests throws "not a function" before any assertion runs.
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView ??= () => {};
  window.HTMLElement.prototype.hasPointerCapture ??= () => false;
  window.HTMLElement.prototype.setPointerCapture ??= () => {};
  window.HTMLElement.prototype.releasePointerCapture ??= () => {};

  window.matchMedia ??=
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
}
