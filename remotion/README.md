# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Anúncio Raphia — Site profissional por R$ 399,00

Composição `RaphiaSite399` (pasta **Raphia** no Studio): vídeo vertical 9:16
(1080×1920, 30 fps, 55 s) em 5 cenas, seguindo o roteiro.

| Cena | Tempo | Arquivo |
| --- | --- | --- |
| 01 Gancho | 0–6 s | `src/raphia/scenes/Scene1Hook.tsx` |
| 02 Desenvolvimento | 6–17 s | `src/raphia/scenes/Scene2Site.tsx` |
| 03 Valor e benefícios | 17–34 s | `src/raphia/scenes/Scene3Extras.tsx` |
| 04 Oferta | 34–44 s | `src/raphia/scenes/Scene4Offer.tsx` |
| 05 CTA + tela final | 44–55 s | `src/raphia/scenes/Scene5CTA.tsx` |

Cores e fontes ficam em `src/raphia/theme.ts`; o fundo (arco de luz,
partículas, linhas luminosas) em `src/raphia/Background.tsx`.

### Props

- `whatsapp`: número mostrado na tela final, ex.: `"(85) 9 0000-0000"`. Vazio = oculto.
- `narracao`: `true` toca `public/voiceover/cena-01.mp3` … `cena-05.mp3`.
  Se a locução de uma cena for mais longa que o roteiro, a cena se estende sozinha.
- `duracoes`: duração de cada cena em segundos (`[6, 11, 17, 10, 11]`).

### Narração (ElevenLabs)

```console
ELEVENLABS_API_KEY=sua_chave node --experimental-strip-types scripts/gerar-narracao.ts
```

Ou coloque seus próprios MP3 em `public/voiceover/` com esses nomes.

### Renderizar

```console
npx remotion render RaphiaSite399 out/raphia-site-399.mp4
npx remotion render RaphiaSite399 out/raphia-site-399.mp4 --props='{"narracao":true,"whatsapp":"(85) 9 0000-0000","duracoes":[6,11,17,10,11]}'
```

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
