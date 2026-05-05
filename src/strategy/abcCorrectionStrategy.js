import { calculateAbcTakeProfit } from "../risk/takeProfit.js";

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