=== Mini Salgados Games ===
Contributors: agenciaraphia
Tags: games, campaign, coupons, promotions, elementor
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Campanhas promocionais com roleta, raspadinha e caixa misteriosa, cadastro de participantes e controle de cupons.
Desenvolvido pela Agência Raphia para a Mini Salgados.

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

== Versão 1.0.0 ==
Primeira versão definitiva.

Jogos
- Roleta, raspadinha e caixa misteriosa, com resultado decidido no servidor e revelado automaticamente.
- Roleta com espaços premiados configuráveis: para num espaço premiado quando a pessoa ganha e num espaço sem prêmio quando não ganha.
- Raspadinha mostra o prêmio por baixo da camada prateada; caixa trinca a cada toque e estoura mostrando o prêmio.
- Efeitos sonoros gerados no navegador, com botão para o visitante silenciar e opção por campanha.
- Tela de vitória com cupom em ticket, botão de copiar, confete e link para a loja ou pedido online.
- Contagem regressiva nos jogos em espera; cada jogo tem seu próprio intervalo.

Painel
- Campanhas em cartões, edição completa com prévia ao vivo e seletor da biblioteca de mídia.
- Prêmios com códigos únicos ou código compartilhado (quantidade disponível e limite de resgates por pessoa).
- Participantes com exportação CSV e exclusão em lote; relatórios com totais e progresso da meta.
- Tabelas atualizadas automaticamente pelo WordPress (dbDelta), com reparo de colunas ausentes e mensagens de erro do banco quando uma gravação falha.
