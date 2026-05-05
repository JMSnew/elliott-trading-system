import { fibonacciExtension } from "../indicators/fibonacci.js";

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