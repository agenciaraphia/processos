import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Device } from "../Device";
import { PointerIcon } from "../Icons";
import { SiteMockup } from "../SiteMockup";
import { C, CLAMP, EASE_IN_OUT, EASE_OUT, FONT_BODY, FONT_DISPLAY, LILAC_GRADIENT_TEXT } from "../theme";
import { KineticTitle, WhatsAppButton } from "../ui";

// CENA 05 — CTA (44s a 55s)
// Smartphone e notebook lado a lado com o site pronto; fecha com logo,
// oferta e botão animado de WhatsApp.

const END_CARD = 204;

const useExit = () => {
  const frame = useCurrentFrame();
  const e = interpolate(frame, [END_CARD - 6, END_CARD + 18], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  return {
    opacity: 1 - e,
    translate: `0px ${-e * 120}px`,
    filter: e > 0 ? `blur(${e * 16}px)` : undefined,
  } as React.CSSProperties;
};

const Devices: React.FC = () => {
  const frame = useCurrentFrame();
  const l = interpolate(frame, [12, 52], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const r = interpolate(frame, [24, 64], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", inset: 0, ...useExit() }}>
      <div
        style={{
          position: "absolute",
          left: 50,
          top: 620,
          opacity: l,
          translate: `${(1 - l) * -700 + Math.sin(frame / 34) * 8}px ${Math.cos(frame / 40) * 6}px`,
        }}
      >
        <Device width={820} height={516} radius={22} bezel={16} base={1} rx={8} ry={interpolate(l, [0, 1], [40, 14])} shine={interpolate(frame, [70, 110], [0, 1], CLAMP)}>
          {(w, h) => (
            <SiteMockup layout="desktop" screenW={w} screenH={h} t={frame} progress={1} scroll={interpolate(frame, [70, 200], [0, 200], { ...CLAMP, easing: EASE_IN_OUT })} />
          )}
        </Device>
      </div>
      <div
        style={{
          position: "absolute",
          left: 735,
          top: 790,
          opacity: r,
          translate: `${(1 - r) * 600 + Math.sin(frame / 30 + 1) * 8}px ${Math.cos(frame / 36 + 1) * 10}px`,
        }}
      >
        <Device width={290} height={594} radius={44} bezel={10} notch={1} rx={6} ry={interpolate(r, [0, 1], [-40, -16])} shine={interpolate(frame, [86, 120], [0, 1], CLAMP)}>
          {(w, h) => (
            <SiteMockup layout="mobile" screenW={w} screenH={h} t={frame} progress={1} scroll={interpolate(frame, [90, 200], [0, 180], { ...CLAMP, easing: EASE_IN_OUT })} />
          )}
        </Device>
      </div>
    </div>
  );
};

const Headline: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, ...useExit() }}>
    <KineticTitle
      text="CHEGOU A HORA DE COLOCAR SUA EMPRESA NA INTERNET!"
      start={14}
      size={78}
      stagger={2}
      highlight={["INTERNET!"]}
      style={{ position: "absolute", left: 80, right: 80, top: 140 }}
    />
  </div>
);

// Texto "FALE CONOSCO..." e botão: descem para a tela final em vez de sumir.
const CallToAction: React.FC<{ whatsapp: string }> = ({ whatsapp }) => {
  const frame = useCurrentFrame();
  const move = interpolate(frame, [END_CARD, END_CARD + 30], [0, 1], { ...CLAMP, easing: EASE_IN_OUT });
  const tapAt = END_CARD + 84;
  const numberIn = interpolate(frame, [END_CARD + 44, END_CARD + 64], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <>
      <KineticTitle
        text="FALE CONOSCO E SOLICITE SEU SITE."
        start={70}
        size={60}
        stagger={2}
        highlight={["SOLICITE", "SEU", "SITE."]}
        style={{ position: "absolute", left: 80, right: 80, top: interpolate(move, [0, 1], [1410, 1070]) }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: interpolate(move, [0, 1], [1580, 1260]),
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WhatsAppButton start={96} label="CHAMAR NO WHATSAPP" tapAt={tapAt} />
      </div>
      {whatsapp ? (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            top: 1450,
            textAlign: "center",
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 58,
            color: C.white,
            textShadow: "0 0 30px rgba(139,60,247,0.8)",
            opacity: numberIn,
            translate: `0px ${(1 - numberIn) * 30}px`,
          }}
        >
          {whatsapp}
        </div>
      ) : null}
      <PointerIcon
        size={78}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          translate: `${interpolate(frame, [tapAt - 30, tapAt], [900, 650], { ...CLAMP, easing: EASE_OUT })}px ${interpolate(frame, [tapAt - 30, tapAt], [1700, 1330], { ...CLAMP, easing: EASE_OUT })}px`,
          scale: `${1 - interpolate(frame, [tapAt, tapAt + 5, tapAt + 12], [0, 1, 0], CLAMP) * 0.2}`,
          opacity: interpolate(frame, [tapAt - 30, tapAt - 20, tapAt + 30, tapAt + 40], [0, 1, 1, 0], CLAMP),
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6)) drop-shadow(0 0 10px rgba(166,107,255,0.7))",
        }}
      />
    </>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = interpolate(frame, [END_CARD + 10, END_CARD + 40], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const sweep = interpolate(frame, [END_CARD + 30, END_CARD + 70], [-0.3, 1.3], CLAMP);
  const offer = interpolate(frame, [END_CARD + 28, END_CARD + 50], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 600,
          opacity: logo,
          scale: `${0.85 + logo * 0.15}`,
          filter: logo < 1 ? `blur(${(1 - logo) * 18}px)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -120,
            right: -120,
            top: -120,
            bottom: -120,
            background: "radial-gradient(closest-side, rgba(139,60,247,0.55), rgba(96,2,152,0) 100%)",
          }}
        />
        <div style={{ position: "relative" }}>
          <Img
            src={staticFile("brand/raphia-logo.png")}
            style={{ width: "100%", display: "block", filter: "drop-shadow(0 0 22px rgba(166,107,255,0.9))" }}
          />
          {/* Brilho lilás percorrendo apenas as letras da logo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitMaskImage: `url(${staticFile("brand/raphia-logo.png")})`,
              maskImage: `url(${staticFile("brand/raphia-logo.png")})`,
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: "30%",
                left: `${sweep * 100}%`,
                background: `linear-gradient(90deg, rgba(166,107,255,0), ${C.violetBright}, ${C.lilac}, rgba(166,107,255,0))`,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 900,
          textAlign: "center",
          fontFamily: FONT_BODY,
          fontWeight: 500,
          fontSize: 50,
          color: C.white,
          opacity: offer,
          translate: `0px ${(1 - offer) * 30}px`,
        }}
      >
        Site profissional por{" "}
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, ...LILAC_GRADIENT_TEXT }}>R$ 399,00</span>
      </div>
    </>
  );
};

export const Scene5CTA: React.FC<{ whatsapp: string }> = ({ whatsapp }) => {
  return (
    <AbsoluteFill>
      <Devices />
      <Headline />
      <EndCard />
      <CallToAction whatsapp={whatsapp} />
    </AbsoluteFill>
  );
};
