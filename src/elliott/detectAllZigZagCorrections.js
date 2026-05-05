export function detectAllBullishZigZagCorrections(swings) {
  const corrections = [];

  if (!swings || swings.length < 4) {
    return corrections;
  }

  for (let i = 0; i <= swings.length - 4; i++) {
    const [start, waveA, waveB, waveC] = swings.slice(i, i + 4);

    const correctSequence =
      start.type === "high" &&
      waveA.type === "low" &&
      waveB.type === "high" &&
      waveC.type === "low";

    if (!correctSequence) continue;

    const waveABreaksDown = waveA.price < start.price;
    const waveBDoesNotBreakStart = waveB.price < start.price;
    const waveCBreaksWaveA = waveC.price < waveA.price;

    if (!waveABreaksDown) continue;
    if (!waveBDoesNotBreakStart) continue;
    if (!waveCBreaksWaveA) continue;

    corrections.push({
      valid: true,
      pattern: "bullish_zigzag_correction",
      correction: {
        start,
        waveA,
        waveB,
        waveC
      },
      reason: "Corrección A-B-C tipo zigzag detectada"
    });
  }

  return corrections;
}