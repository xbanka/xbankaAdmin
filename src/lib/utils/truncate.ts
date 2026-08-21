export function truncate(value?: string | null, length = 8): string {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length)}...` : value;
}
