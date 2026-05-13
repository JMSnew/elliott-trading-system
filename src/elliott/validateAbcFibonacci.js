/**
 * Funciones para validar correcciones Elliott A-B-C usando ratios Fibonacci.
 *
 * @module elliott/validateAbcFibonacci
 */

/**
 * Valida si una corrección A-B-C cumple con rangos Fibonacci esperados.
 *
 * Esta función recibe una corrección previamente detectada y comprueba:
 *
 * - El retroceso de la onda B respecto a la onda A.
 * - La extensión de la onda C respecto a la onda A.
 *
 * Reglas usadas:
 *
 * - Wave B debe retroceder entre 38.2% y 79% de Wave A.
 * - Wave C debe extender entre 100% y 161.8% de Wave A.
 *
 * La función está pensada para validar correcciones zigzag alcistas donde:
 *
 * - start es un swing high.
 * - waveA es un swing low.
 * - waveB es un swing high.
 * - waveC es un swing low.
 *
 * @param {Object} correction - Corrección A-B-C previamente detectada.
 * @param {boolean} correction.valid - Indica si la corrección base fue detectada como válida.
 * @param {string} [correction.reason] - Motivo o explicación de la corrección base.
 * @param {Object} correction.correction - Estructura de la corrección.
 * @param {Object} correction.correction.start - Punto inicial de la corrección.
 * @param {number} correction.correction.start.price - Precio del punto inicial.
 * @param {Object} correction.correction.waveA - Punto final de la onda A.
 * @param {number} correction.correction.waveA.price - Precio de la onda A.
 * @param {Object} correction.correction.waveB - Punto final de la onda B.
 * @param {number} correction.correction.waveB.price - Precio de la onda B.
 * @param {Object} correction.correction.waveC - Punto final de la onda C.
 * @param {number} correction.correction.waveC.price - Precio de la onda C.
 * @returns {Object} Resultado de la validación Fibonacci.
 * @returns {boolean} returns.valid - Indica si la validación Fibonacci fue correcta.
 * @returns {string} returns.reason - Explicación del resultado.
 * @returns {number} [returns.waveBRetracement] - Retroceso de la onda B respecto a la onda A.
 * @returns {number} [returns.waveCExtension] - Extensión de la onda C respecto a la onda A.
 *
 * @example
 * const fibonacci = validateAbcFibonacci({
 *   valid: true,
 *   pattern: "bullish_zigzag_correction",
 *   correction: {
 *     start: { type: "high", price: 70000 },
 *     waveA: { type: "low", price: 65000 },
 *     waveB: { type: "high", price: 67500 },
 *     waveC: { type: "low", price: 59500 }
 *   },
 *   reason: "Corrección A-B-C tipo zigzag detectada"
 * });
 *
 * console.log(fibonacci);
 * // {
 * //   valid: true,
 * //   reason: "ABC cumple validación Fibonacci",
 * //   waveBRetracement: 0.5,
 * //   waveCExtension: 1.6
 * // }
 */
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