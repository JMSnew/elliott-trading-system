/**
 * Estrategia para generar señales de entrada en posible onda 3 de Elliott.
 *
 * @module strategy/wave3Strategy
 */

import { fibonacciExtension } from "../indicators/fibonacci.js";

/**
 * Genera una señal de trading para intentar capturar una posible onda 3 alcista.
 *
 * La función recibe una validación previa de impulso o estructura Elliott y evalúa
 * si el precio actual ha roto el máximo de la onda 1.
 *
 * Reglas principales:
 *
 * - Si la validación previa no es válida, devuelve NO_TRADE.
 * - Si el precio actual aún no supera la onda 1, devuelve WAIT.
 * - El nivel de entrada se toma como el precio de w1.
 * - El stop loss se coloca en el precio de w2.
 * - El take profit se calcula con una extensión Fibonacci 1.618 de la onda 1.
 * - Si el riesgo es inválido, devuelve NO_TRADE.
 * - Si la relación riesgo/beneficio es menor que 2, devuelve NO_TRADE.
 * - Si todo es correcto, devuelve BUY.
 *
 * @param {Object} validation - Resultado de una validación Elliott previa.
 * @param {boolean} validation.valid - Indica si la estructura previa es válida.
 * @param {string} [validation.reason] - Motivo por el que la validación no es válida.
 * @param {Object} validation.waves - Ondas detectadas en la estructura.
 * @param {Object} validation.waves.origin - Origen de la onda 1.
 * @param {number} validation.waves.origin.price - Precio del origen.
 * @param {Object} validation.waves.w1 - Final de la onda 1.
 * @param {number} validation.waves.w1.price - Precio de la onda 1.
 * @param {Object} validation.waves.w2 - Final de la onda 2.
 * @param {number} validation.waves.w2.price - Precio de la onda 2.
 * @param {number} currentPrice - Precio actual del mercado.
 * @returns {Object} Señal generada por la estrategia.
 * @returns {string} returns.signal - Señal generada: "NO_TRADE", "WAIT" o "BUY".
 * @returns {string} returns.reason - Explicación de la señal.
 * @returns {number} [returns.entryLevel] - Nivel que debe romper el precio para activar la entrada.
 * @returns {number} [returns.currentPrice] - Precio actual evaluado.
 * @returns {number} [returns.entry] - Precio de entrada sugerido.
 * @returns {number} [returns.stopLoss] - Stop loss calculado.
 * @returns {number} [returns.takeProfit] - Objetivo de beneficio calculado.
 * @returns {number} [returns.risk] - Riesgo por unidad.
 * @returns {number} [returns.reward] - Beneficio potencial por unidad.
 * @returns {number|null} [returns.riskReward] - Relación riesgo/beneficio.
 *
 * @example
 * const signal = generateWave3Signal(
 *   {
 *     valid: true,
 *     waves: {
 *       origin: { type: "low", price: 60000 },
 *       w1: { type: "high", price: 64000 },
 *       w2: { type: "low", price: 62000 }
 *     }
 *   },
 *   64500
 * );
 *
 * console.log(signal);
 * // {
 * //   signal: "BUY",
 * //   reason: "Ruptura de onda 1: posible inicio de onda 3",
 * //   entry: 64500,
 * //   stopLoss: 62000,
 * //   takeProfit: 66472,
 * //   risk: 2500,
 * //   reward: 1972,
 * //   riskReward: 0.7888
 * // }
 */
export function generateWave3Signal(validation, currentPrice) {
  if (!validation.valid) {
    return {
      signal: "NO_TRADE",
      reason: validation.reason
    };
  }

  const { origin, w1, w2 } = validation.waves;

  const entryLevel = w1.price;
  const stopLoss = w2.price;
  const takeProfit = fibonacciExtension(origin, w1, 1.618);

  if (currentPrice <= entryLevel) {
    return {
      signal: "WAIT",
      reason: "Esperando ruptura del máximo de onda 1",
      entryLevel,
      currentPrice
    };
  }

  const risk = currentPrice - stopLoss;
  const reward = takeProfit - currentPrice;
  const riskReward = reward / risk;

  if (risk <= 0) {
    return {
      signal: "NO_TRADE",
      reason: "Riesgo inválido: el precio actual está por debajo o igual al stop",
      entry: currentPrice,
      stopLoss,
      takeProfit,
      risk,
      reward,
      riskReward: null
    };
  }

  if (riskReward < 2) {
    return {
      signal: "NO_TRADE",
      reason: "Relación riesgo/beneficio insuficiente",
      entry: currentPrice,
      stopLoss,
      takeProfit,
      risk,
      reward,
      riskReward
    };
  }

  return {
    signal: "BUY",
    reason: "Ruptura de onda 1: posible inicio de onda 3",
    entry: currentPrice,
    stopLoss,
    takeProfit,
    risk,
    reward,
    riskReward
  };
}