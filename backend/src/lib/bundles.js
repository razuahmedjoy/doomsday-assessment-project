// Fewest bundles that add up to exactly `groupSize` (unbounded coin change).
// Returns [{ size, count }] sorted by size descending, or null if impossible.
export function minBundles(sizes, groupSize) {
  const best = new Array(groupSize + 1).fill(Infinity); // best[n] = fewest bundles for n seats
  const lastSize = new Array(groupSize + 1).fill(0); // bundle used to reach n
  best[0] = 0;

  for (let seats = 1; seats <= groupSize; seats++) {
    for (const size of sizes) {
      if (size <= seats && best[seats - size] + 1 < best[seats]) {
        best[seats] = best[seats - size] + 1;
        lastSize[seats] = size;
      }
    }
  }
  if (best[groupSize] === Infinity) return null;

  const counts = new Map();
  for (let seats = groupSize; seats > 0; seats -= lastSize[seats]) {
    counts.set(lastSize[seats], (counts.get(lastSize[seats]) ?? 0) + 1);
  }
  return [...counts]
    .map(([size, count]) => ({ size, count }))
    .sort((a, b) => b.size - a.size);
}
