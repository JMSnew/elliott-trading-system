# 📊 Elliott Trading System (Node.js)

Sistema de análisis técnico basado en **Ondas de Elliott + Correcciones ABC (ZigZag)** con gestión de riesgo por capas y generación de señales operativas.

---

## 🚀 Descripción

Este proyecto analiza datos de mercado (OHLCV), detecta estructuras de precio y genera señales de trading basadas en:

* 📉 Swings (highs / lows)
* 📐 Correcciones ABC (ZigZag)
* 🌊 Reglas estrictas de Elliott
* 🎯 Proyecciones de Take Profit
* 🛑 Stop Loss estructural
* 💰 Gestión de riesgo por capas
* ⚠️ Filtro de entradas tardías

El sistema está diseñado para operar como base de un **bot de trading profesional**.

---

## 🧠 Lógica principal

### 1. Detección de Swings

Identifica máximos y mínimos relevantes en el precio.

Resultado:

```
high → low → high → low ...
```

---

### 2. Validación Elliott (Impulso)

Busca estructuras de 5 ondas:

* Wave 1
* Wave 2 (no retrocede 100%)
* Wave 3 (no es la más corta)
* Wave 4 (no solapa con Wave 1)
* Wave 5

👉 Actualmente:

```
Si NO hay impulso válido → se pasa a buscar corrección
```

---

### 3. Corrección ABC (ZigZag)

Estructura detectada:

```
A → caída
B → retroceso
C → caída final
```

Validaciones:

* B ≈ 38%–79% de A
* C ≥ 100% de A
* Patrón tipo ZigZag

---

### 4. Señal de entrada

Se genera cuando:

```
Precio rompe la onda B
```

Tipos:

* `INITIAL_BUY` → antes de confirmación
* `POST_TURN_BUY` → confirmación (la actual)
* `NO_TRADE` → condiciones no válidas

---

### 5. Take Profit (basado en PDF)

Se calculan 3 niveles:

* TP1 → nivel conservador (onda B)
* TP2 → máximo previo
* TP3 → extensión de Fibonacci (~1.618)

---

### 6. Filtro de entrada tardía

Si:

```
precio actual > TP3
```

👉 Resultado:

```
NO_TRADE
```

✔ Evita entrar tarde (clave en trading real)

---

### 7. Gestión de riesgo por capas

Capital: 10,000
Riesgo total: 1%

Distribución:

| Capa      | %   | Uso              |
| --------- | --- | ---------------- |
| Initial   | 20% | Entrada temprana |
| Post Turn | 70% | Confirmación     |
| Add-on    | 10% | Continuación     |

---

### 8. Cálculo de posición

```
riesgo por unidad = entrada - stop
cantidad = riesgo / riesgo por unidad
```

---

## 📂 Estructura del proyecto

```
elliott-trading-system/
│
├── src/
│   ├── app.js                  # Punto de entrada
│   │
│   ├── data/
│   │   └── marketData.js      # Fetch de datos (Binance/mock)
│   │
│   ├── analysis/
│   │   ├── swingDetector.js
│   │   ├── elliottValidator.js
│   │   └── zigzagDetector.js
│   │
│   ├── strategy/
│   │   ├── entryStrategy.js
│   │   ├── riskManager.js
│   │   └── takeProfit.js
│   │
│   ├── execution/
│   │   ├── positionSizing.js
│   │   └── signalLogger.js
│
├── signals.json               # Registro de señales
├── package.json
└── README.md
```

---

## ⚙️ Instalación

```bash
npm install
```

---

## ▶️ Ejecución

### Desarrollo (auto-reload)

```bash
npm run dev
```

### Producción (una ejecución)

```bash
npm start
```

---

## 📡 Fuente de datos

Actualmente:

* Binance API (pública)
* No requiere cuenta
* Solo datos de mercado (no trading real)

Ejemplo:

```
BTCUSDT
Timeframe: 1h / 15m / etc
```

---

## 📈 Ejemplo de salida

```
Corrección ZigZag detectada
Precio actual: 81500

Señal:
NO_TRADE
Razón: precio ya superó TP3

Take Profit:
TP1: 77642
TP2: 79308
TP3: 80931

Riesgo:
Cantidad: 0.01 BTC
```

---

## ⚠️ Estado actual

✔ Detección de swings
✔ Corrección ABC válida
✔ Señales de entrada
✔ Gestión de riesgo
✔ Take Profit dinámico
✔ Filtro de entradas tardías

❗ Pendiente:

* Impulsos Elliott completos (nivel avanzado)
* Bot en tiempo real
* Backtesting
* Multi-timeframe
* Ejecución real (exchange API)

---

## 🧪 Próximos pasos

1. 🔁 Ejecutar en bucle (bot)
2. 📊 Backtesting histórico
3. 🌍 Multi-activo (BTC, ETH, NASDAQ)
4. 🤖 Integración con exchange
5. 🧠 Mejora detección Elliott

---

## ⚠️ Disclaimer

Este software es solo para fines educativos.
No constituye asesoramiento financiero.

---

## 👨‍💻 Autor

Sistema diseñado paso a paso con lógica profesional de trading basada en:

* Elliott Wave Theory
* Fibonacci
* Price Action estructural

---

## 💡 Nota importante

Si ves:

```
NO_TRADE → entrada tardía
```

👉 No es un error.

👉 Es una de las funciones más importantes del sistema.

---

## 🧠 Filosofía del sistema

> “No operar también es una decisión.”

---
