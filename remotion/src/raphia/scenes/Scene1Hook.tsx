import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Device, PHONE } from "../Device";
import { ImageIcon, LayoutIcon, MenuIcon, PointerIcon } from "../Icons";
import { SiteMockup } from "../SiteMockup";
import { C, CLAMP, EASE_OUT } from "../theme";
import { GlassChip, KineticTitle } from "../ui";

// CENA 01 — GANCHO (0s a 6s)
// Smartphone surge no centro e um site começa a ser construído dentro dele.

const PHONE_LEFT = 540 - PHONE.width / 2;
export const PHONE_TOP = 700;

const PopChip: React.FC<{
  start: number;
  from: [number, number];
  children: React.ReactNode;
  style: React.CSSProperties;
  float: number;
}> = ({ start, from, children, style, float }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, start + 22], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <GlassChip
      style={{
        ...style,
        opacity: p,
        scale: `${0.4 + p * 0.6}`,
        translate: `${(1 - p) * from[0]}px ${(1 - p) * from[1] + Math.sin((frame + float * 40) / 24) * 12}px`,
        filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
      }}
    >
      {children}
    </GlassChip>
  );
};

const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  const click = interpolate(frame, [150, 156, 170], [0, 1, 0], CLAMP);
  const ring = interpolate(frame, [150, 175], [0, 1], CLAMP);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 548,
          top: 1318,
          width: 80,
          height: 80,
          marginLeft: -40,
          marginTop: -40,
          borderRadius: "50%",
          border: "3px solid rgba(230,218,255,0.9)",
          scale: `${0.3 + ring * 1.6}`,
          opacity: ring > 0 && ring < 1 ? 1 - ring : 0,
        }}
      />
      <PointerIcon
        size={70}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          translate: `${interpolate(frame, [118, 148], [880, 548], { ...CLAMP, easing: EASE_OUT })}px ${interpolate(frame, [118, 148], [1640, 1318], { ...CLAMP, easing: EASE_OUT })}px`,
          scale: `${1 - click * 0.18}`,
          opacity: interpolate(frame, [118, 128, 178, 188], [0, 1, 1, 0], CLAMP),
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6)) drop-shadow(0 0 10px rgba(166,107,255,0.7))",
        }}
      />
    </>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <KineticTitle
        text="SUA EMPRESA AINDA NÃO TEM UM SITE PROFISSIONAL?"
        start={14}
        size={86}
        stagger={3}
        highlight={["SITE", "PROFISSIONAL?"]}
        style={{ position: "absolute", left: 80, right: 80, top: 170 }}
      />

      <div
        style={{
          position: "absolute",
          left: PHONE_LEFT,
          top: PHONE_TOP,
          opacity: interpolate(frame, [0, 18], [0, 1], CLAMP),
          translate: `0px ${interpolate(frame, [0, 42], [760, 0], { ...CLAMP, easing: EASE_OUT })}px`,
          scale: `${interpolate(frame, [0, 42], [0.82, 1], { ...CLAMP, easing: EASE_OUT })}`,
        }}
      >
        <Device
          {...PHONE}
          notch={1}
          rx={interpolate(frame, [0, 42], [42, 6], { ...CLAMP, easing: EASE_OUT })}
          ry={interpolate(frame, [0, 190], [-20, -6], { ...CLAMP, easing: EASE_OUT })}
          shine={interpolate(frame, [40, 85], [0, 1], CLAMP)}
        >
          {(w, h) => (
            <SiteMockup
              layout="mobile"
              screenW={w}
              screenH={h}
              t={frame}
              progress={interpolate(frame, [32, 150], [0, 1], CLAMP)}
            />
          )}
        </Device>
      </div>

      <PopChip start={58} from={[-260, 80]} float={0} style={{ right: 66, top: 800 }}>
        <LayoutIcon size={34} color={C.lilac} /> Layout
      </PopChip>
      <PopChip start={72} from={[300, 40]} float={1} style={{ left: 64, top: 930 }}>
        <MenuIcon size={34} color={C.lilac} /> Menu
      </PopChip>
      <PopChip start={88} from={[-280, -40]} float={2} style={{ right: 60, top: 1120 }}>
        <ImageIcon size={34} color={C.lilac} /> Imagens
      </PopChip>
      <PopChip start={104} from={[300, -60]} float={3} style={{ left: 70, top: 1400 }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.lilac, boxShadow: `0 0 12px ${C.violetBright}` }} />
        Contato
      </PopChip>

      <Cursor />
    </AbsoluteFill>
  );
};
