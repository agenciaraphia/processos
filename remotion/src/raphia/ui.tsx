import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_OUT, FONT_BODY, FONT_DISPLAY, LILAC_GRADIENT_TEXT } from "./theme";
import { CheckIcon, WhatsAppIcon } from "./Icons";

// Tipografia cinética: cada palavra entra com profundidade (subida + desfoque).
export const KineticTitle: React.FC<{
  text: string;
  start: number;
  size: number;
  highlight?: string[];
  stagger?: number;
  exitAt?: number;
  style?: React.CSSProperties;
}> = ({ text, start, size, highlight = [], stagger = 3, exitAt, style }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 14], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: -size * 0.02,
        color: C.white,
        textAlign: "center",
        opacity: 1 - exit,
        translate: `0px ${-exit * 60}px`,
        filter: exit > 0 ? `blur(${exit * 12}px)` : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = interpolate(frame, [start + i * stagger, start + i * stagger + 20], [0, 1], {
          ...CLAMP,
          easing: EASE_OUT,
        });
        const hl = highlight.indexOf(w) !== -1;
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              marginRight: i === words.length - 1 ? 0 : "0.24em",
              opacity: p,
              translate: `0px ${(1 - p) * size * 0.8}px`,
              rotate: `x ${(1 - p) * 70}deg`,
              filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
              textShadow: hl ? undefined : "0 0 34px rgba(139,60,247,0.65)",
              ...(hl ? LILAC_GRADIENT_TEXT : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

// Card de benefício com check, vidro fosco e brilho de entrada.
export const Bullet: React.FC<{
  text: string;
  start: number;
  active?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, start, active = 0, size = 44, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 22], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const sweep = interpolate(frame, [start + 6, start + 34], [-0.4, 1.4], CLAMP);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "24px 34px",
        borderRadius: 30,
        overflow: "hidden",
        background: `linear-gradient(120deg, rgba(139,60,247,${0.2 + active * 0.25}), rgba(255,255,255,0.035) 70%)`,
        border: `1.5px solid rgba(214,190,255,${0.26 + active * 0.5})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), 0 0 ${20 + active * 50}px rgba(139,60,247,${0.15 + active * 0.4})`,
        opacity: p,
        translate: `${(1 - p) * 160}px 0px`,
        scale: `${1 + active * 0.03}`,
        filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "40%",
          left: `${sweep * 100}%`,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(230,218,255,0.22), rgba(255,255,255,0))",
        }}
      />
      <div
        style={{
          flexShrink: 0,
          width: size * 1.45,
          height: size * 1.45,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(140deg, ${C.violetBright}, ${C.purple})`,
          boxShadow: "0 0 24px rgba(166,107,255,0.75), inset 0 1px 0 rgba(255,255,255,0.4)",
        }}
      >
        <CheckIcon size={size * 0.8} stroke={3} />
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: size, lineHeight: 1.15, color: C.white }}>{text}</div>
    </div>
  );
};

// Chip de vidro flutuante (interfaces que "saltam" das telas).
export const GlassChip: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "18px 24px",
      borderRadius: 24,
      fontFamily: FONT_BODY,
      fontWeight: 500,
      fontSize: 30,
      color: C.white,
      background: "linear-gradient(140deg, rgba(139,60,247,0.38), rgba(22,7,43,0.75))",
      border: "1.5px solid rgba(214,190,255,0.4)",
      boxShadow: "0 24px 50px rgba(0,0,0,0.5), 0 0 40px rgba(139,60,247,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
      ...style,
    }}
  >
    {children}
  </div>
);

// Botão de WhatsApp animado (pulso + ondas), nas cores da marca.
export const WhatsAppButton: React.FC<{ start: number; label: string; tapAt?: number }> = ({ start, label, tapAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 24], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const local = Math.max(0, frame - start - 24);
  const pulse = 1 + Math.sin(local / 7) * 0.025;
  const tap = tapAt === undefined ? 0 : interpolate(frame, [tapAt, tapAt + 5, tapAt + 12], [0, 1, 0], CLAMP);
  return (
    <div
      style={{
        position: "relative",
        opacity: p,
        scale: `${(0.6 + p * 0.4) * pulse * (1 - tap * 0.06)}`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
      }}
    >
      {[0, 1, 2].map((i) => {
        const r = ((local + i * 22) % 66) / 66;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 80,
              border: `3px solid rgba(214,190,255,${(1 - r) * 0.7})`,
              scale: `${1 + r * 0.32} ${1 + r * 0.9}`,
              opacity: local > 0 ? 1 : 0,
            }}
          />
        );
      })}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "30px 56px 30px 40px",
          borderRadius: 80,
          fontFamily: FONT_BODY,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: 0.5,
          color: C.white,
          overflow: "hidden",
          background: `linear-gradient(135deg, ${C.violetBright} 0%, ${C.violet} 40%, ${C.purple} 100%)`,
          border: "2px solid rgba(240,230,255,0.75)",
          boxShadow: `0 0 ${40 + tap * 60}px rgba(166,107,255,0.85), 0 20px 50px rgba(0,0,0,0.55), inset 0 2px 0 rgba(255,255,255,0.35)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "30%",
            left: `${(((local % 75) / 75) * 1.8 - 0.4) * 100}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))",
            rotate: "15deg",
          }}
        />
        <WhatsAppIcon size={66} stroke={2.1} />
        <span style={{ position: "relative" }}>{label}</span>
      </div>
    </div>
  );
};
