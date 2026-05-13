/**
 * Funciones para detectar impulsos alcistas de Elliott.
 *
 * @module elliott/detectBullishImpulse
 */

/**
 * Calcula la longitud absoluta entre dos swings.
 *
 * La longitud se obtiene como la diferencia absoluta entre los precios
 * de dos puntos del mercado.
 *
 * @param {Object} a - Primer swing.
 * @param {number} a.price - Precio del primer swing.
 * @param {Object} b - Segundo swing.
 * @param {number} b.price - Precio del segundo swing.
 * @returns {number} Distancia absoluta entre ambos precios.
 */
function waveLength(a, b) {
  return Math.abs(b.price - a.price);
}

/**
 * Valida si una ventana de 6 swings forma un impulso Elliott alcista válido.
 *
 * La secuencia esperada es:
 *
 * - origin: low
 * - w1: high
 * - w2: low
 * - w3: high
 * - w4: low
 * - w5: high
 *
 * Reglas usadas:
 *
 * - La onda 2 no puede romper el origen de la onda 1.
 * - La onda 3 debe superar el máximo de la onda 1.
 * - La onda 4 no debe invadir el territorio de la onda 1.
 * - La onda 3 no puede ser la más corta entre las ondas 1, 3 y 5.
 *
 * @param {Array<Object>} window - Grupo de 6 swings consecutivos.
 * @param {string} window[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} window[].price - Precio del swing.
 * @returns {Object} Resultado de la validación del impulso.
 * @returns {boolean} returns.valid - Indica si el impulso es válido.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.waves] - Ondas que forman el impulso.
 * @returns {Object} [returns.waves.origin] - Origen de la onda 1.
 * @returns {Object} [returns.waves.w1] - Final de la onda 1.
 * @returns {Object} [returns.waves.w2] - Final de la onda 2.
 * @returns {Object} [returns.waves.w3] - Final de la onda 3.
 * @returns {Object} [returns.waves.w4] - Final de la onda 4.
 * @returns {Object} [returns.waves.w5] - Final de la onda 5.
 * @returns {Object} [returns.lengths] - Longitudes de las ondas impulsivas.
 * @returns {number} [returns.lengths.wave1] - Longitud de la onda 1.
 * @returns {number} [returns.lengths.wave3] - Longitud de la onda 3.
 * @returns {number} [returns.lengths.wave5] - Longitud de la onda 5.
 * @returns {string} [returns.reason] - Motivo por el que el impulso no es válido.
 */
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

/**
 * Detecta el impulso Elliott alcista más reciente dentro de una lista de swings.
 *
 * La función recorre los swings desde el final hacia el inicio, tomando ventanas
 * de 6 swings consecutivos. En cuanto encuentra una estructura válida, devuelve
 * el resultado del impulso detectado.
 *
 * @param {Array<Object>} swings - Lista de swings del mercado.
 * @param {string} swings[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} swings[].price - Precio del swing.
 * @returns {Object} Resultado de la detección del impulso alcista.
 * @returns {boolean} returns.valid - Indica si se encontró un impulso válido.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.waves] - Ondas del impulso detectado.
 * @returns {Object} [returns.lengths] - Longitudes de las ondas 1, 3 y 5.
 * @returns {string} [returns.reason] - Motivo por el que no se encontró un impulso válido.
 *
 * @example
 * const result = detectBullishImpulse([
 *   { type: "low", price: 60000 },
 *   { type: "high", price: 63000 },
 *   { type: "low", price: 61500 },
 *   { type: "high", price: 67000 },
 *   { type: "low", price: 64500 },
 *   { type: "high", price: 69000 }
 * ]);
 *
 * console.log(result);
 * // {
 * //   valid: true,
 * //   pattern: "bullish_impulse",
 * //   waves: {
 * //     origin: { type: "low", price: 60000 },
 * //     w1: { type: "high", price: 63000 },
 * //     w2: { type: "low", price: 61500 },
 * //     w3: { type: "high", price: 67000 },
 * //     w4: { type: "low", price: 64500 },
 * //     w5: { type: "high", price: 69000 }
 * //   },
 * //   lengths: {
 * //     wave1: 3000,
 * //     wave3: 5500,
 * //     wave5: 4500
 * //   }
 * // }
 */
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