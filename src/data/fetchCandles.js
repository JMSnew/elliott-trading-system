import axios from "axios";

export async function fetchCandles(symbol = "BTCUSDT", interval = "1h", limit = 100) {
  const url = `https://api.binance.com/api/v3/klines`;

  const response = await axios.get(url, {
    params: {
      symbol,
      interval,
      limit
    }
  });

  return response.data.map(c => ({
    openTime: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5])
  }));
}