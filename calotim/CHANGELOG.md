# Histórico de versões

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
