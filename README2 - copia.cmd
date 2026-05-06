# Elliott Trading System

Sistema de trading desarrollado en JavaScript/Node.js basado en:

- Ondas de Elliott
- Impulsos 1-2-3-4-5
- Correcciones ABC tipo ZigZag
- Correcciones Flat
- Fibonacci
- Entradas por capas
- Gestión de riesgo
- Registro de señales

---

## 1. Objetivo

El objetivo del proyecto es construir un sistema que:

1. Descargue datos reales de mercado.
2. Detecte estructura Elliott.
3. Identifique impulsos.
4. Identifique correcciones posteriores al impulso.
5. Genere señales solo cuando el contexto sea válido.
6. Calcule stop loss, take profit y tamaño de posición.
7. Guarde cada análisis en `signals/signals.json`.

---

## 2. PDFs base del sistema

El sistema sigue dos documentos iniciales:

### `Ondas Elliot.pdf`

Se utiliza para:

- Reglas de ondas motrices.
- Estructura de impulso 1-2-3-4-5.
- Correcciones ABC.
- ZigZag.
- Flats.
- Diagonales.
- Triángulos.
- Combinaciones correctivas.

### `Capas Trading.pdf`

Se utiliza para:

- Entrada inicial.
- Entrada post-turno.
- Entrada complemento.
- Gestión progresiva de posición.
- Operar a favor de la tendencia predominante.
- Evitar construir posición contra tendencia.

---

## 3. Estado actual

Actualmente el sistema:

- Usa Binance API pública.
- Analiza `BTCUSDT`.
- Usa temporalidad `1h`.
- Descarga 500 velas.
- Detecta ZigZag.
- Filtra swings fuertes.
- Detecta impulso Elliott alcista.
- Detecta correcciones ABC ZigZag.
- Valida ABC con Fibonacci.
- Detecta correcciones Flat.
- Busca ABC posterior al impulso.
- Descarta ABC vencidas.
- Calcula TP1, TP2 y TP3.
- Calcula stop loss.
- Calcula tamaño de posición.
- Guarda señales en JSON.

---

## 4. Estructura del proyecto

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
│   │   ├── detectAllZigZagCorrections.js
│   │   ├── detectFlatCorrection.js
│   │   ├── detectZigZagCorrection.js
│   │   ├── validateAbcFibonacci.js
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

5. Diferencia entre carpetas de datos
src/data/

Contiene código para obtener datos.

Ejemplo:

src/data/fetchCandles.js
data/

Contiene datos descargados o procesados localmente.

Ejemplo futuro:

data/raw/BTCUSDT_1h.json
data/processed/BTCUSDT_1h_clean.json
6. Fuente de datos

Actualmente se conecta a Binance API pública.

Archivo:

src/data/fetchCandles.js

Uso:

const candles = await fetchCandles("BTCUSDT", "1h", 500);

Esto significa:

Exchange: Binance
Mercado: BTCUSDT
Temporalidad: 1h
Velas: 500
Datos: OHLCV

No requiere cuenta de Binance.

No requiere API key.

No ejecuta órdenes reales.

7. Flujo principal actual
1. Descargar velas
2. Calcular ZigZag
3. Filtrar swings fuertes
4. Detectar impulso Elliott alcista
5. Detectar todas las correcciones ABC ZigZag
6. Validar ABC con Fibonacci
7. Detectar posible Flat
8. Comprobar si la ABC ocurre después del impulso
9. Comprobar si la ABC sigue activa
10. Generar señal
11. Calcular posición
12. Guardar señal
8. ZigZag

Archivo:

src/indicators/zigzag.js

Función:

calculateZigZag(candles, deviation)

Uso actual:

const swings = calculateZigZag(candles, 1);

El ZigZag reduce el gráfico a swings:

high → low → high → low
9. Filtro de swings fuertes

Archivo:

src/analysis/filterSwings.js

Función:

filterStrongSwings(swings, 1500)

Objetivo:

Reducir ruido.
Evitar micro-swings.
Trabajar con estructura más limpia.
Mejorar la detección de Elliott.

Uso actual:

const strongSwings = filterStrongSwings(swings, 1500);
10. Impulso Elliott

Archivo:

src/elliott/detectImpulse.js

Función:

detectBullishImpulse(strongSwings)

Busca la estructura:

origin → w1 → w2 → w3 → w4 → w5

low → high → low → high → low → high

Reglas aplicadas:

1. Onda 2 no rompe el origen de onda 1.
2. Onda 3 supera onda 1.
3. Onda 4 no invade territorio de onda 1.
4. Onda 3 no puede ser la más corta.

Ejemplo de salida:

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
11. Corrección ABC ZigZag

Archivo:

src/elliott/detectAllZigZagCorrections.js

Función:

detectAllBullishZigZagCorrections(strongSwings)

Busca todas las estructuras:

start → waveA → waveB → waveC

high → low → high → low

Reglas base:

1. A cae desde el máximo inicial.
2. B rebota pero no supera el máximo inicial.
3. C rompe el mínimo de A.

Después se valida con Fibonacci.

12. Validación Fibonacci de ABC

Archivo:

src/elliott/validateAbcFibonacci.js

Función:

validateAbcFibonacci(correction)

Validaciones actuales:

B debe retroceder entre 38.2% y 79% de A.
C debe extender entre 100% y 161.8% de A.

Esto evita aceptar cualquier estructura visual que no tenga proporciones razonables.

Si no cumple, se descarta.

13. Corrección Flat

Archivo:

src/elliott/detectFlatCorrection.js

Función:

detectFlatCorrection(strongSwings)

Busca una estructura:

start → A → B → C

high → low → high → low

Pero con proporciones de Flat:

B recupera aproximadamente 90% - 105% de A.
C proyecta aproximadamente 80% - 120% de A.

Uso actual:

const flatCorrection = detectFlatCorrection(strongSwings);

Actualmente el Flat se detecta y se registra, pero todavía no es la estrategia principal de entrada.

La estrategia principal sigue siendo ABC ZigZag posterior al impulso.

14. Estrategia ABC post-impulso

Archivo:

src/strategy/abcCorrectionStrategy.js

Función:

generateAbcCorrectionSignal(correction, currentPrice)

Señales posibles:

INITIAL_BUY
POST_TURN_BUY
WAIT
NO_TRADE

Reglas:

INITIAL_BUY:
precio cerca de onda C.

POST_TURN_BUY:
precio rompe onda B.

NO_TRADE:
precio ya superó TP3.

WAIT:
corrección válida, pero sin entrada todavía.
15. Take Profit ABC

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

Si el precio actual está por encima de TP3:

NO_TRADE

Motivo:

Entrada tardía.
16. Selección de ABC activa

La función interna de app.js:

findActiveCorrectionAfterImpulse(corrections, impulse, currentPrice)

hace esto:

1. Toma todas las ABC detectadas.
2. Filtra solo las que empiezan después de w5.
3. Calcula TP para cada una.
4. Descarta las vencidas.
5. Ordena por waveC más reciente.
6. Devuelve la ABC activa más reciente.

Condición clave:

correction.correction.start.index >= impulse.waves.w5.index

Esto asegura:

Impulso → Corrección → posible continuación
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

Ejemplo:

Balance: 10,000 USDT
Riesgo: 1%
Riesgo total: 100 USDT

Initial: 20 USDT
PostTurn: 70 USDT
AddOn: 10 USDT

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

Archivo:

src/utils/signalLogger.js

Guarda en:

signals/signals.json

Cada señal incluye:

timestamp
symbol
timeframe
strategy
signal
price
entry
stopLoss
takeProfit
impulse
correction
flatCorrection
position
reason

Ejemplo:

{
  "timestamp": "2026-05-06T12:00:00.000Z",
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "strategy": "ABC_AFTER_IMPULSE",
  "signal": "NO_TRADE",
  "price": 81672.71,
  "reason": "No hay corrección ABC ZigZag activa después del impulso"
}
20. nodemon

Archivo:

nodemon.json

Contenido recomendado:

{
  "ignore": ["signals/*.json"]
}

Esto evita que nodemon reinicie en bucle cuando se actualiza signals/signals.json.

21. Comandos

Instalar dependencias:

npm install

Ejecutar una vez:

npm start

Ejecutar en desarrollo:

npm run dev

Detener nodemon:

Ctrl + C
22. Estado actual esperado

Un resultado correcto puede ser:

Impulso Elliott válido.
Correcciones ABC ZigZag detectadas: 0.
Corrección Flat: no válida o válida.
NO_TRADE.
Señal guardada.

O:

Impulso Elliott válido.
ABC detectada.
ABC vencida.
NO_TRADE.

Esto no es un error.

Significa que el sistema evita entrar tarde o sin setup válido.

23. Lo que cumple del PDF de Elliott

Actualmente cumple:

Impulso 1-2-3-4-5.
Onda 2 no rompe origen.
Onda 3 no es la más corta.
Onda 4 no invade territorio de onda 1.
Corrección ABC ZigZag.
Validación Fibonacci de B y C.
Corrección Flat inicial.
Flujo impulso → corrección → continuación.
24. Lo que cumple del PDF de capas

Actualmente cumple:

Entrada inicial.
Entrada post-turno.
Entrada complemento.
Distribución por capas.
Mayor peso en post-turno.
Evitar operar contra contexto.
No perseguir precio.
25. Pendiente para seguir fielmente los PDFs

Falta implementar:

1. Flats como estrategia operativa completa.
2. Expanded Flat.
3. Running Flat.
4. Triángulos.
5. Combinaciones W-X-Y.
6. Diagonales.
7. Validación Fibonacci más específica por patrón.
8. Multi-timeframe.
9. Backtesting.
10. Paper trading.
26. Próximo paso recomendado

El siguiente paso más lógico es:

Integrar Flat como corrección operable.

Es decir:

Impulso alcista
↓
Corrección Flat
↓
Ruptura de B
↓
Entrada post-turno

Después de eso:

Backtesting automático.
27. Disclaimer

Este sistema es educativo y experimental.

No constituye asesoramiento financiero.

No opera dinero real.

Antes de cualquier operación real se requiere:

Backtesting.
Paper trading.
Gestión de riesgo avanzada.
Validación multi-timeframe.
Control de errores.