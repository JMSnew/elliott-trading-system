/**
 * Funciones para calcular objetivos de take profit en estructuras A-B-C.
 *
 * @module risk/takeProfit
 */

/**
 * Calcula niveles de take profit para una corrección A-B-C válida.
 *
 * La función recibe una corrección previamente detectada y calcula tres posibles
 * objetivos de salida:
 *
 * - TP1: objetivo conservador en el precio de la onda B.
 * - TP2: objetivo en el máximo previo, es decir, el punto inicial de la corrección.
 * - TP3: objetivo extendido usando una proyección 1.618 de la onda A desde la onda C.
 *
 * Esta función está pensada para una estrategia alcista después de una corrección
 * A-B-C, donde se busca entrada cerca del final de la onda C.
 *
 * @param {Object} correction - Corrección A-B-C detectada.
 * @param {boolean} correction.valid - Indica si la corrección es válida.
 * @param {string} [correction.reason] - Motivo por el que la corrección no es válida.
 * @param {Object} correction.correction - Estructura de la corrección.
 * @param {Object} correction.correction.start - Punto inicial de la corrección.
 * @param {number} correction.correction.start.price - Precio del punto inicial.
 * @param {Object} correction.correction.waveA - Punto final de la onda A.
 * @param {number} correction.correction.waveA.price - Precio de la onda A.
 * @param {Object} correction.correction.waveB - Punto final de la onda B.
 * @param {number} correction.correction.waveB.price - Precio de la onda B.
 * @param {Object} correction.correction.waveC - Punto final de la onda C.
 * @param {number} correction.correction.waveC.price - Precio de la onda C.
 * @returns {Object} Resultado del cálculo de take profit.
 * @returns {boolean} returns.valid - Indica si el cálculo es válido.
 * @returns {string} [returns.reason] - Motivo por el que no se pueden calcular objetivos.
 * @returns {number} [returns.conservativeTarget] - Objetivo conservador ubicado en la onda B.
 * @returns {number} [returns.previousHighTarget] - Objetivo ubicado en el máximo previo.
 * @returns {number} [returns.extensionTarget] - Objetivo extendido usando Fibonacci 1.618.
 * @returns {Object} [returns.levels] - Niveles de take profit organizados.
 * @returns {number} [returns.levels.tp1] - Primer take profit.
 * @returns {number} [returns.levels.tp2] - Segundo take profit.
 * @returns {number} [returns.levels.tp3] - Tercer take profit.
 *
 * @example
 * const takeProfit = calculateAbcTakeProfit({
 *   valid: true,
 *   correction: {
 *     start: { type: "high", price: 70000 },
 *     waveA: { type: "low", price: 65000 },
 *     waveB: { type: "high", price: 67500 },
 *     waveC: { type: "low", price: 62000 }
 *   }
 * });
 *
 * console.log(takeProfit);
 * // {
 * //   valid: true,
 * //   conservativeTarget: 67500,
 * //   previousHighTarget: 70000,
 * //   extensionTarget: 70090,
 * //   levels: {
 * //     tp1: 67500,
 * //     tp2: 70000,
 * //     tp3: 70090
 * //   }
 * // }
 */
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