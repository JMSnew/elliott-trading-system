/**
 * Funciones para detectar correcciones Elliott A-B-C de tipo Flat.
 *
 * @module elliott/detectFlatCorrection
 */

/**
 * Detecta una corrección Flat alcista dentro de una lista de swings.
 *
 * Una corrección Flat alcista es una estructura correctiva A-B-C donde:
 *
 * - El punto inicial es un swing high.
 * - La onda A baja hasta un swing low.
 * - La onda B recupera gran parte de la onda A.
 * - La onda C vuelve a caer de forma similar al tamaño de la onda A.
 *
 * La secuencia esperada es:
 *
 * - start: high
 * - waveA: low
 * - waveB: high
 * - waveC: low
 *
 * Reglas usadas:
 *
 * - La onda B debe recuperar entre el 90% y el 105% de la onda A.
 * - La onda C debe proyectar entre el 80% y el 120% del tamaño de la onda A.
 *
 * @param {Array<Object>} swings - Lista de swings del mercado.
 * @param {string} swings[].type - Tipo de swing. Normalmente "high" o "low".
 * @param {number} swings[].price - Precio del swing.
 * @returns {Object} Resultado de la detección Flat.
 * @returns {boolean} returns.valid - Indica si se encontró una corrección Flat válida.
 * @returns {string} [returns.pattern] - Nombre del patrón detectado.
 * @returns {Object} [returns.correction] - Estructura completa de la corrección.
 * @returns {Object} [returns.correction.start] - Swing inicial de la corrección.
 * @returns {Object} [returns.correction.waveA] - Swing correspondiente a la onda A.
 * @returns {Object} [returns.correction.waveB] - Swing correspondiente a la onda B.
 * @returns {Object} [returns.correction.waveC] - Swing correspondiente a la onda C.
 * @returns {Object} [returns.fibonacci] - Ratios Fibonacci calculados.
 * @returns {number} [returns.fibonacci.bRetracement] - Retroceso de la onda B respecto a la onda A.
 * @returns {number} [returns.fibonacci.cProjection] - Proyección de la onda C respecto a la onda A.
 * @returns {string} [returns.reason] - Motivo por el que no se encontró una corrección válida.
 *
 * @example
 * const result = detectFlatCorrection([
 *   { type: "high", price: 70000 },
 *   { type: "low", price: 65000 },
 *   { type: "high", price: 69700 },
 *   { type: "low", price: 64500 }
 * ]);
 *
 * console.log(result);
 * // {
 * //   valid: true,
 * //   pattern: "bullish_flat",
 * //   correction: {
 * //     start: { type: "high", price: 70000 },
 * //     waveA: { type: "low", price: 65000 },
 * //     waveB: { type: "high", price: 69700 },
 * //     waveC: { type: "low", price: 64500 }
 * //   },
 * //   fibonacci: {
 * //     bRetracement: 0.94,
 * //     cProjection: 1.04
 * //   }
 * // }
 */
export function detectFlatCorrection(swings) {
  if (swings.length < 4) {
    return {
      valid: false,
      reason: "No hay suficientes swings"
    };
  }

  for (let i = 0; i <= swings.length - 4; i++) {
    const start = swings[i];
    const waveA = swings[i + 1];
    const waveB = swings[i + 2];
    const waveC = swings[i + 3];

    // FLAT ALCISTA
    if (
      start.type === "high" &&
      waveA.type === "low" &&
      waveB.type === "high" &&
      waveC.type === "low"
    ) {
      const aSize = start.price - waveA.price;

      if (aSize <= 0) continue;

      const bRetracement =
        (waveB.price - waveA.price) / aSize;

      // B debe recuperar 90%-105%
      const validB =
        bRetracement >= 0.90 &&
        bRetracement <= 1.05;

      if (!validB) continue;

      const cSize = waveB.price - waveC.price;

      const cProjection = cSize / aSize;

      // C ≈ 100% de A
      const validC =
        cProjection >= 0.8 &&
        cProjection <= 1.2;

      if (!validC) continue;

      return {
        valid: true,
        pattern: "bullish_flat",
        correction: {
          start,
          waveA,
          waveB,
          waveC
        },
        fibonacci: {
          bRetracement,
          cProjection
        }
      };
    }
  }

  return {
    valid: false,
    reason: "No se encontró Flat válido"
  };
}