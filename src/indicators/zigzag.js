/**
 * Funciones para calcular swings usando el indicador ZigZag.
 *
 * @module indicators/zigzag
 */

/**
 * Calcula los swings principales del mercado usando una lógica tipo ZigZag.
 *
 * La función analiza una lista de velas y detecta puntos de giro relevantes
 * cuando el precio se mueve un porcentaje mínimo desde el último pivote.
 *
 * Si el precio sube más que el porcentaje de desviación, se considera que la
 * tendencia cambia a alcista. Si luego cae más que esa desviación desde el
 * último máximo, se registra un swing high.
 *
 * Del mismo modo, si la tendencia es bajista y el precio sube más que la
 * desviación desde el último mínimo, se registra un swing low.
 *
 * @param {Array<Object>} candles - Lista de velas del mercado.
 * @param {number} candles[].close - Precio de cierre de la vela.
 * @param {number} [deviation=5] - Porcentaje mínimo de cambio para detectar un nuevo swing.
 * @returns {Array<Object>} Lista de swings detectados.
 * @returns {string} returns[].type - Tipo de swing detectado: "high" o "low".
 * @returns {number} returns[].index - Índice de la vela donde se detectó el cambio de tendencia.
 * @returns {number} returns[].price - Precio del swing detectado.
 * @returns {Object} returns[].candle - Vela usada como pivote del swing.
 *
 * @example
 * const swings = calculateZigZag([
 *   { close: 100 },
 *   { close: 106 },
 *   { close: 110 },
 *   { close: 103 },
 *   { close: 98 },
 *   { close: 105 }
 * ], 5);
 *
 * console.log(swings);
 * // [
 * //   {
 * //     type: "high",
 * //     index: 3,
 * //     price: 110,
 * //     candle: { close: 110 }
 * //   },
 * //   {
 * //     type: "low",
 * //     index: 5,
 * //     price: 98,
 * //     candle: { close: 98 }
 * //   }
 * // ]
 */
export function calculateZigZag(candles, deviation = 5) {
  if (!candles || candles.length < 3) {
    return [];
  }

  const swings = [];
  let lastPivot = candles[0];
  let trend = null;

  for (let i = 1; i < candles.length; i++) {
    const candle = candles[i];

    const changeFromPivot =
      ((candle.close - lastPivot.close) / lastPivot.close) * 100;

    if (trend === null) {
      if (Math.abs(changeFromPivot) >= deviation) {
        trend = changeFromPivot > 0 ? "up" : "down";
        lastPivot = candle;
      }
      continue;
    }

    if (trend === "up") {
      if (candle.close > lastPivot.close) {
        lastPivot = candle;
      } else if (changeFromPivot <= -deviation) {
        swings.push({
          type: "high",
          index: i,
          price: lastPivot.close,
          candle: lastPivot
        });

        trend = "down";
        lastPivot = candle;
      }
    }

    if (trend === "down") {
      if (candle.close < lastPivot.close) {
        lastPivot = candle;
      } else if (changeFromPivot >= deviation) {
        swings.push({
          type: "low",
          index: i,
          price: lastPivot.close,
          candle: lastPivot
        });

        trend = "up";
        lastPivot = candle;
      }
    }
  }

  return swings;
}