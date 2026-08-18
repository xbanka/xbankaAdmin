import { PERMISSION_CATEGORIES, UI_TO_API_PERMISSION_MAP } from "./rolePermissions";

export type UiPermission =
  (typeof PERMISSION_CATEGORIES)[keyof typeof PERMISSION_CATEGORIES][number];

// Single source of truth for UI-key -> backend permission-string mappings
// lives in rolePermissions.ts; re-exported here so existing importers of
// this module keep working without pointing at a second, drifting copy.
export const API_PERMISSIONS = UI_TO_API_PERMISSION_MAP;

export type ApiPermission =
  (typeof API_PERMISSIONS)[keyof typeof API_PERMISSIONS];

export { UI_TO_API_PERMISSION_MAP };
