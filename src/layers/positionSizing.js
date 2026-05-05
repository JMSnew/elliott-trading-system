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

export function getLayerProfile(profile = "balanced") {
  return layerProfiles[profile];
}