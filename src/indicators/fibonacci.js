/**
 * Funciones para calcular niveles Fibonacci usados en análisis técnico.
 *
 * @module indicators/fibonacci
 */

/**
 * Calcula una extensión Fibonacci a partir del origen y final de una onda.
 *
 * La extensión se calcula tomando el tamaño de la onda 1 y proyectándolo
 * desde el precio de origen usando un ratio Fibonacci.
 *
 * Fórmula:
 *
 * extension = origin.price + (w1.price - origin.price) * ratio
 *
 * @param {Object} origin - Punto de origen de la onda.
 * @param {number} origin.price - Precio del origen.
 * @param {Object} w1 - Punto final de la onda 1.
 * @param {number} w1.price - Precio final de la onda 1.
 * @param {number} [ratio=1.618] - Ratio Fibonacci usado para la extensión.
 * @returns {number} Precio objetivo calculado por extensión Fibonacci.
 *
 * @example
 * const target = fibonacciExtension(
 *   { price: 60000 },
 *   { price: 65000 },
 *   1.618
 * );
 *
 * console.log(target);
 * // 68090
 */
export function fibonacciExtension(origin, w1, ratio = 1.618) {
  const wave1Size = w1.price - origin.price;

  return origin.price + wave1Size * ratio;
}

/**
 * Calcula un retroceso Fibonacci entre un máximo y un mínimo.
 *
 * El retroceso se calcula tomando el rango entre el high y el low,
 * y restando al high una proporción de ese rango.
 *
 * Fórmula:
 *
 * retracement = high.price - (high.price - low.price) * ratio
 *
 * @param {Object} high - Swing máximo usado como referencia.
 * @param {number} high.price - Precio máximo.
 * @param {Object} low - Swing mínimo usado como referencia.
 * @param {number} low.price - Precio mínimo.
 * @param {number} [ratio=0.618] - Ratio Fibonacci usado para el retroceso.
 * @returns {number} Precio del nivel de retroceso Fibonacci.
 *
 * @example
 * const level = fibonacciRetracement(
 *   { price: 70000 },
 *   { price: 60000 },
 *   0.618
 * );
 *
 * console.log(level);
 * // 63820
 */
export function fibonacciRetracement(high, low, ratio = 0.618) {
  const range = high.price - low.price;

  return high.price - range * ratio;
}