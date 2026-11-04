import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, CLAMP, EASE_IN_OUT } from "./theme";

// Fundo contínuo do anúncio: fica fora das cenas para que a luz, as partículas
// e o arco volumétrico atravessem os cortes sem "piscar".

type ArcState = { cy: number; d: number; o: number };

// Arco de luz por cena: vira um anel completo em volta do preço (cena 4).
const ARC_BY_SCENE: ArcState[] = [
  { cy: 1580, d: 1560, o: 1 },
  { cy: 1480, d: 1900, o: 0.9 },
  { cy: 2250, d: 2300, o: 0.75 },
  { cy: 960, d: 940, o: 1 },
  { cy: 2720, d: 2100, o: 1 },
];

const buildKeyframes = (starts: number[]) => {
  const input: number[] = [0];
  const states: ArcState[] = [ARC_BY_SCENE[0]];
  for (let i = 1; i < starts.length; i++) {
    input.push(starts[i] - 18, starts[i] + 18);
    states.push(ARC_BY_SCENE[i - 1], ARC_BY_SCENE[i]);
  }
  return { input, states };
};

const GlowArc: React.FC<{ starts: number[] }> = ({ starts }) => {
  const frame = useCurrentFrame();
  const { input, states } = buildKeyframes(starts);
  const opts = { ...CLAMP, easing: EASE_IN_OUT };
  const cy = interpolate(frame, input, states.map((s) => s.cy), opts);
  const d = interpolate(frame, input, states.map((s) => s.d), opts);
  const o = interpolate(frame, input, states.map((s) => s.o), opts);
  const breathe = 1 + Math.sin(frame / 22) * 0.008;

  return (
    <>
      {/* Névoa roxa volumétrica atrás do arco */}
      <div
        style={{
          position: "absolute",
          left: 540 - d * 0.85,
          top: cy - d * 0.85,
          width: d * 1.7,
          height: d * 1.7,
          borderRadius: "50%",
          background: `radial-gradient(closest-side, rgba(139,60,247,0.0) 52%, rgba(139,60,247,0.34) 60%, rgba(96,2,152,0.22) 72%, rgba(96,2,152,0) 100%)`,
          opacity: o,
          scale: breathe,
        }}
      />
      {/* Anel de luz */}
      <div
        style={{
          position: "absolute",
          left: 540 - d / 2,
          top: cy - d / 2,
          width: d,
          height: d,
          borderRadius: "50%",
          border: "4px solid rgba(246,240,255,0.95)",
          background: `radial-gradient(closest-side, ${C.black} 82%, rgba(60,10,110,0.55) 100%)`,
          boxShadow:
            "0 0 26px 6px rgba(226,206,255,0.85), 0 0 90px 24px rgba(166,107,255,0.7), 0 0 240px 70px rgba(96,2,152,0.55), inset 0 0 70px 16px rgba(166,107,255,0.6), inset 0 0 220px 60px rgba(96,2,152,0.35)",
          opacity: o,
          scale: breathe,
        }}
      />
    </>
  );
};

const VolumetricRays: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: -660,
        top: -1300,
        width: 2400,
        height: 2400,
        background:
          "repeating-conic-gradient(from 0deg at 50% 50%, rgba(166,107,255,0) 0deg, rgba(166,107,255,0.10) 2.5deg, rgba(166,107,255,0) 6deg, rgba(166,107,255,0) 11deg)",
        WebkitMaskImage:
          "radial-gradient(closest-side, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
        maskImage:
          "radial-gradient(closest-side, rgba(0,0,0,0.0) 25%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0) 100%)",
        rotate: `${Math.sin(frame / 90) * 4 + frame * 0.02}deg`,
        opacity: 0.8,
      }}
    />
  );
};

const GridFloor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: -960,
        right: -960,
        bottom: -260,
        height: 1100,
        transformOrigin: "50% 100%",
        transform: "perspective(900px) rotateX(74deg)",
        backgroundImage:
          "linear-gradient(rgba(166,107,255,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(166,107,255,0.55) 2px, transparent 2px)",
        backgroundSize: "120px 120px",
        backgroundPosition: `0px ${(frame * 2.4) % 120}px`,
        WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0) 85%)",
        maskImage: "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0) 85%)",
        opacity: 0.32,
      }}
    />
  );
};

const PARTICLE_COLORS = [C.lilac, C.violetBright, C.lilacSoft, C.violet, C.white];

const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const H = 2100;
  return (
    <>
      {new Array(76).fill(true).map((_, i) => {
        const z = random(`z-${i}`);
        const size = 2 + z * 7;
        const speed = 0.35 + z * 1.9;
        const x0 = random(`x-${i}`) * 1080;
        const y0 = random(`y-${i}`) * H;
        const y = (((y0 - frame * speed) % H) + H) % H - 90;
        const x = x0 + Math.sin(frame / 45 + i) * 26 * z;
        const twinkle = 0.55 + 0.45 * Math.sin(frame / (8 + z * 10) + i * 1.7);
        const color = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: (0.18 + z * 0.7) * twinkle,
              boxShadow: z > 0.6 ? `0 0 ${size * 3}px ${size}px rgba(166,107,255,0.6)` : undefined,
            }}
          />
        );
      })}
      {/* Bokeh: círculos grandes e suaves que criam profundidade */}
      {new Array(9).fill(true).map((_, i) => {
        const size = 140 + random(`bs-${i}`) * 260;
        const x = random(`bx-${i}`) * 1080 + Math.sin(frame / 70 + i) * 40;
        const y = ((random(`by-${i}`) * 2200 - frame * 0.5) % 2200 + 2200) % 2200 - 200;
        return (
          <div
            key={`b-${i}`}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "radial-gradient(closest-side, rgba(166,107,255,0.22), rgba(96,2,152,0))",
              opacity: 0.8,
            }}
          />
        );
      })}
    </>
  );
};

const LightStreaks: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(6).fill(true).map((_, i) => {
        const period = 150 + Math.floor(random(`lp-${i}`) * 140);
        const offset = Math.floor(random(`lo-${i}`) * period);
        const t = ((frame + offset) % period) / period;
        const y = 200 + random(`ly-${i}`) * 1500;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -300,
              top: y,
              width: 1100,
              height: 3,
              borderRadius: 3,
              background:
                "linear-gradient(90deg, rgba(201,164,255,0) 0%, rgba(240,230,255,0.95) 50%, rgba(201,164,255,0) 100%)",
              boxShadow: "0 0 18px 2px rgba(166,107,255,0.8)",
              rotate: "-32deg",
              translate: `${interpolate(t, [0, 1], [-1300, 1500])}px 0px`,
              opacity: interpolate(t, [0, 0.2, 0.8, 1], [0, 0.85, 0.85, 0], CLAMP),
            }}
          />
        );
      })}
    </>
  );
};

export const Background: React.FC<{ starts: number[] }> = ({ starts }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.black,
        background: `radial-gradient(ellipse 120% 70% at 50% 40%, #12062A 0%, ${C.black} 70%)`,
        overflow: "hidden",
      }}
    >
      <VolumetricRays />
      <GlowArc starts={starts} />
      <GridFloor />
      <Particles />
      <LightStreaks />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 65% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.78) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Granulação de filme bem sutil, por cima de tudo, para o acabamento "cinema".
const NOISE_SVG = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: NOISE_SVG,
        backgroundSize: "240px 240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 53) % 240}px`,
        opacity: 0.07,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};
