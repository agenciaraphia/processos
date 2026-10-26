# Site da Dra. Célia Alcântara · Elementor Pro

Este pacote tem 9 páginas, o cabeçalho e o rodapé, prontos para importar no Elementor Pro. O conteúdo é a copy aprovada, com H1, H2 e dados estruturados (schema) pensados para SEO local em Fortaleza.

## O que tem aqui

| Arquivo | Tipo no Elementor | Onde usar |
|---|---|---|
| `elementor/00-cabecalho.json` | Header (Theme Builder) | Condição: **Todo o site** |
| `elementor/00-rodape.json` | Footer (Theme Builder) | Condição: **Todo o site** |
| `elementor/01-home.json` | Página | Página inicial `/` |
| `elementor/02-artrite-psoriasica.json` | Página | `/artrite-psoriasica/` |
| `elementor/03-espondiloartrites.json` | Página | `/espondiloartrites/` |
| `elementor/04-espondilite-anquilosante.json` | Página | `/espondilite-anquilosante/` |
| `elementor/05-fibromialgia.json` | Página | `/fibromialgia/` |
| `elementor/06-osteoporose.json` | Página | `/osteoporose/` |
| `elementor/07-terapia-imunobiologica.json` | Página | `/terapia-imunobiologica/` |
| `elementor/08-blog.json` | Página | `/blog/` |
| `elementor/09-modelo-post-blog.json` | Single Post (Theme Builder) | Condição: **Posts › Todos** |
| `conteudo/post-artrite-reumatoide.html` | Texto do post de exemplo | Colar no editor do post (modo Código) |
| `conteudo/seo.csv` | Títulos SEO, metas e palavras-chave | Rank Math ou Yoast |
| `preview/*.html` | Prévia estática | Só para conferência visual (não sobe para o WordPress) |

**Tudo já vem dentro de cada JSON:**
- **Visual (CSS):** fica no **CSS personalizado** do container "NÃO APAGAR · estilos e animações do site", no fim de cada página. No cabeçalho e no rodapé, fica no container principal. É um elemento, e não uma configuração da página, porque ao inserir um modelo por "Meus modelos" o Elementor descarta as configurações da página e traz só os elementos.
- **Fontes:** Playfair Display, Poppins e Pinyon Script são carregadas pela tipografia dos próprios widgets.
- **Animações:** ficam no widget HTML "NÃO APAGAR · fontes e animações do site", no fim de cada página.

Cada página funciona sozinha, mesmo antes de publicar o cabeçalho e o rodapé.

## Passo a passo

1. **Tema:** use o Hello Elementor (recomendado).
2. **Ativar containers:** em Elementor › Configurações › **Recursos**, deixe **"Container Flexbox" como Ativo** e salve.
3. **Configurações do site** (Elementor › Configurações do site):
   - **Cores globais:** Primária `#3AA9C8`, Secundária `#1F3363`, Texto `#3A4053`, Destaque `#C29F5F`.
   - **Fontes globais:** Primária e Secundária = Playfair Display; Texto e Destaque = Poppins.
   - **Layout:** largura do container 1240 px.
4. **Importar:** Modelos › Modelos salvos › **Importar modelos** e selecione os 11 JSON.
5. **Cabeçalho e rodapé:** em Modelos › Construtor de temas, publique o Cabeçalho e o Rodapé com a condição **Todo o site**.
6. **Páginas:** crie cada página no WordPress com o slug da tabela acima e clique em "Editar com Elementor". No ícone de pasta, aba **Meus modelos**, insira o modelo correspondente. Em Configurações da página, deixe o **layout como "Elementor largura total"**.
7. **Modelo de post:** publique `09-modelo-post-blog` com a condição **Posts › Todos**. Crie o post "Artrite reumatoide…" com o slug `artrite-reumatoide-fatores-de-risco` e cole o conteúdo de `conteudo/post-artrite-reumatoide.html`.
8. **Leitura:** em Configurações › Leitura, defina a Home como página inicial estática.
9. **Domínio no schema:** os dados estruturados usam `https://www.draceliaalcantara.com.br`. Se o domínio for outro, troque em `build/site.py` (`DOMAIN`), rode `python3 build/site.py` e reimporte. Também dá para editar o widget "SEO · dados estruturados" no fim de cada página.

## Se o WordPress "quebrar" a página

| O que aparece | Causa | Solução |
|---|---|---|
| Página vazia ou "conteúdo não suportado" depois de inserir o modelo | Containers desligados | Elementor › Configurações › Recursos › **Container Flexbox: Ativo** (e **Otimizar carregamento de DOM**, se aparecer). Atualize o Elementor para a versão 3.16 ou mais nova. |
| Textos sem estilo: título azul-claro, botão verde, link rosa | O CSS não carregou: o container "NÃO APAGAR" foi apagado, o Elementor Pro está sem licença ou o arquivo de CSS está em cache | 1) Confira se o container "NÃO APAGAR · estilos e animações do site" está no fim da página (no Navegador do Elementor). 2) Elementor › Ferramentas › **Regenerar arquivos e dados**, e limpe o cache. 3) Se ainda não aparecer, cole `conteudo/css-do-site.css` em Configurações do site › **CSS personalizado**. Essa opção vale para o site todo. |
| Depois de colar o código, as alterações não aparecem | Cache | Elementor › Ferramentas › **Regenerar arquivos e dados**. Limpe também o cache do plugin (LiteSpeed, WP Rocket etc.) e do Cloudflare. |
| Conteúdo some ou fica invisível ao rolar | Plugin de otimização atrasando ou combinando o JavaScript | No WP Rocket, LiteSpeed ou Autoptimize, exclua `__dcaInit` de "Atrasar JS", "Combinar JS" e "Adiar JS". |
| Animações não acontecem (o site aparece estático) | A conta não tem permissão de "HTML não filtrado" e o WordPress removeu o `<script>` (comum em multisite, em algumas hospedagens e com plugins de segurança) | Importe com uma conta de **Administrador** (em multisite, o **Superadministrador**). Mesmo sem o script, o site continua funcionando: menu, menu do celular, cards e WhatsApp foram feitos para funcionar só com CSS. O schema (JSON-LD) também é removido nesse caso, então ative o schema do Rank Math ou do Yoast. |
| Menu duplicado, ou cabeçalho e rodapé do tema aparecendo junto | Cabeçalho e rodapé do tema ainda ativos | Use o tema **Hello Elementor** e publique o Cabeçalho e o Rodapé com a condição **Todo o site**. |
| Página estreita, com barras laterais | Layout da página | Configurações da página (engrenagem) › Layout: **Elementor largura total**. |
| Erro ao importar o JSON | Arquivo aberto e salvo por outro programa, ou envio bloqueado | Baixe o arquivo de novo, sem abrir no Word ou no bloco de notas. Se a hospedagem bloquear o envio, importe pelo **Elementor › Ferramentas › Importar/Exportar kit** ou peça para liberar arquivos `.json`. |

## Onde colocar as fotos

As imagens já estão com o enquadramento certo (arco, círculo ou cantos arredondados). Basta clicar no widget e escolher a foto. No **Navegador** do Elementor, cada foto aparece com o nome `FOTO · alt: …`. Use esse texto no campo **Texto alternativo** da Biblioteca de mídia, porque é ele que o Google lê.

| Página | Foto | Texto alternativo (alt) | Formato ideal |
|---|---|---|---|
| Home · topo | Retrato da Dra. Célia | Dra. Célia Alcântara, médica reumatologista em Fortaleza, em seu consultório | Vertical 4:5, 1200×1500 |
| Home · destaque | Retrato sorrindo | Retrato da Dra. Célia Alcântara sorrindo, reumatologista em Fortaleza | Quadrada, 1000×1000 |
| Home · Sobre | Retrato | Dra. Célia Alcântara, reumatologista, CRM 8280, RQE 4354 | Vertical 4:5 |
| Artrite psoriásica · topo | Mãos com articulações inflamadas | Mãos com articulações dos dedos inflamadas, sinal de artrite psoriásica | Vertical 4:5 |
| Artrite psoriásica · texto | Unhas ou dedo inchado | Unha com alterações e dedo inchado (dactilite) na artrite psoriásica | Horizontal 16:9 |
| Espondiloartrites | Coluna / lombar | Pessoa com dor na região lombar e na pelve, sintoma de espondiloartrite | Vertical 4:5 |
| Espondilite anquilosante | Rigidez na coluna | Pessoa com rigidez na coluna ao acordar, sintoma de espondilite anquilosante | Vertical 4:5 |
| Fibromialgia | Dor difusa | Mulher com dor difusa nos ombros e cansaço, sintomas de fibromialgia | Vertical 4:5 |
| Osteoporose | Vida ativa | Mulher madura caminhando ao ar livre, vida ativa com osteoporose controlada | Vertical 4:5 |
| Terapia imunobiológica | Tratamento | Profissional de saúde preparando medicação imunobiológica | Vertical 4:5 |

Exporte as fotos em **WebP** com até 200 KB. A primeira foto de cada página não deve ter carregamento lento (lazy load).

## SEO aplicado

- **Um H1 por página**, com a palavra-chave no início. Nas especialidades, o H1 traz uma segunda linha menor, "sintomas, diagnóstico e tratamento em Fortaleza", que reforça a busca local sem pesar no visual.
- **Hierarquia limpa:** H2 para cada seção da copy e H3 nos cards e nas perguntas. O logo e os títulos do rodapé não são headings.
- **Dados estruturados (JSON-LD):**
  - Home: `Physician` + `MedicalBusiness` (endereço, telefone, especialidade, telemedicina), `Person` (CRM, RQE, formação), `WebSite` e `FAQPage`.
  - Especialidades: `MedicalWebPage` com `MedicalCondition` (sintomas e tratamentos), `reviewedBy`, `lastReviewed`, `BreadcrumbList` e `FAQPage`.
  - Blog: `Blog` + `BreadcrumbList`.
- **Perguntas frequentes** em cada especialidade e na Home. As respostas usam só informações que já estão na copy.
- **E-E-A-T** (fundamental em saúde): selo "Conteúdo revisado pela Dra. Célia Alcântara, CRM 8280, RQE 4354", data de revisão, caixa da autora no post e aviso "não substitui a consulta".
- **Links internos:** "Leia também", links dentro do texto entre as doenças, breadcrumb e sumário lateral com âncoras.
- **SEO local:** "Fortaleza" no H1, no título e no schema, endereço completo no rodapé e link para o Google Maps.
- **WhatsApp com mensagem pronta por página** (ex.: "Vim pelo site (página Fibromialgia)…"), para a equipe saber de onde veio cada paciente.
- **Títulos e metas:** estão em `conteudo/seo.csv`. Alguns títulos da copy passam de 60 caracteres e o Google corta. A planilha traz versões curtas sugeridas nas duas últimas colunas.
- **Ajuste de copy para SEO:** o H1 do Blog virou "Blog de reumatologia" (antes era só "Blog"). Os títulos das especialidades ganharam a linha "sintomas, diagnóstico e tratamento em Fortaleza".

**Plugin de SEO:** use o Rank Math ou o Yoast para título, meta e sitemap. Desligue no plugin o schema de "Organização/Local" para não duplicar o que já está nas páginas. O schema de Artigo dos posts deve ficar ligado.

## Visual e animações

- **Cores:** fundo `#FDFDFD`, cor principal **`#3AA9C8`** (botões, destaques em itálico, ícones, menu, linhas) e `#1F3363` nos títulos, na faixa de atendimento, na seção Sobre e no rodapé. O dourado `#C29F5F` aparece só nas molduras das fotos e na assinatura. O azul claro nunca é usado como fundo de container.
- **Contraste (acessibilidade):** o texto dos botões teal é azul-marinho (5,4:1), porque branco sobre `#3AA9C8` não passa no teste de leitura (2,7:1). Os itálicos em teal sobre branco usam `#2A93B1`, um pouco mais escuro.
- **Fontes:** Playfair Display nos títulos, com palavras em itálico teal; Poppins nos textos; Pinyon Script só na assinatura "Célia Alcântara" da seção Sobre.
- **Assinatura visual:** a "articulação", uma linha fina com um nó, que se desenha ao rolar. Ela também vira a coluna da linha do tempo da formação, que cresce conforme a leitura.
- **Movimento:** o título do topo entra em sequência ao carregar; textos aparecem com leve desfoque ao rolar; fotos se revelam de baixo para cima; os cards do "Como vou ajudar você?" viram ao passar o mouse ou tocar; o menu some ao descer e volta ao subir; o botão de WhatsApp aparece depois do topo; o sumário lateral acompanha a leitura.
- **Respeita "reduzir movimento"** do sistema (iPhone e Android), e nada fica escondido se o JavaScript falhar.

## Pendências com a Dra. Célia

- [ ] Horário de atendimento (faixa da Home, rodapé)
- [ ] E-mail de contato (rodapé)
- [ ] Link do Instagram (constante `INSTAGRAM` em `build/site.py`, rodapé e Home)
- [ ] 3 a 5 depoimentos com autorização por escrito (Home)
- [ ] Logos e links de matérias "Na mídia" (Home)
- [ ] Fotos (tabela acima)
- [ ] Domínio definitivo (schema)
- [ ] Páginas de Política de privacidade e Termos de uso (o rodapé já aponta para `/politica-de-privacidade/` e `/termos-de-uso/`)
- [ ] Criar as categorias do blog com os slugs `artrite`, `coluna`, `fibromialgia`, `osteoporose`, `tratamentos` (o filtro por tema do Blog aponta para `/categoria/<slug>/`; ajuste a base de categoria em Configurações › Links permanentes para `categoria`)

## Editar e gerar de novo

O conteúdo fica em `build/site.py`, o visual em `assets/dca-global.css` e as interações em `assets/dca-global.js`. Depois de editar:

```bash
python3 build/site.py
```

O comando regera os JSON em `elementor/`, a prévia em `preview/` e o `conteudo/seo.csv`. Ele também recusa CSS com `<` ou `>`: o WordPress converte esses caracteres e quebraria os seletores.

Os textos "Especialidades", "Como vou ajudar você?", "Perguntas frequentes", "Formação", o menu e o rodapé estão em widgets HTML, para ter controle total do visual e das animações. Para editar só um texto, abra o widget no Elementor e altere o texto entre as tags.
