=== Mini Salgados Games ===
Contributors: minisalgados
Tags: games, campaign, coupons, promotions, elementor
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.5.0
License: GPLv2 or later

Campanhas promocionais com roleta, raspadinha e caixa misteriosa, cadastro de participantes e controle de cupons.

== Instalação ==
1. Envie o ZIP em Plugins > Adicionar novo > Enviar plugin.
2. Ative o plugin.
3. Abra Mini Salgados Games > Campanhas e clique em Nova campanha.
4. Cadastre os prêmios e os códigos de cupom em Prêmios e cupons.
5. Copie o shortcode da campanha e adicione-o à página WordPress ou ao widget Shortcode do Elementor.

== Shortcode ==
[mini_salgados campanha="slug-da-campanha"]

== Visual ==
No site, cada campanha usa as próprias cores (principal e secundária) e fontes (títulos e textos), escolhidas no painel. O contraste do texto sobre as cores é calculado automaticamente.
O painel administrativo segue a marca Mini Salgados: vermelho #E00025, amarelo #FFCA09 e branco #FDFDFD, com títulos em Fredoka One e textos em Montserrat.
As fontes são carregadas do Google Fonts (quando há conexão externa).

== Aviso de teste ==
Antes de usar com clientes reais, teste em ambiente de staging. A validação sintática não substitui testes funcionais em uma instalação real do WordPress, compatibilidade com o tema, segurança e concorrência de estoque.

== Melhorias 1.5.0 ==
- Roleta: marque no painel quais espaços dão cupom (um ou vários). O sorteio é feito antes do giro e a roleta para num espaço premiado quando a pessoa ganha, e num espaço sem prêmio quando não ganha.
- Resultado automático: a roleta mostra o prêmio ao parar, a raspadinha revela o prêmio por baixo da camada e a caixa trinca a cada toque e estoura mostrando o prêmio. Não há mais botão de revelar.
- Efeitos sonoros gerados no navegador (sem arquivos): roleta girando, raspadinha, caixa trincando e estourando, vitória e derrota. Botão para o visitante silenciar e opção por campanha no painel.
- Cupom compartilhado: "Quantidade disponível" (quantas vezes o código pode ser sorteado) e o novo "Limite de resgates por pessoa", mostrado na tela do prêmio.
- Novas campanhas já vêm com textos e espaços premiados de exemplo na roleta.

== Melhorias 1.4.1 ==
- Corrigido: campanhas não eram salvas em sites cujas tabelas vieram de versões antigas do plugin. O esquema agora usa o formato que o WordPress (dbDelta) consegue atualizar, e o plugin adiciona sozinho as colunas que faltarem.
- Se o banco de dados recusar uma gravação (campanha, edição ou prêmio), o painel mostra o erro em vez de voltar para a lista em silêncio.

== Melhorias 1.4.0 ==
- Novo visual do site: toldo de lanchonete com as cores da campanha, cadastro mais claro, máscara de WhatsApp e menu de jogos ilustrado.
- Roleta em SVG com luzes, rótulos legíveis e ponteiro animado; raspadinha prateada com barra de progresso; caixa de presente com abertura animada.
- Tela de vitória com cupom em formato de ticket, botão de copiar e confete; tela de derrota mostra quando o jogo libera de novo.
- Contagem regressiva nos jogos em espera, que liberam sozinhos quando o intervalo acaba.
- Estilos protegidos contra o tema e o Elementor; respeita "reduzir movimento" do sistema.
- Painel redesenhado com a marca Mini Salgados: abas, cartões de campanha, status com cor, estados vazios e relatórios com totais e barras de progresso.
- Edição completa de campanhas existentes (cores, fontes, logo, textos, datas e rótulos da roleta), com prévia ao vivo e seletor da biblioteca de mídia.
- Formulário de prêmio só permite jogos habilitados na campanha escolhida e mostra os campos de código compartilhado apenas quando necessários.
- Novas fontes: Fredoka One, Fredoka, Baloo 2, Lilita One e Chewy. Padrão de novas campanhas: #E00025 / #FFCA09, Fredoka One e Montserrat.
- Corrigido: os Ajustes rápidos zeravam a Meta de cupons ao salvar.
- Corrigido: fontes de peso único (Anton, Bebas Neue etc.) agora são solicitadas corretamente ao Google Fonts.

== Melhorias 1.3.0 ==
- Corrigido o clique que abria os jogos após o cadastro.
- Roleta animada, raspadinha com interação de arrastar e caixa com abertura por toques.
- Biblioteca de 40 famílias do Google Fonts para texto e títulos, selecionáveis por campanha.
- Seleção e exclusão em lote de leads, com retorno de cupons únicos ao estoque.
- Inicialização do JavaScript compatível com scripts carregados após o DOM.
