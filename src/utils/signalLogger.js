/**
 * Utilidades para guardar señales de trading en un archivo JSON.
 *
 * @module utils/signalLogger
 */

import fs from "fs";
import path from "path";

/**
 * Ruta absoluta del archivo donde se guardarán las señales generadas.
 *
 * El archivo usado es:
 *
 * signals/signals.json
 *
 * @constant
 * @type {string}
 */
const filePath = path.resolve("signals/signals.json");

/**
 * Guarda una señal de trading en el archivo signals/signals.json.
 *
 * La función lee las señales existentes, añade una nueva señal con timestamp
 * y vuelve a escribir el archivo JSON con el historial actualizado.
 *
 * Si el archivo todavía no existe, crea una lista nueva de señales.
 *
 * @param {Object} data - Datos de la señal que se quiere guardar.
 * @param {string} [data.signal] - Tipo de señal generada. Ejemplo: "BUY", "WAIT", "NO_TRADE".
 * @param {string} [data.reason] - Motivo o explicación de la señal.
 * @param {number} [data.entry] - Precio de entrada.
 * @param {number} [data.stopLoss] - Precio de stop loss.
 * @param {number} [data.takeProfit] - Precio objetivo.
 * @param {number} [data.riskReward] - Relación riesgo/beneficio.
 * @returns {void} No devuelve ningún valor. Guarda la señal en el archivo JSON.
 *
 * @example
 * logSignal({
 *   signal: "BUY",
 *   reason: "Ruptura de onda 1: posible inicio de onda 3",
 *   entry: 64100,
 *   stopLoss: 63000,
 *   takeProfit: 66472,
 *   riskReward: 2.16
 * });
 *
 * // Se añade al archivo signals/signals.json:
 * // {
 * //   "timestamp": "2025-01-01T12:00:00.000Z",
 * //   "signal": "BUY",
 * //   "reason": "Ruptura de onda 1: posible inicio de onda 3",
 * //   "entry": 64100,
 * //   "stopLoss": 63000,
 * //   "takeProfit": 66472,
 * //   "riskReward": 2.16
 * // }
 */
export function logSignal(data) {
  try {
    let signals = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      signals = raw ? JSON.parse(raw) : [];
    }

    const newSignal = {
      timestamp: new Date().toISOString(),
      ...data
    };

    signals.push(newSignal);

    fs.writeFileSync(filePath, JSON.stringify(signals, null, 2));

    console.log("Señal guardada en signals.json");
  } catch (error) {
    console.error("Error guardando señal:", error.message);
  }
}