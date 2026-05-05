function waveLength(a, b) {
  return Math.abs(b.price - a.price);
}

function validateBullishImpulse(window) {
  const [origin, w1, w2, w3, w4, w5] = window;

  const sequence =
    origin.type === "low" &&
    w1.type === "high" &&
    w2.type === "low" &&
    w3.type === "high" &&
    w4.type === "low" &&
    w5.type === "high";

  if (!sequence) {
    return { valid: false, reason: "Secuencia inválida" };
  }

  // Regla 1: onda 2 no rompe origen de onda 1
  if (w2.price <= origin.price) {
    return { valid: false, reason: "Onda 2 rompe origen de onda 1" };
  }

  // Regla 2: onda 3 supera onda 1
  if (w3.price <= w1.price) {
    return { valid: false, reason: "Onda 3 no supera onda 1" };
  }

  // Regla 3: onda 4 no invade territorio de onda 1
  if (w4.price <= w1.price && w4.price >= origin.price) {
    return { valid: false, reason: "Onda 4 invade territorio de onda 1" };
  }

  // Regla 4: onda 3 no puede ser la más corta
  const wave1Length = waveLength(origin, w1);
  const wave3Length = waveLength(w2, w3);
  const wave5Length = waveLength(w4, w5);

  if (wave3Length < wave1Length && wave3Length < wave5Length) {
    return { valid: false, reason: "Onda 3 es la más corta" };
  }

  return {
    valid: true,
    pattern: "bullish_impulse",
    waves: { origin, w1, w2, w3, w4, w5 },
    lengths: {
      wave1: wave1Length,
      wave3: wave3Length,
      wave5: wave5Length
    }
  };
}

export function detectBullishImpulse(swings) {
  if (!swings || swings.length < 6) {
    return {
      valid: false,
      reason: "Se necesitan al menos 6 swings para detectar impulso"
    };
  }

  for (let i = swings.length - 6; i >= 0; i--) {
    const window = swings.slice(i, i + 6);
    const result = validateBullishImpulse(window);

    if (result.valid) {
      return result;
    }
  }

  return {
    valid: false,
    reason: "No se encontró impulso Elliott alcista válido"
  };
}