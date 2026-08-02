import React, { useState, useRef, useEffect } from "react";
import {
  ComposedChart, Scatter, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, ReferenceArea, Tooltip,
} from "recharts";

/* ---------------------------------------------------------------------
   TOKENS — "die Ohm" Corporate Design
--------------------------------------------------------------------- */
const OHM_RED = "#C72426";
const OHM_BLUE = "#16283D";
const INK = OHM_BLUE;
const BG = "#F4F4F3";
const PANEL = "#FFFFFF";
const PANEL_BORDER = "#E0DEDC";
const GRAY = "#6B6B6B";
const CHART_BG = "#FFFFFF";
const CHART_GRID = "#E5E3E1";
const SANS = "'Inter', 'IBM Plex Sans', ui-sans-serif, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const P_NORMAL_HPA = 1013; // hPa, Normaldruck (Default)
const HPA_TO_MMHG = 0.750062;
const BENZ = { A: 6.90565, B: 1211.033, C: 220.790 };
const TOL = { A: 6.95464, B: 1344.800, C: 219.482 };
const M_BENZ = 78.11; // g/mol
const M_TOL = 92.14; // g/mol
const TAU_HEAT = 20; // s, feste thermische Zeitkonstante des Aufheizens (nicht einstellbar)
const STABLE_EPS = 0.05; // °C, Toleranz für "stabil"
const STABLE_HOLD = 6; // s, so lange muss es innerhalb der Toleranz bleiben
const T_ROOM = 25; // °C, Starttemperatur nach 'Neuer Ansatz'
const OHM_LOGO = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJFYmVuZV8yIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjkuNDMgNDAuODQiPjxnIGlkPSJMb2dvIj48Zz48Zz48cGF0aCBkPSJtMTE2LjI2LDE4LjI4di02LjVoLTIuMzh2LS44N2g1LjU4di44N2gtMi4yNXY2LjVoLS45NVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTIyLDE4LjM5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjcuNjcsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMS4wMSwxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzNi44OSwxOC4yOHYtNS4yN2guOTJ2Ljc2Yy4wOC0uMTUuMi0uMjguMzUtLjQxLjE1LS4xMy4zMy0uMjMuNTUtLjMxcy40Ni0uMTIuNzUtLjEyYy4zMywwLC42NC4wNy45Mi4ycy41LjM0LjY3LjYyYy4xNy4yOC4yNS42NC4yNSwxLjA4djMuNDVoLS45NHYtMy4zNWMwLS40MS0uMTEtLjcyLS4zMi0uOTItLjIyLS4yLS41LS4zLS44NC0uMy0uMjQsMC0uNDYuMDQtLjY3LjEyLS4yMS4wOC0uMzguMTktLjUuMzUtLjEzLjE1LS4xOS4zNS0uMTkuNTh2My41MmgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNDIuNzcsMTEuOXYtLjk4aC45N3YuOThoLS45N1ptLjAzLDYuMzl2LTUuMjdoLjkxdjUuMjdoLS45MVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTQ3LjIsMTguMzljLS4zNywwLS43MS0uMDYtMS4wMi0uMTctLjMxLS4xMS0uNTgtLjI5LS43OC0uNTQtLjIxLS4yNC0uMzQtLjU1LS4zOS0uOTNoLjg2Yy4wNC4yMS4xMy4zOC4yNS41Mi4xMi4xNC4yOC4yNC40Ny4zMS4xOS4wNy4zOS4xLjYxLjEuMzYsMCwuNjQtLjA3Ljg2LS4yLjIyLS4xMy4zMy0uMzQuMzMtLjYxLDAtLjE5LS4wNi0uMzUtLjE3LS40Ny0uMTEtLjEyLS4yOS0uMi0uNTMtLjI2bC0xLjA5LS4yN2MtLjQyLS4xLS43Ni0uMjYtMS4wMi0uNDgtLjI1LS4yMi0uMzgtLjUyLS4zOC0uOTEsMC0uMzEuMDctLjU4LjIyLS44MnMuMzctLjQyLjY3LS41NmMuMy0uMTQuNjctLjIsMS4xMS0uMi41NywwLDEuMDQuMTMsMS4zOS4zOS4zNS4yNi41My42My41NSwxLjEzaC0uODRjLS4wMy0uMjUtLjE1LS40NS0uMzQtLjYtLjE5LS4xNS0uNDUtLjIyLS43Ny0uMjJzLS42MS4wNy0uODIuMmMtLjIxLjEzLS4zMi4zNC0uMzIuNjIsMCwuMTkuMDguMzMuMjMuNDQuMTUuMTEuMzcuMi42Ni4yN2wxLjA2LjI3Yy4yNC4wNi40NC4xNS42LjI1LjE2LjExLjI5LjIyLjM4LjM1cy4xNi4yNi4yLjQxLjA2LjI4LjA2LjQxYzAsLjMyLS4wOC42LS4yNC44My0uMTYuMjMtLjM5LjQxLS42OS41NC0uMy4xMy0uNjcuMTktMS4xLjE5WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTIuNTgsMTguMzljLS40OCwwLS45LS4xLTEuMjYtLjMxcy0uNjUtLjUxLS44Ni0uOTJjLS4yMS0uNC0uMzEtLjktLjMxLTEuNDksMC0uNTUuMDktMS4wMy4yOC0xLjQ0LjE5LS40MS40Ni0uNzQuODMtLjk3LjM2LS4yMy44LS4zNSwxLjMyLS4zNS4zOCwwLC43Mi4wNywxLjAyLjIycy41NS4zNS43NC42MWMuMTkuMjcuMzEuNTguMzYuOTRoLS44NGMtLjAzLS4xOS0uMS0uMzYtLjIxLS41MS0uMTEtLjE1LS4yNS0uMjgtLjQzLS4zN3MtLjM5LS4xNC0uNjMtLjE0Yy0uNDUsMC0uODIuMTYtMS4xLjQ5LS4yOC4zMy0uNDMuODMtLjQzLDEuNSwwLC42MS4xMywxLjA5LjM5LDEuNDYuMjYuMzcuNjQuNTUsMS4xNS41NS4yNCwwLC40NS0uMDUuNjMtLjE0LjE4LS4wOS4zMi0uMjIuNDMtLjM3cy4xOC0uMzIuMjEtLjVoLjgyYy0uMDQuMzUtLjE2LjY2LS4zNi45Mi0uMi4yNi0uNDQuNDYtLjc0LjYtLjMuMTQtLjY0LjIxLTEuMDEuMjFaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE1NS45MywxOC4yOHYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE2NC4wNCwxOC4zOWMtLjQ5LDAtLjkyLS4xMS0xLjI5LS4zMi0uMzctLjIxLS42Ny0uNTItLjg4LS45Mi0uMjEtLjQtLjMyLS44OC0uMzItMS40NHMuMS0xLjA0LjI5LTEuNDYuNDctLjc0LjgzLS45OGMuMzYtLjI0LjgtLjM1LDEuMzEtLjM1cy45Mi4xMSwxLjI2LjMyYy4zNC4yMS42LjUyLjc4LjkxLjE4LjM5LjI3Ljg1LjI3LDEuMzh2LjM1aC0zLjc4YzAsLjMzLjA1LjYzLjE3LjkuMTEuMjcuMjguNDkuNS42NS4yMi4xNi41MS4yNC44NS4yNHMuNjMtLjA4Ljg3LS4yMy40LS4zOC40Ny0uNjhoLjg5Yy0uMDYuMzYtLjIuNjYtLjQzLjktLjIyLjI0LS40OS40My0uOC41NS0uMzEuMTItLjY0LjE5LS45OC4xOVptLTEuNTMtMy4xNmgyLjg2YzAtLjMtLjA1LS41OC0uMTUtLjgyLS4xLS4yNC0uMjYtLjQ0LS40Ny0uNTgtLjIxLS4xNC0uNDctLjIxLS43OS0uMjFzLS42LjA4LS44Mi4yNC0uMzguMzYtLjQ4LjYxLS4xNi41LS4xNS43NloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTE1LjAyLDI4LjY5di03LjM3aC45NHYzLjE0aDMuOTh2LTMuMTRoLjk0djcuMzdoLS45NHYtMy40aC0zLjk4djMuNGgtLjk0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMjQuNjcsMjguNzljLS40OSwwLS45MS0uMS0xLjI3LS4zMS0uMzYtLjIxLS42NC0uNTItLjg0LS45Mi0uMi0uNC0uMy0uOS0uMy0xLjQ4LDAtLjU1LjA5LTEuMDMuMjgtMS40NS4xOS0uNDIuNDYtLjc0LjgyLS45N3MuOC0uMzQsMS4zMi0uMzRjLjQ5LDAsLjkxLjExLDEuMjYuMzIuMzYuMjEuNjMuNTIuODMuOTMuMi40MS4zLjkxLjMsMS41LDAsLjU0LS4wOSwxLjAxLS4yOCwxLjQyLS4xOC40MS0uNDUuNzMtLjgxLjk2LS4zNi4yMy0uNzkuMzQtMS4zMi4zNFptMC0uNzRjLjMxLDAsLjU4LS4wOC43OS0uMjRzLjM4LS4zOS41LS42OWMuMTEtLjMuMTctLjY1LjE3LTEuMDcsMC0uMzgtLjA1LS43Mi0uMTUtMS4wMnMtLjI2LS41NC0uNDctLjcyLS40OS0uMjctLjg0LS4yN2MtLjMyLDAtLjU5LjA4LS44MS4yNHMtLjM5LjM5LS41LjY5Yy0uMTEuMy0uMTcuNjYtLjE3LDEuMDgsMCwuMzcuMDUuNzEuMTUsMS4wMS4xLjMuMjYuNTQuNDguNzIuMjIuMTguNS4yNi44NS4yNloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTMwLjQ1LDI4Ljc5Yy0uNDgsMC0uOS0uMS0xLjI2LS4zMXMtLjY1LS41MS0uODYtLjkyYy0uMjEtLjQtLjMxLS45LS4zMS0xLjQ5LDAtLjU1LjA5LTEuMDMuMjgtMS40NC4xOS0uNDEuNDYtLjc0LjgzLS45Ny4zNi0uMjMuOC0uMzUsMS4zMi0uMzUuMzgsMCwuNzIuMDcsMS4wMi4yMnMuNTUuMzUuNzQuNjFjLjE5LjI3LjMxLjU4LjM2Ljk0aC0uODRjLS4wMy0uMTktLjEtLjM2LS4yMS0uNTEtLjExLS4xNS0uMjUtLjI4LS40My0uMzdzLS4zOS0uMTQtLjYzLS4xNGMtLjQ1LDAtLjgyLjE2LTEuMS40OS0uMjguMzMtLjQzLjgzLS40MywxLjUsMCwuNjEuMTMsMS4wOS4zOSwxLjQ2LjI2LjM3LjY0LjU1LDEuMTUuNTUuMjQsMCwuNDUtLjA1LjYzLS4xNC4xOC0uMDkuMzItLjIyLjQzLS4zN3MuMTgtLjMyLjIxLS41aC44MmMtLjA0LjM1LS4xNi42Ni0uMzYuOTItLjIuMjYtLjQ0LjQ2LS43NC42LS4zLjE0LS42NC4yMS0xLjAxLjIxWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMzMuOCwyOC42OXYtNy41N2guOTJ2My4wOGMuMDktLjE1LjIxLS4yOC4zNi0uNDEuMTUtLjEzLjMzLS4yMy41NC0uMzEuMjEtLjA4LjQ2LS4xMi43NC0uMTIuMzQsMCwuNjUuMDYuOTMuMTkuMjguMTMuNS4zMS42Ni41NHMuMjQuNTEuMjQuODR2My43N2gtLjk0di0zLjU4YzAtLjMyLS4xMS0uNTYtLjMyLS43My0uMjItLjE3LS41LS4yNi0uODQtLjI2LS4yNCwwLS40Ni4wNC0uNjYuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OXYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MS41MiwyOC43OWMtLjM3LDAtLjcxLS4wNi0xLjAyLS4xNy0uMzEtLjExLS41OC0uMjktLjc4LS41NC0uMjEtLjI0LS4zNC0uNTUtLjM5LS45M2guODZjLjA0LjIxLjEzLjM4LjI1LjUyLjEyLjE0LjI4LjI0LjQ3LjMxLjE5LjA3LjM5LjEuNjEuMS4zNiwwLC42NC0uMDcuODYtLjIuMjItLjEzLjMzLS4zNC4zMy0uNjEsMC0uMTktLjA2LS4zNS0uMTctLjQ3LS4xMS0uMTItLjI5LS4yLS41My0uMjZsLTEuMDktLjI3Yy0uNDItLjEtLjc2LS4yNi0xLjAyLS40OC0uMjUtLjIyLS4zOC0uNTItLjM4LS45MSwwLS4zMS4wNy0uNTguMjItLjgycy4zNy0uNDIuNjctLjU2Yy4zLS4xNC42Ny0uMiwxLjExLS4yLjU3LDAsMS4wNC4xMywxLjM5LjM5LjM1LjI2LjUzLjYzLjU1LDEuMTNoLS44NGMtLjAzLS4yNS0uMTUtLjQ1LS4zNC0uNi0uMTktLjE1LS40NS0uMjItLjc3LS4yMnMtLjYxLjA3LS44Mi4yYy0uMjEuMTMtLjMyLjM0LS4zMi42MiwwLC4xOS4wOC4zMy4yMy40NC4xNS4xMS4zNy4yLjY2LjI3bDEuMDYuMjdjLjI0LjA2LjQ0LjE1LjYuMjUuMTYuMTEuMjkuMjIuMzguMzVzLjE2LjI2LjIuNDEuMDYuMjguMDYuNDFjMCwuMzItLjA4LjYtLjI0LjgzLS4xNi4yMy0uMzkuNDEtLjY5LjU0LS4zLjEzLS42Ny4xOS0xLjEuMTlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni45MSwyOC43OWMtLjQ4LDAtLjktLjEtMS4yNi0uMzFzLS42NS0uNTEtLjg2LS45MmMtLjIxLS40LS4zMS0uOS0uMzEtMS40OSwwLS41NS4wOS0xLjAzLjI4LTEuNDQuMTktLjQxLjQ2LS43NC44My0uOTcuMzYtLjIzLjgtLjM1LDEuMzItLjM1LjM4LDAsLjcyLjA3LDEuMDIuMjJzLjU1LjM1Ljc0LjYxYy4xOS4yNy4zMS41OC4zNi45NGgtLjg0Yy0uMDMtLjE5LS4xLS4zNi0uMjEtLjUxLS4xMS0uMTUtLjI1LS4yOC0uNDMtLjM3cy0uMzktLjE0LS42My0uMTRjLS40NSwwLS44Mi4xNi0xLjEuNDktLjI4LjMzLS40My44My0uNDMsMS41LDAsLjYxLjEzLDEuMDkuMzksMS40Ni4yNi4zNy42NC41NSwxLjE1LjU1LjI0LDAsLjQ1LS4wNS42My0uMTQuMTgtLjA5LjMyLS4yMi40My0uMzdzLjE4LS4zMi4yMS0uNWguODJjLS4wNC4zNS0uMTYuNjYtLjM2LjkyLS4yLjI2LS40NC40Ni0uNzQuNi0uMy4xNC0uNjQuMjEtMS4wMS4yMVoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTUwLjI2LDI4LjY5di03LjU3aC45MnYzLjA4Yy4wOS0uMTUuMjEtLjI4LjM2LS40MS4xNS0uMTMuMzMtLjIzLjU0LS4zMS4yMS0uMDguNDYtLjEyLjc0LS4xMi4zNCwwLC42NS4wNi45My4xOS4yOC4xMy41LjMxLjY2LjU0cy4yNC41MS4yNC44NHYzLjc3aC0uOTR2LTMuNThjMC0uMzItLjExLS41Ni0uMzItLjczLS4yMi0uMTctLjUtLjI2LS44NC0uMjYtLjI0LDAtLjQ2LjA0LS42Ni4xMi0uMjEuMDgtLjM4LjE5LS41LjM1LS4xMy4xNS0uMTkuMzUtLjE5LjU5djMuNTJoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU4LjA4LDI4Ljc5Yy0uMjgsMC0uNTMtLjA0LS43OC0uMTItLjI0LS4wOC0uNDYtLjE5LS42NC0uMzQtLjE5LS4xNS0uMzMtLjM0LS40NC0uNTYtLjExLS4yMi0uMTYtLjQ4LS4xNi0uNzh2LTMuNThoLjk0djMuNDhjMCwuMzQuMTEuNjIuMzIuODQuMjEuMjEuNTMuMzIuOTYuMzIuMzksMCwuNy0uMS45NC0uMy4yNC0uMi4zNS0uNS4zNS0uOXYtMy40M2guOTR2NS4yN2gtLjc1bC0uMS0xLjAxYy0uMDYuMjctLjE3LjQ4LS4zMy42NC0uMTYuMTYtLjM0LjI4LS41Ni4zNnMtLjQ1LjExLS43LjExWiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNjMuNDUsMjguNzZjLS4yOSwwLS41Mi0uMDQtLjY5LS4xMi0uMTgtLjA4LS4zMS0uMTgtLjQtLjMyLS4wOS0uMTMtLjE2LS4yOC0uMTktLjQ2LS4wMy0uMTctLjA1LS4zNS0uMDUtLjUzdi02LjIyaC45M3Y2LjEzYzAsLjI2LjA1LjQ2LjE2LjYuMS4xMy4yNS4yMS40NC4yMmguMjl2LjYyYy0uMDguMDItLjE2LjA0LS4yNC4wNi0uMDguMDItLjE2LjAyLS4yMy4wMloiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTY3LjE5LDI4Ljc5Yy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMTUuMDIsMzkuMXYtNy4zN2guOWwzLjg5LDUuNzN2LTUuNzNoLjk0djcuMzdoLS44NGwtMy45Ni01LjgxdjUuODFoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI0LjQ1LDM5LjJjLS4yOCwwLS41My0uMDQtLjc4LS4xMi0uMjQtLjA4LS40Ni0uMTktLjY0LS4zNC0uMTktLjE1LS4zMy0uMzQtLjQ0LS41Ni0uMTEtLjIyLS4xNi0uNDgtLjE2LS43OHYtMy41OGguOTR2My40OGMwLC4zNC4xMS42Mi4zMi44NC4yMS4yMS41My4zMi45Ni4zMi4zOSwwLC43LS4xLjk0LS4zLjI0LS4yLjM1LS41LjM1LS45di0zLjQzaC45NHY1LjI3aC0uNzVsLS4xLTEuMDFjLS4wNi4yNy0uMTcuNDgtLjMzLjY0LS4xNi4xNi0uMzQuMjgtLjU2LjM2cy0uNDUuMTEtLjcuMTFabS0xLjI0LTYuNTZ2LS45MWguOTN2LjkxaC0uOTNabTEuOTgsMHYtLjkxaC45M3YuOTFoLS45M1oiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTI4LjQ5LDM5LjF2LTUuMjdoLjl2MS4wMWMuMDktLjI1LjIxLS40Ni4zNy0uNjIuMTYtLjE3LjM0LS4yOS41NS0uMzcuMjEtLjA4LjQyLS4xMi42NC0uMTIuMDgsMCwuMTUsMCwuMjMuMDIuMDguMDEuMTMuMDMuMTcuMDV2LjkxYy0uMDUtLjAyLS4xMi0uMDQtLjItLjA1cy0uMTUtLjAxLS4yLS4wMWMtLjIxLS4wMS0uNDEsMC0uNTkuMDRzLS4zNC4xMS0uNDguMmMtLjE0LjEtLjI1LjIyLS4zMy4zOC0uMDguMTUtLjEyLjM0LS4xMi41NnYzLjI4aC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTEzMi40OCwzOS4xdi01LjI3aC45MnYuNzZjLjA4LS4xNS4yLS4yOC4zNS0uNDEuMTUtLjEzLjMzLS4yMy41NS0uMzFzLjQ2LS4xMi43NS0uMTJjLjMzLDAsLjY0LjA3LjkyLjJzLjUuMzQuNjcuNjJjLjE3LjI4LjI1LjY0LjI1LDEuMDh2My40NWgtLjk0di0zLjM1YzAtLjQxLS4xMS0uNzItLjMyLS45Mi0uMjItLjItLjUtLjMtLjg0LS4zLS4yNCwwLS40Ni4wNC0uNjcuMTItLjIxLjA4LS4zOC4xOS0uNS4zNS0uMTMuMTUtLjE5LjM1LS4xOS41OHYzLjUyaC0uOTRaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0MC45NywzOS4yYy0uMzEsMC0uNTctLjA0LS43OC0uMTItLjIxLS4wOC0uMzktLjE5LS41Mi0uMzEtLjE0LS4xMy0uMjQtLjI2LS4zMi0uMzktLjA4LS4xMy0uMTMtLjI1LS4xNi0uMzVsLS4xLDEuMDhoLS43MnYtNy41N2guOTV2My4xNGMuMDQtLjA5LjExLS4xOS4yLS4yOS4wOS0uMS4yMS0uMjEuMzUtLjMxcy4zMS0uMTguNTEtLjI0Yy4yLS4wNi40Mi0uMS42Ny0uMS42NiwwLDEuMTguMjMsMS41Ny42OS4zOS40Ni41OCwxLjEzLjU4LDIuMDMsMCwuNTUtLjA4LDEuMDQtLjI1LDEuNDUtLjE3LjQxLS40MS43My0uNzQuOTYtLjMzLjIzLS43NC4zNC0xLjIzLjM0Wm0tLjE3LS43MmMuNDMsMCwuNzgtLjE3LDEuMDQtLjUuMjctLjMzLjQtLjg2LjQtMS41OCwwLS42Mi0uMTItMS4wOS0uMzgtMS40My0uMjUtLjM0LS42MS0uNTEtMS4wOS0uNTEtLjM1LDAtLjYzLjA4LS44NC4yMy0uMjEuMTUtLjM3LjM3LS40Ny42Ni0uMS4yOS0uMTUuNjQtLjE2LDEuMDUsMCwuNzQuMTIsMS4yNy4zNCwxLjU5LjIzLjMyLjYxLjQ5LDEuMTQuNDlaIiBmaWxsPSIjYzcyNDI2Ii8+PHBhdGggZD0ibTE0Ni42NywzOS4yYy0uNDksMC0uOTItLjExLTEuMjktLjMyLS4zNy0uMjEtLjY3LS41Mi0uODgtLjkyLS4yMS0uNC0uMzItLjg4LS4zMi0xLjQ0cy4xLTEuMDQuMjktMS40Ni40Ny0uNzQuODMtLjk4Yy4zNi0uMjQuOC0uMzUsMS4zMS0uMzVzLjkyLjExLDEuMjYuMzJjLjM0LjIxLjYuNTIuNzguOTEuMTguMzkuMjcuODUuMjcsMS4zOHYuMzVoLTMuNzhjMCwuMzMuMDUuNjMuMTcuOS4xMS4yNy4yOC40OS41LjY1LjIyLjE2LjUxLjI0Ljg1LjI0cy42My0uMDguODctLjIzLjQtLjM4LjQ3LS42OGguODljLS4wNi4zNi0uMi42Ni0uNDMuOS0uMjIuMjQtLjQ5LjQzLS44LjU1LS4zMS4xMi0uNjQuMTktLjk4LjE5Wm0tMS41My0zLjE2aDIuODZjMC0uMy0uMDUtLjU4LS4xNS0uODItLjEtLjI0LS4yNi0uNDQtLjQ3LS41OC0uMjEtLjE0LS40Ny0uMjEtLjc5LS4yMXMtLjYuMDgtLjgyLjI0LS4zOC4zNi0uNDguNjEtLjE2LjUtLjE1Ljc2WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNTAuMjEsMzkuMXYtNS4yN2guOXYxLjAxYy4wOS0uMjUuMjEtLjQ2LjM3LS42Mi4xNi0uMTcuMzQtLjI5LjU1LS4zNy4yMS0uMDguNDItLjEyLjY0LS4xMi4wOCwwLC4xNSwwLC4yMy4wMi4wOC4wMS4xMy4wMy4xNy4wNXYuOTFjLS4wNS0uMDItLjEyLS4wNC0uMi0uMDVzLS4xNS0uMDEtLjItLjAxYy0uMjEtLjAxLS40MSwwLS41OS4wNHMtLjM0LjExLS40OC4yYy0uMTQuMS0uMjUuMjItLjMzLjM4LS4wOC4xNS0uMTIuMzQtLjEyLjU2djMuMjhoLS45NFoiIGZpbGw9IiNjNzI0MjYiLz48cGF0aCBkPSJtMTU2LjI3LDQwLjg0Yy0uODMsMC0xLjQ3LS4xMi0xLjkzLS4zNi0uNDYtLjI0LS42OS0uNTgtLjY5LTEuMDMsMC0uMTkuMDQtLjM1LjEzLS40OS4wOS0uMTMuMTktLjI1LjMyLS4zMy4xMi0uMDkuMjQtLjE2LjM0LS4yMS4xLS4wNS4xNy0uMDkuMi0uMTEtLjA2LS4wMy0uMTMtLjA4LS4yMS0uMTMtLjA4LS4wNS0uMTYtLjEyLS4yMy0uMnMtLjEtLjItLjEtLjMzYzAtLjE3LjA4LS4zMi4yMy0uNDYuMTYtLjE0LjM5LS4yNC43LS4zMS0uMzEtLjE2LS41NS0uMzYtLjcyLS42Mi0uMTctLjI2LS4yNi0uNTQtLjI2LS44NCwwLS4zNC4wOS0uNjQuMjgtLjg5LjE4LS4yNS40NS0uNDQuNzktLjU4LjM0LS4xMy43NS0uMiwxLjIzLS4yLjM0LDAsLjYzLjA0Ljg2LjEyLjIzLjA4LjQ1LjE5LjY1LjM0LjA1LS4wMi4xNC0uMDYuMjYtLjExLjEyLS4wNS4yNS0uMS4zOS0uMTYuMTQtLjA2LjI3LS4xMS40LS4xN3MuMjItLjA5LjMtLjEydi44N3MtLjkzLjE3LS45My4xN2MuMDUuMTEuMS4yMy4xMy4zNi4wMy4xMy4wNC4yNS4wNC4zNiwwLC4zMS0uMDguNTktLjI0Ljg0LS4xNi4yNS0uNDEuNDUtLjczLjYtLjMzLjE1LS43My4yMi0xLjIyLjIyLS4wNCwwLS4wOSwwLS4xNiwwLS4wNiwwLS4xMiwwLS4xNiwwLS4zNiwwLS42MS4wNS0uNzQuMTItLjEzLjA3LS4yLjE1LS4yLjIzLDAsLjEuMDguMTcuMjMuMi4xNS4wNC40MS4wNy43OC4xLjEzLDAsLjMuMDEuNDkuMDMuMiwwLC40MS4wMi42Ni4wNC41NS4wMy45OC4xNywxLjI3LjQycy40NS41OC40NSwxYzAsLjQ4LS4yMS44Ny0uNjQsMS4xNy0uNDMuMy0xLjA4LjQ1LTEuOTUuNDVabS4xNy0uNjFjLjQ5LDAsLjg2LS4wNywxLjEyLS4yMi4yNi0uMTUuMzktLjM3LjM5LS42NiwwLS4yMS0uMDgtLjM4LS4yNC0uNTEtLjE2LS4xNC0uNC0uMjEtLjcyLS4yM2wtMS40OC0uMWMtLjEzLDAtLjI3LjAzLS40MS4xLS4xNC4wNy0uMjYuMTctLjM2LjNzLS4xNS4yOC0uMTUuNDRjMCwuMjguMTUuNS40NS42NS4zLjE2Ljc3LjIzLDEuNC4yM1ptLS4xNi0zLjc2Yy4zOCwwLC42OC0uMDkuOTItLjI3LjIzLS4xOC4zNS0uNDQuMzUtLjc4cy0uMTItLjYyLS4zNS0uODEtLjU0LS4yOC0uOTItLjI4LS43LjA5LS45NC4yOC0uMzUuNDYtLjM1LjgxYzAsLjMzLjExLjU5LjM0Ljc3LjIzLjE4LjU0LjI4Ljk1LjI4WiIgZmlsbD0iI2M3MjQyNiIvPjwvZz48Zz48cGF0aCBkPSJtNTcuODMsMjEuODZjLjEzLTUuNS0zLjExLTEwLjQ4LTguODctMTEuMTQtMi43NC0uMjQtNS42My43NS03Ljc5LDIuNSwwLS4yOSwwLS41Ny4wMy0uODYuMDctMy4wOC4xMi05LjI4LjEtMTIuMzZoLTYuMDJ2MzkuMWg2LjAyczAtMTAuOTgsMC0xNC4zN2gwczAtMS4zNSwwLTIuNjRjLjA2LTEuNzQuMzktMy41NiwxLjcxLTQuNTcsMS41Ni0xLjE4LDQuMzktMS4zOCw2LjE4LS41OCwxLjUyLjcyLDIuMDksMS44MSwyLjQ4LDMuNDguMS42NS4xNywyLjI3LjE3LDQuMzIsMCw0LjY5LS4wOCwxMy4wOS0uMDIsMTQuMzYsMCwwLDYuMDIsMCw2LjAyLDAtLjAxLTEuMi4wMi0xNi40MywwLTE3LjI0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xMDEuNjYsMzMuNDJzLS4wNSwwLS4wOC4wMWMwLTQuODQuMDEtMTEuMDYsMC0xMS41Ny4xNy01LjI5LTMuMTctMTAuNzctOC44Ni0xMS4xOC0zLjU1LS4yOC03LjYxLjk4LTkuODEsMy45MS0xLjUyLTIuMTEtMy44LTMuNjEtNi43Mi0zLjkyLS45Mi0uMDUtMS44NS4wMi0yLjc3LjIxLTEuODMuMzUtMy41OSwxLjE4LTUuMDMsMi4zNC0uMDItLjgzLS4wMi0xLjY1LDAtMi40OGgtNS45djI4LjM2aDYuMDJsLjAyLTcuMDl2LTcuMDljMC0uMzksMC0yLjgyLDAtMywwLS42Mi4wNy0xLjA4LjE0LTEuNDcuMTMtLjcuMzQtMS4zNy42OC0xLjk0LjE2LS4yNi4zNC0uNS41Ni0uNzIuMDEtLjAxLjIyLS4xOS4zMS0uMjcsMS4yLS44OCwyLjgzLTEuMTUsNC4zMS0xLjAzLjY4LjA2LDEuMzIuMjEsMS44Ny40NS43Ni4zNiwxLjI4LjgxLDEuNjcsMS4zOC4xMi4xOS4yMy4zOS4zMy42LjIuNDQuMzYuOTMuNDksMS41LjAzLjE2LjA1LjM4LjA3LjY0LDAsLjA5LjAxLjE4LjAyLjI4LjAxLjI2LjAzLjU1LjA0Ljg3LDAsLjAxLDAsLjAyLDAsLjAzLDAsLjI3LjAyLDEuMzEuMDIsMS40OS4wMywzLjQ0LDAsNi44NywwLDEwLjMxLDAsLjI0LDAsNS4wNSwwLDUuMDUsMCwwLDEuNywwLDMuMjksMCwuMzcsMCwuNzQsMCwxLjA4LDBzLjY1LDAsLjkxLDBoLjc0czAtLjAzLDAtLjA0aDBzMC0zLjIyLDAtNi43YzAtMS4xNiwwLTIuMzcsMC0zLjU0LDAtLjI1LDAtMy41OCwwLTQuNjYsMC0uMTgsMC0uNTEsMC0uNTEsMCwwLDAtMS40NCwwLTEuNDgsMC0xLjMzLjI4LTMsMS4wMy0zLjk1LDEuMDItMS4zMiwyLjUzLTEuNjgsNC4yNi0xLjczLDEuNjktLjA2LDMuMzEuNDIsNC4yLDEuNzUuNjQuODgsMS4wMiwyLjM3LDEuMDMsMy42MnYxLjkyczAsMTUuMzIsMCwxNS4zMmMwLDAsNi4wMiwwLDYuMDIsMGgwczYuMSwwLDYuMSwwdi02LjAyYy0xLjc0LS4wMi0zLjg5LS4wNy02LjAzLjM0WiIgZmlsbD0iI2M3MjQyNiIvPjxwYXRoIGQ9Im0xNy4yNSwxMC4zN2gwYy02LjAzLjA4LTExLjQ3LDIuODYtMTMuMzYsOC45LTEuNDEsNC40NC0uOTcsOS4xMywxLjUzLDEzLjExLjIzLjM1LjQ5LjY4Ljc3Ljk5LTIuMDUtLjM2LTQuMTEtLjMyLTYuMTgtLjN2Ni4wMmgxNS4yN3YtNS44MmMtNC4zMS0uNTgtNS45OC0zLjUtNi4wMy04LjY4LS4xNS01LjcxLDIuNDktOC44LDguMDItOC45MmgwYzMuNTUuMDQsNi43MSwxLjY3LDcuNTksNS4yNi42LDIuMjMuNTYsNS4yMi4wMyw3LjQ1LS43LDMuMTEtMi44Nyw0LjUyLTUuNjQsNC44OXY1LjY4YzEuMS0uMTIsMi4yMy0uMzIsMy4zOC0uNjcsOC4xLTIuMzcsMTAuMi0xMS43MSw3Ljk3LTE4Ljk5LTEuOTEtNi03LjMyLTguODMtMTMuMzMtOC45MloiIGZpbGw9IiNjNzI0MjYiLz48L2c+PC9nPjwvZz48L3N2Zz4=";

function de(v, d = 2) { return (isFinite(v) ? v.toFixed(d) : "—").replace(".", ","); }

function psat(T, sub) { return Math.pow(10, sub.A - sub.B / (sub.C + T)); }
function bubblePoint(x1, pMmHg) {
  const x2 = 1 - x1;
  const f = (T) => x1 * psat(T, BENZ) + x2 * psat(T, TOL) - pMmHg;
  let lo = 20, hi = 160;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
  }
  const T = (lo + hi) / 2;
  const y1 = (x1 * psat(T, BENZ)) / pMmHg;
  return { T, y1 };
}
function dewPoint(z1, pMmHg) {
  const z2 = 1 - z1;
  const f = (T) => (z1 * pMmHg) / psat(T, BENZ) + (z2 * pMmHg) / psat(T, TOL) - 1;
  let lo = 20, hi = 160;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}
// analytische binäre Rachford-Rice-Lösung (exakt, keine Iteration nötig)
function flashAtT(T, z1, pMmHg) {
  const K1 = psat(T, BENZ) / pMmHg, K2 = psat(T, TOL) / pMmHg;
  const a = K1 - 1, b = K2 - 1;
  let Vmol = Math.abs(a * b) < 1e-12 ? 0 : -(z1 * a + (1 - z1) * b) / (a * b);
  Vmol = Math.max(0, Math.min(1, Vmol));
  const x1 = z1 / (1 + Vmol * (K1 - 1));
  const y1 = K1 * x1;
  return { Vmol, x1, y1 };
}
function massVaporFraction(T, z1, pMmHg, nTotal) {
  const { Vmol, x1, y1 } = flashAtT(T, z1, pMmHg);
  const nVap = Vmol * nTotal, nLiq = (1 - Vmol) * nTotal;
  const mVap = nVap * (y1 * M_BENZ + (1 - y1) * M_TOL);
  const mLiq = nLiq * (x1 * M_BENZ + (1 - x1) * M_TOL);
  return mVap + mLiq > 0 ? mVap / (mVap + mLiq) : 0;
}
// Hebelgesetz: Temperatur suchen, bei der genau 50 Massen-% im Dampf und 50 Massen-% in der Flüssigkeit vorliegen
function flash50(z1, pMmHg, nTotal) {
  const Tb = bubblePoint(z1, pMmHg).T, Td = dewPoint(z1, pMmHg);
  if (Math.abs(Td - Tb) < 1e-6) return { T: Tb, x1: z1, y1: z1, Vmol: 0 }; // Reinstoff: keine Phasenlücke
  let lo = Tb, hi = Td;
  let flo = massVaporFraction(lo, z1, pMmHg, nTotal) - 0.5;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const fmid = massVaporFraction(mid, z1, pMmHg, nTotal) - 0.5;
    if (flo * fmid <= 0) { hi = mid; } else { lo = mid; flo = fmid; }
  }
  const T = (lo + hi) / 2;
  const { x1, y1, Vmol } = flashAtT(T, z1, pMmHg);
  return { T, x1, y1, Vmol };
}

/* ---------------------------------------------------------------------
   CONTROL WIDGETS
--------------------------------------------------------------------- */
function Field({ label, value, locked, children }) {
  return (
    <div className="mb-3" style={{ opacity: locked ? 0.5 : 1 }}>
      <div className="flex items-baseline justify-between mb-1">
        <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.02em", color: GRAY, fontWeight: 500 }}>
          {label}{locked ? " 🔒" : ""}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK, fontWeight: 700 }}>{value}</span>
      </div>
      {children}
    </div>
  );
}
function LinearSlider({ min, max, step, value, onChange, onCommit, disabled }) {
  return <input className="ohm-slider" type="range" min={min} max={max} step={step} value={value} disabled={disabled}
    onChange={(e) => onChange(parseFloat(e.target.value))}
    onMouseUp={onCommit} onTouchEnd={onCommit} onKeyUp={onCommit} />;
}
function PanelBox({ title, children, noUppercase }) {
  return (
    <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 12.5, letterSpacing: "0.03em", color: INK, textTransform: noUppercase ? "none" : "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `2px solid ${OHM_RED}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
   APPARATUR-GRAFIK — Siedekolben + Kühler + zwei Probenahmen
--------------------------------------------------------------------- */
function Syringe({ cx, cy, angle, color, label, labelPos = "below" }) {
  const labelX = labelPos === "right" ? 34 : 0;
  const labelY = labelPos === "right" ? 3 : 16;
  const labelAnchor = labelPos === "right" ? "start" : "middle";
  return (
    <g transform={`translate(${cx},${cy}) rotate(${angle})`}>
      <rect x={-16} y={-5} width={26} height={10} rx={1.5} fill="#FAFAF9" stroke="#B9B7B4" strokeWidth={1.5} />
      <rect x={-13} y={-3} width={12} height={6} fill={color} opacity={0.55} />
      <line x1={-16} y1={0} x2={-22} y2={0} stroke="#B9B7B4" strokeWidth={2.5} strokeLinecap="round" />
      <line x1={10} y1={0} x2={22} y2={0} stroke="#B9B7B4" strokeWidth={2} />
      <line x1={22} y1={0} x2={30} y2={0} stroke="#B9B7B4" strokeWidth={1} />
      <g transform={`rotate(${-angle})`}>
        <text x={labelX} y={labelY} textAnchor={labelAnchor} fontFamily={MONO} fontSize="6.5" fill={GRAY}>{label}</text>
      </g>
    </g>
  );
}

function XYAxisLabel({ viewBox, fill, fontSize, fontFamily, fontWeight }) {
  const cx = viewBox.x + viewBox.width / 2;
  const cy = viewBox.y + viewBox.height + 6;
  return (
    <text x={cx} y={cy} textAnchor="middle" fill={fill} fontSize={fontSize} fontFamily={fontFamily} fontWeight={fontWeight}>
      x<tspan fontSize={fontSize * 0.72} dy={3}>Benzol</tspan>
      <tspan dy={-3}>, y</tspan>
      <tspan fontSize={fontSize * 0.72} dy={3}>Benzol</tspan>
      <tspan dy={-3}> / %</tspan>
    </text>
  );
}

function CompBar({ cx, cy, w, h, frac, label }) {
  return (
    <g>
      <rect x={cx - w / 2} y={cy} width={w} height={h} rx={h / 2} fill={OHM_BLUE} opacity={0.85} />
      <rect x={cx - w / 2 + w * (1 - frac)} y={cy} width={w * frac} height={h} rx={h / 2} fill={OHM_RED} opacity={0.85} />
      <rect x={cx - w / 2} y={cy} width={w} height={h} rx={h / 2} fill="none" stroke="#fff" strokeWidth={0.6} />
      <text x={cx} y={cy - 3} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={GRAY}>{label}</text>
    </g>
  );
}

function ApparatusGraphic({ xLiquid, T, Ttarget, y, mTotal }) {
  const liquidFrac = Math.max(0.22, Math.min(0.68, 0.22 + (mTotal / 700) * 0.46));
  const liquidTopY = 195 - liquidFrac * 130;
  const bubbles = [
    { cx: 128, delay: 0 }, { cx: 145, delay: 0.5 }, { cx: 160, delay: 1.1 },
    { cx: 172, delay: 0.3 }, { cx: 138, delay: 1.6 }, { cx: 155, delay: 0.9 },
  ];
  return (
    <svg viewBox="0 0 300 230" style={{ width: "100%", height: "100%" }}>
      <defs>
        <clipPath id="flaskClip">
          <path d="M138,30 L138,70 C108,92 92,132 92,152 A58,48 0 1 0 208,152 C208,132 192,92 162,70 L162,30 Z" />
        </clipPath>
      </defs>

      {/* Siedekolben */}
      <path d="M138,30 L138,70 C108,92 92,132 92,152 A58,48 0 1 0 208,152 C208,132 192,92 162,70 L162,30 Z"
        fill="#FAFAF9" stroke="#B9B7B4" strokeWidth={2.5} />
      <g clipPath="url(#flaskClip)">
        <rect x="90" y={liquidTopY} width="220" height="130" fill={OHM_BLUE} opacity={0.28} />
        {/* aufsteigende Blasen */}
        {bubbles.map((b, i) => (
          <circle key={i} className="bubble" cx={b.cx} cy={190} r={2.6}
            fill="#fff" opacity={0.7} style={{ animationDelay: `${b.delay}s` }} />
        ))}
      </g>
      <rect x={100} y={30} width={62} height={165} fill="none" />

      <CompBar cx={150} cy={172} w={64} h={9} frac={xLiquid} label={`Flüssigkeit: ${de(xLiquid * 100, 0)} % Benzol`} />
      <text x={70} y={38} textAnchor="middle" fontFamily={MONO} fontSize="13" fontWeight="700" fill={INK}>ϑ = {de(T, 1)} °C</text>

      {/* Dampf: steigt auf, dann nach rechts zum Kondensator */}
      <path d="M150,28 L150,12 L235,12" fill="none" stroke="#B9B7B4" strokeWidth={4} />
      <polygon points="228,8 235,12 228,16" fill="#B9B7B4" />
      {[0, 1.0, 2.0].map((delay) => (
        <circle key={delay} r={2.4} fill="#fff" stroke={GRAY} strokeWidth={0.4}>
          <animateMotion dur="2.8s" repeatCount="indefinite" begin={`${delay}s`} path={`M150,${liquidTopY - 4} L150,28 L150,12 L233,12`}
            calcMode="spline" keyTimes="0;1" keySplines="0.3 0 0.7 1" />
          <animate attributeName="opacity" values="0;0.9;0.9;0" keyTimes="0;0.1;0.85;1" dur="2.8s" repeatCount="indefinite" begin={`${delay}s`} />
        </circle>
      ))}

      {/* Kondensator (Spirale) */}
      <path d="M235,12 q10,6 0,12 q-10,6 0,12 q10,6 0,12 q-10,6 0,12" fill="none" stroke="#B9B7B4" strokeWidth={3} />
      <text x={252} y={30} fontFamily={MONO} fontSize="6.5" fill={GRAY}>Kondensator</text>

      {/* kleines Gefäß unter dem Kondensator sammelt das Kondensat */}
      <rect x={227} y={48} width={16} height={16} rx={2} fill="#FAFAF9" stroke="#B9B7B4" strokeWidth={1.5} />
      <rect x={229} y={56} width={12} height={6} fill={OHM_RED} opacity={0.5} />
      <CompBar cx={272} cy={82} w={40} h={7} frac={y} label={`Dampf: ${de(y * 100, 0)} % Benzol`} />

      {/* Probe Dampf per Spritze, von schräg rechts oben kommend */}
      <Syringe cx={276} cy={56} angle={180} color={OHM_RED} label="Probe Dampf" />

      {/* Rückführung: Kondensat zurück in den Kolben */}
      <path d="M231,64 C225,90 200,95 172,80" fill="none" stroke="#B9B7B4" strokeWidth={2.5} strokeDasharray="3 3" opacity={0.85} />
      <polygon points="178,75 172,80 179,84" fill={OHM_BLUE} opacity={1} />
      <text x={218} y={100} textAnchor="middle" fontFamily={MONO} fontSize="6.5" fill={GRAY}>Rückführung</text>
      {[0, 0.8, 1.6].map((delay) => (
        <circle key={delay} r={2.2} fill={OHM_BLUE}>
          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${delay}s`} path={`M231,64 C225,90 200,95 172,80 C160,92 150,115 144,${liquidTopY + 8}`}
            calcMode="spline" keyTimes="0;1" keySplines="0.4 0 1 1" />
          <animate attributeName="opacity" values="0.85;0.85;0" keyTimes="0;0.8;1" dur="2.4s" repeatCount="indefinite" begin={`${delay}s`} />
        </circle>
      ))}

      {/* Probe Sumpf per Spritze — Nadel zeigt zur Flüssigkeit, Griff nach außen */}
      <Syringe cx={58} cy={135} angle={20} color={OHM_BLUE} label="Probe Sumpf" />
      <path d="M86.2,145.3 C96,150 108,154 116,157" fill="none" stroke={OHM_BLUE} strokeWidth={2} opacity={0.7} />
    </svg>
  );
}

/* ---------------------------------------------------------------------
   MAIN APP
--------------------------------------------------------------------- */
export default function DampfFluessigkeitMonitor() {
  const [startSubstance, setStartSubstance] = useState("toluol"); // Reinstoff zu Beginn
  const [mStart, setMStart] = useState(200); // g, Startmenge — nur vor der ersten Zugabe änderbar
  const [mAdded, setMAdded] = useState(0); // g, kumulativ zugegebene Menge der anderen Komponente
  const [addAmount, setAddAmount] = useState(10); // g, Menge je Zugabeschritt
  const [pHpa, setPHpa] = useState(P_NORMAL_HPA); // Druck, nur vor der ersten Zugabe änderbar
  const [speed, setSpeed] = useState(5); // Zeitraffer fürs Aufheizen/Einschwingen
  const [locked, setLocked] = useState(false);
  const [collected, setCollected] = useState([]);
  const [zoomDomain, setZoomDomain] = useState(null); // [xMin,xMax,yMinT,yMaxT]
  const [refAreaLeft, setRefAreaLeft] = useState(null);
  const [refAreaRight, setRefAreaRight] = useState(null);
  const [, setTick] = useState(0);

  const pMmHg = pHpa * HPA_TO_MMHG;
  const nBenz = startSubstance === "benzol" ? mStart / M_BENZ : mAdded / M_BENZ;
  const nTol = startSubstance === "toluol" ? mStart / M_TOL : mAdded / M_TOL;
  const nTotal = nBenz + nTol;
  const x = nTotal > 0 ? nBenz / nTotal : startSubstance === "benzol" ? 1 : 0;
  const target = flash50(x, pMmHg, nTotal);

  const paramsRef = useRef({});
  paramsRef.current = { x, pMmHg, speed, nTotal, locked };

  const elapsedRef = useRef(0);
  const TRef = useRef(bubblePoint(startSubstance === "benzol" ? 1 : 0, P_NORMAL_HPA * HPA_TO_MMHG).T);
  const isStableRef = useRef(false);
  const stableSinceRef = useRef(0);

  useEffect(() => {
    let raf, last = performance.now(), frame = 0;
    const step = (now) => {
      const dtReal = Math.min(now - last, 100) / 1000;
      last = now;
      const p = paramsRef.current;
      const dtSim = dtReal * p.speed;
      elapsedRef.current += dtSim;

      const tgt = flash50(p.x, p.pMmHg, p.nTotal).T;
      if (p.locked) {
        TRef.current += ((tgt - TRef.current) / TAU_HEAT) * dtSim;
      } else {
        TRef.current = tgt; // Vorlage wählen/ändern: kein Einschwingen nötig, noch nichts passiert
      }

      if (Math.abs(TRef.current - tgt) < STABLE_EPS) {
        if (!isStableRef.current) {
          isStableRef.current = true;
          stableSinceRef.current = p.locked ? elapsedRef.current : elapsedRef.current - STABLE_HOLD - 1;
        }
      } else {
        isStableRef.current = false;
      }

      frame++;
      if (frame % 3 === 0) setTick((t) => t + 1);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stableDuration = isStableRef.current ? elapsedRef.current - stableSinceRef.current : 0;
  const isReady = isStableRef.current && stableDuration >= STABLE_HOLD;

  const handleAdd = () => {
    setMAdded((m) => m + addAmount);
    setLocked(true);
  };

  const commitPoint = () => {
    if (!isReady) return;
    const r = flash50(x, pMmHg, nTotal);
    setCollected((prev) => {
      const next = [...prev, { xTrue: r.x1, yTrue: r.y1, T: r.T, zOverall: x, mAdded }];
      return next.length > 500 ? next.slice(next.length - 500) : next;
    });
    setLocked(true);
  };
  const handleClear = () => {
    setCollected([]);
    setLocked(false);
    setMAdded(0);
    TRef.current = T_ROOM;
    isStableRef.current = false;
    stableSinceRef.current = elapsedRef.current;
  };

  const exportCSV = () => {
    const csvNum = (v) => (v === null || v === undefined || Number.isNaN(v) ? "" : v.toFixed(5).replace(".", ","));
    const meta = [
      `# VLE-Monitor Messexport (Benzol/Toluol, nahezu ideal)`,
      `# Modell: Raoult'sches Gesetz + Antoine; p=${pHpa} hPa (${pMmHg.toFixed(2)} mmHg)`,
      `# Start: ${mStart} g Reinstoff ${startSubstance === "benzol" ? "Benzol" : "Toluol"}, Zugabe der anderen Komponente in Schritten`,
      `# Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
      ``,
      `x_Fluessigkeit;y_Dampf;T_C;z_Gesamt;zugegeben_g`,
      ...collected.map((p) => `${csvNum(p.xTrue)};${csvNum(p.yTrue)};${csvNum(p.T)};${csvNum(p.zOverall)};${csvNum(p.mAdded)}`),
    ];
    const csvContent = "\uFEFF" + meta.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vle_benzol_toluol_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const liquidPoints = collected.map((p) => ({ x: p.xTrue * 100, T: p.T }));
  const vaporPoints = collected.map((p) => ({ x: p.yTrue * 100, T: p.T }));

  const xDomainBase = [0, 100];
  const yDomainBase = [Math.min(bubblePoint(0, pMmHg).T, bubblePoint(1, pMmHg).T) - 3, Math.max(bubblePoint(0, pMmHg).T, bubblePoint(1, pMmHg).T) + 3];
  const displayDomain = zoomDomain || [...xDomainBase, ...yDomainBase];
  const xDomain = [displayDomain[0], displayDomain[1]];
  const yDomain = [displayDomain[2], displayDomain[3]];

  const handleChartMouseDown = (e) => { if (e && e.activeLabel !== undefined) { setRefAreaLeft(e.activeLabel); setRefAreaRight(e.activeLabel); } };
  const handleChartMouseMove = (e) => { if (refAreaLeft !== null && e && e.activeLabel !== undefined) setRefAreaRight(e.activeLabel); };
  const handleChartMouseUp = () => {
    if (refAreaLeft !== null && refAreaRight !== null && refAreaLeft !== refAreaRight) {
      setZoomDomain([Math.min(refAreaLeft, refAreaRight), Math.max(refAreaLeft, refAreaRight), yDomain[0], yDomain[1]]);
    }
    setRefAreaLeft(null); setRefAreaRight(null);
  };
  const resetZoom = () => setZoomDomain(null);
  const handleWheelZoom = (e) => {
    e.preventDefault();
    const cur = zoomDomain || [...xDomainBase, ...yDomainBase];
    const rect = e.currentTarget.getBoundingClientRect();
    const fracX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const fracY = 1 - Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));
    const anchorX = cur[0] + fracX * (cur[1] - cur[0]);
    const anchorY = cur[2] + fracY * (cur[3] - cur[2]);
    const factor = e.deltaY > 0 ? 1.25 : 0.8;
    const newXMin = anchorX - (anchorX - cur[0]) * factor;
    const newXMax = anchorX + (cur[1] - anchorX) * factor;
    const newYMin = anchorY - (anchorY - cur[2]) * factor;
    const newYMax = anchorY + (cur[3] - anchorY) * factor;
    const fullXSpan = xDomainBase[1] - xDomainBase[0];
    if (newXMax - newXMin >= fullXSpan * 0.999) { setZoomDomain(null); return; }
    if (newXMax - newXMin < fullXSpan * 0.01) return;
    setZoomDomain([newXMin, newXMax, newYMin, newYMax]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0].payload;
    return (
      <div style={{ background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "6px 10px", fontFamily: MONO, fontSize: 11, color: INK, boxShadow: "0 2px 6px rgba(0,0,0,0.12)" }}>
        <div style={{ fontWeight: 700 }}>x = {de(p.x, 1)} % · ϑ = {de(p.T, 2)} °C</div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center p-3 md:p-6" style={{ background: BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        input.ohm-slider { -webkit-appearance:none; appearance:none; width:100%; height:4px; border-radius:2px; background-color:#DEDCDA; cursor:pointer; }
        input.ohm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
          background: ${OHM_RED}; border:2px solid #fff; box-shadow:0 0 0 1px ${PANEL_BORDER}, 0 1px 3px rgba(0,0,0,.25); cursor:pointer; }
        input.ohm-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background: ${OHM_RED}; border:2px solid #fff; cursor:pointer; }
        input.ohm-slider::-moz-range-track { background:#DEDCDA; height:4px; border-radius:2px; }
        .ohm-btn:active { transform: translateY(1px); }
        .medium-btn { font-family: ${SANS}; font-size: 12px; font-weight: 700; padding: 8px 14px; border-radius: 5px; cursor: pointer; }
        @keyframes bubbleRise {
          0% { transform: translateY(0); opacity: 0; }
          12% { opacity: 0.85; }
          85% { opacity: 0.35; }
          100% { transform: translateY(-42px); opacity: 0; }
        }
        .bubble { animation: bubbleRise 2.4s ease-in infinite; transform-box: fill-box; transform-origin: center; }
        @media (prefers-reduced-motion: reduce) { .bubble { animation: none; opacity: 0.5; } }
      `}</style>

      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1360, fontFamily: SANS }}>
        {/* HEADER */}
        <div className="flex items-end justify-between flex-wrap gap-3 pb-3" style={{ borderBottom: `3px solid ${OHM_RED}` }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={OHM_LOGO} alt="Ohm Angewandte Chemie" style={{ height: 34, width: "auto", display: "block" }} />
              <h1 style={{ fontFamily: SANS, fontWeight: 800, fontSize: "clamp(24px,3.2vw,32px)", color: INK, letterSpacing: "-0.01em", lineHeight: 1 }}>
                DAMPF·FLÜSSIG·GLEICHGEWICHT
              </h1>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 12, color: GRAY, marginTop: 6 }}>
              Fakultät Angewandte Chemie · Benzol/Toluol (nahezu ideal) · Probenahme · T-xy-Diagramm
            </p>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: GRAY }}>{collected.length} Messpunkte</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT CONTROLS */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <PanelBox title="Start (nur vor der ersten Zugabe änderbar)">
              <div className="flex gap-2 mb-3">
                <button onClick={() => !locked && setStartSubstance("benzol")} disabled={locked} className="medium-btn" style={{
                  flex: 1, opacity: locked ? 0.5 : 1, cursor: locked ? "not-allowed" : "pointer",
                  background: startSubstance === "benzol" ? OHM_BLUE : "#fff", color: startSubstance === "benzol" ? "#fff" : INK,
                  border: `2px solid ${OHM_BLUE}` }}>Benzol</button>
                <button onClick={() => !locked && setStartSubstance("toluol")} disabled={locked} className="medium-btn" style={{
                  flex: 1, opacity: locked ? 0.5 : 1, cursor: locked ? "not-allowed" : "pointer",
                  background: startSubstance === "toluol" ? OHM_RED : "#fff", color: startSubstance === "toluol" ? "#fff" : INK,
                  border: `2px solid ${OHM_RED}` }}>Toluol</button>
              </div>
              <Field label="Startmenge (Reinstoff)" value={`${de(mStart, 0)} g`} locked={locked}>
                <LinearSlider min={50} max={500} step={10} value={mStart} onChange={setMStart} disabled={locked} />
              </Field>
              <Field label="Druck p" value={`${de(pHpa, 0)} hPa`} locked={locked}>
                <LinearSlider min={700} max={1300} step={1} value={pHpa} onChange={setPHpa} disabled={locked} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                {locked ? "Für diese Messreihe gesperrt — 'Neuer Ansatz' zum Ändern." : `Standard: p_normal = ${P_NORMAL_HPA} hPa.`}
              </div>
            </PanelBox>

            <PanelBox title="Zugabe der anderen Komponente">
              <Field label="Zugabemenge je Schritt" value={`${de(addAmount, 0)} g`}>
                <LinearSlider min={1} max={100} step={1} value={addAmount} onChange={setAddAmount} />
              </Field>
              <button onClick={handleAdd} className="ohm-btn" style={{ width: "100%", fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.02em",
                background: "#fff", color: OHM_BLUE, border: `2px solid ${OHM_BLUE}`, borderRadius: 5, padding: "9px 0", marginTop: 2, marginBottom: 8 }}>
                + {de(addAmount, 0)} g {startSubstance === "benzol" ? "Toluol" : "Benzol"} zugeben
              </button>
              <Field label="Zeitraffer" value={`× ${de(speed, 0)}`}>
                <LinearSlider min={1} max={50} step={1} value={speed} onChange={setSpeed} />
              </Field>
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: GRAY }}>
                Bisher zugegeben: {de(mAdded, 0)} g. Nach jeder Zugabe braucht die Apparatur Zeit, die neue Siedetemperatur zu erreichen und sich einzuschwingen.
              </div>
            </PanelBox>

            <PanelBox title="Status">
              <div style={{ fontFamily: MONO, fontSize: 12, color: isReady ? "#2E9E4F" : OHM_RED, fontWeight: 700, marginBottom: 6 }}>
                {isReady ? "✓ eingeschwungen — Probe nehmen möglich" : Math.abs(TRef.current - target.T) >= STABLE_EPS ? "⏳ Aufheizen / Einschwingen …" : `⏳ stabil seit ${de(stableDuration, 1)} s / ${STABLE_HOLD} s`}
              </div>
              <div style={{ height: 6, background: "#EDEAE5", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (stableDuration / STABLE_HOLD) * 100)}%`, background: isReady ? "#2E9E4F" : OHM_RED, transition: "width 0.2s linear" }} />
              </div>
              <button onClick={commitPoint} disabled={!isReady} className="ohm-btn" style={{ width: "100%", marginTop: 10, fontFamily: SANS, fontWeight: 700, fontSize: 13, letterSpacing: "0.02em",
                background: isReady ? OHM_RED : "#fff", color: isReady ? "#fff" : "#B9B7B4", border: `2px solid ${isReady ? OHM_RED : PANEL_BORDER}`, borderRadius: 5, padding: "9px 0", cursor: isReady ? "pointer" : "not-allowed" }}>
                💉 Probe nehmen
              </button>
            </PanelBox>

            <div className="flex gap-3">
              <button onClick={handleClear} className="ohm-btn" style={{ flex: 1, fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 0", color: INK }}>
                ↺ Neuer Ansatz
              </button>
              <button onClick={exportCSV} className="ohm-btn" style={{ flex: 1, fontFamily: SANS, fontSize: 12, fontWeight: 600, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 5, padding: "9px 0", color: INK }}>
                ⤓ CSV
              </button>
            </div>
          </div>

          {/* CENTER: APPARATUS */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div style={{ position: "relative", background: PANEL, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: 8, height: 300 }}>
              <ApparatusGraphic xLiquid={target.x1} T={TRef.current} Ttarget={target.T} y={target.y1} mTotal={mStart + mAdded} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <PanelBox title="ϑ (aktuell / Ziel)" noUppercase>
                <div style={{ fontFamily: MONO, fontSize: 16, color: OHM_RED, fontWeight: 700 }}>{de(TRef.current, 2)} °C</div>
                <div style={{ fontFamily: MONO, fontSize: 10.5, color: GRAY }}>Ziel: {de(target.T, 2)} °C</div>
              </PanelBox>
              <PanelBox title={<>x<sub>Benzol</sub></>} noUppercase>
                <div style={{ fontFamily: MONO, fontSize: 16, color: OHM_BLUE, fontWeight: 700 }}>{de(target.x1 * 100, 1)} %</div>
              </PanelBox>
              <PanelBox title={<>y<sub>Benzol</sub></>} noUppercase>
                <div style={{ fontFamily: MONO, fontSize: 16, color: OHM_RED, fontWeight: 700 }}>{de(target.y1 * 100, 1)} %</div>
              </PanelBox>
            </div>
            <PanelBox title="Gesamtzusammensetzung (Gas + Flüssigkeit)">
              <div style={{ fontFamily: MONO, fontSize: 18, color: INK, fontWeight: 700 }}>{de(x * 100, 1)} % Benzol</div>
            </PanelBox>
          </div>

          {/* RIGHT: T-XY DIAGRAMM */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div style={{ position: "relative", background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "10px 8px 4px 0" }}>
              <div className="flex items-center justify-between" style={{ padding: "0 10px", marginBottom: 2 }}>
                <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11.5, color: INK, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  T-xy-Diagramm
                </span>
                {zoomDomain && (
                  <button onClick={resetZoom} className="ohm-btn" style={{ fontFamily: MONO, fontSize: 10.5, background: "#fff", border: `1px solid ${PANEL_BORDER}`, borderRadius: 4, padding: "3px 8px", color: OHM_RED }}>
                    ⤾ Zoom zurücksetzen
                  </button>
                )}
              </div>
              <div style={{ width: "100%", height: 420 }} onWheel={handleWheelZoom}>
                <ResponsiveContainer>
                  <ComposedChart margin={{ top: 10, right: 18, bottom: 30, left: 30 }}
                    onMouseDown={handleChartMouseDown} onMouseMove={handleChartMouseMove} onMouseUp={handleChartMouseUp}>
                    <CartesianGrid stroke={CHART_GRID} strokeDasharray="2 4" />
                    <XAxis dataKey="x" type="number" domain={xDomain} allowDataOverflow stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      tickFormatter={(v) => de(v, 0)}
                      label={<XYAxisLabel fill={GRAY} fontSize={12} fontFamily={SANS} fontWeight={600} />} />
                    <YAxis dataKey="T" type="number" domain={yDomain} allowDataOverflow stroke={GRAY} tick={{ fontFamily: MONO, fontSize: 11, fill: GRAY }}
                      tickFormatter={(v) => de(v, 1)} width={54}
                      label={{ value: "ϑ / °C", angle: -90, position: "insideLeft", offset: 8, fill: INK, fontSize: 12.5, fontFamily: SANS, fontWeight: 600, style: { textAnchor: "middle" } }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter data={liquidPoints} dataKey="T" fill={OHM_BLUE} fillOpacity={0.85} isAnimationActive={false} shape="circle" r={3.5} name="Flüssigkeit" />
                    <Scatter data={vaporPoints} dataKey="T" fill={OHM_RED} fillOpacity={0.85} isAnimationActive={false} shape="circle" r={3.5} name="Dampf" />
                    {refAreaLeft !== null && refAreaRight !== null && (
                      <ReferenceArea x1={refAreaLeft} x2={refAreaRight} strokeOpacity={0.3} fill={OHM_BLUE} fillOpacity={0.12} />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 10, color: GRAY, padding: "2px 10px 6px" }}>
                Punkte = angefahrene Messpunkte (blau = Sumpf/Flüssigkeit, rot = Kondensat/Dampf). Ziehen = hineinzoomen, Mausrad = rein/raus.
              </div>
            </div>

            <div style={{ background: CHART_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)", padding: "10px 14px", maxHeight: 220, overflowY: "auto" }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 11.5, color: INK, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 6 }}>
                Messwerte
              </div>
              {collected.length === 0 ? (
                <div style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Noch keine Messpunkte aufgenommen.</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: MONO, fontSize: 11.5 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${PANEL_BORDER}` }}>
                      <th style={{ textAlign: "left", padding: "3px 6px", color: GRAY, fontWeight: 600 }}>#</th>
                      <th style={{ textAlign: "right", padding: "3px 6px", color: GRAY, fontWeight: 600 }}>ϑ / °C</th>
                      <th style={{ textAlign: "right", padding: "3px 6px", color: OHM_BLUE, fontWeight: 600 }}>x / %</th>
                      <th style={{ textAlign: "right", padding: "3px 6px", color: OHM_RED, fontWeight: 600 }}>y / %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collected.map((p, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${PANEL_BORDER}` }}>
                        <td style={{ padding: "3px 6px", color: GRAY }}>{i + 1}</td>
                        <td style={{ textAlign: "right", padding: "3px 6px", color: INK }}>{de(p.T, 2)}</td>
                        <td style={{ textAlign: "right", padding: "3px 6px", color: OHM_BLUE }}>{de(p.xTrue * 100, 1)}</td>
                        <td style={{ textAlign: "right", padding: "3px 6px", color: OHM_RED }}>{de(p.yTrue * 100, 1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${PANEL_BORDER}`, paddingTop: 10, display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Modell: Raoult'sches Gesetz (nahezu ideal), Antoine-Dampfdrücke, Siedepunkt per Bisektion bei einstellbarem Druck p</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Validiert (bei p_normal): Toluol 110,62 °C, Benzol 80,09 °C — stimmt mit Referenzwerten (110,6 °C / 80,1 °C) überein</span>
          <span style={{ fontFamily: SANS, fontSize: 11, color: GRAY }}>Analytik: unabhängig von der Bestimmungsmethode — es wird direkt die wahre Zusammensetzung x bzw. y aus dem Gleichgewicht verwendet</span>
        </div>
      </div>
    </div>
  );
}
