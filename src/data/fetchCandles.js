/**
 * Funciones para obtener datos de velas desde la API de Binance.
 *
 * @module data/fetchCandles
 */

import axios from "axios";

/**
 * Obtiene velas históricas de mercado desde Binance y las convierte
 * a un formato más fácil de usar dentro del sistema de trading.
 *
 * Cada vela contiene precios de apertura, máximo, mínimo, cierre y volumen.
 *
 * @async
 * @param {string} [symbol="BTCUSDT"] - Par de trading a consultar. Ejemplo: "BTCUSDT".
 * @param {string} [interval="1h"] - Temporalidad de las velas. Ejemplo: "1m", "5m", "15m", "1h", "4h", "1d".
 * @param {number} [limit=100] - Cantidad máxima de velas a solicitar.
 * @returns {Promise<Array<Object>>} Lista de velas normalizadas.
 * @returns {number} returns[].openTime - Tiempo de apertura de la vela en milisegundos.
 * @returns {number} returns[].open - Precio de apertura.
 * @returns {number} returns[].high - Precio máximo.
 * @returns {number} returns[].low - Precio mínimo.
 * @returns {number} returns[].close - Precio de cierre.
 * @returns {number} returns[].volume - Volumen negociado.
 *
 * @example
 * const candles = await fetchCandles("BTCUSDT", "1h", 100);
 *
 * console.log(candles[0]);
 * // {
 * //   openTime: 1710000000000,
 * //   open: 68000,
 * //   high: 68500,
 * //   low: 67500,
 * //   close: 68200,
 * //   volume: 1234.56
 * // }
 */
export async function fetchCandles(symbol = "BTCUSDT", interval = "1h", limit = 100) {
  const url = `https://api.binance.com/api/v3/klines`;

  const response = await axios.get(url, {
    params: {
      symbol,
      interval,
      limit
    }
  });

  return response.data.map(c => ({
    openTime: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5])
  }));
}