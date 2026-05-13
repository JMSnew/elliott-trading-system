/**
 * Funciones para validar impulsos alcistas básicos de Elliott.
 *
 * @module elliott/validateBasicImpulse
 */

/**
 * Valida si una ventana de 6 swings corresponde a un impulso alcista básico.
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
 * - La onda 4 no debe romper la zona inválida definida por la onda 2.
 *
 * Esta validación es más básica que otros detectores de impulso porque no calcula
 * longitudes de ondas ni valida si la onda 3 es la más corta.
 *
 * @param {Array<Object>} window - Grupo de 6 swings consecutivos.
 * @param {string} window[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} window[].price - Precio del swing.
 * @returns {Object} Resultado de la validación de la ventana.
 * @returns {boolean} returns.valid - Indica si la ventana forma un impulso válido.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.waves] - Ondas que forman el impulso.
 * @returns {Object} [returns.waves.origin] - Origen del impulso.
 * @returns {Object} [returns.waves.w1] - Final de la onda 1.
 * @returns {Object} [returns.waves.w2] - Final de la onda 2.
 * @returns {Object} [returns.waves.w3] - Final de la onda 3.
 * @returns {Object} [returns.waves.w4] - Final de la onda 4.
 * @returns {Object} [returns.waves.w5] - Final de la onda 5.
 * @returns {string} [returns.reason] - Motivo por el que la ventana no es válida.
 */
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

/**
 * Busca y valida el impulso alcista básico más reciente dentro de una lista de swings.
 *
 * La función recorre los swings desde el final hacia el inicio, tomando ventanas
 * de 6 swings consecutivos. En cuanto encuentra una ventana válida, devuelve
 * el impulso detectado.
 *
 * @param {Array<Object>} swings - Lista de swings del mercado.
 * @param {string} swings[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} swings[].price - Precio del swing.
 * @returns {Object} Resultado de la búsqueda del impulso.
 * @returns {boolean} returns.valid - Indica si se encontró un impulso alcista válido.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.waves] - Ondas del impulso detectado.
 * @returns {string} [returns.reason] - Motivo por el que no se encontró un impulso válido.
 *
 * @example
 * const result = validateBasicImpulse([
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
 * //   pattern: "basic_bullish_impulse",
 * //   waves: {
 * //     origin: { type: "low", price: 60000 },
 * //     w1: { type: "high", price: 63000 },
 * //     w2: { type: "low", price: 61500 },
 * //     w3: { type: "high", price: 67000 },
 * //     w4: { type: "low", price: 64500 },
 * //     w5: { type: "high", price: 69000 }
 * //   }
 * // }
 */
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