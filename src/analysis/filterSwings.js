/**
 * Utilidades para analizar y filtrar swings del mercado.
 *
 * @module analysis/filterSwings
 */

/**
 * Filtra una lista de swings y conserva solo aquellos cuya diferencia de precio
 * respecto al último swing aceptado sea mayor o igual a una distancia mínima.
 *
 * Esta función ayuda a ignorar movimientos pequeños del precio y quedarse
 * únicamente con swings relevantes para el análisis técnico.
 *
 * @param {Array<Object>} swings - Lista de swings detectados.
 * @param {number} swings[].price - Precio asociado al swing.
 * @param {number} [minDistance=1000] - Distancia mínima entre swings aceptados.
 * @returns {Array<Object>} Lista de swings filtrados.
 *
 * @example
 * const swings = [
 *   { price: 10000 },
 *   { price: 10500 },
 *   { price: 11200 }
 * ];
 *
 * filterStrongSwings(swings, 1000);
 * // Devuelve: [{ price: 10000 }, { price: 11200 }]
 */
export function filterStrongSwings(swings = [], minDistance = 1000) {
  if (!swings.length) return [];

  const filtered = [swings[0]];

  for (let i = 1; i < swings.length; i++) {
    const last = filtered[filtered.length - 1];
    const current = swings[i];

    const distance = Math.abs(current.price - last.price);

    if (distance >= minDistance) {
      filtered.push(current);
    }
  }

  return filtered;
}