/**
 * Aplicación principal del sistema de trading.
 *
 * Este archivo conecta todos los módulos del sistema:
 *
 * - Descarga velas desde Binance.
 * - Calcula swings usando ZigZag.
 * - Filtra swings fuertes.
 * - Detecta impulsos Elliott.
 * - Detecta correcciones ABC ZigZag y Flat.
 * - Busca una corrección activa después del impulso.
 * - Genera señales de trading.
 * - Calcula tamaño de capa y cantidad de posición.
 * - Guarda la señal final en un archivo JSON.
 *
 * @module app
 */

import { calculateZigZag } from "./indicators/zigzag.js";
import { detectBullishImpulse } from "./elliott/detectImpulse.js";
import { detectAllBullishZigZagCorrections } from "./elliott/detectAllZigZagCorrections.js";
import { detectFlatCorrection } from "./elliott/detectFlatCorrection.js";
import { generateAbcCorrectionSignal } from "./strategy/abcCorrectionStrategy.js";
import { calculateLayerSize } from "./layers/positionSizing.js";
import { calculatePositionQuantity } from "./risk/positionQuantity.js";
import { calculateAbcTakeProfit } from "./risk/takeProfit.js";
import { fetchCandles } from "./data/fetchCandles.js";
import { logSignal } from "./utils/signalLogger.js";
import { filterStrongSwings } from "./analysis/filterSwings.js";

/**
 * Busca la corrección ABC ZigZag activa más reciente después de un impulso Elliott válido.
 *
 * La función recibe todas las correcciones detectadas, el impulso validado y el precio actual.
 * Después filtra únicamente las correcciones que:
 *
 * - Empiezan después del final de la onda 5 del impulso.
 * - Tienen take profit válido.
 * - Todavía no han superado el TP3.
 *
 * Finalmente devuelve la corrección más reciente según el índice de la onda C.
 *
 * @param {Array<Object>} corrections - Lista de correcciones ABC ZigZag detectadas.
 * @param {Object} impulse - Resultado de la detección del impulso Elliott.
 * @param {boolean} impulse.valid - Indica si el impulso es válido.
 * @param {Object} impulse.waves - Ondas del impulso.
 * @param {Object} impulse.waves.w5 - Quinta onda del impulso.
 * @param {number} impulse.waves.w5.index - Índice de la onda 5.
 * @param {number} currentPrice - Precio actual del mercado.
 * @returns {Object|null} Corrección activa más reciente o null si no existe ninguna válida.
 *
 * @example
 * const activeCorrection = findActiveCorrectionAfterImpulse(
 *   allCorrections,
 *   impulse,
 *   currentPrice
 * );
 *
 * if (!activeCorrection) {
 *   console.log("No hay corrección activa");
 * }
 */
function findActiveCorrectionAfterImpulse(corrections, impulse, currentPrice) {
  if (!impulse.valid) return null;

  const impulseEndIndex = impulse.waves.w5.index;

  const validCorrections = corrections
    .filter(correction => {
      const correctionStartIndex = correction.correction.start.index;
      return correctionStartIndex >= impulseEndIndex;
    })
    .map(correction => {
      const takeProfit = calculateAbcTakeProfit(correction);

      return {
        ...correction,
        takeProfit
      };
    })
    .filter(correction => {
      if (!correction.takeProfit.valid) return false;

      const tp3 = correction.takeProfit.levels.tp3;

      return currentPrice <= tp3;
    })
    .sort((a, b) => b.correction.waveC.index - a.correction.waveC.index);

  return validCorrections[0] || null;
}

/**
 * Ejecuta el flujo principal del sistema de trading.
 *
 * Flujo general:
 *
 * 1. Define configuración del mercado y gestión de riesgo.
 * 2. Descarga velas desde Binance.
 * 3. Calcula swings con ZigZag.
 * 4. Filtra swings fuertes.
 * 5. Detecta impulso Elliott alcista.
 * 6. Detecta correcciones ABC ZigZag y Flat.
 * 7. Comprueba si existe una corrección activa después del impulso.
 * 8. Genera una señal de trading basada en la corrección ABC.
 * 9. Calcula tamaño de posición si hay señal de compra.
 * 10. Guarda el resultado en signals/signals.json.
 *
 * @async
 * @returns {Promise<void>} No devuelve ningún valor. Ejecuta el sistema y guarda/loguea resultados.
 *
 * @example
 * main().catch(error => {
 *   console.error("Error ejecutando el sistema:", error.message);
 * });
 */
async function main() {
  const symbol = "BTCUSDT";
  const timeframe = "1h";
  const candlesLimit = 500;

  const accountBalance = 10000;
  const riskPercent = 1;
  const profile = "balanced";

  const candles = await fetchCandles(symbol, timeframe, candlesLimit);

  const swings = calculateZigZag(candles, 1);
  const strongSwings = filterStrongSwings(swings, 1500);

  const impulse = detectBullishImpulse(strongSwings);
  const allCorrections = detectAllBullishZigZagCorrections(strongSwings);
  const flatCorrection = detectFlatCorrection(strongSwings);

  const currentPrice = candles[candles.length - 1].close;

  console.log("Swings fuertes:", strongSwings);
  console.log("Impulso Elliott:", impulse);
  console.log("Correcciones ABC ZigZag detectadas:", allCorrections.length);
  console.log("Corrección Flat:", flatCorrection);
  console.log("Precio actual:", currentPrice);

  if (!impulse.valid) {
    console.log("NO_TRADE: no hay impulso alcista válido.");

    logSignal({
      symbol,
      timeframe,
      strategy: "IMPULSE_CONTEXT",
      signal: "NO_TRADE",
      price: currentPrice,
      reason: impulse.reason,
      flatCorrection
    });

    return;
  }

  if (allCorrections.length === 0) {
    console.log("NO_TRADE: hay impulso, pero no hay correcciones ABC ZigZag válidas.");

    logSignal({
      symbol,
      timeframe,
      strategy: "ABC_AFTER_IMPULSE",
      signal: "NO_TRADE",
      price: currentPrice,
      impulse: impulse.waves,
      flatCorrection,
      reason: "No se detectaron correcciones ABC ZigZag válidas"
    });

    return;
  }

  const activeCorrection = findActiveCorrectionAfterImpulse(
    allCorrections,
    impulse,
    currentPrice
  );

  if (!activeCorrection) {
    console.log("NO_TRADE: no hay ABC ZigZag activa después del impulso.");
    console.log(
      "Motivo: las correcciones detectadas ya están vencidas o no pertenecen al impulso."
    );

    logSignal({
      symbol,
      timeframe,
      strategy: "ABC_AFTER_IMPULSE",
      signal: "NO_TRADE",
      price: currentPrice,
      impulse: impulse.waves,
      flatCorrection,
      correctionsDetected: allCorrections.length,
      reason: "No hay corrección ABC ZigZag activa después del impulso"
    });

    return;
  }

  console.log("ABC ZigZag activa encontrada:", activeCorrection.correction);
  console.log("Take Profit ABC:", activeCorrection.takeProfit);

  const abcSignal = generateAbcCorrectionSignal(activeCorrection, currentPrice);

  console.log("Señal ABC post-impulso:", abcSignal);

  let position = null;

  if (abcSignal.signal === "POST_TURN_BUY") {
    const postTurnLayer = calculateLayerSize(
      accountBalance,
      "postTurn",
      riskPercent,
      profile
    );

    position = calculatePositionQuantity(
      abcSignal.entry,
      abcSignal.stopLoss,
      postTurnLayer.layerRiskAmount
    );

    console.log("Cantidad a comprar:", position);
  }

  if (abcSignal.signal === "INITIAL_BUY") {
    const initialLayer = calculateLayerSize(
      accountBalance,
      "initial",
      riskPercent,
      profile
    );

    position = calculatePositionQuantity(
      abcSignal.entry,
      abcSignal.stopLoss,
      initialLayer.layerRiskAmount
    );

    console.log("Cantidad a comprar:", position);
  }

  logSignal({
    symbol,
    timeframe,
    strategy: "ABC_AFTER_IMPULSE_ACTIVE",
    signal: abcSignal.signal,
    price: currentPrice,
    entry: abcSignal.entry || null,
    stopLoss: abcSignal.stopLoss || null,
    confirmationLevel: abcSignal.confirmationLevel || null,
    takeProfit: abcSignal.takeProfit || activeCorrection.takeProfit,
    impulse: impulse.waves,
    correction: activeCorrection.correction,
    flatCorrection,
    position
  });

  console.log(
    "Capa inicial:",
    calculateLayerSize(accountBalance, "initial", riskPercent, profile)
  );

  console.log(
    "Capa post-turno:",
    calculateLayerSize(accountBalance, "postTurn", riskPercent, profile)
  );

  console.log(
    "Capa complemento:",
    calculateLayerSize(accountBalance, "addOn", riskPercent, profile)
  );
}

/**
 * Punto de entrada de la aplicación.
 *
 * Ejecuta la función principal y captura cualquier error inesperado
 * durante la ejecución del sistema.
 */
main().catch(error => {
  console.error("Error ejecutando el sistema:", error.message);
});