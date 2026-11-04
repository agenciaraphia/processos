import React from "react";
import { interpolate } from "remotion";
import { CLAMP } from "./theme";

// Dispositivo 3D genérico. Os mesmos parâmetros desenham um smartphone
// (estreito, cantos arredondados, "ilha" no topo) ou um notebook (largo, com base),
// o que permite o "morphing" do smartphone para o notebook na cena 2.
export type DeviceProps = {
  width: number;
  height: number;
  radius: number;
  bezel: number;
  /** 0 = sem base, 1 = base de notebook completa */
  base?: number;
  /** 0 = sem ilha, 1 = ilha de smartphone visível */
  notch?: number;
  /** Rotação 3D em graus */
  rx?: number;
  ry?: number;
  /** 0..1, passagem do reflexo de luz pela tela */
  shine?: number;
  glow?: number;
  children?: (screenW: number, screenH: number) => React.ReactNode;
  style?: React.CSSProperties;
};

export const Device: React.FC<DeviceProps> = ({
  width,
  height,
  radius,
  bezel,
  base = 0,
  notch = 0,
  rx = 0,
  ry = 0,
  shine = -1,
  glow = 1,
  children,
  style,
}) => {
  const screenW = width - bezel * 2;
  const screenH = height - bezel * 2;
  // Espessura simulada: desloca uma "lateral" na direção oposta à rotação.
  const dx = -Math.sin((ry * Math.PI) / 180) * 26;
  const dy = Math.sin((rx * Math.PI) / 180) * 22;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `perspective(2400px) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {/* Brilho roxo projetado */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.35,
          right: -width * 0.35,
          top: -height * 0.2,
          bottom: -height * 0.25,
          background: "radial-gradient(closest-side, rgba(139,60,247,0.55), rgba(96,2,152,0.18) 60%, rgba(96,2,152,0) 100%)",
          opacity: glow,
        }}
      />
      {/* Lateral / espessura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          translate: `${dx}px ${dy}px`,
          background: "linear-gradient(160deg, #2a1b3d, #0d0716 60%, #1f1430)",
          boxShadow: "0 0 0 1px rgba(201,164,255,0.18)",
        }}
      />
      {/* Corpo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          padding: bezel,
          background: "linear-gradient(145deg, #4a3763 0%, #160c24 28%, #09050f 62%, #33244a 100%)",
          boxShadow:
            "0 0 0 2px rgba(214,190,255,0.42), inset 0 0 0 1px rgba(255,255,255,0.10), 0 50px 90px rgba(0,0,0,0.65), 0 0 90px rgba(139,60,247,0.35)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: screenW,
            height: screenH,
            borderRadius: Math.max(6, radius - bezel * 0.75),
            overflow: "hidden",
            backgroundColor: "#07030D",
          }}
        >
          {children ? children(screenW, screenH) : null}
          {/* Reflexo fixo de vidro */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 26%, rgba(255,255,255,0) 42%)",
            }}
          />
          {/* Reflexo que passa pela tela */}
          <div
            style={{
              position: "absolute",
              top: -screenH * 0.5,
              bottom: -screenH * 0.5,
              width: screenW * 0.35,
              left: 0,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(240,230,255,0.22) 50%, rgba(255,255,255,0) 100%)",
              rotate: "18deg",
              translate: `${interpolate(shine, [0, 1], [-screenW * 0.6, screenW * 1.3], CLAMP)}px 0px`,
              opacity: shine < 0 || shine > 1 ? 0 : 1,
            }}
          />
        </div>
        {/* Ilha do smartphone */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: bezel + 16,
            width: 128,
            height: 36,
            marginLeft: -64,
            borderRadius: 20,
            backgroundColor: "#000",
            opacity: notch,
            scale: `${0.6 + notch * 0.4}`,
          }}
        />
        {/* Câmera do notebook */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: bezel / 2 - 3,
            width: 6,
            height: 6,
            marginLeft: -3,
            borderRadius: 3,
            backgroundColor: "#2b2238",
            opacity: base,
          }}
        />
      </div>
      {/* Base do notebook */}
      <div
        style={{
          position: "absolute",
          left: -width * 0.08,
          width: width * 1.16,
          top: height - 4,
          height: 30,
          borderRadius: "4px 4px 30px 30px",
          background: "linear-gradient(180deg, #5a4677 0%, #2a1c3d 35%, #110a1b 100%)",
          boxShadow: "0 0 0 1.5px rgba(214,190,255,0.35), 0 30px 60px rgba(0,0,0,0.6)",
          opacity: base,
          scale: `1 ${base}`,
          transformOrigin: "50% 0%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: 180,
            height: 9,
            marginLeft: -90,
            borderRadius: "0 0 10px 10px",
            background: "#1a1027",
          }}
        />
      </div>
    </div>
  );
};

// Predefinições usadas nas cenas.
export const PHONE = { width: 460, height: 940, radius: 66, bezel: 14 };
export const LAPTOP = { width: 900, height: 566, radius: 24, bezel: 18 };
