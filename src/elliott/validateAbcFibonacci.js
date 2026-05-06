export function validateAbcFibonacci(correction) {
  if (!correction.valid) {
    return {
      valid: false,
      reason: correction.reason
    };
  }

  const { start, waveA, waveB, waveC } = correction.correction;

  const waveALength = start.price - waveA.price;
  const waveBRetracement = (waveB.price - waveA.price) / waveALength;
  const waveCExtension = (waveB.price - waveC.price) / waveALength;

  const bValid = waveBRetracement >= 0.382 && waveBRetracement <= 0.79;
  const cValid = waveCExtension >= 1 && waveCExtension <= 1.618;

  if (!bValid) {
    return {
      valid: false,
      reason: "Wave B fuera de rango Fibonacci",
      waveBRetracement,
      waveCExtension
    };
  }

  if (!cValid) {
    return {
      valid: false,
      reason: "Wave C fuera de rango Fibonacci",
      waveBRetracement,
      waveCExtension
    };
  }

  return {
    valid: true,
    reason: "ABC cumple validación Fibonacci",
    waveBRetracement,
    waveCExtension
  };
}