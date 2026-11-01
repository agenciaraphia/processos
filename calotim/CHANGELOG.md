# Histórico de versões

## 0.9 (1º de novembro de 2026)

### Visual Fintech Modern (só aparência; regras, cálculos e fluxos não mudaram)
- Paleta: verde Calotim como cor escura principal, **lima** de destaque e laranja só para pendências. Fundo cinza-claro frio no lugar do creme.
- Painel inicial em bloco escuro com a palavra em marca-texto lima, botão em pílula com seta em círculo e a ilustração do "motor de divisão" em verde e lima.
- Painel ao vivo com topo em "cartão de saldo" escuro e total grande; no celular vira uma barra escura acima da navegação.
- Botões, buscas, abas e etiquetas em pílula; abas como controle segmentado com indicador deslizante.
- Cards com cantos de 24 a 28px, ícones dentro de círculos, seta em círculo nos cartões de divisão.
- Campos preenchidos com anel de foco lima; total do item e pagamento antecipado em destaque escuro.
- Navegação inferior flutuante no celular, com botão central lima.
- Logotipo com a fatia em lima.

## 0.8 (1º de novembro de 2026)

### Novo visual
- Interface refeita sobre o guia de identidade: creme de fundo, superfícies brancas, verde para ação, laranja para pendências, Plus Jakarta Sans nos títulos e valores, Inter no texto e números tabulares.
- Nenhum emoji ou glifo no lugar de ícone: ícones Lucide embutidos em SVG (licença ISC, veja `LICENSE-lucide.txt`).
- Avatares viraram 16 personagens ilustrados em SVG. Quem tinha emoji salvo vê o personagem equivalente; o valor salvo não é apagado.
- Divisão como **central de comando**: abas Itens, Taxas, Pessoas e Acerto e um **painel de cálculo ao vivo** com a barra de divisão por pessoa. No celular, o painel vira um resumo fixo acima da navegação inferior.
- Valores animados (contadores) e barra de divisão que se redistribui a cada lançamento; o item novo ou editado pisca na lista.
- Painel inicial com a ilustração animada do "motor de divisão" e o resumo em uma frase.
- Busca de divisões e de amigos, contagem de divisões por amigo.
- Paleta de comandos com **Ctrl + K** (ou **Cmd + K**): ações, navegação e divisões em um só lugar.
- Navegação inferior no celular com botão central contextual (nova divisão, adicionar item ou cadastrar amigo). Janelas sobem de baixo como folhas.
- Tipo da divisão, "Quem consumiu?" e modelos de taxa em cartões e chips clicáveis. Em "Por unidade", um contador mostra quantas unidades já foram distribuídas.
- Confirmações em janela própria (no lugar do `confirm()` do navegador) e aviso com barra de tempo para o **Desfazer**, que pausa ao passar o mouse.
- Indicador de salvamento na barra lateral ("Salvo neste navegador" ou aviso de falha).

### Mudou
- Exportar extrato imprime na própria página, sem abrir janela pop-up.
- Movimento reduzido respeitado (animações desligadas quando o sistema pede).

### Segurança
- Content-Security-Policy no `index.html` (somente scripts do próprio site, sem scripts inline) e `_headers` com cabeçalhos para a hospedagem.
- Link compartilhado: tamanho máximo e alfabeto validados antes de decodificar; nomes guardados em `Map`.
- Backup: arquivos acima de 5 MB são recusados antes da leitura.
- Avatares só aceitam a lista fixa de personagens; nenhum valor salvo entra no SVG.

## 0.7 (1º de novembro de 2026)

### Simplificado
- Cotas removidas. Cada amigo é individual ou **casal** (conta como 2 pessoas). Cotas antigas são ajustadas na migração (meia cota vira 1, três ou mais viram 2) e os itens já lançados não mudam.
- Novo item com 3 escolhas em "Quem consumiu?" (Todos, Algumas pessoas, Por unidade) e a opção "Casais pagam o dobro". A categoria passou para "Mais opções".
- Criar divisão em uma única tela, com os participantes logo abaixo.
- Participantes escolhidos em uma **caixa de seleção com os amigos cadastrados** (contador, busca e etiquetas dos escolhidos), com cadastro rápido de novo amigo na mesma tela. Nomes repetidos são recusados.
- Menu ⋯ em cada item, taxa e participante, no lugar de vários botões na mesma linha.
- Valor que falta pagar de cada pessoa aparece sob o nome.
- Cabeçalho da divisão mais limpo, com "Editar divisão" e "Excluir" junto ao título.
- "Situação do pagamento" virou "Quem pagou?".
- A aba "Participantes" virou "Amigos".

### Corrigido
- Janelas tinham duas barras de rolagem, uma dentro da outra. Agora há uma só, com título e botões sempre visíveis, e a página de fundo não rola enquanto a janela está aberta.
- Itens sem participantes na divisão levam à escolha de participantes, em vez de abrir um formulário vazio.

### Testes
- Novo teste de migração de cotas antigas (18 testes de cálculo).
- Testes de navegador verificam que só existe um contêiner de rolagem em cada janela, no desktop e no celular.

## 0.6 (1º de novembro de 2026)

### Novo
- Taxas, couvert e descontos (porcentagem ou valor fixo) com escolha de quem divide.
- Editar e duplicar itens.
- Categorias de despesa, filtro e subtotal por categoria no extrato.
- Extrato individual por participante.
- Importar backup (mesclar ou substituir).
- Botão Desfazer ao excluir item, taxa ou divisão.
- Testes automatizados do cálculo (`npm test`).
- Schema do Supabase atualizado para o B2C, com políticas RLS por dono da conta.

### Corrigido
- Mudar a cota de uma pessoa não recalcula mais itens já lançados (a cota é gravada no item).
- Excluir um item ajusta os pagamentos antecipados ligados a ele e avisa o valor afetado.
- Item pago por alguém cujo cadastro foi excluído deixou de aparecer como "pendente" na lista.
- A tecla Enter no nome do participante adiciona a pessoa em vez de concluir a divisão.
- Falha ao gravar no navegador (armazenamento cheio ou modo privado) agora é avisada.
- Dados salvos inválidos ou incompletos são tratados sem derrubar o aplicativo.
- Valores do link compartilhado passaram a ser normalizados e escapados antes de entrar na página.

### Mudou
- Valores monetários em centavos inteiros (migração automática dos dados em reais).
- O centavo excedente da divisão gira entre as pessoas, em vez de cair sempre na última.
- Backup exportado com data no nome e versão do formato.

## 0.5
Cadastro de pessoas reutilizável, participantes por divisão, fechamento dos modais por X, Cancelar, Esc e clique fora.

## 0.4
Itens por quantidade e preço unitário, distribuição de unidades, pagamento antecipado e saída de participante.
