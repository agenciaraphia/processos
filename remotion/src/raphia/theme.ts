import { Easing } from "remotion";

// Paleta oficial da campanha: roxo, lilás, preto e branco.
export const C = {
  black: "#050208",
  ink: "#0A0512",
  deep: "#16072B",
  purple: "#600298",
  violet: "#8B3CF7",
  violetBright: "#A66BFF",
  lilac: "#C9A4FF",
  lilacSoft: "#E6DAFF",
  white: "#FFFFFF",
} as const;

export const FONT_DISPLAY = "Syne, sans-serif";
export const FONT_BODY = "'DM Sans', sans-serif";

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Duração das transições entre cenas, em frames.
export const TRANSITION_FRAMES = 20;

export const LILAC_GRADIENT_TEXT: React.CSSProperties = {
  backgroundImage: `linear-gradient(100deg, ${C.lilacSoft} 0%, ${C.lilac} 45%, ${C.violetBright} 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
