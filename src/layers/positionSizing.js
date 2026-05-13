/**
 * Perfiles y funciones para calcular el tamaño de entrada por capas.
 *
 * @module layers/positionSizing
 */

/**
 * Perfiles de distribución de riesgo por capas.
 *
 * Cada perfil define qué porcentaje del riesgo total se asigna a cada capa:
 *
 * - initial: entrada inicial.
 * - postTurn: entrada después de confirmación o giro.
 * - addOn: entrada adicional.
 *
 * @constant
 * @type {Object}
 */
const layerProfiles = {
  conservative: {
    initial: 0.15,
    postTurn: 0.8,
    addOn: 0.05
  },
  balanced: {
    initial: 0.2,
    postTurn: 0.7,
    addOn: 0.1
  },
  aggressive: {
    initial: 0.2,
    postTurn: 0.6,
    addOn: 0.2
  }
};

/**
 * Calcula cuánto riesgo monetario corresponde a una capa concreta de entrada.
 *
 * La función parte del balance total de la cuenta y del porcentaje de riesgo
 * permitido por operación. Después reparte ese riesgo usando el peso de la capa
 * según el perfil seleccionado.
 *
 * Perfiles disponibles:
 *
 * - "conservative"
 * - "balanced"
 * - "aggressive"
 *
 * Capas disponibles:
 *
 * - "initial"
 * - "postTurn"
 * - "addOn"
 *
 * @param {number} accountBalance - Balance total de la cuenta.
 * @param {string} layer - Capa a calcular. Puede ser "initial", "postTurn" o "addOn".
 * @param {number} [riskPercent=1] - Porcentaje de riesgo total sobre el balance.
 * @param {string} [profile="balanced"] - Perfil de distribución de riesgo.
 * @returns {Object} Resultado del cálculo de tamaño por capa.
 * @returns {string} returns.layer - Capa calculada.
 * @returns {string} returns.profile - Perfil utilizado.
 * @returns {number} returns.riskPercent - Porcentaje de riesgo usado.
 * @returns {number} returns.totalRiskAmount - Riesgo total monetario de la operación.
 * @returns {number} returns.layerWeight - Peso de la capa dentro del perfil.
 * @returns {number} returns.layerRiskAmount - Riesgo monetario asignado a esa capa.
 * @throws {Error} Si el perfil no existe.
 * @throws {Error} Si la capa no existe dentro del perfil seleccionado.
 *
 * @example
 * const layerSize = calculateLayerSize(10000, "initial", 1, "balanced");
 *
 * console.log(layerSize);
 * // {
 * //   layer: "initial",
 * //   profile: "balanced",
 * //   riskPercent: 1,
 * //   totalRiskAmount: 100,
 * //   layerWeight: 0.2,
 * //   layerRiskAmount: 20
 * // }
 */
export function calculateLayerSize(
  accountBalance,
  layer,
  riskPercent = 1,
  profile = "balanced"
) {
  const selectedProfile = layerProfiles[profile];

  if (!selectedProfile) {
    throw new Error(`Perfil no válido: ${profile}`);
  }

  if (!selectedProfile[layer]) {
    throw new Error(`Capa no válida: ${layer}`);
  }

  const totalRiskAmount = accountBalance * (riskPercent / 100);

  return {
    layer,
    profile,
    riskPercent,
    totalRiskAmount,
    layerWeight: selectedProfile[layer],
    layerRiskAmount: totalRiskAmount * selectedProfile[layer]
  };
}

/**
 * Obtiene un perfil de capas por su nombre.
 *
 * Sirve para consultar cómo se reparte el riesgo entre las diferentes capas
 * antes de calcular el tamaño de una entrada.
 *
 * @param {string} [profile="balanced"] - Nombre del perfil a obtener.
 * @returns {Object|undefined} Perfil de capas solicitado.
 *
 * @example
 * const profile = getLayerProfile("aggressive");
 *
 * console.log(profile);
 * // {
 * //   initial: 0.2,
 * //   postTurn: 0.6,
 * //   addOn: 0.2
 * // }
 */
export function getLayerProfile(profile = "balanced") {
  return layerProfiles[profile];
}