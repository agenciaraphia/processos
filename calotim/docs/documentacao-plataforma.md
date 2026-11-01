# Calotim — Documentação geral da plataforma

**Slogan:** Dividir ficou fácil.  
**Documento de produto e funcionalidades**  
**Versão de referência:** MVP 0.7 (1º de novembro de 2026)

---

## 1. Visão geral

O Calotim é uma plataforma para organizar contas e dividir despesas entre pessoas. A proposta é permitir que um grupo registre produtos, consumos e despesas, defina quem participou de cada lançamento e visualize quanto cabe a cada pessoa.

O produto terá duas frentes complementares:

- **Pessoa física (B2C):** uso individual para organizar contas de restaurantes, bares, viagens, eventos, churrascos e outras despesas compartilhadas.
- **Restaurantes e estabelecimentos (B2B):** ferramenta para disponibilizar uma comanda digital por QR Code. Cada cliente acessa, sem criar uma conta, uma área individual vinculada somente àquela comanda, identifica seu consumo e acompanha a divisão.

O Calotim será, nesta etapa e nas próximas previstas, uma ferramenta de **organização, cálculo e visualização de despesas**. Não terá carteira digital, checkout, cobrança, transferência bancária, processamento de Pix, cartão ou qualquer outro meio de pagamento dentro da plataforma. O sistema poderá indicar valores, saldos e sugestões de acerto, mas a quitação acontecerá fora do Calotim, entre as pessoas ou diretamente com o estabelecimento.

## 2. Princípios do produto

1. **Facilidade:** criar uma divisão e começar a lançar itens sem uma configuração complexa.
2. **Flexibilidade:** permitir diferentes regras de rateio conforme a situação.
3. **Transparência:** mostrar de onde vem o valor de cada pessoa.
4. **Histórico:** preservar pessoas, lançamentos e informações anteriores.
5. **Acesso adequado a cada contexto:** login para a área pessoal B2C; acesso temporário e restrito por QR Code para clientes de restaurantes.
6. **Separação entre cálculo e pagamento:** o Calotim calcula e organiza; não movimenta dinheiro nem confirma transações financeiras.

---

# PARTE I — PESSOA FÍSICA (B2C)

## 3. Objetivo da área B2C

Permitir que uma pessoa crie e gerencie divisões de despesas, convide ou cadastre participantes, registre itens e consulte os valores individuais e os acertos necessários.

A área B2C será uma conta pessoal do usuário. Cada pessoa terá seu próprio espaço, com suas divisões, sua agenda de pessoas e seu histórico.

## 4. Funcionalidades já implementadas no MVP 0.7

> As funcionalidades desta seção existem no protótipo atual. Nesta versão, os dados são armazenados no navegador por meio de `localStorage`; ainda não há login, banco de dados em nuvem ou sincronização entre dispositivos.

### 4.1. Painel inicial

- Visão geral das divisões criadas.
- Quantidade de divisões.
- Quantidade de pessoas cadastradas.
- Total organizado nas divisões.
- Acesso às divisões recentes.
- Navegação para todas as divisões, pessoas cadastradas e configurações.

### 4.2. Criação de uma divisão

O usuário pode criar uma divisão informando:

- Nome da divisão.
- Tipo de atividade:
  - Restaurante ou bar.
  - Viagem.
  - Evento.
  - Outra situação.
- Local, quando aplicável.

Tudo acontece em uma única tela: dados da divisão e, logo abaixo, a escolha de quem vai participar. Os participantes podem ser escolhidos em uma caixa de seleção com os amigos já cadastrados (com busca quando a lista é grande) ou cadastrados na hora. Também é possível criar a divisão sem participantes e adicioná-los depois.

### 4.3. Agenda de pessoas

O Calotim possui uma lista geral de pessoas cadastradas para reutilização em diferentes divisões.

- Cadastrar uma pessoa uma única vez.
- Informar nome e escolher um avatar.
- Escolher amigos já cadastrados em uma caixa de seleção (com contador e busca) ao criar uma divisão ou ao adicionar participantes depois, vendo os escolhidos em etiquetas que podem ser removidas com um toque.
- Adicionar uma pessoa existente a uma divisão em andamento.
- Evitar a criação de cadastros duplicados quando a pessoa já existe na agenda.
- Editar nome e avatar.
- Excluir um cadastro global quando ele não estiver ativo em uma divisão.
- Remover uma pessoa de uma divisão sem apagar seu cadastro geral.

A agenda funciona como um histórico reutilizável de amigos e participantes. No MVP 0.5, ela é local ao navegador. No futuro, ficará vinculada à conta autenticada do usuário e poderá ser acessada em outros dispositivos.

### 4.4. Participantes por divisão

O cadastro geral de uma pessoa é independente de sua participação em cada divisão.

- Uma mesma pessoa pode participar de várias divisões.
- Cada divisão mantém seus próprios participantes.
- Cada pessoa conta como individual (1) ou como casal (2 pessoas). Essa marcação é feita no cadastro do amigo e vale para todas as divisões. Não há cotas intermediárias, como meia cota para crianças.
- É possível editar o nome e o avatar associados ao participante.
- É possível remover alguém da lista ativa de uma divisão.
- A remoção preserva os lançamentos e valores históricos.
- Uma pessoa removida pode ser reativada na divisão.
- Novos lançamentos consideram os participantes ativos, sem alterar os registros anteriores.

### 4.5. Gerenciamento das divisões

- Editar nome, tipo e local.
- Excluir uma divisão mediante confirmação.
- Abrir uma divisão para consultar seus itens, participantes, totais e acertos.
- Retornar à lista de divisões.

### 4.6. Lançamento de produtos e despesas

O usuário pode adicionar itens à divisão, informando:

- Nome ou descrição do item.
- Quantidade total.
- Valor unitário.
- Participantes que consumiram ou devem compartilhar o valor.
- Regra de distribuição.

- Categoria opcional (Alimentação, Bebidas, Hospedagem, Transporte, Combustível, Passeios e ingressos, Compras, Outras).
- Situação do pagamento do item (pendente com o estabelecimento ou pago por um participante).

O total do item é calculado automaticamente pela multiplicação da quantidade pelo valor unitário.

Todos os valores monetários são guardados e calculados em **centavos inteiros**. Os dados salvos por versões anteriores (em reais) são convertidos automaticamente na primeira abertura a partir da versão 0.6.

Cada item pode ser **editado**, **duplicado** e **excluído**. A exclusão pede confirmação, avisa quando há pagamento antecipado ligado ao item e oferece o botão **Desfazer**. Ao editar um item, o abatimento de pagamentos antecipados é ajustado para nunca ficar maior que a parte atual da pessoa. Quando existem categorias, a lista de itens pode ser filtrada por categoria.

### 4.7. Regras de rateio disponíveis

O MVP contempla diferentes formas de dividir um lançamento:

- **Por unidades consumidas:** o usuário informa quantas unidades cada pessoa consumiu. A soma das unidades atribuídas deve corresponder à quantidade total do item.
- **Igual entre pessoas selecionadas:** divide o valor igualmente entre as pessoas escolhidas.
- **Casais pagam o dobro:** opção que aparece quando há um casal na divisão. Cada casal conta como 2 pessoas e as demais contam como 1.
- **Igual entre todos:** divide o valor entre todos os participantes ativos da divisão.

O modo por unidades aceita quantidades fracionadas, quando necessário.

**Casal e histórico.** Quando "casais pagam o dobro" está ativo, o peso de cada pessoa (1 ou 2) é gravado no próprio item no momento do lançamento. Marcar ou desmarcar um amigo como casal depois vale apenas para os próximos itens e não recalcula o que já foi lançado.

**Como o item pergunta "quem consumiu?".** A tela tem apenas três escolhas: **Todos** (divide igualmente), **Algumas pessoas** (escolha quem) e **Por unidade** (cada pessoa informa quantas unidades consumiu). Para Todos e Algumas pessoas, a caixa "casais pagam o dobro" define se os casais contam em dobro.

**Arredondamento.** A divisão usa o método do maior resto, em centavos inteiros, e a soma das partes é sempre idêntica ao valor do item. O centavo excedente gira entre os participantes de item para item, em vez de cair sempre na mesma pessoa.

### 4.8. Registro da situação dos itens e cálculo dos acertos

O sistema permite indicar se um item ainda está pendente no estabelecimento ou se foi pago integralmente por um participante. Essa informação serve para organizar os cálculos, não para executar uma transação.

- Identificar itens e taxas ainda pendentes com o estabelecimento.
- Identificar quem informou ter pago determinado item.
- Calcular quanto do consumo cabe a cada participante.
- Calcular créditos e saldos entre participantes quando alguém pagou um item compartilhado.
- Gerar uma sugestão de transferências para equilibrar os saldos.
- Distinguir valores pendentes com o estabelecimento de acertos entre participantes.

**Importante:** registrar um item como pago ou visualizar uma sugestão de acerto não comprova que o dinheiro foi transferido. O Calotim não realiza nem confirma pagamentos.

### 4.9. Pagamento antecipado e saída de participante

O MVP possui um recurso de registro de valor antecipado referente a itens que ainda estavam pendentes no estabelecimento.

- Consultar o valor acumulado de uma pessoa nos itens pendentes existentes.
- Informar o valor que a pessoa entregou ao estabelecimento.
- Alocar esse valor aos itens e às taxas pendentes existentes no momento do registro (os mais antigos primeiro).
- Opcionalmente, retirar a pessoa dos próximos rateios.
- Preservar seu consumo e histórico anteriores.
- Manter a pessoa disponível no histórico da divisão.

Esse recurso é um **registro informativo para o cálculo da conta**, não um processamento financeiro. Ele não recebe dinheiro, não inicia Pix e não substitui a conferência do estabelecimento.

### 4.10. Resumo e extrato da divisão

O painel da divisão apresenta:

- Total geral dos itens.
- Valores atribuídos a cada participante.
- Valores ainda pendentes com o estabelecimento.
- Valores registrados como pagos.
- Situação individual dos participantes.
- Sugestões de acerto entre participantes.
- Relação dos itens e suas respectivas divisões.

O extrato detalha os produtos, quantidades, valores unitários, valores totais, participantes e parcelas individuais.

### 4.11. Exportação e compartilhamento

- Exportar o extrato pela impressão do navegador, com opção de salvar como PDF.
- Exportar um **extrato individual** de cada participante, com os lançamentos dele, taxas, valor pendente e acertos em que está envolvido.
- O extrato completo inclui taxas e descontos, subtotal por categoria e o resumo por participante (itens, taxas, parte total e valor pendente).
- Gerar um link de consulta do extrato.
- A visualização compartilhada é somente leitura.
- O link inclui os dados da divisão codificados na própria URL.

O link tem limite de cerca de 18 mil caracteres. Links gerados por versões anteriores continuam abrindo. O compartilhamento atual é uma solução inicial. Como os dados estão no link, qualquer pessoa que o receber poderá visualizar as informações incluídas. Links curtos, revogáveis, com controle de acesso e sincronizados em nuvem ficam para uma etapa posterior.

### 4.12. Backup e configurações

- Exportar os dados locais em arquivo JSON (com data no nome do arquivo).
- **Importar um backup**, com a escolha entre mesclar com os dados atuais (não apaga nada e ignora o que já existe) ou substituir tudo. Backups de versões anteriores também são aceitos.
- Apagar os dados armazenados no navegador, com confirmação.
- Exibir aviso sobre o armazenamento local e a necessidade de manter backups.
- Avisar quando o navegador não consegue gravar os dados (armazenamento cheio ou modo privado), em vez de falhar em silêncio.

### 4.13. Comportamento dos modais

- Fechar pelo botão X.
- Fechar pelo botão Cancelar.
- Fechar pela tecla Esc.
- Fechar clicando fora da janela, quando aplicável.
- Fechar sem exigir que os campos estejam preenchidos.

### 4.14. Taxas, couvert e descontos

- Modelos prontos: taxa de serviço (10%), couvert artístico, taxa de reserva, desconto geral e cortesia.
- Tipo acréscimo ou desconto, calculado por **porcentagem** ou por **valor fixo**.
- Porcentagem incide somente sobre os itens de cada pessoa, nunca sobre outras taxas (sem taxa sobre taxa).
- Valor fixo é dividido igualmente entre as pessoas selecionadas.
- Escolha de quais participantes dividem cada taxa. A escolha é gravada na taxa, então quem entrar depois não altera uma taxa antiga.
- Situação do pagamento igual à dos itens (pendente ou pago por um participante).
- Entram no valor total, na parte de cada pessoa, no pagamento antecipado e no acerto entre participantes.
- Editar e excluir (com confirmação e desfazer).

### 4.15. Desfazer

Excluir um item, uma taxa ou uma divisão inteira exibe o botão **Desfazer** por alguns segundos.

### 4.16. Usabilidade (MVP 0.7)

- Cada janela tem **uma única rolagem**: o título e os botões Cancelar e Salvar ficam sempre visíveis e só o conteúdo rola.
- Cada linha de item, taxa ou participante tem um menu **⋯** com as ações (editar, duplicar, excluir, extrato individual, pagamento antecipado), em vez de vários botões lado a lado.
- O valor que falta pagar de cada participante aparece sob o nome, em destaque.
- Quem vai lançar um item sem ter participantes é levado direto à escolha de participantes.
- "Editar divisão" e "Excluir" ficam junto ao título, e o botão principal da tela é **Adicionar item**.
- A pergunta "Quem pagou?" substitui "Situação do pagamento".

### 4.17. Tela de participantes da divisão

Cada participante mostra a parte calculada (itens mais taxas), o valor pendente, o botão de pagamento antecipado, o extrato individual, a edição e a remoção. Quem foi removido continua listado como histórico e pode ser reativado.

---

## 5. Funcionalidades B2C previstas para etapas futuras

Esta seção é planejamento de produto. Os itens abaixo não devem ser considerados implementados até serem desenvolvidos e testados.

### 5.1. Cadastro e login por e-mail e senha

A área pessoal B2C deverá ter autenticação própria.

- Criar conta com e-mail e senha.
- Entrar com e-mail e senha.
- Recuperar ou redefinir senha.
- Confirmar e-mail, se adotado pelo fluxo de autenticação.
- Encerrar sessão.
- Manter os dados associados à conta autenticada.
- Impedir que um usuário acesse divisões privadas de outra pessoa sem autorização.

O login será necessário para a pessoa física acessar seu espaço pessoal, suas divisões e sua agenda de pessoas em diferentes dispositivos.

**O login B2C não será exigido de clientes que acessarem uma comanda de restaurante por QR Code.** Esse é um fluxo diferente, descrito na Parte II.

### 5.2. Sincronização e histórico na nuvem

- Salvar divisões, pessoas e lançamentos em banco de dados.
- Sincronizar as informações entre celular, tablet e computador.
- Manter histórico de divisões encerradas.
- Recuperar os dados ao entrar novamente na conta.
- Implementar controle de acesso para que cada usuário veja apenas os dados permitidos.

### 5.3. Mais opções de rateio

Já implementado: casal como 2 pessoas (sem cotas intermediárias), edição e duplicação de itens, peso gravado por item para preservar o histórico.

Ainda previsto:

- Grupos personalizados, como família ou equipe, que dividem uma parte única.
- Rateios combinados e percentuais personalizados por item.
- Histórico de alterações de itens (quem mudou o quê e quando).

### 5.4. Taxas, descontos e ajustes

Já implementado: taxa de serviço, couvert, taxa de reserva, descontos e cortesias, em porcentagem ou valor fixo, com escolha dos participantes.

Ainda previsto:

- Desconto aplicado a um item específico.
- Escolha da base de cálculo de uma taxa percentual (por exemplo, apenas bebidas).

### 5.5. Viagens e despesas compartilhadas

Já implementado: categorias de despesa, filtro por categoria e subtotal por categoria no extrato.

Ainda previsto:

- Filtros por período, responsável pelo lançamento e participante.
- Registro de quem lançou cada despesa, quando houver mais de uma pessoa usando a mesma divisão.

### 5.6. Relatórios e extratos aprimorados

Já implementado: extrato completo e extrato individual por participante, ambos exportáveis em PDF pela impressão do navegador.

Ainda previsto:

- Exportação em imagem.
- Compartilhamento com permissões configuráveis e links curtos revogáveis.
- Histórico de alterações.
- Filtros por pessoa, categoria e período.

---

# PARTE II — RESTAURANTES E ESTABELECIMENTOS (B2B)

## 6. Objetivo da área B2B

Oferecer a restaurantes, bares e outros estabelecimentos uma ferramenta complementar ao sistema de ponto de venda (PDV), permitindo que uma comanda seja acessada por QR Code e que os clientes organizem individualmente o que consumiram.

O Calotim não pretende substituir o PDV, o caixa ou o sistema de gestão do estabelecimento. A proposta é atuar na camada de experiência e divisão da conta.

## 7. Fluxo principal de uso por QR Code

O fluxo planejado é:

1. O restaurante abre uma comanda no seu sistema ou no painel do Calotim.
2. O Calotim associa à comanda um QR Code exclusivo.
3. O QR Code é disponibilizado na mesa ou em outro ponto de acesso.
4. O cliente escaneia o código com a câmera do celular.
5. O navegador abre diretamente a área daquela comanda, sem exigir cadastro ou login.
6. O cliente informa como deseja ser identificado, por exemplo, nome e avatar.
7. O cliente visualiza os itens daquela comanda e marca o que consumiu ou a quantidade que consumiu.
8. O sistema calcula a parcela individual e atualiza a divisão colaborativa.
9. O cliente acompanha seu consumo e o resumo da conta enquanto a comanda estiver disponível.
10. O restaurante acompanha a divisão no painel administrativo.

O QR Code deve levar diretamente ao contexto da comanda. O cliente não precisa instalar aplicativo, criar conta ou informar e-mail e senha.

## 8. Acesso individual sem login no restaurante

O acesso por QR Code terá uma lógica diferente do login da pessoa física.

- Cada QR Code será associado a uma comanda específica.
- Ao escanear, o cliente entra somente na experiência daquela comanda.
- O cliente não terá acesso à conta administrativa do restaurante.
- O cliente não terá acesso a outras mesas ou comandas.
- O cliente não terá acesso à área pessoal B2C de outros usuários.
- A sessão do cliente ficará vinculada àquela comanda e à sua identificação dentro dela.
- O cliente poderá consultar e editar somente as informações individuais que forem permitidas pelo fluxo da comanda.
- O acesso deverá expirar ou ser encerrado quando a comanda for fechada, cancelada ou invalidada, conforme a regra definida pelo estabelecimento.

O QR Code não deve ser tratado como uma senha administrativa. Ele funciona como uma chave de acesso limitada ao contexto de uma comanda.

### 8.1. Cuidados de segurança previstos

- Gerar tokens aleatórios e difíceis de adivinhar para os QR Codes.
- Não usar números sequenciais simples como única proteção.
- Validar no servidor se o token está ativo e a qual comanda pertence.
- Restringir toda consulta e alteração ao identificador daquela comanda e à sessão individual.
- Não confiar apenas em filtros aplicados na interface do navegador.
- Impedir que um cliente altere os dados originais de produtos, preços ou taxas definidos pelo restaurante.
- Permitir que o cliente altere somente sua identificação e suas seleções de consumo, conforme as permissões da sessão.
- Encerrar ou invalidar o acesso após o fechamento da comanda.
- Registrar alterações relevantes para auditoria.

## 9. Painel do restaurante

O estabelecimento terá uma área administrativa própria, com login e permissões de funcionários.

### 9.1. Cadastro do estabelecimento

- Nome fantasia.
- Dados básicos do estabelecimento.
- Endereço e informações de contato.
- Configurações de operação.
- Identificação de unidades ou filiais, caso necessário.

### 9.2. Gestão de mesas e comandas

- Criar e visualizar mesas.
- Abrir, acompanhar e encerrar comandas.
- Gerar QR Code exclusivo para cada comanda.
- Reimprimir ou exibir o QR Code.
- Invalidar QR Codes quando necessário.
- Consultar o estado da comanda.
- Visualizar participantes conectados à comanda.
- Consultar a divisão individual e geral.

### 9.3. Produtos, itens e preços

- Cadastrar ou importar produtos.
- Informar descrição, preço e quantidade.
- Adicionar itens à comanda.
- Atualizar itens e quantidades.
- Configurar taxas e descontos.
- Preservar a comanda original como referência para os cálculos.

O restaurante será responsável pelos dados oficiais da comanda. Os clientes não poderão alterar os preços ou o cadastro-base dos produtos.

### 9.4. Painel de acompanhamento em tempo real

- Visualizar os clientes conectados à comanda.
- Acompanhar quais itens foram atribuídos a cada cliente.
- Identificar itens ainda não atribuídos.
- Ver o total geral e os totais individuais.
- Atualizar a divisão à medida que os clientes registram o consumo.
- Consultar a situação de cada mesa e comanda.

A atualização em tempo real dependerá da integração com banco de dados e tecnologia de sincronização.

### 9.5. Importação de comandas

Funcionalidades futuras possíveis:

- Importar arquivos CSV ou Excel.
- Importar dados exportados pelo PDV.
- Ler foto ou PDF de uma comanda usando OCR ou IA.
- Apresentar os itens identificados para conferência humana antes de publicar a comanda.
- Integrar com PDVs por API, quando houver compatibilidade técnica e autorização dos fornecedores.

A leitura automática nunca deverá publicar preços ou itens sem uma etapa de conferência pelo estabelecimento.

### 9.6. Funcionários e permissões

- Cadastrar funcionários.
- Definir perfis de acesso.
- Restringir ações administrativas conforme a função.
- Registrar quem abriu, editou ou encerrou uma comanda.
- Separar permissões de administrador, gerente e atendente, conforme a necessidade do produto.

### 9.7. Relatórios do estabelecimento

- Volume de comandas organizadas.
- Quantidade de mesas utilizadas.
- Itens mais lançados.
- Tempo de utilização das comandas.
- Histórico por período.
- Relatórios operacionais e indicadores de uso.

Os relatórios devem respeitar as permissões e a política de privacidade do estabelecimento.

---

## 10. Modelo de acesso: B2C e B2B

| Contexto | Como entra | O que acessa |
|---|---|---|
| Pessoa física | Cadastro e login com e-mail e senha | Sua conta, suas divisões, agenda de pessoas e histórico |
| Cliente de restaurante | QR Code da comanda, sem login | Apenas sua área individual dentro daquela comanda |
| Funcionário do restaurante | Login próprio, com permissões | Painel e comandas autorizadas do estabelecimento |
| Administrador do restaurante | Login próprio com perfil administrativo | Configurações, funcionários, mesas, comandas e relatórios autorizados |

A autenticação B2C e o acesso temporário por QR Code são mecanismos independentes. Um cliente que escaneia o QR Code não deve ser obrigado a criar uma conta pessoal no Calotim.

---

# PARTE III — REGRAS FINANCEIRAS E LIMITES DO PRODUTO

## 11. O que o Calotim faz

- Organiza itens e despesas.
- Registra quantidades e consumo por pessoa.
- Calcula rateios.
- Apresenta valores individuais e totais.
- Mostra valores pendentes informados pelos usuários.
- Calcula saldos e sugere acertos entre participantes.
- Gera extratos e relatórios.

## 12. O que o Calotim não fará nesta etapa

Não faz parte do escopo atual ou da evolução imediata:

- Receber dinheiro de clientes.
- Processar Pix.
- Processar cartões de crédito ou débito.
- Criar carteira digital.
- Manter saldo financeiro dos usuários.
- Fazer transferências entre participantes.
- Cobrar automaticamente valores em aberto.
- Dividir ou liquidar pagamentos bancários.
- Confirmar que uma transferência externa foi concluída.
- Substituir o caixa, o PDV ou o sistema financeiro do restaurante.

Qualquer pagamento realizado pelos clientes continuará acontecendo diretamente pelos meios já utilizados pelo grupo ou pelo estabelecimento. O Calotim apenas organiza as informações necessárias para facilitar esse acerto.

---

# PARTE IV — TECNOLOGIA, DADOS E EVOLUÇÃO

## 13. Estado técnico atual

O MVP 0.7 é uma aplicação web independente, construída com:

- HTML, CSS e JavaScript sem dependências de execução.
- `js/core.js`, módulo de cálculo puro (sem acesso à tela), em centavos inteiros. É compartilhado entre o navegador e os testes.
- `js/app.js`, a interface.
- `localStorage` para persistência local (chave `calotim_mvp_v2`). A chave antiga (`calotim_mvp_v1`) é lida e convertida, e nunca apagada.
- Testes automatizados (`npm test`, usa apenas o Node.js) cobrindo rateio, taxas, descontos, pagamentos antecipados, acertos, migração e importação, incluindo um teste com milhares de cenários aleatórios.
- `supabase/schema.sql`, estrutura para o Supabase alinhada ao MVP 0.7. A parte B2C inclui as políticas de acesso (RLS) por dono da conta, e o isolamento entre usuários foi verificado em um Postgres de teste. A parte B2B ainda não tem políticas.

O projeto pode ser aberto localmente pelo arquivo `index.html`. A publicação em hospedagem web será necessária para disponibilizar o acesso por link a outras pessoas.

### Limitações atuais

- Não existe autenticação de usuário.
- Não existe banco de dados remoto ativo (o esquema SQL ainda não está conectado ao aplicativo).
- Não existe sincronização entre dispositivos.
- Não existe colaboração em tempo real entre diferentes celulares.
- A agenda de pessoas só é reutilizável no mesmo navegador ou dispositivo.
- O link compartilhado do extrato contém os dados no próprio endereço (no fragmento da URL, que não é enviado ao servidor, mas fica no histórico do navegador e nas conversas onde o link for colado).
- As fontes são carregadas do Google Fonts, então a primeira abertura sem internet usa fontes de reserva.
- Não existe painel B2B funcional para restaurantes.
- Não existe geração e gestão de QR Codes de comandas na versão atual.

## 14. Arquitetura futura sugerida

### 14.1. Front-end

Manter a aplicação web responsiva, com foco em celular, para funcionar tanto na área B2C quanto na experiência de QR Code dos restaurantes.

### 14.2. Banco de dados e serviços

O Supabase é uma opção prevista para:

- Banco de dados PostgreSQL.
- Autenticação da área B2C.
- Autenticação de funcionários e administradores B2B.
- Regras de acesso aos dados (RLS).
- Atualizações em tempo real.
- Armazenamento de arquivos, se necessário.

A integração deverá ser implementada com políticas de segurança e testes de isolamento antes de armazenar dados reais.

### 14.3. Hospedagem

Cloudflare Pages ou serviço equivalente poderá hospedar a aplicação web. A escolha final deve considerar limites de uso, custos, domínio, desempenho e requisitos de segurança.

### 14.4. Separação dos dados

A arquitetura deverá separar, no mínimo:

- Contas de usuários B2C.
- Pessoas cadastradas na agenda de cada usuário.
- Divisões pessoais.
- Participantes vinculados a cada divisão.
- Itens e rateios.
- Estabelecimentos.
- Funcionários e permissões.
- Mesas e comandas.
- Sessões individuais de clientes abertas por QR Code.
- Seleções de consumo feitas por cada cliente.

A separação entre estabelecimentos e usuários deverá ser garantida no banco de dados, e não apenas pela interface.

## 15. Etapas sugeridas de desenvolvimento

A ordem abaixo é uma proposta de organização, não uma declaração de que os recursos já existem.

### Etapa 1 (concluída no MVP 0.7) Consolidar o B2C atual
- Fluxos de criação e edição revisados, com edição, duplicação e desfazer.
- Cálculos de rateio em centavos, cobertos por testes automatizados.
- Agenda de pessoas e histórico validados, com o peso de cada pessoa gravado por item.
- Taxas, couvert e descontos, extrato individual e importação de backup.
- Inconsistências encontradas na revisão corrigidas.

### Etapa 2 (próxima) Login e persistência B2C
- Criar cadastro e login por e-mail e senha.
- Conectar o Supabase (o esquema e as políticas RLS da parte B2C já estão prontos em `supabase/schema.sql`).
- Migrar os dados da experiência local para a conta do usuário, com fluxo de migração e prevenção de perda.
- Sincronizar divisões e agenda entre dispositivos.
- Implementar recuperação de senha e regras de acesso.

### Etapa 3 — Base B2B
- Criar cadastro de estabelecimentos.
- Criar usuários administrativos e funcionários.
- Implementar mesas e comandas.
- Definir permissões e isolamento dos dados por estabelecimento.

### Etapa 4 — QR Code e painel individual
- Gerar QR Code exclusivo por comanda.
- Criar acesso sem login e restrito àquela comanda.
- Permitir identificação por nome e avatar.
- Criar a seleção individual dos itens consumidos.
- Implementar sincronização em tempo real.
- Encerrar sessões quando a comanda for fechada ou invalidada.

### Etapa 5 — Operação e integrações
- Importar comandas por CSV/Excel.
- Avaliar leitura de fotos e PDFs com conferência humana.
- Avaliar integrações com PDVs.
- Desenvolver relatórios operacionais.
- Testar segurança, desempenho e experiência em situações reais.

---

## 16. Privacidade e segurança

A plataforma deverá adotar os seguintes princípios:

- Coletar apenas os dados necessários para cada funcionalidade.
- Não expor dados de uma conta B2C a outra.
- Não permitir que clientes de uma comanda consultem outras comandas.
- Não permitir que um estabelecimento consulte dados privados de outro estabelecimento.
- Aplicar regras de acesso no banco de dados.
- Proteger tokens de QR Code e sessões individuais.
- Permitir encerramento e invalidação de acessos.
- Registrar alterações administrativas importantes.
- Definir política de retenção e exclusão de dados.
- Preparar avisos de privacidade e adequação à LGPD antes do lançamento público.

---

## 17. Modelo de negócio previsto

- **B2C:** acesso gratuito para pessoas físicas, sujeito à definição futura de custos e limites sustentáveis.
- **B2B:** planos de assinatura para restaurantes e estabelecimentos, com recursos definidos conforme o porte e a necessidade operacional.

Os valores, limites de comandas, número de mesas, funcionários e funcionalidades de cada plano ainda precisam ser validados. Não há preços comerciais definidos neste documento.

---

## 18. Glossário

- **Divisão:** espaço criado por uma pessoa física para organizar uma conta, viagem ou evento.
- **Pessoa cadastrada:** contato salvo na agenda pessoal para reutilização em diferentes divisões.
- **Participante:** pessoa vinculada a uma divisão específica.
- **Casal:** amigo cadastrado que conta como 2 pessoas quando a opção "casais pagam o dobro" está ativa.
- **Amigo cadastrado:** pessoa salva na agenda, que pode ser escolhida em qualquer divisão por uma caixa de seleção com busca.
- **Item:** produto ou despesa lançada em uma divisão ou comanda.
- **Rateio:** regra utilizada para distribuir o valor de um item entre participantes.
- **Comanda:** conjunto de itens associados a uma mesa ou atendimento de um estabelecimento.
- **QR Code da comanda:** código que permite ao cliente abrir a experiência individual vinculada àquela comanda.
- **Sessão individual:** acesso temporário do cliente à sua área dentro de uma comanda, sem login B2C.
- **PDV:** sistema de ponto de venda utilizado pelo estabelecimento.
- **Taxa:** acréscimo à conta, como serviço, couvert ou reserva, em porcentagem ou valor fixo.
- **Desconto:** redução da conta, em porcentagem ou valor fixo, incluindo cortesias.
- **Pagamento antecipado:** registro informativo de valor que uma pessoa entregou ao estabelecimento antes do fechamento da conta.

---

## 19. Resumo do escopo

O Calotim será uma plataforma de divisão e organização de contas com dois ambientes:

1. **Pessoa física:** cada usuário cria sua conta com e-mail e senha, mantém sua agenda de amigos e organiza divisões e despesas.
2. **Restaurante:** o estabelecimento administra mesas e comandas. O cliente escaneia um QR Code e acessa, sem login, somente sua área individual daquela comanda.

Em ambos os ambientes, o Calotim calcula, organiza e apresenta os valores. **A plataforma não processa pagamentos nem movimenta dinheiro.**

---

# APÊNDICE A. Inventário das funções do MVP 0.7

Lista completa do que o aplicativo faz hoje, por área.

## A.1. Telas e navegação
1. Visão geral com quantidade de divisões, pessoas cadastradas e total organizado.
2. Minhas divisões (lista de cartões).
3. Participantes (agenda de pessoas).
4. Detalhe da divisão (itens, taxas, participantes, acerto de contas).
5. Configurações (backup e limpeza de dados).
6. Extrato compartilhado, somente leitura, aberto por link.

## A.2. Divisões
7. Criar divisão (nome, tipo e local), em duas etapas.
8. Editar divisão.
9. Excluir divisão, com confirmação e desfazer.
10. Abrir divisão e voltar à lista.

## A.3. Pessoas
11. Cadastrar amigo (nome, avatar e se é um casal). Nomes repetidos são recusados para evitar cadastros duplicados.
12. Editar nome e avatar.
13. Excluir cadastro (somente se não estiver ativo em alguma divisão). O nome é preservado nas divisões antigas.
14. Reutilizar pessoas já cadastradas ao criar uma divisão ou ao adicionar alguém a uma divisão em andamento, sem duplicar cadastros.
15. Adicionar várias pessoas seguidas na criação da divisão (a tecla Enter adiciona a pessoa, sem concluir a tela).
16. Marcar ou desmarcar um amigo como casal ao editar o cadastro.
17. Remover participante da divisão, preservando o histórico.
18. Reativar participante removido.

## A.4. Itens
19. Adicionar item (descrição, categoria, quantidade, valor unitário).
20. Prévia do total do item enquanto digita.
21. Três escolhas em "Quem consumiu?" (Todos, Algumas pessoas, Por unidade) e a opção "Casais pagam o dobro".
22. Registrar se o item está pendente ou foi pago por um participante.
23. Editar item.
24. Duplicar item.
25. Excluir item, com confirmação, aviso de pagamento antecipado e desfazer.
26. Filtrar itens por categoria.

## A.5. Taxas e descontos
27. Adicionar taxa ou desconto a partir de modelos (serviço, couvert, reserva, desconto, cortesia) ou personalizado.
28. Porcentagem sobre os itens ou valor fixo.
29. Escolher quem divide cada taxa.
30. Registrar se a taxa está pendente ou foi paga por um participante.
31. Editar e excluir taxa (com confirmação e desfazer).

## A.6. Cálculos e acertos
32. Valor total (itens mais taxas e descontos), valor ainda a pagar e valor já pago.
33. Parte de cada participante (itens, taxas e total).
34. Valores pendentes com o estabelecimento, por pessoa.
35. Sugestão de acerto entre participantes, em valores exatos.
36. Pagamento antecipado de um participante, com opção de retirá-lo dos próximos rateios.
37. Ajuste automático dos pagamentos antecipados quando um item ou taxa é editado.

## A.7. Extratos e compartilhamento
38. Extrato completo exportável em PDF (impressão do navegador).
39. Extrato individual por participante.
40. Link de consulta somente leitura (compatível com links antigos).

## A.8. Dados
41. Salvamento automático no navegador, com aviso se o armazenamento falhar.
42. Conversão automática dos dados da versão anterior (reais para centavos), sem apagar os dados antigos.
43. Exportar backup em JSON.
44. Importar backup (mesclar ou substituir).
45. Apagar todos os dados do navegador.
46. Janelas fecham por X, Cancelar, Esc ou clique fora, sem exigir campos preenchidos.

## A.9. Funções do módulo de cálculo (`js/core.js`)

| Função | O que faz |
|---|---|
| `parseCents`, `formatMoney`, `formatQuantity`, `lineAmount` | Conversão e formatação de valores em centavos |
| `distribute` | Divisão em centavos pelo método do maior resto, com rodízio do centavo excedente |
| `allocateItem` | Parte de cada pessoa em um item |
| `allocateFee` | Parte de cada pessoa em uma taxa ou desconto |
| `buildLines`, `calc` | Linhas de cobrança e totais, saldos, pendências e pagamentos |
| `suggestSettlements`, `settlements` | Sugestão de acertos entre participantes |
| `outstandingFor`, `planPrepayment`, `registerPrepayment` | Pagamento antecipado |
| `removeLine`, `reconcilePrepayments` | Exclusão de lançamentos e ajuste de pagamentos antecipados |
| `buildItem`, `buildFee` | Validação e criação de itens e taxas |
| `normalizeState`, `normalizeAccount`, `mergeStates` | Migração, limpeza de dados e importação de backup |

# APÊNDICE B. Fora do escopo do MVP 0.7

Itens que dependem de decisões ou de infraestrutura e não foram implementados. Todos já constam na seção 15.

- Cadastro, login e sincronização na nuvem (Etapa 2, depende de um projeto Supabase e das chaves públicas).
- Toda a área B2B: estabelecimentos, mesas, comandas, QR Code, sessões sem login e painel em tempo real (Etapas 3 a 5).
- Links curtos e revogáveis para extratos.
