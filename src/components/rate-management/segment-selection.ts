import { CryptoCurrencyTypes } from "@/lib/types/rates-types";
import { ALL_SEGMENTS_FILTER } from "@/lib/utils/rates";
import { Segment, SegmentResponse } from "./types";

export const ALL_SEGMENTS = ALL_SEGMENTS_FILTER;

// Options for the dashboard's segment filter, from GET /api/rates/segments/all.
// "All segments" comes first and clears the filter; each segment filters by
// its id (the API's recommended key, no name-matching surprises). Rows with
// no id are skipped, duplicates are dropped, and the list is sorted by name.
export function buildSegmentFilterOptions(
  segments: Pick<SegmentResponse, "id" | "name">[] | null | undefined,
): { label: string; value: string }[] {
  const seen = new Set<string>();
  const options = (Array.isArray(segments) ? segments : [])
    .filter((s) => {
      if (!s?.id || s.id === ALL_SEGMENTS_FILTER || seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    })
    .map((s) => ({ label: s.name?.trim() || s.id, value: s.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return [{ label: "All segments", value: ALL_SEGMENTS_FILTER }, ...options];
}

// Step 3 table filters: the segment dropdown and the name/ticker search.
export function filterReviewAssets(
  assets: CryptoCurrencyTypes[],
  { segmentId, query }: { segmentId: string; query: string },
): CryptoCurrencyTypes[] {
  const q = query.trim().toLowerCase();
  return assets.filter((asset) => {
    if (segmentId && segmentId !== ALL_SEGMENTS && asset.segmentId !== segmentId) {
      return false;
    }
    if (!q) return true;
    return [asset.name, asset.currency].some((field) =>
      (field ?? "").toLowerCase().includes(q),
    );
  });
}

// Segment data refetches whenever a save invalidates it (step 2 -> step 3).
// Rebuilding from the response alone would drop the staff's picks and edits
// mid-flow, so those carry over from the previous state by segment id.
// Segments start unpicked: staff choose which ones to configure.
export function mergeSegments(
  prev: Segment[],
  incoming: SegmentResponse[],
): Segment[] {
  const byId = new Map(prev.map((segment) => [segment.id, segment]));

  return incoming.map((segment) => {
    const existing = byId.get(segment.id);
    return {
      id: segment.id,
      name: segment.name,
      assets: segment.assets,
      selected: existing?.selected ?? false,
      isActive: existing?.isActive ?? segment.isActive ?? true,
      buySpread: existing?.buySpread ?? segment.buySpread,
      sellSpread: existing?.sellSpread ?? segment.sellSpread,
    };
  });
}
