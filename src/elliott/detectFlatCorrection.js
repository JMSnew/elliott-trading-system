export function detectFlatCorrection(swings) {
  if (swings.length < 4) {
    return {
      valid: false,
      reason: "No hay suficientes swings"
    };
  }

  for (let i = 0; i <= swings.length - 4; i++) {
    const start = swings[i];
    const waveA = swings[i + 1];
    const waveB = swings[i + 2];
    const waveC = swings[i + 3];

    // FLAT ALCISTA
    if (
      start.type === "high" &&
      waveA.type === "low" &&
      waveB.type === "high" &&
      waveC.type === "low"
    ) {
      const aSize = start.price - waveA.price;

      if (aSize <= 0) continue;

      const bRetracement =
        (waveB.price - waveA.price) / aSize;

      // B debe recuperar 90%-105%
      const validB =
        bRetracement >= 0.90 &&
        bRetracement <= 1.05;

      if (!validB) continue;

      const cSize = waveB.price - waveC.price;

      const cProjection = cSize / aSize;

      // C ≈ 100% de A
      const validC =
        cProjection >= 0.8 &&
        cProjection <= 1.2;

      if (!validC) continue;

      return {
        valid: true,
        pattern: "bullish_flat",
        correction: {
          start,
          waveA,
          waveB,
          waveC
        },
        fibonacci: {
          bRetracement,
          cProjection
        }
      };
    }
  }

  return {
    valid: false,
    reason: "No se encontró Flat válido"
  };
}