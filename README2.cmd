cd C:\elliott-trading-system

@'
# Elliott Trading System

Sistema de trading en JavaScript/Node.js basado en:

- Ondas de Elliott
- Impulsos 1-2-3-4-5
- Correcciones ABC tipo ZigZag
- Fibonacci
- Entradas por capas
- Gestión de riesgo
- Registro de señales

Este sistema está siguiendo dos documentos base:

1. `Ondas Elliot.pdf`
   - Reglas de ondas motrices.
   - Reglas de impulsos.
   - Reglas de correcciones.
   - Patrones como impulso, diagonal, zigzag, flat, triángulo y combinaciones. :contentReference[oaicite:0]{index=0}

2. `Capas Trading.pdf`
   - Entrada inicial.
   - Entrada post-turno.
   - Entrada complemento.
   - Distribución del riesgo por capas.
   - Operar a favor de la tendencia predominante. :contentReference[oaicite:1]{index=1}

---

# 1. Estado actual del sistema

Actualmente el sistema:

- Descarga datos reales de Binance.
- Analiza `BTCUSDT` en temporalidad `1h`.
- Usa 500 velas.
- Detecta swings con ZigZag.
- Filtra swings fuertes.
- Detecta impulsos Elliott alcistas.
- Detecta correcciones ABC tipo ZigZag.
- Calcula objetivos Fibonacci.
- Calcula Take Profit ABC.
- Calcula Stop Loss.
- Calcula tamaño de posición.
- Aplica gestión por capas.
- Guarda señales en `signals/signals.json`.
- Evita entradas tardías si el precio ya superó TP3.

---

# 2. Estructura completa del proyecto

```text
elliott-trading-system/
│
├── src/
│   ├── app.js
│   │
│   ├── analysis/
│   │   └── filterSwings.js
│   │
│   ├── data/
│   │   └── fetchCandles.js
│   │
│   ├── elliott/
│   │   ├── detectImpulse.js
│   │   ├── detectZigZagCorrection.js
│   │   └── validateWaveRules.js
│   │
│   ├── indicators/
│   │   ├── fibonacci.js
│   │   └── zigzag.js
│   │
│   ├── layers/
│   │   └── positionSizing.js
│   │
│   ├── risk/
│   │   ├── positionQuantity.js
│   │   └── takeProfit.js
│   │
│   ├── strategy/
│   │   ├── abcCorrectionStrategy.js
│   │   └── wave3Strategy.js
│   │
│   └── utils/
│       └── signalLogger.js
│
├── data/
│   ├── raw/
│   └── processed/
│
├── signals/
│   └── signals.json
│
├── scripts/
├── tests/
│
├── nodemon.json
├── package.json
├── package-lock.json
├── README.md
└── .env
3. Diferencia entre src/data y data

Hay dos carpetas relacionadas con datos:

src/data/

Contiene código para obtener datos.

Ejemplo:

src/data/fetchCandles.js
data/

Contiene datos guardados localmente.

Ejemplo futuro:

data/raw/BTCUSDT_1h.json
data/processed/BTCUSDT_clean.json
4. Conexión actual de mercado

Actualmente el sistema usa Binance API pública.

Archivo:

src/data/fetchCandles.js

Uso en app.js:

const candles = await fetchCandles("BTCUSDT", "1h", 500);

Esto significa:

Exchange: Binance
Mercado: BTCUSDT
Temporalidad: 1h
Velas: 500
Tipo de datos: OHLCV

No necesitas cuenta de Binance porque solo se descargan datos públicos.

No se opera dinero real.

5. Dependencias instaladas

El proyecto usa:

axios
dotenv
technicalindicators
nodemon

Instalación:

npm install
6. Scripts disponibles

En package.json:

{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "backtest": "node scripts/runBacktest.js",
    "test": "node --test"
  }
}

Ejecutar una vez:

npm start

Ejecutar en modo desarrollo:

npm run dev

Detener nodemon:

Ctrl + C
7. nodemon

Archivo:

nodemon.json

Contenido:

{
  "ignore": ["signals/*.json"]
}

Esto evita que nodemon reinicie en bucle cuando el sistema guarda señales en:

signals/signals.json
8. Flujo completo del sistema
1. Descargar velas reales de Binance
2. Calcular ZigZag
3. Detectar swings
4. Filtrar swings fuertes
5. Buscar impulso Elliott alcista
6. Buscar corrección ABC ZigZag
7. Calcular Take Profit
8. Generar señal
9. Calcular riesgo por capa
10. Calcular cantidad a comprar
11. Guardar señal en JSON
9. ZigZag

Archivo:

src/indicators/zigzag.js

Función:

calculateZigZag(candles, deviation)

Uso actual:

const swings = calculateZigZag(candles, 1);

Sirve para detectar:

high → low → high → low
10. Filtro de swings fuertes

Archivo:

src/analysis/filterSwings.js

Función:

filterStrongSwings(swings, minDistance)

Uso actual:

const strongSwings = filterStrongSwings(swings, 1500);

Objetivo:

Reducir ruido.
Evitar micro-swings.
Buscar estructura Elliott más limpia.
Mejorar detección de impulsos.
11. Impulso Elliott

Archivo:

src/elliott/detectImpulse.js

Función:

detectBullishImpulse(strongSwings)

Busca esta estructura:

origin → w1 → w2 → w3 → w4 → w5

low → high → low → high → low → high

Reglas implementadas según Elliott:

1. Onda 2 no rompe el origen de onda 1.
2. Onda 3 supera onda 1.
3. Onda 4 no invade territorio de onda 1.
4. Onda 3 no puede ser la más corta.

Ejemplo de salida válida:

{
  valid: true,
  pattern: "bullish_impulse",
  waves: {
    origin,
    w1,
    w2,
    w3,
    w4,
    w5
  },
  lengths: {
    wave1,
    wave3,
    wave5
  }
}
12. Corrección ABC ZigZag

Archivo:

src/elliott/detectZigZagCorrection.js

Función:

detectBullishZigZagCorrection(strongSwings)

Busca esta estructura:

start → waveA → waveB → waveC

high → low → high → low

Reglas actuales:

1. A cae desde el máximo inicial.
2. B rebota pero no supera el máximo inicial.
3. C cae por debajo de A.

Ejemplo:

{
  valid: true,
  pattern: "bullish_zigzag_correction",
  correction: {
    start,
    waveA,
    waveB,
    waveC
  },
  reason: "Corrección A-B-C tipo zigzag detectada"
}
13. Fibonacci

Archivo:

src/indicators/fibonacci.js

Funciones:

fibonacciExtension(origin, w1, 1.618)
fibonacciRetracement(high, low, 0.618)

Uso actual:

const target = fibonacciExtension(
  validation.waves.origin,
  validation.waves.w1,
  1.618
);
14. Estrategia de onda 3

Archivo:

src/strategy/wave3Strategy.js

Función:

generateWave3Signal(validation, currentPrice)

La lógica es:

Si hay impulso válido:
- Entrada si el precio rompe onda 1.
- Stop debajo de onda 2.
- Take Profit en extensión Fibonacci 1.618.
- Se filtra si el Risk/Reward es insuficiente.

Actualmente, si el impulso ya terminó y el precio está muy lejos, suele devolver:

NO_TRADE

Esto es correcto.

15. Estrategia ABC

Archivo:

src/strategy/abcCorrectionStrategy.js

Función:

generateAbcCorrectionSignal(correction, currentPrice)

Señales posibles:

INITIAL_BUY
POST_TURN_BUY
WAIT
NO_TRADE

Lógica:

INITIAL_BUY:
- Precio cerca de onda C.

POST_TURN_BUY:
- Precio rompe onda B.

NO_TRADE:
- Entrada tardía.
- Precio ya superó TP3.

WAIT:
- Hay corrección, pero todavía no hay confirmación.
16. Take Profit ABC

Archivo:

src/risk/takeProfit.js

Función:

calculateAbcTakeProfit(correction)

Calcula:

TP1 = onda B
TP2 = máximo anterior
TP3 = extensión Fibonacci 1.618 desde C

Ejemplo:

{
  valid: true,
  conservativeTarget: 77642,
  previousHighTarget: 79308.6,
  extensionTarget: 80931.23,
  levels: {
    tp1: 77642,
    tp2: 79308.6,
    tp3: 80931.23
  }
}

Si el precio actual supera TP3:

NO_TRADE
Entrada tardía
17. Gestión por capas

Archivo:

src/layers/positionSizing.js

Función:

calculateLayerSize(accountBalance, layer, riskPercent, profile)

Perfil actual:

balanced

Distribución:

initial: 20%
postTurn: 70%
addOn: 10%

Ejemplo con cuenta de 10,000 USDT y riesgo 1%:

Riesgo total = 100 USDT

Initial = 20 USDT
PostTurn = 70 USDT
AddOn = 10 USDT

Esto sigue la idea del PDF de capas:

Entrada inicial pequeña.
Entrada post-turno principal.
Entrada complemento menor.
18. Tamaño de posición

Archivo:

src/risk/positionQuantity.js

Función:

calculatePositionQuantity(entryPrice, stopLoss, layerRiskAmount)

Fórmula:

riskPerUnit = entryPrice - stopLoss
quantity = layerRiskAmount / riskPerUnit
positionValue = quantity * entryPrice

Ejemplo:

{
  valid: true,
  entryPrice: 81543.26,
  stopLoss: 74742.03,
  layerRiskAmount: 70,
  riskPerUnit: 6801.23,
  quantity: 0.01029,
  positionValue: 839.26
}
19. Registro de señales

Carpeta:

signals/

Archivo:

signals/signals.json

Logger:

src/utils/signalLogger.js

Función:

logSignal(data)

Guarda cada análisis con timestamp:

{
  "timestamp": "2026-05-05T12:00:00.000Z",
  "type": "ABC",
  "signal": "NO_TRADE",
  "price": 81497.6,
  "entry": null,
  "stopLoss": 74742.03,
  "takeProfit": {
    "levels": {
      "tp1": 77642,
      "tp2": 79308.6,
      "tp3": 80931.23
    }
  }
}
20. app.js actual

Archivo:

src/app.js

Responsabilidades:

1. Descargar velas.
2. Calcular ZigZag.
3. Filtrar swings fuertes.
4. Detectar impulso.
5. Detectar ABC.
6. Calcular señales.
7. Calcular TP.
8. Calcular capas.
9. Guardar señal.
21. Interpretación de resultados actuales

Caso actual normal:

Impulso Elliott válido detectado.
Corrección ABC detectada.
Precio actual por encima del TP3.
Resultado: NO_TRADE.
Razón: entrada tardía.

Esto no es un error.

Significa:

El sistema encontró estructura,
pero el trade ya ocurrió,
por lo tanto no entra tarde.
22. Conexiones actuales

Actualmente el sistema conecta con:

Binance API pública

No conecta con:

Broker real
Cuenta Binance privada
API key
Órdenes reales
Base de datos
Dashboard
NASDAQ
Yahoo Finance
Polygon
Alpha Vantage

Eso queda para fases posteriores.

23. Fases realizadas
Fase 1: Proyecto base
Node.js
package.json
src/app.js
nodemon
Fase 2: Datos
fetchCandles.js
Binance public API
BTCUSDT 1h
Fase 3: Indicadores
zigzag.js
fibonacci.js
Fase 4: Elliott
detectImpulse.js
detectZigZagCorrection.js
validateWaveRules.js
Fase 5: Estrategias
wave3Strategy.js
abcCorrectionStrategy.js
Fase 6: Riesgo
takeProfit.js
positionQuantity.js
positionSizing.js
Fase 7: Señales
signalLogger.js
signals/signals.json
nodemon.json
24. Próximo paso recomendado

El siguiente paso lógico es cambiar la prioridad del sistema:

Si hay impulso + ABC:
    usar impulso como contexto
    operar ABC post-impulso

En vez de:

Si hay impulso:
    intentar operar onda 3

Nueva lógica recomendada:

1. Detectar impulso alcista.
2. Detectar ABC posterior al impulso.
3. Confirmar que ABC ocurre después de w5.
4. Buscar entrada post-turno al romper B.
5. Rechazar si precio > TP3.

Esto alinea mejor el sistema con Elliott:

Impulso → Corrección → Continuación