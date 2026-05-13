# Elliott Trading System

Sistema experimental de trading desarrollado en JavaScript/Node.js basado en Ondas de Elliott, correcciones ABC, Fibonacci, entradas por capas y gestión de riesgo.

El proyecto analiza datos reales de mercado, detecta estructuras técnicas, genera señales y guarda cada análisis en un archivo JSON. Actualmente **no ejecuta órdenes reales** ni se conecta a una cuenta privada de Binance o broker.

---

## 1. Objetivo del proyecto

El objetivo del sistema es construir una base automatizada capaz de:

1. Descargar datos reales de mercado.
2. Calcular swings mediante ZigZag.
3. Filtrar swings fuertes para reducir ruido.
4. Detectar impulsos Elliott alcistas.
5. Detectar correcciones ABC tipo ZigZag posteriores al impulso.
6. Validar correcciones ABC usando proporciones Fibonacci.
7. Detectar correcciones Flat como información adicional.
8. Generar señales solo cuando el contexto sea válido.
9. Calcular stop loss, take profit y tamaño de posición.
10. Aplicar gestión de riesgo por capas.
11. Evitar entradas tardías.
12. Guardar cada señal o análisis en `signals/signals.json`.
13. Generar documentación técnica del código en HTML, Markdown y PDF.

---

## 2. Filosofía del sistema

El sistema sigue una lógica conservadora:

1. Identificar primero la estructura de mercado.
2. Usar el impulso Elliott como contexto.
3. Esperar una corrección, no perseguir el precio.
4. Buscar entradas cerca de onda C o tras ruptura de onda B.
5. Usar mayor peso en la entrada confirmada post-turno.
6. Rechazar operaciones tardías si el precio ya superó TP3.
7. Registrar todo para poder revisar y mejorar el sistema.

Idea principal:

```text
Impulso Elliott
      ↓
Corrección ABC / Flat
      ↓
Confirmación
      ↓
Entrada por capas
      ↓
Gestión de riesgo
```

---

## 3. PDFs base del sistema

El sistema toma como referencia dos documentos iniciales.

### `Ondas Elliot.pdf`

Se usa para:

- Reglas de ondas motrices.
- Estructura de impulso 1-2-3-4-5.
- Correcciones ABC.
- Correcciones ZigZag.
- Correcciones Flat.
- Diagonales.
- Triángulos.
- Combinaciones correctivas.

### `Capas Trading.pdf`

Se usa para:

- Entrada inicial.
- Entrada post-turno.
- Entrada complemento.
- Distribución progresiva del riesgo.
- Operar a favor de la tendencia predominante.
- Evitar construir posición contra tendencia.
- Evitar perseguir el precio.

---

## 4. Estado actual del sistema

Actualmente el sistema:

- Usa Binance API pública.
- Analiza `BTCUSDT`.
- Usa temporalidad `1h`.
- Descarga 500 velas.
- Calcula ZigZag.
- Filtra swings fuertes.
- Detecta impulso Elliott alcista.
- Detecta correcciones ABC ZigZag.
- Detecta todas las correcciones ABC ZigZag posibles.
- Valida ABC con Fibonacci.
- Detecta correcciones Flat.
- Busca ABC posterior al impulso.
- Descarta ABC vencidas si el precio ya superó TP3.
- Calcula TP1, TP2 y TP3.
- Calcula stop loss.
- Calcula tamaño de posición por capa.
- Guarda señales en JSON.
- Genera documentación técnica con JSDoc y `documentation.js`.

---

## 5. Estructura del proyecto

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
│   │   └── validateBasicImpulse.js
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
├── docs/
│   └── index.html
│
├── signals/
│   └── signals.json
│
├── scripts/
├── tests/
│
├── jsdoc.json
├── nodemon.json
├── package.json
├── package-lock.json
├── DOCUMENTACION_TECNICA.md
├── DOCUMENTACION_TECNICA.pdf
├── README.md
└── .env
```

---

## 6. Diferencia entre `src/data` y `data`

### `src/data/`

Contiene código para obtener datos.

Ejemplo:

```text
src/data/fetchCandles.js
```

### `data/`

Contiene datos descargados o procesados localmente.

Ejemplo futuro:

```text
data/raw/BTCUSDT_1h.json
data/processed/BTCUSDT_1h_clean.json
```

---

## 7. Fuente de datos

Actualmente el sistema se conecta a la API pública de Binance.

Archivo:

```text
src/data/fetchCandles.js
```

Uso actual en `app.js`:

```js
const candles = await fetchCandles("BTCUSDT", "1h", 500);
```

Esto significa:

```text
Exchange: Binance
Mercado: BTCUSDT
Temporalidad: 1h
Velas: 500
Tipo de datos: OHLCV
```

No requiere cuenta de Binance, no requiere API key y no ejecuta órdenes reales.

---

## 8. Dependencias

Dependencias principales:

- `axios`
- `dotenv`
- `technicalindicators`

Dependencias de desarrollo:

- `nodemon`
- `jsdoc`
- `documentation`
- `md-to-pdf`

Instalación general:

```bash
npm install
```

---

## 9. Scripts disponibles

Ejemplo actualizado de scripts en `package.json`:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "backtest": "node scripts/runBacktest.js",
    "test": "node --test",
    "docs": "jsdoc -c jsdoc.json",
    "docs:md": "documentation build \"src/**/*.js\" -f md -o DOCUMENTACION_TECNICA.md",
    "docs:pdf": "md-to-pdf DOCUMENTACION_TECNICA.md"
  }
}
```

Ejecutar una vez:

```bash
npm start
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

Generar documentación web:

```bash
npm run docs
```

Generar documentación Markdown:

```bash
npm run docs:md
```

Generar documentación PDF:

```bash
npm run docs:pdf
```

Actualizar toda la documentación:

```bash
npm run docs
npm run docs:md
npm run docs:pdf
```

Detener `nodemon`:

```text
Ctrl + C
```

---

## 10. Configuración de nodemon

Archivo:

```text
nodemon.json
```

Contenido recomendado:

```json
{
  "ignore": ["signals/*.json"]
}
```

Esto evita que `nodemon` reinicie en bucle cuando el sistema guarda señales en:

```text
signals/signals.json
```

---

## 11. Flujo principal actual

Flujo completo del sistema:

1. Descargar velas reales desde Binance.
2. Calcular ZigZag.
3. Detectar swings.
4. Filtrar swings fuertes.
5. Buscar impulso Elliott alcista.
6. Detectar todas las correcciones ABC ZigZag.
7. Validar ABC con Fibonacci.
8. Detectar posible Flat.
9. Comprobar si la ABC ocurre después del impulso.
10. Comprobar si la ABC sigue activa.
11. Generar señal.
12. Calcular riesgo por capa.
13. Calcular cantidad a comprar.
14. Guardar señal en JSON.

Flujo conceptual:

```text
fetchCandles
    ↓
calculateZigZag
    ↓
filterStrongSwings
    ↓
detectBullishImpulse
    ↓
detectAllBullishZigZagCorrections
    ↓
validateAbcFibonacci
    ↓
findActiveCorrectionAfterImpulse
    ↓
generateAbcCorrectionSignal
    ↓
calculateLayerSize
    ↓
calculatePositionQuantity
    ↓
logSignal
```

---

## 12. ZigZag

Archivo:

```text
src/indicators/zigzag.js
```

Función:

```js
calculateZigZag(candles, deviation)
```

Uso actual:

```js
const swings = calculateZigZag(candles, 1);
```

Sirve para reducir las velas a swings relevantes:

```text
high → low → high → low
```

Cada swing incluye normalmente:

```js
{
  type: "high" | "low",
  index,
  price,
  candle
}
```

---

## 13. Filtro de swings fuertes

Archivo:

```text
src/analysis/filterSwings.js
```

Función:

```js
filterStrongSwings(swings, minDistance)
```

Uso actual:

```js
const strongSwings = filterStrongSwings(swings, 1500);
```

Objetivo:

- Reducir ruido.
- Evitar micro-swings.
- Trabajar con estructura más limpia.
- Mejorar la detección de Elliott.

---

## 14. Impulso Elliott

Archivo:

```text
src/elliott/detectImpulse.js
```

Función:

```js
detectBullishImpulse(strongSwings)
```

Busca esta estructura:

```text
origin → w1 → w2 → w3 → w4 → w5
low    → high → low → high → low → high
```

Reglas aplicadas:

1. Onda 2 no rompe el origen de onda 1.
2. Onda 3 supera onda 1.
3. Onda 4 no invade territorio de onda 1.
4. Onda 3 no puede ser la más corta.

Ejemplo de salida válida:

```js
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
```

---

## 15. Validación básica de impulso

Archivo:

```text
src/elliott/validateBasicImpulse.js
```

Función:

```js
validateBasicImpulse(swings)
```

Esta validación revisa una estructura alcista básica:

```text
low → high → low → high → low → high
```

Es más simple que `detectBullishImpulse`, porque no calcula longitudes ni comprueba si la onda 3 es la más corta.

---

## 16. Corrección ABC ZigZag

Archivo:

```text
src/elliott/detectZigZagCorrection.js
```

Función:

```js
detectBullishZigZagCorrection(strongSwings)
```

Busca la corrección válida más reciente:

```text
start → waveA → waveB → waveC
high  → low   → high  → low
```

Reglas:

1. A cae desde el máximo inicial.
2. B rebota pero no supera el máximo inicial.
3. C rompe el mínimo de A.

---

## 17. Todas las correcciones ABC ZigZag

Archivo:

```text
src/elliott/detectAllZigZagCorrections.js
```

Función:

```js
detectAllBullishZigZagCorrections(strongSwings)
```

Busca todas las estructuras ABC ZigZag válidas dentro de los swings fuertes.

La estructura esperada es:

```text
start → waveA → waveB → waveC
high  → low   → high  → low
```

Reglas base:

1. A rompe hacia abajo desde el punto inicial.
2. B no supera el punto inicial.
3. C rompe por debajo de A.
4. La estructura debe cumplir validación Fibonacci.

Esta función es clave para que `app.js` pueda seleccionar la ABC activa más reciente después del impulso.

---

## 18. Validación Fibonacci de ABC

Archivo:

```text
src/elliott/validateAbcFibonacci.js
```

Función:

```js
validateAbcFibonacci(correction)
```

Validaciones actuales:

```text
Wave B: 38.2% - 79% de Wave A
Wave C: 100% - 161.8% de Wave A
```

Objetivo:

- Evitar aceptar cualquier estructura visual.
- Filtrar ABC sin proporciones razonables.
- Mejorar la calidad de señales.

Si la estructura no cumple, se descarta.

---

## 19. Corrección Flat

Archivo:

```text
src/elliott/detectFlatCorrection.js
```

Función:

```js
detectFlatCorrection(strongSwings)
```

Busca esta estructura:

```text
start → A → B → C
high  → low → high → low
```

Proporciones de Flat usadas actualmente:

```text
B recupera aproximadamente 90% - 105% de A
C proyecta aproximadamente 80% - 120% de A
```

Uso actual:

```js
const flatCorrection = detectFlatCorrection(strongSwings);
```

Actualmente el Flat se detecta y se registra, pero todavía no es la estrategia principal de entrada.

La estrategia principal sigue siendo:

```text
Impulso → ABC ZigZag posterior al impulso → señal
```

---

## 20. Fibonacci

Archivo:

```text
src/indicators/fibonacci.js
```

Funciones:

```js
fibonacciExtension(origin, w1, 1.618)
fibonacciRetracement(high, low, 0.618)
```

Uso típico:

```js
const target = fibonacciExtension(
  validation.waves.origin,
  validation.waves.w1,
  1.618
);
```

`fibonacciExtension` se usa para calcular objetivos de precio, especialmente TP3.

---

## 21. Estrategia ABC post-impulso

Archivo:

```text
src/strategy/abcCorrectionStrategy.js
```

Función:

```js
generateAbcCorrectionSignal(correction, currentPrice)
```

Señales posibles:

```text
INITIAL_BUY
POST_TURN_BUY
WAIT
NO_TRADE
```

Reglas:

### `INITIAL_BUY`

El precio está cerca de onda C.

### `POST_TURN_BUY`

El precio rompe la onda B.

### `WAIT`

Hay corrección válida, pero todavía no hay entrada.

### `NO_TRADE`

La corrección no es válida o el precio ya superó TP3.

Este módulo conecta la estructura Elliott con una decisión operativa.

---

## 22. Estrategia de onda 3

Archivo:

```text
src/strategy/wave3Strategy.js
```

Función:

```js
generateWave3Signal(validation, currentPrice)
```

Lógica:

- Si la validación previa no es válida, devuelve `NO_TRADE`.
- Si el precio actual aún no supera la onda 1, devuelve `WAIT`.
- El nivel de entrada se toma como el precio de `w1`.
- El stop loss se coloca en el precio de `w2`.
- El take profit se calcula con extensión Fibonacci 1.618.
- Si el riesgo es inválido, devuelve `NO_TRADE`.
- Si la relación riesgo/beneficio es menor que 2, devuelve `NO_TRADE`.
- Si todo es correcto, devuelve `BUY`.

Actualmente la lógica principal del sistema está más enfocada en operar ABC posterior al impulso que en perseguir onda 3.

---

## 23. Take Profit ABC

Archivo:

```text
src/risk/takeProfit.js
```

Función:

```js
calculateAbcTakeProfit(correction)
```

Calcula:

```text
TP1 = onda B
TP2 = máximo previo
TP3 = extensión Fibonacci 1.618 desde C
```

Ejemplo:

```js
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
```

Si el precio actual está por encima de TP3, la señal debe ser:

```text
NO_TRADE
```

Motivo:

```text
Entrada tardía
```

---

## 24. Selección de ABC activa

Función interna de `app.js`:

```js
findActiveCorrectionAfterImpulse(corrections, impulse, currentPrice)
```

Hace lo siguiente:

1. Toma todas las ABC detectadas.
2. Filtra solo las que empiezan después de `w5`.
3. Calcula TP para cada una.
4. Descarta las vencidas.
5. Ordena por `waveC` más reciente.
6. Devuelve la ABC activa más reciente.

Condición clave:

```js
correction.correction.start.index >= impulse.waves.w5.index
```

Esto asegura el contexto:

```text
Impulso → Corrección → posible continuación
```

---

## 25. Gestión por capas

Archivo:

```text
src/layers/positionSizing.js
```

Función:

```js
calculateLayerSize(accountBalance, layer, riskPercent, profile)
```

Perfiles disponibles:

```text
conservative
balanced
aggressive
```

Perfil actual:

```text
balanced
```

Distribución del perfil `balanced`:

| Capa | Peso | Uso |
|---|---:|---|
| `initial` | 20% | Entrada temprana |
| `postTurn` | 70% | Entrada confirmada |
| `addOn` | 10% | Complemento / continuación |

Ejemplo con cuenta de 10,000 USDT y riesgo del 1%:

```text
Riesgo total = 100 USDT
Initial      = 20 USDT
PostTurn     = 70 USDT
AddOn        = 10 USDT
```

Esto sigue la idea del PDF de capas:

- Entrada inicial pequeña.
- Entrada post-turno principal.
- Entrada complemento menor.

---

## 26. Tamaño de posición

Archivo:

```text
src/risk/positionQuantity.js
```

Función:

```js
calculatePositionQuantity(entryPrice, stopLoss, layerRiskAmount)
```

Fórmulas:

```text
riskPerUnit = entryPrice - stopLoss
quantity = layerRiskAmount / riskPerUnit
positionValue = quantity * entryPrice
```

Ejemplo:

```js
{
  valid: true,
  entryPrice: 81543.26,
  stopLoss: 74742.03,
  layerRiskAmount: 70,
  riskPerUnit: 6801.23,
  quantity: 0.01029,
  positionValue: 839.26
}
```

Esta función está pensada para operaciones long, donde el stop loss está por debajo de la entrada.

---

## 27. Registro de señales

Archivo:

```text
src/utils/signalLogger.js
```

Guarda señales en:

```text
signals/signals.json
```

Cada señal puede incluir:

- `timestamp`
- `symbol`
- `timeframe`
- `strategy`
- `signal`
- `price`
- `entry`
- `stopLoss`
- `confirmationLevel`
- `takeProfit`
- `impulse`
- `correction`
- `flatCorrection`
- `position`
- `reason`

Ejemplo:

```json
{
  "timestamp": "2026-05-06T12:00:00.000Z",
  "symbol": "BTCUSDT",
  "timeframe": "1h",
  "strategy": "ABC_AFTER_IMPULSE",
  "signal": "NO_TRADE",
  "price": 81672.71,
  "reason": "No hay corrección ABC ZigZag activa después del impulso"
}
```

---

## 28. Responsabilidades de `app.js`

Archivo:

```text
src/app.js
```

Responsabilidades principales:

1. Definir configuración de mercado.
2. Definir configuración de riesgo.
3. Descargar velas.
4. Calcular ZigZag.
5. Filtrar swings fuertes.
6. Detectar impulso Elliott.
7. Detectar ABC ZigZag.
8. Detectar Flat.
9. Seleccionar ABC activa después del impulso.
10. Generar señal ABC.
11. Calcular capa de entrada.
12. Calcular cantidad de posición.
13. Guardar resultado.
14. Mostrar información en consola.

Configuración actual típica:

```js
const symbol = "BTCUSDT";
const timeframe = "1h";
const candlesLimit = 500;

const accountBalance = 10000;
const riskPercent = 1;
const profile = "balanced";
```

---

## 29. Interpretación de resultados actuales

### Caso 1: no hay impulso

Resultado esperado:

```text
NO_TRADE: no hay impulso alcista válido.
```

Esto no es un error. Significa que el mercado no tiene el contexto que exige el sistema.

### Caso 2: hay impulso, pero no hay ABC

Resultado esperado:

```text
NO_TRADE: hay impulso, pero no hay correcciones ABC ZigZag válidas.
```

Esto significa que todavía no hay corrección operable.

### Caso 3: hay ABC, pero está vencida

Resultado esperado:

```text
NO_TRADE: no hay ABC ZigZag activa después del impulso.
```

O:

```text
Entrada tardía: el precio ya superó el objetivo TP3.
```

Esto es correcto: el sistema evita entrar tarde.

### Caso 4: señal inicial

Resultado posible:

```text
INITIAL_BUY
```

Significa que el precio está cerca de onda C.

### Caso 5: señal post-turno

Resultado posible:

```text
POST_TURN_BUY
```

Significa que el precio rompió onda B y hay confirmación.

---

## 30. Conexiones actuales y límites

Actualmente el sistema conecta con:

```text
Binance API pública
```

Actualmente no conecta con:

- Broker real.
- Cuenta Binance privada.
- API key privada.
- Órdenes reales.
- Base de datos.
- Dashboard.
- NASDAQ.
- Yahoo Finance.
- Polygon.
- Alpha Vantage.

Esto queda para fases posteriores.

---

## 31. Documentación técnica del proyecto

El proyecto usa comentarios JSDoc en el código para generar documentación.

### Documentación web

Comando:

```bash
npm run docs
```

Genera:

```text
docs/index.html
```

Abrir en Windows:

```powershell
start docs/index.html
```

### Documentación Markdown

Comando:

```bash
npm run docs:md
```

Genera:

```text
DOCUMENTACION_TECNICA.md
```

### Documentación PDF

Comando:

```bash
npm run docs:pdf
```

Genera:

```text
DOCUMENTACION_TECNICA.pdf
```

### Flujo recomendado al modificar código

Cada vez que se modifique o añada código:

1. Actualizar comentarios JSDoc.
2. Ejecutar:

```bash
npm run docs
npm run docs:md
npm run docs:pdf
```

Resultado:

```text
docs/                       → documentación web
DOCUMENTACION_TECNICA.md    → documentación Markdown
DOCUMENTACION_TECNICA.pdf   → documentación PDF para compartir
```

El PDF sirve para continuar el desarrollo en otro chat sin tener que explicar de nuevo toda la estructura del sistema.

---

## 32. Fases realizadas

### Fase 1: Proyecto base

- Node.js.
- `package.json`.
- `src/app.js`.
- `nodemon`.

### Fase 2: Datos

- `fetchCandles.js`.
- Binance public API.
- BTCUSDT 1h.

### Fase 3: Indicadores

- `zigzag.js`.
- `fibonacci.js`.

### Fase 4: Elliott

- `detectImpulse.js`.
- `detectZigZagCorrection.js`.
- `detectAllZigZagCorrections.js`.
- `detectFlatCorrection.js`.
- `validateAbcFibonacci.js`.
- `validateBasicImpulse.js`.

### Fase 5: Estrategias

- `wave3Strategy.js`.
- `abcCorrectionStrategy.js`.

### Fase 6: Riesgo

- `takeProfit.js`.
- `positionQuantity.js`.
- `positionSizing.js`.

### Fase 7: Señales

- `signalLogger.js`.
- `signals/signals.json`.
- `nodemon.json`.

### Fase 8: Documentación

- Comentarios JSDoc.
- `jsdoc.json`.
- Documentación web.
- Documentación Markdown.
- Documentación PDF.

---

## 33. Lo que cumple actualmente del PDF de Elliott

Actualmente cumple:

- Impulso 1-2-3-4-5.
- Onda 2 no rompe origen.
- Onda 3 supera onda 1.
- Onda 3 no es la más corta.
- Onda 4 no invade territorio de onda 1.
- Corrección ABC ZigZag.
- Validación Fibonacci de B y C.
- Corrección Flat inicial.
- Flujo impulso → corrección → continuación.

---

## 34. Lo que cumple actualmente del PDF de capas

Actualmente cumple:

- Entrada inicial.
- Entrada post-turno.
- Entrada complemento.
- Distribución por capas.
- Mayor peso en post-turno.
- Evitar operar contra contexto.
- No perseguir precio.
- Evitar entrada tardía.

---

## 35. Pendiente para seguir fielmente los PDFs

Falta implementar o mejorar:

1. Flat como estrategia operativa completa.
2. Expanded Flat.
3. Running Flat.
4. Triángulos.
5. Combinaciones W-X-Y.
6. Diagonales.
7. Validación Fibonacci más específica por patrón.
8. Selección inteligente del mejor setup.
9. Multi-timeframe.
10. Backtesting automático.
11. Paper trading.
12. Integración con broker o exchange real.
13. Dashboard.
14. Base de datos.
15. Gestión avanzada de errores.

---

## 36. Roadmap recomendado

Orden realista para continuar:

### 1. Integrar Flat como corrección operable

Nuevo flujo:

```text
Impulso alcista
    ↓
Corrección Flat
    ↓
Ruptura de B
    ↓
Entrada post-turno
```

### 2. Mejorar selección de setups

No operar cualquier ABC. Elegir la mejor según:

- Contexto.
- Distancia al precio actual.
- Risk/Reward.
- Fibonacci.
- Proximidad a zona de entrada.

### 3. Backtesting

Medir si la lógica funciona con histórico.

### 4. Multi-timeframe

Validar contexto superior antes de operar en 1h.

### 5. Paper trading

Simular operaciones en tiempo real sin dinero real.

### 6. Trading real

Solo después de backtesting, paper trading y control de riesgo avanzado.

---

## 37. Cómo trabajar el proyecto paso a paso

Regla de oro:

```text
No construir todo a la vez.
```

Forma recomendada:

1. Elegir una mejora concreta.
2. Crear o modificar un archivo.
3. Probar con `npm start`.
4. Revisar la señal generada.
5. Actualizar comentarios JSDoc.
6. Regenerar documentación.
7. Guardar cambios.

Ejemplos de próximos prompts útiles:

```text
vamos a integrar Flat como estrategia operable
```

```text
quiero mejorar la selección de ABC activa
```

```text
vamos a crear backtesting para ABC post-impulso
```

```text
quiero añadir validación multi-timeframe
```

---

## 38. Proceso recomendado de documentación

Cuando modifiques código:

1. Actualiza la función.
2. Actualiza su comentario JSDoc.
3. Ejecuta:

```bash
npm run docs:md
npm run docs:pdf
```

Si también quieres actualizar la web:

```bash
npm run docs
npm run docs:md
npm run docs:pdf
```

Archivos importantes:

```text
README.md                  → explicación general del proyecto
DOCUMENTACION_TECNICA.pdf  → documentación técnica completa
DOCUMENTACION_TECNICA.md   → documentación técnica editable
README_UNIFICADO.md        → resumen unificado si se mantiene separado
```

---

## 39. Disclaimer

Este sistema es educativo y experimental.

No constituye asesoramiento financiero.

No opera dinero real.

Antes de cualquier operación real se requiere:

- Backtesting.
- Paper trading.
- Gestión de riesgo avanzada.
- Validación multi-timeframe.
- Control de errores.
- Supervisión humana.

---

## 40. Resumen final

El sistema ya tiene una base funcional:

- Datos reales desde Binance.
- ZigZag.
- Filtro de swings.
- Impulso Elliott.
- ABC ZigZag.
- Fibonacci.
- Flat básico.
- Señales ABC.
- Capas.
- Posición.
- Logging.
- Documentación técnica.

La prioridad actual es pasar de un sistema que detecta estructuras a un sistema que pueda evaluarlas con backtesting y seleccionar setups de mayor calidad.

Estado actual:

```text
Base funcional construida
    ↓
Pendiente: validación, backtesting y mejora de setups
```
