import fs from "fs";
import path from "path";

const filePath = path.resolve("signals/signals.json");

export function logSignal(data) {
  try {
    let signals = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      signals = raw ? JSON.parse(raw) : [];
    }

    const newSignal = {
      timestamp: new Date().toISOString(),
      ...data
    };

    signals.push(newSignal);

    fs.writeFileSync(filePath, JSON.stringify(signals, null, 2));

    console.log("Señal guardada en signals.json");
  } catch (error) {
    console.error("Error guardando señal:", error.message);
  }
}