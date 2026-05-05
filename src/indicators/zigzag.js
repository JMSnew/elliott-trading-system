export function calculateZigZag(candles, deviation = 5) {
  if (!candles || candles.length < 3) {
    return [];
  }

  const swings = [];
  let lastPivot = candles[0];
  let trend = null;

  for (let i = 1; i < candles.length; i++) {
    const candle = candles[i];

    const changeFromPivot =
      ((candle.close - lastPivot.close) / lastPivot.close) * 100;

    if (trend === null) {
      if (Math.abs(changeFromPivot) >= deviation) {
        trend = changeFromPivot > 0 ? "up" : "down";
        lastPivot = candle;
      }
      continue;
    }

    if (trend === "up") {
      if (candle.close > lastPivot.close) {
        lastPivot = candle;
      } else if (changeFromPivot <= -deviation) {
        swings.push({
          type: "high",
          index: i,
          price: lastPivot.close,
          candle: lastPivot
        });

        trend = "down";
        lastPivot = candle;
      }
    }

    if (trend === "down") {
      if (candle.close < lastPivot.close) {
        lastPivot = candle;
      } else if (changeFromPivot >= deviation) {
        swings.push({
          type: "low",
          index: i,
          price: lastPivot.close,
          candle: lastPivot
        });

        trend = "up";
        lastPivot = candle;
      }
    }
  }

  return swings;
}