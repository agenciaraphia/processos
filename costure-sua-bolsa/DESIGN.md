# Design: Oficina Costure Sua Bolsa

Registro do sistema visual da página `index.html`, descrito a partir do que foi construído.

## Mundo
O flyer da oficina virou uma página para rolar, com linguagem de conteúdo de Instagram (UGC): adesivos, stories, fita adesiva, polaroids e ingresso, sobre um fundo bege claro.

## Cores
| Token | Hex | Uso |
|---|---|---|
| `--bege` | #FEFADF | Fundo da página (pedido da cliente) |
| `--papel` / `--papel-claro` | #F6EDD3 / #FFFDF2 | Adesivos, polaroids, ingresso |
| `--laranja` | #FF9E00 | Painéis com borda ondulada, botões, canhoto do ingresso |
| `--laranja-tinta` | #E0560A | Títulos grandes sobre o bege e texto dos adesivos (só tamanho grande) |
| `--ferrugem` | #B4441A | Fita/marquee, rótulos pequenos, script sobre o bege |
| `--tinta` / `--tinta-2` | #2B1709 / #5A3A22 | Texto; todo texto sobre o laranja usa tinta |

Texto creme sobre o laranja só aparece no título do flyer (imagem) e na linha cursiva com sombra no fechamento.

## Tipografia
- **Noto Serif Display, largura 62,5%**: no peso 400 nos títulos; no 900 nos adesivos, no ingresso e no "Costure sua bolsa!".
- **Corinthia 700**: palavras de destaque e legendas, sempre em 1,7rem ou mais.
- **Figtree**: corpo e botões. Os botões usam caixa alta com espaçamento de 0,07em.

## Componentes
- **Borda ondulada** (`.onda`): máscara com ondas em SVG nos quatro lados e cantos arredondados. É usada no topo e no fechamento.
- **Painel com pesponto** (`.aprender__painel`): bloco laranja arredondado com tracejado interno.
- **Adesivo** (`.adesivo`): fundo de papel com borda rasgada (filtro `#rasgado`) e rotação definida em `--r`.
- **Polaroid com fita** (`.polaroid.com-fita`).
- **Stories** (`[data-stories]`): 5 etapas com barra de progresso.
  - Avança sozinho a cada 5,2s e pausa ao segurar ou pelo botão.
  - Responde às setas do teclado.
  - Não avança sozinho para quem pede movimento reduzido.
- **Ingresso** (`.ingresso`): corpo e canhoto com furos feitos por máscara. Fica vertical no celular.
- **Botão** (`.botao`): pílula com bola de ícone e variantes `--laranja` e `--contorno`.
- **Barra fixa** no celular, que se esconde quando os botões do topo ou do fechamento estão na tela.
- **Marca-texto** (`mark`) em uma palavra de alguns títulos.

## Fundos
- **Papel de molde**: grade de 24px e 120px.
- **Padrão de manequins**: na seção do ateliê.
- **Monograma SH**: fundo dos painéis laranja.

## Movimento
- **Entrada**: só no topo, com a moldura subindo e os adesivos sendo "colados" um depois do outro.
- **Stories**: avançam sozinhos.
- **Fita**: faixa contínua lenta.
- **Botões**: diminuem para 0,97 ao toque.
- **Movimento reduzido**: tudo isso é desligado.
