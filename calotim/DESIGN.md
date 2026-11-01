---
name: Calotim
description: Dividir ficou fácil. Divisão de contas em grupo com cálculo transparente e ao vivo.
colors:
  bg: "#EEF1EC"
  surface: "#FFFFFF"
  surface-2: "#F4F6F2"
  surface-3: "#E8ECE6"
  green: "#245A43"
  green-700: "#1C4935"
  green-800: "#163A2A"
  green-900: "#11291F"
  green-soft: "#E3EDE6"
  green-mid: "#6E9E80"
  green-line: "#C5D8CB"
  lime: "#C9F25C"
  lime-600: "#B4E03C"
  lime-soft: "#EEF9D2"
  lime-ink: "#1E2622"
  orange: "#F28B42"
  orange-700: "#9A4C14"
  orange-soft: "#FFF0E3"
  orange-tint: "#F7C29A"
  ink: "#1E2622"
  ink-2: "#3D4842"
  muted: "#5E6963"
  on-dark: "#FFFFFF"
  on-dark-2: "rgba(255, 255, 255, .68)"
  line: "#E3E7E1"
  line-strong: "#D3D9D2"
  danger: "#B54C3F"
  danger-soft: "#FBEDEA"
  p1: "#245A43"
  p2: "#C9F25C"
  p3: "#1E2622"
  p4: "#7FB08F"
  p5: "#9BC94A"
  p6: "#3E7A5E"
  p7: "#B9D4C2"
  p8: "#5E6963"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 800
    lineHeight: 1.16
    letterSpacing: "-0.045em"
  numeral:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.05em"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "-0.03em"
  row-title:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "15.5px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'cv11', 'ss01'"
  label:
    fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  caption:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
  tag:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.3
rounded:
  r-sm: "12px"
  r: "16px"
  r-lg: "22px"
  r-xl: "28px"
  r-pill: "999px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "clamp(20px, 3.2vw, 44px)"
  stack: "16px"
  card: "20px"
  panel: "22px"
  section: "36px"
  dark-block: "40px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "0 20px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.green-700}"
  button-lime:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "0 6px 0 20px"
    height: "46px"
  button-lime-hover:
    backgroundColor: "{colors.lime-600}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "0 20px"
    height: "46px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-small:
    rounded: "{rounded.r-pill}"
    padding: "0 14px"
    height: "38px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.r-pill}"
    height: "46px"
  arrow-circle:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-pill}"
    size: "38px"
  arrow-circle-hover:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
  icon-circle:
    backgroundColor: "{colors.lime-soft}"
    textColor: "{colors.green}"
    rounded: "{rounded.r-pill}"
    size: "44px"
  search-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-pill}"
    padding: "0 16px 0 44px"
    height: "46px"
  input-field:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r}"
    padding: "0 16px"
    height: "48px"
  input-field-focus:
    backgroundColor: "{colors.surface}"
  tabs-track:
    backgroundColor: "{colors.surface-2}"
    rounded: "{rounded.r-pill}"
    padding: "4px"
  tab:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "0 16px"
    height: "42px"
  tab-active:
    backgroundColor: "{colors.green}"
    textColor: "{colors.on-dark}"
  tab-count-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.r-pill}"
    height: "20px"
  tag:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green}"
    typography: "{typography.tag}"
    rounded: "{rounded.r-pill}"
    padding: "3px 9px"
  status-pending:
    backgroundColor: "{colors.orange-soft}"
    textColor: "{colors.orange-700}"
    typography: "{typography.tag}"
    rounded: "{rounded.r-pill}"
    padding: "2px 9px 2px 7px"
  status-paid:
    backgroundColor: "{colors.lime-soft}"
    textColor: "{colors.green}"
    typography: "{typography.tag}"
    rounded: "{rounded.r-pill}"
    padding: "2px 9px 2px 7px"
  status-prepaid:
    backgroundColor: "{colors.green-soft}"
    textColor: "{colors.green-700}"
    typography: "{typography.tag}"
    rounded: "{rounded.r-pill}"
    padding: "2px 9px 2px 7px"
  chip-choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.r-pill}"
    padding: "0 14px"
    height: "38px"
  chip-choice-selected:
    backgroundColor: "{colors.green}"
    textColor: "{colors.on-dark}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.r-xl}"
    padding: "20px"
  dark-block:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.r-xl}"
    padding: "40px 40px 36px"
  live-total:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.on-dark}"
    typography: "{typography.numeral}"
    padding: "14px 20px 24px"
  highlight-mark:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    rounded: "10px"
    padding: "0 .16em"
  nav-item:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.r-pill}"
    padding: "0 16px"
    height: "46px"
  nav-item-active:
    backgroundColor: "{colors.green}"
    textColor: "{colors.on-dark}"
  bottom-nav:
    backgroundColor: "{colors.surface}"
    rounded: "24px"
    height: "64px"
  fab:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.lime-ink}"
    rounded: "{rounded.r-pill}"
    size: "56px"
  toast:
    backgroundColor: "{colors.green-900}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.r-lg}"
    padding: "12px 14px 12px 16px"
  menu:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.r-lg}"
    padding: "6px"
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.r-xl}"
    width: "min(580px, calc(100% - 32px))"
---

# Design System: Calotim

## Overview

**Creative North Star: "O Placar da Mesa"**

O Calotim se comporta como um placar que se atualiza enquanto a mesa conversa. Os números importantes moram em blocos de verde profundo, grandes, brancos e pesados; uma lima elétrica marca o que merece o olho; tudo o mais é superfície branca e arredondada apoiada num cinza frio e claro. É a gramática do produto financeiro moderno (bloco escuro, pílulas, ícones em círculos, números enormes, setas em círculo) aplicada a uma conta de restaurante, e não a um banco.

A densidade é média e calma. Listas correm em linhas generosas com divisórias finas que somem no hover; cartões de 28px de raio flutuam sem borda, separados do fundo por tom e por uma sombra ambiente levemente esverdeada. Todo valor em reais sai em Plus Jakarta Sans pesada, com tracking negativo e algarismos tabulares; a explicação miúda sai em Inter. O movimento faz parte da leitura: valores contam até o número novo, a barra de divisão redistribui os segmentos, a pílula da navegação e o indicador das abas deslizam até o item escolhido, a seta em círculo gira 45° quando o cartão é apontado.

Rejeições confirmadas: o visual creme anterior (fundo creme e bordas finas em toda superfície) foi substituído por este; nenhum emoji em lugar algum; nada que imite banco, cartão, carteira ou comprovante, porque o Calotim calcula e organiza, mas não movimenta dinheiro.

**Key Characteristics:**
- Fundo cinza frio claro com cartões brancos que flutuam por sombra, nunca por borda.
- Bloco de verde profundo para o número principal de cada região: painel inicial, topo do painel ao vivo, total do item no formulário, primeira métrica do extrato.
- Lima em duas posições apenas: como fundo com tinta escura por cima, ou como ícone e número sobre o verde escuro.
- Laranja restrito ao que ainda está em aberto, sempre com ícone e texto.
- Pílula para tudo que é ação ou rótulo; círculo para ícones, avatares e setas.
- Números grandes, pesados e tabulares que animam ao mudar; movimento reduzido sempre respeitado.

## Colors

Dois verdes e uma lima: o verde Calotim faz o trabalho pesado, a lima acende, o laranja só aparece para o que ainda falta.

### Primary
- **Verde Calotim** (`--green`): a cor de ação sobre fundo claro. Botão primário, pílula ativa da barra lateral, indicador deslizante das abas, ícone ativo da navegação inferior, chip e checkbox marcados, ícone do cartão de escolha selecionado, borda de foco dos campos, links e anel de foco global.
- **Verde Noturno** (`--green-800`): o verde dos blocos escuros grandes. Painel inicial, cabeçalho e total do painel ao vivo, prévia "Total do item", resumo de pagamento por pessoa, faixa do extrato compartilhado, primeira métrica do extrato. Mais fundo que o Verde Calotim de propósito: o botão verde nunca se perde dentro dele.
- **Verde Mata** (`--green-700`): hover do botão primário e texto do status "Antecipado".
- **Verde Abissal** (`--green-900`): dicas flutuantes, aviso flutuante (toast), núcleo do motor ilustrado; também é a base de todas as sombras e do fundo das janelas (`rgba(17, 41, 31, …)`).
- **Verde Névoa** (`--green-soft`): fundo de tag padrão, avatar sem personagem, ícone de viagem, ícone de desconto, status antecipado.
- **Verde Sálvia** (`--green-mid`): ponto de "Salvo neste navegador".
- **Verde Contorno** (`--green-line`): borda de hover do botão secundário e dos chips.

### Secondary
- **Lima Elétrica** (`--lime`): o acento. Como fundo, sempre com `--lime-ink` por cima: marcador atrás de palavras no título, botão lima do painel inicial, botão flutuante (+) do celular, contador da aba selecionada, pílula do total da divisão, seta em círculo no hover, ícones de estado vazio, de painel e de acerto, ação do toast, "+N" das pilhas de avatar, seleção de texto. Como tinta, só sobre verde: ícone dentro do botão primário, da navegação ativa, da aba ativa e do chip marcado; marca do checkbox; total do item; valores destacados no painel inicial; selo "Ao vivo".
- **Lima Funda** (`--lime-600`): hover do botão lima e do botão flutuante.
- **Lima Clara** (`--lime-soft`): status "Pago", cartão de escolha e opção marcados, flash do item recém-lançado, linha selecionada da paleta de comandos, chips de participante, ícone de taxa, tag "Casal", soma de unidades que fecha.
- **Tinta Lima** (`--lime-ink`): texto e ícones sobre lima; também o fundo da seta em círculo dentro do botão lima.

### Tertiary
- **Laranja Calotim** (`--orange`): a seta animada de acerto entre participantes (quem ainda acerta com quem) e o ponto de falha ao salvar.
- **Laranja Queimado** (`--orange-700`): texto e ícone de pendência sobre claro. "Pendente no local", "Falta R$ …", contador de aba com atenção, ícone da pendência com o estabelecimento.
- **Laranja Claro** (`--orange-soft`): fundo do status pendente, da notícia de cuidado, do ícone de confirmação e da soma de unidades que não fecha.
- **Laranja Pêssego** (`--orange-tint`): pendência sobre o verde escuro ("Falta pagar" no resumo recolhido do celular) e ícone do toast de alerta.

### Neutral
- **Cinza Neblina** (`--bg`): fundo da página e da barra lateral; também o anel que recorta o botão flutuante da navegação inferior.
- **Branco** (`--surface`): cartões, listas, painéis, janelas, busca, navegação inferior.
- **Branco Gelo** (`--surface-2`): trilho das abas, campos de formulário em repouso, hover de linha, fundo das setas em círculo e dos ícones neutros, cabeçalho de tabela.
- **Cinza Pedra** (`--surface-3`): linha pressionada, menu aberto, linhas do recibo ilustrado.
- **Grafite** (`--ink`): títulos e números. **Grafite Médio** (`--ink-2`): navegação, abas em repouso, texto de apoio. **Musgo Cinza** (`--muted`): metadados, dicas, legendas.
- **Branco no Escuro** (`--on-dark`) e **Branco 68%** (`--on-dark-2`): texto principal e secundário sobre verde escuro.
- **Linha** (`--line`): divisórias internas e borda dos cartões de escolha. **Linha Firme** (`--line-strong`): borda do botão secundário, dos chips e da tag neutra; alça das folhas no celular.
- **Vermelho Tijolo** (`--danger`) e **Vermelho Claro** (`--danger-soft`): só destruição (excluir, apagar tudo).

### Pessoas
`--p1` a `--p8` são verdes, lima e grafite atribuídos a cada pessoa pela ordem na divisão. Pintam os segmentos da barra de divisão e o ponto ao lado do nome no painel ao vivo. A lima quase some sobre branco, por isso a barra nunca é a única fonte da informação: cada segmento tem dica com nome e valor, e a lista ao lado repete os dois.

### Named Rules
**A Regra da Lima no Escuro.** Lima nunca é texto nem ícone sobre branco ou cinza claro. Ou ela é o fundo, com `--lime-ink` por cima, ou ela brilha sobre `--green` e `--green-800`. Lima encostada em branco como tinta está errada.

**A Regra do Laranja Pendente.** Na interface, laranja quer dizer "ainda em aberto": valor pendente, acerto a fazer, soma que não fecha, aviso que pede ação. Vem sempre com ícone (relógio, alerta, loja) e texto. Resolvido é lima clara; destrutivo é vermelho tijolo. Os personagens ilustrados são o único lugar onde laranja aparece sem significar pendência.

**A Regra dos Dois Verdes.** Bloco escuro grande usa `--green-800`; controle usa `--green`. Dentro de um bloco escuro a ação é lima, branca ou em contorno claro, nunca um botão verde.

## Typography

**Display Font:** Plus Jakarta Sans (com Inter e system-ui), pesos 600, 700 e 800
**Body Font:** Inter (com system-ui, -apple-system, Segoe UI, Roboto), pesos 400 a 700, com `cv11` e `ss01`

**Character:** Jakarta pesada e apertada fala os números e as ações com a firmeza de um placar; Inter, neutra e legível, carrega a explicação miúda. A dupla vem do guia de identidade do Calotim e não muda.

### Hierarchy
- **Display** (800, 44px, 1.16, -0.045em): uma frase por tela, só no bloco escuro do painel inicial. Cai para 38px até 1279px e 32px até 640px. Aceita o marcador lima em parte da frase.
- **Numeral** (800, 42px, 1.05, -0.05em, tabular): o total no topo do painel ao vivo. A mesma família, peso e tracking negativo descem para todo valor em reais: 26px no rodapé do cartão de divisão e na prévia do item, 17px no total da linha, 16px no valor do lançamento, 15px no valor por pessoa.
- **Headline** (800, 30px, 1.12, -0.035em): título da página na barra superior, 24px abaixo de 1024px. O nome da divisão aberta sobe para 34px (26px no celular).
- **Title** (800, 22px, -0.03em): títulos de seção. Janelas usam 23px, confirmações 20px, títulos de painel 18px.
- **Row title** (700, 15.5px, 1.3, -0.015em): nome da divisão, do item e da pessoa nas listas e cartões.
- **Body** (Inter 400, 14.5px, 1.5): texto corrido, 15px no celular. Parágrafos explicativos ficam entre 42 e 70 caracteres por linha.
- **Label** (Jakarta 600, 14px, -0.01em): botões, abas e navegação (14.5px); rótulos de campo em 13px.
- **Caption** (Inter 400 a 500, 12.5px, 1.5): metadados em linha com ícone de 14px, dicas e legendas, sempre em `--muted`.
- **Tag** (Inter 600, 11.5px, 1.3): tags e status em pílula.

### Named Rules
**A Regra do Número Tabular.** Todo valor em reais usa algarismos tabulares e Jakarta 700 a 800 com tracking negativo. Inter regular para valor só em frases de apoio e nas tabelas do extrato.

**A Regra Sem Caixa-Alta.** Nenhum rótulo em maiúsculas espaçadas. A hierarquia vem de peso e tamanho; o tracking só fica negativo, nunca positivo.

## Layout

No desktop (a partir de 1024px) a barra lateral de 248px fica fixa sobre o próprio fundo da página, sem cartão, com a navegação no topo e o estado de salvamento e o slogan no pé. O conteúdo vai até 1480px, centrado, com gutter fluido (`clamp(20px, 3.2vw, 44px)`). A barra superior traz o título à esquerda e, à direita, a busca em pílula (com o atalho Ctrl K) e a ação secundária.

A divisão aberta é uma grade de duas colunas: área de trabalho flexível em cartão branco à esquerda e coluna de 352px (312px entre 1024 e 1279px) com o painel ao vivo fixo a 20px do topo. Listas de divisões e de amigos usam grade automática (mínimos de 290px e 270px, intervalos de 16px e 14px). O painel inicial é um bloco escuro de duas colunas (texto e ilustração de até 460px) que vira uma coluna abaixo de 1024px.

Abaixo de 1024px a barra lateral sai: a marca sobe para a barra superior, a navegação vira uma barra inferior flutuante a 10px das bordas com o botão (+) ao centro, e o painel ao vivo vira uma folha fixa logo acima dela, recolhida mostrando total e pendência. Abaixo de 640px o gutter é 16px, janelas viram folhas que sobem de baixo, formulários de duas colunas viram uma, botões de ação ocupam a largura e campos usam 16px de fonte para o iOS não dar zoom. A área segura inferior do aparelho é sempre respeitada.

O ritmo é de intervalos curtos (8, 10, 12, 14 e 16px dentro dos componentes), 20px de respiro interno nos cartões, 22px nos painéis e 36px antes de cada título de seção.

## Elevation & Depth

O sistema é híbrido: profundidade por tom (cinza frio por trás, branco por cima) somada a sombras ambientes difusas, tingidas de verde, nunca pretas. Cartões não têm borda. A sombra cresce como resposta: o cartão apontado sobe 3px e passa da sombra de repouso para a elevada. Botões verde e lima projetam um brilho colorido curto logo abaixo, como se emitissem luz própria. Menus, janelas, paleta de comandos e toast usam a sombra flutuante; o fundo das janelas é verde abissal a 50%.

### Shadow Vocabulary
- **Repouso** (`--shadow-1`: `0 1px 2px rgba(30, 38, 34, .04), 0 6px 18px -12px rgba(30, 38, 34, .14)`): todo cartão, lista, painel, busca e pílula da barra superior.
- **Elevado** (`--shadow-2`: `0 22px 44px -24px rgba(17, 41, 31, .34), 0 4px 12px -6px rgba(17, 41, 31, .08)`): hover de cartão e da busca; o bloco escuro do painel inicial em repouso.
- **Flutuante** (`--shadow-pop`: `0 30px 64px -26px rgba(17, 41, 31, .45), 0 8px 22px -10px rgba(17, 41, 31, .14)`): menus, janelas, confirmação, paleta e toast.
- **Brilho verde** (`0 10px 22px -14px rgba(36, 90, 67, .9)`): botão primário, pílula da barra lateral e indicador das abas.
- **Brilho lima** (`0 12px 26px -16px rgba(180, 224, 60, .9)`): botão lima. O botão flutuante usa `0 0 0 6px var(--bg), 0 14px 24px -12px rgba(120, 160, 30, .8)`, um anel na cor do fundo que o recorta da barra.
- **Flutuante do celular** (`0 18px 40px -18px rgba(17, 41, 31, .4), 0 2px 8px -2px rgba(17, 41, 31, .08)`): navegação inferior e folha do painel ao vivo.

### Named Rules
**A Regra do Cartão Sem Borda.** Superfície branca sobre o fundo nunca ganha borda; separa por tom e `--shadow-1`. Borda existe só dentro de superfícies (cartões de escolha, opções, caixas de seletor) e no botão secundário.

**A Regra da Sombra Que Responde.** A sombra cresce com hover, abertura e flutuação. Em repouso nada passa de `--shadow-2`, e só o bloco escuro do painel inicial usa esse nível sem interação.

## Shapes

A linguagem é de pílulas e círculos sobre cartões muito arredondados. Pílula (`--r-pill`) para tudo que é ação ou rótulo: botões, busca, trilho e abas, tags, status, chips, contadores, pílula da navegação. Círculo para ícones (todo ícone de categoria, estado ou painel mora num círculo de 34 a 58px), avatares, setas, botões só de ícone e o menu "…".

Cartões, listas, painéis e blocos escuros usam `--r-xl`; no celular os blocos grandes e os elementos flutuantes (navegação inferior, folha ao vivo, área de trabalho, extrato) caem para 24px, e as folhas que sobem de baixo têm 28px só nos cantos de cima. `--r-lg` vale para superfícies internas (cartões de escolha, caixas, menus, toast, métricas, prévias); `--r` para campos, linhas com hover e notícias; `--r-sm` para itens de menu e somatórios. Exceções pequenas e fixas: marcador lima 10px, checkbox 7px, teclas de atalho 6 a 8px.

Os blocos escuros carregam ornamentos finos em lima de baixa opacidade: anéis concêntricos (painel inicial e total ao vivo) e uma grade de pontos mascarada (painel inicial). A marca é um quadrado arredondado verde com anel branco e uma fatia lima que se desloca 1,5px na diagonal no hover. Divisórias de lista são linhas de 1px recuadas 12px das bordas, que somem quando a linha vizinha está em hover.

## Components

### Buttons
Pílulas firmes, que afundam um pouco ao toque.
- **Shape:** pílula de 46px (38px na versão pequena, 42px nas ações do celular, 50px nas folhas), Jakarta 600 14px, ícone de 18px à esquerda.
- **Primary:** fundo `--green`, texto branco, ícone em lima, brilho verde; hover `--green-700`. É a única ação principal por região.
- **Lima:** fundo `--lime`, tinta `--lime-ink`, brilho lima; hover `--lime-600`. Usado sobre bloco escuro.
- **Seta em círculo:** variante com círculo de 34px à direita dentro do botão (lima com seta escura no primário, tinta lima com seta lima no botão lima); gira 45° no hover.
- **Secondary:** branco com borda `--line-strong`, ícone verde; hover borda `--green-line` e fundo `--surface-2`.
- **Contorno claro:** transparente com borda branca a 28% e ícone lima, só sobre verde escuro.
- **Ghost:** sem fundo, `--ink-2`; hover com véu de 6% de grafite. Variante de perigo fica vermelha no hover; o botão de perigo sólido é `--danger`.
- **Hover / Focus / Active:** transições de cor em 200ms; pressão `scale(.97)` em 160ms com `--ease-out`; foco visível com contorno verde de 2px afastado 2px; desabilitado a 50% sem eventos.
- **Text button e icon button:** texto verde Jakarta 600 com véu verde no hover e seta final que avança 2px; botão de ícone em círculo de 38px.

### Chips
- **Tag:** pílula `--green-soft` com texto verde; "Casal" em `--lime-soft` com coração; "Individual" só com contorno `--line-strong`.
- **Status:** pílula com ícone de 12px. Pendente em `--orange-soft`/`--orange-700` com relógio; pago em `--lime-soft`/`--green` com check; antecipado em `--green-soft`/`--green-700` com mão e moedas.
- **Chip de escolha:** pílula branca de 38px com borda `--line-strong`; marcado vira `--green` com texto branco e ícone lima.
- **Chip de participante:** pílula `--lime-soft` com avatar à esquerda e botão de remover em círculo; entra com um pequeno pop.

### Cards / Containers
- **Corner Style:** `--r-xl`.
- **Background:** `--surface`; blocos escuros em `--green-800`.
- **Shadow Strategy:** `--shadow-1` em repouso, `--shadow-2` no hover (ver Elevation & Depth).
- **Border:** nenhuma.
- **Internal Padding:** 20px em cartões, 18px no cartão de amigo, 22px em painéis, 40px no bloco escuro do painel inicial.
- **Cartão de divisão:** círculo do tipo e rótulo no topo com a seta em círculo à direita; nome, metadados com ícones, barra de divisão, pilha de avatares com status e rodapé com "Total" e o valor em 26px. No hover sobe 3px e a seta acende em lima e gira 45°.
- **Lista em cartão:** cartão branco com 6px de recuo interno; linhas com raio `--r-lg`, divisórias recuadas e hover em `--surface-2`; o chevron em círculo acende em lima e avança 2px.
- **Estado vazio:** cartão centrado com ícone num círculo lima de 68px (laranja claro quando é pendência), título Jakarta 800 17px, texto de até 42 caracteres por linha e uma ação.

### Inputs / Fields
- **Style:** campo de 48px, raio `--r`, preenchido em `--surface-2`, borda transparente; rótulo Jakarta 600 13px acima, a 8px.
- **Hover:** borda `--line-strong`.
- **Focus:** borda `--green`, fundo branco e halo lima de 4px (`0 0 0 4px rgba(201, 242, 92, .5)`).
- **Error / Disabled:** campo inválido ganha borda `--danger` depois da interação.
- **Busca:** pílula branca de 46px com `--shadow-1` e lupa recuada 16px; mesmo foco do campo.
- **Seleção:** select sem aparência nativa, com chevron desenhado à direita.
- **Checkbox e rádio:** 20px; checkbox com raio 7px fica verde e desenha a marca lima; rádio mostra um ponto verde que cresce.
- **Cartão de escolha:** superfície interna com borda `--line` e ícone num círculo de 34px; marcado ganha borda e anel verdes, fundo `--lime-soft` e ícone em círculo verde com traço lima.
- **Avatar escolhido:** anel duplo, verde por dentro e lima por fora, com leve aumento.

### Navigation
- **Barra lateral:** itens em pílula de 46px, Jakarta 600 14.5px, `--ink-2`, ícone de 19px; hover com véu de 5% de grafite; o ativo recebe a pílula verde que desliza até ele (340ms, `--ease-out`), texto branco e ícone lima.
- **Barra superior:** título à esquerda; à direita a busca em pílula com o atalho em teclas, que no celular vira um botão redondo só com a lupa.
- **Navegação inferior (abaixo de 1024px):** barra branca flutuante de 64px com raio de 24px e cinco colunas; o ícone ativo fica dentro de uma pílula verde de 50×30px com traço lima e o rótulo fica verde; ao centro, o botão flutuante lima de 56px sobe 26px, recortado por um anel na cor do fundo.
- **Paleta de comandos:** janela de 640px sem animação (é aberta pelo teclado o tempo todo); linha selecionada em `--lime-soft` com o ícone num círculo verde de traço lima.

### Abas segmentadas
Trilho em pílula `--surface-2` com 4px de recuo; abas de 42px em Jakarta 600 14px com ícone. Um indicador verde com brilho desliza até a aba escolhida (340ms); a aba ativa fica com texto branco e ícone lima. Cada aba tem um contador em pílula de 20px: branco em repouso, lima com tinta escura na aba ativa, laranja claro quando pede atenção. No celular as abas se esticam por igual e os ícones saem.

### Painel ao vivo
Cartão branco fixo ao lado da área de trabalho cujo topo é um placar em `--green-800`: selo "Ao vivo" em pílula lima a 14% com ponto lima que pulsa a cada recálculo, hora da atualização, rótulo "Total da conta", valor em Numeral branco e linha de composição em `--on-dark-2`, com um anel lima fino ao fundo. Na parte branca vêm a barra de divisão, a lista por pessoa (ponto de cor, avatar, nome, pendência em laranja queimado, valor), dois totais com ícone em círculo (pendente com o estabelecimento em laranja claro, pago por participantes em lima clara) e um botão secundário de largura total. No celular vira folha flutuante acima da navegação: recolhida mostra só o cabeçalho escuro com total e "Falta pagar" em `--orange-tint`; abre com `--ease-drawer` em 300ms.

### Barra de divisão
Segmentos em pílula, um por pessoa, com 3px de intervalo (4px na versão grande), altura de 10px ou 14px, nas cores `--p1` a `--p8`; vazia, vira um tracejado. Os segmentos animam a largura em 700ms com `--ease-out` quando os valores mudam. Apontar um segmento apaga os outros para 30% e engrossa o escolhido; a dica mostra nome e valor.

### Acerto entre participantes
Cada acerto é uma linha "quem paga → quem recebe" com avatares pequenos: uma linha laranja de 2px se desenha da esquerda para a direita com ponta de seta e um ponto laranja percorre o trajeto em ciclo. Com movimento reduzido, o ponto some e a linha aparece pronta.

### Toast
Aviso flutuante em `--green-900` com raio `--r-lg`, texto branco, ícone lima (pêssego quando é alerta), ação "Desfazer" em pílula lima e barra de progresso lima de 3px no pé, que pausa no hover. Sobe 16px ao entrar.

### Janelas
Cartão de 580px com `--r-xl`, `--shadow-pop` e fundo verde abissal a 50%; título em 23px, botão de fechar em círculo `--surface-2`, ações separadas por uma linha no pé. Abaixo de 640px viram folhas que sobem de baixo (380ms, `--ease-drawer`) com alça de 42×5px e botões de 50px que dividem a largura.

### Avatares
Dezesseis personagens SVG em traço de 1,5px (sorriso, óculos escuros, festa, cowboy, chef, música, artista, astronauta, raposa, panda, sapo, gato, urso, macaco, tigre, coala) sobre fundo verde claro ou laranja claro (o astronauta sobre `--green`), recortados em círculo. Tamanhos de 24 a 54px. Em pilha, sobrepõem 7px com anel branco de 2px e terminam num "+N" em pílula lima. Sem personagem, mostram a inicial em Jakarta sobre `--green-soft`. No hover do cartão de amigo o avatar balança.

## Do's and Don'ts

### Do:
- **Faça** o número principal de cada região num bloco `--green-800`, em branco Jakarta 800 com tracking negativo, com um acento lima ao lado.
- **Faça** ícones Lucide lineares (traço 1.75, 18px por padrão) dentro de círculos de 34 a 58px: neutro em `--surface-2`, positivo em `--lime-soft` ou `--lime`, pendente em `--orange-soft`.
- **Faça** a seta em círculo como sinal de "abrir": 34 a 38px, acende em lima e gira 45° (ou avança 2px) no hover.
- **Faça** valores contarem até o número novo (720ms, desaceleração forte) e a barra redistribuir os segmentos; com movimento reduzido, troque direto.
- **Faça** todo estado com texto e ícone, além da cor.
- **Faça** a pressão tátil: `scale(.97)` a `.98` em botões e cartões, `.94` em botões redondos, 160ms com `--ease-out`.
- **Faça** hover só para ponteiro fino (`@media (hover: hover) and (pointer: fine)`); no toque, o estado ativo basta.
- **Faça** o marcador lima atrás de no máximo uma expressão por tela, num título Display.

### Don't:
- **Não** use laranja como acento decorativo, cor de pessoa, anel de foco ou destaque de marca; laranja quer dizer pendência.
- **Não** coloque lima como texto ou ícone sobre fundo claro.
- **Não** volte ao fundo creme nem a cartões com borda fina; o fundo é `--bg` e o cartão se separa por sombra.
- **Não** use emoji em parte alguma; personagens são SVG e ícones são Lucide.
- **Não** desenhe nada que lembre banco: cartão com chip ou número, carteira, saldo disponível, comprovante de transferência.
- **Não** use cantos retos nem botões retangulares: superfícies ficam entre `--r-sm` e `--r-xl`, ações são pílula ou círculo.
- **Não** escreva rótulos em maiúsculas espaçadas.
- **Não** coloque um botão verde dentro de um bloco verde escuro.
- **Não** use `--danger` para pendência nem laranja para destruição.
