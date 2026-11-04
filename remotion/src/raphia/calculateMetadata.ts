import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { CalculateMetadataFunction, staticFile } from "remotion";
import { RaphiaAdProps, VOICEOVER_FILES } from "./RaphiaAd";

// Mesmo fps da <Composition> em Root.tsx.
const FPS = 30;

// Atraso (em segundos) entre o início de cada cena e o início da locução.
// Igual aos valores de `from` em RaphiaAd.tsx (descontando a meia transição),
// mais uma folga no final.
const LEAD = [8 / FPS, 4 / FPS, 4 / FPS, 24 / FPS, 4 / FPS];
const TAIL = 0.6;

const getAudioDuration = async (src: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  const seconds = await input.computeDuration();
  input.dispose();
  return seconds;
};

// Sem narração: usa as durações do roteiro (55s).
// Com narração: cada cena dura no mínimo o tempo do roteiro e se estende
// se a locução daquela cena for mais longa.
export const calculateRaphiaMetadata: CalculateMetadataFunction<RaphiaAdProps> = async ({ props }) => {
  let duracoes = props.duracoes;
  if (props.narracao) {
    const audio = await Promise.all(VOICEOVER_FILES.map((f) => getAudioDuration(staticFile(f))));
    duracoes = props.duracoes.map((d, i) => Math.max(d, Math.ceil((audio[i] + LEAD[i] + TAIL) * 10) / 10));
  }
  const total = duracoes.reduce((sum, d) => sum + Math.round(d * FPS), 0);
  return {
    durationInFrames: total,
    props: { ...props, duracoes },
  };
};
