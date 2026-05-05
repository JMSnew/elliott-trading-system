export function fibonacciExtension(origin, w1, ratio = 1.618) {
  const wave1Size = w1.price - origin.price;

  return origin.price + wave1Size * ratio;
}

export function fibonacciRetracement(high, low, ratio = 0.618) {
  const range = high.price - low.price;

  return high.price - range * ratio;
}