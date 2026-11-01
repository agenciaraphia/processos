# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Pessoa física (B2C, o que existe hoje):** quem organiza a conta de um grupo de amigos, casal, família ou viagem. Está na mesa do restaurante ou bar, ou logo depois, com o celular na mão, lançando itens enquanto a conversa continua. Também abre no computador para revisar uma viagem ou um evento com muitos lançamentos.
- **Quem recebe o extrato:** participantes que abrem um link somente leitura enviado pelo WhatsApp, sem conta e sem instalar nada.
- **Restaurantes (B2B, planejado, não implementado):** estabelecimentos que vão oferecer comanda digital por QR Code. Nenhuma tela B2B existe no MVP 0.7.

## Product Purpose

Calotim organiza contas e divide despesas entre pessoas. O grupo registra produtos e consumos, escolhe quem participou de cada lançamento e vê quanto cabe a cada pessoa, o que ainda está pendente com o estabelecimento e quem deve acertar com quem. Sucesso: a conta fecha sem discussão e cada pessoa entende de onde vem o próprio valor.

## Positioning

Transparência do cálculo: cada valor individual é rastreável até os itens, taxas e regras de rateio que o formaram, em centavos exatos (maior resto, centavo excedente em rodízio). O Calotim calcula e organiza; não movimenta dinheiro.

## Operating Context

- Uso principal no celular, em ambiente de restaurante, bar, viagem ou evento; uso secundário no desktop.
- Fluxo central: criar divisão (nome, tipo, local, participantes) → lançar itens (quantidade, valor unitário, quem consumiu, quem pagou) → taxas e descontos → acerto de contas → extrato em PDF (impressão do navegador) ou link somente leitura.
- Dados ficam no `localStorage` do navegador (chave `calotim_mvp_v2`); backup em JSON exportável e importável.

## Capabilities and Constraints

- Implementado no MVP 0.7: painel, divisões, agenda de amigos (individual ou casal), itens com 3 regras ("Todos", "Algumas pessoas", "Por unidade") e "casais pagam o dobro", taxas e descontos (porcentagem ou fixo), pagamento antecipado, saída e reativação de participante, acerto entre participantes, extrato completo e individual, link compartilhado somente leitura, backup, desfazer.
- Stack: HTML, CSS e JavaScript sem dependências de execução. `js/core.js` é o módulo de cálculo puro, coberto por `npm test`. Não pode ganhar framework nem CDN de script.
- Sem login, sem banco remoto, sem sincronização (Etapa 2 prevista com Supabase).
- Nunca processa pagamento: nada de Pix, cartão, carteira, cobrança ou confirmação de transferência. Textos e telas não podem sugerir o contrário.
- Avatares: personagens ilustrados em SVG (decisão do usuário em 01/11/2026). Dados antigos com emoji são convertidos na exibição, sem apagar o valor salvo.

## Brand Commitments

- Nome **Calotim**, slogan **"Dividir ficou fácil."**
- Guia de identidade visual do Calotim é vinculante: paleta oficial (verde `#245A43`, laranja `#F28B42`, creme `#F8F7F1`, grafite `#29352E`, verde claro `#E6F0E9`, laranja claro `#FFF0E3`, branco), Plus Jakarta Sans para títulos e números de destaque, Inter para texto, ícones Lucide lineares.
- Pedido do usuário (01/11/2026): aparência de produto inovador e tecnológico, fundo claro, verde e laranja, animado e bem interativo. **Nenhum emoji**; somente SVG, ícones e elementos animados.
- Linguagem simples, brasileira, amigável, direta, sem termos bancários nem frases motivacionais.

## Evidence on Hand

- Documentação de produto: `docs/documentacao-plataforma.md`.
- Não há clientes, depoimentos, métricas de uso nem preços. Nada disso pode ser inventado.

## Product Principles

1. Facilidade: começar a lançar itens sem configuração complexa.
2. Transparência: mostrar de onde vem o valor de cada pessoa.
3. Histórico preservado: remover não apaga o passado.
4. Separação entre cálculo e pagamento, dita com clareza sempre que houver valor "pago".

## Accessibility & Inclusion

Estados nunca dependem só de cor (texto e ícone acompanham). Contraste adequado, áreas de toque confortáveis no celular, foco visível, movimento reduzido respeitado.
