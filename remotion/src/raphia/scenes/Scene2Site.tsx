import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Device, LAPTOP, PHONE } from "../Device";
import { SparkIcon } from "../Icons";
import { SiteMockup } from "../SiteMockup";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT_BODY, FONT_DISPLAY } from "../theme";
import { Bullet, GlassChip, KineticTitle } from "../ui";
import { PHONE_TOP } from "./Scene1Hook";

// CENA 02 — DESENVOLVIMENTO (6s a 17s)
// O smartphone se transforma em notebook; o site desktop é montado em sequência.

const LAPTOP_TOP = 500;

const FloatCard: React.FC<{
  start: number;
  from: [number, number];
  seed: number;
  children: React.ReactNode;
  style: React.CSSProperties;
}> = ({ start, from, seed, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 24], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <GlassChip
      style={{
        ...style,
        opacity: p,
        scale: `${0.5 + p * 0.5}`,
        rotate: `${(1 - p) * (seed % 2 === 0 ? -14 : 14)}deg`,
        translate: `${(1 - p) * from[0]}px ${(1 - p) * from[1] + Math.sin((frame + seed * 31) / 26) * 14}px`,
        filter: p < 1 ? `blur(${(1 - p) * 14}px)` : undefined,
      }}
    >
      {children}
    </GlassChip>
  );
};

export const Scene2Site: React.FC = () => {
  const frame = useCurrentFrame();
  const m = interpolate(frame, [18, 74], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const width = interpolate(m, [0, 1], [PHONE.width, LAPTOP.width]);
  const height = interpolate(m, [0, 1], [PHONE.height, LAPTOP.height]);

  return (
    <AbsoluteFill>
      <KineticTitle
        text="UM SITE COM A CARA DA SUA MARCA!"
        start={16}
        size={86}
        highlight={["CARA", "MARCA!"]}
        style={{ position: "absolute", left: 80, right: 80, top: 150 }}
      />

      <div
        style={{
          position: "absolute",
          left: 540 - width / 2,
          top: interpolate(m, [0, 1], [PHONE_TOP, LAPTOP_TOP]),
          scale: `${interpolate(frame, [74, 350], [1, 1.04], CLAMP)}`,
        }}
      >
        <Device
          width={width}
          height={height}
          radius={interpolate(m, [0, 1], [PHONE.radius, LAPTOP.radius])}
          bezel={interpolate(m, [0, 1], [PHONE.bezel, LAPTOP.bezel])}
          notch={interpolate(m, [0, 0.4], [1, 0], CLAMP)}
          base={interpolate(frame, [58, 86], [0, 1], { ...CLAMP, easing: EASE_OUT })}
          rx={interpolate(frame, [0, 46, 74, 350], [6, 16, 10, 5], { ...CLAMP, easing: EASE_IN_OUT })}
          ry={interpolate(frame, [0, 46, 74, 350], [-6, -26, -12, 8], { ...CLAMP, easing: EASE_IN_OUT })}
          shine={interpolate(frame, [230, 280], [0, 1], CLAMP)}
        >
          {(w, h) => (
            <>
              <div style={{ position: "absolute", inset: 0, opacity: interpolate(m, [0, 0.35], [1, 0], CLAMP) }}>
                <SiteMockup layout="mobile" screenW={w} screenH={h} t={frame} progress={1} />
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: interpolate(m, [0.55, 0.95], [0, 1], CLAMP),
                }}
              >
                <SiteMockup
                  layout="desktop"
                  screenW={w}
                  screenH={h}
                  t={frame}
                  progress={interpolate(frame, [46, 222], [0, 1], CLAMP)}
                  scroll={interpolate(frame, [250, 345], [0, 230], { ...CLAMP, easing: EASE_IN_OUT })}
                />
              </div>
            </>
          )}
        </Device>
      </div>

      {/* Identidade visual "entrando" no site */}
      <FloatCard start={150} from={[-260, 60]} seed={0} style={{ left: 40, top: 990, flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
        <div style={{ fontSize: 24, color: C.lilacSoft, fontFamily: FONT_BODY }}>Identidade visual</div>
        <div style={{ display: "flex", gap: 10 }}>
          {[C.purple, C.violet, C.lilac, C.white, "#000"].map((c) => (
            <div key={c} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c, border: "1.5px solid rgba(214,190,255,0.5)" }} />
          ))}
        </div>
      </FloatCard>
      <FloatCard start={172} from={[260, 40]} seed={1} style={{ right: 36, top: 880, gap: 16 }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 54, lineHeight: 1 }}>Aa</span>
        <span style={{ fontSize: 24, color: C.lilacSoft, lineHeight: 1.2 }}>
          Tipografia
          <br />
          da marca
        </span>
      </FloatCard>
      <FloatCard start={196} from={[-200, -60]} seed={2} style={{ left: 36, top: 470 }}>
        <SparkIcon size={34} color={C.lilac} /> Animações
      </FloatCard>

      <div style={{ position: "absolute", left: 80, right: 80, top: 1170, display: "flex", flexDirection: "column", gap: 20 }}>
        <Bullet text="Design personalizado" start={92} />
        <Bullet text="Até 3 páginas" start={122} />
        <Bullet text="Animações modernas" start={152} />
        <Bullet text="Adaptado à identidade visual da sua empresa" start={182} />
      </div>
    </AbsoluteFill>
  );
};
