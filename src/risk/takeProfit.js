export function calculateAbcTakeProfit(correction) {
  if (!correction.valid) {
    return {
      valid: false,
      reason: correction.reason
    };
  }

  const { start, waveA, waveB, waveC } = correction.correction;

  const conservativeTarget = waveB.price;
  const previousHighTarget = start.price;

  const waveALength = start.price - waveA.price;
  const extensionTarget = waveC.price + waveALength * 1.618;

  return {
    valid: true,
    conservativeTarget,
    previousHighTarget,
    extensionTarget,
    levels: {
      tp1: conservativeTarget,
      tp2: previousHighTarget,
      tp3: extensionTarget
    }
  };
}