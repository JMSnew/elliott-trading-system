export function calculatePositionQuantity(entryPrice, stopLoss, layerRiskAmount) {
  const riskPerUnit = entryPrice - stopLoss;

  if (riskPerUnit <= 0) {
    return {
      valid: false,
      reason: "Riesgo inválido: el stop debe estar por debajo de la entrada"
    };
  }

  const quantity = layerRiskAmount / riskPerUnit;
  const positionValue = quantity * entryPrice;

  return {
    valid: true,
    entryPrice,
    stopLoss,
    layerRiskAmount,
    riskPerUnit,
    quantity,
    positionValue
  };
}