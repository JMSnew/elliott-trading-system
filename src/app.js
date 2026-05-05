import { calculateZigZag } from "./indicators/zigzag.js";
import { detectBullishImpulse } from "./elliott/detectImpulse.js";
import { detectBullishZigZagCorrection } from "./elliott/detectZigZagCorrection.js";
import { fibonacciExtension } from "./indicators/fibonacci.js";
import { generateWave3Signal } from "./strategy/wave3Strategy.js";
import { generateAbcCorrectionSignal } from "./strategy/abcCorrectionStrategy.js";
import { calculateLayerSize } from "./layers/positionSizing.js";
import { calculatePositionQuantity } from "./risk/positionQuantity.js";
import { calculateAbcTakeProfit } from "./risk/takeProfit.js";
import { fetchCandles } from "./data/fetchCandles.js";
import { logSignal } from "./utils/signalLogger.js";
import { filterStrongSwings } from "./analysis/filterSwings.js";

async function main() {
  const candles = await fetchCandles("BTCUSDT", "1h", 500);

  const swings = calculateZigZag(candles, 1);
  const strongSwings = filterStrongSwings(swings, 1500);

  const validation = detectBullishImpulse(strongSwings);
  const correction = detectBullishZigZagCorrection(strongSwings);

  console.log("Swings detectados:", swings);
  console.log("Swings fuertes:", strongSwings);
  console.log("Validación Elliott:", validation);
  console.log("Corrección ZigZag:", correction);

  const accountBalance = 10000;
  const currentPrice = candles[candles.length - 1].close;

  if (!validation.valid && !correction.valid) {
    console.log("No hay patrón válido:");
    console.log("- Impulso:", validation.reason);
    console.log("- Corrección:", correction.reason);

    logSignal({
      type: "NO_PATTERN",
      signal: "NO_TRADE",
      price: currentPrice,
      impulseReason: validation.reason,
      correctionReason: correction.reason
    });

    return;
  }

  if (!validation.valid && correction.valid) {
    console.log("No hay impulso, pero sí hay corrección válida.");
    console.log("Posible zona de vigilancia para giro alcista tras onda C.");
    console.log("Corrección detectada:", correction.correction);

    const abcSignal = generateAbcCorrectionSignal(correction, currentPrice);
    const takeProfit = calculateAbcTakeProfit(correction);

    console.log("Precio actual:", currentPrice);
    console.log("Señal ABC:", abcSignal);
    console.log("Take Profit ABC:", takeProfit);

    logSignal({
      type: "ABC",
      signal: abcSignal.signal,
      price: currentPrice,
      entry: abcSignal.entry || null,
      stopLoss: abcSignal.stopLoss || null,
      takeProfit: abcSignal.takeProfit || takeProfit,
      correction: correction.correction
    });

    if (abcSignal.signal === "POST_TURN_BUY") {
      const postTurnLayer = calculateLayerSize(
        accountBalance,
        "postTurn",
        1,
        "balanced"
      );

      const position = calculatePositionQuantity(
        abcSignal.entry,
        abcSignal.stopLoss,
        postTurnLayer.layerRiskAmount
      );

      console.log("Cantidad a comprar:", position);
    }

    console.log(
      "Capa inicial:",
      calculateLayerSize(accountBalance, "initial", 1, "balanced")
    );

    console.log(
      "Capa post-turno:",
      calculateLayerSize(accountBalance, "postTurn", 1, "balanced")
    );

    console.log(
      "Capa complemento:",
      calculateLayerSize(accountBalance, "addOn", 1, "balanced")
    );

    return;
  }

  const target = fibonacciExtension(
    validation.waves.origin,
    validation.waves.w1,
    1.618
  );

  console.log("Objetivo Fibonacci 1.618:", target);

  const signal = generateWave3Signal(validation, currentPrice);

  console.log("Precio actual:", currentPrice);
  console.log("Señal onda 3:", signal);

  logSignal({
    type: "IMPULSE",
    signal: signal.signal,
    price: currentPrice,
    entry: signal.entry || null,
    stopLoss: signal.stopLoss || null,
    target,
    waves: validation.waves
  });

  console.log(
    "Capa inicial:",
    calculateLayerSize(accountBalance, "initial", 1, "balanced")
  );

  console.log(
    "Capa post-turno:",
    calculateLayerSize(accountBalance, "postTurn", 1, "balanced")
  );

  console.log(
    "Capa complemento:",
    calculateLayerSize(accountBalance, "addOn", 1, "balanced")
  );
}

main().catch(error => {
  console.error("Error ejecutando el sistema:", error.message);
});