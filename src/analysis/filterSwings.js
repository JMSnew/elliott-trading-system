export function filterStrongSwings(swings, minDistance = 1000) {
  if (!swings.length) return [];

  const filtered = [swings[0]];

  for (let i = 1; i < swings.length; i++) {
    const last = filtered[filtered.length - 1];
    const current = swings[i];

    const distance = Math.abs(current.price - last.price);

    if (distance >= minDistance) {
      filtered.push(current);
    }
  }

  return filtered;
}