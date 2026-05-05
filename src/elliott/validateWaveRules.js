function validateBullishImpulseWindow(window) {
  const [origin, w1, w2, w3, w4, w5] = window;

  const correctSequence =
    origin.type === "low" &&
    w1.type === "high" &&
    w2.type === "low" &&
    w3.type === "high" &&
    w4.type === "low" &&
    w5.type === "high";

  if (!correctSequence) {
    return {
      valid: false,
      reason: "La secuencia no corresponde a un impulso alcista low-high-low-high-low-high"
    };
  }

  if (w2.price <= origin.price) {
    return {
      valid: false,
      reason: "La onda 2 rompe el origen de la onda 1"
    };
  }

  if (w3.price <= w1.price) {
    return {
      valid: false,
      reason: "La onda 3 no supera la onda 1"
    };
  }

  if (w4.price <= w2.price) {
    return {
      valid: false,
      reason: "La onda 4 invade/rompe zona inválida según regla estricta"
    };
  }

  return {
    valid: true,
    pattern: "basic_bullish_impulse",
    waves: { origin, w1, w2, w3, w4, w5 }
  };
}

export function validateBasicImpulse(swings) {
  if (!swings || swings.length < 6) {
    return {
      valid: false,
      reason: "Se necesitan al menos 6 swings"
    };
  }

  for (let i = swings.length - 6; i >= 0; i--) {
    const window = swings.slice(i, i + 6);
    const result = validateBullishImpulseWindow(window);

    if (result.valid) {
      return result;
    }
  }

  return {
    valid: false,
    reason: "No se encontró ningún impulso alcista válido según reglas estrictas Elliott"
  };
}