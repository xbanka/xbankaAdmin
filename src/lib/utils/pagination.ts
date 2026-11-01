// The audit list endpoints return `{ page, limit, total, pages, data }`.
// `total` and `pages` follow the active filters, so they are read fresh from
// every response rather than carried over between filter changes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractEnvelopePage<TRaw = any, T = TRaw>(
  body: unknown,
  map: (raw: TRaw) => T,
  fallbackPage = 1,
) {
  const envelope = (body ?? {}) as {
    page?: number;
    total?: number;
    pages?: number;
    data?: TRaw[];
  };
  const rows = Array.isArray(envelope.data) ? envelope.data.map(map) : [];
  const page = Number(envelope.page ?? fallbackPage);
  const total = Number(envelope.total ?? rows.length);
  const pages = Number(envelope.pages ?? (rows.length ? 1 : 0));

  return { rows, total, pages, hasNextPage: page < pages };
}

// Several list endpoints return a plain array with no total count. Since the
// page size is fixed by `limit`, a page shorter than `limit` (or empty) is
// the last page; otherwise assume at least one more page exists.
export function estimatePagination(page: number, limit: number, count: number) {
  const isLastPage = count < limit;
  return {
    hasNextPage: !isLastPage,
    total: isLastPage ? (page - 1) * limit + count : page * limit + 1,
  };
}
