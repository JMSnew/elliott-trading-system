/**
 * Funciones para calcular la cantidad de posición según el riesgo permitido.
 *
 * @module risk/positionQuantity
 */

/**
 * Calcula la cantidad de unidades que se pueden comprar según el precio de entrada,
 * el stop loss y el riesgo monetario asignado a una capa.
 *
 * La función calcula primero el riesgo por unidad:
 *
 * riskPerUnit = entryPrice - stopLoss
 *
 * Después calcula la cantidad:
 *
 * quantity = layerRiskAmount / riskPerUnit
 *
 * Esta función está pensada para operaciones long, donde el stop loss debe estar
 * por debajo del precio de entrada.
 *
 * @param {number} entryPrice - Precio de entrada de la operación.
 * @param {number} stopLoss - Precio del stop loss.
 * @param {number} layerRiskAmount - Riesgo monetario asignado a la capa.
 * @returns {Object} Resultado del cálculo de cantidad de posición.
 * @returns {boolean} returns.valid - Indica si el cálculo es válido.
 * @returns {string} [returns.reason] - Motivo por el que el cálculo no es válido.
 * @returns {number} [returns.entryPrice] - Precio de entrada utilizado.
 * @returns {number} [returns.stopLoss] - Stop loss utilizado.
 * @returns {number} [returns.layerRiskAmount] - Riesgo monetario usado para la capa.
 * @returns {number} [returns.riskPerUnit] - Riesgo asumido por cada unidad.
 * @returns {number} [returns.quantity] - Cantidad de unidades a comprar.
 * @returns {number} [returns.positionValue] - Valor total aproximado de la posición.
 *
 * @example
 * const position = calculatePositionQuantity(65000, 64000, 20);
 *
 * console.log(position);
 * // {
 * //   valid: true,
 * //   entryPrice: 65000,
 * //   stopLoss: 64000,
 * //   layerRiskAmount: 20,
 * //   riskPerUnit: 1000,
 * //   quantity: 0.02,
 * //   positionValue: 1300
 * // }
 */
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