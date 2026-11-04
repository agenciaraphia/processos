// Gera a narração das 5 cenas pelo ElevenLabs e salva em public/voiceover/.
//
// Uso (na pasta remotion/):
//   ELEVENLABS_API_KEY=sua_chave node --experimental-strip-types scripts/gerar-narracao.ts
//
// Depois, ligue a narração no Studio (prop "narracao" = true) ou no render:
//   npx remotion render RaphiaSite399 out/raphia-site-399.mp4 --props='{"narracao":true,"whatsapp":"","duracoes":[6,11,17,10,11]}'

import { mkdirSync, writeFileSync } from "node:fs";

// Voz "Thales – Sophisticated and Vibrant" (pt-BR), da biblioteca do ElevenLabs.
const VOICE_ID = "Q0l58S3V13QxkdteObmh";
const MODEL_ID = "eleven_multilingual_v2";

const CENAS = [
  "Seu negócio merece muito mais do que apenas estar nas redes sociais. Ele precisa de um espaço próprio na internet!",
  "Tenha um site institucional desenvolvido de acordo com a identidade visual da sua marca, com até três páginas, animações e um design pensado para apresentar seu negócio com profissionalismo.",
  "E você não precisa se preocupar com a estrutura inicial: o pacote já inclui domínio .com.br, hospedagem por um ano e configuração para indexação nos mecanismos de busca.",
  "Tudo isso por apenas trezentos e noventa e nove reais!",
  "Não deixe sua empresa de fora do mundo digital. Clique no botão, fale com nossa equipe e tenha seu site profissional!",
];

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Defina a variável ELEVENLABS_API_KEY.");
  process.exit(1);
}

mkdirSync("public/voiceover", { recursive: true });

for (let i = 0; i < CENAS.length; i++) {
  const file = `public/voiceover/cena-0${i + 1}.mp3`;
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: CENAS[i],
      model_id: MODEL_ID,
      voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35 },
    }),
  });
  if (!response.ok) {
    console.error(`Cena ${i + 1}: erro ${response.status} — ${await response.text()}`);
    process.exit(1);
  }
  writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  console.log(`Cena ${i + 1} salva em ${file}`);
}
