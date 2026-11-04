import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fontes da identidade raphia.ag (Syne para títulos, DM Sans para textos),
// servidas localmente a partir de public/fonts para o render funcionar offline.
const FONTS: { family: string; file: string; weight: string }[] = [
  { family: "Syne", file: "Syne-400", weight: "400" },
  { family: "Syne", file: "Syne-600", weight: "600" },
  { family: "Syne", file: "Syne-700", weight: "700" },
  { family: "Syne", file: "Syne-800", weight: "800" },
  { family: "DM Sans", file: "DMSans-300", weight: "300" },
  { family: "DM Sans", file: "DMSans-400", weight: "400" },
  { family: "DM Sans", file: "DMSans-500", weight: "500" },
  { family: "DM Sans", file: "DMSans-700", weight: "700" },
];

export const fontsReady = Promise.all(
  FONTS.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(`fonts/${f.file}.woff2`),
      weight: f.weight,
    }),
  ),
);
