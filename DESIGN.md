# Design — Cobertura de eventos Raphia

Recorded from the built page `cobertura-eventos/index.html`. Describes what exists; change it when the page changes.

## World

"Álbum vivo": a white page (#fdfdfd) where real event photos behave like printed copies being leafed through. Raphia purple and balloon pink do not sit as accents only; each owns a full band of the page (purple for what is included, lilac for the process, pink for the closing offer). The rest is white so the photos carry the color.

## Color

| Token | Hex | Role |
|---|---|---|
| `--linho` | #fdfdfd | Page ground, header (white; the user replaced the beige) |
| `--linho-2` | #f1edf5 | Footer, image placeholders, hover fills |
| `--papel` | #ffffff | Photo print borders, light buttons, tags |
| `--roxo` | #600298 | Brand purple: primary buttons, "incluso" band, corporate tile |
| `--roxo-escuro` | #46016f | Button hover |
| `--rosa` | #ff40aa | Brand pink: button icon disc, seal, confraternização tile, final band |
| `--rosa-suave` | #ffd6ea | Highlights on purple |
| `--lilas` | #e7daf8 | "Como funciona" band |
| `--lilas-texto` | #dccaf3 | Secondary text on purple |
| `--tinta` | #2b1e33 | Text (plum-black, never pure black) |
| `--tinta-2` | #5d4e66 | Secondary text on light grounds |

Single light theme by choice. Text on pink is always `--tinta`; text on purple is `--papel` or `--lilas-texto`. No beige anywhere.

## Type

- Display: **Syne** 700/800 (brand face from the operational manual), tracking -0.025em, balanced.
- Emotional accent: **Instrument Serif italic**, one word or short phrase per heading (`.acento`), in purple on light grounds and pink on purple.
- Text: **DM Sans** 400/500/600 (brand face), 17px base, line-height 1.6.
- Scale tokens: `--t-hero`, `--t-h2`, `--t-h3`, `--t-lead`, `--t-small` (fluid clamps).
- No eyebrow labels above headings. Numbers appear only in the 5-step process.

## Components

- **Photo print**: `--papel` border (~0.5rem), radius 1.6rem outer / 1.15rem inner, soft offset shadow `--sombra-foto`.
- **Primary button**: purple pill, label + 2.6rem pink disc with the WhatsApp glyph. Light variant on pink bands (`.btn--claro`), outline variant (`.btn--borda`). Press = scale(0.97).
- **Link with arrow** (`.link-seta`): underlined, arrow follows the last word.
- **Color tile** (`.campo`): full-color block for event types without photos yet.
- **Seal**: rotating ring text "Black Friday • eventos até fevereiro • Raphia" around "15% de desconto"; pink disc on white, purple disc on pink.
- **Filter pills**: outline pills, selected = `--tinta` fill.
- **Lightbox**: native `<dialog>`, dark plum backdrop, arrows, swipe, Esc.

## Motion

- Signature: hero photo stack auto-advances every 4.2s, can be dragged or flicked (velocity > 0.11 px/ms), pauses on hover, focus, hidden tab or when off screen.
- Ambient: photo wall, two rows looping in opposite directions (90s / 105s), pauses on hover; seal rotation 26s.
- Functional: filter changes use View Transitions (fallback: 35ms stagger), lightbox crossfade with 4px blur, FAQ height transition, process line draws with scroll.
- Easing: `--ease-out` cubic-bezier(0.23, 1, 0.32, 1) for everything entering or responding.
- `prefers-reduced-motion`: no autoplay, no loops, instant transitions.

## Layout

- Container max 74rem, side gutter `max(20px, safe-area)`. Section rhythm `--secao` (4.5–8rem).
- Mobile (< 900px) hero order: headline, photo stack, subtitle, button, facts.
- One reserve button at a time: header button on desktop (≥ 940px), floating button on mobile.
- Portfolio grid: 2/3/4 columns, masonry by row spans; horizontals span 2 columns, the first photo of each view is the cover.

## Content rules

- Every button opens WhatsApp with a pre-filled message per event type (`conteudo.js`).
- Client names never appear: not in copy, alt text, file names, or inside photos (cake plaques, invitations are cropped out or excluded).
- Photos are original Raphia portfolio work, used with the families' authorization; exported at 1600px WebP, metadata stripped.
