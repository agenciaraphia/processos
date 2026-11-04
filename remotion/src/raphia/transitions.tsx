import React from "react";
import { AbsoluteFill } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

// Transição cinematográfica: a cena que sai avança em direção à câmera e desfoca;
// a que entra vem do fundo, com um clarão lilás no ponto de corte.
const DepthZoomPresentation: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ opacity: 1 - p, scale: `${1 + p * 0.35}`, filter: `blur(${p * 18}px)` }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: p, scale: `${0.84 + p * 0.16}`, filter: p < 1 ? `blur(${(1 - p) * 18}px)` : undefined }}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(240,230,255,0.75) 0%, rgba(166,107,255,0.35) 30%, rgba(96,2,152,0) 70%)",
          opacity: Math.sin(p * Math.PI) * 0.85,
          mixBlendMode: "screen",
        }}
      />
    </AbsoluteFill>
  );
};

export const depthZoom = (): TransitionPresentation<Record<string, never>> => ({
  component: DepthZoomPresentation,
  props: {},
});
