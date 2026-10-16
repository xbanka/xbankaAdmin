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
