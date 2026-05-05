export function detectBullishZigZagCorrection(swings) {
  if (!swings || swings.length < 4) {
    return {
      valid: false,
      reason: "Se necesitan al menos 4 swings para detectar una corrección A-B-C"
    };
  }

  for (let i = swings.length - 4; i >= 0; i--) {
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

    return {
      valid: true,
      pattern: "bullish_zigzag_correction",
      correction: {
        start,
        waveA,
        waveB,
        waveC
      },
      reason: "Corrección A-B-C tipo zigzag detectada"
    };
  }

  return {
    valid: false,
    reason: "No se encontró corrección A-B-C zigzag válida"
  };
}
