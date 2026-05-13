/**
 * Funciones para detectar correcciones Elliott A-B-C de tipo zigzag alcista.
 *
 * @module elliott/detectAllBullishZigZagCorrections
 */

import { validateAbcFibonacci } from "./validateAbcFibonacci.js";

/**
 * Detecta todas las correcciones A-B-C de tipo zigzag alcista dentro de una lista de swings.
 *
 * Una corrección zigzag alcista se interpreta como una estructura bajista correctiva
 * dentro de un contexto donde se busca una posible continuación alcista después de la onda C.
 *
 * La secuencia esperada es:
 *
 * - Punto inicial: high
 * - Onda A: low
 * - Onda B: high
 * - Onda C: low
 *
 * Además, la función valida que:
 *
 * - La onda A rompa por debajo del punto inicial.
 * - La onda B no supere el punto inicial.
 * - La onda C rompa por debajo de la onda A.
 * - La estructura cumpla las reglas de Fibonacci definidas en validateAbcFibonacci.
 *
 * @param {Array<Object>} swings - Lista de swings del mercado.
 * @param {string} swings[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} swings[].price - Precio del swing.
 * @returns {Array<Object>} Lista de correcciones zigzag alcistas detectadas y validadas.
 * @returns {boolean} returns[].valid - Indica si el patrón fue detectado como válido.
 * @returns {string} returns[].pattern - Nombre del patrón detectado.
 * @returns {Object} returns[].correction - Estructura completa de la corrección.
 * @returns {Object} returns[].correction.start - Swing inicial de la corrección.
 * @returns {Object} returns[].correction.waveA - Swing correspondiente a la onda A.
 * @returns {Object} returns[].correction.waveB - Swing correspondiente a la onda B.
 * @returns {Object} returns[].correction.waveC - Swing correspondiente a la onda C.
 * @returns {string} returns[].reason - Motivo por el que se considera una corrección válida.
 * @returns {Object} returns[].fibonacci - Resultado de la validación Fibonacci.
 *
 * @example
 * const corrections = detectAllBullishZigZagCorrections([
 *   { type: "high", price: 70000 },
 *   { type: "low", price: 65000 },
 *   { type: "high", price: 68000 },
 *   { type: "low", price: 62000 }
 * ]);
 *
 * console.log(corrections);
 * // [
 * //   {
 * //     valid: true,
 * //     pattern: "bullish_zigzag_correction",
 * //     correction: {
 * //       start: { type: "high", price: 70000 },
 * //       waveA: { type: "low", price: 65000 },
 * //       waveB: { type: "high", price: 68000 },
 * //       waveC: { type: "low", price: 62000 }
 * //     },
 * //     reason: "Corrección A-B-C tipo zigzag detectada",
 * //     fibonacci: { ... }
 * //   }
 * // ]
 */
export function detectAllBullishZigZagCorrections(swings) {
  const corrections = [];

  if (!swings || swings.length < 4) {
    return corrections;
  }

  for (let i = 0; i <= swings.length - 4; i++) {
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

    const candidate = {
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

    const fibonacciValidation = validateAbcFibonacci(candidate);

    if (!fibonacciValidation.valid) continue;

    corrections.push({
      ...candidate,
      fibonacci: fibonacciValidation
    });
  }

  return corrections;
}