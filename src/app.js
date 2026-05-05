import { calculateZigZag } from "./indicators/zigzag.js";
import { detectBullishImpulse } from "./elliott/detectImpulse.js";
import { detectAllBullishZigZagCorrections } from "./elliott/detectAllZigZagCorrections.js";
import { generateAbcCorrectionSignal } from "./strategy/abcCorrectionStrategy.js";
import { calculateLayerSize } from "./layers/positionSizing.js";
import { calculatePositionQuantity } from "./risk/positionQuantity.js";
import { calculateAbcTakeProfit } from "./risk/takeProfit.js";
import { fetchCandles } from "./data/fetchCandles.js";
import { logSignal } from "./utils/signalLogger.js";
import { filterStrongSwings } from "./analysis/filterSwings.js";

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

  const currentPrice = candles[candles.length - 1].close;

  console.log("Swings fuertes:", strongSwings);
  console.log("Impulso Elliott:", impulse);
  console.log("Correcciones ABC detectadas:", allCorrections.length);
  console.log("Precio actual:", currentPrice);

  if (!impulse.valid) {
    console.log("NO_TRADE: no hay impulso alcista válido.");

    logSignal({
      symbol,
      timeframe,
      strategy: "IMPULSE_CONTEXT",
      signal: "NO_TRADE",
      price: currentPrice,
      reason: impulse.reason
    });

    return;
  }

  if (allCorrections.length === 0) {
    console.log("NO_TRADE: hay impulso, pero no hay correcciones ABC válidas.");

    logSignal({
      symbol,
      timeframe,
      strategy: "ABC_AFTER_IMPULSE",
      signal: "NO_TRADE",
      price: currentPrice,
      impulse: impulse.waves,
      reason: "No se detectaron correcciones ABC"
    });

    return;
  }

  const activeCorrection = findActiveCorrectionAfterImpulse(
    allCorrections,
    impulse,
    currentPrice
  );

  if (!activeCorrection) {
    console.log("NO_TRADE: no hay ABC activa después del impulso.");
    console.log("Motivo: las correcciones detectadas ya están vencidas o no pertenecen al impulso.");

    logSignal({
      symbol,
      timeframe,
      strategy: "ABC_AFTER_IMPULSE",
      signal: "NO_TRADE",
      price: currentPrice,
      impulse: impulse.waves,
      correctionsDetected: allCorrections.length,
      reason: "No hay corrección ABC activa después del impulso"
    });

    return;
  }

  console.log("ABC activa encontrada:", activeCorrection.correction);
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

main().catch(error => {
  console.error("Error ejecutando el sistema:", error.message);
});