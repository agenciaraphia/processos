import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CheckIcon, GlobeIcon, LockIcon, SearchIcon, ServerIcon } from "../Icons";
import { SiteMockup } from "../SiteMockup";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT_BODY, FONT_DISPLAY, LILAC_GRADIENT_TEXT } from "../theme";
import { Bullet } from "../ui";

// CENA 03 — VALOR E BENEFÍCIOS (17s a 34s)
// Domínio, hospedagem e busca flutuando; endereço .com.br digitado; o site
// aparece entre os resultados de uma busca (indexação).

const PANEL: React.CSSProperties = {
  position: "absolute",
  left: 80,
  right: 80,
  borderRadius: 34,
  background: "linear-gradient(160deg, rgba(43,10,82,0.85), rgba(10,5,18,0.92))",
  border: "1.5px solid rgba(214,190,255,0.38)",
  boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 80px rgba(139,60,247,0.35), inset 0 1px 0 rgba(255,255,255,0.14)",
  overflow: "hidden",
};

// Entrada e saída "em profundidade" de cada fase do palco central.
const usePhase = (inStart: number, outStart: number) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [inStart, inStart + 24], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const b = interpolate(frame, [outStart, outStart + 20], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return {
    opacity: a * (1 - b),
    scale: `${(0.72 + a * 0.28) * (1 + b * 0.45)}`,
    filter: a < 1 || b > 0 ? `blur(${(1 - a) * 16 + b * 16}px)` : undefined,
  } as React.CSSProperties;
};

const FeatureCard: React.FC<{
  start: number;
  x: number;
  y: number;
  ry: number;
  seed: number;
  children: React.ReactNode;
}> = ({ start, x, y, ry, seed, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 26], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 410,
        padding: "34px 36px",
        borderRadius: 34,
        background: "linear-gradient(150deg, rgba(139,60,247,0.42), rgba(22,7,43,0.88) 70%)",
        border: "1.5px solid rgba(214,190,255,0.45)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(139,60,247,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        opacity: p,
        transform: `perspective(1600px) rotateY(${ry + (1 - p) * 50}deg) rotateX(${(1 - p) * 20}deg) translateZ(${(1 - p) * -600}px)`,
        translate: `0px ${Math.sin((frame + seed * 40) / 28) * 16}px`,
        filter: p < 1 ? `blur(${(1 - p) * 16}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

const PhaseCards: React.FC = () => {
  const frame = useCurrentFrame();
  const dash = -frame * 4;
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 820px", ...usePhase(28, 176) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop offset="0" stopColor={C.lilac} stopOpacity={0.1} />
            <stop offset="0.5" stopColor={C.lilacSoft} stopOpacity={0.9} />
            <stop offset="1" stopColor={C.lilac} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {[
          "M 300 690 Q 540 600 780 760",
          "M 780 760 Q 760 960 560 1010",
          "M 300 690 Q 320 930 560 1010",
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="url(#lg)"
            strokeWidth={3}
            strokeDasharray="14 18"
            strokeDashoffset={dash + i * 10}
            opacity={interpolate(frame, [70 + i * 8, 95 + i * 8], [0, 1], CLAMP)}
            style={{ filter: "drop-shadow(0 0 6px rgba(166,107,255,0.9))" }}
          />
        ))}
      </svg>
      <FeatureCard start={30} x={80} y={520} ry={14} seed={0}>
        <GlobeIcon size={70} color={C.lilac} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 62, marginTop: 14, ...LILAC_GRADIENT_TEXT }}>.com.br</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 32, color: C.lilacSoft, marginTop: 4 }}>Domínio</div>
      </FeatureCard>
      <FeatureCard start={50} x={590} y={600} ry={-14} seed={1}>
        <ServerIcon size={70} color={C.lilac} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: C.white, marginTop: 14 }}>Hospedagem</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  backgroundColor: C.lilac,
                  boxShadow: `0 0 12px ${C.violetBright}`,
                  opacity: 0.5 + 0.5 * Math.abs(Math.sin(frame / 9 + i)),
                }}
              />
              <div style={{ height: 10, borderRadius: 5, flex: 1, backgroundColor: "rgba(230,218,255,0.2)" }} />
            </div>
          ))}
        </div>
      </FeatureCard>
      <FeatureCard start={70} x={340} y={930} ry={0} seed={2}>
        <SearchIcon size={70} color={C.lilac} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: C.white, marginTop: 14 }}>Busca</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: C.lilacSoft, marginTop: 4 }}>Indexação</div>
      </FeatureCard>
    </div>
  );
};

const URL_TEXT = "www.suaempresa.com.br";

const PhaseAddress: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [206, 266], [0, URL_TEXT.length], CLAMP));
  const typed = URL_TEXT.slice(0, chars);
  const base = typed.slice(0, Math.min(typed.length, 14));
  const tld = typed.slice(14);
  const caretOn = Math.floor(frame / 8) % 2 === 0 || (frame > 206 && frame < 266);
  const enter = interpolate(frame, [272, 280, 296], [0, 1, 0.35], CLAMP);
  const load = interpolate(frame, [274, 300], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 820px", ...usePhase(186, 322) }}>
      <div style={{ ...PANEL, top: 540, height: 600 }}>
        <div style={{ height: 70, display: "flex", alignItems: "center", gap: 14, padding: "0 30px", borderBottom: "1px solid rgba(214,190,255,0.16)" }}>
          {[C.lilac, C.violetBright, C.purple].map((c) => (
            <div key={c} style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: c }} />
          ))}
        </div>
        <div style={{ padding: "26px 30px 0" }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 18,
              height: 96,
              padding: "0 30px",
              borderRadius: 48,
              background: "rgba(5,2,8,0.75)",
              border: `2px solid rgba(214,190,255,${0.35 + enter * 0.6})`,
              boxShadow: `0 0 ${20 + enter * 50}px rgba(166,107,255,${0.3 + enter * 0.5})`,
              fontFamily: FONT_BODY,
              fontWeight: 500,
              fontSize: 46,
              color: C.white,
              overflow: "hidden",
            }}
          >
            <LockIcon size={38} color={C.lilac} />
            <span>
              {base}
              <span style={{ color: C.lilac, fontWeight: 700, textShadow: `0 0 18px ${C.violetBright}` }}>{tld}</span>
              <span style={{ display: "inline-block", width: 4, height: 50, marginLeft: 4, verticalAlign: "middle", backgroundColor: C.lilacSoft, opacity: caretOn && frame < 272 ? 1 : 0 }} />
            </span>
            <div style={{ position: "absolute", left: 0, bottom: 0, height: 4, width: `${load * 100}%`, background: `linear-gradient(90deg, ${C.purple}, ${C.lilac})`, boxShadow: `0 0 12px ${C.violetBright}` }} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: 220,
            height: 350,
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(214,190,255,0.25)",
            clipPath: `inset(0 0 ${interpolate(frame, [292, 322], [100, 0], { ...CLAMP, easing: EASE_OUT })}% 0 round 22px)`,
          }}
        >
          <SiteMockup layout="desktop" screenW={860} screenH={350} t={frame} progress={1} />
        </div>
      </div>
    </div>
  );
};

const QUERY = "sua empresa";

const ResultSkeleton: React.FC<{ y: number; start: number }> = ({ y, start }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 18], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: y,
        height: 134,
        padding: "24px 28px",
        borderRadius: 22,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(214,190,255,0.12)",
        opacity: p * 0.75,
        translate: `0px ${(1 - p) * 30}px`,
      }}
    >
      <div style={{ width: 240, height: 14, borderRadius: 7, backgroundColor: "rgba(201,164,255,0.25)" }} />
      <div style={{ width: 560, height: 24, borderRadius: 12, marginTop: 16, backgroundColor: "rgba(230,218,255,0.25)" }} />
      <div style={{ width: 640, height: 12, borderRadius: 6, marginTop: 16, backgroundColor: "rgba(230,218,255,0.12)" }} />
    </div>
  );
};

const PhaseSearch: React.FC = () => {
  const frame = useCurrentFrame();
  const chars = Math.floor(interpolate(frame, [346, 370], [0, QUERY.length], CLAMP));
  const rise = interpolate(frame, [432, 468], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const ours = interpolate(frame, [392, 410], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const slot = (i: number) => 130 + i * 150;
  const badge = interpolate(frame, [470, 488], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "540px 820px", ...usePhase(330, 9999) }}>
      <div style={{ ...PANEL, top: 540, height: 610, scale: `${interpolate(frame, [430, 530], [1, 1.04], CLAMP)}` }}>
        <div style={{ padding: "26px 30px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              height: 86,
              padding: "0 30px",
              borderRadius: 43,
              background: "rgba(5,2,8,0.75)",
              border: "2px solid rgba(214,190,255,0.4)",
              fontFamily: FONT_BODY,
              fontSize: 42,
              color: C.white,
            }}
          >
            <SearchIcon size={40} color={C.lilac} />
            {QUERY.slice(0, chars)}
            <span style={{ width: 3, height: 44, backgroundColor: C.lilacSoft, opacity: Math.floor(frame / 8) % 2 === 0 && frame < 380 ? 1 : 0 }} />
          </div>
        </div>
        <ResultSkeleton y={interpolate(rise, [0, 1], [slot(0), slot(1)])} start={378} />
        <ResultSkeleton y={interpolate(rise, [0, 1], [slot(1), slot(2)])} start={386} />
        {/* Resultado do site, que sobe para o topo */}
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            top: interpolate(rise, [0, 1], [slot(2), slot(0)]),
            height: 134,
            padding: "20px 28px",
            borderRadius: 22,
            background: `linear-gradient(120deg, rgba(139,60,247,${0.15 + rise * 0.3}), rgba(22,7,43,0.9))`,
            border: `2px solid rgba(214,190,255,${0.3 + rise * 0.6})`,
            boxShadow: `0 0 ${rise * 60}px rgba(166,107,255,0.65)`,
            opacity: ours,
            translate: `0px ${(1 - ours) * 30}px`,
            scale: `${1 + rise * 0.03}`,
            zIndex: 2,
          }}
        >
          <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: C.lilac }}>suaempresa.com.br</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 38, color: C.white, marginTop: 6 }}>Sua Empresa | Site oficial</div>
          <div style={{ width: 520, height: 12, borderRadius: 6, marginTop: 12, backgroundColor: "rgba(230,218,255,0.2)" }} />
          <div
            style={{
              position: "absolute",
              right: 24,
              top: 22,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 30,
              fontFamily: FONT_BODY,
              fontWeight: 700,
              fontSize: 24,
              color: C.white,
              background: `linear-gradient(135deg, ${C.violetBright}, ${C.purple})`,
              boxShadow: "0 0 20px rgba(166,107,255,0.8)",
              opacity: badge,
              scale: `${0.6 + badge * 0.4}`,
            }}
          >
            <CheckIcon size={24} stroke={3} /> Indexado
          </div>
        </div>
      </div>
    </div>
  );
};

const TitlePunch: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [12, 34], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const flare = interpolate(frame, [18, 30, 60], [0, 1, 0], CLAMP);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 150, textAlign: "center" }}>
      <div
        style={{
          position: "absolute",
          left: -200,
          right: -200,
          top: 70,
          height: 6,
          borderRadius: 3,
          background: "linear-gradient(90deg, rgba(201,164,255,0), rgba(255,255,255,1), rgba(201,164,255,0))",
          boxShadow: "0 0 40px 10px rgba(166,107,255,0.8)",
          opacity: flare,
          scale: `${0.2 + flare * 0.8} 1`,
        }}
      />
      <div
        style={{
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 140,
          lineHeight: 1,
          letterSpacing: -3,
          color: C.white,
          textShadow: "0 0 40px rgba(139,60,247,0.9), 0 0 90px rgba(96,2,152,0.8)",
          opacity: p,
          scale: `${1.8 - p * 0.8}`,
          filter: p < 1 ? `blur(${(1 - p) * 20}px)` : undefined,
        }}
      >
        E TEM <span style={{ ...LILAC_GRADIENT_TEXT, textShadow: "none" }}>MAIS!</span>
      </div>
    </div>
  );
};

export const Scene3Extras: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <TitlePunch />
      <PhaseCards />
      <PhaseAddress />
      <PhaseSearch />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1236, display: "flex", flexDirection: "column", gap: 20 }}>
        <Bullet text="Domínio .com.br por 1 ano" start={58} active={interpolate(frame, [196, 214, 300, 318], [0, 1, 1, 0], CLAMP)} />
        <Bullet text="Hospedagem por 1 ano" start={82} active={interpolate(frame, [276, 292, 330, 346], [0, 1, 1, 0], CLAMP)} />
        <Bullet text="Configuração para indexação nos mecanismos de busca" start={106} active={interpolate(frame, [346, 364], [0, 1], CLAMP)} />
      </div>
    </AbsoluteFill>
  );
};
