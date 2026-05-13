/**
 * Estrategia para generar señales de trading basadas en correcciones Elliott A-B-C.
 *
 * @module strategy/abcCorrectionStrategy
 */

import { calculateAbcTakeProfit } from "../risk/takeProfit.js";

/**
 * Genera una señal de trading a partir de una corrección A-B-C válida y el precio actual.
 *
 * La función evalúa una corrección previamente detectada y decide si el sistema debe:
 *
 * - No operar.
 * - Esperar.
 * - Hacer una compra inicial cerca de la onda C.
 * - Hacer una compra post-turn después de romper la onda B.
 *
 * Reglas principales:
 *
 * - Si la corrección no es válida, devuelve NO_TRADE.
 * - Si el precio actual ya superó el TP3, devuelve NO_TRADE por entrada tardía.
 * - Si el precio está cerca de la onda C, devuelve INITIAL_BUY.
 * - Si el precio rompe por encima de la onda B, devuelve POST_TURN_BUY.
 * - Si ninguna condición se cumple, devuelve WAIT.
 *
 * @param {Object} correction - Corrección A-B-C detectada.
 * @param {boolean} correction.valid - Indica si la corrección es válida.
 * @param {string} [correction.reason] - Motivo por el que la corrección no es válida.
 * @param {Object} correction.correction - Estructura de la corrección.
 * @param {Object} correction.correction.waveB - Punto final de la onda B.
 * @param {number} correction.correction.waveB.price - Precio de la onda B.
 * @param {Object} correction.correction.waveC - Punto final de la onda C.
 * @param {number} correction.correction.waveC.price - Precio de la onda C.
 * @param {number} currentPrice - Precio actual del mercado.
 * @returns {Object} Señal generada por la estrategia.
 * @returns {string} returns.signal - Señal generada: "NO_TRADE", "INITIAL_BUY", "POST_TURN_BUY" o "WAIT".
 * @returns {string} [returns.layer] - Capa de entrada recomendada: "initial" o "postTurn".
 * @returns {string} returns.reason - Explicación de la señal.
 * @returns {number} [returns.entry] - Precio de entrada sugerido.
 * @returns {number} [returns.currentPrice] - Precio actual evaluado.
 * @returns {number} [returns.stopLoss] - Stop loss calculado.
 * @returns {number} [returns.confirmationLevel] - Nivel de confirmación basado en la onda B.
 * @returns {number} [returns.entryInitialZone] - Zona de entrada inicial basada en la onda C.
 * @returns {number} [returns.tp3] - Tercer objetivo de take profit.
 * @returns {Object} [returns.takeProfit] - Niveles de take profit calculados.
 *
 * @example
 * const signal = generateAbcCorrectionSignal(
 *   {
 *     valid: true,
 *     correction: {
 *       start: { type: "high", price: 70000 },
 *       waveA: { type: "low", price: 65000 },
 *       waveB: { type: "high", price: 67500 },
 *       waveC: { type: "low", price: 62000 }
 *     }
 *   },
 *   62500
 * );
 *
 * console.log(signal);
 * // {
 * //   signal: "INITIAL_BUY",
 * //   layer: "initial",
 * //   reason: "Precio cerca de onda C: posible entrada inicial",
 * //   entry: 62500,
 * //   stopLoss: 61380,
 * //   confirmationLevel: 67500,
 * //   takeProfit: { ... }
 * // }
 */
export function generateAbcCorrectionSignal(correction, currentPrice) {
  if (!correction.valid) {
    return {
      signal: "NO_TRADE",
      reason: correction.reason
    };
  }

  const { waveB, waveC } = correction.correction;

  const takeProfit = calculateAbcTakeProfit(correction);

  const entryInitialZone = waveC.price;
  const confirmationLevel = waveB.price;
  const stopLoss = waveC.price * 0.99;

  if (currentPrice > takeProfit.levels.tp3) {
    return {
      signal: "NO_TRADE",
      reason: "Entrada tardía: el precio ya superó el objetivo TP3",
      currentPrice,
      tp3: takeProfit.levels.tp3,
      stopLoss,
      confirmationLevel,
      takeProfit
    };
  }

  if (currentPrice <= entryInitialZone * 1.01) {
    return {
      signal: "INITIAL_BUY",
      layer: "initial",
      reason: "Precio cerca de onda C: posible entrada inicial",
      entry: currentPrice,
      stopLoss,
      confirmationLevel,
      takeProfit
    };
  }

  if (currentPrice > confirmationLevel) {
    return {
      signal: "POST_TURN_BUY",
      layer: "postTurn",
      reason: "Ruptura de onda B: confirmación post-turno",
      entry: currentPrice,
      stopLoss,
      confirmationLevel,
      takeProfit
    };
  }

  return {
    signal: "WAIT",
    reason: "Corrección detectada, esperando zona C o ruptura de B",
    currentPrice,
    entryInitialZone,
    confirmationLevel,
    stopLoss,
    takeProfit
  };
}