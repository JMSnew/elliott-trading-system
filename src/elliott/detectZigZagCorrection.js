/**
 * Funciones para detectar una corrección Elliott A-B-C de tipo zigzag alcista.
 *
 * @module elliott/detectBullishZigZagCorrection
 */

/**
 * Detecta la corrección A-B-C zigzag alcista más reciente dentro de una lista de swings.
 *
 * Una corrección zigzag alcista se interpreta como una estructura correctiva bajista
 * formada por cuatro puntos:
 *
 * - start: high
 * - waveA: low
 * - waveB: high
 * - waveC: low
 *
 * La función recorre los swings desde el final hacia el inicio, por lo que devuelve
 * la corrección válida más reciente.
 *
 * Reglas usadas:
 *
 * - La onda A debe romper por debajo del punto inicial.
 * - La onda B no debe superar el punto inicial.
 * - La onda C debe romper por debajo de la onda A.
 *
 * @param {Array<Object>} swings - Lista de swings del mercado.
 * @param {string} swings[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} swings[].price - Precio del swing.
 * @returns {Object} Resultado de la detección de la corrección zigzag.
 * @returns {boolean} returns.valid - Indica si se encontró una corrección válida.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.correction] - Estructura completa de la corrección.
 * @returns {Object} [returns.correction.start] - Swing inicial de la corrección.
 * @returns {Object} [returns.correction.waveA] - Swing correspondiente a la onda A.
 * @returns {Object} [returns.correction.waveB] - Swing correspondiente a la onda B.
 * @returns {Object} [returns.correction.waveC] - Swing correspondiente a la onda C.
 * @returns {string} returns.reason - Explicación del resultado de la detección.
 *
 * @example
 * const result = detectBullishZigZagCorrection([
 *   { type: "high", price: 70000 },
 *   { type: "low", price: 65000 },
 *   { type: "high", price: 68000 },
 *   { type: "low", price: 62000 }
 * ]);
 *
 * console.log(result);
 * // {
 * //   valid: true,
 * //   pattern: "bullish_zigzag_correction",
 * //   correction: {
 * //     start: { type: "high", price: 70000 },
 * //     waveA: { type: "low", price: 65000 },
 * //     waveB: { type: "high", price: 68000 },
 * //     waveC: { type: "low", price: 62000 }
 * //   },
 * //   reason: "Corrección A-B-C tipo zigzag detectada"
 * // }
 */
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