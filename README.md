# VLE — Dampf-Flüssigkeit-Gleichgewicht

Interaktive Simulation zur Aufnahme des Siedediagramms (T-x-y) des
Zweistoffsystems Benzol/Toluol im Ohm-Corporate-Design.

## Funktionen

- **Startvorlage wählen:** Reinstoff (Benzol oder Toluol), Startmenge und Druck
  festlegen (nur vor der ersten Zugabe änderbar).
- **Schrittweise Zugabe** der jeweils anderen Komponente; die Apparatur heizt
  auf und schwingt sich auf die neue Siedetemperatur ein (Zeitraffer einstellbar).
- **Probenahme** aus Sumpf (Flüssigkeit, x) und Kondensat (Dampf, y), sobald
  die Temperatur stabil ist.
- **T-x-y-Diagramm** mit den angefahrenen Messpunkten, Zoom per Ziehen und Mausrad.
- **CSV-Export** der Messpunkte.

## Modell

- Dampfdrücke nach Antoine, Gleichgewicht nach dem Raoult'schen Gesetz
  (nahezu ideales Gemisch).
- Siede- und Taupunkt per Bisektion beim eingestellten Druck p.
- Betriebspunkt nach dem Hebelgesetz: 50 Massen-% im Dampf, 50 Massen-% in
  der Flüssigkeit.

## Schnellstart

```bash
npm install
npm run dev
```

## Produktions-Build

```bash
npm run build
```
