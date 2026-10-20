# GICEU · Templates para Elementor Pro

Primeiro lote do novo site do GICEU: **cabeçalho, rodapé, página inicial, Sobre nós e Podcast**, em JSON pronto para importar no Elementor Pro.

```
giceu/
├── templates/              ← os arquivos que vão para o WordPress
│   ├── 01-cabecalho.json   (tipo: header)
│   ├── 02-rodape.json      (tipo: footer)
│   ├── 03-pagina-inicial.json
│   ├── 04-sobre-nos.json
│   └── 05-podcast.json
├── preview/                ← prévia em HTML (abra preview/index.html no navegador)
└── build/                  ← gerador em Python (python3 build/build.py recria tudo)
```

## Identidade aplicada

| Token | Cor | Uso |
| --- | --- | --- |
| Azul GICEU | `#7590c1` | cor da marca, fundos de destaque, linhas do mapa |
| Grafite | `#363334` | texto principal, botões, rodapé |
| Papel | `#fdfdfd` | fundo do site |
| Azul profundo | `#4a6699` | texto azul pequeno (o `#7590c1` não tem contraste suficiente em texto miúdo) |
| Azul tinta | `#1b2540` | texto corrido sobre o fundo azul |
| Névoa | `#e8edf6` | seções e superfícies azuladas |

Tipografia (Google Fonts, carregada pelo próprio Elementor):
- **Newsreader**: títulos, serifada editorial com itálico para os destaques
- **Public Sans**: textos e botões, uma sans institucional e neutra
- **IBM Plex Mono**: rótulos pequenos, datas e legendas

**Elemento-assinatura:** as linhas de pesquisa (Linha 1 e Linha 2) aparecem como linhas de um mapa de transporte urbano. Isso vale para o mapa animado do topo da home, para os selos L1/L2/FM, para a linha do tempo da página Sobre nós e para o mapa do site no rodapé, desenhado como uma linha de metrô.

## Como importar

Requisitos: WordPress com **Elementor** e **Elementor Pro** (cabeçalho fixo, menu, posts e Theme Builder dependem do Pro). Recomendo o tema **Hello Elementor**.

1. **Ajustes iniciais (uma vez só)**
   - Elementor → Configurações → Avançado: deixe **Container (Flexbox)** ativo (já é o padrão nas versões atuais).
   - Site Settings → Layout: largura do conteúdo **1200px**.
   - Crie as páginas vazias com estes endereços (slugs): `sobre-nos`, `projetos`, `producoes`, `pesquisadores`, `podcast`, `blog`, `contato`. Os botões já apontam para eles.
   - Aparência → Menus: crie um menu com **Sobre nós, Projetos, Produções, Pesquisadores, Podcast, Blog, Contato**.

2. **Importar os arquivos**
   Templates → Saved Templates → **Import Templates** → envie os 5 arquivos `.json`.

3. **Cabeçalho e rodapé**
   Templates → Theme Builder → abra **GICEU · Cabeçalho** → *Publish* → condição **Entire Site**. Faça o mesmo com **GICEU · Rodapé**.
   No cabeçalho, clique no widget de menu e selecione o menu criado no passo 1.

4. **Páginas**
   Abra a página (ex.: Início) → *Editar com Elementor* → ícone de pasta → aba **My Templates** → insira **GICEU · Página inicial**.
   Em Configurações da página, use o layout **Elementor Full Width** e oculte o título.
   Defina a página inicial em Configurações → Leitura → "Uma página estática".

> ⚠️ Cada template começa com uma faixa listrada **"Estilos e interações GICEU (não remover)"**. Ela só aparece no editor e guarda o CSS e o JavaScript das animações. Se for apagada, o site perde os efeitos.

## Animações e interações

- **Entrada ao rolar:** os blocos sobem 18px e aparecem, em cascata curta (70ms entre itens). Funciona com qualquer widget que tenha a classe `gx-reveal` (Avançado → Classes CSS).
- **Mapa de linhas (home):** os traçados se desenham ao carregar a página e as estações aparecem em sequência. Passar o mouse na legenda destaca uma linha e esmaece as outras.
- **Cabeçalho:** fixo no topo. Ao rolar, ganha fundo translúcido com desfoque e fica mais baixo. O item de menu ativo ganha um ponto azul, como uma estação.
- **Podcast:** onda sonora que "respira" no hero e equalizador na home. Só animam quando estão visíveis na tela.
- **Imprensa:** letreiro contínuo com os veículos, que pausa ao passar o mouse.
- **Botões e cartões:** seta que avança no hover, leve compressão ao clicar e cartões que sobem 4px.
- **Acessibilidade:** quem ativa "reduzir movimento" no sistema vê só transições de opacidade. O foco por teclado fica visível, e o hover só age em dispositivos com mouse. Os contrastes de texto seguem o nível AA.

## O que falta preencher

| Onde | O quê |
| --- | --- |
| Podcast → Sobre o formato | `[XX]` minutos, periodicidade, nomes de quem apresenta |
| Podcast → Onde ouvir | links reais de Spotify, YouTube, Apple Podcasts e Deezer (hoje estão com `#`) |
| Podcast → Episódio em destaque | título, data, duração, descrição e o código de incorporação (cole o `<iframe>` no widget HTML com a área tracejada) |
| Podcast → Todos os episódios | duplique uma linha de episódio para cada novo episódio (Ep. 04 → 01 são modelos) |
| Sobre nós → Coordenação | foto da Sílvia Helena Belmino (widget Imagem) |
| Home → Últimas do blog | o widget de posts já puxa os 3 posts mais recentes. Basta publicar posts com imagem destacada |
| Home → GICEU na mídia | o botão aponta para `/category/giceu-na-midia/`. Crie a categoria com esse slug |
| Cabeçalho | se houver logotipo em imagem, troque o título "GICEU" pelo widget **Site Logo** |

## Editar e regenerar

Textos, cores e tamanhos podem ser editados direto no Elementor, porque todos os widgets são nativos (Título, Editor de Texto, Botão, Menu, Posts, Mapa).
Para mudanças estruturais em lote, edite `build/pages.py` ou `build/styles.py` e rode:

```bash
python3 giceu/build/build.py
```
