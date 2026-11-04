import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { Device, LAPTOP } from "../Device";
import { SiteMockup } from "../SiteMockup";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT_BODY, FONT_DISPLAY } from "../theme";
import { KineticTitle } from "../ui";

// CENA 04 — OFERTA (34s a 44s)
// A câmera mergulha na tela, os elementos se reorganizam e o preço surge em 3D.

const PRICE_CY = 960;

// Curva de aceleração da aproximação da câmera.
const Easing3 = (t: number) => t * t * t;

const ZoomIntoScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 54], [0, 1], { ...CLAMP, easing: Easing3 });
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - LAPTOP.width / 2,
        top: PRICE_CY - LAPTOP.height / 2,
        transformOrigin: `${LAPTOP.width / 2}px ${LAPTOP.height / 2}px`,
        scale: `${1 + z * 4.5}`,
        opacity: interpolate(frame, [34, 56], [1, 0], CLAMP),
        filter: z > 0.3 ? `blur(${(z - 0.3) * 18}px)` : undefined,
      }}
    >
      <Device {...LAPTOP} base={1} rx={interpolate(z, [0, 1], [8, 0])} ry={interpolate(z, [0, 1], [-10, 0])}>
        {(w, h) => <SiteMockup layout="desktop" screenW={w} screenH={h} t={frame} progress={1} scroll={120} />}
      </Device>
    </div>
  );
};

const Fragments: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(12).fill(true).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + random(`fa-${i}`) * 0.4;
        const dist = 420 + random(`fd-${i}`) * 420;
        const stays = i % 3 === 0;
        const p = interpolate(frame, [44, 92], [0, 1], { ...CLAMP, easing: EASE_OUT });
        const fade = stays ? interpolate(frame, [80, 110], [1, 0.45], CLAMP) : interpolate(frame, [70, 100], [1, 0], CLAMP);
        const w = 90 + random(`fw-${i}`) * 140;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - w / 2,
              top: PRICE_CY - 30,
              width: w,
              height: 60 + random(`fh-${i}`) * 50,
              borderRadius: 16,
              background: "linear-gradient(140deg, rgba(166,107,255,0.45), rgba(22,7,43,0.8))",
              border: "1.5px solid rgba(214,190,255,0.45)",
              boxShadow: "0 0 30px rgba(139,60,247,0.45)",
              opacity: interpolate(frame, [44, 50], [0, 1], CLAMP) * fade,
              translate: `${Math.cos(angle) * dist * p}px ${Math.sin(angle) * dist * p * 1.25 + Math.sin(frame / 20 + i) * 8}px`,
              rotate: `${(random(`fr-${i}`) - 0.5) * 80 * p}deg`,
              scale: `${0.4 + p * 0.6}`,
            }}
          >
            <div style={{ margin: 14, height: 8, width: "60%", borderRadius: 4, backgroundColor: "rgba(230,218,255,0.45)" }} />
          </div>
        );
      })}
    </>
  );
};

const Shockwaves: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const r = interpolate(frame, [74 + i * 10, 124 + i * 10], [0, 1], { ...CLAMP, easing: EASE_OUT });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 450,
              top: PRICE_CY - 450,
              width: 900,
              height: 900,
              borderRadius: "50%",
              border: "3px solid rgba(230,218,255,0.9)",
              boxShadow: "0 0 30px rgba(166,107,255,0.8), inset 0 0 30px rgba(166,107,255,0.6)",
              scale: `${0.2 + r * 1.1}`,
              opacity: r > 0 && r < 1 ? (1 - r) * 0.9 : 0,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 540 - 700,
          top: PRICE_CY - 700,
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(246,240,255,0.95), rgba(166,107,255,0.6) 30%, rgba(96,2,152,0.2) 60%, rgba(96,2,152,0) 100%)",
          opacity: interpolate(frame, [40, 52, 80, 120], [0, 1, 0.55, 0.28], CLAMP),
        }}
      />
    </>
  );
};

const OrbitComet: React.FC = () => {
  const frame = useCurrentFrame();
  const a = 470;
  const b = 120;
  const appear = interpolate(frame, [96, 120], [0, 1], CLAMP);
  return (
    <div style={{ position: "absolute", left: 540, top: PRICE_CY + 30, rotate: "-9deg", opacity: appear }}>
      <div
        style={{
          position: "absolute",
          left: -a,
          top: -b,
          width: a * 2,
          height: b * 2,
          borderRadius: "50%",
          border: "2px solid rgba(214,190,255,0.35)",
          boxShadow: "0 0 18px rgba(166,107,255,0.4)",
        }}
      />
      {[0, 1, 2, 3, 4, 5].map((k) => {
        const th = frame / 22 - k * 0.07;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: Math.cos(th) * a - 9,
              top: Math.sin(th) * b - 9,
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: C.lilacSoft,
              boxShadow: `0 0 24px 6px ${C.violetBright}`,
              opacity: (1 - k / 6) * (Math.sin(th) > -0.2 ? 1 : 0.35),
              scale: `${1 - k * 0.12}`,
            }}
          />
        );
      })}
    </div>
  );
};

// Tamanhos medidos para a Syne 700 caber no anel (~830px de largura total).
const PRICE_PARTS = [
  { text: "R$", size: 92, dy: -72 },
  { text: "399", size: 250, dy: 0 },
  { text: ",00", size: 110, dy: -64 },
];

const PriceLayer: React.FC<{ front: boolean; shine: number }> = ({ front, shine }) => {
  const depth = 18;
  const extrude = new Array(depth)
    .fill(true)
    .map((_, i) => {
      const k = i / depth;
      const r = Math.round(92 - k * 70);
      const g = Math.round(22 - k * 18);
      const b = Math.round(170 - k * 120);
      return `0px ${(i + 1) * 1.7}px 0 rgb(${r},${g},${b})`;
    })
    .join(", ");
  return (
    <div
      style={{
        position: front ? "absolute" : "relative",
        inset: front ? 0 : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: -4,
      }}
    >
      {PRICE_PARTS.map((part) => (
        <span
          key={part.text}
          style={{
            fontSize: part.size,
            translate: `0px ${part.dy}px`,
            ...(front
              ? {
                  backgroundImage: `linear-gradient(115deg, ${C.lilac} 0%, #FFFFFF 30%, ${C.lilacSoft} 42%, #FFFFFF 47%, ${C.lilac} 60%, ${C.violetBright} 100%)`,
                  backgroundSize: "300% 100%",
                  backgroundPosition: `${100 - shine * 100}% 0%`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }
              : {
                  color: "#5B169F",
                  textShadow: `${extrude}, 0px ${depth * 1.7 + 18}px 40px rgba(0,0,0,0.7), 0 0 90px rgba(139,60,247,0.9), 0 0 180px rgba(96,2,152,0.8)`,
                }),
          }}
        >
          {part.text}
        </span>
      ))}
    </div>
  );
};

const Price: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [72, 100], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const shine = interpolate(frame, [104, 150, 230, 276], [0, 1, 0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: PRICE_CY - 150,
        height: 300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: p,
        scale: `${interpolate(frame, [72, 94, 108], [0.25, 1.08, 1], { ...CLAMP, easing: EASE_OUT })}`,
        transform: `perspective(1400px) rotateX(${interpolate(frame, [72, 104], [65, 10], { ...CLAMP, easing: EASE_OUT })}deg) rotateY(${Math.sin(frame / 40) * 6}deg)`,
        filter: p < 1 ? `blur(${(1 - p) * 24}px)` : undefined,
        translate: `0px ${Math.sin(frame / 30) * 8}px`,
      }}
    >
      <div style={{ position: "relative" }}>
        <PriceLayer front={false} shine={shine} />
        <PriceLayer front shine={shine} />
      </div>
    </div>
  );
};

const Chip: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div
      style={{
        padding: "14px 26px",
        borderRadius: 40,
        fontFamily: FONT_BODY,
        fontWeight: 500,
        fontSize: 34,
        color: C.white,
        background: "rgba(139,60,247,0.22)",
        border: "1.5px solid rgba(214,190,255,0.45)",
        opacity: p,
        translate: `0px ${(1 - p) * 30}px`,
      }}
    >
      {text}
    </div>
  );
};

export const Scene4Offer: React.FC = () => {
  return (
    <AbsoluteFill>
      <ZoomIntoScreen />
      <Shockwaves />
      <Fragments />
      <OrbitComet />
      <KineticTitle
        text="SEU SITE PROFISSIONAL"
        start={56}
        size={86}
        highlight={["PROFISSIONAL"]}
        style={{ position: "absolute", left: 80, right: 80, top: 210 }}
      />
      <Price />
      <KineticTitle
        text="Tudo isso em uma única oferta!"
        start={124}
        size={58}
        stagger={2}
        highlight={["única", "oferta!"]}
        style={{ position: "absolute", left: 80, right: 80, top: 1500, fontFamily: FONT_BODY, fontWeight: 500, letterSpacing: 0 }}
      />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1610, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
        <Chip text="Site até 3 páginas" start={160} />
        <Chip text="Domínio .com.br" start={170} />
        <Chip text="Hospedagem 1 ano" start={180} />
      </div>
    </AbsoluteFill>
  );
};
