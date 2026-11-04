import React from "react";
import { interpolate } from "remotion";
import { C, CLAMP, EASE_OUT, FONT_BODY, FONT_DISPLAY } from "./theme";
import { GlobeIcon, ImageIcon, LayoutIcon, MenuIcon, SparkIcon } from "./Icons";

// Site institucional fictício ("suaempresa") exibido dentro das telas.
// É desenhado numa tela virtual (390px no celular, 1280px no desktop) e escalado
// para caber no dispositivo, o que deixa as proporções realistas.

type Props = {
  layout: "mobile" | "desktop";
  screenW: number;
  screenH: number;
  /** 0..1: quanto do site já foi "construído" */
  progress: number;
  /** frame atual, para as animações contínuas (orbe, menu) */
  t: number;
  /** rolagem da página em px virtuais */
  scroll?: number;
};

const reveal = (progress: number, at: number, dist = 22): React.CSSProperties => {
  const a = interpolate(progress, [at, at + 0.12], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return {
    opacity: a,
    translate: `0px ${(1 - a) * dist}px`,
    filter: a < 1 ? `blur(${(1 - a) * 6}px)` : undefined,
  };
};

const Orb: React.FC<{ size: number; t: number }> = ({ size, t }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `radial-gradient(circle at 34% 28%, #F6EEFF 0%, ${C.lilac} 14%, ${C.violet} 38%, #3D0E73 66%, #12051F 100%)`,
        boxShadow: `0 0 ${size * 0.35}px rgba(139,60,247,0.65)`,
        translate: `0px ${Math.sin(t / 25) * size * 0.03}px`,
      }}
    />
    {[0, 1].map((i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: -size * (0.28 + i * 0.12),
          right: -size * (0.28 + i * 0.12),
          top: size * 0.38,
          height: size * 0.24,
          borderRadius: "50%",
          border: `${Math.max(1.5, size * 0.012)}px solid rgba(214,190,255,${0.75 - i * 0.3})`,
          rotate: `${-14 + i * 22 + Math.sin(t / 40 + i) * 4}deg`,
          boxShadow: "0 0 12px rgba(166,107,255,0.6)",
        }}
      />
    ))}
  </div>
);

const Bar: React.FC<{ w: number | string; h: number; o?: number; style?: React.CSSProperties }> = ({
  w,
  h,
  o = 0.22,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: h,
      backgroundColor: `rgba(230,218,255,${o})`,
      ...style,
    }}
  />
);

const BrandMark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.4 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(from 200deg, ${C.lilacSoft}, ${C.violet}, ${C.purple}, ${C.lilac}, ${C.lilacSoft})`,
        boxShadow: "0 0 10px rgba(166,107,255,0.7)",
      }}
    />
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: size * 0.82, color: C.white, letterSpacing: -0.3 }}>
      suaempresa
    </div>
  </div>
);

const MENU = ["Início", "Sobre", "Serviços", "Contato"];

const DesktopSite: React.FC<Omit<Props, "layout" | "screenW" | "screenH">> = ({ progress, t, scroll = 0 }) => {
  // Indicador do menu que passeia entre os itens (menu animado).
  const active = interpolate(t % 240, [0, 60, 80, 140, 160, 220, 240], [0, 0, 1, 1, 2, 2, 0], CLAMP);
  return (
    <div style={{ width: 1280, fontFamily: FONT_BODY, color: C.white, translate: `0px ${-scroll}px` }}>
      {/* Navegação */}
      <div
        style={{
          height: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 56px",
          borderBottom: "1px solid rgba(201,164,255,0.14)",
          ...reveal(progress, 0.0, -20),
        }}
      >
        <BrandMark size={30} />
        <div style={{ position: "relative", display: "flex", gap: 44, fontSize: 18 }}>
          {MENU.map((m, i) => (
            <div key={m} style={{ width: 86, textAlign: "center", opacity: i === Math.round(active) ? 1 : 0.62, ...reveal(progress, 0.04 + i * 0.03, -12) }}>
              {m}
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              left: 21 + active * 130,
              bottom: -14,
              width: 44,
              height: 3,
              borderRadius: 2,
              backgroundColor: C.lilac,
              boxShadow: `0 0 10px ${C.violetBright}`,
              opacity: interpolate(progress, [0.15, 0.25], [0, 1], CLAMP),
            }}
          />
        </div>
        <div
          style={{
            padding: "12px 26px",
            borderRadius: 40,
            fontSize: 17,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${C.violet}, ${C.purple})`,
            boxShadow: "0 0 18px rgba(139,60,247,0.55)",
            ...reveal(progress, 0.18, -12),
          }}
        >
          Fale conosco
        </div>
      </div>
      {/* Hero */}
      <div style={{ display: "flex", padding: "64px 56px 40px", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: 30,
              fontSize: 15,
              color: C.lilacSoft,
              border: "1px solid rgba(201,164,255,0.35)",
              background: "rgba(139,60,247,0.14)",
              ...reveal(progress, 0.22),
            }}
          >
            <SparkIcon size={16} color={C.lilac} /> Presença digital profissional
          </div>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 1.04,
              marginTop: 22,
              letterSpacing: -1.5,
              ...reveal(progress, 0.3),
            }}
          >
            Sua marca em{" "}
            <span
              style={{
                backgroundImage: `linear-gradient(100deg, ${C.lilacSoft}, ${C.violetBright})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              outro nível.
            </span>
          </div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10, ...reveal(progress, 0.4) }}>
            <Bar w="92%" h={12} />
            <Bar w="78%" h={12} />
            <Bar w="60%" h={12} />
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 30, ...reveal(progress, 0.48) }}>
            <div
              style={{
                padding: "15px 30px",
                borderRadius: 40,
                fontSize: 17,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${C.violetBright}, ${C.purple})`,
                boxShadow: "0 0 24px rgba(139,60,247,0.6)",
              }}
            >
              Solicitar orçamento
            </div>
            <div style={{ padding: "15px 30px", borderRadius: 40, fontSize: 17, border: "1.5px solid rgba(230,218,255,0.55)" }}>
              Ver serviços
            </div>
          </div>
        </div>
        <div
          style={{
            width: 520,
            height: 380,
            borderRadius: 28,
            position: "relative",
            overflow: "hidden",
            background: "radial-gradient(circle at 60% 40%, #2B0A52 0%, #12051F 70%)",
            border: "1px solid rgba(201,164,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: `inset(0 ${interpolate(progress, [0.26, 0.46], [100, 0], { ...CLAMP, easing: EASE_OUT })}% 0 0 round 28px)`,
          }}
        >
          <Orb size={190} t={t} />
        </div>
      </div>
      {/* Cards de serviços */}
      <div style={{ display: "flex", gap: 22, padding: "10px 56px 40px" }}>
        {[
          { icon: <LayoutIcon size={26} color={C.lilac} />, title: "Serviços" },
          { icon: <ImageIcon size={26} color={C.lilac} />, title: "Portfólio" },
          { icon: <GlobeIcon size={26} color={C.lilac} />, title: "Contato" },
        ].map((card, i) => (
          <div
            key={card.title}
            style={{
              flex: 1,
              padding: 26,
              borderRadius: 22,
              background: "linear-gradient(150deg, rgba(139,60,247,0.20), rgba(255,255,255,0.03))",
              border: "1px solid rgba(201,164,255,0.22)",
              ...reveal(progress, 0.58 + i * 0.08, 30),
            }}
          >
            {card.icon}
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, marginTop: 14 }}>{card.title}</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              <Bar w="90%" h={9} o={0.16} />
              <Bar w="70%" h={9} o={0.16} />
            </div>
          </div>
        ))}
      </div>
      {/* Faixa extra, revelada pela rolagem */}
      <div
        style={{
          margin: "10px 56px 60px",
          height: 220,
          borderRadius: 26,
          background: `linear-gradient(120deg, ${C.purple}, ${C.violet} 60%, ${C.violetBright})`,
          display: "flex",
          alignItems: "center",
          padding: "0 48px",
          fontFamily: FONT_DISPLAY,
          fontWeight: 700,
          fontSize: 40,
          ...reveal(progress, 0.85, 30),
        }}
      >
        Vamos conversar sobre o seu projeto?
      </div>
    </div>
  );
};

const MobileSite: React.FC<Omit<Props, "layout" | "screenW" | "screenH">> = ({ progress, t, scroll = 0 }) => {
  return (
    <div style={{ width: 390, fontFamily: FONT_BODY, color: C.white, translate: `0px ${-scroll}px` }}>
      {/* Barra de status */}
      <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 28px 0", fontSize: 15, fontWeight: 700 }}>
        <div>9:41</div>
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
          {[6, 9, 12, 15].map((h) => (
            <div key={h} style={{ width: 4, height: h, borderRadius: 2, backgroundColor: C.white }} />
          ))}
          <div style={{ marginLeft: 6, width: 26, height: 13, borderRadius: 4, border: "1.5px solid #fff", padding: 1.5 }}>
            <div style={{ width: "75%", height: "100%", borderRadius: 2, backgroundColor: "#fff" }} />
          </div>
        </div>
      </div>
      {/* Navegação */}
      <div style={{ height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", ...reveal(progress, 0.02, -16) }}>
        <BrandMark size={24} />
        <MenuIcon size={26} color={C.lilacSoft} />
      </div>
      {/* Imagem principal */}
      <div style={{ padding: "6px 18px 0" }}>
        <div
          style={{
            height: 230,
            borderRadius: 24,
            overflow: "hidden",
            background: "radial-gradient(circle at 55% 45%, #2B0A52 0%, #12051F 72%)",
            border: "1px solid rgba(201,164,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            clipPath: `inset(0 ${interpolate(progress, [0.1, 0.3], [100, 0], { ...CLAMP, easing: EASE_OUT })}% 0 0 round 24px)`,
          }}
        >
          <Orb size={120} t={t} />
        </div>
      </div>
      <div style={{ padding: "22px 22px 0" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 12,
            color: C.lilacSoft,
            border: "1px solid rgba(201,164,255,0.35)",
            background: "rgba(139,60,247,0.14)",
            ...reveal(progress, 0.28),
          }}
        >
          <SparkIcon size={13} color={C.lilac} /> Presença digital
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36, lineHeight: 1.05, marginTop: 14, letterSpacing: -0.8, ...reveal(progress, 0.36) }}>
          Sua marca em{" "}
          <span
            style={{
              backgroundImage: `linear-gradient(100deg, ${C.lilacSoft}, ${C.violetBright})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            outro nível.
          </span>
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8, ...reveal(progress, 0.46) }}>
          <Bar w="96%" h={10} />
          <Bar w="80%" h={10} />
        </div>
        <div
          style={{
            marginTop: 22,
            padding: "15px 0",
            borderRadius: 30,
            textAlign: "center",
            fontSize: 16,
            fontWeight: 700,
            background: `linear-gradient(135deg, ${C.violetBright}, ${C.purple})`,
            boxShadow: `0 0 ${18 + Math.sin(t / 8) * 6}px rgba(139,60,247,0.65)`,
            ...reveal(progress, 0.56),
          }}
        >
          Solicitar orçamento
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {[
            { icon: <LayoutIcon size={20} color={C.lilac} />, title: "Serviços" },
            { icon: <ImageIcon size={20} color={C.lilac} />, title: "Portfólio" },
          ].map((card, i) => (
            <div
              key={card.title}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 18,
                background: "linear-gradient(150deg, rgba(139,60,247,0.22), rgba(255,255,255,0.03))",
                border: "1px solid rgba(201,164,255,0.22)",
                ...reveal(progress, 0.66 + i * 0.1, 26),
              }}
            >
              {card.icon}
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16, marginTop: 8 }}>{card.title}</div>
              <Bar w="80%" h={7} o={0.16} style={{ marginTop: 8 }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, height: 150, borderRadius: 20, background: `linear-gradient(120deg, ${C.purple}, ${C.violet})`, ...reveal(progress, 0.84, 26) }} />
      </div>
    </div>
  );
};

export const SiteMockup: React.FC<Props> = ({ layout, screenW, screenH, progress, t, scroll }) => {
  const virtualW = layout === "mobile" ? 390 : 1280;
  const s = screenW / virtualW;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(180deg, #12051F 0%, #0A0414 100%)",
      }}
    >
      <div style={{ width: virtualW, height: screenH / s, transformOrigin: "0 0", scale: `${s}`, overflow: "hidden" }}>
        {layout === "mobile" ? (
          <MobileSite progress={progress} t={t} scroll={scroll} />
        ) : (
          <DesktopSite progress={progress} t={t} scroll={scroll} />
        )}
      </div>
    </div>
  );
};
