import React from "react";
import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill, staticFile, useVideoConfig } from "remotion";
import { Background, Grain } from "./Background";
import "./fonts";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Site } from "./scenes/Scene2Site";
import { Scene3Extras } from "./scenes/Scene3Extras";
import { Scene4Offer } from "./scenes/Scene4Offer";
import { Scene5CTA } from "./scenes/Scene5CTA";
import { C, TRANSITION_FRAMES } from "./theme";
import { depthZoom } from "./transitions";

export type RaphiaAdProps = {
  /** Toca os arquivos public/voiceover/cena-01.mp3 ... cena-05.mp3 */
  narracao: boolean;
  /** Número exibido na tela final, ex.: "(85) 9 0000-0000". Vazio = oculto. */
  whatsapp: string;
  /** Duração de cada cena, em segundos (roteiro: 6, 11, 17, 10, 11). */
  duracoes: number[];
};

export const VOICEOVER_FILES = [
  "voiceover/cena-01.mp3",
  "voiceover/cena-02.mp3",
  "voiceover/cena-03.mp3",
  "voiceover/cena-04.mp3",
  "voiceover/cena-05.mp3",
];

export const RaphiaAd: React.FC<RaphiaAdProps> = ({ narracao, whatsapp, duracoes }) => {
  const { fps } = useVideoConfig();
  const T = TRANSITION_FRAMES;
  const half = T / 2;
  const frames = duracoes.map((d) => Math.round(d * fps));
  // Início "nominal" de cada cena (o meio de cada transição).
  const starts: number[] = [];
  frames.forEach((f, i) => starts.push(i === 0 ? 0 : starts[i - 1] + frames[i - 1]));

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <Background starts={starts} />
      <TransitionSeries>
        <TransitionSeries.Sequence name="Cena 01 — Gancho" durationInFrames={frames[0] + half}>
          <Scene1Hook />
          {narracao ? <Audio src={staticFile(VOICEOVER_FILES[0])} from={8} /> : null}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Cena 02 — Desenvolvimento" durationInFrames={frames[1] + T}>
          <Scene2Site />
          {narracao ? <Audio src={staticFile(VOICEOVER_FILES[1])} from={half + 4} /> : null}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={depthZoom()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Cena 03 — Valor e benefícios" durationInFrames={frames[2] + T}>
          <Scene3Extras />
          {narracao ? <Audio src={staticFile(VOICEOVER_FILES[2])} from={half + 4} /> : null}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={depthZoom()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Cena 04 — Oferta" durationInFrames={frames[3] + T}>
          <Scene4Offer />
          {narracao ? <Audio src={staticFile(VOICEOVER_FILES[3])} from={half + 24} /> : null}
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={depthZoom()} timing={linearTiming({ durationInFrames: T })} />
        <TransitionSeries.Sequence name="Cena 05 — CTA" durationInFrames={frames[4] + half}>
          <Scene5CTA whatsapp={whatsapp} />
          {narracao ? <Audio src={staticFile(VOICEOVER_FILES[4])} from={half + 4} /> : null}
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <Grain />
    </AbsoluteFill>
  );
};
